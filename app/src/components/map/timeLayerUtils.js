/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} time time definition object
 * @param {*} drawnArea drawnArea object
 * @param {*} sourceGet one of 'updateTime' or 'updateArea'
 */

import GeoTIFF from 'ol/source/GeoTIFF';

// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time, drawnArea, sourceGet = 'updateTime') {
  if (config.protocol === 'cog' && 'sources' in config && !config.features) {
    const updatedSources = config.sources.map((item) => {
      const url = item.url.replace(/{time}/i, config.dateFormatFunction(time));
      return { url };
    });
    layer.setSource(new GeoTIFF({
      sources: updatedSources,
      normalize: config.normalize ? config.normalize : false,
      interpolate: false,
    }));
  } else if (Array.isArray(time)) {
    // This case if for geotiff assets passed in the time
    layer.setSource(new GeoTIFF({
      sources: time[1].map((url) => ({ url })),
      normalize: config.normalize ? config.normalize : false,
      interpolate: false,
    }));
  } else {
    const source = layer.getSource();
    const updateTimeFunction = source.get(sourceGet);
    if (updateTimeFunction) {
      updateTimeFunction(time, drawnArea, config, layer);
    }
    source.refresh();
  }
}
