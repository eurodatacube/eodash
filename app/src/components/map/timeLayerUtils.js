/**
 * updates the layer source of a given layer to show data of the given time object
 * @param {*} layer openlayers layer
 * @param {*} config config object (e.g. "mergedConfigsData")
 * @param {*} timeObject time definition object
 */

import LayerGroup from 'ol/layer/Group';
import { applyStyle, stylefunction } from 'ol-mapbox-style';

// eslint-disable-next-line import/prefer-default-export
export function updateTimeLayer(layer, config, time) {
  debugger;
  layer.setSource(null);
  applyStyle(layer, 'data/gtif/data/air_quality_at_2022-09-16.json', ['NO2']);
  /*fetch('data/gtif/data/air_quality_at_2022-09-16.json').then(function(response) {
    response.json().then(function(glStyle) {
      stylefunction(layer, glStyle, 'NO2');
    });
  });
  */
  /*layer.getSource().setUrl('data/gtif/data/air_quality_at_2022-09-16.json');
  layer.getSource().refresh();*/
  if (config.styleFile) {
    // TODO: this is not the way to get the layer for sure,
    // also the whole time logic needs to be done properly
    // const currlayer = layer.getLayers().getArray()[0];
    /*
    fetch(config.styleFile).then((r) => r.json())
      .then((glStyle) => {
        debugger;
        const newGlStyle = JSON.parse(JSON.stringify(glStyle));
        newGlStyle.sources.air_quality.data = newGlStyle.sources.air_quality.data.replace('{{time}}', time.replaceAll('-', '_'));
        const source = currlayer.getSource();
        source.url_ = 'data/gtif/data/air_quality/2022_09_15.geojson';
        applyStyle(currlayer, newGlStyle, [currStyleLayer]).then(()=> {
          debugger;
          source.refresh();
      });
        
      })
      .catch(() => console.log('Issue loading mapbox style'));
      */
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
        updateTimeFunction(time);
      }
      source.refresh();
    });
  }
}
