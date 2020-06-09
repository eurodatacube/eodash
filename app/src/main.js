import Vue from 'vue';
import VuePapaParse from 'vue-papa-parse';
import VueMatomo from 'vue-matomo';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify/lib';
import { Touch } from 'vuetify/lib/directives';

import browserDetect from 'vue-browser-detect-plugin';
import App from './App.vue';
import Dashboard from './views/Dashboard.vue';
import Privacy from './views/Privacy.vue';
import PageNotFound from './views/PageNotFound.vue';
import Terms from './views/Terms.vue';
import store from './store';
import charts from './plugins/charts'; // eslint-disable-line no-unused-vars
import marked from 'marked';

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
  { path: "*", component: PageNotFound },
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
mdRendererLinksTargetBlank.link = function(href, title, text) {
  const link = marked.Renderer.prototype.link.call(this, href, title, text);
  return link.replace("<a", "<a target='_blank' ");
};
marked.setOptions({
  renderer: mdRendererLinksTargetBlank,
});
Vue.prototype.$marked = marked;

const renderVue = async () => {
  await store.dispatch('config/checkBrand');
  store.dispatch('features/loadAllCsv');

  const vuetify = new Vuetify({
    theme: {
      options: {
        customProperties: true,
      },
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
        },
      },
    },
  });

  // Global helper functions
  Vue.mixin({
    methods: {
      getIndicatorColor(label) {
        const colors = vuetify.preset.theme.themes.light;
        let color;
        if (typeof label === 'undefined') {
          color = 'grey';
        } else if (['red'].includes(label.toLowerCase())) {
          color = colors.error;
        } else if (['blue'].includes(label.toLowerCase())) {
          color = colors.info;
        } else if (['green'].includes(label.toLowerCase())) {
          color = colors.success;
        } else if (['orange'].includes(label.toLowerCase())) {
          color = '#FFA500'; // Color has been specifically requested
        } else {
          color = colors.info;
        }
        return color;
      },
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
