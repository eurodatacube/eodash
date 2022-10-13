import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import countries from '@/assets/countries.json';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';
import TileWMS from 'ol/source/TileWMS';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import MapLibreLayer from '@geoblocks/ol-maplibre-layer';
import store from '@/store';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createXYZ } from 'ol/tilegrid';
import { Group } from 'ol/layer';
import VectorTileLayer from 'ol/layer/VectorTile';
import { applyStyle, stylefunction } from 'ol-mapbox-style';
import * as flatgeobuf from 'flatgeobuf/dist/flatgeobuf-geojson.min';
import { transformExtent } from 'ol/proj';
import { bbox } from 'ol/loadingstrategy';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});
const countriesSource = new VectorSource({
  features: geoJsonFormat.readFeatures(countries),
});

/**
 * manually fetches geojson features and replaces the features in the source
 * invalid `null`-ids will be transformed into `undefined`-IDs
 * @param {*} source ol vector source (features of this source will be replaced)
 * @param {String} url geojson url
 */
function fetchGeoJsonFeatures(source, url) {
  fetch(url)
    .then((fStream) => {
      fStream.json()
        .then((geoJson) => {
          geoJson.features.forEach((f) => {
            if (f.id === null) {
            // to do: some POIs (like bejing or LAX airports) have `null` set as feature ids,
            // resulting in invalid geojson
            // when this is fixed in the data, the normal geojson loader should be used
            // eslint-disable-next-line no-param-reassign
              f.id = undefined;
            }
          });
          const features = geoJsonFormat.readFeatures(geoJson);
          source.addFeatures(features);
        });
    });
}

function createFromTemplate(template, tileCoord) {
  const zRegEx = /\{z\}/g;
  const xRegEx = /\{x\}/g;
  const yRegEx = /\{y\}/g;
  const dashYRegEx = /\{-y\}/g;
  return template.replace(zRegEx, tileCoord[0].toString())
    .replace(xRegEx, tileCoord[1].toString())
    .replace(yRegEx, tileCoord[2].toString())
    .replace(dashYRegEx, () => {
      // eslint-disable-next-line no-bitwise
      const y = (1 << tileCoord[0]) - tileCoord[2] - 1;
      return y.toString();
    });
}

function replaceUrlPlaceholders(baseUrl, config, options) {
  let url = baseUrl;
  const time = options.time || store.state.indicators.selectedTime;
  const indicator = options.indicator || store.state.indicators.selectedIndicator.indicator;
  const aoiId = options.aoiId || store.state.indicators.selectedIndicator.aoiID;
  url = url.replace(/{time}/i, config.dateFormatFunction(time));
  url = url.replace(/{indicator}/gi, indicator);
  url = url.replace(/{aoiID}/gi, aoiId);
  if (config.features && config.features.dateFormatFunction) {
    url = url.replace(/{featuresTime}/i, config.features.dateFormatFunction(time));
  }
  if (config.siteMapping) {
    const currSite = config.siteMapping(aoiId);
    url = url.replace(/{site}/gi, currSite);
  }
  return url;
}

function fgbBoundingBox(extent, projection) {
  // minx, miny, maxx, maxy
  const transformedExtent = transformExtent(extent, projection.getCode(), 'EPSG:4326');
  return {
    minX: transformedExtent[0],
    minY: transformedExtent[1],
    maxX: transformedExtent[2],
    maxY: transformedExtent[3],
  };
}

