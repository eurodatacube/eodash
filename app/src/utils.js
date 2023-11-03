import { DateTime } from 'luxon';
import axios from 'axios';
import store from '@/store';
import { generateUsedTimes } from '@/helpers/mapConfig';
import getLocationCode from './mixins/getLocationCode';

export function padLeft(str, pad, size) {
  let out = str;
  while (out.length < size) {
    out = pad + str;
  }
  return out;
}

export function simplifiedshTimeFunction(date) {
  let tempDate = date;
  if (!Array.isArray(tempDate)) {
    tempDate = [tempDate];
  }
  const dateObj = DateTime.fromISO(tempDate[0]);
  const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss";
  return `${dateObj.toFormat(defaultFormat)}/${dateObj.toFormat(defaultFormat)}`;
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
      console.error(`No value provided for variable ${stri}`);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}

export async function loadIndicatorExternalData(time, mergedConfig) {
  const geodbUrl = 'https://xcube-geodb.brockmann-consult.de/';
  const endpoint = 'gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_';
  const timeKey = mergedConfig.timeKey || 'time';
  const base = `${geodbUrl}${endpoint}${mergedConfig.id}`;
  const timequery = `${timeKey}=eq.${time}`;
  const url = `${base}?${timequery}&select=${mergedConfig.parameters}`;
  const data = await fetch(url)
    .then((response) => response.json())
    .catch((error) => console.log(error));
  // convert to object
  const dataObject = {};
  data.forEach((entry) => {
    dataObject[entry[mergedConfig.adminZoneKey]] = { ...entry };
  });
  return dataObject;
}

export async function loadIndicatorData(baseConfig, payload) {
  let indicatorObject;
  // Check if data was already loaded
  if (Object.prototype.hasOwnProperty.call(payload, 'dataLoadFinished')
    && payload.dataLoadFinished) {
    indicatorObject = payload;
  } else {
    // Start loading of data from indicator
    let { dataPath } = baseConfig;
    const indDefs = baseConfig.indicatorsDefinition;
    const currInd = payload.indicator;

    if (currInd in indDefs && 'geoDBDataQuery' in indDefs[currInd]) {
      // TODO: As we are considering migrating things to geodb, we should re-evaluate and
      // re-implement this
      const { geoDBDataQuery, geoDBParameters } = indDefs[currInd];
      const geodbUrl = 'https://xcube-geodb.brockmann-consult.de/';
      const endpoint = 'gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_';
      const base = `${geodbUrl}${endpoint}${geoDBDataQuery}`;
      const url = `${base}&select=${geoDBParameters}`;
      const data = await fetch(url)
        .then((response) => response.json())
        .catch((error) => console.log(error));
      // convert to indicator
      const masurementData = [];
      const referenceValue = [];
      const times = [];
      data.sort((a, b) => (
        DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
      ));
      const otherParams = geoDBParameters.split(',').slice(2);
      data.forEach((entry) => {
        const measurement = entry[geoDBParameters.split(',')[1]];
        const other = [];
        otherParams.forEach((ref) => {
          other.push(entry[ref]);
        });
        masurementData.push(measurement);
        referenceValue.push(other);
        times.push(DateTime.fromISO(entry.date));
      });
      indicatorObject = payload;
      indicatorObject.measurement = masurementData;
      indicatorObject.referenceValue = referenceValue;
      indicatorObject.time = times;
      indicatorObject.dataLoadFinished = true;
    } else {
      // Check if indicator uses another data path
      if (currInd in indDefs && 'alternateDataPath' in indDefs[currInd]) {
        dataPath = indDefs[currInd].alternateDataPath;
      }
      const url = `${dataPath}${[payload.aoiID, payload.indicator].join('-')}.json`;
      // Fetch location data
      const response = await axios.get(url, { credentials: 'same-origin' });
      if (response) {
        const { data } = response;
        indicatorObject = payload;
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
          siteName: 'site_name_arr',
        };
        // Global indicator case where we do not want the siteName to be overwritten
        if (payload.country === 'indicatorall') {
          delete mapping.siteName;
        }

        const parsedData = {};
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
        Object.entries(parsedData).forEach(([key, value]) => {
          indicatorObject[key] = value;
        });
        indicatorObject.dataLoadFinished = true;
      }
    }
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
  const locationCode = getLocationCode(indicator);
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

export const findClosest = (data, target = DateTime.now()) => data.reduce((prev, curr) => {
  const a = Math.abs(curr.ts - target.ts);
  const b = Math.abs(prev.ts - target.ts);
  return a - b < 0 ? curr : prev;
});
