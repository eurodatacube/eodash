/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} timeObject time definition object
 */

import LayerGroup from 'ol/layer/Group';
import { applyStyle } from 'ol-mapbox-style';

// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time) {
  if (config.styleFile) {
    // TODO: this is not the way to get the layer for sure,
    // also the whole time logic needs to be done properly
    const currlayer = layer.getLayers().getArray()[0];
    const currStyleLayer = currlayer.get('selectedStyleLayer');
    fetch(config.styleFile).then((r) => r.json())
      .then((glStyle) => {
        currlayer.setSource(null);
        glStyle.sources.air_quality.data = glStyle.sources.air_quality.data.replace('{{time}}', time.replaceAll('-', '_'));
        applyStyle(currlayer, glStyle, [currStyleLayer]);
      })
      .catch(() => console.log('Issue loading mapbox style'));
  } else {
    let sources;
    if (layer instanceof LayerGroup) {
      sources = layer.getLayers().getArray().map((l) => l.getSource());
    } else {
      sources = [layer.getSource()];
    }
    sources.forEach((source) => {
      const updateTimeFunction = source.get('updateTime');
      if (updateTimeFunction) {
        updateTimeFunction(time, config);
      }
      source.refresh();
    });
  }
}
