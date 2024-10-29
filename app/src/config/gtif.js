import { Wkt } from 'wicket';
import shTimeFunction from '@/shTimeFunction';
import {
  baseLayers, overlayLayers, trucksFeatures, trucksAreaIndicator,
} from '@/config/layers';
import { DateTime } from 'luxon';
import colormap from 'colormap';
import availableDates from '@/config/gtif_dates.json';
import { createIDEASDatasetConfigs } from '@/config/ideas_config';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';

export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/GTIF/catalog.json';

// Helper function to create colorscales for cog style rendering
function getColorStops(name, min, max, steps, reverse) {
  const delta = (max - min) / (steps - 1);
  const stops = new Array(steps * 2);
  const colors = colormap({
    colormap: name, nshades: steps, format: 'rgba',
  });
  if (reverse) {
    colors.reverse();
  }
  for (let i = 0; i < steps; i++) {
    stops[i * 2] = min + i * delta;
    stops[i * 2 + 1] = colors[i];
  }
  return stops;
}

function getColormap(name, reverse) {
  const colors = colormap({
    colormap: name, nshades: 16, format: 'rgba',
  });
  if (reverse) {
    colors.reverse();
  }
  return colors;
}

function clamp(value, low, high) {
  return Math.max(low, Math.min(value, high));
}

let stp = 1 / 6;

const adoColor = {
  steps: 32,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [215, 25, 28] },
      { index: stp * 1, rgb: [253, 174, 97] },
      { index: stp * 2, rgb: [255, 255, 191] },
      { index: stp * 3, rgb: [255, 255, 255] },
      { index: stp * 4, rgb: [245, 153, 246] },
      { index: stp * 5, rgb: [180, 103, 221] },
      { index: stp * 6, rgb: [69, 0, 153] },
    ],
    nshades: 32,
  }),
};

stp = 1 / 7;

const grywrd = {
  steps: 128,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [0, 83, 30] },
      { index: stp * 1, rgb: [195, 229, 86] },
      { index: stp * 2, rgb: [255, 221, 86] },
      { index: stp * 3, rgb: [246, 119, 88] },
      { index: stp * 4, rgb: [255, 151, 63] },
      { index: stp * 5, rgb: [255, 99, 49] },
      { index: stp * 6, rgb: [213, 0, 31] },
      { index: stp * 7, rgb: [99, 0, 13] },
    ],
    nshades: 128,
  }),
};

const whitered = [
  { index: 0, rgb: [255, 255, 255] },
  { index: stp * 1, rgb: [255, 251, 247] },
  { index: stp * 2, rgb: [254, 238, 223] },
  { index: stp * 3, rgb: [254, 214, 183] },
  { index: stp * 4, rgb: [250, 177, 129] },
  { index: stp * 5, rgb: [233, 131, 77] },
  { index: stp * 6, rgb: [184, 84, 38] },
  { index: stp * 7, rgb: [127, 39, 4] },
];

const heatadaptCM = [
  { index: 0, rgb: [43, 131, 186] },
  { index: 0.25, rgb: [171, 221, 164] },
  { index: 0.5, rgb: [255, 255, 191] },
  { index: 0.75, rgb: [253, 174, 97] },
  { index: 1, rgb: [215, 25, 28] },
];

const heatadaptImperviousness = [
  { index: 0, rgb: [255, 253, 188] },
  { index: 1, rgb: [255, 180, 4] },
];

// stp = 1 / 6;
// const heatadaptReds = [
//   { index: 0, rgb: [255, 245, 240] },
//   { index: stp * 1, rgb: [254, 224, 210] },
//   { index: stp * 2, rgb: [252, 187, 161] },
//   { index: stp * 3, rgb: [252, 146, 114] },
//   { index: stp * 4, rgb: [251, 106, 74] },
//   { index: stp * 5, rgb: [165, 15, 21] },
//   { index: stp * 6, rgb: [103, 0, 13] },
// ];

const blgrrd = {
  steps: 32,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [1, 152, 189] },
      { index: 0.2, rgb: [73, 227, 206] },
      { index: 0.4, rgb: [216, 254, 181] },
      { index: 0.6, rgb: [254, 237, 177] },
      { index: 0.8, rgb: [254, 173, 84] },
      { index: 1, rgb: [209, 55, 78] },
    ],
    nshades: 32,
  }),
};

function normalize(value, varMin, varMax) {
  return ['/', ['-', value, ['var', varMin]], ['-', ['var', varMax], ['var', varMin]]];
}

function bandModifier(xOffset = 0, yOffset = 0, scale = 1) {
  if (xOffset === 0 && yOffset === 0) {
    return ['*', ['band', 1], scale];
  }
  return ['*', ['band', 1, xOffset, yOffset], scale];
}

// hack as long as there is no binding to the built-in shader function floor
function floor(n) {
  return ['-', n, ['%', n, 1]];
}

function diff(a, b) {
  return ['abs', ['-', a, b]];
}

function contspace(v, varOffset, varSpacing) {
  return floor(['/', ['+', v, ['var', varOffset]], ['var', varSpacing]]);
}

const wkt = new Wkt();

export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/gtif/pois_gtif.json',
  },
];

export const layerNameMapping = Object.freeze({
  S2L2A_REP4: {
    minZoom: 7,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
  },
  S1GRD_REP4: {
    minZoom: 7,
    layers: 'E8_SENTINEL1',
  },
});

export const indicatorClassesIcons = Object.freeze({
  'energy-transition': 'mdi-water',
  'mobility-transition': 'mdi-car',
  'sustainable-cities': 'mdi-solar-panel-large',
  'carbon-accounting': 'mdi-pine-tree',
  'eo-adaptation-services': 'mdi-set-center',
});

export const geoDBFeatureParameters = Object.freeze({
  url: 'https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF',
});

export const mapDefaults = Object.freeze({
  bounds: [11, 46.5, 15.5, 48.9],
});

export const baseLayersMap = [
  baseLayers.s1EodcBackscattervv,
  baseLayers.s1EodcBackscattervh,
  baseLayers.ESA_WORLD_COVER,
  baseLayers.CORINE_LAND_COVER,
  baseLayers.geolandbasemap,
  baseLayers.bmapgelaende,
  baseLayers.bmaporthofoto30cm,
  baseLayers.eoxosm,
  baseLayers.cloudless,
  {
    ...baseLayers.terrainLight, visible: true,
  },
];

export const overlayLayersMap = [
  overlayLayers.powerOpenInfrastructure,
  {
    ...overlayLayers.eoxOverlay, visible: true,
  },
];

const nutsStyle = {
  attribution: 'Administrative boundaries: © EuroGeographics, © TurkStat. Source: European Commission – Eurostat/GISCO',
  visible: true,
  protocol: 'GeoJSON',
  style: {
    fillColor: 'rgba(0, 0, 0, 0)',
    strokeColor: '#006762',
  },
};

export const darkOverlayLayers = [{
  ...nutsStyle,
  attribution: 'Administrative boundaries: © EuroGeographics, © TurkStat. Source: European Commission – Eurostat/GISCO',
  name: 'NUTS L0',
  url: 'data/gtif/data/AT_NUTS_L0.geojson',
}];

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  format: 'image/png',
  tileSize: 512,
  dateFormatFunction: shTimeFunction,
  transparent: true,
  opacity: 1,
  attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  visible: true,
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

const getMinuteIntervals = (start, end, minutes) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"));
    currentDate = DateTime.fromISO(currentDate).plus({ minutes });
  }
  return dateArray;
};

const getDailyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ days: 1 });
  }
  return dateArray;
};

const solarAndGreenRoofDefaults = [
  baseLayers.s1EodcBackscattervv,
  baseLayers.s1EodcBackscattervh,
  baseLayers.geolandbasemap,
  {
    ...baseLayers.bmaporthofoto30cm, visible: true,
  },
  baseLayers.bmapgelaende,
  baseLayers.eoxosm,
  baseLayers.cloudless,
  baseLayers.terrainLight,
];

