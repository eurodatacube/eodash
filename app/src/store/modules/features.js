/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import moment from 'moment';
import { Wkt } from 'wicket';
import { latLng } from 'leaflet';

let globalIdCounter = 0;
const state = {
  allFeatures: [],
  featureFilters: {
    countries: [],
    indicators: [],
  },
  selectedFeatures: [],
  resultsCount: 1,
};

const getters = {
  getCountries(state) {
    return [...new Set([
      state.allFeatures
        .map((f) => f.properties.indicatorObject.Country),
    ].flat(1))].sort();
  },
  getIndicators(state, _, rootState) {
    const inidcators = [...new Set([
      state.allFeatures
        .map((f) => ({
          code: f.properties.indicatorObject['Indicator code'],
          indicator: f.properties.indicatorObject.Description,
          class: rootState.config.baseConfig.indicatorsDefinition[f.properties.indicatorObject['Indicator code']].class,
        })),
    ].flat(2))].sort();
    return inidcators;
  },
  getFeatures(state) {
    let features = state.allFeatures;
    if (state.featureFilters.countries.length > 0) {
      features = features
        .filter((f) => state.featureFilters.countries
          .includes(f.properties.indicatorObject.Country)
          || f.properties.indicatorObject.City === 'World');
    }
    if (state.featureFilters.indicators.length > 0) {
      features = features
        .filter((f) => state.featureFilters.indicators
          .some((r) => f.properties.indicatorObject['Indicator code'] === r));
    }
    features = features
      .sort((a, b) => ((a.properties.indicatorObject.Country > b.properties.indicatorObject.Country)
        ? 1 : -1));
    return features;
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
  SET_MANUAL_FEATURES(state, features) {
    state.allFeatures = state.allFeatures.concat(
      features,
      this.state.config.baseConfig.globalIndicators,
    );
  },
  ADD_NEW_FEATURES(state, features) {
    state.allFeatures = state.allFeatures.concat(features);
  },
  SET_ALL_DUMMY_LOCATIONS(state, features) {
    state.allFeatures = state.allFeatures.concat(features);
  },
  SET_FEATURE_FILTER(state, { countries, indicators }) {
    if (countries) {
      state.featureFilters.countries = countries;
    }
    if (indicators) {
      state.featureFilters.indicators = indicators;
    }
  },
  SET_SELECTED_FEATURES(state, features) {
    state.selectedFeatures = features;
  },
  SET_RESULTS_COUNT(state, count) {
    state.resultsCount = count;
  },
};
const actions = {
  loadAllCsv({ commit, rootState }) {
    const defs = rootState.config.baseConfig.indicatorsDefinition;
    const keys = Object.keys(defs);
    for (let kk = 0; kk < keys.length; kk += 1) {
      if (Object.prototype.hasOwnProperty.call(defs[keys[kk]], 'file') && defs[keys[kk]].file) {
        const csvUrl = `/eodash-data/data/${keys[kk]}.csv`;
        this.dispatch('features/loadCsv', csvUrl);
      }
    }
    commit('SET_MANUAL_FEATURES', []);
  },
  loadCsv({ commit }, csvUrl) {
    this._vm.$papa.parse(csvUrl, {
      download: true,
      quotes: true,
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      complete: (results) => {
        commit('SET_RESULTS_COUNT', results.data.length);
        const wkt = new Wkt();
        // Sort results by time
        results.data.sort((a, b) => moment.utc(a.Time).diff(moment.utc(b.Time)));
        /* Aggregate data based on AOI and indicator type */
        const featureObjs = {};
        for (let rr = 0; rr < results.data.length; rr += 1) {
          const uniqueKey = `${results.data[rr].AOI}_${results.data[rr]['Indicator code']}`;
          if (Object.prototype.hasOwnProperty.call(featureObjs, uniqueKey)) {
            featureObjs[uniqueKey]['Indicator Value'].push(
              results.data[rr]['Indicator Value'],
            );
            const measurement = results.data[rr]['Measurement Value'].replace(',', '.');
            featureObjs[uniqueKey]['Measurement Value'].push(
              measurement.length !== 0 ? Number(measurement) : NaN,
            );
            featureObjs[uniqueKey]['Reference value'].push(
              results.data[rr]['Reference value'],
            );
            featureObjs[uniqueKey]['Reference time'].push(
              results.data[rr]['Reference time'],
            );
            featureObjs[uniqueKey].Time.push(
              moment.utc(results.data[rr].Time).toDate(),
            );
            featureObjs[uniqueKey]['Color code'].push(
              results.data[rr]['Color code'],
            );
          } else {
            featureObjs[uniqueKey] = results.data[rr];
            featureObjs[uniqueKey]['Indicator Value'] = [
              featureObjs[uniqueKey]['Indicator Value'],
            ];
            featureObjs[uniqueKey]['Color code'] = [
              featureObjs[uniqueKey]['Color code'],
            ];
            const measurement = featureObjs[uniqueKey]['Measurement Value'].replace(',', '.');
            featureObjs[uniqueKey]['Measurement Value'] = [
              measurement.length !== 0 ? Number(measurement) : NaN,
            ];
            featureObjs[uniqueKey]['Reference value'] = [
              featureObjs[uniqueKey]['Reference value'],
            ];
            featureObjs[uniqueKey]['Reference time'] = [
              featureObjs[uniqueKey]['Reference time'],
            ];
            // dummy empty geometry
            let ftrs = [];
            try {
              // assuming sub-aoi does not change over time
              wkt.read(featureObjs[uniqueKey]['Sub-AOI']);
              const jsonGeom = wkt.toJson();
              // create a feature collection
              ftrs = [{
                type: 'Feature',
                properties: {},
                geometry: jsonGeom,
              }];
            } catch (err) {} // eslint-disable-line no-empty
            const ftrCol = {
              type: 'FeatureCollection',
              features: ftrs,
            };
            featureObjs[uniqueKey]['Sub-AOI'] = ftrCol;
            featureObjs[uniqueKey].Time = [
              moment.utc(featureObjs[uniqueKey].Time).toDate(),
            ];
          }
        }
        const features = [];
        const keys = Object.keys(featureObjs);

        for (let kk = 0; kk < keys.length; kk += 1) {
          const coordinates = keys[kk].split('_')[0].split(',').map(Number);
          // console.log(featureObjs[keys[kk]]);
          featureObjs[keys[kk]].AOI = latLng(coordinates);
          features.push({
            latlng: latLng(coordinates),
            id: globalIdCounter,
            properties: {
              indicatorObject: featureObjs[keys[kk]],
            },
          });
          globalIdCounter += 1;
        }
        commit('ADD_NEW_FEATURES', features);
      },
    });
  },
  loadDummyLocations({ commit }) {
    this._vm.$papa.parse('/eodash-data/data/dummylocations.csv', {
      download: true,
      quotes: true,
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      complete: (results) => {
        const featureObjs = {};
        for (let rr = 0; rr < results.data.length; rr += 1) {
          const uniqueKey = `${results.data[rr].AOI}_d}`;
          featureObjs[uniqueKey] = results.data[rr];
          featureObjs[uniqueKey]['Indicator code'] = 'd';
        }
        const features = [];
        const keys = Object.keys(featureObjs);

        for (let kk = 0; kk < keys.length; kk += 1) {
          const coordinates = keys[kk].split('_')[0].split(',').map(Number);
          features.push({
            latlng: latLng(coordinates),
            id: globalIdCounter,
            properties: {
              indicatorObject: featureObjs[keys[kk]],
            },
          });
          globalIdCounter += 1;
        }
        commit('SET_ALL_DUMMY_LOCATIONS', features);
      },
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
