const state = {
  markdown: '',
};
const getters = {};
const actions = {};
const mutations = {
  SET_STORY(state, newFile) {
    state.markdown = newFile;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
