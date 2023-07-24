/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import { Wkt } from 'wicket';
import latLng from '@/latLng';
import countriesJson from '@/assets/countries.json';
import getLocationCode from '@/mixins/getLocationCode';
import nameMapping from '@/config/name_mapping.json';

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
    includeArchived: false,
    custom: [],
  },
  selectedArea: null,
  selectedFeatures: [],
};

const getters = {
  getCountries(state, _, rootState) {
    return [...new Set([
      state.allFeatures
        .filter((f) => {
          if (state.featureFilters.indicators.length > 0) {
            return state.featureFilters.indicators.includes(f.properties.indicatorObject.indicator);
          }
          if (state.featureFilters.themes.length > 0) {
            return rootState.themes.currentPOIsIncludedInTheme
              .includes(`${
                f.properties.indicatorObject.aoiID}-${
                f.properties.indicatorObject.indicator}`);
          }
          return true;
        })
        .map((f) => f.properties.indicatorObject.country),
    ].flat(2))].sort();
  },
  getIndicators(state, _, rootState) {
    const indicators = [...new Set([
      state.allFeatures
        .filter((f) => {
          let filtered;
          if (state.featureFilters.countries.length > 0) {
            if (Array.isArray(f.properties.indicatorObject.country)) {
              filtered = f.properties.indicatorObject.country
                .some((i) => state.featureFilters.countries.includes(i));
            } else {
              filtered = state.featureFilters.countries
                .includes(f.properties.indicatorObject.country);
            }
          } else if (state.featureFilters.themes.length > 0) {
            filtered = rootState.themes.currentPOIsIncludedInTheme
              .includes(`${
                f.properties.indicatorObject.aoiID}-${
                f.properties.indicatorObject.indicator}`);
          } else if (!state.featureFilters.includeArchived) {
            filtered = f.properties.indicatorObject.description
              && (!f.properties.indicatorObject.description.includes('(archived)'));
          } else {
            filtered = true;
          }
          return filtered;
        })
        .map((f) => ({
          archived: f.properties.indicatorObject.description
            && (f.properties.indicatorObject.description.includes('(archived)')),
          code: f.properties.indicatorObject.indicator,
          description: f.properties.indicatorObject.description,
          indicator: f.properties.indicatorObject.description,
          region: f.properties.indicatorObject.region,
          themes: rootState.config.baseConfig.indicatorsDefinition[
            f.properties.indicatorObject.indicator
          ].themes,
          title: f.properties.indicatorObject.indicatorName,
          indicatorOverwrite: rootState.config.baseConfig.indicatorsDefinition[
            f.properties.indicatorObject.indicator
          ].indicatorOverwrite,
        })),
    ].flat(2))].sort();
    return indicators;
  },
  getCountryItems(state, gettersG) {
    return gettersG.getCountries
      .filter((c) => c !== 'all')
      .map((c) => {
        const item = countriesJson.features
          .find((f) => f.properties.alpha2 === c);
        return {
          code: c,
          name: item ? item.properties.name : 'Regional',
        };
      })
      .sort((a, b) => ((a.name > b.name) ? 1 : -1));
  },
  getFeatures(state, _, rootState) {
    let features = state.allFeatures;

    if (state.featureFilters.countries.length > 0) {
      features = features
        .filter((f) => {
          if (Array.isArray(f.properties.indicatorObject.country)) {
            return f.properties.indicatorObject.country
              .includes(state.featureFilters.countries);
          } else { // eslint-disable-line
            return state.featureFilters.countries
              .includes(f.properties.indicatorObject.country)
              || f.properties.indicatorObject.city === 'World';
          }
        });
    }
    if (state.featureFilters.indicators.length > 0) {
      features = features
        .filter((f) => {
          if (['N9', 'N10'].includes(f.properties.indicatorObject.indicator)) {
            return state.featureFilters.indicators.includes('N1');
          }
          return state.featureFilters.indicators
            .includes(f.properties.indicatorObject.indicator);
        });
    }
    if (state.featureFilters.themes.length > 0) {
      features = features
        .filter((f) => rootState.themes.currentPOIsIncludedInTheme
          .includes(`${
            f.properties.indicatorObject.aoiID}-${
            f.properties.indicatorObject.indicator}`));
    }
    if (state.featureFilters.custom.length > 0) {
      features = features
        .filter((f) => state.featureFilters.custom
          .map((c) => getLocationCode(c.properties.indicatorObject))
          .includes(getLocationCode(f.properties.indicatorObject)));
    }

    if (!state.featureFilters.includeArchived) {
      features = features.filter((f) => (f.properties.indicatorObject.updateFrequency ? f.properties.indicatorObject.updateFrequency.toLowerCase() !== 'archived' : true));
    }

    features = features
      .sort((a, b) => ((a.properties.indicatorObject.country > b.properties.indicatorObject.country)
        ? 1 : -1));

    return features;
  },
  getFeaturesGtifMap(state) {
    let features = state.allFeatures;
    // explicitly include only those features from current indicators filters
    if (state.featureFilters.indicators.length > 0) {
      features = features
        .filter((f) => state.featureFilters.indicators
          .includes(f.properties.indicatorObject.indicator));
      return features;
    }
    return [];
  },
  getGroupedFeatures(state, getters, rootState) {
    let allFeatures = [];
    if (state.allFeatures.length > 0) {
      const groupedFeatures = [];
      if (rootState.config.appConfig.featureGrouping) {
        rootState.config.appConfig.featureGrouping.forEach((fG) => {
          const firstFeature = getters.getFeatures
            .find((f) => `${f.properties.indicatorObject.aoiID}-${f.properties.indicatorObject.indicator}` === fG.features[0]);
          if (firstFeature) {
            groupedFeatures.push(firstFeature);
          }
        });
      }
      const restFeatures = rootState.config.appConfig.featureGrouping
        ? getters.getFeatures
          .filter((f) => {
            const locationCode = `${f.properties.indicatorObject.aoiID}-${f.properties.indicatorObject.indicator}`;
            return !rootState.config.appConfig.featureGrouping
              .find((fG) => fG.features.includes(locationCode));
          })
        : getters.getFeatures;
      allFeatures = groupedFeatures.concat(restFeatures);
    }
    return allFeatures;
  },
  getLatestUpdate(state) {
    const times = state.allFeatures.map((f) => {
      let time = f.properties.indicatorObject.Time;
      let latest;
      if (time && time.length > 0) {
        time = time.sort((a, b) => ((a > b) ? 1 : -1));
        latest = time[time.length - 1];
      }
      return latest;
    });
    const filtered = times.filter((t) => !!t).sort((a, b) => ((a > b) ? 1 : -1));
    return filtered[filtered.length - 1];
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
    // We do name replacing as based on the configuration file
    // as some data sources are external to us
    features.forEach((f) => {
      const { indicatorObject } = f.properties;
      // We see if indicator code and aoiID is a match
      const mergedKey = getLocationCode(indicatorObject);
      const { id } = this.state.config.appConfig;
      let foundMapping;
      if (mergedKey in nameMapping[id]) {
        foundMapping = nameMapping[id][mergedKey];
      } else if (indicatorObject.indicator in nameMapping[id]) {
        foundMapping = nameMapping[id][indicatorObject.indicator];
      }
      if (foundMapping) {
        if ('locationSplit' in foundMapping) {
          Object.entries(foundMapping.locationSplit).forEach((item) => {
            if (indicatorObject.aoiID.endsWith(item[0])) {
              indicatorObject.indicatorName = item[1].title
                ? item[1].title : indicatorObject.indicatorName;
              indicatorObject.description = item[1].title
                ? item[1].description : indicatorObject.description;
            }
          });
        } else {
          // allow arbitrary override of the data
          const keys = Object.keys(foundMapping);
          for (let kk = 0; kk < keys.length; kk += 1) {
            if (keys[kk] === 'title') {
              indicatorObject.indicatorName = foundMapping[keys[kk]];
            } else {
              indicatorObject[keys[kk]] = foundMapping[keys[kk]];
            }
          }
        }
      }
    });
    // indicatorName
    state.allFeatures = state.allFeatures.concat(features);
  },
  // SET_ALL_DUMMY_LOCATIONS(state, features) {
  //   state.allFeatures = state.allFeatures.concat(features);
  // },
  INIT_FEATURE_FILTER(state, { countries, indicators }) {
    if (countries) {
      state.featureFilters.countries = countries;
    }
    if (indicators) {
      state.featureFilters.indicators = indicators;
    }
  },
  SET_FEATURE_FILTER(state, options) {
    if (!options) return;

    const hasFeature = (f) => Object.keys(options).includes(f);

    if (hasFeature('countries')) {
      state.featureFilters.countries = options.countries;
    }
    if (hasFeature('indicators')) {
      state.featureFilters.indicators = options.indicators;
    }
    if (hasFeature('themes')) {
      state.featureFilters.themes = options.themes;
    }
    if (hasFeature('includeArchived')) {
      state.featureFilters.includeArchived = options.includeArchived;
    }
    if (hasFeature('custom')) {
      state.featureFilters.custom = options.custom;
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

    // Then, if applicable, add the dummy features
    if (rootState.config.appConfig.displayDummyLocations) {
      const dummyFeatures = await this.dispatch('features/loadDummyLocations');
      allFeatures = allFeatures.concat(dummyFeatures);
    }
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

  loadDummyLocations({ rootState }) {
    return new Promise((resolve) => {
      this._vm.$papa.parse(rootState.config.appConfig.displayDummyLocations, {
        download: true,
        quotes: true,
        header: true,
        skipEmptyLines: true,
        delimiter: ',',
        complete: (result) => {
          const { data } = result;
          const featureObjs = {};
          for (let rr = 0; rr < data.length; rr += 1) {
            const uniqueKey = `${data[rr].aoi}_d`;
            featureObjs[uniqueKey] = data[rr];
            featureObjs[uniqueKey].indicator = 'd';
            featureObjs[uniqueKey].indicatorValue = [''];
            featureObjs[uniqueKey].dummyFeature = true;
          }
          const features = [];
          const keys = Object.keys(featureObjs);

          for (let kk = 0; kk < keys.length; kk += 1) {
            const coordinates = keys[kk].split('_')[0].split(',').map(Number);
            featureObjs[keys[kk]].id = globalIdCounter; // to connect indicator & feature
            featureObjs[keys[kk]].aoi = latLng([coordinates[1], coordinates[0]]);
            features.push({
              id: globalIdCounter,
              properties: {
                indicatorObject: featureObjs[keys[kk]],
              },
            });
            globalIdCounter += 1;
          }
          resolve(features);
        },
      });
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
