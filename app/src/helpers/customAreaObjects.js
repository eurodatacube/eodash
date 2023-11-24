import { DateTime } from 'luxon';
import axios from 'axios';

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

export const statisticalApiHeaders = {
  url: 'https://services.sentinel-hub.com/api/v1/statistics',
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
};

export const fetchCustomDataOptions = (time, sourceOptionsObj, store) => {
  const outputOptionsObj = {};
  const indicator = sourceOptionsObj?.indicator
  || store.state.indicators?.selectedIndicator?.indicator;
  outputOptionsObj.indicator = indicator;
  const aoiID = sourceOptionsObj?.aoiID
  || store.state.indicators?.selectedIndicator?.aoiID;
  outputOptionsObj.aoiID = aoiID;

  if (sourceOptionsObj?.siteMapping) {
    // substitutes {siteMapping} template
    const currSite = sourceOptionsObj.siteMapping(
      aoiID,
    );
    outputOptionsObj.site = currSite;
  }

  if (time) {
    // substitutes {time} template possibly utilizing dateFormatFunction
    const fixTime = time.value || time;
    outputOptionsObj.time = typeof sourceOptionsObj.dateFormatFunction === 'function'
      ? sourceOptionsObj.dateFormatFunction(fixTime) : fixTime;
    if (sourceOptionsObj.specialEnvTime) {
      outputOptionsObj.env = `year:${outputOptionsObj.time}`;
    }
    // substitutes {featuresTime} template possibly utilizing features.dateFormatFunction
    if (sourceOptionsObj?.features) {
      outputOptionsObj.featuresTime = typeof sourceOptionsObj.features.dateFormatFunction === 'function'
        ? sourceOptionsObj.features.dateFormatFunction(fixTime) : fixTime;
    }
  }
  const paramsToPassThrough = ['env'];
  paramsToPassThrough.forEach((param) => {
    if (typeof sourceOptionsObj[param] !== 'undefined') {
      outputOptionsObj[param] = sourceOptionsObj[param];
    }
  });
  return outputOptionsObj;
};

export const statisticalApiBody = (evalscript, type, timeinterval) => ({
  requestBody: {
    input: {
      bounds: {
        geometry: {
          type: 'Polygon',
          coordinates: '{coordinates}',
        },
      },
      data: [
        {
          dataFilter: {},
          type,
        },
      ],
    },
    aggregation: {
      timeRange: {
        from: '1995-01-01T00:00:00Z',
        to: '2030-12-01T00:00:00Z',
      },
      aggregationInterval: {
        of: timeinterval || 'P1D',
      },
      width: 100,
      height: 100,
      evalscript,
    },
    calculations: {
      default: {},
    },
  },
});

export const parseStatAPIResponse = (
  requestJson, indicator, indicatorCode = 'SHCustomLineChart',
) => {
  // We need to also accept partial responses as it seems some datasets
  // have issues on sinergise side
  if ((requestJson.status === 'OK' || requestJson.status === 'PARTIAL')
      && requestJson.data.length > 0) {
    const { data } = requestJson;
    const newData = {
      time: [],
      measurement: [],
      referenceValue: [],
      colorCode: [],
      sampleSize: [],
      noDataCount: [],
      sampleCount: [],
    };
    data.sort((a, b) => (
      (DateTime.fromISO(a.interval.from) > DateTime.fromISO(b.interval.from))
        ? 1
        : -1));
    data.forEach((row) => {
      // Make sure to discard possible errors from sentinelhub
      if (row && !Object.prototype.hasOwnProperty.call(row, 'error')) {
        const { stats } = row.outputs.data.bands.B0;
        newData.time.push(DateTime.fromISO(row.interval.from));
        newData.colorCode.push('');
        newData.measurement.push(stats.mean);
        newData.referenceValue.push(
          `[null, ${stats.stDev}, ${stats.max}, ${stats.min}]`,
        );
        newData.noDataCount.push(stats.noDataCount);
        newData.sampleCount.push(stats.sampleCount);
      }
    });
    if (indicatorCode) {
      // if we for some reason need to change indicator code of custom chart data
      newData.indicator = indicatorCode;
    }
    const ind = {
      ...indicator,
      ...newData,
    };
    return ind;
  }
  return null;
};

function defaultEvalScriptDef(bandname, maxOutlierFilterOut = 1e20) {
  return `//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "${bandname}",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "data",
        bands: 1,
        sampleType: "FLOAT32"
      },
      {
        id: "dataMask",
        bands: 1
      }
    ]
  }
}
function evaluatePixel(samples) {
  let validValue = 1
  if (samples.${bandname} >= ${maxOutlierFilterOut}){
      validValue = 0
  }
  let index = samples.${bandname};
  return {
    data:  [index],
    dataMask: [samples.dataMask * validValue]
  }
}`;
}

