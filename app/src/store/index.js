import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import config from './modules/config';
import dashboard from './modules/dashboard';
import features from './modules/features';
import indicators from './modules/indicators';
import themes from './modules/themes';

const vuexLocal = new VuexPersistence({
  storage: localStorage,
  reducer: (state) => (
    {
      dashboard: {
        dashboardConfig: state.dashboard.dashboardConfig,
      },
    }
  ),
  // don't allow storing a 'SET' mutation without editing key, i.e. only for viewing mode
  filter: (mutation) => !(mutation.type === 'dashboard/SET' && !mutation?.payload?.editKey),
});

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    config,
    dashboard,
    features,
    indicators,
    themes,
  },
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0',
    isFullScreen: false,
    showHistoryBackButton: false,
    alert: {
      message: '',
      type: '',
    },
  },
  getters: {
    appVersion: (state) => state.packageVersion,
  },
  mutations: {
    changeFullScreen(state, val) {
      state.isFullScreen = val;
    },
    changeBackButtonDisplay(state, value) {
      state.showHistoryBackButton = value;
    },
    sendAlert(state, payload) {
      state.alert.message = payload.message;
      state.alert.type = payload.type;
    },
  },
  plugins: [vuexLocal.plugin],
});

export default store;
