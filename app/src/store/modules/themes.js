/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentTheme: '',
  themes: [
    {
      name: 'Atmospheric Composition',
      slug: 'atmospheric-composition',
      color: '#955200', // #F79300
    },

    {
      name: 'Water Quality',
      slug: 'water-quality',
      color: '#006f69', // #00BFB5
    },

    {
      name: 'Ocean',
      slug: 'ocean',
      color: '#0064b3', // #00A3D9
    },

    {
      name: 'Agriculture',
      slug: 'agriculture',
      color: '#556b00', // #96BA00
    },

    {
      name: 'Biomass and Landcover',
      slug: 'biomass-landcover',
      color: '#1d7300', // #2FA700
    },

    {
      name: 'Cryosphere',
      slug: 'cryosphere',
      color: '#616161', // #ABACC3
    },
  ],
};

const getters = {
  getThemes: (state)           => state.themes,
  getTheme:  (state) => (slug) => state.themes.find(theme => theme.slug === slug),
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
