import Map from 'ol/Map';
import View from 'ol/View';
import Attribution from 'ol/control/Attribution';
import FullScreen from 'ol/control/FullScreen';
import Zoom from 'ol/control/Zoom';
import MousePosition from 'ol/control/MousePosition';
import { toStringXY } from 'ol/coordinate';

import 'ol/ol.css';
import './olControls.css';
import LoadingIndicatorControl from './loadingIndicatorControl';

class VueMap {
  constructor(id, options) {
    this.controls = [
      new FullScreen({
        className: 'ol-full-screen',
      }),
      new Zoom({
        className: 'ol-zoom',
      }),
      new MousePosition({
        coordinateFormat: (coordinates) => {
          let lonValue = coordinates[0] % 360;
          if (lonValue > 180) {
            lonValue -= 360;
          } else if (lonValue < -180) {
            lonValue += 360;
          }
          return `<span>${toStringXY([lonValue, coordinates[1]], 3)}</span>`;
        },
        projection: 'EPSG:4326',
        className: 'ol-control ol-mouse-position',
        placeholder: false,
      }),
      new Attribution({
        className: 'ol-attribution',
      }),
    ];
    this.map = new Map({
      controls: this.controls,
      view: new View({
        zoom: 0,
        center: [0, 0],
        padding: [0, 0, 0, 0],
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
