import Map from 'ol/Map';
import View from 'ol/View';
import 'ol/ol.css';
import './olControls.css';
import { Collection } from 'ol';
import LoadingIndicatorControl from '@/components/map/loadingIndicatorControl';
import getProjectionOl from '@/helpers/projutils';
import { transformExtent } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import Geocoder from 'ol-geocoder';
import 'ol-geocoder/dist/ol-geocoder.min.css';

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
      minZoom: 1,
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
    const initialLayerGroups = [
      new LayerGroup({
        id: 'backgroundGroup',
        name: 'Background Layers',
        layerControlExpand: false,
      }),
      new LayerGroup({
        id: 'dataGroup',
        name: 'Analysis Layers',
        layerControlExpand: true,
      }),
      new LayerGroup({
        id: 'overlayGroup',
        name: 'Overlay Layers',
        layerControlExpand: false,
      }),
      new LayerGroup({
        id: 'internalGroup',
        name: 'App Internal Layers',
        layerControlHide: true,
      }),
    ];
    this.map = new Map({
      controls: new Collection([]),
      layers: initialLayerGroups,
      view: getViewInstance(id, getProjectionOl('EPSG:3857'), options),
    });
    this.map.addControl(new LoadingIndicatorControl({ map: this.map }));
    this.map.set('id', id);

    function CustomProvider(provOptions) {
      const { url } = provOptions;
      return {
        getParameters(opt) {
          return {
            url,
            params: {
              q: opt.query,
              key: opt.key,
              limit: opt.limit,
              countrycode: opt.countrycodes,
            },
          };
        },
        handleResponse(results) {
          if (results.results.length === 0) return [];
          const outResults = results.results.map((result) => ({
            lon: result.geometry.lng,
            lat: result.geometry.lat,
            bbox: [
              result.bounds.southwest.lng,
              result.bounds.southwest.lat,
              result.bounds.northeast.lng,
              result.bounds.northeast.lat,
            ],
            address: {
              name: result.components.house_number || '',
              road: result.components.road || '',
              postcode: result.components.postcode,
              city: result.components.city || result.components.town,
              state: result.components.state,
              country: result.components.country,
            },
            original: {
              formatted: result.formatted,
              details: result.components,
            },
          }));
          return outResults;
        },
      };
    }
    const provider = CustomProvider({
      url: 'https://api.opencagedata.com/geocode/v1/json?=',
    });

    // add geocoder to the map
    const geocoder = new Geocoder('nominatim', {
      provider,
      lang: 'en',
      key: '18144e224ffb4d52819100803cd9b6cc',
      placeholder: 'Find location on map...',
      targetType: 'text-input',
      limit: 5,
      preventDefault: true,
      debug: false,
      autoComplete: true,
      keepOpen: true,
    });
    this.map.addControl(geocoder);
    geocoder.on('addresschosen', (evt) => {
      console.log(evt);
      if (evt.place && evt.place.bbox) {
        const transformedBbox = transformExtent(
          evt.place.bbox, 'EPSG:4326', this.map.getView().getProjection(),
        );
        this.map.getView().fit(
          transformedBbox, {
            duration: 500,
          },
        );
      } else {
        this.map.getView().animate({
          zoom: 14,
          center: evt.coordinate,
        });
      }
    });
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
