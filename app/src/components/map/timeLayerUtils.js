/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} timeObject time definition object
 */

import LayerGroup from 'ol/layer/Group';

// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time) {
  let sources;
  if (layer instanceof LayerGroup) {
    sources = layer.getLayers().getArray().map((l) => l.getSource());
  } else {
    sources = [layer.getSource()];
  }
  sources.forEach((source) => {
    const updateTimeFunction = source.get('updateTime');
    if (updateTimeFunction) {
      updateTimeFunction(time);
    }
    source.refresh();
  });
}
