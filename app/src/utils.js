import { DateTime } from 'luxon';
import { Wkt } from 'wicket';
import axios from 'axios';
import latLng from '@/latLng';
import { fromExtent } from 'ol/geom/Polygon';
import { transformExtent } from 'ol/proj';
import store from '@/store';
import { generateUsedTimes } from '@/helpers/mapConfig';
import { getMapInstance } from './components/map/map';
import getLocationCode from './mixins/getLocationCode';

const wkt = new Wkt();

export function padLeft(str, pad, size) {
  let out = str;
  while (out.length < size) {
    out = pad + str;
  }
  return out;
}

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
    const ind = {
      ...indicator,
      ...newData,
    };
    return ind;
  }
  return null;
};

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

/*
// Helper function to create colorscales for cog style rendering
function getColorStops(name, min, max, steps, reverse) {
  const delta = (max - min) / (steps - 1);
  const stops = new Array(steps * 2);
  const colors = colormap({
    colormap: name, nshades: steps, format: 'rgba',
  });
  if (reverse) {
    colors.reverse();
  }
  for (let i = 0; i < steps; i++) {
    stops[i * 2] = min + i * delta;
    stops[i * 2 + 1] = colors[i];
  }
  return stops;
}

function getColormap(name, reverse) {
  const colors = colormap({
    colormap: name, nshades: 16, format: 'rgba',
  });
  if (reverse) {
    colors.reverse();
  }
  return colors;
}
*/

function clamp(value, low, high) {
  return Math.max(low, Math.min(value, high));
}

/*
let stp = 1 / 6;

const adoColor = {
  steps: 32,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [215, 25, 28] },
      { index: stp * 1, rgb: [253, 174, 97] },
      { index: stp * 2, rgb: [255, 255, 191] },
      { index: stp * 3, rgb: [255, 255, 255] },
      { index: stp * 4, rgb: [245, 153, 246] },
      { index: stp * 5, rgb: [180, 103, 221] },
      { index: stp * 6, rgb: [69, 0, 153] },
    ],
    nshades: 32,
  }),
};

stp = 1 / 7;

const grywrd = {
  steps: 128,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [0, 83, 30] },
      { index: stp * 1, rgb: [195, 229, 86] },
      { index: stp * 2, rgb: [255, 221, 86] },
      { index: stp * 3, rgb: [246, 119, 88] },
      { index: stp * 4, rgb: [255, 151, 63] },
      { index: stp * 5, rgb: [255, 99, 49] },
      { index: stp * 6, rgb: [213, 0, 31] },
      { index: stp * 7, rgb: [99, 0, 13] },
    ],
    nshades: 128,
  }),
};

const whitered = [
  { index: 0, rgb: [255, 255, 255] },
  { index: stp * 1, rgb: [255, 251, 247] },
  { index: stp * 2, rgb: [254, 238, 223] },
  { index: stp * 3, rgb: [254, 214, 183] },
  { index: stp * 4, rgb: [250, 177, 129] },
  { index: stp * 5, rgb: [233, 131, 77] },
  { index: stp * 6, rgb: [184, 84, 38] },
  { index: stp * 7, rgb: [127, 39, 4] },
];

const blgrrd = {
  steps: 32,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [1, 152, 189] },
      { index: 0.2, rgb: [73, 227, 206] },
      { index: 0.4, rgb: [216, 254, 181] },
      { index: 0.6, rgb: [254, 237, 177] },
      { index: 0.8, rgb: [254, 173, 84] },
      { index: 1, rgb: [209, 55, 78] },
    ],
    nshades: 32,
  }),
};
*/

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

function createWMSDisplay(config, name) {
  const layers = config['wms:layers'].join(',');
  const styles = config['wms:styles'] ? config['wms:styles'].join(',') : '';
  const display = {
    protocol: 'WMS',
    format: 'image/png',
    baseUrl: config.href,
    name,
    layers,
    styles,
    dateFormatFunction: (date) => date,
    // TODO: not sure if the crossOrigin null as default will create issues (needed for N1b)
    crossOrigin: null,
  };
  return display;
}

function createXYZDisplay(config, name) {
  const display = {
    protocol: 'xyz',
    tileSize: 256,
    url: `${config.href}${'&{time}'}`, // we add a time placeholder to the url
    name,
    dateFormatFunction: (date) => `url=${date[1]}`,
    labelFormatFunction: (date) => date[0],
  };
  return display;
}

