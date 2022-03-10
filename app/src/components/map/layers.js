import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import countries from '@/assets/countries.json';
import { Fill, Stroke, Style } from 'ol/style';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});
const countriesSource = new VectorSource({
  features: geoJsonFormat.readFeatures(countries),
});


/**
 * generate a layer from a given config Object
 * @param {Object} config eodash config object
 * @param {*} vm vue instance
 * @returns {*} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config) {
  if (config.protocol === 'countries') {
    return new VectorLayer({
      name: 'Country vectors',
      source: countriesSource,
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
  let source;
  if (config.protocol === 'xyz') {
    source = new XYZSource({
      attributions: config.attribution,
      crossOrigin: 'anonymous',
      transition: 0,
      url: config.url,
    });
  }
  return new TileLayer({
    name: config.name,
    visible: config.visible,
    maxZoom: config.maxNativeZoom || config.maxZoom,
    source,
  });
}
