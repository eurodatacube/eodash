import { Wkt } from 'wicket';
import { shTimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { DateTime } from 'luxon';
import colormap from 'colormap';
import availableDates from '@/config/gtif_dates.json';

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

// We statically define some colormaps to not instanciate them for every call
/*
const blackbody64 = {
  steps: 128,
  colors: colormap({
    colormap: 'blackbody',
    nshades: 128,
  }),
};
*/

const stp = 1 / 7;
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

const drrglb = {
  steps: 32,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [209, 55, 78] },
      { index: 0.2, rgb: [254, 173, 84] },
      { index: 0.4, rgb: [254, 237, 177] },
      { index: 0.6, rgb: [216, 254, 181] },
      { index: 0.8, rgb: [73, 227, 206] },
      { index: 1, rgb: [1, 152, 189] },
    ],
    nshades: 32,
  }),
};

/*
const ihrCS = {
  steps: 10,
  colors: [
    '#4a834a',
    '#4ac14a',
    '#8ae049',
    '#ccec49',
    '#fae94c',
    '#febf4c',
    '#fe934c',
    '#f23a00',
    '#c40025',
    '#a2001f',
    '#600030',
  ],
};
*/

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

export const dataPath = './data/gtif/data/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/gtif/pois_gtif.json',
  },
];

export const layerNameMapping = Object.freeze({});

export const indicatorClassesIcons = Object.freeze({
  agriculture: 'mdi-barley',
  water: 'mdi-water',
  land: 'mdi-image-filter-hdr',
  health: 'mdi-hospital-box-outline',
  combined: 'mdi-set-center',
  air: 'mdi-weather-windy',
  economic: 'mdi-currency-eur',
});

export const mapDefaults = Object.freeze({
  bounds: [9, 46, 18, 49.5],
});

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
},
baseLayers.cloudless,
baseLayers.osm_3857,
baseLayers.S2GLC,
baseLayers.ESA_WORLD_COVER,
baseLayers.CORINE_LAND_COVER,
baseLayers.geolandbasemap,
baseLayers.bmapgelaende,
baseLayers.bmaporthofoto30cm,
];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless];

export const overlayLayersLeftMap = [
  {
    ...overlayLayers.eoxOverlay, visible: true,
  },
  overlayLayers.powerOpenInfrastructure,
];
export const overlayLayersRightMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];

const nutsStyle = {
  attribution: 'Administrative boundaries: © EuroGeographics, © TurkStat. Source: European Commission – Eurostat/GISCO',
  visible: true,
  protocol: 'GeoJSON',
  style: {
    fillColor: 'rgba(0, 0, 0, 0)',
    color: '#006762',
  },
};

export const administrativeLayers = [{
  ...nutsStyle,
  name: 'NUTS L0',
  id: 'nuts_0',
  url: 'data/gtif/data/AT_NUTS_L0.geojson',
  minZoom: 4,
  maxZoom: 7.5,
}, {
  ...nutsStyle,
  name: 'NUTS L1',
  id: 'nuts_1',
  url: 'data/gtif/data/AT_NUTS_L1.geojson',
  minZoom: 7.5,
  maxZoom: 8.5,
}, {
  ...nutsStyle,
  name: 'NUTS L2',
  id: 'nuts_2',
  url: 'data/gtif/data/AT_NUTS_L2.geojson',
  minZoom: 8.5,
  maxZoom: 9.5,
}, {
  ...nutsStyle,
  name: 'NUTS L3',
  id: 'nuts_3',
  url: 'data/gtif/data/AT_NUTS_L3.geojson',
  minZoom: 9.5,
  maxZoom: 10.5,
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'District (Bezirk)',
  id: 'bezirk',
  url: '//eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_POLBEZ_20220101.fgb',
  minZoom: 10.5,
  maxZoom: 12,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'Municipality (Gemeinde)',
  id: 'gemeinde',
  url: '//eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb',
  minZoom: 12,
  maxZoom: 13.5,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  id: 'zahlsprengel',
  name: 'Census Track (Zählsprengel)',
  url: '//eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_ZSP_20220101.fgb',
  minZoom: 13.5,
  maxZoom: 18,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}];

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
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

const energyTransitionDefaults = {
  baseLayers: [
    ...baseLayersLeftMap,
    baseLayers.bodenwertigkeitskarte_agri,
    baseLayers.bodenwertigkeitskarte_grassland,
  ],
  overlayLayers: [
    { ...overlayLayers.powerOpenInfrastructure, visible: true },
    { ...overlayLayers.eoxOverlay, visible: true },
  ],
};

