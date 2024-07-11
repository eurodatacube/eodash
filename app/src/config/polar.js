import { DateTime } from 'luxon';
import colormap from 'colormap';
import {
  baseLayers, overlayLayers,
} from '@/config/layers';
import { Wkt } from 'wicket';
import shTimeFunction from '../shTimeFunction';

export const dataPath = './data/polar/internal/';
export const STACEndpoint = 'https://eodashcatalog.eox.at/polardashboard_s2_segmentation/polar/catalog.json';

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
const wkt = new Wkt();
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
  air: 'mdi-weather-windy',
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

const polarStereographicProjection = {
  name: 'EPSG:3411',
  def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs +type=crs',
  extent: [-4500000.00, -4500000.00, 4500000.00, 4500000.00],
};

// const polarStereographicProjectionSH = {
//   name: 'EPSG:3413',
//   def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
//   extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
// };

const polarStereoDatasetsConfigs = {
  baseLayers: arcticBaseMaps,
  overlayLayers: arcticOverlayMaps,
  mapProjection: polarStereographicProjection,
  projection: 'EPSG:4326',
  presetView: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: wkt.read('POLYGON((-20 89,50 89,50 77,-20 77,-20 89))').toJson(),
    }],
  },
};

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: '{ <a href="https://polardashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  visible: true,
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

function createTOPAZ5Config(indicatorCode) {
  const config = {
    properties: {
      indicatorObject: {
        indicator: indicatorCode,
        display: {
          ...polarStereoDatasetsConfigs,
        },
      },
    },
  };
  return config;
}

function createTOPAZ4Config(indicatorCode) {
  const config = createTOPAZ5Config(indicatorCode);
  config.properties.indicatorObject.time = getDailyDates('1991-01-01', '2022-12-31');
  return config;
}

export const excludeMapTimes = {
};

