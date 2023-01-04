import Map from 'ol/Map';
import View from 'ol/View';

import 'ol/ol.css';
import './olControls.css';
import { Collection } from 'ol';
import LoadingIndicatorControl from './loadingIndicatorControl';
import { getProjectionOl } from './layers';

const mapRegistry = {};
const viewRegistry = {};

export function getViewInstance(id, projection, options = {}) {
  const lookup = `${id}_${projection?.getCode()}`;
  const view = viewRegistry[lookup];
  if (!view) {
    viewRegistry[lookup] = new View({
      zoom: 0,
      center: [0, 0],
      padding: [20, 20, 20, 20],
      maxZoom: 18,
      extent: options.constrainExtent,
      constrainOnlyCenter: true,
      enableRotation: false,
      projection,
    });
  }
  return viewRegistry[lookup];
}

class VueMap {
  constructor(id, options) {
    this.map = new Map({
      controls: new Collection([]),
      view: getViewInstance(id, getProjectionOl('EPSG:3857'), options),
    });
    this.map.addControl(new LoadingIndicatorControl({ map: this.map }));
    this.map.set('id', id);
  }
}

/**
 * Returns the ol map with the given id.
 * Will instantiate a new map if not already existing.
 * @param {string} id id of map
 * @param {Object} options options
 * @param {Array} options.constrainExtent optional constraining extent
 * @returns {Map} ol map
 */
export function getMapInstance(id, options = {}) {
  const map = mapRegistry[id];
  if (!map) {
    mapRegistry[id] = new VueMap(id, options);
  }
  return mapRegistry[id];
}
