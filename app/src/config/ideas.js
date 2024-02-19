import GeoJSON from 'ol/format/GeoJSON';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';
import { Wkt } from 'wicket';

import { baseLayers, overlayLayers, getColorStops } from '@/config/layers';
import { buildOverpassAPIQueryFromParams } from '@/helpers/customAreaObjects';

const wkt = new Wkt();
const osmtogeojson = require('osmtogeojson');

const geojsonFormat = new GeoJSON();
export const indicatorsDefinition = Object.freeze({
  IND4_1: {
    themes: ['economy'],
    story: '/eodash-data/stories/IND4_1',
  },
  IND1_1: {
    themes: ['economy'],
    story: '/eodash-data/stories/IND1_1',
  },
  IND2_1: {
    themes: ['economy'],
    story: '/eodash-data/stories/IND2_1',
  },
});

export const dataPath = './eodash-data/internal/';
export const dataEndpoints = [];

export const defaultLayersDisplay = {
  dateFormatFunction: (date) => date,
  labelFormatFunction: (date) => date,
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

function overpassApiQueryTags(queryParams) {
  return {
    drawnAreaLimitExtent: true,
    areaFormatFunction: (area) => {
      // overpass api expects lat,lon
      const extent = geojsonFormat.readGeometry(area).getExtent();
      return { area: [extent[1], extent[0], extent[3], extent[2]] };
    },
    queryParams,
    customFormatFunction: buildOverpassAPIQueryFromParams,
    url: 'https://overpass-api.de/api/interpreter?data={query}',
    requestMethod: 'GET',
    callbackFunction: (responseJson) => {
      // custom handling of overpass timeout raise alert and throw an exception
      if (responseJson?.remark && responseJson.remark.includes('error')) {
        window.dispatchEvent(new CustomEvent('custom-alert-message', { detail: `Request to Overpass API timeouted. Please select a smaller area. Original error: ${responseJson.remark}` }));
        throw responseJson.remark;
      }
      const ftrColl = osmtogeojson(responseJson, {
        flatProperties: true,
      });
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
          overlayLayers: [
            overlayLayers.powerOpenInfrastructure,
            {
              ...overlayLayers.eoxOverlay, visible: true,
            },
          ],
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS4_flood_risk/legend_flood_risk.png',
          wmsVariables: {
            sourceLayer: 'Indicator 4: Flood risk',
            title: 'Model configuration',
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
              time: {
                description: 'Model year',
                selected: '2150',
                items: [
                  {
                    id: '2020',
                    description: '2020',
                  },
                  {
                    id: '2040',
                    description: '2040',
                  },
                  {
                    id: '2060',
                    description: '2060',
                  },
                  {
                    id: '2080',
                    description: '2080',
                  },
                  {
                    id: '2100',
                    description: '2100',
                  },
                  {
                    id: '2120',
                    description: '2120',
                  },
                  {
                    id: '2150',
                    description: '2150',
                  },
                ],
              },
            },
          },
          disableTimeSelection: true,
          specialEnvScenario4: true,
          baseUrl: 'https://ideas.adamplatform.eu/cgi-bin/mapserv/',
          layers: 'INUNDATION',
          crossOrigin: null,
          name: 'Indicator 4: Flood risk',
          customAreaFeatures: true,
          features: {
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS4_flood_risk/legend_osm_hospitals_schools.png',
            name: 'OpenStreetMap hospitals, schools',
            styleFunction: (feature) => {
              const amenity = feature.get('amenity');
              const radius = 4;
              const fill = new Fill({
                color: 'rgba(255, 255, 255, 0.25)',
              });
              const stroke = new Stroke({
                width: 3,
                // hospital vs schools
                color: amenity === 'hospital' ? '#003247' : '#7d0240',
              });
              const style = new Style({
                image: new Circle({
                  fill,
                  stroke,
                  radius,
                }),
                fill,
                stroke,
              });
              return style;
            },
            allowedParameters: ['name', 'amenity'],
            ...overpassApiQueryTags([
              { key: 'amenity', value: 'school' },
              { key: 'amenity', value: 'hospital' }]),
          },
        },
      },
    },
  },
  // {
  //   properties: {
  //     indicatorObject: {
  //       dataLoadFinished: true,
  //       country: 'all',
  //       city: 'Austria',
  //       siteName: 'global',
  //       description: 'DEM TEST',
  //       navigationDescription: 'DEM TEST',
  //       indicator: 'AQ5',
  //       lastIndicatorValue: null,
  //       indicatorName: 'Nitrogen Dioxide (NO2)',
  //       highlights: [
  //         {
  //           name: 'Austria overview',
  //           location: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
  //         },
  //       ],
  //       minesweeperOptions: {
  //         // Board dimensions in number of hex cells
  //         size: 30,
  //         selectedLocationIndex: 0,
  //         geotiff: {
  //           projection: 'EPSG:4326',
  //           url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/ideas_data/Copernicus_DSM_30_N47_00_E014_00_DEM_COG.tif',
  //         },
  //         locations: [{
  //           name: 'Austria tile',
  //           bbox: [14.0, 47.0, 15.0, 48.0],
  //           isMineCondition: (val) => val >= 1500,
  //         }],
  //       },
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [],
  //       },
  //       lastColorCode: null,
  //       aoi: null,
  //       aoiID: 'TEST',
  //       time: [],
  //       inputData: [''],
  //       yAxis: '',
  //       display: {
  //         protocol: 'cog',
  //         id: 'AQ5',
  //         sources: [
  //           { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/ideas_data/Copernicus_DSM_30_N47_00_E014_00_DEM_COG.tif' },
  //         ],
  //         style: {
  //           variables: {
  //             varMin: 0,
  //             varMax: 1500,
  //           },
  //           color: [
  //             'case',
  //             ['between', ['band', 1], 1, 1500],
  //             [
  //               'interpolate',
  //               ['linear'],
  //               normalize(['band', 1], 'varMin', 'varMax'),
  //               ...getColorStops('viridis', 0, 1, 64, false),
  //             ],
  //             ['color', 0, 0, 0, 0],
  //           ],
  //         },
  //         name: 'DEM',
  //       },
  //     },
  //   },
  // },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: '',
        indicator: 'IND1_1',
        indicatorName: 'Indicator 1: Air pollution',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON ((-0.3259722 42.3334722, -0.3259722 45.0445833, 4.84625 45.0445833, 4.84625 42.3334722, -0.3259722 42.3334722))').toJson(),
          }],
        },
        aoiID: 'World',
        time: [''],
        inputData: [''],
        cogFilters: {
          sourceLayer: 'IND1_1',
          filters: {
            // hospitals: {
            //   display: true,
            //   label: 'Number of hospitals or clinics',
            //   id: 'hospitals',
            //   // dataInfo: 'WindPowerDensity',
            //   min: 0,
            //   max: 3,
            //   step: 0.1,
            //   header: true,
            //   range: [0, 3],
            // },
            access_to_healthcare: {
              display: true,
              label: 'Distance to nearest hospital or clinic',
              id: 'access_to_healthcare',
              // dataInfo: 'Elevation',
              min: 0,
              max: 50,
              step: 0.5,
              range: [0, 50],
            },
            hopi: {
              display: true,
              label: 'Health risk due to air pollution (3: high risk)',
              id: 'hopi',
              // dataInfo: 'Slope',
              min: 0,
              max: 3,
              step: 0.25,
              range: [0, 2],
            },
            air_pollution: {
              display: true,
              label: 'Number of days where air pollution exceeded WHO threshold between 2021 and 2023',
              id: 'air_pollution',
              // dataInfo: 'Slope',
              min: 10,
              max: 328,
              step: 5,
              range: [10, 328],
            },
            vulnerable_population: {
              display: true,
              label: 'Number of people of age < 5 or > 60.',
              id: 'vulnerable_population',
              // dataInfo: 'Slope',
              min: 0,
              max: 320,
              step: 5,
              range: [0, 320],
            },
          },
        },
        display: {
          id: 'IND1_1',
          protocol: 'cog',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/air_pollution_v0_hopi_occitanie_OVR.tif' },
          ],
          overlayLayers: [
            {
              // dissolved individual bands as layers
              protocol: 'cog',
              sources: [
                { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/air_pollution_v0_hopi_occitanie_OVR.tif' },
              ],
              name: 'Indicator 1: Number of hospitals or clinics',
              visible: false,
              style: {
                color: [
                  'case',
                  ['between', ['band', 1], 0, 3],
                  [
                    'interpolate',
                    ['linear'],
                    ['band', 1],
                    ...getColorStops('hot', 0, 3, 40, true),
                  ],
                  [
                    'color', 0, 0, 0, 0,
                  ],
                ],
              },
            }, {
              // dissolved individual bands as layers
              protocol: 'cog',
              sources: [
                { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/air_pollution_v0_hopi_occitanie_OVR.tif' },
              ],
              name: 'Indicator 1: Distance to nearest hospital or clinic',
              visible: false,
              style: {
                color: [
                  'case',
                  ['between', ['band', 2], 0, 50],
                  [
                    'interpolate',
                    ['linear'],
                    ['band', 2],
                    ...getColorStops('hot', 0, 50, 40, true),
                  ],
                  [
                    'color', 0, 0, 0, 0,
                  ],
                ],
              },
            }, {
              // dissolved individual bands as layers
              protocol: 'cog',
              sources: [
                { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/air_pollution_v0_hopi_occitanie_OVR.tif' },
              ],
              name: 'Indicator 1: Number of days where air pollution exceeded WHO threshold between 2021 and 2023',
              visible: false,
              style: {
                color: [
                  'case',
                  ['between', ['band', 4], 0, 328],
                  [
                    'interpolate',
                    ['linear'],
                    ['band', 4],
                    ...getColorStops('hot', 0, 328, 40, true),
                  ],
                  [
                    'color', 0, 0, 0, 0,
                  ],
                ],
              },
            }, {
              // dissolved individual bands as layers
              protocol: 'cog',
              sources: [
                { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/air_pollution_v0_hopi_occitanie_OVR.tif' },
              ],
              name: 'Indicator 1: Number of people of age < 5 or > 60',
              visible: false,
              style: {
                color: [
                  'case',
                  ['between', ['band', 5], 0, 320],
                  [
                    'interpolate',
                    ['linear'],
                    ['band', 5],
                    ...getColorStops('hot', 0, 320, 40, true),
                  ],
                  [
                    'color', 0, 0, 0, 0,
                  ],
                ],
              },
            },
          ],
          style: {
            variables: {
              // hospitalsMin: 0,
              // hospitalsMax: 3,
              access_to_healthcareMin: 0,
              access_to_healthcareMax: 50,
              hopiMin: 0,
              hopiMax: 3,
              air_pollutionMin: 10,
              air_pollutionMax: 328,
              vulnerable_populationMin: 0,
              vulnerable_populationMax: 320,
            },
            color: [
              'case',
              [
                'all',
                // ['between', ['band', 1], ['var', 'hospitalsMin'], ['var', 'hospitalsMax']],
                ['between', ['band', 2], ['var', 'access_to_healthcareMin'], ['var', 'access_to_healthcareMax']],
                ['between', ['band', 3], ['var', 'hopiMin'], ['var', 'hopiMax']],
                ['between', ['band', 4], ['var', 'air_pollutionMin'], ['var', 'air_pollutionMax']],
                ['between', ['band', 5], ['var', 'vulnerable_populationMin'], ['var', 'vulnerable_populationMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 3],
                ...getColorStops('hot', 0, 3, 40, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Health-Oriented Pollution Index',
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
        description: '',
        indicator: 'IND2_1',
        indicatorName: 'Indicator 2: Wildlife',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON ((-5.800781 41.409776, -5.800781 51.536086, 10.546875 51.536086, 10.546875 41.409776, -5.800781 41.409776))').toJson(),
          }],
        },
        aoiID: 'World',
        time: [],
        inputData: [''],
        cogFilters: {
          sourceLayer: 'IND2_1',
          filters: {
            wildlife: {
              display: true,
              label: 'Wildlife biodiversity',
              id: 'wildlife',
              // dataInfo: 'WindPowerDensity',
              min: 0.25,
              max: 5,
              step: 0.25,
              header: true,
              range: [0.25, 5],
            },
            biodiversity_connectivity_quintile: {
              display: true,
              label: 'Area connectivity indicator',
              id: 'biodiversity_connectivity_quintile',
              // dataInfo: 'Elevation',
              min: -1,
              max: 5,
              step: 0.25,
              range: [-1, 5],
            },
            species_count_quintile: {
              display: true,
              label: 'Categorized species density',
              id: 'species_count_quintile',
              // dataInfo: 'Slope',
              min: 0,
              max: 5,
              step: 0.25,
              range: [0, 5],
            },
            vegetation: {
              display: true,
              label: 'Vegetation health indicator',
              id: 'vegetation',
              // dataInfo: 'Slope',
              min: 0,
              max: 5,
              step: 0.25,
              range: [0, 5],
            },
          },
        },
        display: {
          protocol: 'cog',
          id: 'IND2_1',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG.tif' },
          ],
          name: 'Indicator 2: Wildlife',
          overlayLayers: [{
            // dissolved individual bands as layers
            protocol: 'cog',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG.tif' },
            ],
            name: 'Indicator 2: Biodiversity Connectivity Quintile',
            visible: false,
            style: {
              color: [
                'case',
                ['between', ['band', 2], 0, 5],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 2],
                  ...getColorStops('chlorophyll', 0, 5, 27, true),
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
              ],
            },
          }, {
            // dissolved individual bands as layers
            protocol: 'cog',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG.tif' },
            ],
            name: 'Indicator 2: Categorized species density',
            visible: false,
            style: {
              color: [
                'case',
                ['between', ['band', 3], 0, 5],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 3],
                  ...getColorStops('chlorophyll', 0, 5, 27, true),
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
              ],
            },
          }, {
            // dissolved individual bands as layers
            protocol: 'cog',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG.tif' },
            ],
            name: 'Indicator 2: Vegetation health indicator',
            visible: false,
            style: {
              color: [
                'case',
                ['between', ['band', 4], 0, 5],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 4],
                  ...getColorStops('chlorophyll', 0, 5, 27, true),
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
              ],
            },
          }],
          style: {
            variables: {
              wildlifeMin: 0.25,
              wildlifeMax: 5,
              biodiversity_connectivity_quintileMin: -1,
              biodiversity_connectivity_quintileMax: 5,
              species_count_quintileMin: 0,
              species_count_quintileMax: 5,
              vegetationMin: 0,
              vegetationMax: 5,
            },
            color: [
              'case',
              [
                'all',
                ['between', ['band', 1], ['var', 'wildlifeMin'], ['var', 'wildlifeMax']],
                ['between', ['band', 2], ['var', 'biodiversity_connectivity_quintileMin'], ['var', 'biodiversity_connectivity_quintileMax']],
                ['between', ['band', 3], ['var', 'species_count_quintileMin'], ['var', 'species_count_quintileMax']],
                ['between', ['band', 4], ['var', 'vegetationMin'], ['var', 'vegetationMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('chlorophyll', 0, 5, 27, true),
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
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: '',
        indicator: 'IND2_1',
        indicatorName: 'Wildlife Minesweeper',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'Game',
        time: [],
        inputData: [''],
        display: {
          minesweeperOptions: {
            // Board dimensions in number of hex cells
            size: 20,
            geotiff: {
              projection: 'EPSG:4326',
              url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG_b1_t_final.tif',
            },
            selectedLocationIndex: 1,
            locations: [{
              name: 'Dordogne Valley',
              bbox: [-1.3289, 44.4393, 1.944, 45.6092],
              isMineCondition: (val) => val >= 3,
            }, {
              name: 'Atlantic Pyrenees / Landes',
              bbox: [0.3274, 43.2202, 1.8998, 44.4389],
              isMineCondition: (val) => val >= 3,
            }, {
              name: 'Jura / Savoie',
              bbox: [4.7013, 45.7953, 7.0053, 47.036],
              isMineCondition: (val) => val >= 3,
            }, {
              name: 'Cote d Azur / Southern Alps',
              bbox: [5.046, 42.9342, 7.2733, 44.1586],
              isMineCondition: (val) => val >= 3,
            }, {
              name: 'Bretagne',
              bbox: [-5.0509, 47.22481, -1.6697, 49.0046],
              isMineCondition: (val) => val >= 3,
            }, {
              name: 'Paris',
              bbox: [1.2304, 48.1871, 3.8054, 49.4386],
              isMineCondition: (val) => val >= 3,
            }, {
              name: 'Ardennes',
              bbox: [3.6041, 48.8881, 6.179, 50.1222],
              isMineCondition: (val) => val >= 3,
            }],
          },
          protocol: 'cog',
          id: 'IND2_1',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG_b1_t_final.tif' },
          ],
          name: 'Indicator 2: Wildlife Game Enabled',
          style: {
            color: [
              'case',
              ['between', ['band', 1], 1, 5],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('chlorophyll', 1, 5, 27, true),
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
];
