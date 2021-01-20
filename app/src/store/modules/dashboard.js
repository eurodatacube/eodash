/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  dashboardConfig: null,
};

const getters = {
};

const mutations = {
  ADD_DASHBOARD_FEATURES(state, dashboardFeatures) {
    if (state.dashboardConfig) {
      state.dashboardConfig.features = state.dashboardConfig.features.concat(dashboardFeatures);
    } else {
      state.dashboardConfig = {
        features: dashboardFeatures,
      };
    }
  },
  SET_DASHBOARD_FEATURES(state, dashboardFeatures) {
    if (state.dashboardConfig) {
      state.dashboardConfig.features = dashboardFeatures;
    } else {
      state.dashboardConfig = {
        features: dashboardFeatures,
      };
    }
  },
  SET_DASHBOARD_TITLE(state, dashboardTitle) {
    if (state.dashboardConfig) {
      state.dashboardConfig.title = dashboardTitle;
    } else {
      state.dashboardConfig = {
        title: dashboardTitle,
      };
    }
  },
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
