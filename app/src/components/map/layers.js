import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';


/**
 * generate a layer from a given config Object
 * @returns {*} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config) {
  let source;
  if (config.protocol === 'xyz') {
    source = new XYZSource({
      attributions: config.attribution,
      crossOrigin: 'anonymous',
      url: config.url,
    });
  }
  return new TileLayer({
    name: config.name,
    visible: config.visible,
    maxZoom: config.maxNativeZoom,
    source,
  });
}