function createVectorTileDisplay(config) {
  const display = {
    url: config.href,
    protocol: 'geoserverTileLayer',
    style: {
      strokeColor: 'rgba(0,0,0,0)',
      getColor: (feature, options) => {
        let color = '#00000000';
        const dataSource = options.dataProp ? options.dataProp : 'mapData';
        if (store.state.indicators.selectedIndicator
            && store.state.indicators.selectedIndicator[dataSource]) {
          const id = feature.id_;
          const ind = store.state.indicators.selectedIndicator;
          const currPar = ind.queryParameters.items
            .find((item) => item.id === ind.queryParameters.selected);
          if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
            const value = ind[dataSource][id][currPar.id];
            const { min, max, colormapUsed } = currPar;
            const f = clamp((value - min) / (max - min), 0, 1);
            color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
          }
        }
        return color;
      },
    },
    id: config.source,
    name: config.description,
    adminZoneKey: config.matchKey,
    parameters: config.parameters.join(','),
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    labelFormatFunction: (date) => date,
    selection: {
      mode: 'single',
    },
    tooltip: true,
    allowedParameters: ['name'],
  };
  return display;
}

export async function loadFeatureData(baseConfig, feature) {
  const parsedData = {};
  const { indicatorObject } = feature;
  if (indicatorObject.locations) {
    const response = await fetch(indicatorObject.link);
    const jsonData = await response.json();
    const times = [];
    jsonData.links.forEach((link) => {
      if (link.rel === 'item') {
        times.push(link.datetime);
      }
    });
    times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
    // We set the times and display configuration for the indicators
    // Items can have display configurations when the Locations config was used in the catalog
    if (store.state.indicators.selectedIndicator) {
      store.state.indicators.selectedIndicator.time = times;
      const wmsEndpoint = jsonData.links.find((item) => item.rel === 'wms');
      const xyzEndpoint = jsonData.links.find((item) => item.rel === 'xyz');
      if (wmsEndpoint) {
        const display = createWMSDisplay(
          wmsEndpoint, jsonData.id,
        );
        if ('assets' in jsonData && 'legend' in jsonData.assets) {
          display.legendUrl = jsonData.assets.legend.href;
        }
        store.state.indicators.selectedIndicator.display = display;
      } else if (xyzEndpoint) {
        if (xyzEndpoint.type === 'image/png') {
          const display = createXYZDisplay(
            xyzEndpoint, jsonData.id,
          );
          store.state.indicators.selectedIndicator.display = display;
          const cogTimes = [];
          jsonData.links.forEach((link) => {
            if (link.rel === 'item') {
              let time;
              if (link.datetime) {
                time = link.datetime;
              } else if (link.start_datetime) {
                time = link.start_datetime;
              }
              cogTimes.push([
                time,
                link.cog_href,
              ]);
            }
          });
          cogTimes.sort((a, b) => ((DateTime.fromISO(a[0]) > DateTime.fromISO(b[0])) ? 1 : -1));
          store.state.indicators.selectedIndicator.time = cogTimes;
        }
      } else {
        store.state.indicators.selectedIndicator.display = null;
      }
    }
    console.log(store.state.indicators.selectedIndicator);
    // Add collection extent as subaoi
    const coords = fromExtent(jsonData.extent.spatial.bbox[0]).getCoordinates();
    const features = {
      type: 'MultiPolygon',
      coordinates: [coords],
    };
    parsedData.subAoi = {
      type: 'FeatureCollection',
      features: [features],
    };
  } else {
    // Fetch data from geodb
    const geodbUrl = 'https://xcube-geodb.brockmann-consult.de/eodash/6bf15325-f6a0-4b6a-bf80-a2491753f8f2/eodash';
    const geodbIndicatorId = indicatorObject.geoDBID
      ? indicatorObject.geoDBID : indicatorObject.indicator;
    const url = `${geodbUrl}_${geodbIndicatorId}?aoi_id=eq.${indicatorObject.aoiID}`;
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
      // Try to extract sub_aoi geometry information
      if (data && data.length > 0 && 'sub_aoi' in data[0]) {
        let features = null;
        if (data[0].sub_aoi !== '/' && data[0].sub_aoi !== '') {
          // try to generate sub_aoi from geodb
          try {
            features = wkt.read(data[0].sub_aoi).toJson();
          } catch (error) {
            console.log('Error parsing wkt sub_aoi');
          }
        } else {
          const { map } = getMapInstance('centerMap');
          // if not possible use aoi with padding
          // TODO: should we add a subaoi if there is none in the database? this could create a
          // false sense of information
          const extent = transformExtent(
            feature.geometry.getExtent(),
            map.getView().getProjection(),
            'EPSG:4326',
          );
          const padding = 0.1;
          extent[0] -= padding;
          extent[1] -= padding;
          extent[2] += padding;
          extent[3] += padding;
          const coords = fromExtent(extent).getCoordinates();
          features = {
            type: 'MultiPolygon',
            coordinates: [coords],
          };
        }
        if (features) {
          parsedData.subAoi = {
            type: 'FeatureCollection',
            features: [features],
          };
        }
      }
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
    // Sort all data based on time
    // Create an array of indices for sorting
    const indices = parsedData.time.map((_, index) => index);
    indices.sort((a, b) => parsedData.time[a] - parsedData.time[b]);
    Object.keys(parsedData).forEach((key) => {
      if (key !== 'subAoi') {
        parsedData[key] = indices.map((index) => parsedData[key][index]);
      }
    });
  }
  return parsedData;
}

