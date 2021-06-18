import Vue from 'vue';
import VuePapaParse from 'vue-papa-parse';
import VueMatomo from 'vue-matomo';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify/lib';
import { Touch } from 'vuetify/lib/directives';
import { Settings } from 'luxon';
import VueCountdown from '@chenfengyuan/vue-countdown';

import browserDetect from 'vue-browser-detect-plugin';
import marked from 'marked';
import L from 'leaflet';
import App from './App.vue';
import Dashboard from './views/Dashboard.vue';
import Privacy from './views/Privacy.vue';
import PageNotFound from './views/PageNotFound.vue';
import Challenges from './views/Challenges.vue';
import Terms from './views/Terms.vue';
import EmbedIframe from './views/EmbedIframe.vue';
import store from './store';
import charts from './plugins/charts'; // eslint-disable-line no-unused-vars

// Set UTC as default time zone behavior for whole client
Settings.defaultZoneName = 'utc';

// Stop webpack - CSS url incompatibility
// (deletion is enough here since we don't use the default marker anyway)
delete L.Icon.Default.prototype._getIconUrl;

Vue.component(VueCountdown.name, VueCountdown);

Vue.config.productionTip = false;

Vue.use(VuePapaParse);

Vue.use(VueMatomo, {
  // Config options explained on https://github.com/AmazingDreams/vue-matomo
  host: 'https://nix.eox.at/piwik',
  siteId: 11,
  trackerFileName: 'piwik',
  enableLinkTracking: true,
  requireConsent: true,
  trackInitialView: true,
  disableCookies: false,
  enableHeartBeatTimer: false,
  heartBeatTimerInterval: 15,
  debug: false,
  userId: undefined,
  cookieDomain: undefined,
  domains: undefined,
  preInitActions: [],
});

Vue.use(VueMeta);
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Dashboard },
  { path: '/privacy', component: Privacy },
  { path: '/terms_and_conditions', component: Terms },
  { path: '/race-challenges', component: Challenges },
  { path: '/iframe', component: EmbedIframe },
  { path: '*', component: PageNotFound },
];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

Vue.use(Vuetify, {
  directives: {
    Touch,
  },
});

Vue.use(browserDetect);

const mdRendererLinksTargetBlank = new marked.Renderer();
mdRendererLinksTargetBlank.link = function (href, title, text) { // eslint-disable-line func-names
  const link = marked.Renderer.prototype.link.call(this, href, title, text);
  return link.replace('<a', '<a target="_blank" ');
};
marked.setOptions({
  renderer: mdRendererLinksTargetBlank,
});
Vue.prototype.$marked = marked;

const renderVue = async () => {
  await store.dispatch('config/checkBrand');
  store.dispatch('features/loadAllEndpoints');

  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const vuetify = new Vuetify({
    theme: {
      options: {
        customProperties: true,
      },
      dark: mq.matches,
      themes: {
        light: {
          primary: store.state.config.appConfig
            ? store.state.config.appConfig.branding.primaryColor
            : '#004170',
          secondary: store.state.config.appConfig
            ? store.state.config.appConfig.branding.secondaryColor
            : '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          grey: '#AAA',
          background: '#FFF',
        },
        dark: {
          primary: store.state.config.appConfig
            ? store.state.config.appConfig.branding.primaryColor
            : '#004170',
          secondary: store.state.config.appConfig
            ? store.state.config.appConfig.branding.secondaryColor
            : '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          grey: '#AAA',
          background: '#121212',
        },
      },
    },
  });

  try {
    // Chrome & Firefox
    mq.addEventListener('change', (e) => {
      vuetify.framework.theme.dark = e.matches;
    });
  } catch (e1) {
    try {
      // Safari
      mq.addListener((e) => {
        vuetify.framework.theme.dark = e.matches;
      });
    } catch (e2) {
      console.error(e2);
    }
  }

  // Global helper functions
  Vue.mixin({
    methods: {
      getIndicatorColor(label) {
        const colors = vuetify.preset.theme.themes.light;
        let color;
        if (typeof label === 'undefined') { // placeholders
          color = colors.grey;
        } else if (label === null) { // area indicators
          color = colors.primary;
        } else if (['red'].includes(label.toLowerCase())) {
          color = colors.error;
        } else if (['grey'].includes(label.toLowerCase())) {
          color = colors.grey;
        } else if (['blue'].includes(label.toLowerCase())) {
          color = colors.info;
        } else if (['green'].includes(label.toLowerCase())) {
          color = colors.success;
        } else if (['orange'].includes(label.toLowerCase())) {
          color = '#FFA500'; // Color has been specifically requested
        } else if (['primary'].includes(label.toLowerCase())) {
          color = colors.primary;
        } else {
          color = colors.info;
        }
        return color;
      },
      getLocationCode: (indicatorObject) => `${indicatorObject.aoiID}-${indicatorObject.indicator}`,
      trackEvent: (action, name, value) => window._paq.push(['trackEvent', action, name, value]),
    },
  });

  // Global filters
  Vue.filter('truncate',
    (text, stop, clamp) => text
      .slice(0, stop) + (stop < text.length
      ? clamp || '...' : ''));

  new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
};

renderVue();
