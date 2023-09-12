/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} time time definition object
 * @param {*} drawnArea drawnArea object
 * @param {*} sourceGet one of 'updateTime' or 'updateArea'
 */

import GeoTIFF from 'ol/source/GeoTIFF';
import { applyStyle } from 'ol-mapbox-style';

// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time, drawnArea, sourceGet = 'updateTime') {
  if (config.protocol === 'cog') {
    const updatedSources = config.sources.map((item) => {
      const url = item.url.replace(/{time}/i, config.dateFormatFunction(time));
      return { url };
    });
    layer.setSource(new GeoTIFF({
      sources: updatedSources,
      normalize: config.normalize ? config.normalize : false,
      interpolate: false,
    }));
  } else if (config.styleFile) {
    // TODO: this is not the way to get the layer for sure,
    // also the whole time logic needs to be done properly
    const currStyleLayer = currlayer.get('selectedStyleLayer');
    fetch(config.styleFile).then((r) => r.json())
      .then((glStyle) => {
        layer.setSource(null);
        // eslint-disable-next-line no-param-reassign
        glStyle.sources.air_quality.data = glStyle
          .sources.air_quality.data.replace('{{time}}', time.replaceAll('-', '_'));
        applyStyle(layer, glStyle, [currStyleLayer]);
      })
      .catch(() => console.log('Issue loading mapbox style'));
  } else {
    const source = layer.getSource();
    const updateTimeFunction = source.get(sourceGet);
    if (updateTimeFunction) {
      updateTimeFunction(time, drawnArea, config, layer);
    }
    source.refresh();
  }
}