export const evalScriptsDefinitions = Object.freeze({
  'AWS_NO2-VISUALISATION': defaultEvalScriptDef('tropno2'),
  AWS_CH4_WEEKLY_DATA: defaultEvalScriptDef('ch4'),
  AWS_VIS_SO2_DAILY_DATA: defaultEvalScriptDef('so2'),
  BICEP_NPP_VIS_PP: defaultEvalScriptDef('pp'),
  AWS_VIS_CO_3DAILY_DATA: defaultEvalScriptDef('co'),
  AWS_VIS_SST_MAPS: defaultEvalScriptDef('sst'),
  AWS_VIS_CHL_MAPS: defaultEvalScriptDef('chl', 2e3),
  AWS_VIS_TSM_MAPS: defaultEvalScriptDef('tsmnn', 2e3),
  LAKES_SURFACE_WATER_TEMPERATURE: defaultEvalScriptDef('waterTemperature'),
  'GHS-BUILT-S_GLOBE_R2023A': defaultEvalScriptDef('BUILT'),
});

// Define custom fetch function with configurable timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 20000 } = options;

  const abortController = new AbortController();
  const id = setTimeout(() => abortController.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: abortController.signal,
  });
  clearTimeout(id);
  return response;
}

export const fetchCustomAreaObjects = async (
  options,
  drawnArea,
  mergedConfig,
  indicatorObject,
  lookup,
  store,
) => {
  const indicator = indicatorObject;
  // add custom area if present
  let customArea = {};
  if (drawnArea) {
    customArea = typeof mergedConfig[lookup].areaFormatFunction === 'function'
      ? mergedConfig[lookup].areaFormatFunction(drawnArea)
      : { area: JSON.stringify(drawnArea) };
  }
  const templateSubst = {
    ...indicator,
    ...options,
    ...customArea,
  };
  const templateRe = /\{ *([\w_ -]+) *\}/g;
  const url = template(templateRe, mergedConfig[lookup].url, templateSubst);
  let requestBody = null;
  if (Object.prototype.hasOwnProperty.call(mergedConfig[lookup], 'requestBody')) {
    requestBody = {
      ...mergedConfig[lookup].requestBody,
    };
    // Here we set the current bounds geometry values
    if (requestBody.input && requestBody.input.bounds) {
      requestBody.input.bounds.geometry = drawnArea;
    }
    const params = Object.keys(requestBody);
    for (let i = 0; i < params.length; i += 1) {
      // substitute template strings with values
      if (typeof requestBody[params[i]] === 'string') {
        requestBody[params[i]] = template(templateRe, requestBody[params[i]], templateSubst);
      }
      // Convert geojsons back to an object
      if (['geojson', 'coordinates'].includes(params[i])) {
        requestBody[params[i]] = JSON.parse(requestBody[params[i]]);
      }
    }
  }
  const requestOpts = {
    credentials: 'same-origin',
    method: mergedConfig[lookup].requestMethod || 'GET',
    headers: mergedConfig[lookup].requestHeaders || {},
  };
  if (requestBody) {
    requestOpts.body = JSON.stringify(requestBody);
  }
  // TODO: We use url to check if we previously fetch token, maybe want to use
  // another type of switch to select which auth type we want to use
  if (indicator.display && indicator.display.areaIndicator
      && indicator.display.areaIndicator.url.includes('api/v1/statistics')) {
    // Only needed for SH statistics requests
    const clientId = shConfig.statApiClientId;
    const clientSecret = shConfig.statApiClientSecret;
    const instance = axios.create({
      baseURL: 'https://services.sentinel-hub.com',
    });
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    const body = `client_id=${clientId}&client_secret=${clientSecret}&response_type=token&grant_type=client_credentials`;
    let accessToken = null;

    // All requests using this instance will have an access token automatically added
    await instance.post('/oauth/token', body, config).then((resp) => {
      accessToken = resp.data.access_token;
    });
    // Set the Authorization header using the Bearer token
    requestOpts.headers.Authorization = `Bearer ${accessToken}`;
  }
  // This method takes care of all types of custom requests
  //   - custom area request to NASA endpoint
  //   - geodb request for truck detections?
  //   - requests to statistical api
  //   anything else?

  // The requests for statistical api need to be split into multiple parallel requests
  // so splitting up the behavior here for that use case
  let customObjects = null;
  if (requestBody && 'aggregation' in requestBody && 'timeRange' in requestBody.aggregation) {
    // Hanlder for SH Statistics requests
    // Create data range chunks for requests
    // In order to get better performance we take the time information of the
    // indicator to fetch for the actual time interval available
    const times = indicator.time.map((entry) => DateTime.fromISO(entry));
    const start = times[0];
    const end = times[times.length - 1];
    const format = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    // create a variable step based on the size of time array,
    // making a maximum of 30 requests to avoid rate limiting
    const step = end.diff(start, ['days']).toObject();
    step.days = Math.round(step.days / 30);

    let currentDate = start;
    const requests = [];
    // We dont want to modify the original request body, so we create a copy here
    const requestBodyCopy = JSON.parse(JSON.stringify(requestBody));
    while (currentDate < end) {
      requestBodyCopy.aggregation.timeRange.from = currentDate.toFormat(format);
      currentDate = DateTime.fromISO(currentDate.toFormat(format)).plus(step);
      requestBodyCopy.aggregation.timeRange.to = currentDate.toFormat(format);
      requestOpts.body = JSON.stringify(requestBodyCopy);
      requests.push(fetchWithTimeout(url, requestOpts).then((res) => res.json()));
    }

    customObjects = await Promise.allSettled(requests)
      .then((promiseCollection) => {
        // Merge them together, for parsing
        // TODO: Add check to see if partial result was returned as status
        const status = 'OK';
        const data = promiseCollection.map((entry) => {
          let d = [];
          // We take here fulfilled datasets, rejected status is probably from timeout
          if (entry.status === 'fulfilled') {
            d = entry.value.data;
          }
          return d;
        }).flat();
        // Check to see if there were rejected requests due to timeout
        const timeoutDetected = promiseCollection.find((entry) => entry.status === 'rejected');
        if (timeoutDetected) {
          if (store) {
            store.commit('sendAlert', {
              message: 'There were some issues retrieving the data, possibly only partial results are shown. Please try the request again.',
              type: 'warning',
            });
          }
        }
        const mergedData = {
          status,
          data,
        };
        if (typeof mergedConfig[lookup].callbackFunction === 'function') {
          return mergedConfig[lookup].callbackFunction(mergedData, indicator);
        }
        return promiseCollection;
      })
      .then((newIndicator) => {
        let custom = {};
        if (newIndicator) {
          if (drawnArea) {
            custom.poi = drawnArea.coordinates.flat(Infinity).join('-');
            custom.includesIndicator = true;
          }
          custom = {
            ...newIndicator,
            ...custom,
          };
        }
        return custom;
      });
  } else if (mergedConfig[lookup].url.includes('/cog/statistics')) {
    // Here we handle parallel requests to the new statistical api from nasa
    const requests = [];
    // Add limit on how many requests we can send if there are over 600 time entries
    // TODO: Sending more requests overloads server, need to think how to handle this
    let requestTimes = indicator.time;
    if (indicator.time.length > 600) {
      requestTimes = indicator.time.slice(-600);
    }
    requestTimes.forEach((entry) => {
      const requestUrl = `${url}?url=${entry[1]}`;
      requestOpts.body = JSON.stringify(requestBody.geojson);
      [requestOpts.time] = entry;
      requests.push(
        fetch(requestUrl, requestOpts).then((res) => res.json()).then((json) => {
          // eslint-disable-next-line no-param-reassign
          [json.time] = entry;
          return json;
        }),
      );
    });
    customObjects = await Promise.allSettled(requests)
      .then((promiseCollection) => {
        const data = promiseCollection.map((entry) => {
          let d = [];
          // We take here fulfilled datasets, rejected status is probably from timeout
          if (entry.status === 'fulfilled' && 'properties' in entry.value
              && 'statistics' in entry.value.properties) {
            const stats = entry.value.properties.statistics;
            d = entry.value.properties.statistics[Object.keys(stats)[0]];
            d.time = entry.value.time;
          }
          return d;
        }).flat();
        if (typeof mergedConfig[lookup].callbackFunction === 'function') {
          return mergedConfig[lookup].callbackFunction(data, indicator);
        }
        return promiseCollection;
      })
      .then((newIndicator) => {
        let custom = {};
        if (newIndicator) {
          if (drawnArea) {
            custom.poi = drawnArea.coordinates.flat(Infinity).join('-');
            custom.includesIndicator = true;
          }
          custom = {
            ...newIndicator,
            ...custom,
          };
        }
        return custom;
      });
  } else {
    customObjects = await fetch(url, requestOpts).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw text; });
      }
      return response.json();
    })
      .then((rwdata) => {
        if (typeof mergedConfig[lookup].callbackFunction === 'function') {
          // merge data from current indicator data and new data from api
          // returns new indicator object to set as custom area indicator
          return mergedConfig[lookup].callbackFunction(rwdata, indicator, drawnArea);
        }
        return rwdata;
      })
      .then((newIndicator) => {
        let custom = {};
        if (newIndicator) {
          if (drawnArea) {
            custom.poi = drawnArea.coordinates.flat(Infinity).join('-');
            custom.includesIndicator = true;
          }
          custom = {
            ...newIndicator,
            ...custom,
          };
        }
        return custom;
      })
      .catch((error) => {
        let errorMessage = error;
        try {
          errorMessage = JSON.parse(error).detail[0].msg;
        } catch (parseError) {
          console.log(parseError);
        }
        if (typeof errorMessage !== 'object') {
          if (errorMessage.startsWith('<?xml')) {
            // Lets extract the Service excepcion first
            errorMessage = errorMessage.slice(
              errorMessage.indexOf('<ServiceException>') + 18,
              errorMessage.indexOf('</ServiceException>'),
            );
            // now we remove the rest
            errorMessage = errorMessage.slice(
              errorMessage.indexOf('<![CDATA[') + 9,
              errorMessage.indexOf(']]>'),
            );
          }
          // If it is neither a JSON nor an XML we output the body
          throw Error(errorMessage);
        } else {
          // If error message is an object it is probably the returned html
          console.log('Possible issue retrieving geoJSON for specified time');
        }
      });
  }
  return customObjects;
};

