import { DateTime } from 'luxon';
import availableDates from '@/config/data_dates.json';
import colormap from 'colormap';
import {
  baseLayers, overlayLayers,
} from '@/config/layers';
import shTimeFunction from '../shTimeFunction';

export const dataPath = './eodash-data/internal/';
export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/polar/catalog.json';

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

export const indicatorsDefinition = Object.freeze({
});

export const layerNameMapping = Object.freeze({
});

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

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
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

export const excludeMapTimes = {
};

export const replaceMapTimes = {
};

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'C3S Data',
        indicator: 'CDS1',
        indicatorName: 'Temperature - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.AWS_VIS_2MTEMPERATURE,
        inputData: [],
        yAxis: 'Temperature K',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_2MTEMPERATURE',
          legendUrl: 'legends/esa/AWS_VIS_2MTEMPERATURE.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_2MTEMPERATURE&CRS=CRS:84&TIME=1950-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Wind U field (C3S)',
        indicator: 'CDS3',
        indicatorName: 'Wind U field - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.AWS_VIS_WIND_U_10M,
        inputData: [],
        yAxis: 'wind',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_WIND_U_10M',
          legendUrl: 'legends/esa/AWS_VIS_WIND_U_10M.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_WIND_U_10M&CRS=CRS:84&TIME=1950-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Wind V field (C3S)',
        indicator: 'CDS4',
        indicatorName: 'Wind V field - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.AWS_VIS_WIND_V_10M,
        inputData: [],
        yAxis: 'wind',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_WIND_V_10M',
          legendUrl: 'legends/esa/AWS_VIS_WIND_U_10M.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_WIND_V_10M&CRS=CRS:84&TIME=1950-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
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
        description: 'Polartep Sentinel 1',
        indicator: 'Polartep_S1',
        indicatorName: 'Polartep',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: [
          ['20230524T04:55:52Z', 's1a-iw-grd-vh-20230524t045552-20230524t045619-048671-05da94-002_COG.tiff', 'Sentinel-1 IW VH'],
          ['20230524T17:52:21Z', 's1a-iw-grd-vv-20230524t175221-20230524t175248-048679-05dad0-001_COG.tiff', 'Sentinel-1 IW VV'],
          ['20230524T17:52:21Z', 's1a-iw-grd-vh-20230524t175221-20230524t175248-048679-05dad0-002_COG.tiff', 'Sentinel-1 IW VH'],
          ['20230524T17:53:20Z', 's1a-iw-grd-vv-20230524t175320-20230524t175344-048679-05dad0-001_COG.tiff', 'Sentinel-1 IW VV'],
          ['20230524T17:53:20Z', 's1a-iw-grd-vh-20230524t175320-20230524t175344-048679-05dad0-002_COG.tiff', 'Sentinel-1 IW VH'],
        ],
        inputData: [''],
        yAxis: '',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-12.14843 70.31497,7.18750 70.31497,7.18750 61.0953,-12.14843 61.0953,-12.14843 70.31497))').toJson(),
            }],
          },
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => `${DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd HH:mm:ss')}-${date[2]}`,
          name: 'Polartep S1',
          style: {
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['>', ['band', 1], 0],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('greys', 0, 400, 50, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
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
        description: 'Snow Grain Diameter',
        indicator: 'Snowgrain_diameter',
        indicatorName: 'Snow Grain Diameter',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: ['2023-01-01'],
        inputData: [''],
        yAxis: '',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-25.713564913020228 67.13971582287593,-11.343447725520228 67.13971582287593,-11.343447725520228 62.45603204800537,-25.713564913020228 62.45603204800537,-25.713564913020228 67.13971582287593))').toJson(),
            }],
          },
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/snow_grain_diameter_COG_3857.tif' },
          ],
          name: 'Snow Grain Diameter',
          style: {
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['>', ['band', 1], 0],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('greys', 0, 4, 50, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
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
        description: 'Snow Specific Surface Area',
        indicator: 'Snow_specific_surface_area',
        indicatorName: 'Snow Specific Surface Area',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: ['2023-01-01'],
        inputData: [''],
        yAxis: '',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-25.713564913020228 67.13971582287593,-11.343447725520228 67.13971582287593,-11.343447725520228 62.45603204800537,-25.713564913020228 62.45603204800537,-25.713564913020228 67.13971582287593))').toJson(),
            }],
          },
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/snow_specific_surface_area_COG_3857.tif' },
          ],
          name: 'Snow Specific Surface Area',
          style: {
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['>', ['band', 1], 0],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('greys', 0, 400, 50, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
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
        description: 'Sea Ice Concentration geometries',
        indicator: 'Polartep_SeaIce',
        indicatorName: 'Polartep_SeaIce',
        presetView: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-66.640625 74.30879591138098,-28.320312499999993 74.30879591138098,-28.320312499999993 59.71478693999688,-66.640625 59.71478693999688,-66.640625 74.30879591138098))').toJson(),
          }],
        },
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: [],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'GeoJSON',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/s411_seaice_concentration.geojson',
          name: 'Sea Ice Concentration detections',
          style: {
            strokeColor: 'rgba(0,0,0,0.8)',
            fillColor: 'rgba(0,0,0,0.0)',
          },
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
        description: 'Sea Ice Thickness (ICESat-2)',
        indicator: 'SITI',
        indicatorName: 'Sea Ice Thickness (ICESat-2)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W10',
        time: availableDates['IS2SITMOGR4-cog'],
        inputData: [''],
        showGlobe: true,
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 12,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?url={time}&resampling_method=bilinear&rescale=0.0,4.0&bidx=1&colormap_name=plasma',
          name: 'Sea Ice Thickness (ICESat-2)',
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/SITI-W10.png',
          mapProjection: {
            name: 'EPSG:3413',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-20 83,50 83,50 77,-20 77,-20 83))').toJson(),
            }],
          },
          projection: 'EPSG:3857',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Sea Ice Concentration Arctic (GCOM-W)',
        indicator: 'N12',
        indicatorName: 'Sea Ice Concentration Arctic (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'Arctic',
        time: getDailyDates('1978-11-01', '2023-01-30'),
        inputData: [''],
        display: {
          name: 'Sea Ice Concentration',
          legendUrl: 'legends/trilateral/World-SIC.png',
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          layers: 'SIC_N',
          minZoom: 2,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
          projection: 'EPSG:3411',
          mapProjection: {
            name: 'EPSG:3411',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs +type=crs',
            extent: [-3314763.31, -3314763.31, 3314763.31, 3314763.31],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-20 83,50 83,50 77,-20 77,-20 83))').toJson(),
            }],
          },
        },
      },
    },
  },
];
