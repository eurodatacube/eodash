import { Wkt } from 'wicket';
import { template } from '@/utils';
import { DateTime } from 'luxon';
// TODO: disabled recaptcha
// import { load } from 'recaptcha-v3';


const wkt = new Wkt();

export const statisticalApiHeaders = {
  url: 'https://services.sentinel-hub.com/api/v1/statistics',
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
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
        from: '1900-01-01T00:00:00Z',
        to: '2040-12-01T00:00:00Z',
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

export const shFisAreaIndicatorStdConfig = Object.freeze({
  callbackFunction: (responseJson, indicator) => {
    if (Array.isArray(responseJson.C0)) {
      const data = responseJson.C0;
      const newData = {
        time: [],
        measurement: [],
        referenceValue: [],
        colorCode: [],
      };
      data.sort((a, b) => ((DateTime.fromISO(a.date) > DateTime.fromISO(b.date))
        ? 1
        : -1));
      data.forEach((row) => {
        newData.time.push(DateTime.fromISO(row.date));
        newData.colorCode.push('');
        newData.measurement.push(row.basicStats.mean);
        newData.referenceValue.push(`[${row.basicStats.mean}, ${row.basicStats.stDev}, ${row.basicStats.max}, ${row.basicStats.min}]`);
      });
      const ind = {
        ...indicator,
        ...newData,
      };
      return ind;
    }
    return null;
  },
  areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
});

export const parseStatAPIResponse = (requestJson, indicator) => {
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
    };
    data.sort((a, b) => (
      (DateTime.fromISO(a.interval.from) > DateTime.fromISO(b.interval.from))
        ? 1
        : -1));
    data.forEach((row) => {
      // Make sure to discard possible errors from sentinelhub
      if (!Object.prototype.hasOwnProperty.call(row, 'error')) {
        const { stats } = row.outputs.data.bands.B0;
        newData.time.push(DateTime.fromISO(row.interval.from));
        newData.colorCode.push('');
        newData.measurement.push(stats.mean);
        newData.referenceValue.push(
          `[null, ${stats.stDev}, ${stats.max}, ${stats.min}]`,
        );
      }
    });
    const ind = {
      ...indicator,
      ...newData,
    };
    return ind;
  }
  return null;
};

export const evalScriptsDefinitions = Object.freeze({
  'AWS_NO2-VISUALISATION':
    `//VERSION=3
    function setup() {
      return {
        input: [{
          bands: [
            "tropno2",
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
      if (samples.tropno2 >= 1e20 ){
          validValue = 0
      }
      let index = samples.tropno2;
      return {
        data:  [index],
        dataMask: [samples.dataMask * validValue]
      }
    }`,
  AWS_VIS_SO2_DAILY_DATA:
    `//VERSION=3
    function setup() {
      return {
        input: [{
          bands: [
            "so2",
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
      if (samples.so2 >= 1e20 ){
          validValue = 0
      }
      let index = samples.so2;
      return {
        data: [index],
        dataMask: [samples.dataMask * validValue]
      }
    }`,
  BICEP_NPP_VIS_PP:
    `//VERSION=3
    function setup() {
      return {
        input: [{
          bands: [
            "pp",
            "dataMask"
          ]
        }],
        output: [
          {
            id: "data",
            bands: 1,
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
      if (samples.pp >= 1e20 ){
          validValue = 0
      }
      let index = samples.pp;
      return {
        data: [index],
        dataMask: [samples.dataMask * validValue]
      }
    }`,
});

const fetchCustomAreaObjects = async (
  options,
  drawnArea,
  validDrawnArea,
  mergedConfig,
  indicatorObject,
  lookup,
) => {
  const indicator = indicatorObject;
  // add custom area if present
  let customArea = {};
  if (validDrawnArea) {
    customArea = typeof mergedConfig[lookup].areaFormatFunction === 'function'
      ? mergedConfig[lookup].areaFormatFunction(drawnArea)
      : { area: JSON.stringify(drawnArea) };
  }
  indicator.title = 'User defined area of interest';
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
      if (params[i] === 'geojson') {
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
  /*
  // TODO: disabling recaptcha strategy for now
  // Prepare our credentials for the Statistical API
  const recaptcha = await load('6LddKgUfAAAAAKSlKdCJWo4XTQlTPcKZWrGLk7hh', {
    autoHideBadge: true,
  });
  const token = await recaptcha.execute('token_assisted_anonymous');
  const { origin, hostname } = window.location;
  const clientId = shConfig[hostname];
  const oauthUrl = `https://services.sentinel-hub.com/oauth/token/assisted?client_id=${clientId}&redirect_uri=${encodeURIComponent(origin)}&response_type=token&grant_type=client_credentials&recaptcha=${token}`;
  const res = await fetch(oauthUrl);
  const html = await res.text();

  // Search for the postMessage JSON and extract the full message from HTML
  const startPos = html.search('window.parent.postMessage') + 26;
  const endPos = html.search('},') + 1;
  const message = JSON.parse(html.slice(startPos, endPos));

  // Set the Authorization header using the Bearer token we generated using reCAPTCHA.
  requestOpts.headers.Authorization = `Bearer ${message.access_token}`;

  // this.map.fireEvent('dataloading');
  */
  const customObjects = await fetch(url, requestOpts).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => { throw text; });
    }
    return response.json();
  })
    .then((rwdata) => {
      if (typeof mergedConfig[lookup].callbackFunction === 'function') {
        // merge data from current indicator data and new data from api
        // returns new indicator object to set as custom area indicator
        return mergedConfig[lookup].callbackFunction(rwdata, indicator);
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
  return customObjects;
};

export default fetchCustomAreaObjects;
