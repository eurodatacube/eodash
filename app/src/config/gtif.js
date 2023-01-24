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
  url: 'data/gtif/data/AT_NUTS_L0.geojson',
  maxZoom: 7.5,
}, {
  ...nutsStyle,
  name: 'NUTS L1',
  url: 'data/gtif/data/AT_NUTS_L1.geojson',
  minZoom: 7.5,
  maxZoom: 8.5,
}, {
  ...nutsStyle,
  name: 'NUTS L2',
  url: 'data/gtif/data/AT_NUTS_L2.geojson',
  minZoom: 8.5,
  maxZoom: 9.5,
}, {
  ...nutsStyle,
  name: 'NUTS L3',
  url: 'data/gtif/data/AT_NUTS_L3.geojson',
  minZoom: 9.5,
  maxZoom: 10.5,
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'District (Bezirk)',
  url: '//eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_POLBEZ_20220101.fgb',
  minZoom: 10.5,
  maxZoom: 12,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'Municipality (Gemeinde)',
  url: '//eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb',
  minZoom: 12,
  maxZoom: 13.5,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'Census Track (Zählsprengel)',
  url: '//eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_ZSP_20220101.fgb',
  minZoom: 13.5,
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

export const indicatorsDefinition = Object.freeze({
  BM1: {
    indicator: 'Biomass',
    class: 'air',
    themes: ['carbon-accounting'],
    story: '/data/gtif/markdown/BM1',
  },
  BM2: {
    indicator: 'CCI Biomass',
    class: 'air',
    themes: ['carbon-accounting'],
    story: '/data/gtif/markdown/BM2',
  },
  REP1: {
    indicator: 'Wind Energy',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP1',
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: true },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  REP2: {
    indicator: 'Solar Energy',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP2',
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: true },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  REP3: {
    indicator: 'Nowcasting',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP3',
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: true },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  REP4: {
    indicator: 'Hydro Power',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP3',
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: true },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  REP5: {
    indicator: 'Micro Hydropower',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP3',
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: true },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  MOBI1: {
    indicator: 'mobility',
    class: 'mobi1',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/MOBI',
    // customAreaIndicator: true,
  },
  SOL1: {
    indicator: 'sus cities',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
  },
  SOL2: {
    indicator: 'sus cities',
    class: 'air',
    themes: ['sustainable-cities'],
    baseLayers: [{
      ...baseLayers.bmapgelaende,
      visible: true,
    }, baseLayers.bmaporthofoto30cm],
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
  LST: {
    indicator: 'Heat Explorer',
    class: 'air',
    story: '/data/gtif/markdown/LST',
    themes: ['eo-adaptation-services'],
  },
  AQ: {
    indicator: 'Air Quality Maps',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
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
  },
  AQ3: {
    indicator: 'High resolution Data',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
  },
  AQ4: {
    indicator: 'Social Mobility',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/MOBI',
  },
  AQ5: {
    indicator: 'Nitrogen Dioxide (NO2)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/MOBI',
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
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Air Quality Maps',
        indicator: 'AQ',
        lastIndicatorValue: null,
        indicatorName: 'Air Quality Maps',
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
        yAxis: '',
        queryParameters: {
          sourceLayer: 'air_quality_new_id',
          selected: 'ihr',
          items: [
            {
              id: 'ihr',
              description: 'Aggregate Risk Index',
              min: 0,
              max: 10,
              // colormapUsed: ihrCS,
              colormapUsed: grywrd,
              markdown: 'AQ_IHR',
            },
            {
              id: 'pm10',
              description: 'Particulate Matter < 10µm',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              min: 0,
              max: 35,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
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
          name: 'Air Quality',
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
        time: [
          ['20201101T00:00:00Z', 'gtif_uibk_20201101_ffp_values_b1.tif'],
          ['20201101T01:00:00Z', 'gtif_uibk_20201101_ffp_values_b2.tif'],
          ['20201101T02:00:00Z', 'gtif_uibk_20201101_ffp_values_b3.tif'],
          ['20201101T03:00:00Z', 'gtif_uibk_20201101_ffp_values_b4.tif'],
          ['20201101T04:00:00Z', 'gtif_uibk_20201101_ffp_values_b5.tif'],
          ['20201101T05:00:00Z', 'gtif_uibk_20201101_ffp_values_b6.tif'],
          ['20201101T06:00:00Z', 'gtif_uibk_20201101_ffp_values_b7.tif'],
          ['20201101T07:00:00Z', 'gtif_uibk_20201101_ffp_values_b8.tif'],
          ['20201101T08:00:00Z', 'gtif_uibk_20201101_ffp_values_b9.tif'],
          ['20201101T09:00:00Z', 'gtif_uibk_20201101_ffp_values_b10.tif'],
          ['20201101T10:00:00Z', 'gtif_uibk_20201101_ffp_values_b11.tif'],
          ['20201101T11:00:00Z', 'gtif_uibk_20201101_ffp_values_b12.tif'],
          ['20201101T12:00:00Z', 'gtif_uibk_20201101_ffp_values_b13.tif'],
          ['20201101T13:00:00Z', 'gtif_uibk_20201101_ffp_values_b14.tif'],
          ['20201101T14:00:00Z', 'gtif_uibk_20201101_ffp_values_b15.tif'],
          ['20201101T15:00:00Z', 'gtif_uibk_20201101_ffp_values_b16.tif'],
          ['20201101T16:00:00Z', 'gtif_uibk_20201101_ffp_values_b17.tif'],
          ['20201101T17:00:00Z', 'gtif_uibk_20201101_ffp_values_b18.tif'],
          ['20201101T18:00:00Z', 'gtif_uibk_20201101_ffp_values_b19.tif'],
          ['20201101T19:00:00Z', 'gtif_uibk_20201101_ffp_values_b20.tif'],
          ['20201101T20:00:00Z', 'gtif_uibk_20201101_ffp_values_b21.tif'],
          ['20201101T21:00:00Z', 'gtif_uibk_20201101_ffp_values_b22.tif'],
          ['20201101T22:00:00Z', 'gtif_uibk_20201101_ffp_values_b23.tif'],
          ['20201101T23:00:00Z', 'gtif_uibk_20201101_ffp_values_b24.tif'],
        ],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'AQ2',
          filters: {
            var: {
              display: true,
              label: 'Flux [1e-6]',
              id: 'var',
              min: 0,
              max: 200,
              header: true,
              range: [2, 100],
            },
            spacing: {
              display: true,
              label: 'Contour step size [1e-6]',
              type: 'slider',
              id: 'varSpacing',
              min: 1,
              max: 51,
              value: 2,
            },
            offset: {
              display: true,
              label: 'Contour offset [1e-6]',
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
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/new_data/test_nc_COG/day/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd HH:mm:ss'),
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
  {
    //  is collection with data and AT_Network_edges_3857
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Social Mobility',
        indicator: 'AQ4',
        lastIndicatorValue: null,
        indicatorName: 'Social Mobility',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: [
          '2021-07-05T00:00:00', '2021-07-05T01:00:00', '2021-07-05T02:00:00',
          '2021-07-05T03:00:00', '2021-07-05T04:00:00', '2021-07-05T05:00:00',
          '2021-07-05T06:00:00', '2021-07-05T07:00:00', '2021-07-05T08:00:00',
          '2021-07-05T09:00:00', '2021-07-05T10:00:00', '2021-07-05T11:00:00',
          '2021-07-05T12:00:00', '2021-07-05T13:00:00', '2021-07-05T14:00:00',
          '2021-07-05T15:00:00', '2021-07-05T16:00:00', '2021-07-05T17:00:00',
          '2021-07-05T18:00:00', '2021-07-05T19:00:00', '2021-07-05T20:00:00',
          '2021-07-05T21:00:00', '2021-07-05T22:00:00', '2021-07-05T23:00:00',
        ],
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
          sourceLayer: 'trajectories_on_edges_austria_july',
          selected: 'congestion_index',
          items: [
            {
              id: 'congestion_index',
              description: 'Congestion index',
              min: 0,
              max: 5,
              colormapUsed: grywrd,
              // markdown: 'AQ_NO2',
            },
            {
              id: 'duration',
              description: 'Duration',
              min: 0,
              max: 1200,
              colormapUsed: grywrd,
              // markdown: 'AQ_PM10',
            },
            {
              id: 'speed',
              description: 'Speed',
              min: 0,
              max: 140,
              colormapUsed: grywrd,
              // markdown: 'AQ_PM10',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Network_edges_3857',
          protocol: 'geoserverTileLayer',
          getColor: (feature, store, options) => {
            let color = '#00000000';
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
                const f = clamp((value - min) / (max - min), 0, 1);
                color = colormapUsed.colors[Math.round(f * (grywrd.steps - 1))];
              }
            }
            return color;
          },
          id: 'trajectories_on_edges_austria_july',
          adminZoneKey: 'unique_id',
          parameters: 'unique_id,duration,congestion_index,speed',
          name: 'Social Mobility',
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
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: [
          ['2019-07-08', 'averaged_NO2_20190708.tif'],
          ['2019-07-15', 'averaged_NO2_20190715.tif'],
          ['2019-07-21', 'averaged_NO2_20190721.tif'],
          ['2019-07-22', 'averaged_NO2_20190722.tif'],
          ['2019-07-23', 'averaged_NO2_20190723.tif'],
          ['2019-07-24', 'averaged_NO2_20190724.tif'],
          ['2019-07-25', 'averaged_NO2_20190725.tif'],
          ['2019-07-26', 'averaged_NO2_20190726.tif'],
          ['2019-07-27', 'averaged_NO2_20190727.tif'],
          ['2019-07-28', 'averaged_NO2_20190728.tif'],
          ['2019-07-29', 'averaged_NO2_20190729.tif'],
          ['2019-07-30', 'averaged_NO2_20190730.tif'],
          ['2022-11-18', 'averaged_NO2_20221118.tif'],
          ['2022-11-19', 'averaged_NO2_20221119.tif'],
          ['2022-11-20', 'averaged_NO2_20221120.tif'],
          ['2022-11-21', 'averaged_NO2_20221121.tif'],
          ['2022-11-22', 'averaged_NO2_20221122.tif'],
          ['2022-11-23', 'averaged_NO2_20221123.tif'],
          ['2022-11-24', 'averaged_NO2_20221124.tif'],
          ['2022-11-25', 'averaged_NO2_20221125.tif'],
          ['2022-11-26', 'averaged_NO2_20221126.tif'],
          ['2022-11-27', 'averaged_NO2_20221127.tif'],
          ['2022-11-28', 'averaged_NO2_20221128.tif'],
          ['2022-11-29', 'averaged_NO2_20221129.tif'],
          ['2022-11-30', 'averaged_NO2_20221130.tif'],
          ['2022-12-01', 'averaged_NO2_20221201.tif'],
          ['2022-12-02', 'averaged_NO2_20221202.tif'],
          ['2022-12-03', 'averaged_NO2_20221203.tif'],
          ['2022-12-04', 'averaged_NO2_20221204.tif'],
          ['2022-12-05', 'averaged_NO2_20221205.tif'],
          ['2022-12-06', 'averaged_NO2_20221206.tif'],
          ['2022-12-07', 'averaged_NO2_20221207.tif'],
          ['2022-12-08', 'averaged_NO2_20221208.tif'],
          ['2022-12-09', 'averaged_NO2_20221209.tif'],
          ['2022-12-10', 'averaged_NO2_20221210.tif'],
          ['2022-12-11', 'averaged_NO2_20221211.tif'],
          ['2022-12-12', 'averaged_NO2_20221212.tif'],
          ['2022-12-13', 'averaged_NO2_20221213.tif'],
          ['2022-12-14', 'averaged_NO2_20221214.tif'],
          ['2022-12-15', 'averaged_NO2_20221215.tif'],
          ['2022-12-16', 'averaged_NO2_20221216.tif'],
          ['2022-12-17', 'averaged_NO2_20221217.tif'],
          ['2022-12-18', 'averaged_NO2_20221218.tif'],
          ['2022-12-19', 'averaged_NO2_20221219.tif'],
          ['2022-12-20', 'averaged_NO2_20221220.tif'],
          ['2022-12-21', 'averaged_NO2_20221221.tif'],
          ['2022-12-22', 'averaged_NO2_20221222.tif'],
          ['2022-12-23', 'averaged_NO2_20221223.tif'],
          ['2022-12-24', 'averaged_NO2_20221224.tif'],
          ['2022-12-25', 'averaged_NO2_20221225.tif'],
          ['2022-12-26', 'averaged_NO2_20221226.tif'],
          ['2022-12-27', 'averaged_NO2_20221227.tif'],
          ['2022-12-28', 'averaged_NO2_20221228.tif'],
          ['2022-12-29', 'averaged_NO2_20221229.tif'],
          ['2022-12-30', 'averaged_NO2_20221230.tif'],
          ['2022-12-31', 'averaged_NO2_20221231.tif'],
          ['2023-01-01', 'averaged_NO2_20230101.tif'],
          ['2023-01-02', 'averaged_NO2_20230102.tif'],
          ['2023-01-03', 'averaged_NO2_20230103.tif'],
          ['2023-01-04', 'averaged_NO2_20230104.tif'],
          ['2023-01-05', 'averaged_NO2_20230105.tif'],
          ['2023-01-06', 'averaged_NO2_20230106.tif'],
          ['2023-01-07', 'averaged_NO2_20230107.tif'],
          ['2023-01-08', 'averaged_NO2_20230108.tif'],
          ['2023-01-09', 'averaged_NO2_20230109.tif'],
          ['2023-01-10', 'averaged_NO2_20230110.tif'],
          ['2023-01-11', 'averaged_NO2_20230111.tif'],
          ['2023-01-12', 'averaged_NO2_20230112.tif'],
          ['2023-01-13', 'averaged_NO2_20230113.tif'],
          ['2023-01-14', 'averaged_NO2_20230114.tif'],
          ['2023-01-15', 'averaged_NO2_20230115.tif'],
          ['2023-01-16', 'averaged_NO2_20230116.tif'],
          ['2023-01-17', 'averaged_NO2_20230117.tif'],
          ['2023-01-18', 'averaged_NO2_20230118.tif'],
          ['2023-01-19', 'averaged_NO2_20230119.tif'],
          ['2023-01-20', 'averaged_NO2_20230120.tif'],
          ['2023-01-21', 'averaged_NO2_20230121.tif'],
          ['2023-01-22', 'averaged_NO2_20230122.tif'],
          ['2023-01-23', 'averaged_NO2_20230123.tif'],
        ],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'AQ5',
          filters: {
            var: {
              display: true,
              label: 'Averaged NO2',
              id: 'var',
              min: -9000,
              max: -1000,
              header: true,
              range: [-8000, -2000],
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'AQ5',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/SISTEMA/14_days_average/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd HH:mm:ss'),
          style: {
            variables: {
              varMin: -8000,
              varMax: -2000,
            },
            color: [
              'case',
              ['==', ['band', 1], 0],
              ['color', 0, 0, 0, 0],
              [
                'interpolate',
                ['linear'],
                normalize(['band', 1], 'varMin', 'varMax'),
                ...getColorStops('jet', 0, 1, 50, false),
              ],
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
        description: 'Mobility Data',
        indicator: 'MOBI1',
        lastIndicatorValue: null,
        indicatorName: 'Mobility Data',
        navigationDescription: 'Mobility',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: availableDates.mobility.sort((a, b) => {
          const val = DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
          return val;
        }),
        inputData: [''],
        yAxis: '',
        queryParameters: {
          sourceLayer: 'mobility',
          selected: 'users_count',
          items: [
            {
              id: 'users_count',
              description: 'Aggregated user count in area',
              min: 0,
              max: 500,
              colormapUsed: grywrd,
              // markdown: 'AQ_NO2',
            },
            {
              id: 'users_density',
              description: 'User density in area',
              min: 0,
              max: 200,
              colormapUsed: grywrd,
              // markdown: 'AQ_PM10',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
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
                color = colormapUsed.colors[Math.round(f * (grywrd.steps - 1))];
              }
            }
            return color;
          },
          id: 'mobility',
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
        wmsStyles: {
          sourceLayer: 'GTIF_AT_Rooftops_3857',
          items: [
            {
              id: 'urbantrees',
              description: 'Urban trees',
              markdown: 'urban_trees',
            },
          ],
        },
        display: {
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          name: 'GTIF_AT_Rooftops_3857',
          STYLES: 'urbantrees',
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_3857',
          maxZoom: 18,
          minZoom: 1,
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/solar_rooftops.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: 'urbantrees',
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
        description: 'Biomass',
        navigationDescription: '',
        indicator: 'BM1',
        lastIndicatorValue: null,
        indicatorName: 'Biomass',
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
          sourceLayer: 'BM1',
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'BM1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/Carbon_accounting/3857/Austria_AutoChange2020-2021-packed-rendered_3857.tif' },
          ],
          normalize: true,
          style: {
          },
          name: 'Biomass',
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
        description: 'CCI Biomass',
        navigationDescription: '',
        indicator: 'BM2',
        lastIndicatorValue: null,
        indicatorName: 'CCI Biomass',
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
          name: 'biomass',
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
              min: 0,
              max: 4000,
              header: true,
              range: [0, 4000],
            },
            elevation: {
              display: true,
              label: 'Filter for elevation [m]',
              id: 'elevation',
              min: 0,
              max: 4000,
              range: [0, 4000],
            },
            slope: {
              display: true,
              label: 'Filter for slope [°]',
              id: 'slope',
              min: 0,
              max: 50,
              range: [0, 50],
            },
            settlementDistance: {
              display: false,
              label: 'Distance to settlements [m]',
              id: 'settlementDistance',
              min: 0,
              max: 3000,
              range: [0, 3000],
            },
            energyGridDistance: {
              display: false,
              label: 'Distance to energy grid [m]',
              id: 'energyGridDistance',
              min: 0,
              max: 25000,
              range: [0, 25000],
            },
            protectedZones: {
              display: true,
              type: 'boolfilter',
              label: 'Exclude protected areas',
              id: 'protected',
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
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_Austria_COG_3857_clipped_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Natura2000_Austria_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              powerDensityMin: 0,
              powerDensityMax: 4000,
              elevationMin: 0,
              elevationMax: 4000,
              slopeMin: 0,
              slopeMax: 50,
              settlementDistanceMin: 0,
              settlementDistanceMax: 3000,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 25000,
              protected: 0,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 1], ['var', 'powerDensityMin'], ['var', 'powerDensityMax']],
                ['between', ['band', 2], ['var', 'elevationMin'], ['var', 'elevationMax']],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 4], ['var', 'settlementDistanceMin'], ['var', 'settlementDistanceMax']],
                ['between', ['band', 5], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
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
              label: 'Solar Irradiance (kWh/m²/yr)',
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
              range: [0, 360],
            },
            slope: {
              display: true,
              label: 'Filter for slope',
              id: 'slope',
              min: 0,
              max: 50,
              range: [0, 50],
            },
            energyGridDistance: {
              display: true,
              label: 'Distance to energy grid',
              id: 'energyGridDistance',
              min: 0,
              max: 50000,
              range: [0, 50000],
            },
            elevation: {
              display: false,
              label: 'Filter for elevation [m]',
              id: 'elevation',
              min: 0,
              max: 4000,
              range: [0, 4000],
            },
            protectedZones: {
              display: false,
              type: 'boolfilter',
              label: 'Exclude protected areas',
              id: 'protected',
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
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
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
              aspectMin: 0,
              aspectMax: 360,
              slopeMin: 0,
              slopeMax: 50,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 50000,
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
                ['between', ['band', 2], ['var', 'aspectMin'], ['var', 'aspectMax']],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 4], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
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
        dataLoadFinished: true,
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
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP4',
          filters: {
            rugedeness: {
              label: 'Filter for rugedeness index',
              id: 'rugedeness',
              min: 0,
              max: 0.78,
            },
            settlementDistance: {
              label: 'Distance to settlements',
              id: 'settlementDistance',
              min: 0,
              max: 5670,
            },
            energyGridDistance: {
              label: 'Distance to energy grid',
              id: 'energyGridDistance',
              min: 0,
              max: 50000,
            },
            slope: {
              label: 'Filter for slope',
              id: 'slope',
              min: 0,
              max: 50,
            },
            aspect: {
              label: 'Filter for aspect',
              id: 'aspect',
              min: 0,
              max: 360,
            },
            altitude: {
              label: 'Filter for altitude',
              id: 'altitude',
              min: 0,
              max: 2000,
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP4',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/RuggednessIndex_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/ESA_WorldCover_10m_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              rugedenessMin: 0,
              rugedenessMax: 0.78,
              settlementDistanceMin: 0,
              settlementDistanceMax: 5670,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 50000,
              slopeMin: 0,
              slopeMax: 50,
              aspectMin: 0,
              aspectMax: 360,
            },
            color: [
              'case',
              [
                'all',
                ['between', ['band', 2], ['var', 'rugedenessMin'], ['var', 'rugedenessMax']],
                ['between', ['band', 3], ['var', 'settlementDistanceMin'], ['var', 'settlementDistanceMax']],
                ['between', ['band', 4], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
                ['between', ['band', 5], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 6], ['var', 'aspectMin'], ['var', 'aspectMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('viridis', 0, 9000, 10, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Hydro Power',
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
        description: 'Potential Assessment',
        navigationDescription: 'Potential Assessment',
        indicator: 'REP5',
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
        cogFilters: {
          sourceLayer: 'REP5',
          filters: {
            rugedeness: {
              label: 'Filter for rugedeness index',
              id: 'rugedeness',
              min: 0,
              max: 0.78,
            },
            settlementDistance: {
              label: 'Distance to settlements',
              id: 'settlementDistance',
              min: 0,
              max: 5670,
            },
            energyGridDistance: {
              label: 'Distance to energy grid',
              id: 'energyGridDistance',
              min: 0,
              max: 50000,
            },
            slope: {
              label: 'Filter for slope',
              id: 'slope',
              min: 0,
              max: 50,
            },
            aspect: {
              label: 'Filter for aspect',
              id: 'aspect',
              min: 0,
              max: 360,
            },
            altitude: {
              label: 'Filter for altitude',
              id: 'altitude',
              min: 0,
              max: 2000,
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP5',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerDensity_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/RuggednessIndex_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/ESA_WorldCover_10m_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              rugedenessMin: 0,
              rugedenessMax: 0.78,
              settlementDistanceMin: 0,
              settlementDistanceMax: 5670,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 50000,
              slopeMin: 0,
              slopeMax: 50,
              aspectMin: 0,
              aspectMax: 360,
            },
            color: [
              'case',
              [
                'all',
                ['between', ['band', 2], ['var', 'rugedenessMin'], ['var', 'rugedenessMax']],
                ['between', ['band', 3], ['var', 'settlementDistanceMin'], ['var', 'settlementDistanceMax']],
                ['between', ['band', 4], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
                ['between', ['band', 5], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 6], ['var', 'aspectMin'], ['var', 'aspectMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('viridis', 0, 9000, 10, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Micro-Hydropower',
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
        description: 'Heat Explorer',
        indicator: 'LST',
        lastIndicatorValue: null,
        indicatorName: 'Heat Explorer',
        eoSensor: '',
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
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
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
