/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  themes: [
    {
      name: 'Atmospheric Composition',
      slug: 'atmospheric-composition',
      color: '#EA9A00',
    },

    {
      name: 'Water Quality',
      slug: 'water-quality',
      color: '#00B4BF',
    },

    {
      name: 'Ocean',
      slug: 'ocean',
      color: '#045CE0',
    },

    {
      name: 'Agriculture',
      slug: 'agriculture',
      color: '#8EB100',
    },

    {
      name: 'Biomass and Landcover',
      slug: 'biomass-landcover',
      color: '#117A00',
    },

    {
      name: 'Cryosphere',
      slug: 'cryosphere',
      color: '#BBB',
    },
  ],
};

const getters = {
  getThemes: state => state.themes,
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
