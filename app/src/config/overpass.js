import GeoJSON from 'ol/format/GeoJSON';

const geojsonFormat = new GeoJSON();
const osmtogeojson = require('osmtogeojson');

function buildOverpassAPIQueryFromParams(urlInit, mergedConfig) {
  let searchPartOfQuery = '';
  mergedConfig.features.featureQueryParams.items.forEach((params) => {
    if (params.selected === true) {
      const types = params.types || ['node', 'way', 'relation'];
      types.forEach((type) => {
        let booleanAndStaticParams = '';
        if (params.staticParams) {
          params.staticParams.forEach((staticParam) => {
            booleanAndStaticParams += `["${staticParam.key}"="${staticParam.value}"]`;
          });
        }
        searchPartOfQuery += `${type}["${params.key}"="${params.value}"]${booleanAndStaticParams}({area});`;
      });
    }
  });
  const query = `[out:json][timeout:15];(${searchPartOfQuery});out body;>;out skel qt;`;
  const urlEvaluated = urlInit.replace('{query}', query);
  return urlEvaluated;
}

export function overpassApiQueryTags(featureQueryParams) {
  return {
    drawnAreaLimitExtent: true,
    areaFormatFunction: (area) => {
    // overpass api expects lat,lon
    const extent = geojsonFormat.readGeometry(area).getExtent();
    return { area: [extent[1], extent[0], extent[3], extent[2]] };
    },
    featureQueryParams: {
    items: featureQueryParams,
    title: 'OSM Overpass API query parameters',
    },
    customFormatFunction: buildOverpassAPIQueryFromParams,
    url: 'https://overpass-api.de/api/interpreter?data={query}',
    requestMethod: 'GET',
    callbackFunction: (responseJson) => {
    // custom handling of overpass timeout raise alert and throw an exception
    if (responseJson?.remark && responseJson.remark.includes('error')) {
        window.dispatchEvent(new CustomEvent('custom-alert-message', { detail: `Request to Overpass API timeouted. Please select a smaller area. Original error: ${responseJson.remark}` }));
        throw responseJson.remark;
    }
    const ftrColl = osmtogeojson(responseJson, {
        flatProperties: true,
    });
    return ftrColl;
    },
  };
}
