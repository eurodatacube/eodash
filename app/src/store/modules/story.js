const state = {
  markdown: '',
};
const getters = {};
const actions = {};
const mutations = {
  SET_STORY(state, newFile) {
    console.log('set markdown file is triggered');
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
