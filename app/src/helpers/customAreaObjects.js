import { template } from '@/utils';

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
  // this.map.fireEvent('dataloading');
  const customObjects = {};
  await fetch(url, requestOpts).then((response) => {
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
      customObjects.customFeatures = rwdata;
      return rwdata;
    })
    .then((newIndicator) => {
      let custom;
      if (newIndicator) {
        newIndicator.poi = drawnArea.coordinates.flat(Infinity).join('-'); // eslint-disable-line
        newIndicator.includesIndicator = true; // eslint-disable-line
        custom = newIndicator;
      }
      customObjects.customIndicator = custom;
      return custom;
    })
    .catch((err) => {
      throw Error(err);
    });
  return customObjects;
};

export default fetchCustomAreaObjects;
