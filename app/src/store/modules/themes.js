import stories from '../../config/stories.json';
import themes from '../../config/themes.json';

const appConfig = require('../../appConfig');

const b = appConfig.find((c) => c.match.includes(document.domain));
const brandConfig = (b !== undefined) ? b : appConfig[0];

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentTheme: null,
  stories,
  themes: themes[brandConfig.id],
};

const getters = {
  getThemes: (state) => state.themes,
  getTheme: (state) => (slug) => (
    state.themes.find((theme) => theme.slug === slug)
  ),
  getCurrentTheme: (state) => state.currentTheme,
  getStories: (state, _, rootState) => (theme) => {
    const brandStories = state.stories[rootState.config.appConfig.id];
    return theme
      ? Object.entries(brandStories[theme]).map((s) => ({ ...s[1], theme, id: s[0] }))
      : Object.entries(brandStories).reduce((acc, [themeKey, themeStories]) => acc.concat([
        ...Object.entries(themeStories).map(([id, story]) => ({ ...story, theme: themeKey, id })),
      ]), []);
  },
};

const mutations = {
  SET_CURRENT_THEME(state, slug) {
    let theme;
    if (slug) {
      theme = state.themes.find((t) => t.slug === slug);
    }
    state.currentTheme = theme;
  },
};

const actions = {
  async loadTheme({ commit }, theme) {
    commit('SET_CURRENT_THEME', theme);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
