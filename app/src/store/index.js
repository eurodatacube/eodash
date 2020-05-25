import Vue from 'vue';
import Vuex from 'vuex';
import features from './modules/features';
import indicators from './modules/indicators';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    features,
    indicators,
  },
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0',
  },
  getters: {
    appVersion: (state) => state.packageVersion,
  },
});

export default store;
