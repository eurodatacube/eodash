import { template } from '@/utils';
import { load } from 'recaptcha-v3';

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
  if (mergedConfig[lookup].requestBody) {
    requestBody = {
      ...mergedConfig[lookup].requestBody,
    };
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

  // Prepare our credentials for the Statistical API
  const recaptcha = await load('6LddKgUfAAAAAKSlKdCJWo4XTQlTPcKZWrGLk7hh');
  const token = await recaptcha.execute('token_assisted_anonymous');
  const clientId = 'e97cf094-6512-4b31-9a41-63f34eb5e2a3';
  const oauthUrl = `https://services.sentinel-hub.com/oauth/token/assisted?client_id=${clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F:8080&response_type=token&grant_type=client_credentials&recaptcha=${token}`;
  const res = await fetch(oauthUrl);
  const html = await res.text();

  // Search for the postMessage JSON and extract the full message from HTML
  const startPos = html.search('window.parent.postMessage') + 26;
  const endPos = html.search('},') + 1;
  const message = JSON.parse(html.slice(startPos, endPos));

  // If the Statistical-API-specific bounds structure happens
  // to exist, replace that right away so we always have bounds.
  if (requestBody.input.bounds.geometry.coordinates) {
    // This structure is an array in an array because the API demands it.
    const coords = [[]];
    // Save latitudes and longitudes since we'll need them later.
    let longitudes = [];
    let latitudes = [];
    for (let latLong of drawnArea.coordinates[0]) { // eslint-disable-line
      // The conversion between Leaflet's LatLong format and
      // GeoJSON's LongLat format happens here.
      coords[0].push(latLong.reverse());
      latitudes.push(latLong[0]);
      longitudes.push(latLong[1]);
    }
    requestBody.input.bounds.geometry.coordinates = coords;
    // Filter latitude and longitude arrays so all items are unique.
    latitudes = latitudes.filter((value, index, self) => self.indexOf(value) === index);
    longitudes = longitudes.filter((value, index, self) => self.indexOf(value) === index);
    // Calculate the appropriate resolution for the current bounding box.
    requestBody.aggregation.resx = Math.abs(
      (Math.max(...longitudes) - Math.min(...longitudes)) / 100,
    );
    requestBody.aggregation.resy = Math.abs(
      (Math.max(...latitudes) - Math.min(...latitudes)) / 100,
    );

    // Set the Authorization header using the Bearer token we generated using reCAPTCHA.
    requestOpts.headers.Authorization = `Bearer ${message.access_token}`;
  }

  // this.map.fireEvent('dataloading');
  const customObjects = await fetch(url, requestOpts).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
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
    .catch((err) => {
      throw Error(err);
    });
  return customObjects;
};

export default fetchCustomAreaObjects;
