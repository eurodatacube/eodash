
/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} timeObject time definition object
 */
// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time) {
  const source = layer.getSource();
  if (config.protocol === 'WMS') {
    source.updateParams({
      LAYERS: config.layers,
      time: config.dateFormatFunction(time),
      env: `year:${time}`,
    });
  }
  source.refresh();
}
