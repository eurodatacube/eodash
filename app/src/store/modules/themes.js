import getLocationCode from '@/mixins/getLocationCode';

import stories from '../../config/stories.json';
import themes from '../../config/themes.json';

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentTheme: null,
  currentPOIsIncludedInTheme: [],
  stories,
  themes,
};

const getters = {
  getThemes: (state, _, rootState) => state.themes[rootState.config.appConfig.id],
  getTheme: (state, _, rootState) => (slug) => (
    state.themes[rootState.config.appConfig.id].find((theme) => theme.slug === slug)
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
  SET_CURRENT_THEME(state, theme) {
    state.currentTheme = theme;
  },

  SET_CURRENT_THEME_POIS(state, pois) {
    state.currentPOIsIncludedInTheme = pois;
  },
};

const actions = {
  async loadTheme({ commit, rootState }, theme) {
    const currThemes = rootState.themes.themes[rootState.config.appConfig.id];
    commit('SET_CURRENT_THEME', currThemes.find((t) => t.slug === theme));
    let storyIDs = [];
    if (theme) {
      const indicators = rootState.config.baseConfig.indicatorsDefinition;

      storyIDs = rootState.features.allFeatures
        .filter((f) => indicators[f.properties.indicatorObject.indicator].themes.includes(theme))
        .map((f) => getLocationCode(f.properties.indicatorObject));
    }
    commit('SET_CURRENT_THEME_POIS', storyIDs);
    commit('features/SET_FEATURE_FILTER', { themes: theme ? [theme] : [] }, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
