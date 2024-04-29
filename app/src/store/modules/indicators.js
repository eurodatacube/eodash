/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import shTimeFunction from '@/shTimeFunction';
import countriesJSON from '@/assets/countries.json';

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

async function loadIndicator(link, url, rootState) {
  const results = [];
  const resultTemplate = {
    type: 'stac',
    // link: `${url.replace('catalog.json', '')}${link.href}`,
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
    countries: link.countries ? link.countries : [],
    cities: link.cities ? link.cities : [],
    subAoi: {
      type: 'FeatureCollection',
      features: [],
    },
    inputData: [],
  };
  if (link.rel === 'child') {
    let resultIndicator;
    // We need to fetch sub collections to retrieve information
    const subEntries = await fetch(
      `${url.replace('catalog.json', '')}${link.href.substring(2)}`,
      { credentials: 'same-origin' },
    ).then((r) => r.json());
    for (let idx = 0; idx < subEntries.links.length; idx++) {
      if (subEntries.links[idx].rel === 'child') {
        resultIndicator = { ...resultTemplate };
        resultIndicator.link = `${url.replace('catalog.json', '')}${link.id}${subEntries.links[idx].href.substring(1)}`;
        resultIndicator.group = link.title;
        resultIndicator.themes = subEntries.links[idx].themes ? subEntries.links[idx].themes : [];
        resultIndicator.tags = subEntries.links[idx].tags ? subEntries.links[idx].tags : [];
        resultIndicator.satellite = subEntries.links[idx].satellite ? subEntries.links[idx].satellite : [];
        resultIndicator.insituSources = subEntries.links[idx].insituSources ? subEntries.links[idx].insituSources : [];
        resultIndicator.otherSources = subEntries.links[idx].otherSources ? subEntries.links[idx].otherSources : [];
        resultIndicator.sensor = subEntries.links[idx].sensor ? subEntries.links[idx].sensor : [];
        resultIndicator.countries = subEntries.links[idx].countries ? subEntries.links[idx].countries : [];
        resultIndicator.cities = subEntries.links[idx].cities ? subEntries.links[idx].cities : [];
        resultIndicator.description = subEntries.links[idx].subtitle ? subEntries.links[idx].subtitle : '';
        resultIndicator.name = subEntries.links[idx].title;
        resultIndicator.indicator = subEntries.links[idx].code;
        resultIndicator.locations = subEntries.links[idx].locations ? subEntries.links[idx].locations : false;
        resultIndicator.endpointType = subEntries.links[idx].endpointtype;
        if (typeof rootState.config.appConfig.customMetadataTransformer === 'function') {
          rootState.config.appConfig.customMetadataTransformer(resultIndicator);
        }
        // For now we try to fetch the additional information form the config
        // TODO: Replace as much configuration as possible by STAC information
        // eslint-disable-next-line no-loop-func
        rootState.config.baseConfig.globalIndicators.forEach((indicator) => {
          if (indicator.properties.indicatorObject.indicator === resultIndicator.indicator) {
            resultIndicator = { ...resultIndicator, ...indicator.properties.indicatorObject };
          }
        });
        results.push(resultIndicator);
      }
    }
  }
  return results;
}
function sanitizeData(indicator) {
  if (indicator.themes?.length === 0) {
    indicator.themes.push('others');
  }
  if (indicator.cities?.length > 0) {
    const sanitizedCities = [];
    indicator.cities.forEach((c) => {
      if (c !== '/' && c !== undefined) {
        sanitizedCities.push(c);
      }
    });
    // eslint-disable-next-line no-param-reassign
    indicator.cities = sanitizedCities;
  }
  const sanitizedCountries = [];
  if (indicator.countries?.length > 0) {
    indicator.countries.forEach((cntr) => {
      const match = countriesJSON.features.find((it) => it.properties.alpha2 === cntr || it.is === cntr);
      if (match) {
        if (match.properties.name === 'Czechia') {
          sanitizedCountries.push('Czech Republic');
        } else {
          sanitizedCountries.push(match.properties.name);
        }
      } else if (cntr === 'UK') {
        sanitizedCountries.push('United Kingdom');
      } else if (cntr === 'Czechia') {
        sanitizedCountries.push('Czech Republic');
      } else if (!(cntr === '/' || cntr === undefined)) {
        sanitizedCountries.push(cntr);
      }
    });
    // eslint-disable-next-line no-param-reassign
    indicator.countries = sanitizedCountries;
  }
  return indicator;
}
async function loadAllIndicators(data, url, rootState, commit) {
  const indicators = [];
  const promises = data.links.map((link) => loadIndicator(link, url, rootState));
  await Promise.all(promises).then((results) => {
    // results is an array of all the resolved values
    results.forEach((result) => {
      if (result && result.length > 0) {
        for (let r = 0; r < result.length; r++) {
          sanitizeData(result[r]);
          indicators.push(result[r]);
        }
      }
    });
  }).catch((error) => {
    console.error('Error loading datasets:', error);
  });
  commit('SET_INDICATORS', indicators);
  return indicators;
}

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
        polar: 'polar',
      };
      url = `${bucket}${catalogBranch}/${mapping[rootState.config.appConfig.id]}/catalog.json`;
    }
    this.dispatch( // eslint-disable-line
      'indicators/loadSTACEndpoint', { url, commit, rootState },
    );
  },
  async loadSTACEndpoint(_, { url, commit, rootState }) {
    fetch(url, { credentials: 'same-origin' }).then((r) => r.json())
      .then((data) => loadAllIndicators(data, url, rootState, commit));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
