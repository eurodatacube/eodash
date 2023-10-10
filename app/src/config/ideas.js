import { baseLayers, overlayLayers } from '@/config/layers';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';

const geojsonFormat = new GeoJSON();
export const indicatorsDefinition = Object.freeze({
  IND4_1: {
    indicatorSummary: 'Indicator 4',
    indicatorOverwrite: 'Flooding',
    themes: ['water'],
  },
});

export const dataPath = './eodash-data/internal/';
export const dataEndpoints = [];

export const defaultLayersDisplay = {
  protocol: 'WMS',
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  minZoom: 1,
  visible: true,
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

export const layerNameMapping = Object.freeze({});

export const indicatorClassesIcons = Object.freeze({
  agriculture: 'mdi-barley',
  water: 'mdi-water',
  land: 'mdi-image-filter-hdr',
  health: 'mdi-hospital-box-outline',
  combined: 'mdi-set-center',
  air: 'mdi-weather-windy',
  economy: 'mdi-currency-eur',
});

export const mapDefaults = Object.freeze({
  bounds: [-10, 35, 33, 70],
});

export const baseLayersMap = [
  baseLayers.eoxosm,
  baseLayers.cloudless,
  {
    ...baseLayers.terrainLight, visible: true,
  },
];

export const overlayLayersMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];

function overpassApiNodes(query) {
  return {
    drawnAreaLimitExtent: true,
    areaFormatFunction: (area) => {
      // overpass api expects lat,lon
      const extent = geojsonFormat.readGeometry(area).getExtent();
      return { area: [extent[1], extent[0], extent[3], extent[2]] };
    },
    url: `https://overpass-api.de/api/interpreter?data=${query}`,
    requestMethod: 'GET',
    callbackFunction: (responseJson) => {
      const ftrs = [];
      const data = responseJson.elements;
      if (Array.isArray(data)) {
        data.forEach((ftr) => {
          const singleGeometry = {
            type: 'Point',
            coordinates: [ftr.lon, ftr.lat],
          };
          ftrs.push({
            type: 'Feature',
            properties: ftr.tags,
            geometry: singleGeometry,
          });
        });
      }
      const ftrColl = {
        type: 'FeatureCollection',
        features: ftrs,
      };
      return ftrColl;
    },
  };
}

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: '',
        indicator: 'IND4_1',
        indicatorName: 'Indicator 4: Flood risk',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: ['2020', '2040', '2060', '2080', '2100', '2120', '2150'],
        inputData: [''],
        yAxis: 'flooding',
        display: {
          wmsVariables: {
            sourceLayer: 'Indicator 4: Flood risk',
            variables: {
              scenario: {
                description: 'Scenario',
                selected: '119',
                items: [
                  {
                    id: '119',
                    description: 'Scenario 119',
                  },
                  {
                    id: '126',
                    description: 'Scenario 126',
                  },
                  {
                    id: '245',
                    description: 'Scenario 245',
                  },
                  {
                    id: '370',
                    description: 'Scenario 370',
                  },
                  {
                    id: '585',
                    description: 'Scenario 585',
                  },
                ],
              },
              height: {
                description: 'Storm surge height in dam',
                selected: '00',
                items: [
                  {
                    id: '00',
                    description: '0',
                  },
                  {
                    id: '05',
                    description: '05',
                  },
                  {
                    id: '10',
                    description: '10',
                  },
                  {
                    id: '15',
                    description: '15',
                  },
                  {
                    id: '20',
                    description: '20',
                  },
                  {
                    id: '30',
                    description: '30',
                  },
                  {
                    id: '50',
                    description: '50',
                  },
                ],
              },
            },
          },
          specialEnvScenario4: true,
          baseUrl: 'https://wcs-eo4sdcr.adamplatform.eu/cgi-bin/mapserv/',
          layers: 'INUNDATION',
          crossOrigin: null,
          dateFormatFunction: (date) => date,
          labelFormatFunction: (date) => date,
          name: 'Indicator 4: Flood risk',
          customAreaFeatures: true,
          features: {
            name: 'OpenStreet Map hospitals, schools',
            styleFunction: (feature) => {
              const amenity = feature.get('amenity');
              const radius = 4;
              const fill = new Fill({
                color: 'rgba(255, 255, 255, 0)',
              });
              const stroke = new Stroke({
                width: 3,
                color: amenity === 'hospital' ? '#003247' : '#7d0240',
              });
              const style = new Style({
                image: new Circle({
                  fill,
                  stroke,
                  radius,
                }),
              });
              return style;
            },
            allowedParameters: ['name', 'amenity'],
            ...overpassApiNodes(
            '[out:json][timeout:30];(node["amenity"="school"]({area});node["amenity"="hospital"]({area}););out body;>;out skel qt;'),
          },
        },
      },
    },
  },
];
