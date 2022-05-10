import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import countries from '@/assets/countries.json';
import { Fill, Stroke, Style } from 'ol/style';
import TileWMS from 'ol/source/TileWMS';
import store from '@/store';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createXYZ } from 'ol/tilegrid';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});
const countriesSource = new VectorSource({
  features: geoJsonFormat.readFeatures(countries),
});

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
 * @returns {*} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config, _options = {}) {
  const options = { ..._options };
  options.zIndex = options.zIndex || 0;
  options.updateOpacityOnZoom = options.updateOpacityOnZoom || false;
  if (config.protocol === 'countries') {
    return new VectorLayer({
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
    });
  }
  if (config.protocol === 'GeoJSON') {
    return new VectorLayer({
      name: config.name,
      visible: config.visible,
      zIndex: options.zIndex,
      updateOpacityOnZoom: false,
      source: new VectorSource({
        features: geoJsonFormat.readFeatures(config.data),
      }),
      style: new Style({
        fill: new Fill({
          color: config.style.fillColor || 'rgba(0, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          width: config.style.weight || 3,
          color: config.style.color || 'rgba(0, 0, 0, 0.5)',
        }),
      }),
    });
  }
  let source;
  if (config.protocol === 'xyz') {
    if (config.usedTimes?.time?.length) {
      // for layers with time entries, use a tileUrl function that
      // gets the current time entry from the store
      source = new XYZSource({
        attributions: config.attribution,
        crossOrigin: 'anonymous',
        transition: 0,
        tileUrlFunction: (tileCoord) => {
          const time = store.state.indicators.selectedTime;
          const url = config.url.replace(/{time}/i, time);
          return createFromTemplate(url, tileCoord);
        },
      });
    } else {
      source = new XYZSource({
        attributions: config.attribution,
        crossOrigin: 'anonymous',
        transition: 0,
        url: config.url,
      });
    }
  }
  if (config.protocol === 'WMS') {
    if (config.usedTimes?.time?.length) {
      // to do: dont hardcode, find a better way to differentiate between "different" WMS
      if (config.name === 'WSF_Evolution' || config.name === 'ONPP-GCOMC-World-Monthly'
        || config.name === 'Water Quality Index') {
        const paramsToPassThrough = ['minZoom', 'maxZoom', 'minNativeZoom', 'maxNativeZoom', 'bounds', 'layers', 'styles',
          'format', 'width', 'height', 'transparent', 'srs', 'env', 'searchid'];
        const params = {
          LAYERS: config.layers,
          // TO DO: time might come from component (in the dashboard)
          time: config.dateFormatFunction(store.state.indicators.selectedTime),
        };
        if (config.specialEnvTime) {
          params.env = `year:${store.state.indicators.selectedTime}`;
        }
        paramsToPassThrough.forEach((param) => {
          if (typeof config[param] !== 'undefined') {
            params[param] = config[param];
          }
        });

        const tileGrid = config.tileSize === 512 ? new TileGrid({
          extent: [-20037508.342789244, -20037508.342789244,
            20037508.342789244, 20037508.342789244],
          resolutions: createXYZ({
            tileSize: 512,
          }).getResolutions(),
          tileSize: 512,
        }) : undefined;

        source = new TileWMS({
          attributions: config.attribution,
          crossOrigin: 'anonymous',
          params,
          url: config.baseUrl,
          tileGrid,
        });
      } else {
        source = new TileWMS({
          attributions: config.attribution,
          crossOrigin: 'anonymous',
          transition: 0,
          tileLoadFunction(imageTile, src) {
            // eslint-disable-next-line no-param-reassign
            imageTile.getImage().src = src;
          },
          url: config.url,
        });
      }
    } else {
      source = new TileWMS({
        attributions: config.attribution,
        crossOrigin: 'anonymous',
        transition: 0,
        url: config.url,
      });
    }
  }

  return new TileLayer({
    name: config.name,
    visible: config.visible,
    updateOpacityOnZoom: options.updateOpacityOnZoom,
    maxZoom: config.maxNativeZoom || config.maxZoom,
    minZoom: config.minNativeZoomm || config.minZoom,
    zIndex: options.zIndex,
    source,
  });
}
