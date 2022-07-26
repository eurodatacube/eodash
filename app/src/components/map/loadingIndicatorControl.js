import { Control } from 'ol/control';

export default class loadingIndicatorControl extends Control {
  /**
   * @param {Object} options Control options.
   * @param {*} options.map ol map
   */
  constructor(options) {
    const { map } = options;

    const button = document.createElement('button');
    button.className = 'rounded-circle';

    const element = document.createElement('div');
    element.className = 'loading-indicator hidden ol-unselectable ol-control spinner rounded-circle';
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
