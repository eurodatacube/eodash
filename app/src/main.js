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
import { marked } from 'marked';
import App from './App.vue';
import Dashboard from './views/Dashboard.vue';
import DashboardCustom from './views/DashboardCustom.vue';
import Privacy from './views/Privacy.vue';
import PageNotFound from './views/PageNotFound.vue';
import Challenges from './views/Challenges.vue';
import Terms from './views/Terms.vue';
import EmbedIframe from './views/EmbedIframe.vue';
import ThemesLandingPage from './views/ThemesLandingPage.vue';
import ThemeSinglePage from './views/ThemeSinglePage.vue';
import ScrollyFrame from './views/ScrollyFrame.vue';
import store from './store';
import charts from './plugins/charts'; // eslint-disable-line no-unused-vars
import customDashboardApiFactory from './custom-dashboard';
import getLocationCode from './mixins/getLocationCode';
// eslint-disable-line no-unused-vars

// Set UTC as default time zone behavior for whole client
Settings.defaultZoneName = 'utc';

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
Vue.use(Vuetify, {
  directives: {
    Touch,
  },
});

Vue.use(browserDetect);

const mdRendererLinksTargetBlank = new marked.Renderer();
mdRendererLinksTargetBlank.link = function (href, title, text) { // eslint-disable-line
  // eslint-disable-line func-names
  const link = marked.Renderer.prototype.link.call(this, href, title, text);
  return link.replace('<a', '<a target="_blank" ');
};
marked.setOptions({ renderer: mdRendererLinksTargetBlank });
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
      getIndicatorColor(label, legacy) {
        const colors = vuetify.preset.theme.themes.light;
        if (legacy) {
          if (typeof label === 'undefined') {
            // placeholders
            return colors.grey;
          }
          if (label === null) {
            // area indicators
            return colors.primary;
          }
          if (['red'].includes(label.toLowerCase())) {
            return colors.error;
          }
          if (['grey'].includes(label.toLowerCase())) {
            return colors.grey;
          }
          if (['blue'].includes(label.toLowerCase())) {
            return colors.info;
          }
          if (['green'].includes(label.toLowerCase())) {
            return colors.success;
          }
          if (['orange'].includes(label.toLowerCase())) {
            return '#FFA500'; // Color has been specifically requested
          }
          if (['primary'].includes(label.toLowerCase())) {
            return colors.primary;
          }
          return colors.info;
        }
        return colors.secondary;
      },
      getLocationCode,
      trackEvent: (action, name, value) => window._paq.push(
        ['trackEvent', action, name, value],
      ),
    },
  });

  // Global filters
  Vue.filter(
    'truncate',
    (text, stop, clamp) => text.slice(0, stop) + (stop < text.length ? clamp || '...' : ''),
  );

  const routes = [
    ...(store.state.config.appConfig
      && !store.state.config.appConfig.enableStories
      && !store.state.config.appConfig.enableScrollyTelling
      ? [
        { path: '/', name: 'explore', component: Dashboard },
      ] : [
        { path: '/explore', name: 'explore', component: Dashboard },
      ]),
    ...(store.state.config.appConfig && store.state.config.appConfig.enableStories
      ? [
        { path: '/', name: 'landing', component: ThemesLandingPage },
      ] : []),
    ...(store.state.config.appConfig && store.state.config.appConfig.enableScrollyTelling
      ? [
        { path: '/', name: 'landing', component: ScrollyFrame },
      ] : []),
    { path: '/dashboard', component: DashboardCustom },
    ...(store.state.config.appConfig && store.state.config.appConfig.demoMode
      ? [
        { path: '/demo', name: 'demo', component: Dashboard },
      ] : []
    ),
    { path: '/story', component: DashboardCustom },
    { path: '/privacy', name: 'privacy', component: Privacy },
    { path: '/terms_and_conditions', name: 'terms_and_conditions', component: Terms },
    { path: '/challenges', component: Challenges },
    { path: '/iframe', component: EmbedIframe },
    ...(store.state.config.appConfig && store.state.config.appConfig.enableScrollyTelling
      ? [
        { path: '/scrolly', component: ScrollyFrame },
      ] : []
    ),
    ...(store.state.config.appConfig && store.state.config.appConfig.enableStories
      ? [
        { path: '/atmosphere', name: 'atmosphere', component: ThemeSinglePage },
        { path: '/agriculture', name: 'agriculture', component: ThemeSinglePage },
        { path: '/biomass', name: 'biomass', component: ThemeSinglePage },
        { path: '/covid-19', name: 'covid-19', component: ThemeSinglePage },
        { path: '/cryosphere', name: 'cryosphere', component: ThemeSinglePage },
        { path: '/economy', name: 'economy', component: ThemeSinglePage },
        { path: '/oceans', name: 'oceans', component: ThemeSinglePage },
        { path: '/energy', name: 'energy', component: ThemeSinglePage },
        { path: '/transport-emission', name: 'transport-emission', component: ThemeSinglePage },
        { path: '/green-finance', name: 'green-finance', component: ThemeSinglePage },
        { path: '/food-ecosystems-biodiversity', name: 'food-ecosystems-biodiversity', component: ThemeSinglePage },
      ]
      : []
    ),
    ...(store.state.config.appConfig && store.state.config.appConfig.id === 'gtif'
      ? [
        { path: '/explore', name: 'explore', component: Dashboard },
        { path: '/energy-transition', name: 'gtif-energy-transition', component: ScrollyFrame },
        { path: '/mobility-transition', name: 'gtif-mobility-transition', component: ScrollyFrame },
        { path: '/social-mobility', name: 'gtif-social-mobility', component: ScrollyFrame },
        { path: '/sustainable-cities', name: 'gtif-sustainable-cities', component: ScrollyFrame },
        { path: '/carbon-accounting', name: 'gtif-carbon-accounting', component: ScrollyFrame },
        { path: '/eo-adaptation-services', name: 'gtif-eo-adaptation-services', component: ScrollyFrame },
        { path: '/scrollymaps', name: 'scrollymaps', component: ScrollyFrame },
      ]
      : []
    ),
    { path: '*', component: PageNotFound },
  ];
  const router = new VueRouter({ mode: 'history', base: process.env.BASE_URL, routes });

  new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
};

if (store.state.dashboard?.dashboardConfig?.id) {
  store.commit('dashboard/ADD_API', customDashboardApiFactory());

  const id = store.state.dashboard?.dashboardConfig?.id;
  const editKey = store.state.dashboard?.dashboardConfig?.editKey;

  store.state.dashboard.api.listen(id, editKey).then((response) => {
    if (response.error) {
      console.error(response);
      store.commit('dashboard/disconnect');
    }

    response.features = response.features.map((f) => { // eslint-disable-line
      const newF = { ...f };
      delete newF.id;
      newF.poi = f.id;
      return newF;
    });

    store.commit('dashboard/SET', {
      ...response,
      ...(id && {
        id,
      }),
      ...(editKey && {
        editKey,
      }),
    });
  });
}

renderVue();
