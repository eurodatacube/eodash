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

    // two sources of loading events, OL map and custom chart
    // show loading indicator if ANY of two is loading
    // using custom classes on loading element to track loading state
    map.on('loadstart', () => {
      element.classList.remove('hidden');
      element.classList.add('loading-map');
    });
    map.on('loadend', () => {
      if (!element.classList.contains('loading-custom-data')) {
        element.classList.add('hidden');
      }
      element.classList.remove('loading-map');
    });
    map.on('customChartLoadStart', () => {
      element.classList.remove('hidden');
      element.classList.add('loading-custom-data');
    });
    map.on('customChartLoadEnd', () => {
      if (!element.classList.contains('loading-map')) {
        element.classList.add('hidden');
      }
      element.classList.remove('loading-custom-data');
    });
  }
}
