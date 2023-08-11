import { baseLayers, overlayLayers } from '@/config/layers';

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
  baseUrl: '`https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`',
  protocol: 'WMS',
  // dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  minZoom: 7,
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

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.eoxosm, baseLayers.cloudless];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.eoxosm, baseLayers.cloudless];

export const overlayLayersLeftMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];
export const overlayLayersRightMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];

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
            sourceLayer: 'IND4_1',
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
          specialEnvTime: true,
          baseUrl: 'https://wcs-eo4sdcr.adamplatform.eu/cgi-bin/mapserv/',
          layers: 'INUNDATION',
          minZoom: 1,
          crossOrigin: null,
          // legendUrl: 'legends/esa/AWS_NO2-VISUALISATION.png',
          dateFormatFunction: (date) => `SSP119_05Y${date}.map`,
          labelFormatFunction: (date) => date,
          name: 'IND4_1',
        },
      },
    },
  },
];
