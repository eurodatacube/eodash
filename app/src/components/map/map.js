import Map from 'ol/Map';
import View from 'ol/View';
import Attribution from 'ol/control/Attribution';
import FullScreen from 'ol/control/FullScreen';
import Zoom from 'ol/control/Zoom';

import 'ol/ol.css';
import './olControls.css';

/**
 * creates the map instance, to be used as single vue instance property only.
 * @returns {Map}
 */
function createMapInstance() {
  const map = new Map({
    controls: [
      new FullScreen({
        className: 'theme--dark v-card ol-full-screen',
      }),
      new Zoom({
        className: 'theme--dark v-card ol-zoom',
      }),
      new Attribution({
        className: 'theme--dark v-card ol-attribution',
      }),
    ],
    view: new View({
      zoom: 0,
      center: [0, 0],
      padding: [0, 0, 0, 0],
      enableRotation: false,
    }),
  });

  return map;
}


class VueMap {
  constructor() {
    this.map = createMapInstance();
  }
}
const mapRegistry = {};

/**
 * Returns the ol map with the given id.
 * Will instantiate a new map if not already existing.
 * @param {string} id id of map
 * @returns {Map} ol map
 */
export default function getMapInstance(id) {
  const map = mapRegistry[id];
  if (!map) {
    mapRegistry[id] = new VueMap();
  }
  return mapRegistry[id];
}