export const replaceMapTimes = {
};

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        indicator: 'Polartep_SeaIceDetection_tif_demo',
        display: [{
          name: 'Sea Ice Concentration',
          protocol: 'cog',
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/Polartep_SeaIceCharts_demo/legend.png',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/S1A_EW_GRDM_1SDH_20180325T194759_20180325T194859_021176_024676_449C.tif_SIC_3857.tif' },
          ],
          style: {
            color: [
              'case',
              ['<=', ['band', 1], 0],
              ['color', 0, 0, 0, 0],
              ['<=', ['band', 1], 1],
              ['color', 150, 200, 255, 1],
              ['<=', ['band', 1], 3],
              ['color', 140, 255, 160, 1],
              ['<=', ['band', 1], 6],
              ['color', 255, 255, 0, 1],
              ['<=', ['band', 1], 8],
              ['color', 255, 125, 7, 1],
              ['<=', ['band', 1], 10],
              ['color', 255, 0, 0, 1],
              ['color', 0, 0, 0, 0],
            ],
          },
        }, {
          name: 'Sea Ice Stage of Development',
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/S1A_EW_GRDM_1SDH_20180325T194759_20180325T194859_021176_024676_449C.tif_SOD_3857.tif' },
          ],
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              [
                'color', 255, 255, 255, 1,
              ],
              ['==', ['band', 1], 2],
              [
                'color', 201, 98, 222, 1,
              ],
              ['==', ['band', 1], 3],
              [
                'color', 124, 219, 103, 1,
              ],
              ['==', ['band', 1], 4],
              [
                'color', 42, 230, 199, 1,
              ],
              ['==', ['band', 1], 5],
              [
                'color', 14, 51, 236, 1,
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        }, {
          name: 'Sea Ice floe',
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/S1A_EW_GRDM_1SDH_20180325T194759_20180325T194859_021176_024676_449C.tif_FLOE_3857.tif' },
          ],
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              [
                'color', 255, 255, 255, 1,
              ],
              ['==', ['band', 1], 2],
              [
                'color', 74, 36, 210, 1,
              ],
              ['==', ['band', 1], 3],
              [
                'color', 20, 171, 213, 1,
              ],
              ['==', ['band', 1], 4],
              [
                'color', 38, 233, 81, 1,
              ],
              ['==', ['band', 1], 5],
              [
                'color', 229, 66, 191, 1,
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        }],
      },
    },
  },
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
        indicator: 'Polartep_S1_dedl_demo',
        time: [
          ['20230524T17:52:21Z', 's1a-iw-grd-vv-20230524t175221-20230524t175248-048679-05dad0-001_COG.tiff', 'Sentinel-1 IW VV'],
          ['20230524T17:52:21Z', 's1a-iw-grd-vh-20230524t175221-20230524t175248-048679-05dad0-002_COG.tiff', 'Sentinel-1 IW VH'],
        ],
        display: {
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => `${DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd HH:mm:ss')} -${date[2]}`,
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
        indicator: 'Polartep_S2_segmentation_demo',
        display: [{
          protocol: 'cog',
          name: 'Sentinel-2 source image',
          legendUrl: null,
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/input-cog.tif' },
          ],
          normalize: true,
        }, {
          protocol: 'cog',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/inference-cog.tif' },
          ],
          opacity: 0.7,
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/Polartep_S2_segmentation_demo/cm_legend.png',
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              [
                'color', 255, 255, 255, 1,
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Polartep_RCM_demo',
        time: ['2021-05-01', '2021-05-04', '2021-05-05', '2021-05-06', '2021-05-08', '2021-05-09', '2021-05-10', '2021-05-11', '2021-05-12', '2021-05-13', '2021-05-17', '2021-05-18', '2021-05-22', '2021-05-23', '2021-05-25'],
        display: [{
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdPolar}`,
          layers: '1-HH-LINEAR-SIGMA0',
          name: 'HH Linear Sigma0',
        }, {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdPolar}`,
          layers: '3-HV-LINEAR-SIGMA0',
          name: 'HV Linear Sigma0',
        }, {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdPolar}`,
          layers: '5-HH-HV-RATIO-RGB-SIGMA0',
          name: 'HH HV Ratio RGB Sigma0',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Polartep_SeaIceCharts_demo',
        display: {
          baseUrl: null,
          layerControlHide: true,
          features: {
            url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/test_data_polartep/cape_farewell_{featuresTime}.geojson',
            name: 'Sea Ice Charts',
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/Polartep_SeaIceCharts_demo/legend.png',
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
            allowedParameters: ['CT'],
            flatStyle: [
              {
                style: {
                  'fill-color': [
                    'case',
                    ['<', ['get', 'CT'], 0],
                    'rgba(0,0,0,0)',
                    ['<', ['get', 'CT'], 10],
                    'rgba(150,200,255,1)',
                    ['<=', ['get', 'CT'], 30],
                    'rgba(140,255,160,1)',
                    ['<=', ['get', 'CT'], 60],
                    'rgba(255,255,0,1)',
                    ['<=', ['get', 'CT'], 80],
                    'rgba(255,125,7,1)',
                    ['<=', ['get', 'CT'], 100],
                    'rgba(255,0,0,1)',
                    'rgba(0,0,0,0)',
                  ],
                  'stroke-color': 'rgba(0,0,0,0)',
                },
              },
            ],
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
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WGS1984Quad/{z-1}/{x}/{y}?&resampling_method=nearest&bidx=1&colormap_name=plasma&rescale=0.0,4.0&{time}',
          ...polarStereoDatasetsConfigs,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'N12_1_sea_ice_concentration_arctic',
        time: getDailyDates('1978-11-01', '2024-06-30'),
        display: {
          ...polarStereoDatasetsConfigs,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
          projection: 'EPSG:3411',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: '4D_Greenland_Meltmap',
        time: getDailyDates('2007-01-02', '2021-12-28'),
        display: {
          ...polarStereoDatasetsConfigs,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  createTOPAZ4Config('TOPAZ4_P1D_SICONC'),
  createTOPAZ4Config('TOPAZ4_P1D_SISNTHICK'),
  createTOPAZ4Config('TOPAZ4_P1D_SITHICK'),
  createTOPAZ4Config('TOPAZ4_P1D_VXO'),
  createTOPAZ4Config('TOPAZ4_P1D_VXSI'),
  createTOPAZ4Config('TOPAZ4_P1D_VYO'),
  createTOPAZ4Config('TOPAZ4_P1D_VYSI'),
  createTOPAZ5Config('TOPAZ5_P1D_SIAGE'),
  createTOPAZ5Config('TOPAZ5_P1D_SICONC'),
  createTOPAZ5Config('TOPAZ5_P1D_SISNTHICK'),
  createTOPAZ5Config('TOPAZ5_P1D_SITHICK'),
  createTOPAZ5Config('TOPAZ5_P1D_VXO'),
  createTOPAZ5Config('TOPAZ5_P1D_VXSI'),
  createTOPAZ5Config('TOPAZ5_P1D_VYO'),
  createTOPAZ5Config('TOPAZ5_P1D_VYSI'),
  createTOPAZ5Config('4D_Greenland_Melt_Season_End'),
  createTOPAZ5Config('4D_Greenland_Melt_Duration'),
  createTOPAZ5Config('4D_Greenland_Melt_Onset'),
];
