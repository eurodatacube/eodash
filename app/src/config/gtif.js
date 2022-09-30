import { Wkt } from 'wicket';
import { shTimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { DateTime } from 'luxon';
import { latLng, latLngBounds } from 'leaflet';
import availableDates from '@/config/data_dates.json';

import {
  statisticalApiHeaders,
  statisticalApiBody,
  evalScriptsDefinitions,
  parseStatAPIResponse,
  nasaTimelapseConfig,
} from '@/helpers/customAreaObjects';

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
  minMapZoom: 8,
  maxMapZoom: 18,
  bounds: latLngBounds(latLng([0, 0]), latLng([70, 70])),
});

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless, baseLayers.S2GLC];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless];

export const overlayLayersLeftMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];
export const overlayLayersRightMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
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
};

export const indicatorsDefinition = Object.freeze({
  REP1: {
    indicator: 'Air quality',
    class: 'air',
    themes: ['atmosphere'],
    // story: '',
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

const getYearlyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy'));
    currentDate = DateTime.fromISO(currentDate).plus({ years: 1 });
  }
  return dateArray;
};

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Solar power potential',
        indicator: 'REP1',
        lastIndicatorValue: null,
        indicatorName: 'Solar power potential',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP1',
          filters: {
            height: {
              label: 'Filter for elevation',
              id: 'dem',
              band: 1,
              min: 100,
              max: 600,
            },
            slope: {
              label: 'Filter for slope (not available)',
              id: 'slope',
              band: 2,
              min: 0,
              max: 100,
            },
            grid_distance: {
              label: 'Filter for distance to nearest grid (not available)',
              id: 'grid_distance',
              band: 3,
              min: 0,
              max: 10000,
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((16 48, 16 48.3, 16.6 48.3, 16.6 48, 16 48 ))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP1',
          sources: [
            { url: 'data/gtif/data/vienna_landcover_mercator.tif' },
            { url: 'data/gtif/data/dem_10m_correct.tif' },
          ],
          style: {
            variables: {
              demMin: 100,
              demMax: 600,
            },
            color: [
              'case',
              ['between', ['band', 2], ['var', 'demMin'], ['var', 'demMax']],
              ['palette', ['/', ['band', 1], 10], [
                '#006400', '#ffbb22', '#ffff4c', '#f096ff',
                '#fa0000', '#b4b4b4', '#f0f0f0', '#0064c8',
                '#0096a0', '#00cf75', '#fae6a0',
              ]],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          // customAreaIndicator: true,
          name: 'Solar power potential',
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
        city: 'World',
        siteName: 'global',
        description: 'WSF Evolution',
        indicator: 'WSF',
        lastIndicatorValue: null,
        indicatorName: 'World Settlement Footprint (WSF) Evolution',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'WSF',
        time: getYearlyDates('1985', '2015'),
        inputData: [''],
        display: {
          baseUrl: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          name: 'WSF_Evolution',
          layers: 'WSF_Evolution',
          legendUrl: 'eodash-data/data/wsf_legend.png',
          minZoom: 1,
          maxMapZoom: 14,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
          labelFormatFunction: (date) => date,
          specialEnvTime: true,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'TROPOMI NO2',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'TROPOMI NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: availableDates['AWS_NO2-VISUALISATION'],
        inputData: [''],
        yAxis: 'Tropospheric NO2 (μmol/m2)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Tropospheric NO2',
          layers: 'AWS_NO2-VISUALISATION',
          minZoom: 1,
          legendUrl: 'eodash-data/data/no2Legend.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions['AWS_NO2-VISUALISATION'],
              'byoc-972e67a7-2ca8-4bf6-964a-11fe772e3ac2',
              'P1D',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Methane (Weekly)',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'Methane (Weekly)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        eoSensor: 'ESA TROPOMI',
        lastColorCode: null,
        aoi: null,
        aoiID: 'CH4',
        time: availableDates.AWS_CH4_WEEKLY,
        inputData: [''],
        yAxis: 'Tropospheric CH4 volume mixing ratio (ppbv)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          opacity: 1.0,
          customAreaIndicator: true,
          name: 'Air Quality (CH4) - ESA',
          layers: 'AWS_CH4_WEEKLY',
          minZoom: 1,
          legendUrl: 'eodash-data/data/ch4_legend_mixing_ratio.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_CH4_WEEKLY_DATA,
              'byoc-0ecb4a55-5ce2-4525-bdcb-a333d37d46ef',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Nitrogen Dioxide (Monthly)',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'Air Quality - OMI: Monthly NO2',
        eoSensor: 'NASA OMI',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W2',
        time: availableDates['no2-monthly'],
        inputData: [''],
        yAxis: 'NO2 [µmol/m²]',
        display: {
          customAreaIndicator: true,
          protocol: 'xyz',
          minZoom: 1,
          maxNativeZoom: 6,
          tileSize: 256,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x.png?url=s3://covid-eo-data/OMNO2d_HRM/OMI_trno2_monthly_0.10x0.10_{time}_Col3_V4.nc.tif&resampling_method=bilinear&bidx=1&rescale=0%2C108e14&color_map=reds',
          name: 'Air Quality (NASA)',
          dateFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyyMM'),
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'data/trilateral/no2Legend-monthly-nasa.png',
          areaIndicator: nasaTimelapseConfig('no2'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Nitrogen Dioxide (Yearly)',
        indicator: 'N9',
        lastIndicatorValue: null,
        indicatorName: 'Nitrogen Dioxide (Yearly)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W8',
        time: availableDates['OMI_trno2-COG'],
        inputData: [''],
        display: {
          // mosaicIndicator: true,
          // collection: 'OMI_trno2-COG',
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          minMapZoom: 1,
          maxZoom: 10,
          maxMapZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=-1e14,37e14&bidx=1&colormap_name=reds',
          name: 'NO2 OMI Annual',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'data/trilateral/no2Legend-yearly-nasa.png',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Nitrogen Dioxide (Weekly/Monthly)',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'Nitrogen Dioxide (Weekly)',
        eoSensor: 'ESA TROPOMI',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W1',
        time: availableDates['AWS_NO2-VISUALISATION'],
        inputData: [''],
        yAxis: 'Tropospheric NO2 (μmol/m2)',
        display: {
          customAreaIndicator: true,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Air Quality (NO2) - ESA',
          layers: 'AWS_NO2-VISUALISATION',
          legendUrl: 'eodash-data/data/no2Legend.png',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions['AWS_NO2-VISUALISATION'],
              'byoc-972e67a7-2ca8-4bf6-964a-11fe772e3ac2',
              'P7D',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sulfur Dioxide (OMI/Aura)',
        indicator: 'N10',
        lastIndicatorValue: null,
        indicatorName: 'Sulfur Dioxide (OMI/Aura)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W9',
        time: availableDates['OMSO2PCA-COG'],
        inputData: [''],
        display: {
          // mosaicIndicator: true,
          // collection: 'OMSO2PCA-COG',
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          minMapZoom: 1,
          maxZoom: 10,
          maxMapZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,1.0&bidx=1&colormap_name=viridis',
          name: 'SO2 OMI/Aura',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'data/trilateral/SO2OMI-Aura-legend.png',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'SO2',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sulfur Dioxide (TROPOMI)',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'Sulfur Dioxide (TROPOMI)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.AWS_VIS_SO2_DAILY_DATA,
        inputData: [],
        yAxis: 'SO2',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'SO2',
          layers: 'AWS_VIS_SO2_DAILY_DATA',
          legendUrl: 'eodash-data/data/colorbarso2.svg',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SO2_DAILY_DATA,
              'byoc-4ad9663f-d173-411d-8d28-3081d4d9e3aa',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
];
