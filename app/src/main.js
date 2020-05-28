import Vue from 'vue';
import VuePapaParse from 'vue-papa-parse';
import VueMeta from 'vue-meta';
import Vuetify from 'vuetify/lib';
import Chart from 'chart.js';
/* Plugin autoregisters so does not need to be registered */
import ChartDataLabels from 'chartjs-plugin-datalabels'; // eslint-disable-line no-unused-vars
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import * as ChartZoomPlugin from 'chartjs-plugin-zoom';
import browserDetect from 'vue-browser-detect-plugin';
import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker';

Vue.config.productionTip = false;

Chart.plugins.register([ChartAnnotation, ChartZoomPlugin]);
Vue.use(VuePapaParse);
Vue.use(VueMeta);
Vue.use(Vuetify);
Vue.use(browserDetect);

const renderVue = async () => {
  await store.dispatch('config/checkBrand');
  store.dispatch('features/loadAllCsv');
  if (store.state.config.appConfig.displayDummyLocations) {
    store.dispatch('features/loadDummyLocations');
  }

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
    },
  });

  // Global filters
  Vue.filter('truncate',
    (text, stop, clamp) => text
      .slice(0, stop) + (stop < text.length
      ? clamp || '...' : ''));

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
};

renderVue();