export async function loadIndicatorData(baseConfig, payload) {
  let indicatorObject = payload;
  if (payload && payload.type && payload.type === 'stac') {
    indicatorObject = payload;
    const response = await fetch(payload.link);
    const jsonData = await response.json();

    const times = [];
    // Configure display based on type
    const wmsEndpoint = jsonData.links.find((item) => item.rel === 'wms');
    const xyzEndpoint = jsonData.links.find((item) => item.rel === 'xyz');
    let display = {};
    if (wmsEndpoint) {
      display = createWMSDisplay(
        wmsEndpoint, jsonData.name,
      );
      jsonData.links.forEach((link) => {
        if (link.rel === 'item') {
          times.push(link.datetime);
        }
      });
      times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
    } else if (xyzEndpoint) {
      if (xyzEndpoint.type === 'image/png') {
        display = createXYZDisplay(
          xyzEndpoint, jsonData.name,
        );
        jsonData.links.forEach((link) => {
          if (link.rel === 'item') {
            let time;
            if (link.datetime) {
              time = link.datetime;
            } else if (link.start_datetime) {
              time = link.start_datetime;
            }
            times.push([
              time,
              link.cog_href,
            ]);
          }
        });
        times.sort((a, b) => ((DateTime.fromISO(a[0]) > DateTime.fromISO(b[0])) ? 1 : -1));
      } else if (xyzEndpoint.type === 'application/pbf') {
        display = createVectorTileDisplay(
          xyzEndpoint,
        );
        jsonData.links.forEach((link) => {
          if (link.rel === 'item') {
            let time;
            if (link.datetime) {
              time = link.datetime;
            } else if (link.start_datetime) {
              time = link.start_datetime;
            }
            times.push(time);
          }
        });
        times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
      }
    }
    // If legend available add it to the display config
    if ('assets' in jsonData && 'legend' in jsonData.assets) {
      display.legendUrl = jsonData.assets.legend.href;
    }
    // Check for possible processing configuration in examples
    const exampleEndpoint = jsonData.links.find((item) => item.rel === 'example');
    if (exampleEndpoint) {
      if (exampleEndpoint.title === 'evalscript') {
        const evalscript = await (await fetch(exampleEndpoint.href)).text();
        display = {
          ...display,
          ...{
            customAreaIndicator: true,
            areaIndicator: {
              ...statisticalApiHeaders,
              ...statisticalApiBody(
                evalscript,
                exampleEndpoint.dataId,
              ),
              callbackFunction: parseStatAPIResponse,
              areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
            },
          },
        };
      } else if (exampleEndpoint.title === 'VEDA Statistics') {
        display = {
          ...display,
          ...{
            customAreaIndicator: true,
            areaIndicator: nasaStatisticsConfig(
              (value) => value,
            ),
          },
        };
      }
    }
    // Add markdown from description
    indicatorObject.markdown = jsonData.description;
    // Check for stac story asset
    if ('assets' in jsonData) {
      if ('story' in jsonData.assets) {
        // If story avaialble, overwrite markdown with it
        indicatorObject.markdown = await fetch(jsonData.assets.story.href).then((md) => md.text());
      }
    }

    // add extent information
    if ('extent' in jsonData) {
      indicatorObject.extent = jsonData.extent;
    }

    const features = [];
    // if we have features or regional locations
    if (payload.endpointType === 'GeoDB' || payload.locations) {
      // We create all relevant features (pois) to be shown on map
      jsonData.links.forEach((link) => {
        if (link.rel === 'item' || link.rel === 'child') {
          const featureObject = {};
          const coordinates = link.latlng.split(',').map(Number);
          featureObject.aoiID = link.id;
          // Sometimes geodb id is different to eodash id
          featureObject.geoDBID = jsonData.id;
          featureObject.isFeature = true;
          featureObject.aoi = latLng([coordinates[0], coordinates[1]]);
          featureObject.indicator = indicatorObject.indicator;
          featureObject.indicatorValue = [''];
          featureObject.city = link.city ? link.city : link.name;
          featureObject.country = link.country;
          // featureObject.description = jsonData.description;
          featureObject.locations = payload.locations;
          featureObject.link = `${payload.link.replace('collection.json', '')}${link.href}`;
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
    // We need the information on features directly once loaded for the custom dashboard loading
    // TODO: probably there is a better way of managing this information
    indicatorObject.features = features;
    if (Array.isArray(indicatorObject.display)) {
      // merge display with first entry of original array of displays
      indicatorObject.display[0] = {
        ...display,
        ...indicatorObject.display[0],
      };
    } else {
      // merge object properties
      indicatorObject.display = {
        ...display,
        ...indicatorObject.display,
      };
    }
  }
  return indicatorObject;
  /*
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
  */
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
  const searchPanelWidth = (document.querySelector('eox-itemfilter') !== null)
    ? (document.querySelector('eox-itemfilter').clientWidth) : 0;
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