const energyTransitionDefaults = {
  baseLayers: [
    baseLayers.bodenwertigkeitskarte_agri,
    baseLayers.bodenwertigkeitskarte_grassland,
    baseLayers.dsr_schnelllade_10km,
    ...baseLayersMap,
  ],
  overlayLayers: [
    { ...overlayLayers.powerOpenInfrastructure, visible: true },
    { ...overlayLayers.eoxOverlay, visible: true },
    {
      protocol: 'GeoJSON',
      visible: false,
      name: 'Wind turbine detections',
      url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/wind_turbines/wind-turbines-austria-version1.geojson',
      style: {
        strokeColor: '#ff0000',
        width: 4,
      },
    },
  ],
};

const eoadaptationDefaults = {
  baseLayers: [
    {
      ...baseLayers.s2AT2022,
      visible: true,
    },
    baseLayers.s2AT2021,
    baseLayers.terrainLight,
    baseLayers.bmaporthofoto30cm,
    baseLayers.cloudless,
  ],
};

const mobilityTransitionDefaults = {
  baseLayers: [
    baseLayers.dsr_schnelllade_10km,
    ...baseLayersMap,
  ],
};

export const indicatorsDefinition = Object.freeze({
  REP1: {
    customAreaIndicator: true,
    ...energyTransitionDefaults,
  },
  REP1_1: {
    customAreaIndicator: true,
    ...energyTransitionDefaults,
  },
  REP1_2: {
    customAreaIndicator: true,
    ...energyTransitionDefaults,
  },
  REP2: {
    ...energyTransitionDefaults,
  },
  REP2_1: {
    ...energyTransitionDefaults,
  },
  REP2_2: {
    ...energyTransitionDefaults,
  },
  REP2_3: {
    ...energyTransitionDefaults,
  },
  REP2_4: {
    ...energyTransitionDefaults,
  },
  REP4_1: {
    maxDecimals: 5,
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.cloudless,
    baseLayers.eoxosm,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm,
    baseLayers.s1EodcBackscattervv,
    baseLayers.s1EodcBackscattervh],
    dataInfo: 'SWE',
    subAoiTransparent: true,
  },
  REP4_2: {
    maxDecimals: 5,
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.cloudless,
    baseLayers.eoxosm,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm,
    baseLayers.s1EodcBackscattervv,
    baseLayers.s1EodcBackscattervh],
    dataInfo: 'SWE',
    subAoiTransparent: true,
  },
  REP4_4: {
    dataInfo: 'WSE',
    subAoiTransparent: true,
  },
  REP4_5: {
    dataInfo: 'SWE',
    subAoiTransparent: true,
  },
  REP4_6: {
    dataInfo: 'SWE',
    subAoiTransparent: true,
    maxDecimals: 5,
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.cloudless,
    baseLayers.eoxosm,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmapgelaende,
    baseLayers.s1EodcBackscattervv,
    baseLayers.s1EodcBackscattervh],
  },
  REP5: {
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.s1EodcBackscattervv,
    baseLayers.s1EodcBackscattervh,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm,
    baseLayers.eoxosm,
    baseLayers.terrainLight,
    ],
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: false, minZoom: 13 },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  REP6: {
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.s1EodcBackscattervv,
    baseLayers.s1EodcBackscattervh,
    baseLayers.terrainLight,
    baseLayers.eoxosm,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm,
    ],
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: false, minZoom: 13 },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  MOBI1: {
    ...mobilityTransitionDefaults,
    customAreaIndicator: true,
  },
  MOBI1_1: {
    ...mobilityTransitionDefaults,
    customAreaIndicator: true,
  },
  SOL1: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_1: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_2: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_3: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_4: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_5: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_6: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL1_7: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL2: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL2_1: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL2_2: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  SOL2_3: {
    baseLayers: solarAndGreenRoofDefaults,
    customAreaIndicator: true,
  },
  LST: {
  },
  FCM1: {
    ...eoadaptationDefaults,
  },
  FCM2: {
    ...eoadaptationDefaults,
  },
  FCM3: {
  },
  VTT: {
  },
  ADO: {
    customAreaIndicator: true,
  },
  ADO_1: {
    customAreaIndicator: true,
  },
  ADO_2: {
    customAreaIndicator: true,
  },
  ADO_3: {
    customAreaIndicator: true,
  },
  AQA: {
    ...mobilityTransitionDefaults,
    customAreaIndicator: true,
  },
  AQB: {
    ...mobilityTransitionDefaults,
    customAreaIndicator: true,
  },
  AQC: {
    ...mobilityTransitionDefaults,
    customAreaIndicator: true,
  },
  AQ1: {
    customAreaIndicator: true,
  },
  HAUC1: {
    customAreaIndicator: true,
    baseLayers: solarAndGreenRoofDefaults,
  },
  // commented out so that selection is disabled
  // AQ1_1: {
  //   customAreaIndicator: true,
  // },
  AQ1_2: {
    customAreaIndicator: true,
  },
  AQ1_3: {
    customAreaIndicator: true,
  },
  AQ1_4: {
    customAreaIndicator: true,
  },
  AQ1_5: {
    customAreaIndicator: true,
  },
  AQ1_6: {
    customAreaIndicator: true,
  },
  AQ2: {
    ...mobilityTransitionDefaults,
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm,
      visible: true,
    }, baseLayers.geolandbasemap],
    overlayLayers: [],
  },
  // AQ3: {
  //   ...mobilityTransitionDefaults,
  //   // TODO: This is a quick fix, we should consider impleemnting nice loading of data from geodb
  //   geoDBDataQuery: 'no2_data?date=gt.2022-09-01',
  //   geoDBParameters: 'date,no2_ec_station_ppbv',
  //   disableCSV: true,
  //   overlayLayers: [],
  //   baseLayers: [{
  //     ...baseLayers.bmaporthofoto30cm,
  //     visible: true,
  //   }],
  // },
  AQ4: {
    ...mobilityTransitionDefaults,
  },
  AQ4_1: {
    ...mobilityTransitionDefaults,
  },
  AQ4_2: {
    ...mobilityTransitionDefaults,
  },
  AQ4_3: {
    ...mobilityTransitionDefaults,
  },
  AQ4_4: {
    ...mobilityTransitionDefaults,
  },
  AQ4_5: {
    ...mobilityTransitionDefaults,
  },
  AQ5: {
    ...mobilityTransitionDefaults,
  },
  WSF: {
  },
  E12c: {
    customAreaIndicator: true,
    customAreaFeatures: true,
  },
  E12d: {
    customAreaIndicator: true,
    customAreaFeatures: true,
  },
  EO4A: {
    dataInfo: 'EO4A',
  },
  EO4A2: {
    dataInfo: 'EO4A2',
  },
});

