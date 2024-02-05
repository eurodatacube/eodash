import { DateTime } from 'luxon';
import colormap from 'colormap';
import {
  baseLayers, overlayLayers,
} from '@/config/layers';
import shTimeFunction from '../shTimeFunction';

export const dataPath = './data/polar/internal/';
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
  cryosphere: 'mdi-snowflake',
  atmosphere: 'mdi-weather-windy',
  oceans: 'mdi-water',
});

export const mapDefaults = Object.freeze({
  bounds: [-170, -70, 170, 70],
});

const arcticBaseMaps = [
  {
    ...baseLayers.terrainLightStereoNorth,
    visible: true,
  },
  baseLayers.cloudless,
  baseLayers.eoxosm,
];
const arcticOverlayMaps = [];

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
        indicator: 'Polartep_S1_demo',
        time: [
          ['20230524T04:55:52Z', 's1a-iw-grd-vh-20230524t045552-20230524t045619-048671-05da94-002_COG.tiff', 'Sentinel-1 IW VH'],
          ['20230524T17:52:21Z', 's1a-iw-grd-vv-20230524t175221-20230524t175248-048679-05dad0-001_COG.tiff', 'Sentinel-1 IW VV'],
          ['20230524T17:52:21Z', 's1a-iw-grd-vh-20230524t175221-20230524t175248-048679-05dad0-002_COG.tiff', 'Sentinel-1 IW VH'],
          ['20230524T17:53:20Z', 's1a-iw-grd-vv-20230524t175320-20230524t175344-048679-05dad0-001_COG.tiff', 'Sentinel-1 IW VV'],
          ['20230524T17:53:20Z', 's1a-iw-grd-vh-20230524t175320-20230524t175344-048679-05dad0-002_COG.tiff', 'Sentinel-1 IW VH'],
        ],
        display: {
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => `${DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd HH:mm:ss')}-${date[2]}`,
          style: {
            color: [
              'case',
              ['>', ['band', 1], 0],
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
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Polartep_Snowgrain_diameter_demo',
        time: [],
        display: {
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/snow_grain_diameter_COG_3857.tif' },
          ],
          style: {
            color: [
              'case',
              ['>', ['band', 1], 0],
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
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Polartep_Snow_specific_surface_area_demo',
        time: [],
        display: {
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/snow_specific_surface_area_COG_3857.tif' },
          ],
          style: {
            color: [
              'case',
              ['>', ['band', 1], 0],
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
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Polartep_SeaIce_demo',
        display: {
          protocol: 'GeoJSON',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/s411_seaice_concentration.geojson',
          name: 'Sea Ice Concentration detections',
          style: {
            strokeColor: 'rgba(0,0,0,0.8)',
            fillColor: 'rgba(0,0,0,0.0)',
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'SITI',
        display: {
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          mapProjection: {
            name: 'EPSG:3413',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'N12_1_sea_ice_concentration_arctic',
        time: getDailyDates('1978-11-01', '2023-12-31'),
        display: {
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
          projection: 'EPSG:3411',
          mapProjection: {
            name: 'EPSG:3411',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs +type=crs',
            extent: [-3314763.31, -3314763.31, 3314763.31, 3314763.31],
          },
        },
      },
    },
  },
];
