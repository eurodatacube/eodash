import Map from 'ol/Map';
import View from 'ol/View';
import 'ol/ol.css';

/**
 * creates the map instance, to be used as single vue instance property only.
 * @returns {Map}
 */
function createMapInstance() {
  const map = new Map({
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
