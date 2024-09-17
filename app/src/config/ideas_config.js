import { DateTime } from 'luxon';
import { Wkt } from 'wicket';
import overpassApiQueryTags from '@/config/overpass';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';
import { baseLayers, overlayLayers, getColorStops } from '@/config/layers';

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

export const defaultLayersDisplayIdeasSh = {
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
  projection: 'EPSG:3857',
};

const IDEASConfigs = [
  {
    properties: {
      indicatorObject: {
        indicator: 'IND4_1',
        time: ['2020', '2040', '2060', '2080', '2100', '2120', '2150'],
        yAxis: 'flooding',
        display: {
          ...defaultLayersDisplayIdeasSh,
          enableCustomAreaStatistics: true,
          overlayLayers: [
            overlayLayers.powerOpenInfrastructure,
            {
              ...overlayLayers.eoxOverlay, visible: true,
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'WorldCereal - Maize',
              layers: 'MAIZE_WORLDCEREAL',
              visible: false,
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/MAIZE_WORLDCEREAL_IDEAS/legend.png',
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'WorldCereal - Winter Cereals',
              layers: 'WINTER_WORLDCEREAL',
              visible: false,
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/WINTER_WORLDCEREAL_IDEAS/legend.png',
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'WorldCereal - Spring Cereals',
              layers: 'SPRING_WORLDCEREAL',
              visible: false,
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/SPRING_WORLDCEREAL_IDEAS/legend.png',
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'GHS World population 2020',
              layers: 'GHS_POP_E2020',
              visible: false,
              layerAdditionalDescription: ghsPopulationLegend,
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'GHS World population 2025',
              layers: 'GHS_POP_E2025',
              visible: false,
              layerAdditionalDescription: ghsPopulationLegend,
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'GHS World population 2030',
              layers: 'GHS_POP_E2030',
              visible: false,
              layerAdditionalDescription: ghsPopulationLegend,
            },
            {
              ...defaultLayersDisplayIdeasSh,
              visible: false,
              baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}?TIME=2020-01-01`,
              name: 'GHS built up area 2020',
              layers: 'GHS_BUILT_S',
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/GHS-BUILT-S-R2023A/GHS-BUILT-S-R2023A_legend.png',
            },
            {
              ...defaultLayersDisplayIdeasSh,
              visible: false,
              baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}?TIME=2025-01-01`,
              name: 'GHS built up area 2025',
              layers: 'GHS_BUILT_S',
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/GHS-BUILT-S-R2023A/GHS-BUILT-S-R2023A_legend.png',
            },
            {
              ...defaultLayersDisplayIdeasSh,
              visible: false,
              baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}?TIME=2030-01-01`,
              name: 'GHS built up area 2030',
              layers: 'GHS_BUILT_S',
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/GHS-BUILT-S-R2023A/GHS-BUILT-S-R2023A_legend.png',
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
                    description: '0.0',
                  },
                  {
                    id: '0_5',
                    description: '0.5',
                  },
                  {
                    id: '1_0',
                    description: '1.0',
                  },
                  {
                    id: '1_5',
                    description: '1.5',
                  },
                  {
                    id: '2_0',
                    description: '2.0',
                  },
                  {
                    id: '3_0',
                    description: '3.0',
                  },
                  {
                    id: '5_0',
                    description: '5.0',
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
          projection: 'EPSG:3857',
          crossOrigin: null,
          name: 'Indicator 4: Flood risk',
          customAreaFeatures: true,
          minZoom: 7,
          baseLayers: [
            baseLayers.eoxosm,
            baseLayers.terrainLight,
            {
              ...baseLayers.cloudless, visible: true,
            },
          ],
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
            projection: 'EPSG:4326',
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
        indicator: 'IND1_1',
        time: [['2021-01-01', 'Autumn'], ['2021-01-02', 'Winter'], ['2021-01-03', 'Spring'], ['2021-01-04', 'Summer']],
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
                ...getColorStops('bluered', -10, 50, 40, false),
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
        indicator: 'IND2_1',
        cogFilters: {
          sourceLayer: 'IND2_1',
          filters: {
            wildlife: {
              display: true,
              label: 'Biodiversity indicator; 0 is low, 5 is high',
              id: 'wildlife',
              min: 0.25,
              max: 5,
              step: 0.25,
              header: true,
              range: [0.25, 5],
            },
            road_pressure_indicator: {
              display: true,
              label: 'Road Pressure Indicator; 0 is high, 5 is low',
              id: 'road_pressure_indicator',
              min: -1,
              max: 5,
              step: 0.25,
              range: [-1, 5],
            },
            species_count_quintile: {
              display: true,
              label: 'Categorized species density; 0 is low, 5 is high',
              id: 'species_count_quintile',
              min: 0,
              max: 5,
              step: 0.25,
              range: [0, 5],
            },
            vegetation: {
              display: true,
              label: 'Vegetation health indicator; 0 is worst, 5 is best',
              id: 'vegetation',
              min: 0,
              max: 5,
              step: 0.25,
              range: [0, 5],
            },
          },
        },
        display: {
          ...defaultLayersDisplayIdeasSh,
          protocol: 'cog',
          id: 'IND2_1',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife.tif' },
          ],
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS2_wildlife/cm_legend.png',
          name: 'Indicator 2: Wildlife',
          customAreaFeatures: true,
          overlayLayers: [{
            // dissolved individual bands as layers
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS2_wildlife/cm_legend.png',
            protocol: 'cog',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_2.tif' },
            ],
            name: 'Indicator 2: Road Pressure Indicator',
            visible: false,
            style: {
              color: [
                'case',
                ['between', ['band', 1], 0.1, 5],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 1],
                  ...getColorStops('viridis', 0, 5, 27, true),
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
              ],
            },
          }, {
            // dissolved individual bands as layers
            protocol: 'cog',
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS2_wildlife/cm_legend.png',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_3.tif' },
            ],
            name: 'Indicator 2: Categorized species density',
            visible: false,
            style: {
              color: [
                'case',
                ['between', ['band', 1], 0.1, 5],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 1],
                  ...getColorStops('viridis', 0, 5, 27, true),
                ],
                [
                  'color', 0, 0, 0, 0,
                ],
              ],
            },
          }, {
            // dissolved individual bands as layers
            protocol: 'cog',
            legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS2_wildlife/cm_legend.png',
            sources: [
              { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife_4.tif' },
            ],
            name: 'Indicator 2: Vegetation health indicator',
            visible: false,
            style: {
              color: [
                'case',
                ['between', ['band', 1], 0.1, 5],
                [
                  'interpolate',
                  ['linear'],
                  ['band', 1],
                  ...getColorStops('viridis', 0, 5, 27, true),
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
                ...getColorStops('viridis', 0, 5, 27, true),
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
        indicator: 'IND2_1_minesweeper',
        display: [{
          ...defaultLayersDisplayIdeasSh,
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
                bbox: [-24, 33, 42, 71],
                /// How wide the bounding box should be as a longitudinal extent.
                horizontalExtent: 5,
                isMineCondition: (val) => val >= 3.5,
              },
            ],
          },
          id: 'IND2_1_minesweeper',
          ...baseLayers.CORINE_LAND_COVER,
          opacity: 0.7,
        }, {
          ...defaultLayersDisplayIdeasSh,
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
        indicator: 'IND1_1_minesweeper',
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
                horizontalExtent: 5,
                isMineCondition: 80, // 80th percentile mine threshold
              },
            ],
          },
          id: 'IND1_1_minesweeper',
          ...baseLayers.CORINE_LAND_COVER,
          opacity: 0.7,
          baseLayers: [
            baseLayers.eoxosm,
            baseLayers.terrainLight,
            {
              ...baseLayers.cloudless, visible: true,
            },
          ],
        }, {
          // dissolved individual bands as layers
          protocol: 'cog',
          legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b4/cm_legend.png',
          sources: [
            { url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Winter_europe_3857_b4.tif' },
          ],
          name: 'Number of days where air pollution exceeded WHO threshold',
          visible: true,
          opacity: 0.5,
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
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'IND3_1',
        // - 1 day to ensure that data is already there
        time: getDailyDates('2024-04-15', (DateTime.utc().minus({ days: 1 })).toFormat('yyyy-MM-dd')),
        display: {
          ...defaultLayersDisplayIdeasSh,
          showTimeSlider: true,
          overlayLayers: [
            {
              ...overlayLayers.eoxOverlay, visible: true,
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'WorldCereal - Maize',
              layers: 'MAIZE_WORLDCEREAL',
              visible: false,
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/MAIZE_WORLDCEREAL_IDEAS/legend.png',
            },
            {
              ...defaultLayersDisplayIdeasSh,
              name: 'WorldCereal - Winter Cereals',
              layers: 'WINTER_WORLDCEREAL',
              visible: false,
              legendUrl: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/WINTER_WORLDCEREAL_IDEAS/legend.png',
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
          name: 'Suitable ecosystem for locust breeding',
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
export const createIDEASDatasetConfigs = (indicatorCodes) => {
  const configsToReturn = IDEASConfigs.filter((item) => (indicatorCodes.includes(item.properties.indicatorObject.indicator)));
  return configsToReturn;
};
