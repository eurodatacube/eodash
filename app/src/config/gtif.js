import { Wkt } from 'wicket';
import { shTimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { DateTime } from 'luxon';
import { latLng, latLngBounds } from 'leaflet';
import colormap from 'colormap';
import availableDates from '@/config/data_dates.json';

import {
  statisticalApiHeaders,
  statisticalApiBody,
  evalScriptsDefinitions,
  parseStatAPIResponse,
  nasaTimelapseConfig,
} from '@/helpers/customAreaObjects';

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
  bounds: latLngBounds(latLng([46, 9]), latLng([49.5, 18])),
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
  name: 'NUTS L0 - Austria',
  url: 'data/gtif/data/AT_NUTS_L0.geojson',
  maxZoom: 7.5,
}, {
  ...nutsStyle,
  name: 'NUTS L1 - Austria',
  url: 'data/gtif/data/AT_NUTS_L1.geojson',
  minZoom: 7.5,
  maxZoom: 8.5,
}, {
  ...nutsStyle,
  name: 'NUTS L2 - Austria',
  url: 'data/gtif/data/AT_NUTS_L2.geojson',
  minZoom: 8.5,
  maxZoom: 9.5,
}, {
  ...nutsStyle,
  name: 'NUTS L3 - Austria',
  url: 'data/gtif/data/AT_NUTS_L3.geojson',
  minZoom: 9.5,
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
  REP2: {
    indicator: 'Air quality',
    class: 'air',
    themes: ['atmosphere'],
    // story: '',
  },
  SOL1: {
    indicator: 'Air quality',
    class: 'air',
    themes: ['atmosphere'],
  },
  LST: {
    indicator: 'Low surface temperature',
    class: 'air',
    themes: ['atmosphere'],
  },
  AQ: {
    indicator: 'Low surface temperature',
    class: 'air',
    themes: ['atmosphere'],
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
        city: 'Austria',
        siteName: 'global',
        description: 'Air quality',
        indicator: 'AQ',
        lastIndicatorValue: null,
        indicatorName: 'Air quality',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: ['2022-09-16', '2022-09-17'],
        inputData: [''],
        yAxis: '',
        vectorStyles: {
          sourceLayer: 'air_quality_AT',
          items: [
            {
              id: 'PM10',
              description: 'Particulate Matter < 10µm',
            },
            {
              id: 'PM25',
              description: 'Particulate Matter < 25µm',
            },
            {
              id: 'NO2',
              description: 'Nitrogen Dioxide',
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
          protocol: 'vectorgeojson',
          selectedStyleLayer: 'PM10',
          styleFile: 'data/gtif/data/air_quality_at.json',
          id: 'air_quality_AT',
          name: 'Air quality',
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
        description: 'Solar power potential',
        indicator: 'SOL1',
        lastIndicatorValue: null,
        indicatorName: 'Solar power potential',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Innsbruck',
        time: [],
        inputData: [''],
        yAxis: '',
        vectorStyles: {
          sourceLayer: 'solar_potential_innsbruck',
          items: [
            {
              id: 'PVExisting',
              description: 'Existing PV Panels',
            },
            {
              id: 'GRExisting',
              description: 'Existing green roofs',
            },
            {
              id: 'PVEPPMwhHP',
              description: 'Total electric power production potential - High performance',
            },
            {
              id: 'PVEPPMwhRP',
              description: 'Total electric power production potential - Regular performance',
            },
            {
              id: 'PVEPPMwhLP',
              description: 'Total electric power production potential - Low performance',
            },
            {
              id: 'GRImpScore',
              description: 'Green roof impact score',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
            }],
          },
          protocol: 'vectortile',
          styleFile: 'data/gtif/data/rooftops_style.json',
          selectedStyleLayer: 'PVExisting',
          id: 'solar_potential_innsbruck',
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
        city: 'Austria',
        siteName: 'global',
        description: 'Power density',
        indicator: 'REP1',
        lastIndicatorValue: null,
        indicatorName: 'Power density',
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
            /*
            powerdensity: {
              label: 'Filter for power density',
              id: 'powerdensity',
              min: 0,
              max: 16000,
            },
            */
            wind: {
              label: 'Filter for wind speeds',
              id: 'wind',
              min: 0,
              max: 23,
            },
            slope: {
              label: 'Filter power line high',
              id: 'PowerLineHigh',
              min: 0,
              max: 162390,
            },
            rugedeness: {
              label: 'Filter for rugedeness index',
              id: 'rugedeness',
              min: 0,
              max: 0.78,
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
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected/PowerDensity_Austria_3857_COG.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected/WindSpeed_Austria_3857_COG.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected/PowerLineHigh_EucDist_Austria_3857_COG.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected/RuggednessIndex_Austria_3857_COG.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected/WSF_EucDist_Austria_3857_COG.tif' },
          ],
          style: {
            variables: {
              windMin: 0,
              windMax: 23,
              PowerLineHighMin: 0,
              PowerLineHighMax: 162390,
              rugedenessMin: 0,
              rugedenessMax: 0.78,
            },
            color: [
              'case',
              [
                'all',
                ['between', ['band', 2], ['var', 'windMin'], ['var', 'windMax']],
                ['between', ['band', 3], ['var', 'PowerLineHighMin'], ['var', 'PowerLineHighMax']],
                ['between', ['band', 4], ['var', 'rugedenessMin'], ['var', 'rugedenessMax']],
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
          /*
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
          */
          // customAreaIndicator: true,
          name: 'Power density',
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
        description: 'Low surface temperature',
        indicator: 'LST',
        lastIndicatorValue: null,
        indicatorName: 'Low surface temperature',
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
          maxNativeZoom: 6,
          tileSize: 256,
          opacity: 1,
          url: 'https://tileserver.geoville.com/heatMap/LST_aggregated_reproc_filt_clipped_AT_buffered/%7Bz%7D/%7Bx%7D/%7By%7D.png/LST_aggregated_reproc_filt_clipped_AT_buffered/{z}/{x}/{y}.png',
          name: 'Low surface temperature',
          // legendUrl: 'data/trilateral/no2Legend-monthly-nasa.png',
        },
      },
    },
  },
  /*
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
  */
  /*
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
  */
  /*
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
  */
  /*
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
  */
];
