import Vue from 'vue';
import Vuex from 'vuex';
import config from './modules/config';
import features from './modules/features';
import indicators from './modules/indicators';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    config,
    features,
    indicators,
  },
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0',
    isFullScreen: false,
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
    sendAlert(state, payload) {
      state.alert.message = payload.message;
      state.alert.type = payload.type;
    },
  },
});

export default store;
