/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  appConfig: null,
};

const getters = {
};

const mutations = {
  SET_CONFIG(state, config) {
    state.appConfig = config;
  },
};

const actions = {
  checkBrand({ commit }) {
    const appConfig = require('../../appConfig.js');
    const brandConfig = appConfig.default.brands.find((c) => c.match.includes(document.domain));
    console.log(appConfig.default.brands);
    commit('SET_CONFIG', brandConfig);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