export const xcubeAnalyticsConfig = (
  exampleEndpoint,
  indicatorCode = 'XCubeCustomLineChart',
) => ({
  url: exampleEndpoint.href,
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    type: 'Polygon',
    coordinates: '{coordinates}',
  },
  callbackFunction: (responseJson, indicator) => {
    let ind = null;
    if (Array.isArray(responseJson.result)) {
      const data = responseJson.result;
      const newData = {
        time: [],
        measurement: [],
      };
      data.forEach((row) => {
        newData.time.push(DateTime.fromISO(row.time));
        newData.measurement.push(row.median);
      });
      if (indicatorCode) {
        // if we for some reason need to change indicator code of custom chart data
        newData.indicator = indicatorCode;
      }
      ind = {
        ...indicator,
        ...newData,
      };
    }
    return ind;
  },
  areaFormatFunction: (area) => (
    {
      coordinates: JSON.stringify(area.coordinates),
    }
  ),
});

export const xcubeAnalyticsConfig = (
  exampleEndpoint,
  indicatorCode = 'XCubeCustomLineChart',
) => ({
  url: exampleEndpoint.href,
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    type: 'Polygon',
    coordinates: '{coordinates}',
  },
  callbackFunction: (responseJson, indicator) => {
    let ind = null;
    if (Array.isArray(responseJson.result)) {
      const data = responseJson.result;
      const newData = {
        time: [],
        measurement: [],
      };
      data.forEach((row) => {
        newData.time.push(DateTime.fromISO(row.time));
        newData.measurement.push(row.median);
      });
      if (indicatorCode) {
        // if we for some reason need to change indicator code of custom chart data
        newData.indicator = indicatorCode;
      }
      ind = {
        ...indicator,
        ...newData,
      };
    }
    return ind;
  },
  areaFormatFunction: (area) => (
    {
      coordinates: JSON.stringify(area.coordinates),
    }
  ),
});

