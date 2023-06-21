/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  indicators: null,
  selectedIndicator: null,
  selectedTime: null,
  customAreaIndicator: null,
};

const getters = {
  getIndicators(state) {
    return state.indicators;
  },
};

const mutations = {
  SET_INDICATORS(state, indicators) {
    state.indicators = indicators;
  },
  SET_SELECTED_INDICATOR() {
  },
  INDICATOR_LOAD_FINISHED(state, indicatorObject) {
    state.selectedIndicator = indicatorObject;
  },
  SET_CUSTOM_AREA_INDICATOR() {
  },
  CUSTOM_AREA_INDICATOR_LOAD_FINISHED(state, indicatorObject) {
    state.customAreaIndicator = indicatorObject;
  },
};

const actions = {
  async loadSTACIndicators({ commit, rootState }) {
    const url = rootState.config.baseConfig.STACEndpoint;
    const indicators = await this.dispatch( // eslint-disable-line
      'indicators/loadSTACEndpoint', { url, rootState },
    );
    commit('SET_INDICATORS', indicators);
  },
  loadSTACEndpoint(_, { url, rootState }) {
    return fetch(url, { credentials: 'same-origin' }).then((r) => r.json())
      .then((data) => {
        const indicators = [];
        data.links.forEach((link) => {
          if (link.rel === 'child') {
            let resultIndicator = {
              code: 'CDS3',
              description: link.description,
              indicator: link.description,
              region: 'global',
              themes: ['test'],
              title: link.title,
            };
            // For now we try to fetch the additional information form the config
            // TODO: Replace as much configuration as possible by STAC information
            rootState.config.baseConfig.globalIndicators.forEach((indicator) => {
              if (indicator.properties.indicatorObject.indicator === resultIndicator.code) {
                resultIndicator = { ...resultIndicator, ...indicator.properties.indicatorObject };
              }
            });
            console.log(resultIndicator);
            indicators.push(resultIndicator);
          }
        });
        return indicators;
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
