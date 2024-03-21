/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
const state = {
  allFeatures: [],
  selectedFeature: null,
  featureData: null,
  featureFilters: {
    countries: [],
    indicators: [],
    themes: [],
    custom: [],
  },
  selectedArea: null,
  selectedFeatures: [],
};

const getters = {
  getFeatures(state) {
    let features = state.allFeatures;
    // due to a mismatch in keys (e.g. 'countries' vs. 'country' etc.) between the STAC properties
    // and the indicatorObject properties this cannot be 100% automated and a keymap is necessary
    // TODO as soon as keys are harmonized, automate this
    const keyMap = {
      countries: 'country',
      cities: 'city',
    };
    const indicatorsFilter = document.querySelector('eox-itemfilter');
    if (indicatorsFilter) {
      const { filters } = indicatorsFilter;
      Object.keys(filters)
        .filter((filterName) => Object.keys(keyMap).includes(filterName))
        .forEach((filterName) => {
          // remove features not matching active countries or cities filter
          const whiteList = Object.entries(filters[filterName].state)
            .filter(([, value]) => !!value)
            .map(([key]) => key);
          if (whiteList.length > 0) {
            features = features.filter(
              (f) => whiteList.includes(f.properties.indicatorObject[keyMap[filterName]]),
            );
          }
        });
    }
    features = features
      .sort((a, b) => ((a.properties.indicatorObject.country > b.properties.indicatorObject.country)
        ? 1 : -1));

    return features;
  },
};

const mutations = {
  SET_SELECTED_FEATURE(state, feature) {
    state.featureData = null;
    state.selectedFeature = feature;
  },
  FEATURE_LOAD_FINISHED(state, featureData) {
    state.featureData = featureData;
  },
  SET_FEATURES(state, features) {
    state.allFeatures = features;
  },
  ADD_NEW_FEATURES(state, features) {
    state.allFeatures = state.allFeatures.concat(features);
  },
  SET_FEATURE_FILTER(state, options) {
    if (!options) return;

    const hasFeature = (f) => Object.keys(options).includes(f);

    if (hasFeature('indicators')) {
      state.featureFilters.indicators = options.indicators;
    }
  },
  SET_SELECTED_FEATURES(state, features) {
    state.selectedFeatures = features;
  },
  SET_SELECTED_AREA(state, area) {
    state.selectedArea = area;
  },
  SET_ADMIN_BORDER_FEATURE_SELECTED(state, feature) {
    state.adminBorderFeatureSelected = feature;
  },
  SET_ADMIN_BORDER_LAYER_SELECTED(state, layer) {
    state.adminBorderLayerSelected = layer;
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
