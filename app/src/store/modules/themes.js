import axios from 'axios';
import stories from '../../config/stories.json';

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentTheme: null,
  currentPOIsIncludedInTheme: [],
  stories,
  themes: [
    {
      name: 'Atmospheric Composition',
      slug: 'atmospheric-composition',
      color: '#a65200',
      description: 'The Planet\'s Protective Blanket',
    },

    {
      name: 'Agriculture',
      slug: 'agriculture',
      color: '#766100',
      description: 'The Backbone of the Economic System',
    },

    {
      name: 'Biomass and Landcover',
      slug: 'biomass-and-landcover',
      color: '#1d7300',
      description: 'The Green Lung of our Planet',
    },

    {
      name: 'Water Quality',
      slug: 'water-quality',
      color: '#006f69',
      description: 'The Basis for Human Well-Being',
    },

    {
      name: 'Ocean',
      slug: 'ocean',
      color: '#0064b3',
      description: 'The Climate Kitchen',
    },

    {
      name: 'Cryosphere',
      slug: 'cryosphere',
      color: '#616161',
      description: 'The Planet\'s Climate Control',
    },
  ],
};

const getters = {
  getThemes: (state) => state.themes,
  getTheme: (state) => (slug) => state.themes.find((theme) => theme.slug === slug),
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

  SET_CURRENT_THEME_POIS(state, pois) {
    state.currentPOIsIncludedInTheme = pois;
  },
};

const actions = {
  async loadTheme({ commit, state, rootState }, theme) {
    commit('SET_CURRENT_THEME', theme);
    let storyIDs = [];
    if (theme) {
      const matchingStories = Object.values(state.stories[rootState.config.appConfig.id][theme]);

      for (const story of matchingStories) { // eslint-disable-line
        const storyDashboard = await axios // eslint-disable-line
          .get(`./data/dashboards/${story.originalDashboardId}.json`);
        const storyDashboardContent = storyDashboard.data;
        const storyPOIs = storyDashboardContent.features.map((f) => f.id);
        storyIDs = [...new Set([...storyIDs, ...storyPOIs])];
      }
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
