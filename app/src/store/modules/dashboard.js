/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import Vue from 'vue';
import customDashboardApiFactory from '../../custom-dashboard';

const state = {
  api: null,
  dashboardConfig: null,
  featureAdded: null,
};

const getters = {
  features(state) {
    if (!state.dashboardConfig) { return null; }


    return state.dashboardConfig.features;
  },
};

const mutations = {
  NULLIFY(state) {
    Vue.set(state, 'api', null);
    Vue.set(state, 'dashboardConfig', null);
  },
  SET(state, dashboardConfig) {
    Vue.set(state, 'dashboardConfig', {
      ...state.dashboardConfig,
      ...dashboardConfig,
    });
  },
  ADD_API(state, api) {
    if (!api) { return; }


    api.on('edit', (dto) => {
      dto.features = dto.features.map((f) => {
        const newF = { ...f };
        delete newF.id;
        newF.poi = f.id;
        return newF;
      });

      Vue.set(state, 'dashboardConfig', {
        ...state.dashboardConfig,
        ...dto,
      });
    });

    state.api = api;
  },
  ADD_FEATURE(state, feature) {
    if (state.dashboardConfig) {
      state.dashboardConfig.features.push(feature);
    } else {
      state.dashboardConfig = {
        features: [feature],
      };
    }
    state.featureAdded = true;
  },
  REMOVE_FEATURE(state, { poi }) {
    if (state.dashboardConfig) {
      const index = state.dashboardConfig.features.findIndex((f) => f.poi === poi);
      if (index !== -1) {
        state.dashboardConfig.features.splice(index, 1);
      }
    }
  },
  CHANGE_TITLE(state, dashboardTitle) {
    if (state.dashboardConfig) {
      state.dashboardConfig.title = dashboardTitle;
    } else {
      state.dashboardConfig = {
        title: dashboardTitle,
      };
    }
  },
  ADD_MARKETING_INFO(state, marketingInfo) {
    if (!state.dashboardConfig.marketingInfo) {
      state.dashboardConfig.marketingInfo = marketingInfo;
    }
  },
  RESIZE_FEATURE_SHRINK(state, { poi }) {
    state.dashboardConfig.features.find((e) => e.poi === poi).width -= 1;
  },
  RESIZE_FEATURE_EXPAND(state, { poi }) {
    state.dashboardConfig.features.find((e) => e.poi === poi).width += 1;
  },
  MOVE_FEATURE_UP(state, { poi }) {
    const index = state.dashboardConfig.features.findIndex((e) => e.poi === poi);

    if (index === -1 || index === 0) { return; }


    const temp = { ...state.dashboardConfig.features[index - 1] };
    Vue.set(state.dashboardConfig.features, index - 1, state.dashboardConfig.features[index]);
    Vue.set(state.dashboardConfig.features, index, temp);
  },
  MOVE_FEATURE_DOWN(state, { poi }) {
    const index = state.dashboardConfig.features.findIndex((e) => e.poi === poi);
    if (index === -1 || index === state.dashboardConfig.features.length - 1) { return; }


    const temp = { ...state.dashboardConfig.features[index + 1] };
    Vue.set(state.dashboardConfig.features, index + 1, state.dashboardConfig.features[index]);
    Vue.set(state.dashboardConfig.features, index, temp);
  },
  CHANGE_FEATURE_TITLE(state, { poi, newTitle }) {
    const index = state.dashboardConfig.features.findIndex((e) => e.poi === poi);
    if (index === -1) { return; }


    Vue.set(state.dashboardConfig.features[index], 'title', newTitle);
  },
  CHANGE_FEATURE_MAP_INFO(state, { poi, mapInfo }) {
    const index = state.dashboardConfig.features.findIndex((e) => e.poi === poi);
    if (index === -1) { return; }


    Vue.set(state.dashboardConfig.features[index], 'mapInfo', mapInfo);
  },
  CHANGE_FEATURE_TEXT(state, { poi, text }) {
    const index = state.dashboardConfig.features.findIndex((e) => e.poi === poi);
    if (index === -1) { return; }


    Vue.set(state.dashboardConfig.features[index], 'text', text);
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

};

const actions = {
  exists: ({
    state,
  }, { poi }) => !!(state ?. dashboardConfig ?. features ?. find((feature) => feature.poi === poi)),
  addFeature(
    {
      commit,
      state,
    },
    f,
  ) {
    if (state.api) {
      f.id = f.poi;
      delete f.poi;
      return state.api.addFeature(f);
    }


    commit('ADD_FEATURE', f);
  },
  removeFeature(
    {
      commit,
      state,
    },
    f,
  ) {
    if (state.api) { return state.api.removeFeature(f.poi); }


    commit('REMOVE_FEATURE', f);
  },
  changeTitle(
    {
      commit,
      state,
    },
    t,
  ) {
    if (state.api) { return state.api.changeTitle(t); }


    commit('CHANGE_TITLE', t);
  },
  addMarketingInfo(
    {
      commit,
      state,
    },
    m,
  ) {
    if (state.api) { return state.api.addMarketingInfo(m); }

    commit('ADD_MARKETING_INFO', m);

    commit('ADD_API', customDashboardApiFactory());
    return new Promise((resolve, reject) => {
      state.api.create(state.dashboardConfig.title, state.dashboardConfig.features.map((f) => {
        const newF = { ...f };
        delete newF.poi;
        newF.id = f.poi;
        return newF;
      })).then((response) => {
        if (response.error) { reject(response); }


        response.features = response.features.map((f) => {
          const newF = { ...f };
          delete newF.id;
          newF.poi = f.id;
          return newF;
        });

        commit('SET', response);

        state.api.addMarketingInfo(state.dashboardConfig.marketingInfo).then(() => {
          resolve();
        });
      });
    });
  },
  addToMailingList(
    {
      state,
    },
    m,
  ) {
    if (state.api) {
      return state.api.addToMailingList(m.email, m.name, m.viewURL, m.editURL, m.interests);
    }
  },
  resizeFeatureShrink(
    {
      commit,
      state,
    },
    f,
  ) {
    if (state.api) { return state.api.shrinkFeature(f.poi); }


    commit('RESIZE_FEATURE_SHRINK', f);
  },
  resizeFeatureExpand(
    {
      commit,
      state,
    },
    f,
  ) {
    if (state.api) { return state.api.expandFeature(f.poi); }


    commit('RESIZE_FEATURE_EXPAND', f);
  },
  moveFeatureUp(
    {
      commit,
      state,
    },
    f,
  ) {
    if (state.api) { return state.api.moveFeatureUp(f.poi); }


    commit('MOVE_FEATURE_UP', f);
  },
  moveFeatureDown(
    {
      commit,
      state,
    },
    f,
  ) {
    if (state.api) { return state.api.moveFeatureDown(f.poi); }


    commit('MOVE_FEATURE_DOWN', f);
  },
  changeFeatureTitle(
    {
      commit,
      state,
    },
    { poi, newTitle },
  ) {
    if (state.api) { return state.api.changeFeatureTitle(poi, newTitle); }


    commit('CHANGE_FEATURE_TITLE', { poi, newTitle });
  },
  changeFeatureMapInfo(
    {
      commit,
      state,
    },
    {
      poi,
      ...mapInfo
    },
  ) {
    if (state.api) { return state.api.changeFeatureMapInfo(poi, mapInfo); }


    commit('CHANGE_FEATURE_MAP_INFO', { poi, mapInfo });
  },
  changeFeatureText(
    {
      commit,
      state,
    },
    { poi, text },
  ) {
    if (state.api) { return state.api.changeFeatureText(poi, text); }


    commit('CHANGE_FEATURE_TEXT', { poi, text });
  },
  disconnect(
    { state, commit },
  ) {
    if (state.api) { state.api.disconnect(); }


    commit('NULLIFY');
  },
  async listen(
    {
      state,
      commit,
    },
    { id, editKey },
  ) {
    commit('ADD_API', customDashboardApiFactory());

    const response = await state.api.listen(id, editKey);

    if (response.error) { throw response; }


    response.features = response.features.map((f) => {
      const newF = { ...f };
      delete newF.id;
      newF.poi = f.id;
      return newF;
    });

    commit('SET', {
      ...response,
      ...(id && {
        id,
      }),
      ...(editKey && {
        editKey,
      }),
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
