import Map from 'ol/Map';
import View from 'ol/View';

/**
 * creates the map instance, to be used as single vue instance property only.
 * @returns {Map}
 */
export default function createMapInstance() {
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