// const updateResultsDeb = _.debounce(updateResults, 500);
/**
 * generate a layer from a given config Object
 * @param {Object} config eodash config object
 *
 * layer definitions via config
 * @param {string} config.style.fillColor fill color
 * @param {number} config.style.weight stroke weight
 * @param {string} config.style.color stroke color
 * @param {Object} [opt_options={}] options
 * @param {number} [opt_options.zIndex=0] optional zIndex, defaults to 0
 * @param {boolean} [opt_options.updateOpacityOnZoom=false] sets the updateOpacityOnZoom-flag
 * on the layer. this can be used inside components to update opacity
 * for overlays like labels or borders. Defaults to false.
 * @param {*} [opt_options.time=undefined] optional time.
 * @param {*} [opt_options.indicator=undefined] optional indicator. (e.g. "E13b")
 * @param {*} [opt_options.aoiId=undefined] optional aoiId.
 * if not set, time will be retrieved from the store
 * @returns {Group} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config, _options = {}) {
  const options = { ..._options };
  options.zIndex = options.zIndex || 0;
  options.updateOpacityOnZoom = options.updateOpacityOnZoom || false;

  // layers created by this config. These Layers will get combined into a single ol.layer.Group
  const layers = [];
  if (config.protocol === 'cog') {
    const source = new GeoTIFF({
      sources: config.sources,
      normalize: false,
    });
    const wgTileLayer = new WebGLTileLayer({
      source,
      style: config.style,
    });
    wgTileLayer.set('id', config.id);
    layers.push(wgTileLayer);
  }
  if (config.protocol === 'vectortile') {
    const tilelayer = new VectorTileLayer();
    tilelayer.set('id', config.id);
    applyStyle(tilelayer, config.styleFile, [config.selectedStyleLayer]);
    layers.push(tilelayer);
  }
  if (config.protocol === 'vectorgeojson') {
    const layer = new VectorLayer();
    layer.set('id', config.id);
    layer.set('name', config.name);
    layer.set('styleFile', config.styleFile);
    layer.set('selectedStyleLayer', config.selectedStyleLayer);
    layers.push(layer);

    fetch(config.styleFile).then((r) => r.json())
      .then((glStyle) => {
        glStyle.sources.air_quality.data = glStyle.sources.air_quality.data.replace('{{time}}', '2022_09_17');
        applyStyle(layer, glStyle, [config.selectedStyleLayer]);
      })
      .catch(() => console.log('Issue loading mapbox style'));
  }
  if (config.protocol === 'countries') {
    layers.push(new VectorLayer({
      name: 'Country vectors',
      source: countriesSource,
      updateOpacityOnZoom: options.updateOpacityOnZoom,
      zIndex: options.zIndex,
      style: new Style({
        fill: new Fill({
          color: '#fff',
        }),
        stroke: new Stroke({
          width: 1,
          color: '#a2a2a2',
        }),
      }),
    }));
  }
  if (config.protocol === 'GeoJSON') {
    // mutually exclusive options, either direct features or url to fetch
    const vectorSourceOpts = config.url ? {
      url: config.url,
      format: geoJsonFormat,
    } : {
      features: geoJsonFormat.readFeatures(config.data),
    };
    layers.push(new VectorLayer({
      name: config.name,
      zIndex: options.zIndex,
      updateOpacityOnZoom: false,
      source: new VectorSource(vectorSourceOpts),
      style: new Style({
        fill: new Fill({
          color: config.style.fillColor || 'rgba(0, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          width: config.style.weight || 3,
          color: config.style.color || 'rgba(0, 0, 0, 0.5)',
        }),
      }),
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
    }));
  }
  if (config.protocol === 'flatgeobuf') {
    const vectorSourceOpts = {
      format: geoJsonFormat,
      strategy: bbox,
    };
    const source = new VectorSource(vectorSourceOpts);
    // eslint-disable-next-line no-inner-declarations
    async function updateResults(extent, resolution, projection, success) {
      const rect = fgbBoundingBox(extent, projection);
      // Use flatgeobuf JavaScript API to iterate features as geojson.
      // Because we specify a bounding box, flatgeobuf will only fetch the relevant subset of data,
      // rather than the entire file.
      if (rect.minX !== -Infinity) {
        const ftrs = [];
        const iter = flatgeobuf.deserialize(config.url, rect);
        // eslint-disable-next-line no-restricted-syntax
        for await (const feature of iter) {
          const ftr = geoJsonFormat.readFeature(feature);
          ftrs.push(ftr);
        }
        source.clear();
        source.addFeatures(ftrs);
        success();
      }
    }
    source.setLoader(updateResults);
    layers.push(new VectorLayer({
      name: config.name,
      zIndex: options.zIndex,
      updateOpacityOnZoom: false,
      source,
      style: new Style({
        fill: new Fill({
          color: config.style.fillColor || 'rgba(0, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          width: config.style.weight || 3,
          color: config.style.color || 'rgba(0, 0, 0, 0.5)',
        }),
      }),
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
    }));
  }
  let source;
  if (config.protocol === 'xyz') {
    if (config.usedTimes?.time?.length) {
      // for layers with time entries, use a tileUrl function that
      // gets the current time entry from the store
      source = new XYZSource({
        attributions: config.attribution,
        maxZoom: config.maxNativeZoom || config.maxZoom,
        minZoom: config.minNativeZoom || config.minZoom,
        crossOrigin: 'anonymous',
        transition: 0,
        tileUrlFunction: (tileCoord) => {
          const url = replaceUrlPlaceholders(config.url, config, options);
          return createFromTemplate(url, tileCoord);
        },
      });
      source.set('updateTime', (time) => {
        const updatedOptions = { ...options };
        updatedOptions.time = time;
        source.setTileUrlFunction((tileCoord) => {
          const url = replaceUrlPlaceholders(config.url, config, updatedOptions);
          return createFromTemplate(url, tileCoord);
        });
      });
    } else {
      source = new XYZSource({
        attributions: config.attribution,
        maxZoom: config.maxNativeZoom || config.maxZoom,
        minZoom: config.minNativeZoom || config.minZoom,
        crossOrigin: 'anonymous',
        transition: 0,
        tileUrlFunction: (tileCoord) => createFromTemplate(config.url, tileCoord),
      });
    }
  }

  if (config.protocol === 'WMS') {
    // to do: layers is  not defined for harvesting evolution over time (spain)
    const paramsToPassThrough = ['minZoom', 'maxZoom', 'minNativeZoom', 'maxNativeZoom', 'bounds', 'layers', 'styles',
      'format', 'width', 'height', 'transparent', 'srs', 'env', 'searchid'];

    const tileSize = config.combinedLayers?.length
      ? config.combinedLayers[0].tileSize : config.tileSize;
    const tileGrid = tileSize === 512 ? new TileGrid({
      extent: [-20037508.342789244, -20037508.342789244,
        20037508.342789244, 20037508.342789244],
      resolutions: createXYZ({
        tileSize: 512,
      }).getResolutions(),
      tileSize: 512,
    }) : undefined;

    // combined wms layers, for instance CMEMS Water Quality (RACE)
    // and Sea Ice Concentration (trilateral)
    if (config.combinedLayers?.length) {
      config.combinedLayers.forEach((c) => {
        const params = {
          LAYERS: c.layers,
        };

        paramsToPassThrough.forEach((param) => {
          if (typeof c[param] !== 'undefined') {
            params[param] = c[param];
          }
        });
        if (config.usedTimes?.time?.length) {
          params.time = c.dateFormatFunction(options.time);
          if (config.specialEnvTime) {
            params.env = `year:${params.time}`;
          }
        }

        const singleSource = new TileWMS({
          attributions: config.attribution,
          maxZoom: c.maxNativeZoom || c.maxZoom,
          minZoom: c.minNativeZoom || c.minZoom,
          crossOrigin: 'anonymous',
          transition: 0,
          projection: 'EPSG:3857',
          params,
          url: c.baseUrl,
          tileGrid,
        });
        singleSource.set('updateTime', (updatedTime) => {
          const timeString = c.dateFormatFunction(updatedTime);
          const newParams = {
            time: timeString,
          };
          if (config.specialEnvTime) {
            newParams.env = `year:${updatedTime}`;
          }
          singleSource.updateParams(newParams);
        });
        layers.push(new TileLayer({
          name: config.name,
          // minZoom: config.minZoom || config.minNativeZoomm,
          updateOpacityOnZoom: options.updateOpacityOnZoom,
          zIndex: options.zIndex,
          source: singleSource,
        }));
      });
    } else {
      const params = {
        LAYERS: config.layers,
      };
      paramsToPassThrough.forEach((param) => {
        if (typeof config[param] !== 'undefined') {
          params[param] = config[param];
        }
      });
      if (config.usedTimes?.time?.length) {
        params.time = config.dateFormatFunction(options.time);
        if (config.specialEnvTime) {
          params.env = `year:${params.time}`;
        }
      }
      source = new TileWMS({
        attributions: config.attribution,
        maxZoom: config.maxNativeZoom || config.maxZoom,
        minZoom: config.minNativeZoom || config.minZoom,
        crossOrigin: 'anonymous',
        transition: 0,
        params,
        url: config.url || config.baseUrl,
        tileGrid,
      });
    }
  }
  if (config.protocol === 'maplibre') {
    const layer = new MapLibreLayer({
      visible: config.visible,
      name: config.name,
      zIndex: options.zIndex,
      attribution: config.attribution,
      maplibreOptions: {
        style: config.maplibreStyles,
      }
    });
    layers.push(layer);
  }

  if (source) {
    if (config.dateFormatFunction) {
      source.set('updateTime', (updatedTime) => {
        const newParams = {
          time: config.dateFormatFunction(updatedTime),
        };
        if (config.specialEnvTime) {
          newParams.env = `year:${updatedTime}`;
        }
        if (source.updateParams) {
          source.updateParams(newParams);
        }
      });
    }
    const tilelayer = new TileLayer({
      name: config.name,
      // minZoom: config.minZoom || config.minNativeZoomm,
      updateOpacityOnZoom: options.updateOpacityOnZoom,
      zIndex: options.zIndex,
      source,
    });
    if (config.vectorStyles && config.protocol === 'tilejson') {
      applyStyle(tilelayer, config.vectorStyles, [config.selectedStyleLayer]);
    }
    layers.push(tilelayer);
  }

  if (config.features) {
    // some layers have a baselayer and GeoJSON features above them
    // e.g. "Ports and Shipping"
    // to do: consider other sources of truth than the store
    const featuresSource = new VectorSource({
      features: [],
    });
    // to do:
    // some configs have other mean than simple geojson fetching. Make sure to not forget any.
    if (!config.features.callbackFunction) {
      const url = replaceUrlPlaceholders(config.features.url, config, options);
      fetchGeoJsonFeatures(featuresSource, url);
    }
    // this gives an option to update the source (most likely the time) without
    // re-creating the entire layer
    featuresSource.set('updateTime', (time) => {
      const updatedOptions = { ...options };
      updatedOptions.time = time;
      const newUrl = replaceUrlPlaceholders(config.features.url, config, updatedOptions);
      fetchGeoJsonFeatures(featuresSource, newUrl);
    });
    const fill = new Fill({
      color: 'rgba(255, 255, 255, 0.1)',
    });
    const stroke = new Stroke({
      width: 2,
      color: '#F7A400',
    });
    const featuresLayer = new VectorLayer({
      source: featuresSource,
      style: new Style({
        fill,
        stroke,
        image: new Circle({
          fill,
          stroke,
          radius: 4,
        }),
      }),
    });

    layers.push(featuresLayer);
  }

  return new Group({
    name: config.name,
    visible: config.visible,
    updateOpacityOnZoom: options.updateOpacityOnZoom,
    zIndex: options.zIndex,
    layers,
  });
}
