/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  selectedIndicator: null,
};

const getters = {
};

const mutations = {
  SET_SELECTED_INDICATOR(state, indicatorObject) {
    state.selectedIndicator = indicatorObject;
  },
};

const actions = {
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