function createREP1Config(indicatorCode, rasterFileUrl) {
  const config = {
    properties: {
      indicatorObject: {
        indicator: indicatorCode,
        queryParameters: {
          sourceLayer: 'wind_average_zsp',
          selected: '1,2,3,4,5,6,7,8,9,10,11,12',
          items: [],
        },
        cogFilters: {
          sourceLayer: 'REP1',
          filters: {
            powerDensity: {
              display: true,
              label: 'Wind Power Density [w/m²]',
              id: 'powerDensity',
              min: 0,
              max: 4000,
              step: 10,
              header: true,
              range: [0, 4000],
            },
            elevation: {
              display: true,
              label: 'Filter for elevation [m]',
              id: 'elevation',
              dataInfo: 'Elevation',
              min: 0,
              max: 4000,
              step: 10,
              range: [0, 4000],
            },
            slope: {
              display: true,
              label: 'Filter for slope [°]',
              id: 'slope',
              dataInfo: 'Slope',
              min: 0,
              max: 50,
              range: [0, 50],
            },
            settlementDistance: {
              display: false,
              label: 'Distance to settlements WSF [m]',
              id: 'settlementDistance',
              dataInfo: 'SettlementDistance',
              type: 'slider',
              inverted: false,
              min: 0,
              max: 5000,
              value: 0,
              step: 10,
            },
            cadasterDistance: {
              display: false,
              label: 'Distance to settlements Austrian Cadaster [m]',
              id: 'cadasterDistance',
              dataInfo: 'CadasterDistance',
              type: 'slider',
              min: 0,
              max: 5000,
              value: 0,
              step: 10,
              inverted: false,
            },
            energyGridDistance: {
              display: false,
              label: 'Distance to energy grid [m]',
              id: 'energyGridDistance',
              dataInfo: 'EnergyGridDistance',
              type: 'slider',
              inverted: true,
              min: 0,
              max: 25000,
              value: 25000,
              step: 10,
            },
            ruggedness: {
              display: false,
              label: 'Filter for ruggedness index',
              id: 'ruggedness',
              type: 'slider',
              inverted: true,
              dataInfo: 'Ruggedness',
              min: 0,
              max: 1,
              value: 1,
            },
            protectedZones: {
              display: true,
              type: 'boolfilter',
              label: 'Exclude protected areas',
              id: 'protected',
              dataInfo: 'ProtectedAreas',
              value: 0,
            },
          },
        },
        display: [{
          dataInfo: 'WindPowerDensity',
          processingEnabled: true,
          protocol: 'cog',
          id: 'REP1',
          sources: [
            { url: rasterFileUrl },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Natura2000_Austria_COG_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/RuggednessIndex_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/CadasterDistance_COG_v2.tif' },
          ],
          style: {
            variables: {
              powerDensityMin: 0,
              powerDensityMax: 4000,
              elevationMin: 0,
              elevationMax: 4000,
              slopeMin: 0,
              slopeMax: 50,
              settlementDistance: 0,
              energyGridDistance: 25000,
              protected: 0,
              ruggedness: 1,
              cadasterDistance: 0,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 1], ['var', 'powerDensityMin'], ['var', 'powerDensityMax']],
                ['between', ['band', 2], ['var', 'elevationMin'], ['var', 'elevationMax']],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['>=', ['band', 4], ['var', 'settlementDistance']],
                ['<', ['band', 5], ['var', 'energyGridDistance']],
                ['<', ['band', 7], ['var', 'ruggedness']],
                ['>=', ['band', 8], ['var', 'cadasterDistance']],
                ['any',
                  ['==', ['var', 'protected'], 0],
                  ['==', ['band', 6], 0],
                ],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('yignbu', 1, 400, 50, false),
                ...getColorStops('yiorrd', 400, 2400, 50, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Wind Power Density',
        }, {
          ...nutsStyle,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Zaehlsprengel_3857',
          protocol: 'geoserverTileLayer',
          name: 'Census Track (Zählsprengel)',
          visible: true,
          minZoom: 12,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        }, {
          ...overlayLayers.protectionZones,
        }, {
          ...overlayLayers.protectionZonesNatura,
        }],
      },
    },
  };
  return config;
}

function createREP2Config(indicatorCode, rasterFileUrl, min, max) {
  const config = {
    properties: {
      indicatorObject: {
        indicator: indicatorCode,
        cogFilters: {
          sourceLayer: 'REP2',
          filters: {
            solar: {
              display: true,
              label: 'Global Horizontal Irradiation [kWh/m²/day]',
              id: 'solar',
              header: true,
              min,
              max,
              range: [min, max],
            },
            aspect: {
              display: true,
              label: 'Filter for aspect',
              id: 'aspect',
              min: 0,
              max: 360,
              range: [90, 180],
              isCircular: true,
            },
            slope: {
              display: true,
              label: 'Filter for slope',
              id: 'slope',
              dataInfo: 'Slope',
              min: 0,
              max: 50,
              range: [0, 50],
            },
            energyGridDistance: {
              display: false,
              label: 'Distance to energy grid [m]',
              id: 'energyGridDistance',
              dataInfo: 'EnergyGridDistance',
              type: 'slider',
              min: 0,
              max: 25000,
              value: 25000,
              step: 20,
              inverted: true,
            },
            elevation: {
              display: false,
              label: 'Filter for elevation [m]',
              id: 'elevation',
              dataInfo: 'Elevation',
              min: 0,
              max: 4000,
              range: [0, 4000],
            },
            protectedZones: {
              display: true,
              type: 'boolfilter',
              label: 'Exclude protected areas',
              id: 'protected',
              dataInfo: 'ProtectedAreas',
              value: 0,
            },
          },
        },
        display: [{
          dataInfo: 'GlobalHorizontalIrradiation',
          protocol: 'cog',
          id: 'REP2',
          sources: [
            { url: rasterFileUrl },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Natura2000_Austria_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              solarMin: min,
              solarMax: max,
              aspectMin: 90,
              aspectMax: 270,
              aspectMin2: 0,
              aspectMax2: 0,
              slopeMin: 0,
              slopeMax: 50,
              energyGridDistance: 25000,
              elevationMin: 0,
              elevationMax: 4000,
              protected: 0,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 1],
                ['between', ['band', 1], ['var', 'solarMin'], ['var', 'solarMax']],
                ['any',
                  ['between',
                    ['band', 2],
                    ['var', 'aspectMin'],
                    ['var', 'aspectMax'],
                  ],
                  ['between',
                    ['band', 2],
                    ['var', 'aspectMin2'],
                    ['var', 'aspectMax2'],
                  ],
                ],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['<', ['band', 4], ['var', 'energyGridDistance']],
                ['between', ['band', 5], ['var', 'elevationMin'], ['var', 'elevationMax']],
                ['any',
                  ['==', ['var', 'protected'], 0],
                  ['==', ['band', 6], 0],
                ],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('yignbu', min, (max - min) / 2, 50, false),
                ...getColorStops('yiorrd', (max - min) / 2, max, 50, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Solar Energy',
        }, {
          ...overlayLayers.protectionZones,
        }, {
          ...overlayLayers.protectionZonesNatura,
        }],
      },
    },
  };
  return config;
}

function createAQ4Config(indicatorCode, selectedVariable, itemConfig) {
  const config = {
    properties: {
      indicatorObject: {
        indicator: indicatorCode,
        queryParameters: {
          sourceLayer: 'trajectories_on_edges_austria_daily',
          selected: selectedVariable,
          items: [
            {
              id: selectedVariable,
              colormapUsed: blgrrd,
              ...itemConfig,
            },
          ],
        },
        time: getDailyDates('2019-07-01T00:00Z', '2022-12-31T22:00:00Z'),
        display: {
          dataInfo: indicatorCode,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Network_edges_subset_3857',
          protocol: 'geoserverTileLayer',
          style: {
            getStrokeColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = feature.get('fid');
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                  const value = data[id][currPar.id];
                  const { min, max, colormapUsed } = currPar;
                  let f = clamp((value - min) / (max - min), 0, 1);
                  if (['n_trajectories_max'].includes(currPar.id)) {
                    f = clamp((Math.log10(value) - Math.log10(min))
                      / (Math.log10(max) - Math.log10(min)), 0, 1);
                  }
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
            fillColor: '#ffffff',
            width: 5,
          },
          id: 'trajectories_on_edges_austria_daily',
          adminZoneKey: 'unique_id',
          parameters: `unique_id,${selectedVariable}`,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  };
  return config;
}

function createADOConfig(indicatorCode, selectedVariable) {
  const config = {
    properties: {
      indicatorObject: {
        time: getDailyDates('2015-01-01', '2023-05-18'),
        indicator: indicatorCode,
        queryParameters: {
          sourceLayer: 'ado_data',
          selected: selectedVariable,
          items: [
            {
              id: selectedVariable,
              min: -2,
              max: 2,
              colormapUsed: adoColor,
            },
          ],
        },
        display: {
          dataInfo: indicatorCode,
          opacity: 0.7,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_NUTS_L3_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = feature.get('nuts_id').replace(/\s/g, ''); // need to remove white spaces
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                  const value = data[id][currPar.id];
                  const { min, max, colormapUsed } = currPar;
                  const f = clamp((value - min) / (max - min), 0, 1);
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
          },
          id: 'ado_data',
          allowedParameters: ['nuts_name', 'nuts_id'],
          adminZoneKey: 'nuts_id',
          parameters: `${selectedVariable},nuts_id`,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  };
  return config;
}
function createMOBI1Config(indicatorCode, selectedVariable, itemConfig, yAxis) {
  const config = {
    properties: {
      indicatorObject: {
        yAxis,
        time: getDailyDates('2019-07-01', '2022-12-31'),
        indicator: indicatorCode,
        queryParameters: {
          sourceLayer: 'mobility_daily',
          selected: selectedVariable,
          items: [
            {
              id: selectedVariable,
              colormapUsed: blgrrd,
              ...itemConfig,
            },
          ],
        },
        display: {
          dataInfo: indicatorCode,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = feature.id_;
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                  const value = data[id][currPar.id];
                  const { min, max, colormapUsed } = currPar;
                  // apply logarithmic scale specially for population
                  const f = clamp((Math.log10(value) - Math.log10(min))
                    / (Math.log10(max) - Math.log10(min)), 0, 1);
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
            strokeColor: 'rgba(0,0,0,0)',
          },
          opacity: 0.7,
          id: 'mobility_daily',
          adminZoneKey: 'adminzoneid',
          parameters: `adminzoneid,${selectedVariable}`,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        },
      },
    },
  };
  return config;
}

function createAQ1Config(indicatorCode, selectedVariable, itemConfig, yAxis, selectionEnabled = true) {
  const config = {
    properties: {
      indicatorObject: {
        time: availableDates.aggregated_data,
        indicator: indicatorCode,
        yAxis,
        queryParameters: {
          sourceLayer: 'aggregated_trajs_model_satellite_v1',
          selected: selectedVariable,
          items: [
            {
              id: selectedVariable,
              colormapUsed: blgrrd,
              ...itemConfig,
            },
          ],
        },
        display: {
          dataInfo: indicatorCode,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_grid_gtif_aggregated_data',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = Number(feature.get('object_id'));
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                  const value = data[id][currPar.id];
                  if (value != null && value !== 0) {
                    const { min, max, colormapUsed } = currPar;
                    let f = clamp((value - min) / (max - min), 0, 1);
                    if (['n_trajectories', 'motorized_count'].includes(currPar.id)) {
                      const normalized = (Math.log10(value) - Math.log10(min))
                      / (Math.log10(max) - Math.log10(min));
                      f = clamp(normalized, 0, 1);
                    }
                    color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                  }
                }
              }
              return color;
            },
          },
          selection: selectionEnabled ? {
            mode: 'multiple',
          } : false,
          tooltip: false,
          id: 'aggregated_trajs_model_satellite_v1',
          timeKey: 'timestamp',
          adminZoneKey: 'satellite_id',
          parameters: `satellite_id,${selectedVariable}`,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  };
  return config;
}

function createSOL1Config(indicatorCode, selectedVariable) {
  const config = {
    properties: {
      indicatorObject: {
        indicator: indicatorCode,
        queryParameters: {
          selected: 'lst30mme,grpotare5,grpotare20,grpotare45,co2red_05,co2red_20,co2red_45,grexisting',
        },
        wmsStyles: {
          sourceLayer: 'Green Roofs',
          items: [
            {
              id: selectedVariable,
            },
          ],
        },
        display: [{
          dataInfo: indicatorCode,
          minZoom: 8,
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          STYLES: selectedVariable,
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/green_rooftops_v3.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: selectedVariable,
          adminZoneKey: 'zsp_id',
          dateFormatFunction: () => '2023-01-01',
        }, {
          ...nutsStyle,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Zaehlsprengel_3857',
          protocol: 'geoserverTileLayer',
          name: 'Census Track (Zählsprengel)',
          visible: true,
          minZoom: 13,
          selection: {
            mode: 'multiple',
            layer: 'GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          },
          tooltip: true,
          dynamicSelectionStroke: false,
          allowedParameters: ['name'],
        }],
      },
    },
  };
  return config;
}

function createSOL2Config(indicatorCode, selectedVariable) {
  const config = {
    properties: {
      indicatorObject: {
        indicator: indicatorCode,
        queryParameters: {
          selected: 'pvusearea,pvexisting,pvpotentl,pveppmwhhp,pveppmwhrp,pveppmwhlp',
        },
        wmsStyles: {
          sourceLayer: 'Solar Roofs',
          items: [
            {
              id: selectedVariable,
            },
          ],
        },
        display: [{
          dataInfo: indicatorCode,
          minZoom: 8,
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          STYLES: selectedVariable,
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/solar_rooftops_v1.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: selectedVariable,
          adminZoneKey: 'zsp_id',
          dateFormatFunction: () => '2023-01-01',
        }, {
          ...nutsStyle,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Zaehlsprengel_3857',
          protocol: 'geoserverTileLayer',
          name: 'Census Track (Zählsprengel)',
          visible: true,
          minZoom: 13,
          selection: {
            mode: 'multiple',
            layer: 'GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          },
          tooltip: true,
          allowedParameters: ['name'],
        }],
      },
    },
  };
  return config;
}

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        indicator: 'HAUC1',
        time: [
          ['2022', '2022_LST_AT_merged_composite_mean_70m_3857.tif'],
          ['2023', '2023_LST_AT_merged_composite_mean_70m_3857.tif'],
          ['2024', '2024_LST_AT_merged_composite_mean_70m_3857.tif'],
        ],
        cogFilters: {
          sourceLayer: 'HAUC1',
          filters: {
            var: {
              display: true,
              label: 'Imperviosness [%]',
              id: 'var',
              min: 0,
              max: 100,
              range: [0, 100],
            },
          },
        },
        display: [
          {
            protocol: 'cog',
            disableTimeSlider: true,
            id: 'HAUC1',
            sources: [
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/{time}' },
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/IMD_2018_AT_70m_3857.tif' },
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/LULUCF_2018_AT_70m_3857.tif' },
            ],
            dateFormatFunction: (date) => `${date[1]}`,
            labelFormatFunction: (date) => date[0],
            style: {
              variables: {
                varMin: 0,
                varMax: 100,
              },
              color: [
                'case',
                [
                  'all',
                  ['!=', ['band', 4], 0],
                  ['between',
                    ['band', 2],
                    ['var', 'varMin'],
                    ['var', 'varMax'],
                    /* assuming a stretch from 0 to 255 but it seems to not be used
                    ['*', ['var', 'varMin'], 2.55],
                    ['*', ['var', 'varMax'], 2.55],
                    */
                  ],
                ],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 1],
                  ...getColorStops(heatadaptCM, 0, 40, 40, false),
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
              ],
            },
          },
          {
            protocol: 'cog',
            id: 'LULUCF',
            sources: [
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/LULUCF_2018_AT_70m_3857_rendered.tif' },
            ],
            name: 'Land Cover',
            normalize: true,
            visible: false,
            style: {},
          },
          {
            protocol: 'cog',
            id: 'imperviousness',
            sources: [
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/IMD_2018_AT_70m_3857.tif' },
            ],
            name: 'Imperviousness',
            visible: false,
            style: {
              color: [
                'case',
                ['==', ['band', 4], 255],
                [
                  'match',
                  ['band', 1],
                  0,
                  ['color', 0, 0, 0, 1],
                  [
                    'interpolate',
                    ['linear'],
                    ['band', 1],
                    ...getColorStops(heatadaptImperviousness, 1, 254, 32),
                  ],
                ],
                // out of bounds color
                ['color', 0, 0, 0, 0],
              ],
            },
          },
          {
            layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
            protocol: 'geoserverTileLayer',
            style: {
              strokeColor: 'rgba(50,50,50,0.4)',
              color: 'rgba(0,0,0,0)',
              strokeWidth: 0.5,
            },
            id: 'gemeinde_lst',
            name: 'Administrative zone (Gemeinde)',
            selection: {
              mode: 'multiple',
            },
            tooltip: true,
            allowedParameters: ['name'],
          },
        ],
      },
    },
  },
  createREP1Config('REP1', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_200m_Austria_WGS84_COG_clipped_3857_fix.tif'),
  createREP1Config('REP1_1', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_100m_Austria_WGS84_COG_clipped_3857_fix.tif'),
  createREP1Config('REP1_2', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_50m_Austria_WGS84_COG_clipped_3857_fix.tif'),
  createREP2Config('REP2', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Annual_COG_clipped_3857_fixed.tif', 0.5, 5),
  createREP2Config('REP2_1', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Fall_COG_clipped_3857_fixed.tif', 0.5, 4.5),
  createREP2Config('REP2_2', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Spring_COG_clipped_3857_fixed.tif', 1, 5.5),
  createREP2Config('REP2_3', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Summer_COG_clipped_3857_fixed.tif', 1.5, 7.5),
  createREP2Config('REP2_4', 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Winter_COG_clipped_3857_fixed.tif', 0.5, 2.5),
  createMOBI1Config('MOBI1', 'users_count_max', {
    min: 100,
    max: 100000,
  }, 'users'),
  createMOBI1Config('MOBI1_1', 'users_density_max', {
    min: 1,
    max: 100000,
  }, 'user density [users/km²]'),
  createAQ4Config('AQ4', 'congestion_index_max', {
    min: 0,
    max: 100,
  }),
  createAQ4Config('AQ4_1', 'duration_max', {
    min: 0,
    max: 240,
  }),
  createAQ4Config('AQ4_2', 'speed_max', {
    min: 0,
    max: 140,
  }),
  createAQ4Config('AQ4_3', 'distance_max', {
    min: 0,
    max: 300,
  }),
  createAQ4Config('AQ4_4', 'n_trajectories_max', {
    min: 1,
    max: 4000,
  }),
  createAQ4Config('AQ4_5', 'motorized_share_max', {
    min: 0,
    max: 100,
  }),
  createADOConfig('ADO', 'spi-1'),
  createADOConfig('ADO_1', 'spi-12'),
  createADOConfig('ADO_2', 'spei-1'),
  createADOConfig('ADO_3', 'spei-12'),
  createAQ1Config('AQ1', 'n_trajectories', {
    min: 1,
    max: 40000,
  }, 'n_trajectories'),
  createAQ1Config('AQ1_1', 'satellite_values', {
    min: 0,
    max: 500,
  }, 'satellite_values', false),
  createAQ1Config('AQ1_2', 'mean_value', {
    min: 0,
    max: 50,
  }, 'mean_value'),
  createAQ1Config('AQ1_3', 'congestion_index', {
    min: 0,
    max: 50,
  }, 'congestion_index'),
  createAQ1Config('AQ1_4', 'speed', {
    min: 0,
    max: 120,
  }, 'speed [km/h]'),
  createAQ1Config('AQ1_5', 'motorized_count', {
    min: 1,
    max: 20000,
  }, 'motorized_count'),
  createAQ1Config('AQ1_6', 'motorized_share', {
    min: 0,
    max: 100,
  }, 'motorized_share'),
  createSOL1Config('SOL1', 'grimpactscore_filtered'),
  createSOL1Config('SOL1_1', 'lst30mme'),
  createSOL1Config('SOL1_2', 'grexisting'),
  createSOL1Config('SOL1_3', 'grpotential'),
  createSOL1Config('SOL1_4', 'grpotare20'),
  createSOL1Config('SOL1_5', 'co2red_05'),
  createSOL1Config('SOL1_6', 'co2red_20'),
  createSOL1Config('SOL1_7', 'co2red_45'),
  createSOL2Config('SOL2', 'PVEPPMwhHP'),
  createSOL2Config('SOL2_1', 'PVExisting'),
  createSOL2Config('SOL2_2', 'PVEPPMwhRP'),
  createSOL2Config('SOL2_3', 'PVEPPMwhLP'),
  {
    properties: {
      indicatorObject: {
        indicator: 'E12c',
        yAxis: 'Number of trucks detected',
        time: availableDates.E12c,
        display: [{
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A',
          minZoom: 7,
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E12c_truck_detections_motorways/E12c_legend.png',
          areaIndicator: trucksAreaIndicator(true),
          features: trucksFeatures,
          style: {
            color: '#00c3ff',
          },
          drawnAreaLimitExtent: true,
        }, {
          // get layer for this month
          dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
            .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
            .toFormat('yyyy-MM-dd')}`,
          name: 'Monthly Aggregated Truck Traffic 10km',
          layers: 'VIS_TRUCK_DETECTION_MOTORWAYS_NEW',
          extent: [9, 46, 18, 49],
          maxZoom: 14,
          opacity: 0.7,
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'E12d',
        time: availableDates.E12c,
        yAxis: 'Number of trucks detected',
        display: [{
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A',
          minZoom: 7,
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E12c_truck_detections_motorways/E12c_legend.png',
          areaIndicator: trucksAreaIndicator(true),
          features: trucksFeatures,
          style: {
            color: '#00c3ff',
          },
          drawnAreaLimitExtent: true,
        }, {
          // get layer for this month
          dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
            .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
            .toFormat('yyyy-MM-dd')}`,
          name: 'Monthly Aggregated Truck Traffic 10km',
          layers: 'VIS_TRUCK_DETECTION_PRIMARY_NEW',
          minZoom: 7,
          maxZoom: 14,
          opacity: 0.7,
          extent: [9, 46, 18, 49],
        }],
      },
    },
  },
  // {
  //   properties: {
  //     indicatorObject: {
  //       indicator: 'AQ3',
  //       yAxis: 'Surface NO2 concentrations [ppbv]',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {}, // 11.385 47.265, 11.386 47.264
  //           geometry: wkt.read('POLYGON((11.385 47.265, 11.385 47.264, 11.386 47.264, 11.386 47.265, 11.385 47.265))').toJson(),
  //         }],
  //       },
  //     },
  //   },
  // },
  {
    properties: {
      indicatorObject: {
        time: getDailyDates('2020-01-01', '2022-12-18'),
        indicator: 'AQA',
        yAxis: 'Aggregate Risk Index (ARI)',
        display: {
          dataInfo: 'AQA',
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = feature.id_;
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in data) {
                  const value = data[id][currPar.id];
                  const { min, max, colormapUsed } = currPar;
                  const f = clamp((value - min) / (max - min), 0, 1);
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
          },
          id: 'air_quality_new_id',
          name: 'Health Risk Index',
          adminZoneKey: 'id_3',
          parameters: 'ihr,id_3',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        },
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'ihr',
          items: [
            {
              id: 'ihr',
              min: 0,
              max: 10,
              colormapUsed: grywrd,
              markdown: 'AQ_IHR',
            },
          ],
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'AQB',
        time: getDailyDates('2020-01-01', '2022-12-18'),
        yAxis: 'PM10 [µg/m³]',
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'pm10',
          items: [
            {
              id: 'pm10',
              min: 0,
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
          ],
        },
        display: {
          dataInfo: 'AQB',
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = feature.id_;
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in data) {
                  const value = data[id][currPar.id];
                  const { min, max, colormapUsed } = currPar;
                  const f = clamp((value - min) / (max - min), 0, 1);
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
          },
          id: 'air_quality_new_id',
          name: 'Coarse particulate matter (PM10) ',
          adminZoneKey: 'id_3',
          parameters: 'pm10,id_3',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'AQC',
        time: getDailyDates('2020-01-01', '2022-12-18'),
        yAxis: 'PM2.5 [µg/m³]',
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'pm25',
          items: [
            {
              id: 'pm25',
              min: 0,
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          dataInfo: 'AQC',
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              let ind = store.state.indicators.selectedIndicator;
              let data = null;
              if (dataSource === 'frozenMapData') {
                data = store.state.indicators.frozenIndicator.mapData;
                ind = store.state.indicators.frozenIndicator;
              } else if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
                data = store.state.indicators.selectedIndicator[dataSource];
              }
              if (data) {
                const id = feature.id_;
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in data) {
                  const value = data[id][currPar.id];
                  const { min, max, colormapUsed } = currPar;
                  const f = clamp((value - min) / (max - min), 0, 1);
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
          },
          id: 'air_quality_new_id',
          name: 'Fine particulate matter (PM2.5)',
          adminZoneKey: 'id_3',
          parameters: 'pm25,id_3',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'AQ2',
        time: getMinuteIntervals('2021-01-01T01:00:00Z', '2022-12-01T00:30:00Z', 30),
        cogFilters: {
          sourceLayer: 'AQ2',
          filters: {
            var: {
              display: true,
              label: 'Flux [nmol/m2/s]',
              id: 'var',
              min: 0,
              max: 200,
              header: true,
              range: [2, 100],
            },
            spacing: {
              display: true,
              label: 'Contour step size [nmol/m2/s]',
              type: 'slider',
              id: 'varSpacing',
              min: 1,
              max: 51,
              value: 2,
            },
            offset: {
              display: true,
              label: 'Contour offset [nmol/m2/s]',
              type: 'slider',
              id: 'varOffset',
              min: 0,
              max: 6,
              value: 0,
            },
          },
        },
        display: {
          dataInfo: 'AQ2',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((11.372 47.268, 11.372 47.258, 11.394 47.258, 11.394 47.268, 11.372 47.268 ))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'AQ2',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/flux_data/{time}_gtif_uibk_ffp_values.tif' },
          ],
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss'Z'"),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd HH:mm:ss'),
          style: {
            variables: {
              varMin: 2,
              varMax: 100,
              varOffset: 0.0,
              varSpacing: 2,
            },
            color: [
              'case',
              ['between', bandModifier(0, 0, 1e6), ['var', 'varMin'], ['var', 'varMax']],
              [
                'palette',
                [
                  '*',
                  [
                    '*',
                    [
                      'clamp',
                      [
                        '+',
                        diff(
                          contspace(bandModifier(0, 0, 1e6), 'varOffset', 'varSpacing'),
                          contspace(bandModifier(1.5, 0, 1e6), 'varOffset', 'varSpacing'),
                        ),
                        diff(
                          contspace(bandModifier(0, 0, 1e6), 'varOffset', 'varSpacing'),
                          contspace(bandModifier(0, 1.5, 1e6), 'varOffset', 'varSpacing'),
                        ),
                      ],
                      0,
                      1,
                    ],
                    normalize(bandModifier(0, 0, 1e6), 'varMin', 'varMax'),
                  ],
                  getColormap('hot', true).length + 1,
                ],
                // add a transparent color in the 0 index so that all 0s map to it
                [[0, 0, 0, 0], ...getColormap('hot', true)],
              ],
              // out of bounds color
              ['color', 0, 0, 0, 0],
            ],
          },
          name: 'Flux tower',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'AQ5',
        time: getDailyDates('2021-12-31', '2023-12-29'),
        cogFilters: {
          sourceLayer: 'AQ5',
          filters: {
            var: {
              display: true,
              label: 'Nitrogen Dioxide Tropospheric column content [µmol/m2]',
              id: 'var',
              min: 0,
              max: 300,
              header: true,
              range: [0, 100],
            },
          },
        },
        display: {
          dataInfo: 'AQ5',
          protocol: 'cog',
          id: 'AQ5',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/SISTEMA/14_days_average/averaged_NO2_{time}.tif' },
          ],
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
          labelFormatFunction: (date) => `${date} (14 day average)`,
          style: {
            variables: {
              varMin: 0,
              varMax: 100,
            },
            color: [
              'case',
              ['between', ['band', 1], 1e-6, 10],
              [
                'interpolate',
                ['linear'],
                normalize(bandModifier(0, 0, 1e6), 'varMin', 'varMax'),
                ...getColorStops(whitered, 0, 1, 32, false),
              ],
              ['color', 0, 0, 0, 0],
            ],
          },
          name: 'Averaged NO2',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'BM2',
        cogFilters: {
          sourceLayer: 'BM2',
          filters: {
            biomass: {
              display: true,
              label: 'Biomass [t/ha]',
              id: 'biomass',
              min: 0,
              max: 420,
              header: true,
              range: [0, 420],
            },
          },
        },
        display: {
          dataInfo: 'BM2',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'BM2',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/FCM_AGB-2021_Austria_20m_EPSG3857-COG.tif' },
          ],
          style: {
            variables: {
              biomassMin: 0,
              biomassMax: 420,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 1], ['var', 'biomassMin'], ['var', 'biomassMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('viridis', 0, 420, 64, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'FCM2',
        featureFilters: {
          sourceLayer: 'sawmill_features',
          hint: ' Select sawmill capabilities',
          baseStyle: {
            'circle-radius': 5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ee903d',
            'circle-fill-color': '#00324755',
          },
          filters: [
            { id: 'al', description: 'other glued wood products (dou or trilam)', category: 'Glued wood products' },
            { id: 'bsh', description: 'laminated wood', category: 'Glued wood products' },
            { id: 'bu', description: 'production of beech', category: 'Hardwood' },
            { id: 'ei', description: 'production of oak ', category: 'Hardwood' },
            { id: 's', description: 'other', category: 'Hardwood' },
            { id: 'b', description: 'log band saw', category: 'Machinery ' },
            { id: 'g', description: 'frame saw ', category: 'Machinery ' },
            { id: 'i', description: 'impregnation ', category: 'Machinery ' },
            { id: 'l', description: 'laminating line', category: 'Machinery ' },
            { id: 'k', description: 'finger jointing', category: 'Machinery ' },
            { id: 'n', description: 'double cutting circular saw', category: 'Machinery ' },
            { id: 'p', description: 'profiler', category: 'Machinery ' },
            { id: 't', description: 'drying chamber', category: 'Machinery ' },
            { id: 'tb', description: 'band re-saw', category: 'Machinery ' },
            { id: 'hw', description: 'produces planed goods', category: 'Planed goods' },
            { id: 'veh', description: 'ordinary member of the Association of the European Planing Mill Industry', category: 'Planed goods' },
            { id: 'fi_ta', description: 'production of spruce/fir', category: 'Softwood' },
            { id: 'la', description: 'production of larch', category: 'Softwood' },
            { id: 'ki', description: 'production of pine', category: 'Softwood' },
            { id: 'mh', description: 'CE certified sawmills which manufacture high-quality construction solid timber without gluing and finger joint ', category: 'Solid wood' },
            { id: 'ls', description: 'this sawmill also takes subcontracting orders ', category: 'Subcontracting' },
          ],
        },
        display: [
          {
            id: 'truck_roads',
            legendUrl: '',
            baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
            layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_beetle4tech_roads_austria_3857',
            attribution: '{}',
            // sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/green_rooftops_v3.sld',
            protocol: 'WMS',
            exceptions: 'application/vnd.ogc.se_inimage',
            name: 'Truck appropiate roads',
          },
          {
            protocol: 'GeoJSON',
            projection: 'EPSG:4326',
            url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/Carbon_accounting/biomass_powerplants.geojson',
            name: 'Biomass power plants',
            legendUrl: '',
            flatStyle: [
              {
                style: {
                  'circle-radius': 5,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#c396fe',
                  'circle-fill-color': '#c396fe55',
                },
              },
            ],
            id: 'biomass_power_plants',
            tooltip: true,
            allowedParameters: ['0'],
            visible: true,
            selection: {
              mode: 'single',
            },
          },
          {
            id: 'sawmill_features',
            legendUrl: '',
            flatStyle: [
              {
                /*
                filter: [
                  'all',
                  ['==', ['get', 'al'], 1],
                  ['==', ['get', 'b'], 1],
                ],
                */
                style: {
                  'circle-radius': 5,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#ee903d',
                  'circle-fill-color': '#ee903d55',
                },
              },
            ],
            layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_sawmills_v1',
            protocol: 'geoserverTileLayer',
            name: 'Sawmills',
            visible: true,
            selection: {
              mode: 'single',
            },
            tooltip: true,
            allowedParameters: ['name'],
          },
          {
            dataInfo: 'FCM2',
            protocol: 'cog',
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/FCM2_Forest_disturbance_type/FCM_dist_type.png',
            id: 'FCM2',
            sources: [
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/A_FCMT_AnualForestChangeType_epsg3857.tif' },
            ],
            style: {
              color: [
                'case',
                ['==', ['band', 1], 1],
                ['color', 255, 255, 0],
                ['==', ['band', 1], 2],
                ['color', 255, 85, 255],
                ['==', ['band', 1], 3],
                ['color', 255, 0, 0],
                ['==', ['band', 1], 4],
                ['color', 173, 173, 173],
                ['==', ['band', 1], 5],
                ['color', 0, 85, 255],
                ['==', ['band', 1], 6],
                ['color', 0, 85, 255],
                ['==', ['band', 1], 7],
                ['color', 67, 67, 67],
                [
                  'case',
                  ['==', ['band', 2], 1],
                  ['color', 147, 220, 0],
                  ['==', ['band', 2], 2],
                  ['color', 0, 107, 0],
                  ['color', 0, 0, 0, 0],
                ],
              ],
            },
            name: 'Forest disturbance type',
          },
        ],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'FCM3',
        featureFilters: {
          sourceLayer: 'sawmill_features',
          hint: ' Select sawmill capabilities',
          baseStyle: {
            'circle-radius': 5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ee903d',
            'circle-fill-color': '#00324755',
          },
          filters: [
            { id: 'al', description: 'other glued wood products (dou or trilam)', category: 'Glued wood products' },
            { id: 'bsh', description: 'laminated wood', category: 'Glued wood products' },
            { id: 'bu', description: 'production of beech', category: 'Hardwood' },
            { id: 'ei', description: 'production of oak ', category: 'Hardwood' },
            { id: 's', description: 'other', category: 'Hardwood' },
            { id: 'b', description: 'log band saw', category: 'Machinery ' },
            { id: 'g', description: 'frame saw ', category: 'Machinery ' },
            { id: 'i', description: 'impregnation ', category: 'Machinery ' },
            { id: 'l', description: 'laminating line', category: 'Machinery ' },
            { id: 'k', description: 'finger jointing', category: 'Machinery ' },
            { id: 'n', description: 'double cutting circular saw', category: 'Machinery ' },
            { id: 'p', description: 'profiler', category: 'Machinery ' },
            { id: 't', description: 'drying chamber', category: 'Machinery ' },
            { id: 'tb', description: 'band re-saw', category: 'Machinery ' },
            { id: 'hw', description: 'produces planed goods', category: 'Planed goods' },
            { id: 'veh', description: 'ordinary member of the Association of the European Planing Mill Industry', category: 'Planed goods' },
            { id: 'fi_ta', description: 'production of spruce/fir', category: 'Softwood' },
            { id: 'la', description: 'production of larch', category: 'Softwood' },
            { id: 'ki', description: 'production of pine', category: 'Softwood' },
            { id: 'mh', description: 'CE certified sawmills which manufacture high-quality construction solid timber without gluing and finger joint ', category: 'Solid wood' },
            { id: 'ls', description: 'this sawmill also takes subcontracting orders ', category: 'Subcontracting' },
          ],
        },
        display: [
          {
            protocol: 'cog',
            id: 'FCM3',
            sources: [
              { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/A_FM_AustriaForestMask-2022-09-01_epsg3857-v2.tif' },
            ],
            style: {
              color: [
                'case',
                ['==', ['band', 1], 1],
                ['color', 147, 220, 0],
                ['==', ['band', 1], 2],
                ['color', 0, 107, 0],
                ['color', 0, 0, 0, 0],
              ],
            },
          },
          {
            id: 'sawmill_features',
            legendUrl: '',
            flatStyle: [
              {
                /*
                filter: [
                  'all',
                  ['==', ['get', 'al'], 1],
                  ['==', ['get', 'b'], 1],
                ],
                */
                style: {
                  'circle-radius': 5,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#ee903d',
                  'circle-fill-color': '#ee903d55',
                },
              },
            ],
            layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_sawmills_v1',
            protocol: 'geoserverTileLayer',
            name: 'Sawmills',
            visible: true,
            selection: {
              mode: 'single',
            },
            tooltip: true,
            allowedParameters: ['name'],
          },
        ],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'VTT',
        cogFilters: {
          sourceLayer: 'VTT',
          filters: {
            selectedBand: {
              display: true,
              header: true,
              label: 'Displayed dataset colormap',
              id: 'selectedBand',
              type: 'select',
              entries: [
                { text: 'Basal area', value: 1, range: [0, 65] },
                { text: 'Broadleaf proportion', value: 2, range: [0, 100] },
                { text: 'Tree diameter', value: 3, range: [0, 50] },
                { text: 'Conifer proportion', value: 4, range: [0, 100] },
                { text: 'Tree height', value: 5, range: [0, 350] },
                { text: 'Growing stock volume', value: 6, range: [0, 800] },
              ],
              value: 1,
            },
            visualization: {
              display: true,
              label: 'Dataset colormap value range',
              id: 'visualization',
              min: 0,
              max: 65,
              range: [0, 65],
            },
            basalarea: {
              display: true,
              label: 'Filter Basal area',
              id: 'basalarea',
              dataInfo: 'basal',
              min: 0,
              max: 80,
              range: [0, 80],
            },
            broadleaf: {
              display: true,
              label: 'Filter broadleaf proportion [%]',
              id: 'broadleaf',
              // dataInfo: 'broadleaf',
              min: 0,
              max: 100,
              range: [0, 100],
            },
            conifer: {
              display: true,
              label: 'Filter conifer proportion [%]',
              id: 'conifer',
              // dataInfo: 'conifer',
              min: 0,
              max: 100,
              range: [0, 100],
            },
            diameter: {
              display: true,
              label: 'Filter tree diameter',
              id: 'diameter',
              dataInfo: 'diameter',
              min: 0,
              max: 70,
              range: [0, 70],
            },
            height: {
              display: true,
              label: 'Filter tree height [dm]',
              id: 'height',
              // dataInfo: 'height',
              min: 0,
              max: 500,
              range: [0, 500],
            },
            volume: {
              display: true,
              label: 'Filter growing stock volume [m3/ha]',
              id: 'volume',
              dataInfo: 'stockvolume',
              min: 0,
              max: 1000,
              range: [0, 1000],
            },
          },
          protocol: 'cog',
          id: 'VTT1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
        },
        display: {
          protocol: 'cog',
          id: 'VTT',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_basal_area_DA_2021_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_broadleaf_DA_2021_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_diameter_DA_2021_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_conifer_2015_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_height_DA_2021_16bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_volume_DA_2021_16bit-EPSG3857-COG.tif' },
          ],
          style: {
            variables: {
              selectedBand: 1,
              visualizationMin: 0,
              visualizationMax: 65,
              basalareaMin: 0,
              basalareaMax: 100,
              broadleafMin: 0,
              broadleafMax: 100,
              diameterMin: 0,
              diameterMax: 70,
              coniferMin: 0,
              coniferMax: 100,
              heightMin: 0,
              heightMax: 500,
              volumeMin: 0,
              volumeMax: 1000,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 1], ['var', 'basalareaMin'], ['var', 'basalareaMax']],
                ['between', ['band', 2], ['var', 'broadleafMin'], ['var', 'broadleafMax']],
                ['between', ['band', 3], ['var', 'diameterMin'], ['var', 'diameterMax']],
                ['between', ['band', 4], ['var', 'coniferMin'], ['var', 'coniferMax']],
                ['between', ['band', 5], ['var', 'heightMin'], ['var', 'heightMax']],
                ['between', ['band', 6], ['var', 'volumeMin'], ['var', 'volumeMax']],
              ],
              [
                'interpolate',
                ['linear'],
                normalize(['band', ['var', 'selectedBand']], 'visualizationMin', 'visualizationMax'),
                ...getColorStops('viridis', 0, 1, 9, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'FCM1',
        time: [
          ['2021-09-01', 'NRT_FCM_Changes-2021-09_epsg3857.tif'],
          ['2021-10-01', 'NRT_FCM_Changes-2021-10_epsg3857.tif'],
          ['2021-11-01', 'NRT_FCM_Changes-2021-11_epsg3857.tif'],
          ['2022-03-01', 'NRT_FCM_Changes-2022-03_epsg3857.tif'],
          ['2022-04-01', 'NRT_FCM_Changes-2022-04_epsg3857.tif'],
          ['2022-05-01', 'NRT_FCM_Changes-2022-05_epsg3857.tif'],
          ['2022-06-01', 'NRT_FCM_Changes-2022-06_epsg3857.tif'],
          ['2022-07-01', 'NRT_FCM_Changes-2022-07_epsg3857.tif'],
          ['2022-08-01', 'NRT_FCM_Changes-2022-08_epsg3857.tif'],
        ],
        display: [{
          protocol: 'cog',
          id: 'FCM1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              ['color', 255, 0, 0, 1],
              ['color', 0, 0, 0, 0],
            ],
          },
        },
        {
          protocol: 'GeoJSON',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/AT_biomass_loss.geojson',
          name: 'Biomass loss',
          style: {
            strokeColor: 'rgba(0,0,0,0.9)',
            fillColor: 'rgba(0,0,0,0.0001)',
          },
          minZoom: 1,
          tooltip: {
            tooltipFormatFunction: (feature) => [
              `Region: ${feature.get('NUTS_NAME')}`,
              `Biomass loss: ${Number(feature.get('BMLoss_sum')).toFixed(2)}`,
            ],
          },
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'REP6',
        display: [{
          dateFormatFunction: (date) => `${DateTime.fromFormat(date, 'yyyyMMdd').toFormat('yyyy-MM-dd')}/${DateTime.fromFormat(date, 'yyyyMMdd').plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Sentinel 2 L2A',
          minZoom: 13,
          timeFromProperty: true,
        }, {
          minZoom: 13,
          dataInfo: 'REP6',
          protocol: 'GeoJSON',
          tooltip: true,
          getTimeFromProperty: 'detection_time',
          visible: true,
          name: 'Wind turbine detections',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/wind_turbines/wind-turbines-austria-version1.geojson',
          style: {
            strokeColor: '#ff0000',
            width: 5,
          },
          selection: {
            mode: 'single',
          },
        }, {
          maxZoom: 13,
          protocol: 'GeoJSON',
          clusterLayer: true,
          visible: true,
          name: 'Wind turbine detections clusters',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/wind_turbines/wind-turbines-austria-version1.geojson',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'REP5',
        display: [{
          dataInfo: 'REP5',
          minZoom: 5,
          protocol: 'GeoJSON',
          tooltip: {
            tooltipFormatFunction: (feature) => [
              `ws_code: ${feature.get('ws_code')}`,
              `Area: ${Number((feature.get('area_sqm')) / 10e6).toFixed(2)} km²`,
              `Flow Rate: ${Number(feature.get('flowrate')).toFixed(1)} m³/s`,
              'Gravity: 9.82 m/s²',
              'Density: 1000 kg/m³',
              `Power rating: ${Number(feature.get('pr_mw')).toFixed(2)} MW`,
              `Annual power: ${Number(feature.get('annp')).toFixed(0)} kWh`,
              `Annual power potential: ${Number(feature.get('gwh_pot')).toFixed(2)} gWh`,
              'Capacity: 50 %',
              `Annual power actual: ${(Number(feature.get('pr_mw')) / 2).toFixed(2)} MW`,
            ],
          },
          visible: true,
          url: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_hydro_power_potential&outputFormat=application/json',
          styleFunction: (feature) => {
            let radius = 0;
            const powerGenerationValue = feature.get('gwh_pot');
            if (powerGenerationValue > 0 && powerGenerationValue < 1) {
              radius = 5;
            } else if (powerGenerationValue >= 1 && powerGenerationValue <= 10) {
              radius = 8;
            } else if (powerGenerationValue > 10 && powerGenerationValue <= 50) {
              radius = 12;
            } else if (powerGenerationValue > 50 && powerGenerationValue <= 750) {
              radius = 16;
            } else {
              radius = 20;
            }
            const fill = new Fill({
              color: 'rgba(255, 255, 255, 0.3)',
            });
            const stroke = new Stroke({
              width: 3,
              color: '#003247',
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
          selection: {
            mode: 'single',
          },
        }, {
          minZoom: 5,
          protocol: 'GeoJSON',
          visible: true,
          name: 'Micro Hydropower Watersheds',
          urlTemplateSelectedFeature: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_hydro_watersheds&outputFormat=application/json&cql_filter=hydropowerpotential_ws_code={ws_code}',
          style: {
            strokeColor: '#003247',
            width: 2,
            fillColor: 'rgba(179, 240, 252, 0.5)',
          },
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'LST',
        display: [{
          protocol: 'xyz',
          tileSize: 256,
          opacity: 1,
          url: 'https://tileserver.geoville.com/heatMap/LST_aggregated_reproc_filt_clipped_AT_buffered/%7Bz%7D/%7Bx%7D/%7By%7D.png/LST_aggregated_reproc_filt_clipped_AT_buffered/{z}/{x}/{y}.png',
        }, {
          name: 'Communities',
          id: 'heatmap_vector',
          styleFile: 'data/gtif/data/heatmap_vector.json',
          attribution: '{}',
          visible: true,
          protocol: 'vectortile',
          tooltip: {
            // trigger: 'singleclick',
            tooltipFormatFunction: (feature) => [
              `${feature.get('gemeinde')}`,
              `Mean temperature: ${Number(feature.get('mean_temp')).toFixed(2)}°C`,
              `Maximum temperature: ${Number(feature.get('max_temp')).toFixed(2)}°C`,
              `Minimum temperature: ${Number(feature.get('min_temp')).toFixed(2)}°C`,
              `Population exposed to surface temperature >35°C: ${Number(feature.get('percentage')).toFixed(2)}%`,
            ],
          },
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'EO4A',
        display: {
          selectedTime: '2022-01-30',
          baseUrl: 'https://snow-app-gte2s.hub.eox.at/?',
          layers: 'SNOW-DEPTH',
          attribution: '{Snow depth: https://snow-app-gte2s.hub.eox.at/ }',
          protocol: 'WMS',
          dateFormatFunction: (date) => (
            `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}`
          ),
          projection: 'EPSG:4326',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'EO4A2',
        display: {
          selectedTime: '2022-01-30',
          baseUrl: 'https://snow-app-gte2s.hub.eox.at/?',
          layers: 'SWE',
          attribution: '{Snow water equivalent: https://snow-app-gte2s.hub.eox.at/ }',
          protocol: 'WMS',
          dateFormatFunction: (date) => (
            `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}`
          ),
          projection: 'EPSG:4326',
        },
      },
    },
  },
  ...createIDEASDatasetConfigs(['IND1_1']),
];
