import { DateTime } from 'luxon';
import axios from 'axios';

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

export async function loadIndicatorData(baseConfig, payload) {
  let indicatorObject;

  // Check if data was already loaded
  if (Object.prototype.hasOwnProperty.call(payload, 'dataLoadFinished')
    && payload.dataLoadFinished) {
    indicatorObject = payload;
  } else {
    // Start loading of data from indicator
    let { dataPath } = baseConfig;
    // Check if indicator uses another data path
    const indDefs = baseConfig.indicatorsDefinition;
    const currInd = payload.indicator;
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
