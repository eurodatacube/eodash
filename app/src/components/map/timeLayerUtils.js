
/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} timeObject time definition object
 */

import LayerGroup from 'ol/layer/Group';
import TileWMS from 'ol/source/TileWMS';

// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time) {
  let sources;
  debugger;
  if (layer instanceof LayerGroup) {
    sources = layer.getLayers().getArray().map((l) => l.getSource());
  } else {
    sources = [layer.getSource()];
  }
  sources.forEach((source) => {
    if (config.protocol === 'WMS' && source instanceof TileWMS) {
      source.updateParams({
        LAYERS: config.layers,
        time: config.dateFormatFunction(time),
        env: `year:${time}`,
      });
    }
    source.refresh();
  });
}
