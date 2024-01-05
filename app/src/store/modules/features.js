/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import { Wkt } from 'wicket';
import latLng from '@/latLng';
import getLocationCode from '@/mixins/getLocationCode';

const format = new Wkt();

let globalIdCounter = 0;
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
    if (hasFeature('themes')) {
      state.featureFilters.themes = options.themes;
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
  async loadAllEndpoints({ commit, rootState }) {
    let allFeatures = [];
    const endpoints = rootState.config.baseConfig.dataEndpoints;
    for (let ep = 0; ep < endpoints.length; ep += 1) {
      if (Object.prototype.hasOwnProperty.call(endpoints[ep], 'type')) {
        let url = endpoints[ep].provider;
        if (Object.prototype.hasOwnProperty.call(endpoints[ep], 'locationSuffix')) {
          url += endpoints[ep].locationSuffix;
        }
        let F;
        const endPointIdx = ep;
        switch (endpoints[ep].type) {
          case 'geodb':
            F = await this.dispatch( // eslint-disable-line
              'features/loadGeoDBEndpoint', { url, endPointIdx },
            );
            break;
          case 'eox':
            F = await this.dispatch( // eslint-disable-line
              'features/loadEOXEndpoint', { url, endPointIdx },
            );
            break;
          default:
            console.log('Endpoint type unknown');
        }
        allFeatures = allFeatures.concat(F);
      }
    }
    // Then, add the hardcoded features
    allFeatures = allFeatures.concat(rootState.config.baseConfig.globalIndicators);

    commit('ADD_NEW_FEATURES', allFeatures);
  },

  loadEOXEndpoint(_, { url, endPointIdx }) {
    return fetch(url, { credentials: 'same-origin' }).then((r) => r.json())
      .then((data) => {
        if (data.length < 1) {
          return [];
        }
        const features = [];
        const pM = {
          aoi: 'aoi',
          aoiID: 'aoiID',
          lastColorCode: 'lastColorCode',
          country: 'country',
          indicator: 'indicator',
          lastIndicatorValue: 'lastIndicatorValue',
          lastTime: 'lastTime',
          lastMeasurement: 'lastMeasurement',
          siteName: 'siteName',
          subAoi: 'subAoi',
          city: 'city',
          description: 'description',
          region: 'region',
          indicatorName: 'indicatorName',
          lastReferenceValue: 'lastReferenceValue',
          lastReferenceTime: 'lastReferenceTime',
          yAxis: 'yAxis',
          updateFrequency: 'updateFrequency',
        };
        // only continue if aoi column is present
        if (Object.prototype.hasOwnProperty.call(data[0], pM.aoi)) {
          const featureObjs = {};
          for (let rr = 0; rr < data.length; rr += 1) {
            // Aggregate data based on location
            const uniqueKey = `${data[rr][pM.aoi]}_${data[rr][pM.indicator]}`;
            if (!Object.prototype.hasOwnProperty.call(featureObjs, uniqueKey)) {
              featureObjs[uniqueKey] = {};
            } else {
              // This should not happen
              console.log(`WARNING: Duplicate uniqueKey ${uniqueKey} in retrieved data.`);
            }
            // Create new object with mapped keys to allow integrating data
            // of multiple endpoints
            Object.entries(pM).forEach(([key, value]) => {
              if (Object.prototype.hasOwnProperty.call(data[rr], value)) {
                if (key === 'subAoi') {
                  try {
                    // assuming sub-aoi does not change over time
                    if (!['', '/'].includes(data[rr][value])) {
                      format.read(data[rr][value]);
                      const jsonGeom = format.toJson();
                      // create a feature collection
                      featureObjs[uniqueKey][key] = Object.freeze({
                        type: 'FeatureCollection',
                        features: [{
                          type: 'Feature',
                          properties: {},
                          geometry: jsonGeom,
                        }],
                      });
                    }
                  } catch (err) {
                    console.log(`Error parsing subAoi of locations for index ${rr}`);
                  }
                } else if (key === 'lastMeasurement') {
                  featureObjs[uniqueKey][key] = data[rr][value].length !== 0
                    ? Number(data[rr][value]) : NaN;
                } else {
                  featureObjs[uniqueKey][key] = data[rr][value];
                }
              }
            });
          }
          const keys = Object.keys(featureObjs);
          for (let kk = 0; kk < keys.length; kk += 1) {
            const coords = keys[kk].split('_')[0].replace(' ', '').split(',').map(Number);
            featureObjs[keys[kk]].aoi = latLng([coords[0], coords[1]]);
            featureObjs[keys[kk]].id = globalIdCounter; // to connect indicator & feature
            featureObjs[keys[kk]].endPointIdx = endPointIdx;
            features.push({
              id: globalIdCounter,
              properties: {
                indicatorObject: featureObjs[keys[kk]],
              },
            });
            globalIdCounter += 1;
          }
        }
        return features;
      });
  },
  loadGeoDBEndpoint(_, { url, endPointIdx }) {
    return fetch(url, { credentials: 'same-origin' }).then((r) => r.json())
      .then((data) => {
        if (data.length < 1) {
          return [];
        }
        const features = [];
        const pM = {
          aoi: 'aoi',
          aoiID: 'aoi_id',
          lastColorCode: 'color_code',
          country: 'country',
          geometry: 'geometry',
          indicator: 'indicator_code',
          lastIndicatorValue: 'indicator_value',
          lastTime: 'max_time',
          lastMeasurement: 'measurement_value',
          siteName: 'site_name',
          subAoi: 'sub_aoi',
          /*
          city: 'city',
          description: 'description',
          indicatorName: 'Indicator Name', // not present
          lastReferenceTime: 'reference date time [yyyy-mm-ddthh:mm:ss]',
          lastReferenceValue: 'reference value [float]',
          region: 'region (optional)',
          updateFrequency: 'update frequency', // not present
          // Probably not needed in overview
          referenceDescription: 'reference description',
          method: 'method',
          rule: 'rule',
          eoSensor: 'eo sensor',
          inputData: 'input data',
          */
        };
        // only continue if aoi column is present
        if (Object.prototype.hasOwnProperty.call(data[0], pM.aoi)) {
          const featureObjs = {};
          for (let rr = 0; rr < data.length; rr += 1) {
            // Aggregate data based on location
            const uniqueKey = `${data[rr][pM.aoi]}_${data[rr][pM.indicator]}`;
            if (!Object.prototype.hasOwnProperty.call(featureObjs, uniqueKey)) {
              featureObjs[uniqueKey] = {};
              // TODO: Remove placeholder text
              featureObjs[uniqueKey].description = 'placeholder description';
            } else {
              // This should not happen
              console.log(`WARNING: Duplicate uniqueKey ${uniqueKey} in retrieved data.`);
            }
            // Create new object with mapped keys to allow integrating data
            // of multiple endpoints
            Object.entries(pM).forEach(([key, value]) => {
              if (Object.prototype.hasOwnProperty.call(data[rr], value)) {
                if (key === 'subAoi') {
                  // dummy empty geometry
                  let ftrs = [];
                  try {
                    // assuming sub-aoi does not change over time
                    if (data[rr][value] !== '') {
                      // create a feature collection
                      ftrs = [Object.freeze(format.readFeature(data[rr][value]))];
                    }
                  } catch (err) {
                    console.log(`Error parsing subAoi of locations for index ${rr}`);
                  }
                  const ftrCol = {
                    type: 'FeatureCollection',
                    features: ftrs,
                  };
                  featureObjs[uniqueKey][key] = ftrCol;
                } else if (key === 'lastMeasurement') {
                  featureObjs[uniqueKey][key] = data[rr][value].length !== 0
                    ? Number(data[rr][value]) : NaN;
                } else {
                  featureObjs[uniqueKey][key] = data[rr][value];
                }
              }
            });
          }
          const keys = Object.keys(featureObjs);
          for (let kk = 0; kk < keys.length; kk += 1) {
            const coords = keys[kk].split('_')[0].replace('POINT(', '')
              .replace(')', '').split(' ').map(Number);
            featureObjs[keys[kk]].aoi = latLng([coords[1], coords[0]]);
            featureObjs[keys[kk]].id = globalIdCounter; // to connect indicator & feature
            featureObjs[keys[kk]].endPointIdx = endPointIdx;
            features.push({
              id: globalIdCounter,
              properties: {
                indicatorObject: featureObjs[keys[kk]],
              },
            });
            globalIdCounter += 1;
          }
        }
        return features;
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
