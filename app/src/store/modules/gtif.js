/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  currentDomain: '',
  toolsToggle: true,
  domains: [
    {
      name: 'Energy Transition',
      slug: 'gtif-energy-transition',
      narratives: [
        {
          name: 'Energy present and future in EU and Austria',
          routeName: 'gtif-energy-transition',
        },
      ],
    },
    {
      name: 'Mobility Transition',
      slug: 'gtif-mobility-transition',
      narratives: [
        {
          name: 'Air Quality and Human Mobility over Austria',
          routeName: 'gtif-mobility-transition',
        },
      ],
    },
    {
      name: 'Sustainable Cities',
      slug: 'gtif-sustainable-cities',
      narratives: [
        {
          name: 'Cities\' role in climate neutrality',
          routeName: 'gtif-sustainable-cities',
        },
      ],
    },
    {
      name: 'Carbon Accounting',
      slug: 'gtif-carbon-accounting',
      narratives: [
        {
          name: 'The role of forests in the GHG emissions balance',
          routeName: 'gtif-carbon-accounting',
        },
      ],
    },
    {
      name: 'EO Adaptation Services',
      slug: 'gtif-eo-adaptation-services',
      narratives: [
        {
          name: 'Adapting forest management practices in a changing climate',
          routeName: 'gtif-eo-adaptation-services',
        },
        {
          name: 'Water in snow as a resource for hydropower',
          routeName: 'gtif-eo-adaptation-services-snow',
        },
      ],
    },
  ],
};

const getters = {
  getCurrentDomain: (state) => state.currentDomain,
};

const mutations = {
  SET_CURRENT_DOMAIN(state, slug) {
    state.currentDomain = slug;
  },
};

const actions = {
  async setCurrentDomain({ commit }, slug) {
    commit('SET_CURRENT_DOMAIN', slug);
  },
  setDomainFromFilter({ commit, state }, items) {
    const themesCount = {};
    let max = 0;
    let currentTheme = '';
    items.forEach((item) => {
      item.themes.forEach((theme) => {
        if (theme in themesCount) {
          themesCount[theme]++;
        } else {
          themesCount[theme] = 1;
        }
      });
    });

    Object.keys(themesCount).forEach((theme) => {
      max = Math.max(max, themesCount[theme]);
      if (max === themesCount[theme]) {
        currentTheme = theme;
      }
    });
    const currentDomainName = currentTheme.split('-').join(' ').toLowerCase();
    const currentDomain = state.domains
      .find((domain) => domain.name.toLowerCase() === currentDomainName);
    commit('SET_CURRENT_DOMAIN', currentDomain.slug);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
