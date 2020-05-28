/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  appConfig: null,
  baseConfig: null,
};

const getters = {
};

const mutations = {
  SET_APP_CONFIG(state, config) {
    state.appConfig = config;
  },
  SET_BASE_CONFIG(state, config) {
    state.baseConfig = config;
  },
};

const actions = {
  checkBrand({ commit }) {
    const appConfig = require('../../appConfig.js');
    const brandConfig = appConfig.default.brands.find((c) => c.match.includes(document.domain));
    commit('SET_APP_CONFIG', brandConfig);
    commit('SET_BASE_CONFIG', require(`../../config/${brandConfig.id}.js`));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
