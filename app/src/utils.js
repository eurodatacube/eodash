import { DateTime } from 'luxon';
import store from '@/store';
import { generateUsedTimes } from '@/helpers/mapConfig';

import axios from 'axios';
import latLng from '@/latLng';
import { Vector } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { fromExtent } from 'ol/geom/Polygon';
import { Stroke, Style } from 'ol/style';
import { getMapInstance } from './components/map/map';
import getLocationCode from './mixins/getLocationCode';

export function padLeft(str, pad, size) {
  let out = str;
  while (out.length < size) {
    out = pad + str;
  }
  return out;
}

export function shTimeFunction(date) {
  let tempDate = date;
  if (!Array.isArray(tempDate)) {
    tempDate = [tempDate];
  }
  const dateObj = DateTime.fromISO(tempDate[0]);
  const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss";
  const alternativeFormat = 'yyyy-MM-dd';
  if (dateObj.second === 0 && dateObj.hour === 0 && dateObj.minute === 0) {
    // if only day input, format as an interval to next day
    const nextDay = dateObj.plus({ days: 1 });
    return `${dateObj.toFormat(alternativeFormat)}/${nextDay.toFormat(alternativeFormat)}`;
  }
  // otherwise return single date with full format
  return `${dateObj.toFormat(defaultFormat)}/${dateObj.toFormat(defaultFormat)}`;
}

export function shWeeklyTimeFunction(date) {
  let tempDate = date;
  if (!Array.isArray(tempDate)) {
    tempDate = [tempDate];
  }
  const dateObj = DateTime.fromISO(tempDate[0]);
  const alternativeFormat = 'yyyy-MM-dd';
  // if only day input, format as an interval to next week
  const nextDay = dateObj.plus({ days: 7 });
  return `${dateObj.toFormat(alternativeFormat)}/${nextDay.toFormat(alternativeFormat)}`;
}

export function shS2TimeFunction(date) {
  // modifies the start and end by 1 hour to past and future
  // this is done to fix mismatch between S2 filename
  // and metadata time resulting in transparent image
  let tempDate = date;
  if (!Array.isArray(tempDate)) {
    tempDate = [tempDate];
  }
  const dateObj = DateTime.fromISO(tempDate[0]);
  const dateFuture = dateObj.plus({ minutes: 45 });
  const datePast = dateObj.minus({ minutes: 45 });
  const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss";
  return `${datePast.toFormat(defaultFormat)}/${dateFuture.toFormat(defaultFormat)}`;
}

