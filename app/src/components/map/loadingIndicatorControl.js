
import { Control } from 'ol/control';


export default class loadingIndicatorControl extends Control {
  /**
   * @param {Object} options Control options.
   * @param {*} options.map ol map
   */
  constructor(options) {
    const { map } = options;

    const button = document.createElement('button');

    const element = document.createElement('div');
    element.className = 'loading-indicator hidden ol-unselectable ol-control spinner';
    element.appendChild(button);

    super({
      element,
      target: map.getTargetElement(),
    });

    map.on('loadstart', () => {
      element.classList.remove('hidden');
    });
    map.on('loadend', () => {
      element.classList.add('hidden');
    });
  }
}
