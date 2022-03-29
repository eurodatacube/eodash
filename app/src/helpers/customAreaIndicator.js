import { template } from '@/utils';

const fetchCustomAreaIndicator = async (
  options,
  drawnArea,
  validDrawnArea,
  mergedConfig,
  indicatorObject,
) => {
  const indicator = indicatorObject;
  // add custom area if present
  let customArea = {};
  if (validDrawnArea) {
    customArea = typeof mergedConfig.areaIndicator.areaFormatFunction === 'function'
      ? mergedConfig.areaIndicator.areaFormatFunction(drawnArea)
      : { area: JSON.stringify(drawnArea) };
  }
  indicator.title = 'User defined area of interest';
  const templateSubst = {
    ...indicator,
    ...options,
    ...customArea,
  };
  const templateRe = /\{ *([\w_ -]+) *\}/g;
  const url = template(templateRe, mergedConfig.areaIndicator.url, templateSubst);
  let requestBody = null;
  if (mergedConfig.areaIndicator.requestBody) {
    requestBody = {
      ...mergedConfig.areaIndicator.requestBody,
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
    method: mergedConfig.areaIndicator.requestMethod || 'GET',
    headers: mergedConfig.areaIndicator.requestHeaders || {},
  };
  if (requestBody) {
    requestOpts.body = JSON.stringify(requestBody);
  }
  // this.map.fireEvent('dataloading');
  const customIndicator = await fetch(url, requestOpts).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  })
    .then((rwdata) => {
      if (typeof mergedConfig.areaIndicator.callbackFunction === 'function') {
        // merge data from current indicator data and new data from api
        // returns new indicator object to set as custom area indicator
        return mergedConfig.areaIndicator.callbackFunction(rwdata, indicator);
      }
      return rwdata;
    })
    .then((newIndicator) => {
      let custom;
      if (newIndicator) {
        newIndicator.poi = drawnArea.coordinates.flat(Infinity).join('-'); // eslint-disable-line
        newIndicator.includesIndicator = true; // eslint-disable-line
        custom = newIndicator;
      }
      return custom;
    })
    .catch((err) => {
      throw Error(err);
    });
  return customIndicator;
};

export default fetchCustomAreaIndicator;