export function template(templateRe, str, data) {
  // copy of leaflet template function, which does not export it
  // used for getting areaIndicator URL with properties replacing templates
  return str.replace(templateRe, (stri, key) => {
    let value = data[key];

    if (value === undefined) {
      throw new Error(`No value provided for variable ${stri}`);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}
export async function loadFeatureData(baseConfig, feature) {
  const parsedData = {};
  const { indicatorObject } = feature.getProperties().properties;
  // Fetch data from geodb
  const geodbUrl = 'https://xcube-geodb.brockmann-consult.de/eodash/6bf15325-f6a0-4b6a-bf80-a2491753f8f2/eodash';
  const url = `${geodbUrl}_${indicatorObject.indicator}?aoi_id=eq.${indicatorObject.aoiID}`;
  // Fetch location data
  const response = await axios.get(url, { credentials: 'same-origin' });
  if (response) {
    const { data } = response;
    // Set data to indicator object
    // Convert data first
    const mapping = {
      colorCode: 'color_code',
      dataProvider: 'data_provider',
      eoSensor: 'eo_sensor',
      indicatorValue: 'indicator_value',
      inputData: 'input_data',
      measurement: 'measurement_value',
      referenceTime: 'reference_time',
      referenceValue: 'reference_value',
      time: 'time',
      siteName: 'city',
    };
    // Special handling for mobility, covid and other special data
    if ('Values' in data) {
      parsedData.time = data.Values.map((t) => DateTime.fromISO(t));
      parsedData.Values = data.Values;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        Object.entries(mapping).forEach(([key, value]) => {
          let val = data[i][value];
          if (Object.prototype.hasOwnProperty.call(parsedData, key)) {
            // If key already there add element to array
            if (['time', 'referenceTime'].includes(key)) {
              val = DateTime.fromISO(val);
            } else if (['measurement'].includes(key)) {
              if (val.length > 0) {
                // We have a special array case here
                if (val[0] === '[') {
                  val = val.replace(/[[\]']+/g, '').split(',').map(Number);
                } else {
                  val = Number(val);
                }
              } else {
                val = Number.NaN;
              }
            }
            parsedData[key].push(val);
          } else {
            // If not then set element as array
            if (['time', 'referenceTime'].includes(key)) {
              val = DateTime.fromISO(val);
            } else if (['measurement'].includes(key)) {
              if (val.length > 0) {
                // We have a special array case here
                if (val[0] === '[') {
                  val = val.replace(/[[\]']+/g, '').split(',').map(Number);
                } else {
                  val = Number(val);
                }
              } else {
                val = Number.NaN;
              }
            }
            parsedData[key] = [val];
          }
        });
      }
    }
  }
  return parsedData;
}

export async function loadIndicatorData(baseConfig, payload) {
  let indicatorObject = payload;

  if (payload.type === 'stac') {
    indicatorObject = payload;
    const response = await fetch(payload.link);
    const jsonData = await response.json();

    let timeBasedLayerFound = false;
    // Configure display based on type
    const wmsEndpoint = jsonData.links.find((item) => item.rel === 'wms');
    if (wmsEndpoint) {
      const layers = wmsEndpoint['wms:layers'].join(',');
      indicatorObject.display = {
        baseUrl: wmsEndpoint.href,
        name: jsonData.name,
        layers,
        // legendUrl: 'legend.png',
        minZoom: 1,
        maxZoom: 13,
        dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        // TODO: need to think how the stat api acces can be described in stac disabling for now
        /*
        customAreaIndicator: true,
        areaIndicator: {
          ...shFisAreaIndicatorStdConfig,
          url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_WIND_U_10M&CRS=CRS:84&TIME=1950-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
        },
        */
      };
      timeBasedLayerFound = true;
    } else {
      indicatorObject.display = null;
    }

    const times = [];
    if (timeBasedLayerFound) {
      jsonData.links.forEach((link) => {
        if (link.rel === 'item') {
          times.push(link.datetime);
        }
      });
      times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
    }

    const features = [];
    if (payload.endpointType === 'GeoDB') {
      // We create all relevant features (pois) to be shown on map
      jsonData.links.forEach((link) => {
        if (link.rel === 'item') {
          const featureObject = {};
          const coordinates = link.latlng.split(',').map(Number);
          featureObject.aoiID = link.id;
          featureObject.isFeature = true;
          featureObject.aoi = latLng([coordinates[0], coordinates[1]]);
          featureObject.indicator = jsonData.id;
          featureObject.indicatorValue = [''];
          featureObject.city = link.city;
          featureObject.country = link.country;
          // featureObject.description = jsonData.description;
          features.push({
            id: link.id,
            properties: {
              indicatorObject: featureObject,
            },
          });
        }
      });
      store.commit('features/SET_FEATURES', features);
    }
    indicatorObject.time = times;
  }
  return indicatorObject;
}

export function isExternalUrl(urlString) {
  try {
    // throws exception when url does not have a scheme
    const url = new URL(urlString);
    // does this url originate from original website
    if (url.origin !== new URL(document.URL, document.baseURI).origin) {
      return true;
    }
  } catch (_e) {
    // throws an exception if url is malformed
    /* eslint-disable no-new */
    new URL(urlString, document.baseURI);
  }
  return false;
}

// eslint-disable-next-line no-unused-vars
function handleDebugPolygon() {
  const { map } = getMapInstance('centerMap');
  const layers = map.getLayers().getArray();
  let debugLayer = layers.find((l) => l.get('name') === 'debugLayer');
  if (!debugLayer) {
    debugLayer = new Vector({
      zIndex: 999999999,
      source: new VectorSource({
        features: [new Feature({})],
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(200, 100, 0, 0.5)',
          width: 40,
        }),
      }),
    });
    debugLayer.set('name', 'debugLayer');
    map.addLayer(debugLayer);
    map.on('moveend', handleDebugPolygon);
  }
  const feature = debugLayer.getSource().getFeatures()[0];
  feature.setGeometry(fromExtent(map.getView().calculateExtent(map.getSize())));
}

export function calculatePadding() {
  // we can further refine the padding to use based on which panels are open
  // TODO: This will probably no longer be used as Robert will reimplement this with ol extent
  const dataPanelOpen = (document.querySelector('.data-panel') !== null)
    && document.querySelector('.data-panel').className.includes('v-navigation-drawer--open');
  const dataPanelWidth = !dataPanelOpen ? 0 : document.querySelector('.data-panel').clientWidth;
  const searchResultsClosed = store.state.features.featureFilters.indicators.length
    || store.state.features.featureFilters.countries.length;
  const searchPanelWidth = (document.querySelector('#list') !== null)
    ? (document.querySelector('#list').clientWidth + 40) : 0;
  const searchResultWidth = !searchResultsClosed ? searchPanelWidth : 0;
  const demoItemsWidth = (document.querySelector('#demoItemsList') !== null)
    ? (document.querySelector('#demoItemsList').clientWidth) : 0;
  const percentageBasedOffsetWidth = Math.floor(window.innerWidth * 0.12);
  const padding = [
    70,
    percentageBasedOffsetWidth + dataPanelWidth,
    150,
    percentageBasedOffsetWidth + searchResultWidth + demoItemsWidth,
  ];
  return padding;
  // TODO  cleanup
  // const { map } = getMapInstance('centerMap');
  // const view = map.getView();
  // view.padding = padding;
  // handleDebugPolygon();
}

/**
 * registry of "clean" indicators (input data filtered)
 */
const indicatorRegistry = {};

export function getIndicatorFilteredInputData(selectedIndicator) {
  if (!selectedIndicator && !store.state.indicators.selectedIndicator) {
    return null;
  }
  const indicator = selectedIndicator || { ...store.state.indicators.selectedIndicator };
  // use possible overrides from baseConfig
  const { inputData } = generateUsedTimes(indicator);
  if (!inputData) {
    return null;
  }
  const locationCode = getLocationCode(indicator, store.state.features.selectedFeature);
  if (indicatorRegistry[locationCode]) {
    return indicatorRegistry[locationCode];
  }

  // filter out rows which have empty "Input Data"
  const mask = inputData.map((item) => item !== '' && item !== '/');
  // filtering only arrays with more than 1 element to not fail on Input Data:['value'] shortcut
  if (mask.length > 1) {
    for (let [key, value] of Object.entries(indicator)) { // eslint-disable-line
      if (Array.isArray(value) && value.length > 1) {
        indicator[key] = value.filter((item, i) => mask[i]);
      }
    }
  }
  indicatorRegistry[locationCode] = indicator;
  return indicator;
}

export function getPOIs() {
  const ftrs = store.state.features.allFeatures;
  ftrs.sort(
    (a, b) => a.properties.indicatorObject.indicator - b.properties.indicatorObject.indicator,
  );
  const arr = [];
  ftrs.forEach((item) => {
    const { aoiID, indicator } = item.properties.indicatorObject;
    const output = `${aoiID}-${indicator}`;
    arr.push(output);
  });
  console.log(arr.join(','));
}
