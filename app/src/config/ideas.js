import GeoJSON from 'ol/format/GeoJSON';
import { DateTime } from 'luxon';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';
import { Wkt } from 'wicket';

import { baseLayers, overlayLayers, getColorStops } from '@/config/layers';

const wkt = new Wkt();
const osmtogeojson = require('osmtogeojson');

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
  IND3_1: {
    themes: ['economy'],
    story: '/eodash-data/stories/IND3_1',
  },
});

export const dataPath = './eodash-data/internal/';
export const dataEndpoints = [];

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdIdeas}`,
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

function buildOverpassAPIQueryFromParams(urlInit, mergedConfig) {
  let searchPartOfQuery = '';
  mergedConfig.features.featureQueryParams.items.forEach((params) => {
    if (params.selected === true) {
      const types = params.types || ['node', 'way', 'relation'];
      types.forEach((type) => {
        let booleanAndStaticParams = '';
        if (params.staticParams) {
          params.staticParams.forEach((staticParam) => {
            booleanAndStaticParams += `["${staticParam.key}"="${staticParam.value}"]`;
          });
        }
        searchPartOfQuery += `${type}["${params.key}"="${params.value}"]${booleanAndStaticParams}({area});`;
      });
    }
  });
  const query = `[out:json][timeout:15];(${searchPartOfQuery});out body;>;out skel qt;`;
  const urlEvaluated = urlInit.replace('{query}', query);
  return urlEvaluated;
}

function overpassApiQueryTags(featureQueryParams) {
  return {
    drawnAreaLimitExtent: true,
    areaFormatFunction: (area) => {
      // overpass api expects lat,lon
      const extent = geojsonFormat.readGeometry(area).getExtent();
      return { area: [extent[1], extent[0], extent[3], extent[2]] };
    },
    featureQueryParams: {
      items: featureQueryParams,
      title: 'OSM Overpass API query parameters',
    },
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

const ghsPopulationLegend = `Legend: <br>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #ffffff"></div>
  <div>
    no data (transparent)
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #E7E1EF"></div>
  <div>
    0 - 5
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #D4B9DA"></div>
  <div>
    6 - 20
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #C994C7"></div>
  <div>
    21 - 100
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #DF65B0"></div>
  <div>
    101 - 300
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #E7298A"></div>
  <div>
    301 - 500
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #CE1256"></div>
  <div>
    501 - 1,000
  </div>
  <div style="width:15px;height:15px;margin-right:5px;float:left;background-color: #91003F"></div>
  <div>
    1,000 - Max
  </div>`;

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
            {
              ...defaultLayersDisplay,
              name: 'WorldCereal - Maize',
              layers: 'MAIZE_WORLDCEREAL',
              visible: false,
            },
            {
              ...defaultLayersDisplay,
              name: 'WorldCereal - Winter Cereals',
              layers: 'WINTER_WORLDCEREAL',
              visible: false,
            },
            {
              ...defaultLayersDisplay,
              name: 'WorldCereal - Spring Cereals',
              layers: 'SPRING_WORLDCEREAL',
              visible: false,
            },
            {
              ...defaultLayersDisplay,
              name: 'GHS World population 2020',
              layers: 'GHS_POP_E2020',
              visible: false,
              layerAdditionalDescription: ghsPopulationLegend,
            },
            {
              ...defaultLayersDisplay,
              name: 'GHS World population 2025',
              layers: 'GHS_POP_E2025',
              visible: false,
              layerAdditionalDescription: ghsPopulationLegend,
            },
            {
              ...defaultLayersDisplay,
              name: 'GHS World population 2030',
              layers: 'GHS_POP_E2030',
              visible: false,
              layerAdditionalDescription: ghsPopulationLegend,
            },
            {
              ...defaultLayersDisplay,
              visible: false,
              baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}?TIME=2020-01-01`,
              name: 'GHS built up area 2020',
              layers: 'GHS_BUILT_S',
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/GHS-BUILT-S-R2023A/cm_legend.png',
            },
            {
              ...defaultLayersDisplay,
              visible: false,
              baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}?TIME=2025-01-01`,
              name: 'GHS built up area 2025',
              layers: 'GHS_BUILT_S',
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/GHS-BUILT-S-R2023A/cm_legend.png',
            },
            {
              ...defaultLayersDisplay,
              visible: false,
              baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}?TIME=2030-01-01`,
              name: 'GHS built up area 2030',
              layers: 'GHS_BUILT_S',
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/GHS-BUILT-S-R2023A/cm_legend.png',
            },
          ],
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS4_flood_risk/legend_flood_risk.png',
          wmsVariables: {
            sourceLayer: 'Indicator 4: Flood risk',
            title: 'Model configuration',
            variables: {
              ssp: {
                dataInfo: 'i4_ssp',
                description: 'Shared Socioeconomic Pathway scenario',
                selected: 'ssp119',
                items: [
                  {
                    id: 'ssp119',
                    description: 'Scenario 119',
                  },
                  {
                    id: 'ssp126',
                    description: 'Scenario 126',
                  },
                  {
                    id: 'ssp245',
                    description: 'Scenario 245',
                  },
                  {
                    id: 'ssp370',
                    description: 'Scenario 370',
                  },
                  {
                    id: 'ssp585',
                    description: 'Scenario 585',
                  },
                ],
              },
              stormSurge: {
                dataInfo: 'i4_storm_surge',
                description: 'Storm surge level in m',
                selected: '0_0',
                items: [
                  {
                    id: '0_0',
                    description: '0',
                  },
                  {
                    id: '0_5',
                    description: '05',
                  },
                  {
                    id: '1_0',
                    description: '10',
                  },
                  {
                    id: '1_5',
                    description: '15',
                  },
                  {
                    id: '2_0',
                    description: '20',
                  },
                  {
                    id: '3_0',
                    description: '30',
                  },
                  {
                    id: '5_0',
                    description: '50',
                  },
                ],
              },
              confidence: {
                dataInfo: 'i4_confidence',
                description: 'Confidence level of the data',
                selected: 'medium',
                items: [
                  {
                    id: 'medium',
                    description: 'Medium',
                  },
                  {
                    id: 'low',
                    description: 'Low',
                  },
                ],
              },
              time: {
                description: 'Model year (baseline 2020)',
                selected: '2150',
                items: [
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
          baseUrl: 'https://hulk.adamplatform.eu/wmts',
          layers: 'InundationMap',
          styles: 'InundationMap;colorrange=(0,2)',
          token: 'bf12d6193efa667283ee9643951acfaa',
          projection: 'EPSG:4326',
          crossOrigin: null,
          name: 'Indicator 4: Flood risk',
          customAreaFeatures: true,
          minZoom: 7,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON ((11.99707 36.385913, 11.99707 38.719805, 16.303711 38.719805, 16.303711 36.385913, 11.99707 36.385913))').toJson(),
            }],
          },
          features: {
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS4_flood_risk/legend_osm.png',
            name: 'OpenStreetMap selected features',
            styleFunction: (feature) => {
              const colormapping = {
                amenity: {
                  hospital: '#003247',
                  school: '#7d0240',
                },
                man_made: {
                  storage_tank: '#a15f0a',
                },
                building: {
                  residential: '#00ad0e',
                },
              };
              // find first matching feature property and get color
              const matchKey = Object.keys(colormapping).find((key) => feature.get(key));
              const color = colormapping[matchKey][feature.get(matchKey)];
              const radius = 4;
              const fill = new Fill({
                color: 'rgba(255, 255, 255, 0.25)',
              });
              const stroke = new Stroke({
                width: 3,
                color,
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
            allowedParameters: ['name', 'amenity', 'man_made', 'building', 'content'],
            ...overpassApiQueryTags([
              { key: 'amenity', value: 'school', selected: true },
              { key: 'amenity', value: 'hospital', selected: true },
              { key: 'man_made', value: 'storage_tank', selected: true },
              { key: 'building', value: 'residential', selected: false }]),
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
        description: 'Health-Oriented Urban Heat and Pollution Index (HOUHPI)',
        indicator: 'IND1_1',
        indicatorName: 'Indicator 1: Air polution',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: [['2021-01-01', 'Spring'], ['2021-04-01', 'Summer'], ['2021-07-01', 'Autumn'], ['2021-10-01', 'Winter']],
        inputData: [''],
        cogFilters: {
          sourceLayer: 'IND1_1',
          filters: {
            houhpi: {
              display: true,
              label: 'Health risk due to urban heat and pollution (0 being no risk on health and 2 extreme risk on health)',
              id: 'houhpi',
              min: 0,
              max: 2,
              step: 0.005,
              range: [0, 1],
            },
          },
        },
        display: [{
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b1/cm_legend.png',
          id: 'IND1_1',
          protocol: 'cog',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_{time}_europe_3857_b1.tif' },
          ],
          dateFormatFunction: ((date) => date[1]),
          labelFormatFunction: ((date) => date[1]),
          style: {
            variables: {
              houhpiMin: 0,
              houhpiMax: 1,
            },
            color: [
              'case',
              ['==', ['band', 1], 0],
              [
                'color', 0, 0, 0, 0,
              ],
              ['between', ['band', 1], ['var', 'houhpiMin'], ['var', 'houhpiMax']],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('hot', 0, 1, 40, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Health-Oriented Urban Heat and Pollution Index',
        },
        {
          // dissolved individual bands as layers
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b2/cm_legend.png',
          protocol: 'cog',
          dateFormatFunction: ((date) => date[1]),
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Winter_europe_3857_b2.tif' },
          ],
          name: 'Number of people of age > 60 or <5',
          visible: false,
          style: {
            color: [
              'case',
              ['>', ['band', 1], 0],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('hot', 0, 10000, 40, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        }, {
          // dissolved individual bands as layers
          protocol: 'cog',
          dateFormatFunction: ((date) => date[1]),
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b3/cm_legend.png',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Winter_europe_3857_b3.tif' },
          ],
          name: 'Distance to nearest hospital or clinic [km]',
          visible: false,
          style: {
            color: [
              'case',
              ['>', ['band', 1], 0],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('hot', 0, 200, 40, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        }, {
          // dissolved individual bands as layers
          protocol: 'cog',
          dateFormatFunction: ((date) => date[1]),
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b4/cm_legend.png',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Winter_europe_3857_b4.tif' },
          ],
          name: 'Number of days where air pollution exceeded WHO threshold',
          visible: false,
          style: {
            color: [
              'case',
              ['>', ['band', 1], 0],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('hot', 0, 90, 40, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
        }, {
          // dissolved individual bands as layers
          protocol: 'cog',
          dateFormatFunction: ((date) => date[1]),
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b5/cm_legend.png',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_{time}_europe_3857_b5.tif' },
          ],
          name: 'Land Surface Temperature',
          visible: false,
          style: {
            color: [
              'case',
              ['!=', ['band', 1], 0],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('hot', -10, 50, 40, true),
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
            geometry: wkt.read('POLYGON ((-28.125 33.72434, -28.125 71.746432, 42.539063 71.746432, 42.539063 33.72434, -28.125 33.72434))').toJson(),
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
              label: 'Biodiversity indicator',
              id: 'wildlife',
              min: 0.25,
              max: 5,
              step: 0.25,
              header: true,
              range: [0.25, 5],
            },
            road_pressure_indicator: {
              display: true,
              label: 'Road Pressure Indicator',
              id: 'road_pressure_indicator',
              min: -1,
              max: 5,
              step: 0.25,
              range: [-1, 5],
            },
            species_count_quintile: {
              display: true,
              label: 'Categorized species density',
              id: 'species_count_quintile',
              min: 0,
              max: 5,
              step: 0.25,
              range: [0, 5],
            },
            vegetation: {
              display: true,
              label: 'Vegetation health indicator',
              id: 'vegetation',
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
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife.tif' },
          ],
          name: 'Indicator 2: Wildlife',
          customAreaFeatures: true,
          overlayLayers: [{
            // dissolved individual bands as layers
            protocol: 'cog',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_2.tif' },
            ],
            name: 'Indicator 2: Road Pressure Indicator',
            visible: false,
            style: {
              color: [
                'case',
                [
                  'all',
                  ['==', ['band', 1], 0],
                  ['==', ['band', 2], 0],
                  ['==', ['band', 3], 0],
                  ['==', ['band', 4], 0],
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
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
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_3.tif' },
            ],
            name: 'Indicator 2: Categorized species density',
            visible: false,
            style: {
              color: [
                'case',
                [
                  'all',
                  ['==', ['band', 1], 0],
                  ['==', ['band', 2], 0],
                  ['==', ['band', 3], 0],
                  ['==', ['band', 4], 0],
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
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
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_4.tif' },
            ],
            name: 'Indicator 2: Vegetation health indicator',
            visible: false,
            style: {
              color: [
                'case',
                [
                  'all',
                  ['==', ['band', 1], 0],
                  ['==', ['band', 2], 0],
                  ['==', ['band', 3], 0],
                  ['==', ['band', 4], 0],
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
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
              road_pressure_indicatorMin: -1,
              road_pressure_indicatorMax: 5,
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
                ['between', ['band', 2], ['var', 'road_pressure_indicatorMin'], ['var', 'road_pressure_indicatorMax']],
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
        indicator: 'IND2_1',
        indicatorName: 'Wildlife Minesweeper',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'Game',
        time: [],
        inputData: [''],
        display: [{
          minesweeperOptions: {
            // Board dimensions in number of hex cells
            enableSpeciesDisplay: true,
            size: 20,
            geotiff: {
              projection: 'EPSG:4326',
              url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_1.tif',
            },
            selectedLocationIndex: 0,
            minColor: { // dark green
              r: 0, g: 100, b: 0, a: 0.6,
            },
            maxColor: { // light green
              r: 0, g: 255, b: 0, a: 0.6,
            },
            minValue: 1,
            maxValue: 8,
            locations: [
              {
                name: 'Global Coverage',
                bbox: [-28, 33, 42, 71],
                /// How wide the bounding box should be as a longitudinal extent.
                horizontalExtent: 5,
                isMineCondition: (val) => val >= 3.5,
              },
            ],
          },
          id: 'IND2_1',
          ...baseLayers.CORINE_LAND_COVER,
          opacity: 0.7,
        }, {
          ...baseLayers.ESA_WORLD_COVER,
          visible: true,
          opacity: 0.7,
        }],
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
        indicator: 'IND1_1',
        indicatorName: 'HOUHPI Minesweeper',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'Game',
        time: [],
        inputData: [''],
        display: [{
          minesweeperOptions: {
            // Board dimensions in number of hex cells
            size: 20,
            minColor: { // light yellow
              r: 255, g: 255, b: 170, a: 0.5,
            },
            maxColor: { // orange
              r: 255, g: 100, b: 0, a: 0.6,
            },
            minValue: 0,
            maxValue: 0.5,
            geotiff: {
              projection: 'EPSG:4326',
              url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Summer_europe_4326_b1.tif',
            },
            selectedLocationIndex: 0,
            locations: [
              {
                name: 'Global Coverage',
                bbox: [-24, 33, 42, 71],
                /// How wide the bounding box should be as a longitudinal extent.
                horizontalExtent: 10,
                isMineCondition: 80, // 80th percentile mine threshold
              },
            ],
          },
          id: 'IND1_1',
          ...baseLayers.CORINE_LAND_COVER,
          opacity: 0.7,
        }, {
          ...baseLayers.ESA_WORLD_COVER,
          visible: true,
          opacity: 0.7,
        }],
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
        indicator: 'IND3_1',
        indicatorName: 'Indicator 3: Food security',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON ((-26 -3.3, -26 37, 76 37, 76 -3.3, -26 -3.3))').toJson(),
          }],
        },
        aoiID: 'World',
        time: getDailyDates('2024-04-15', DateTime.utc().toFormat('yyyy-MM-dd')),
        inputData: [''],
        display: {
          overlayLayers: [
            {
              ...overlayLayers.eoxOverlay, visible: true,
            },
            {
              ...defaultLayersDisplay,
              name: 'WorldCereal - Maize',
              layers: 'MAIZE_WORLDCEREAL',
              visible: false,
            },
            {
              ...defaultLayersDisplay,
              name: 'WorldCereal - Winter Cereals',
              layers: 'WINTER_WORLDCEREAL',
              visible: false,
            },
          ],
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS3_locust/cm_legend.png',
          protocol: 'cog',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator3/{time}_locust_3857.tif' },
          ],
          projection: 'EPSG:3857',
          style: {
            variables: {
              valueMin: 0.7,
              valueMax: 1,
            },
            color: [
              'case',
              ['between', ['band', 1], 0.7, 1],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('hot', 0.7, 1, 40, true),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Locusts',
          customAreaFeatures: true,
          features: {
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS3_locust/osm_legend.png',
            name: 'OpenStreetMap selected features',
            styleFunction: (feature) => {
              const colormapping = {
                crop: {
                  rice: '#ec2d01',
                  sugarcane: '#aae06e',
                  barley: '#976f39',
                  vegetables: '#2ddb21',
                },
              };
              // find first matching feature property and get color
              const matchKey = Object.keys(colormapping).find((key) => feature.get(key));
              const color = colormapping[matchKey][feature.get(matchKey)];
              const radius = 4;
              const fill = new Fill({
                color: 'rgba(255, 255, 255, 0.25)',
              });
              const stroke = new Stroke({
                width: 3,
                color,
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
            allowedParameters: ['name', 'crop'],
            ...overpassApiQueryTags([
              {
                key: 'crop', value: 'rice', staticParams: [{ key: 'landuse', value: 'farmland' }], selected: true,
              },
              {
                key: 'crop', value: 'sugarcane', staticParams: [{ key: 'landuse', value: 'farmland' }], selected: true,
              },
              {
                key: 'crop', value: 'barley', staticParams: [{ key: 'landuse', value: 'farmland' }], selected: true,
              },
              {
                key: 'crop', value: 'vegetable', staticParams: [{ key: 'landuse', value: 'farmland' }], selected: true,
              },
            ]),
          },
        },
      },
    },
  },
];
