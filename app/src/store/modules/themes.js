import stories from '../../config/stories2.json';

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentTheme: '',
  stories,
  themes: [
    {
      name: 'Atmospheric Composition',
      slug: 'atmospheric-composition',
      color: '#955200',
    },

    {
      name: 'Agriculture',
      slug: 'agriculture',
      color: '#766100',
    },

    {
      name: 'Biomass and Landcover',
      slug: 'biomass',
      color: '#1d7300',
    },

    {
      name: 'Water Quality',
      slug: 'water-quality',
      color: '#006f69',
    },

    {
      name: 'Ocean',
      slug: 'ocean',
      color: '#0064b3',
    },

    {
      name: 'Cryosphere',
      slug: 'cryosphere',
      color: '#616161',
    },
  ],
};

const getters = {
  getThemes: (state) => state.themes,
  getTheme: (state) => (slug) => state.themes.find((theme) => theme.slug === slug),
  getStories: (state) => state.stories,
};

const mutations = {

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