export const indicatorsDefinition = Object.freeze({
  BM1: {
    indicator: 'Forest Change',
    class: 'air',
    themes: ['carbon-accounting'],
    story: '/data/gtif/markdown/BM1',
  },
  BM2: {
    indicator: 'Above Ground Biomass',
    class: 'air',
    themes: ['carbon-accounting'],
    story: '/data/gtif/markdown/BM2',
  },
  REP1: {
    ...energyTransitionDefaults,
    indicator: 'Wind Energy',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP1',
  },
  REP2: {
    ...energyTransitionDefaults,
    indicator: 'Solar Energy',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP2',
  },
  REP3: {
    ...energyTransitionDefaults,
    indicator: 'Nowcasting',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP3',
  },
  REP4: {
    indicator: 'Hydro Power',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP4',
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm,
      visible: true,
    }],
    overlayLayers: [],
    disableCSV: true,
    geoDBDataQuery: 'sobothstausee_surface_water_extent?',
    geoDBParameters: 'date,area_diff_rel,area,diff_area',
  },
  REP5: {
    ...energyTransitionDefaults,
    indicator: 'Micro Hydropower',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP3',
  },
  MOBI1: {
    indicator: 'mobility',
    class: 'mobi1',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/MOBI',
    customAreaIndicator: true,
    adminLayersCustomIndicator: {
      adminZoneIds: ['gemeinde'],
    },
  },
  SOL1: {
    indicator: 'sus cities',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
    customAreaIndicator: true,
    adminLayersCustomIndicator: {
      adminZoneIds: ['zahlsprengel'],
    },
  },
  SOL2: {
    indicator: 'sus cities',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
    customAreaIndicator: true,
    adminLayersCustomIndicator: {
      adminZoneIds: ['zahlsprengel'],
    },
  },
  SOL3: {
    indicator: 'urban trees',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
  },
  SOL4: {
    indicator: 'green roof',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
  },
  SOL5: {
    indicator: 'solar',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
  },
  SOL6: {
    indicator: 'green',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
  },
  SOL7: {
    indicator: 'solar',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.terrainLight],
  },
  SOL8: {
    indicator: 'green',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.terrainLight],
  },
  SOL9: {
    indicator: 'solar',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.terrainLight],
  },
  SOL10: {
    indicator: 'solar',
    clas: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.terrainLight],
  },
  LST: {
    indicator: 'Heat Explorer',
    class: 'air',
    story: '/data/gtif/markdown/LST',
    themes: ['eo-adaptation-services'],
  },
  FCM1: {
    indicator: 'Forest change detections',
    class: 'air',
    story: '/data/gtif/markdown/FCM',
    themes: ['eo-adaptation-services'],
  },
  FCM2: {
    indicator: 'Forest disturbance type',
    class: 'air',
    story: '/data/gtif/markdown/FCM2',
    themes: ['eo-adaptation-services'],
  },
  FCM3: {
    indicator: 'Annual forest mask',
    class: 'air',
    story: '/data/gtif/markdown/FCM3',
    themes: ['carbon-accounting'],
  },
  VTT1: {
    indicator: 'Basal area',
    class: 'air',
    story: '/data/gtif/markdown/VTT1',
    themes: ['carbon-accounting'],
  },
  VTT2: {
    indicator: 'Broadleaf proportion',
    class: 'air',
    story: '/data/gtif/markdown/VTT2',
    themes: ['carbon-accounting'],
  },
  VTT3: {
    indicator: 'Coniferous proportion',
    class: 'air',
    story: '/data/gtif/markdown/VTT3',
    themes: ['carbon-accounting'],
  },
  VTT4: {
    indicator: 'Tree Diameter',
    class: 'air',
    story: '/data/gtif/markdown/VTT4',
    themes: ['carbon-accounting'],
  },
  VTT5: {
    indicator: 'Tree Height',
    class: 'air',
    story: '/data/gtif/markdown/VTT5',
    themes: ['carbon-accounting'],
  },
  VTT6: {
    indicator: 'Tree Volume',
    class: 'air',
    story: '/data/gtif/markdown/VTT6',
    themes: ['carbon-accounting'],
  },
  AQA: {
    indicator: 'Health Risk Index (ARI)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
    customAreaIndicator: true,
    adminLayersCustomIndicator: {
      adminZoneIds: ['gemeinde'],
    },
  },
  AQB: {
    indicator: 'Fine particulate matter (PM2.5)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
    customAreaIndicator: true,
    adminLayersCustomIndicator: {
      adminZoneIds: ['gemeinde'],
    },
  },
  AQC: {
    indicator: 'Coarse particulate matter (PM10)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
    customAreaIndicator: true,
    adminLayersCustomIndicator: {
      adminZoneIds: ['gemeinde'],
    },
  },
  AQ2: {
    indicator: 'Innsbruck hot-spot',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AT_AQ2',
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm,
      visible: true,
    }, baseLayers.geolandbasemap],
    overlayLayers: [],
  },
  AQ3: {
    indicator: 'Innsbruck hot-spot',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/eodash-data/stories/AQF',
    // TODO: This is a quick fix, we should consider impleemnting nice loading of data from geodb
    geoDBDataQuery: 'no2_data?date=gt.2022-09-01',
    geoDBParameters: 'date,no2_ec_station_ppbv',
    disableCSV: true,
    overlayLayers: [],
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm,
      visible: true,
    }],
  },
  AQ4: {
    indicator: 'Human Mobility Patterns',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ4',
  },
  AQ5: {
    indicator: 'Nitrogen Dioxide (NO2)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ5',
  },
  WSF: {
    indicator: 'World Settlement Footprint',
    class: 'economic',
    story: '/eodash-data/stories/WSF-WSF',
    themes: ['atmosphere'],
  },
  N1: {
    indicator: 'Air quality',
    class: 'air',
    story: '/eodash-data/stories/N1',
    externalData: {
      label: 'Sentinel-5p Mapping Service',
      url: 'https://maps.s5p-pal.com',
    },
    largeTimeDuration: true,
    themes: ['atmosphere'],
  },
  N9: {
    indicator: 'Air quality',
    class: 'air',
    hideInFilters: true,
    story: '/eodash-data/stories/N9',
    themes: ['atmosphere'],
  },
  N10: {
    indicator: 'Air quality',
    class: 'air',
    hideInFilters: true,
    story: '/eodash-data/stories/N10',
    themes: ['atmosphere'],
  },
  GG: {
    indicator: 'Mobility',
    class: 'economic',
    disableTimeSelection: true,
    story: '/eodash-data/stories/GG-GG',
    themes: ['economy', 'atmosphere'],
    disableCSV: true,
    alternateDataPath: './eodash-data/internal/',
  },
});

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: false,
        id: 9987,
        aoi: null,
        aoiID: 'AT1',
        country: 'indicatorall',
        city: 'AT',
        siteName: 'global',
        description: 'Innsbruck hot-spot',
        indicator: 'AQ3',
        yAxis: 'Surface NO2 concentrations [ppbv]',
        lastIndicatorValue: null,
        indicatorName: 'Innsbruck hot-spot',
        navigationDescription: 'Surface NO2 concentrations measured at Innsbruck Atmospheric Observatory (IAO)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {}, // 11.385 47.265, 11.386 47.264
            geometry: wkt.read('POLYGON((11.385 47.265, 11.385 47.264, 11.386 47.264, 11.386 47.265, 11.385 47.265))').toJson(),
          }],
        },
        time: [],
        inputData: [''],
        // display: {
        // },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Health Risk Index (ARI)',
        indicator: 'AQA',
        lastIndicatorValue: null,
        indicatorName: 'Health Risk Index (ARI)',
        navigationDescription: 'Daily aggregated maps of ARI index',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: availableDates.air_quality.sort((a, b) => {
          const val = DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
          return val;
        }),
        inputData: [''],
        yAxis: 'ARI',
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'ihr',
          items: [
            {
              id: 'ihr',
              description: 'Aggregate Risk Index',
              dataInfo: 'ARI',
              min: 0,
              max: 10,
              colormapUsed: grywrd,
              markdown: 'AQ_IHR',
            },
            {
              id: 'pm10',
              description: 'Particulate Matter < 10µm',
              dataInfo: 'PM10',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              dataInfo: 'PM25',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#00000000';
            const dataSource = options.dataProp ? options.dataProp : 'mapData';
            if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
              const id = feature.id_;
              const ind = store.state.indicators.selectedIndicator;
              const currPar = ind.queryParameters.items
                .find((item) => item.id === ind.queryParameters.selected);
              if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                const value = ind[dataSource][id][currPar.id];
                const { min, max, colormapUsed } = currPar;
                const f = clamp((value - min) / (max - min), 0, 1);
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
              }
            }
            return color;
          },
          id: 'air_quality_new_id',
          name: 'Health Risk Index (ARI)',
          adminZoneKey: 'id_3',
          parameters: 'pm10,pm25,ihr,id_3',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Coarse particulate matter (PM10)',
        indicator: 'AQB',
        lastIndicatorValue: null,
        indicatorName: 'Coarse particulate matter (PM10)',
        navigationDescription: 'Daily aggregated maps of PM10 concentration',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: availableDates.air_quality.sort((a, b) => {
          const val = DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
          return val;
        }),
        inputData: [''],
        yAxis: 'PM10 [µg/m³]',
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'pm10',
          items: [
            {
              id: 'ihr',
              description: 'Aggregate Risk Index',
              dataInfo: 'ARI',
              min: 0,
              max: 10,
              colormapUsed: grywrd,
              markdown: 'AQ_IHR',
            },
            {
              id: 'pm10',
              description: 'Particulate Matter < 10µm',
              dataInfo: 'PM10',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              dataInfo: 'PM25',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#00000000';
            const dataSource = options.dataProp ? options.dataProp : 'mapData';
            if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
              const id = feature.id_;
              const ind = store.state.indicators.selectedIndicator;
              const currPar = ind.queryParameters.items
                .find((item) => item.id === ind.queryParameters.selected);
              if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                const value = ind[dataSource][id][currPar.id];
                const { min, max, colormapUsed } = currPar;
                const f = clamp((value - min) / (max - min), 0, 1);
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
              }
            }
            return color;
          },
          id: 'air_quality_new_id',
          name: 'PM10',
          adminZoneKey: 'id_3',
          parameters: 'pm10,pm25,ihr,id_3',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Fine particulate matter (PM2.5)',
        indicator: 'AQC',
        lastIndicatorValue: null,
        indicatorName: 'Fine particulate matter (PM2.5)',
        navigationDescription: 'Daily aggregated maps of PM2.5 concentration',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: availableDates.air_quality.sort((a, b) => {
          const val = DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
          return val;
        }),
        inputData: [''],
        yAxis: 'PM2.5 [µg/m³]',
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'pm25',
          items: [
            {
              id: 'ihr',
              description: 'Aggregate Risk Index',
              dataInfo: 'ARI',
              min: 0,
              max: 10,
              colormapUsed: grywrd,
              markdown: 'AQ_IHR',
            },
            {
              id: 'pm10',
              description: 'Particulate Matter < 10µm',
              dataInfo: 'PM10',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              dataInfo: 'PM25',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#00000000';
            const dataSource = options.dataProp ? options.dataProp : 'mapData';
            if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
              const id = feature.id_;
              const ind = store.state.indicators.selectedIndicator;
              const currPar = ind.queryParameters.items
                .find((item) => item.id === ind.queryParameters.selected);
              if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                const value = ind[dataSource][id][currPar.id];
                const { min, max, colormapUsed } = currPar;
                const f = clamp((value - min) / (max - min), 0, 1);
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
              }
            }
            return color;
          },
          id: 'air_quality_new_id',
          name: 'Fine particulate matter (PM2.5)',
          adminZoneKey: 'id_3',
          parameters: 'pm10,pm25,ihr,id_3',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Innsbruck',
        siteName: 'global',
        description: 'Innsbruck hot-spot',
        indicator: 'AQ2',
        navigationDescription: 'Surface NO2 emissions measured at Innsbruck Atmospheric Observatory (IAO)',
        lastIndicatorValue: null,
        indicatorName: 'Innsbruck hot-spot',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: getMinuteIntervals('2021-01-01T01:00:00Z', '2022-12-01T00:30:00Z', 30),
        inputData: [''],
        yAxis: '',
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
          minZoom: 1,
        },
      },
    },
  },
  /*
  // TODO: placeholder, do we need this?
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'High resolution Data',
        indicator: 'AQ3',
        lastIndicatorValue: null,
        indicatorName: 'High resolution Data',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'AQ3',
        },
      },
    },
  },
  */
  {
    //  is collection with data and AT_Network_edges_3857
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Human Mobility Patterns',
        indicator: 'AQ4',
        lastIndicatorValue: null,
        indicatorName: 'Human Mobility Patterns',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: getMinuteIntervals('2022-12-01T00:00:00Z', '2022-12-07T22:00:00Z', 60),
        inputData: [''],
        yAxis: '',
        highlights: [
          {
            name: 'Graz',
            location: wkt.read('POLYGON((15.24 47, 15.555 47, 15.555 47.11, 15.24 47.11, 15.24 47 ))').toJson(),
          },
          {
            name: 'Innsbruck',
            thumbnail: '',
            location: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
          },
          {
            name: 'St. Pölten',
            location: wkt.read('POLYGON((15.55 48.16, 15.7 48.16, 15.7 48.23, 15.55 48.23, 15.55 48.16 ))').toJson(),
          },
          {
            name: 'Vienna',
            location: wkt.read('POLYGON((16.19 48.12, 16.55 48.12, 16.55 48.295, 16.19 48.295, 16.19 48.12 ))').toJson(),
          },
        ],
        queryParameters: {
          sourceLayer: 'trajectories_on_edges_austria_december_first_week',
          selected: 'congestion_index',
          dataInfo: 'AQ4',
          items: [
            {
              id: 'congestion_index',
              description: 'Congestion index',
              min: 0,
              max: 100,
              colormapUsed: blgrrd,
              markdown: 'AQ4_congestion_index',
            },
            {
              id: 'duration',
              description: 'Traffic-free trip duration',
              min: 0,
              max: 240,
              colormapUsed: blgrrd,
              markdown: 'AQ4_duration',
            },
            {
              id: 'speed',
              description: 'Traffic-free trip speed',
              min: 0,
              max: 140,
              colormapUsed: blgrrd,
              markdown: 'AQ4_speed',
            },
            {
              id: 'distance',
              description: 'Trip distance',
              min: 0,
              max: 300,
              colormapUsed: blgrrd,
              markdown: 'AQ4_distance',
            },
            {
              id: 'n_trajectories',
              description: 'Trajectories',
              min: 1,
              max: 4000,
              colormapUsed: blgrrd,
              markdown: 'AQ4_trajectories',
            },
            {
              id: 'motorized_share',
              description: 'Motorized trip share index',
              min: 0,
              max: 100,
              colormapUsed: blgrrd,
              markdown: 'AQ4_motorized_share',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Network_edges_3857',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#000000';
            const dataSource = options.dataProp ? options.dataProp : 'mapData';
            if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
              const id = feature.get('fid');
              const ind = store.state.indicators.selectedIndicator;
              const currPar = ind.queryParameters.items
                .find((item) => item.id === ind.queryParameters.selected);
              if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                const value = ind[dataSource][id][currPar.id];
                const { min, max, colormapUsed } = currPar;
                let f = clamp((value - min) / (max - min), 0, 1);
                if (['n_trajectories'].includes(dataSource)) {
                  f = clamp((Math.log10(value) - Math.log10(min))
                    / (Math.log10(max) - Math.log10(min)), 0, 1);
                }
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
              }
            }
            return color;
          },
          id: 'trajectories_on_edges_austria_december_first_week',
          adminZoneKey: 'unique_id',
          parameters: 'unique_id,congestion_index,duration,speed,distance,n_trajectories,motorized_share',
          name: 'Human Mobility Patterns',
          strokeOnly: true,
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Nitrogen Dioxide (NO2)',
        navigationDescription: 'NO2 maps obtained from the Copernicus Sentinel5-p satellite',
        indicator: 'AQ5',
        lastIndicatorValue: null,
        indicatorName: 'Nitrogen Dioxide (NO2)',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: getDailyDates('2021-12-31', DateTime.utc().minus({ days: 1 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'AQ5',
          filters: {
            var: {
              display: true,
              label: 'Nitrogen Dioxide Tropospheric column content [µmol/m2]',
              dataInfo: 'AQ5',
              id: 'var',
              min: 0,
              max: 300,
              header: true,
              range: [0, 100],
            },
          },
        },
        display: {
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
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Dynamic human presence',
        indicator: 'MOBI1',
        lastIndicatorValue: null,
        indicatorName: 'Dynamic human presence',
        navigationDescription: '',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: getMinuteIntervals('2022-12-01T00:00:00Z', '2022-12-31T23:00:00Z', 60),
        inputData: [''],
        yAxis: '',
        queryParameters: {
          sourceLayer: 'dynamic_human_presence',
          selected: 'users_count',
          dataInfo: 'MOBI1',
          items: [
            {
              id: 'users_count',
              description: 'Population count',
              min: 100,
              max: 100000,
              colormapUsed: blgrrd,
              markdown: 'MOBI1_users_count',
            },
            {
              id: 'users_density',
              description: 'Population density',
              min: 1,
              max: 10000,
              colormapUsed: blgrrd,
              markdown: 'MOBI1_users_density',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#00000000';
            const dataSource = options.dataProp ? options.dataProp : 'mapData';
            if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
              const id = feature.id_;
              const ind = store.state.indicators.selectedIndicator;
              const currPar = ind.queryParameters.items
                .find((item) => item.id === ind.queryParameters.selected);
              if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                const value = ind[dataSource][id][currPar.id];
                const { min, max, colormapUsed } = currPar;
                // apply logarithmic scale specially for population
                const f = clamp((Math.log10(value) - Math.log10(min))
                  / (Math.log10(max) - Math.log10(min)), 0, 1);
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
              }
            }
            return color;
          },
          opacity: 0.7,
          id: 'mobility_v1',
          adminZoneKey: 'adminzoneid',
          parameters: 'adminzoneid,users_count,users_density',
          name: 'Mobility Data',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Green Roofs',
        indicator: 'SOL1',
        lastIndicatorValue: null,
        indicatorName: 'Green Roofs',
        navigationDescription: 'Green Roof Impact',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        highlights: [
          {
            name: 'Graz',
            location: wkt.read('POLYGON((15.24 47, 15.555 47, 15.555 47.11, 15.24 47.11, 15.24 47 ))').toJson(),
          },
          {
            name: 'Innsbruck',
            thumbnail: '',
            location: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
          },
          {
            name: 'St. Pölten',
            location: wkt.read('POLYGON((15.55 48.16, 15.7 48.16, 15.7 48.23, 15.55 48.23, 15.55 48.16 ))').toJson(),
          },
          {
            name: 'Vienna',
            location: wkt.read('POLYGON((16.19 48.12, 16.55 48.12, 16.55 48.295, 16.19 48.295, 16.19 48.12 ))').toJson(),
          },
        ],
        wmsStyles: {
          dataInfo: 'GreenRoofs',
          sourceLayer: 'GTIF_AT_Rooftops_3857',
          items: [
            {
              id: 'grimpactscore_filtered',
              description: 'Green Roof Impact Score',
              markdown: 'SOL1_GRImpact',
            },
            {
              id: 'lst2021',
              description: 'Max Land Surface Temperature',
              markdown: 'SOL_temp',
            },
            {
              id: 'grexisting',
              description: 'Existing Green Roofs',
              markdown: 'SOL1_GRExisting',
            },
            {
              id: 'grpotential',
              description: 'Roofs Suitable for Greening',
              markdown: '',
            },
            {
              id: 'grpotpar20',
              description: 'Percentage GR-Potential Area in relation to Total Roof Area',
              markdown: '',
            },
          ],
        },
        display: {
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          name: 'GTIF_AT_Rooftops_3857',
          STYLES: 'grimpactscore_filtered',
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_3857',
          maxZoom: 18,
          minZoom: 1,
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/green_rooftops.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: 'grimpactscore_filtered',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Solar Roofs',
        indicator: 'SOL2',
        lastIndicatorValue: null,
        indicatorName: 'Solar Roofs',
        navigationDescription: 'Electrical Power Production potential',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        highlights: [
          {
            name: 'Graz',
            location: wkt.read('POLYGON((15.24 47, 15.555 47, 15.555 47.11, 15.24 47.11, 15.24 47 ))').toJson(),
          },
          {
            name: 'Innsbruck',
            thumbnail: '',
            location: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
          },
          {
            name: 'St. Pölten',
            location: wkt.read('POLYGON((15.55 48.16, 15.7 48.16, 15.7 48.23, 15.55 48.23, 15.55 48.16 ))').toJson(),
          },
          {
            name: 'Vienna',
            thumbnail: 'green_roof_vienna',
            location: wkt.read('POLYGON((16.19 48.12, 16.55 48.12, 16.55 48.295, 16.19 48.295, 16.19 48.12 ))').toJson(),
          },
        ],
        wmsStyles: {
          dataInfo: 'SolarRoofs',
          sourceLayer: 'GTIF_AT_Rooftops_3857',
          items: [
            {
              id: 'PVEPPMwhHP',
              description: 'Total electric power production potential - High Performance ',
              markdown: 'SOL1_TEP_HP',
            },
            {
              id: 'PVExisting',
              description: 'Existing PV Panels',
              markdown: 'SOL1_PVExisting',
            },
            {
              id: 'PVEPPMwhRP',
              description: 'Total electric power production potential - Regular performance',
              markdown: 'SOL1_TEP_RP',
            },
            {
              id: 'PVEPPMwhLP',
              description: 'Total electric power production potential - Low performance',
              markdown: 'SOL1_TEP_LP',
            },
          ],
        },
        display: {
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          name: 'GTIF_AT_Rooftops_3857',
          STYLES: 'PVEPPMwhHP',
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_3857',
          maxZoom: 18,
          minZoom: 1,
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/solar_rooftops.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: 'PVEPPMwhHP',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Urban Trees',
        indicator: 'SOL3',
        disabled: true,
        lastIndicatorValue: null,
        indicatorName: 'Urban Trees',
        navigationDescription: 'Urban Tree Impact',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        highlights: [
          {
            name: 'Graz',
            location: wkt.read('POLYGON((15.24 47, 15.555 47, 15.555 47.11, 15.24 47.11, 15.24 47 ))').toJson(),
          },
          {
            name: 'Innsbruck',
            thumbnail: '',
            location: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
          },
          {
            name: 'St. Pölten',
            location: wkt.read('POLYGON((15.55 48.16, 15.7 48.16, 15.7 48.23, 15.55 48.23, 15.55 48.16 ))').toJson(),
          },
          {
            name: 'Vienna',
            thumbnail: 'green_roof_vienna',
            location: wkt.read('POLYGON((16.19 48.12, 16.55 48.12, 16.55 48.295, 16.19 48.295, 16.19 48.12 ))').toJson(),
          },
        ],

        display: {

        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'PV Detections',
        indicator: 'SOL10',
        lastIndicatorValue: null,
        indicatorName: 'PV Detections',
        navigationDescription: 'Preliminary detections',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        wmsStyles: {
          sourceLayer: 'AT_Rooftops_PV_bundesland_3857',
          items: [
            {
              id: 'PVExisting',
              description: 'Existing PV Panels',
              markdown: 'SOL10_PVExisting',
            },
          ],
        },
        display: {
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          name: 'AT_Rooftops_PV_bundesland_3857',
          STYLES: 'PVExisting',
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_PV_bundesland_3857',
          maxZoom: 18,
          minZoom: 1,
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/preliminary_solar_rooftops.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: 'PVExisting',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Forest Change',
        navigationDescription: '',
        indicator: 'BM1',
        lastIndicatorValue: null,
        indicatorName: 'Forest Change',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'BM1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/Carbon_accounting/3857/Austria_AutoChange2020-2021-packed-rendered_3857.tif' },
          ],
          normalize: true,
          style: {
          },
          name: 'Forest Change',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Above Ground Biomass',
        navigationDescription: '',
        indicator: 'BM2',
        lastIndicatorValue: null,
        indicatorName: 'Above Ground Biomass',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'BM2',
          filters: {
            biomass: {
              display: true,
              label: 'CCI Biomass [t/ha]',
              id: 'biomass',
              min: 0,
              max: 420,
              header: true,
              range: [0, 420],
            },
          },
        },
        display: {
          protocol: 'cog',
          id: 'BM2',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/Carbon_accounting/3857/CCI-BIOMASS2020-Austria_COG_3857.tif' },
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
                ...getColorStops('greens', 0, 420, 50, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Above Ground Biomass',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Forest disturbance type',
        navigationDescription: '',
        indicator: 'FCM2',
        lastIndicatorValue: null,
        indicatorName: 'Forest disturbance type',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Styria',
        time: [],
        inputData: [''],
        yAxis: '',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
          {
            name: 'Mariazell',
            location: wkt.read('POLYGON((15.200 47.800, 15.200 47.772, 15.262 47.772, 15.262 47.800, 15.200 47.800))').toJson(),
          },
        ],
        display: {
          protocol: 'cog',
          id: 'FCM2',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/JR/A_FDT_AnualForestDistrubanceType_cog_3857.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/JR/A_FM_AnualForestMask-2021-08-31_cog_3857.tif' },
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
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Annual forest mask',
        navigationDescription: '2021',
        indicator: 'FCM3',
        lastIndicatorValue: null,
        indicatorName: 'Annual forest mask',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Styria',
        time: [],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'FCM3',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/JR/A_FM_AnualForestMask-2021-08-31_cog_3857.tif' },
            // { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/JR/S24B_StyriaMosaic2021_Cog-001_3857.tif' },
          ],
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              ['color', 147, 220, 0],
              ['==', ['band', 1], 2],
              ['color', 0, 107, 0],
              /*
              ['!=', ['band', 1], 0],
              [
                'color',
                ['*', normalizeByValue(['band', 12], 123, 689), 255],
                ['*', normalizeByValue(['band', 13], 230, 937), 255],
                ['*', normalizeByValue(['band', 14], 140, 912), 255],
              ],
              */
              ['color', 0, 0, 0, 0],
            ],
          },
          name: 'Annual Forest Mask',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Basal area',
        navigationDescription: '',
        indicator: 'VTT1',
        lastIndicatorValue: null,
        indicatorName: 'Basal area',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [
          ['2015', '2015/Styria_basal_area_2015-rendered_COG_3857.tif'],
          ['2018', '2018/Styria_basal_area_2018-rendered_COG_3857.tif'],
          ['2021', '2021/Styria_basal_area_2021-rendered_COG_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'VTT1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          name: 'Basal area',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Broadleaf proportion',
        navigationDescription: '',
        indicator: 'VTT2',
        lastIndicatorValue: null,
        indicatorName: 'Broadleaf proportion',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [
          ['2015', '2015/Styria_broadleaf_proportion_2015-rendered_COG_3857.tif'],
          ['2018', '2018/Styria_broadleaf_proportion_2018-rendered_COG_3857.tif'],
          ['2021', '2021/Styria_broadleaf_proportion_2021-rendered_COG_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'VTT2',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          name: 'Broadleaf proportion',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Coniferous proportion',
        navigationDescription: '',
        indicator: 'VTT3',
        lastIndicatorValue: null,
        indicatorName: 'Coniferous proportion',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [
          ['2015', '2015/Styria_conifer_proportion_2015-rendered_COG_3857.tif'],
          ['2018', '2018/Styria_conifer_proportion_2018-rendered_COG_3857.tif'],
          ['2021', '2021/Styria_conifer_proportion_2021-rendered_COG_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'VTT3',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          name: 'Coniferous proportion',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Tree diameter',
        navigationDescription: '',
        indicator: 'VTT4',
        lastIndicatorValue: null,
        indicatorName: 'Tree diameter',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [
          ['2015', '2015/Styria_diameter_2015-rendered_COG_3857.tif'],
          ['2018', '2018/Styria_diameter_2018-rendered_COG_3857.tif'],
          ['2021', '2021/Styria_diameter_2021-rendered_COG_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'VTT4',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          name: 'Tree diameter',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Tree height',
        navigationDescription: '',
        indicator: 'VTT5',
        lastIndicatorValue: null,
        indicatorName: 'Tree height',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [
          ['2015', '2015/Styria_height_2015-rendered_COG_3857.tif'],
          ['2018', '2018/Styria_height_2018-rendered_COG_3857.tif'],
          ['2021', '2021/Styria_height_2021-rendered_COG_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'VTT5',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          name: 'Tree height',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Styria',
        siteName: 'global',
        description: 'Growing Stock Volume',
        navigationDescription: '',
        indicator: 'VTT6',
        lastIndicatorValue: null,
        indicatorName: 'Growing Stock Volume',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [
          ['2015', '2015/Styria_volume_2015-rendered_COG_3857.tif'],
          ['2018', '2018/Styria_volume_2018-rendered_COG_3857.tif'],
          ['2021', '2021/Styria_volume_2021-rendered_COG_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'VTT6',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          name: 'Tree volume',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Forest change detections',
        navigationDescription: '',
        indicator: 'FCM1',
        lastIndicatorValue: null,
        indicatorName: 'Forest change detections',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        highlights: [
          {
            name: 'Styria overview',
            location: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
          },
          {
            name: 'Oberhaag',
            location: wkt.read('POLYGON((15.290 46.707, 15.427 46.707, 15.427 46.640, 15.290 46.640, 15.290 46.707))').toJson(),
          },
          {
            name: 'Bruck an der Mur',
            thumbnail: '',
            location: wkt.read('POLYGON((15.158 47.440, 15.312 47.440, 15.312 47.368, 15.158 47.368, 15.158 47.440))').toJson(),
          },
        ],
        time: [
          ['2022-03', 'NRT_FCM_Changes-2022-03_cog_3857.tif'],
          ['2022-04', 'NRT_FCM_Changes-2022-04_cog_3857.tif'],
          ['2022-05', 'NRT_FCM_Changes-2022-05_cog_3857.tif'],
          ['2022-06', 'NRT_FCM_Changes-2022-06_cog_3857.tif'],
          ['2022-07', 'NRT_FCM_Changes-2022-07_cog_3857.tif'],
          ['2022-08', 'NRT_FCM_Changes-2022-08_cog_3857.tif'],
          ['2022-09', 'NRT_FCM_Changes-2022-09_cog_3857.tif'],
          ['2022-10', 'NRT_FCM_Changes-2022-10_cog_3857.tif'],
          ['2022-11', 'NRT_FCM_Changes-2022-11_cog_3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'FCM1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/JR/{time}' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/JR/A_FM_AnualForestMask-2021-08-31_cog_3857.tif' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              ['color', 255, 0, 0, 1],
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
          name: 'Forest change detections',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Site Suitability Assessment & Trade-off Explorer',
        navigationDescription: 'Site Suitability Assessment & Trade-off Explorer',
        indicator: 'REP1',
        lastIndicatorValue: null,
        indicatorName: 'Wind Energy',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP1',
          filters: {
            powerDensity: {
              display: true,
              label: 'Wind Power Density [w/m²]',
              id: 'powerDensity',
              dataInfo: 'WindPowerDensity',
              min: 0,
              max: 4000,
              step: 10,
              header: true,
              range: [0, 4000],
              changeablaDataset: {
                items: [
                  {
                    description: '200m height',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_200m_Austria_WGS84_COG_clipped_3857_fix.tif',
                  },
                  {
                    description: '100m height',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_100m_Austria_WGS84_COG_clipped_3857_fix.tif',
                  },
                  {
                    description: '50m height',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_50m_Austria_WGS84_COG_clipped_3857_fix.tif',
                  },
                ],
              },
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
              label: 'Distance to settlements [m]',
              id: 'settlementDistance',
              dataInfo: 'SettlementDistance',
              type: 'slider',
              min: 0,
              max: 5000,
              value: 0,
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
            },
            ruggedness: {
              display: false,
              label: 'Filter for ruggedness index',
              id: 'ruggedness',
              type: 'slider',
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
        display: {
          protocol: 'cog',
          id: 'REP1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_200m_Austria_WGS84_COG_clipped_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Natura2000_Austria_COG_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/RuggednessIndex_Austria_3857_COG_fix.tif' },
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
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 1], ['var', 'powerDensityMin'], ['var', 'powerDensityMax']],
                ['between', ['band', 2], ['var', 'elevationMin'], ['var', 'elevationMax']],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['>', ['band', 4], ['var', 'settlementDistance']],
                ['<', ['band', 5], ['var', 'energyGridDistance']],
                ['<', ['band', 7], ['var', 'ruggedness']],
                ['any',
                  ['==', ['var', 'protected'], 0],
                  ['==', ['band', 6], 0],
                ],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('yignbu', 100, 440, 50, false),
                ...getColorStops('yiorrd', 440, 2400, 50, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Wind Energy',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Site Suitability Assessment & Trade-off Explorer',
        navigationDescription: 'Site Suitability Assessment & Trade-off Explorer',
        indicator: 'REP2',
        lastIndicatorValue: null,
        indicatorName: 'Solar Energy',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP2',
          filters: {
            solar: {
              display: true,
              dataInfo: 'GlobalHorizontalIrradiation',
              label: 'Global Horizontal Irradiation (kWh/m²/yr)',
              id: 'solar',
              header: true,
              min: 300,
              max: 1400,
              range: [300, 1400],
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
        display: {
          protocol: 'cog',
          id: 'REP2',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/GHI_Austria_COG_3857_clipped_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Natura2000_Austria_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              solarMin: 300,
              solarMax: 1400,
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
                ['>', ['band', 1], 0],
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
                ...getColorStops('rdbu', 1100, 1300, 50, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Solar Energy',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        indicator: 'REP3',
        disabled: true,
        description: 'NRT Energy Production Forecast',
        navigationDescription: 'NRT Energy Production Forecast',
        lastIndicatorValue: null,
        indicatorName: 'Nowcasting',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
        },
        display: {
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: false,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        indicator: 'REP4',
        description: 'Dynamic Storage Capacity',
        navigationDescription: 'Dynamic Storage Capacity',
        lastIndicatorValue: null,
        indicatorName: 'Hydro Power',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        queryParameters: {
          sourceLayer: 'sobothstausee_surface_water_extent',
          selected: 'area_diff_rel',
          dataInfo: 'SWE',
          items: [
            {
              id: 'area_diff_rel',
              description: 'Surface Water Extent',
              min: -0.3,
              max: 0,
              colormapUsed: drrglb,
              markdown: 'SWE',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_reservoirs',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#000000';
            const dataSource = options.dataProp ? options.dataProp : 'mapData';
            if (store.state.indicators.selectedIndicator
                && store.state.indicators.selectedIndicator[dataSource]) {
              const id = feature.get('full_id');
              const ind = store.state.indicators.selectedIndicator;
              const currPar = ind.queryParameters.items
                .find((item) => item.id === ind.queryParameters.selected);
              if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                const value = ind[dataSource][id][currPar.id];
                const { min, max, colormapUsed } = currPar;
                const f = clamp((value - min) / (max - min), 0, 1);
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
              }
            }
            return color;
          },
          id: 'sobothstausee_surface_water_extent',
          adminZoneKey: 'full_id',
          disableCompare: true,
          timeKey: 'date',
          parameters: 'full_id,area_diff_rel,date,area,diff_area',
          name: 'Surface Water Extent',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((15.01 46.70,15.01 46.69,15.03 46.685,15.04 46.685,15.04 46.69,15.01 46.70))').toJson(),
            }],
          },
        },
        aoiID: 'Austria',
        time: ['2018-04-30', '2018-05-31', '2018-06-30', '2018-07-31', '2018-08-31', '2018-09-30', '2018-10-31', '2018-11-30', '2018-12-31', '2019-03-31', '2019-04-30', '2019-05-31', '2019-06-30', '2019-07-31', '2019-08-31', '2019-09-30', '2019-10-31', '2019-11-30', '2019-12-31', '2020-03-31', '2020-04-30', '2020-05-31', '2020-06-30', '2020-07-31', '2020-08-31', '2020-09-30', '2020-10-31', '2020-11-30', '2020-12-31', '2021-03-31', '2021-04-30', '2021-05-31', '2021-06-30', '2021-07-31', '2021-08-31', '2021-09-30', '2021-10-31', '2021-11-30', '2021-12-31', '2022-03-31', '2022-04-30', '2022-05-31', '2022-06-30', '2022-07-31', '2022-08-31', '2022-09-30', '2022-10-31', '2022-11-30', '2022-12-31'],
        inputData: [''],
        yAxis: 'Surface Water Extent relative change wrt. reference value [%]',
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Potential Assessment',
        navigationDescription: 'Potential Assessment',
        indicator: 'REP5',
        disabled: true,
        lastIndicatorValue: null,
        indicatorName: 'Micro Hydropower',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        display: {
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Heat Explorer',
        indicator: 'LST',
        lastIndicatorValue: null,
        indicatorName: 'Heat Explorer',
        eoSensor: '',
        highlights: [
          {
            name: 'Austria overview',
            location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
          },
        ],
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'LST',
        time: [''],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'LST',
        },
        display: {
          protocol: 'xyz',
          minZoom: 1,
          tileSize: 256,
          opacity: 1,
          url: 'https://tileserver.geoville.com/heatMap/LST_aggregated_reproc_filt_clipped_AT_buffered/%7Bz%7D/%7Bx%7D/%7By%7D.png/LST_aggregated_reproc_filt_clipped_AT_buffered/{z}/{x}/{y}.png',
          name: 'Heat Explorer',
          // legendUrl: 'data/trilateral/no2Legend-monthly-nasa.png',
        },
      },
    },
  },
];
