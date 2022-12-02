import LayerGroup from 'ol/layer/Group';

/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} time time definition object
 * @param {*} drawnArea drawnArea object
 * @param {*} sourceGet one of 'updateTime' or 'updateArea'
 */
// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time, drawnArea, sourceGet = 'updateTime') {
  let sources;
  if (layer instanceof LayerGroup) {
    sources = layer.getLayers().getArray().map((l) => l.getSource());
  } else {
    sources = [layer.getSource()];
  }
  sources.forEach((source) => {
    const updateFunction = source.get(sourceGet);
    if (updateFunction) {
      updateFunction(time, drawnArea, config);
    }
    source.refresh();
  });
}
