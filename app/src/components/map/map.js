import Map from 'ol/Map';
import View from 'ol/View';

import 'ol/ol.css';
import './olControls.css';
import { Collection } from 'ol';
import LoadingIndicatorControl from './loadingIndicatorControl';

class VueMap {
  constructor(id, options) {
    this.map = new Map({
      controls: new Collection([]),
      view: new View({
        zoom: 7,
        center: [1558472.87110583, 6024072.119373784],
        padding: [20, 20, 20, 20],
        maxZoom: 17,
        extent: options.constrainExtent,
        constrainOnlyCenter: true,
        enableRotation: false,
      }),
    });
    this.map.addControl(new LoadingIndicatorControl({ map: this.map }));
    this.map.set('id', id);
  }
}
const mapRegistry = {};

/**
 * Returns the ol map with the given id.
 * Will instantiate a new map if not already existing.
 * @param {string} id id of map
 * @param {Object} options options
 * @param {Array} options.constrainExtent optional constraining extent
 * @returns {Map} ol map
 */
export default function getMapInstance(id, options = {}) {
  const map = mapRegistry[id];
  if (!map) {
    mapRegistry[id] = new VueMap(id, options);
  }
  return mapRegistry[id];
}