export const nasaStatisticsConfig = (
  rescale = (value) => value / 1e14,
  indicatorCode = 'NASACustomLineChart',
) => ({
  url: 'https://staging-raster.delta-backend.com/cog/statistics',
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    geojson: '{geojson}',
  },
  callbackFunction: (responseJson, indicator) => {
    let ind = null;
    if (Array.isArray(responseJson)) {
      const data = responseJson;
      const newData = {
        time: [],
        measurement: [],
        colorCode: [],
        referenceValue: [],
      };
      data.forEach((row) => {
        if (!('error' in row)) {
          newData.time.push(DateTime.fromISO(row.time));
          newData.colorCode.push('');
          newData.measurement.push(rescale(row.mean));
          newData.referenceValue.push(`[${rescale(row.median)}, ${rescale(row.std)}, ${rescale(row.max)}, ${rescale(row.min)}]`);
        }
      });
      if (indicatorCode) {
        // if we for some reason need to change indicator code of custom chart data
        newData.indicator = indicatorCode;
      }
      ind = {
        ...indicator,
        ...newData,
      };
    } else if (Object.keys(responseJson).indexOf('detail') !== -1) {
      console.log(responseJson.detail[0].msg);
    }
    return ind;
  },
  areaFormatFunction: (area) => (
    {
      geojson: JSON.stringify({
        type: 'Feature',
        properties: {},
        geometry: area,
      }),
    }
  ),
});
