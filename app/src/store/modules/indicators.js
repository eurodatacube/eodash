/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import shTimeFunction from '@/shTimeFunction';

const state = {
  indicators: null,
  selectedIndicator: null,
  selectedTime: null,
  customAreaIndicator: null,
  frozenIndicator: null,
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
  SET_FROZEN_INDICATOR(state, indicator) {
    // We make a deep copy but we need to make sure possible functions for date manipulation are
    // passed correctly
    state.frozenIndicator = JSON.parse(JSON.stringify(indicator));
    let display = {};
    if (Array.isArray(indicator.display) && indicator.display.length > 0) {
      [display] = indicator.display;
    } else if (indicator.display) {
      display = indicator.display;
    }
    const displayCopy = JSON.parse(JSON.stringify(display));
    state.frozenIndicator.display = displayCopy;
    state.frozenIndicator.display.dateFormatFunction = display.dateFormatFunction || shTimeFunction;
    if (display?.style?.getColor) {
      state.frozenIndicator.display.style.getColor = display?.style?.getColor;
    }
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
  freezeCurrentIndicator({ commit }, frozenLayerName) {
    this.state.indicators.selectedIndicator.frozenLayerName = frozenLayerName;
    commit('SET_FROZEN_INDICATOR', this.state.indicators.selectedIndicator);
  },
  async loadSTACIndicators({ commit, rootState }) {
    let url = rootState.config.baseConfig.STACEndpoint;
    // Allow overwrite of STAC endpoint url if catalog key is provided in url
    // only for testing and staging environments
    const currUrl = new URL(window.location.href);
    const catalogBranch = currUrl.searchParams.get('catalog');
    const testenv = window.location.href.search('test|staging|localhost|eox.world');
    if (catalogBranch !== null && testenv !== -1) {
      const bucket = 'https://eodashcatalog.eox.at/';
      const mapping = {
        esa: 'RACE',
        trilateral: 'trilateral',
        gtif: 'GTIF',
      };
      url = `${bucket}${catalogBranch}/${mapping[rootState.config.appConfig.id]}/catalog.json`;
    }
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
              type: 'stac',
              link: `${url.replace('catalog.json', '')}${link.href}`,
              description: link.subtitle ? link.subtitle : '',
              name: link.title,
              indicator: link.code,
              themes: link.themes ? link.themes : [],
              tags: link.tags ? link.tags : [],
              satellite: link.satellite ? link.satellite : [],
              insituSources: link.insituSources ? link.insituSources : [],
              otherSources: link.otherSources ? link.otherSources : [],
              sensor: link.sensor ? link.sensor : [],
              endpointType: link.endpointtype,
              locations: link.locations ? link.locations : false,
              // TODO: This is usually used in the client to define if it is a global indicator
              // it should be handled with a unique value
              country: 'all',
              countries: link.countries ? link.countries : [],
              cities: link.cities ? link.cities : [],
              // TODO: some default values we seem to need would be great if we can remove them
              subAoi: {
                type: 'FeatureCollection',
                features: [],
              },
              inputData: [],
              yAxis: link.yAxis,
            };
            // For now we try to fetch the additional information form the config
            // TODO: Replace as much configuration as possible by STAC information
            rootState.config.baseConfig.globalIndicators.forEach((indicator) => {
              if (indicator.properties.indicatorObject.indicator === resultIndicator.indicator) {
                resultIndicator = { ...resultIndicator, ...indicator.properties.indicatorObject };
              }
            });
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
