/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentDomain: '',
};

const getters = {
  getCurrentDomain: (state) => state.currentDomain,
};

const mutations = {
  SET_CURRENT_DOMAIN(state, slug) {
    state.currentDomain = slug;
  },
};

const actions = {
  async setCurrentDomain({ commit, rootState }, slug) {
    commit('SET_CURRENT_DOMAIN', slug)
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
