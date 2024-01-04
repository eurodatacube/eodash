import { DateTime } from 'luxon';
import { Wkt } from 'wicket';
import axios from 'axios';
import latLng from '@/latLng';
import { fromExtent } from 'ol/geom/Polygon';
import { transformExtent } from 'ol/proj';
import store from '@/store';
import {
  statisticalApiHeaders,
  statisticalApiBody,
  parseStatAPIResponse,
  nasaStatisticsConfig,
  xcubeAnalyticsConfig,
} from '@/helpers/customAreaObjects';
import { xcubeViewerColormaps } from '@/config/layers';
import { getMapInstance } from './components/map/map';

const wkt = new Wkt();

function clamp(value, low, high) {
  return Math.max(low, Math.min(value, high));
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
  if (Array.isArray(data)) {
    data.forEach((entry) => {
      dataObject[entry[mergedConfig.adminZoneKey]] = { ...entry };
    });
  }
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

function createXYZDisplay(config, jsonData) {
  const display = {
    protocol: 'xyz',
    tileSize: 256,
    url: `${config.href}${'&{time}'}`, // we add a time placeholder to the url
    name: jsonData.id,
    dateFormatFunction: (date) => `url=${date[1]}`,
    labelFormatFunction: (date) => date[0],
  };
  if (jsonData.endpointtype === 'VEDA_tiles') {
    display.dateFormatFunction = (date) => `item=${date[1]}`;
  }
  return display;
}

function createXYZTilesXcubeDisplay(config, name) {
  const searchParams = new URLSearchParams(config.href);
  const vmin = searchParams.get('vmin') || 0;
  const vmax = searchParams.get('vmax') || 1;
  const display = {
    protocol: 'xyz',
    tileSize: 256,
    minZoom: 1,
    url: config.href,
    name,
    dateFormatFunction: (date) => `${date}`,
    labelFormatFunction: (date) => date,
    layerConfig: {
      schema: {
        type: 'object',
        properties: {
          vminmax: {
            title: 'Value stretch',
            type: 'object',
            properties: {
              vmin: {
                type: 'number',
                minimum: parseFloat(vmin),
                maximum: parseFloat(vmax),
                format: 'range',
              },
              vmax: {
                type: 'number',
                minimum: parseFloat(vmin),
                maximum: parseFloat(vmax),
                format: 'range',
              },
            },
            format: 'minmax',
          },
          cbar: {
            title: 'Colorbar',
            type: 'string',
            enum: xcubeViewerColormaps,
          },
        },
      },
    },
  };
  return display;
}

function createVectorTileDisplay(config) {
  // TODO, not finished and used yet
  const display = {
    url: config.href,
    protocol: 'geoserverTileLayer',
    style: {
      strokeColor: 'rgba(0,0,0,0)',
      getColor: (feature, options) => {
        let color = '#00000000';
        const dataSource = options.dataProp ? options.dataProp : 'mapData';
        let data = null;
        if (dataSource === 'frozenMapData') {
          data = store.state.indicators.frozenIndicator.mapData;
        } else if (store.state.indicators.selectedIndicator
          && store.state.indicators.selectedIndicator[dataSource]) {
          data = store.state.indicators.selectedIndicator[dataSource];
        }
        if (data) {
          const id = feature.id_;
          const ind = store.state.indicators.selectedIndicator;
          const currPar = ind.queryParameters.items
            .find((item) => item.id === ind.queryParameters.selected);
          if (currPar && id in data) {
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
  let display = {};
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
        display = createWMSDisplay(
          wmsEndpoint, jsonData.id,
        );
        if ('assets' in jsonData && 'legend' in jsonData.assets) {
          display.legendUrl = jsonData.assets.legend.href;
        }
      } else if (xyzEndpoint) {
        if (xyzEndpoint.type === 'image/png') {
          display = createXYZDisplay(
            xyzEndpoint, jsonData,
          );
          const cogTimes = [];
          jsonData.links.forEach((link) => {
            if (link.rel === 'item') {
              let time;
              if (link.datetime) {
                time = link.datetime;
              } else if (link.start_datetime) {
                time = link.start_datetime;
              }
              if (jsonData.endpointtype && jsonData.endpointtype === 'VEDA_tiles') {
                cogTimes.push([
                  time,
                  link.item,
                ]);
              } else {
                cogTimes.push([
                  time,
                  link.cog_href,
                ]);
              }
            }
          });
          cogTimes.sort((a, b) => ((DateTime.fromISO(a[0]) > DateTime.fromISO(b[0])) ? 1 : -1));
          store.state.indicators.selectedIndicator.time = cogTimes;
        }
      }
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
      } else if (exampleEndpoint.title === 'xcube analytics') {
        display = {
          ...display,
          ...{
            customAreaIndicator: true,
            areaIndicator: xcubeAnalyticsConfig(exampleEndpoint),
          },
        };
      }
    }
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
    store.state.indicators.selectedIndicator.display = display;
  } else {
    // Fetch data from geodb
    const geodbUrl = baseConfig.geoDBFeatureParameters.url;
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
      if (['E10a3', 'E10a8'].includes(indicatorObject.indicator)) {
        // special case including additional property in mapping
        mapping.siteNameNUTS = 'site_name';
      }
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
        wmsEndpoint, jsonData.id,
      );
      jsonData.links.forEach((link) => {
        if (link.rel === 'item') {
          times.push(link.datetime);
        }
      });
      times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
    } else if (xyzEndpoint) {
      if (xyzEndpoint.type === 'image/png' && !xyzEndpoint.title.includes('xcube tiles')) {
        display = createXYZDisplay(
          xyzEndpoint, jsonData,
        );
        jsonData.links.forEach((link) => {
          if (link.rel === 'item') {
            let time;
            if (link.datetime) {
              time = link.datetime;
            } else if (link.start_datetime) {
              time = link.start_datetime;
            }
            if (jsonData.endpointtype && jsonData.endpointtype === 'VEDA_tiles') {
              times.push([
                time,
                link.item,
              ]);
            } else {
              times.push([
                time,
                link.cog_href,
              ]);
            }
          }
        });
        times.sort((a, b) => ((DateTime.fromISO(a[0]) > DateTime.fromISO(b[0])) ? 1 : -1));
      } else if (xyzEndpoint.type === 'image/png' && xyzEndpoint.title.includes('xcube tiles')) {
        display = createXYZTilesXcubeDisplay(
          xyzEndpoint, jsonData.id,
        );
        jsonData.links.forEach((link) => {
          if (link.rel === 'item') {
            times.push(link.datetime);
          }
        });
        times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
      } else if (xyzEndpoint.type === 'application/pbf') {
        // TODO not used yet
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
    } else {
      // try extracting dates from items for "collection-only placeholder collections"
      jsonData.links.forEach((link) => {
        if (link.rel === 'item') {
          if (link.datetime) {
            times.push(link.datetime);
          }
        }
      });
      times.sort((a, b) => ((DateTime.fromISO(a) > DateTime.fromISO(b)) ? 1 : -1));
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
      } else if (exampleEndpoint.title === 'xcube analytics') {
        display = {
          ...display,
          ...{
            customAreaIndicator: true,
            areaIndicator: xcubeAnalyticsConfig(exampleEndpoint),
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
          featureObject.yAxis = indicatorObject.yAxis;
          featureObject.indicatorValue = [''];
          featureObject.city = (link.city && link.city !== '/') ? link.city : '';
          featureObject.country = link.country;
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
    if (!(Array.isArray(indicatorObject.time) && indicatorObject.time.length > 0)) {
      indicatorObject.time = times;
    }
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
  const dataPanelWidth = document.querySelector('.ui-panel').clientWidth;
  const searchPanelWidth = document.querySelector('.ui-panel').clientWidth;
  const demoItemsWidth = (document.querySelector('#demoItemsList') !== null)
    ? (document.querySelector('#demoItemsList').clientWidth) : 0;
  const percentageBasedOffsetWidth = Math.floor(window.innerWidth * 0.12);
  const padding = [
    70,
    percentageBasedOffsetWidth + dataPanelWidth,
    150,
    percentageBasedOffsetWidth + searchPanelWidth + demoItemsWidth,
  ];
  return padding;
}

export const findClosest = (data, target = DateTime.now()) => data.reduce((prev, curr) => {
  const a = Math.abs(curr.ts - target.ts);
  const b = Math.abs(prev.ts - target.ts);
  return a - b < 0 ? curr : prev;
});

export function getFilteredInputData(customObject) {
  // filter available times by input_data for map display
  // there is a "rule" with geodb as data provide that if inputData == "/", it should not be shown on map
  // if whole array consists of only "/", we should not display any layer
  // (this is true also for indicator with locations where location was not clicked yet)
  if (!customObject) {
    return customObject;
  }
  const clone = { ...customObject };
  const { inputData } = clone;
  if (!inputData) {
    // simply pass through
    return customObject;
  }

  // filter out rows which have empty "Input Data"
  const mask = inputData.map((item) => item && item !== '/');
  // filtering only arrays with more than 1 element to not fail on Input Data:['value'] shortcut
  if (mask.length > 1) {
    for (let [key, value] of Object.entries(clone)) { // eslint-disable-line
      if (Array.isArray(value) && value.length > 1) {
        clone[key] = value.filter((item, i) => mask[i]);
      }
    }
  }
  if (mask.length === 0) {
    // if all values of input_data are invalid, filter completely
    return null;
  }
  return clone;
}
