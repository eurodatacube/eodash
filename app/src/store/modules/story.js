const state = {
  markdown: require('../../../public/data/gtif/markdown/ADO.md').default,
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
