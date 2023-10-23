/* eslint-disable max-len */
import { Wkt } from 'wicket';
import { shTimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { DateTime } from 'luxon';
import colormap from 'colormap';
import availableDates from '@/config/gtif_dates.json';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';

import GeoJSON from 'ol/format/GeoJSON';
import WKB from 'ol/format/WKB';

export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/GTIF/catalog.json';
// export const STACEndpoint = 'http://127.0.0.1:8000/GTIF/catalog.json';

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

let stp = 1 / 6;

const adoColor = {
  steps: 32,
  colors: colormap({
    colormap: [
      { index: 0, rgb: [215, 25, 28] },
      { index: stp * 1, rgb: [253, 174, 97] },
      { index: stp * 2, rgb: [255, 255, 191] },
      { index: stp * 3, rgb: [255, 255, 255] },
      { index: stp * 4, rgb: [245, 153, 246] },
      { index: stp * 5, rgb: [180, 103, 221] },
      { index: stp * 6, rgb: [69, 0, 153] },
    ],
    nshades: 32,
  }),
};

stp = 1 / 7;

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

export const dataPath = './data/gtif/internal/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/gtif/pois_gtif.json',
  },
];

export const layerNameMapping = Object.freeze({
  S2L2A_REP4: {
    minZoom: 7,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    subAoiTransparent: true,
  },
  S1GRD_REP4: {
    minZoom: 7,
    layers: 'E8_SENTINEL1',
    subAoiTransparent: true,
  },
});

export const indicatorClassesIcons = Object.freeze({
  'energy-transition': 'mdi-water',
  'mobility-transition': 'mdi-car',
  'sustainable-cities': 'mdi-solar-panel-large',
  'carbon-accounting': 'mdi-pine-tree',
  'eo-adaptation-services': 'mdi-set-center',
});

export const mapDefaults = Object.freeze({
  bounds: [10, 46, 20, 49.5],
});

export const baseLayersMap = [
  baseLayers.S2GLC,
  baseLayers.ESA_WORLD_COVER,
  baseLayers.CORINE_LAND_COVER,
  baseLayers.geolandbasemap,
  baseLayers.bmapgelaende,
  baseLayers.bmaporthofoto30cm,
  baseLayers.eoxosm,
  baseLayers.cloudless,
  {
    ...baseLayers.terrainLight, visible: true,
  },
];

export const overlayLayersMap = [
  overlayLayers.powerOpenInfrastructure,
  {
    ...overlayLayers.eoxOverlay, visible: true,
  },
];

const nutsStyle = {
  attribution: 'Administrative boundaries: © EuroGeographics, © TurkStat. Source: European Commission – Eurostat/GISCO',
  visible: true,
  protocol: 'GeoJSON',
  style: {
    fillColor: 'rgba(0, 0, 0, 0)',
    strokeColor: '#006762',
  },
};

export const darkOverlayLayers = [{
  ...nutsStyle,
  attribution: 'Administrative boundaries: © EuroGeographics, © TurkStat. Source: European Commission – Eurostat/GISCO',
  name: 'NUTS L0',
  url: 'data/gtif/data/AT_NUTS_L0.geojson',
}];

export const defaultLayersDisplay = {
  dateFormatFunction: shTimeFunction,
  transparent: true,
  opacity: 1,
  attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
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
    baseLayers.bodenwertigkeitskarte_agri,
    baseLayers.bodenwertigkeitskarte_grassland,
    baseLayers.dsr_schnelllade_10km,
    ...baseLayersMap,
  ],
  overlayLayers: [
    { ...overlayLayers.powerOpenInfrastructure, visible: true },
    { ...overlayLayers.eoxOverlay, visible: true },
  ],
};

const eoadaptationDefaults = {
  baseLayers: [
    {
      ...baseLayers.s2AT2022,
      visible: true,
    },
    baseLayers.s2AT2021,
    baseLayers.terrainLight,
    baseLayers.bmaporthofoto30cm,
    baseLayers.cloudless,
  ],
};

const mobilityTransitionDefaults = {
  baseLayers: [
    baseLayers.dsr_schnelllade_10km,
    ...baseLayersMap,
  ],
};

const wkb = new WKB();
const geojsonFormat = new GeoJSON();

const trucksAreaIndicator = {
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    collection: 'eodash_{indicator}-detections',
    select: 'time,geometry',
    order: 'time',
    where: 'aoi_id=\'AT\' AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
  },
  callbackFunction: (responseJson, indicator, area) => {
    if (Array.isArray(responseJson[0].src)) {
      const data = responseJson[0].src;
      const datesObj = {};
      const newData = {
        time: [],
        measurement: [],
      };
      data.sort((a, b) => ((DateTime.fromISO(a.time) > DateTime.fromISO(b.time))
        ? 1
        : -1));
      const areaAsGeom = geojsonFormat.readGeometry(area);
      data.forEach((row) => {
        // for each entry, extract just those points that actually intersect the area
        const geom = geojsonFormat.writeGeometryObject(wkb.readGeometry(row.geometry));
        let intersectingFtrs = 0;
        if (geom.type === 'MultiPoint') {
          // split multipoint to points
          geom.coordinates.forEach((coordPair) => {
            const singleGeometry = {
              type: 'Point',
              coordinates: coordPair,
            };
            // check if intersect the user drawn area
            const intersects = areaAsGeom.intersectsCoordinate(singleGeometry.coordinates);
            if (intersects) {
              intersectingFtrs += 1;
            }
          });
        }
        if (intersectingFtrs > 0) {
          // as data is structured one entry per country, we need to aggregate on date
          if (row.time in datesObj) {
            datesObj[row.time] += intersectingFtrs;
          } else {
            datesObj[row.time] = intersectingFtrs;
          }
        }
      });
      Object.entries(datesObj).forEach((entry) => {
        const [key, value] = entry;
        // convert to structure indicatorData expects
        newData.time.push(DateTime.fromISO(key));
        newData.measurement.push(value);
      });
      const ind = {
        ...indicator,
        ...newData,
      };
      return ind;
    }
    return null;
  },
  areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
};

const trucksFeatures = {
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    collection: 'eodash_{indicator}-detections',
    select: 'geometry,time',
    where: 'ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry) AND time=\'{featuresTime}\'',
  },
  callbackFunction: (responseJson, indicator, area) => {
    const ftrs = [];
    const data = responseJson[0].src;
    if (Array.isArray(data)) {
      const areaAsGeom = geojsonFormat.readGeometry(area);
      data.forEach((ftr) => {
        const geom = geojsonFormat.writeGeometryObject(wkb.readGeometry(ftr.geometry));
        if (geom.type === 'MultiPoint') {
          // split multipoint to points
          geom.coordinates.forEach((coordPair) => {
            const singleGeometry = {
              type: 'Point',
              coordinates: coordPair,
            };
            // check if intersect the user drawn area
            const intersects = areaAsGeom.intersectsCoordinate(singleGeometry.coordinates);
            if (intersects) {
              const { geometry, ...properties } = ftr;
              ftrs.push({
                type: 'Feature',
                properties,
                geometry: singleGeometry,
              });
            }
          });
        }
      });
    }
    const ftrColl = {
      type: 'FeatureCollection',
      features: ftrs,
    };
    return ftrColl;
  },
  dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}T00:00:00`,
  areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
};

export const indicatorsDefinition = Object.freeze({
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
    customAreaIndicator: true,
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
  REP4_1: {
    indicator: 'Hydro Power SWE daily',
    class: 'water',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP4',
    maxDecimals: 5,
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.cloudless,
    baseLayers.eoxosm,
    baseLayers.S2GLC,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm],
  },
  REP4_2: {
    indicator: 'Hydro Power SWE monthly',
    class: 'water',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP4',
    maxDecimals: 5,
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.cloudless,
    baseLayers.eoxosm,
    baseLayers.S2GLC,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm],
  },
  REP4_4: {
    indicator: 'Hydro Power WSE monthly',
    class: 'water',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP4',
  },
  REP4_5: {
    indicator: 'Hydro Power LAC monthly',
    class: 'water',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP4',
  },
  REP4_6: {
    indicator: 'Hydro Power inferred volume daily',
    class: 'water',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP4',
    maxDecimals: 5,
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.cloudless,
    baseLayers.eoxosm,
    baseLayers.S2GLC,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmapgelaende],
  },
  REP5: {
    indicator: 'Potential Assessment',
    class: 'water',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP5',
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.S2GLC,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm,
    baseLayers.eoxosm,
    baseLayers.terrainLight,
    ],
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: false, minZoom: 13 },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  REP6: {
    indicator: 'Wind Turbines',
    class: 'air',
    themes: ['energy-transition'],
    story: '/data/gtif/markdown/REP6',
    baseLayers: [{
      ...baseLayers.bmapgelaende, visible: true,
    },
    baseLayers.terrainLight,
    baseLayers.eoxosm,
    baseLayers.S2GLC,
    baseLayers.ESA_WORLD_COVER,
    baseLayers.CORINE_LAND_COVER,
    baseLayers.geolandbasemap,
    baseLayers.bmaporthofoto30cm,
    ],
    overlayLayers: [
      { ...overlayLayers.powerOpenInfrastructure, visible: false, minZoom: 13 },
      { ...overlayLayers.eoxOverlay, visible: true },
    ],
  },
  MOBI1: {
    ...mobilityTransitionDefaults,
    indicator: 'mobility',
    class: 'mobi1',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/MOBI',
    customAreaIndicator: true,
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
  FCM1: {
    indicator: 'Forest change detections',
    class: 'air',
    story: '/data/gtif/markdown/FCM',
    themes: ['carbon-accounting'],
    ...eoadaptationDefaults,
  },
  FCM2: {
    indicator: 'Forest disturbance type',
    class: 'air',
    story: '/data/gtif/markdown/FCM2',
    themes: ['carbon-accounting', 'eo-adaptation-services'],
    ...eoadaptationDefaults,
  },
  FCM3: {
    indicator: 'Annual forest mask',
    class: 'air',
    story: '/data/gtif/markdown/FCM3',
    themes: ['carbon-accounting'],
  },
  VTT: {
    indicator: 'Forest analysis',
    class: 'air',
    story: '/data/gtif/markdown/VTT',
    themes: ['eo-adaptation-services'],
  },
  ADO: {
    indicator: 'Alpine Drought Observatory',
    class: 'air',
    themes: ['eo-adaptation-services'],
    story: '/data/gtif/markdown/ADO',
    customAreaIndicator: true,
    showTimeSlider: true,
  },
  AQA: {
    ...mobilityTransitionDefaults,
    indicator: 'Health Risk Index (ARI)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
    customAreaIndicator: true,
    showTimeSlider: true,
  },
  AQB: {
    ...mobilityTransitionDefaults,
    indicator: 'Coarse particulate matter (PM10)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
    customAreaIndicator: true,
    showTimeSlider: true,
  },
  AQC: {
    ...mobilityTransitionDefaults,
    indicator: 'Fine particulate matter (PM2.5)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ',
    customAreaIndicator: true,
    showTimeSlider: true,
  },
  AQ1: {
    indicator: 'Aggregated mobility data',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ1',
    customAreaIndicator: true,
    showTimeSlider: true,
  },
  AQ2: {
    ...mobilityTransitionDefaults,
    indicator: 'Innsbruck hot-spot',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AT_AQ2',
    baseLayers: [{
      ...baseLayers.bmaporthofoto30cm,
      visible: true,
    }, baseLayers.geolandbasemap],
    overlayLayers: [],
    showTimeSlider: true,
  },
  AQ3: {
    ...mobilityTransitionDefaults,
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
    ...mobilityTransitionDefaults,
    indicator: 'Human Mobility Patterns',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ4',
  },
  AQ5: {
    ...mobilityTransitionDefaults,
    indicator: 'Nitrogen Dioxide (NO2)',
    class: 'air',
    themes: ['mobility-transition'],
    story: '/data/gtif/markdown/AQ5',
    showTimeSlider: true,
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
  E12c: {
    indicatorSummary: 'Number of Trucks - highways',
    themes: ['mobility-transition'],
    customAreaIndicator: true,
    customAreaFeatures: true,
    story: '/data/gtif/markdown/E12c',
    showTimeSlider: true,
  },
  E12d: {
    indicatorSummary: 'Number of Trucks, main roads',
    themes: ['mobility-transition'],
    customAreaIndicator: true,
    customAreaFeatures: true,
    story: '/data/gtif/markdown/E12c',
    showTimeSlider: true,
  },
  EO4A: {
    indicator: 'Snow depth',
    class: 'air',
    themes: ['eo-adaptation-services'],
    story: '/data/gtif/markdown/EO4A',
    showTimeSlider: true,
  },
  EO4A2: {
    indicator: 'Snow water equivalent',
    class: 'air',
    themes: ['eo-adaptation-services'],
    story: '/data/gtif/markdown/EO4A',
    showTimeSlider: true,
  },
});

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Europe',
        siteName: 'global',
        description: 'Number of Trucks',
        indicator: 'E12c',
        lastIndicatorValue: 'Moving truck detections',
        navigationDescription: 'Highways',
        indicatorName: 'Moving truck detections',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: 'primary',
        eoSensor: null,
        aoiID: 'W2',
        time: availableDates.E12c,
        inputData: [''],
        yAxis: 'Number of trucks detected',
        display: [{
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
          protocol: 'WMS',
          format: 'image/png',
          transparent: true,
          tileSize: 512,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A',
          minZoom: 7,
          legendUrl: 'legends/esa/AWS_E12C_NEW_MOTORWAY.png',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((13.8150 48.7647,17.48452 48.7647,17.48452 46.966583,13.8150 46.966583,13.8150 48.7647))').toJson(),
            }],
          },
          areaIndicator: trucksAreaIndicator,
          features: trucksFeatures,
          style: {
            color: '#00c3ff',
          },
          drawnAreaLimitExtent: true,
        }, {
          // get layer for this month
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
          protocol: 'WMS',
          format: 'image/png',
          transparent: true,
          tileSize: 512,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
            .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
            .toFormat('yyyy-MM-dd')}`,
          name: 'Monthly Aggregated Truck Traffic 10km',
          layers: 'TRUCK_REPROCESSING_MOTORWAY',
          maxZoom: 14,
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
        city: 'Europe',
        siteName: 'global',
        description: 'Number of Trucks',
        indicator: 'E12d',
        lastIndicatorValue: 'Regional Truck Traffic Primary',
        indicatorName: 'Moving truck detections',
        navigationDescription: 'Primary Roads',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: 'primary',
        eoSensor: null,
        aoiID: 'W3',
        time: availableDates.E12c,
        inputData: [''],
        yAxis: 'Number of trucks detected',
        display: [{
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
          protocol: 'WMS',
          format: 'image/png',
          transparent: true,
          tileSize: 512,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A',
          minZoom: 7,
          legendUrl: 'legends/esa/AWS_E12C_NEW_MOTORWAY.png',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          areaIndicator: trucksAreaIndicator,
          features: trucksFeatures,
          style: {
            color: '#00c3ff',
          },
          drawnAreaLimitExtent: true,
        }, {
          // get layer for this month
          protocol: 'WMS',
          format: 'image/png',
          transparent: true,
          tileSize: 512,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
            .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
            .toFormat('yyyy-MM-dd')}`,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
          name: 'Monthly Aggregated Truck Traffic 10km',
          layers: 'TRUCK_REPROCESSING_PRIMARY',
          minZoom: 7,
          maxZoom: 14,
          opacity: 0.7,
        }],
      },
    },
  },
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
        description: 'Aggregated mobility data',
        indicator: 'AQ1',
        lastIndicatorValue: null,
        indicatorName: 'Correlation explorer',
        navigationDescription: 'AQ-mobility',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        inputData: [''],
        yAxis: 'Aggregated data',
        queryParameters: {
          sourceLayer: 'aggregated_trajs_model_satellite_v1',
          selected: 'n_trajectories',
          items: [
            {
              id: 'n_trajectories',
              description: 'Number of trajectories',
              dataInfo: '',
              min: 1,
              max: 40000,
              colormapUsed: blgrrd,
              markdown: 'AQ1_trajectories',
            },
            {
              id: 'satellite_values',
              description: 'Sentinel5-p NO2 [µmol/m²]',
              dataInfo: '',
              min: 0,
              max: 500,
              colormapUsed: grywrd,
              markdown: 'AQ1_satellite_values',
            },
            {
              id: 'mean_value',
              description: 'Mean value [µg/m³]',
              dataInfo: '',
              min: 0,
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ1_mean_value',
            },
            {
              id: 'congestion_index',
              description: 'Congestion index',
              dataInfo: '',
              min: 0,
              max: 50,
              colormapUsed: blgrrd,
              markdown: 'AQ1_congestion_index',
            },
            {
              id: 'speed',
              description: 'Speed',
              dataInfo: '',
              min: 0,
              max: 120,
              colormapUsed: blgrrd,
              markdown: 'AQ1_speed',
            },
            {
              id: 'motorized_count',
              description: 'Motorized count',
              dataInfo: '',
              min: 1,
              max: 20000,
              colormapUsed: blgrrd,
              markdown: 'AQ1_motorized_count',
            },
            {
              id: 'motorized_share',
              description: 'Motorized share',
              dataInfo: '',
              min: 0,
              max: 100,
              colormapUsed: blgrrd,
              markdown: 'AQ1_motorized_share',
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
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_grid_gtif_aggregated_data',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              if (store.state.indicators.selectedIndicator
                  && store.state.indicators.selectedIndicator[dataSource]) {
                const id = Number(feature.get('object_id'));
                const ind = store.state.indicators.selectedIndicator;
                const currPar = ind.queryParameters.items
                  .find((item) => item.id === ind.queryParameters.selected);
                if (currPar && id in store.state.indicators.selectedIndicator[dataSource]) {
                  const value = ind[dataSource][id][currPar.id];
                  if (value != null && value !== 0) {
                    const { min, max, colormapUsed } = currPar;
                    let f = clamp((value - min) / (max - min), 0, 1);
                    if (['n_trajectories', 'motorized_count'].includes(currPar.id)) {
                      const normalized = (Math.log10(value) - Math.log10(min))
                      / (Math.log10(max) - Math.log10(min));
                      f = clamp(normalized, 0, 1);
                    }
                    color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                  }
                }
              }
              return color;
            },
          },
          selection: {
            mode: 'multiple',
          },
          tooltip: false,
          id: 'aggregated_trajs_model_satellite_v1',
          timeKey: 'timestamp',
          name: 'Aggregated data',
          adminZoneKey: 'satellite_id',
          parameters: 'satellite_id,satellite_values,mean_value,speed,congestion_index,n_trajectories,motorized_count,motorized_share',
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
        description: 'Alpine Drought Observatory',
        indicator: 'ADO',
        lastIndicatorValue: null,
        indicatorName: 'Alpine Drought Observatory',
        // navigationDescription: '',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: getDailyDates('2015-01-01', '2023-05-18'),
        inputData: [''],
        yAxis: 'ADO',
        queryParameters: {
          sourceLayer: 'ado_data',
          selected: 'spi-1',
          items: [
            {
              id: 'spi-1',
              description: 'SPI-1',
              dataInfo: 'SPI1',
              min: -2,
              max: 2,
              colormapUsed: adoColor,
              markdown: 'SPI',
            },
            {
              id: 'spi-12',
              description: 'SPI-12',
              dataInfo: 'SPI12',
              min: -2,
              max: 2,
              colormapUsed: adoColor,
              markdown: 'SPI',
            },
            {
              id: 'spei-1',
              description: 'SPEI-1',
              dataInfo: 'SPEI1',
              min: -2,
              max: 2,
              colormapUsed: adoColor,
              markdown: 'SPEI',
            },
            {
              id: 'spei-12',
              description: 'SPEI-12',
              dataInfo: 'SPEI12',
              min: -2,
              max: 2,
              colormapUsed: adoColor,
              markdown: 'SPEI',
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
          opacity: 0.7,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_NUTS_L3_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
            getColor: (feature, store, options) => {
              let color = '#00000000';
              const dataSource = options.dataProp ? options.dataProp : 'mapData';
              if (store.state.indicators.selectedIndicator
                  && store.state.indicators.selectedIndicator[dataSource]) {
                const id = feature.get('nuts_id').replace(/\s/g, ''); // need to remove white spaces
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
          },
          id: 'ado_data',
          allowedParameters: ['nuts_name', 'nuts_id'],
          name: 'Alpine Drought Exploratory',
          adminZoneKey: 'nuts_id',
          parameters: 'spi-1,spi-12,spei-1,spei-12,nuts_id',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'AQA',
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Health Risk Index (ARI)',
        lastIndicatorValue: null,
        indicatorName: 'Health Risk Index (ARI)',
        navigationDescription: 'Daily aggregated maps of ARI',
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
        inputData: [''],
        yAxis: 'Health Risk Index',
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
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
          },
          id: 'air_quality_new_id',
          name: 'ARI',
          adminZoneKey: 'id_3',
          parameters: 'pm10,pm25,ihr,id_3',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        },
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
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              dataInfo: 'PM25',
              min: 0,
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
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
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              dataInfo: 'PM25',
              min: 0,
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
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
          },
          id: 'air_quality_new_id',
          name: 'PM10',
          adminZoneKey: 'id_3',
          parameters: 'pm10,pm25,ihr,id_3',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
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
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM10',
            },
            {
              id: 'pm25',
              description: 'Particulate Matter < 2.5µm',
              dataInfo: 'PM25',
              min: 0,
              max: 50,
              colormapUsed: grywrd,
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Gemeinden_3857',
          protocol: 'geoserverTileLayer',
          style: {
            strokeColor: 'rgba(0,0,0,0)',
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
          },
          id: 'air_quality_new_id',
          name: 'Fine particulate matter (PM2.5)',
          adminZoneKey: 'id_3',
          parameters: 'pm10,pm25,ihr,id_3',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
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
        time: getDailyDates('2019-07-01T00:00Z', '2022-12-31T22:00:00Z'),
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
          sourceLayer: 'trajectories_on_edges_austria_daily',
          selected: 'congestion_index_max',
          dataInfo: 'AQ4',
          items: [
            {
              id: 'congestion_index_max',
              description: 'Max. Congestion index',
              min: 0,
              max: 100,
              colormapUsed: blgrrd,
              markdown: 'AQ4_congestion_index',
            },
            {
              id: 'duration_max',
              description: 'Max. Trip duration',
              min: 0,
              max: 240,
              colormapUsed: blgrrd,
              markdown: 'AQ4_duration',
            },
            {
              id: 'speed_max',
              description: 'Max. Trip speed',
              min: 0,
              max: 140,
              colormapUsed: blgrrd,
              markdown: 'AQ4_speed',
            },
            {
              id: 'distance_max',
              description: 'Max. Trip distance',
              min: 0,
              max: 300,
              colormapUsed: blgrrd,
              markdown: 'AQ4_distance',
            },
            {
              id: 'n_trajectories_max',
              description: 'Max. Trajectories',
              min: 1,
              max: 4000,
              colormapUsed: blgrrd,
              markdown: 'AQ4_trajectories',
            },
            {
              id: 'motorized_share_max',
              description: 'Max. Motorized trip share index',
              min: 0,
              max: 100,
              colormapUsed: blgrrd,
              markdown: 'AQ4_motorized_share',
            },
          ],
        },
        display: {
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Network_edges_subset_3857',
          protocol: 'geoserverTileLayer',
          style: {
            getStrokeColor: (feature, store, options) => {
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
                  let f = clamp((value - min) / (max - min), 0, 1);
                  if (['n_trajectories_max'].includes(currPar.id)) {
                    f = clamp((Math.log10(value) - Math.log10(min))
                      / (Math.log10(max) - Math.log10(min)), 0, 1);
                  }
                  color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                }
              }
              return color;
            },
            fillColor: '#ffffff',
            width: 5,
          },
          id: 'trajectories_on_edges_austria_daily',
          adminZoneKey: 'unique_id',
          parameters: 'unique_id,congestion_index_max,duration_max, speed_max, distance_max, n_trajectories_max, motorized_share_max',
          name: 'Human Mobility Patterns',
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
        time: getDailyDates('2019-07-01T00:00:00Z', '2022-12-31T23:00:00Z'),
        inputData: [''],
        yAxis: '',
        /*
        "adminzoneid", "time",  "users_count_min", "users_count_p25", "users_count_p50",
        "users_count_p75",  "users_count_max", "users_count_mean",  "users_density_min",
        "users_density_p25", "users_density_p50", "users_density_p75",  "users_density_max",
        "users_density_mean",
        */
        queryParameters: {
          sourceLayer: 'mobility_daily',
          selected: 'users_count_max',
          dataInfo: 'MOBI1',
          items: [
            {
              id: 'users_count_max',
              description: 'Max population count (for day)',
              min: 100,
              max: 100000,
              colormapUsed: blgrrd,
              markdown: 'MOBI1_users_count',
            },
            {
              id: 'users_density_max',
              description: 'Max population density (for day)',
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
          style: {
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
            strokeColor: 'rgba(0,0,0,0)',
          },
          opacity: 0.7,
          id: 'mobility_daily',
          adminZoneKey: 'adminzoneid',
          parameters: 'adminzoneid,users_count_max,users_density_max',
          name: 'Mobility Data',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
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
          sourceLayer: 'Green Roofs',
          items: [
            {
              id: 'grimpactscore_filtered',
              description: 'Green Roof Impact Score',
              markdown: 'SOL1_GRImpact',
            },
            {
              id: 'lst30mme',
              description: 'Max Land Surface Temperature',
              markdown: 'SOL_temp',
            },
            {
              id: 'grexisting',
              description: 'Existing green rooftops',
              markdown: 'SOL1_GRExisting',
            },
            {
              id: 'grpotential',
              description: 'Roofs Suitable for Greening',
              markdown: '',
            },
            {
              id: 'grpotare20',
              description: 'Percentage GR-Potential Area in relation to Total Roof Area',
              markdown: '',
            },
          ],
        },
        display: [{
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          name: 'Green Roofs',
          STYLES: 'grimpactscore_filtered',
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/green_rooftops_v1.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: 'grimpactscore_filtered',
          adminZoneKey: 'zsp_id',
        }, {
          ...nutsStyle,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Zaehlsprengel_3857',
          protocol: 'geoserverTileLayer',
          name: 'Census Track (Zählsprengel)',
          visible: true,
          minZoom: 13,
          selection: {
            mode: 'multiple',
            layer: 'GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          },
          tooltip: true,
          dynamicSelectionStroke: false,
          allowedParameters: ['name'],
        }],
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
          sourceLayer: 'Solar Roofs',
          items: [
            {
              id: 'PVEPPMwhHP',
              description: 'Total electric power production potential - High Performance ',
              markdown: 'SOL1_TEP_HP',
            },
            {
              id: 'PVExisting',
              description: 'Existing photovoltaic panels',
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
        display: [{
          baseUrl: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wms?',
          name: 'Solar Roofs',
          STYLES: 'PVEPPMwhHP',
          layers: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Rooftops_PV_bundesland_3857_v1',
          attribution: '{}',
          sld: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/styles/solar_rooftops_v1.sld',
          protocol: 'WMS',
          exceptions: 'application/vnd.ogc.se_inimage',
          selectedStyle: 'PVEPPMwhHP',
          adminZoneKey: 'zsp_id',
        }, {
          ...nutsStyle,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Zaehlsprengel_3857',
          protocol: 'geoserverTileLayer',
          name: 'Census Track (Zählsprengel)',
          visible: true,
          minZoom: 13,
          selection: {
            mode: 'multiple',
          },
          tooltip: true,
          allowedParameters: ['name'],
        }],
      },
    },
  },
  /*
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
  */
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
              dataInfo: 'BM2',
              label: 'Biomass [t/ha]',
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
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/FCM_AGB-2021_Austria_20m_EPSG3857-COG.tif' },
          ],
          style: {
            variables: {
              biomassMin: 0,
              biomassMax: 420,
            },
            color: [
              'case',
              ['between', ['band', 1], 0.1, 420],
              [
                'interpolate',
                ['linear'],
                normalize(['band', 1], 'biomassMin', 'biomassMax'),
                ...getColorStops('viridis', 0, 1, 64, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Above Ground Biomass',
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
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/A_FCMT_AnualForestChangeType_epsg3857.tif' },
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
        navigationDescription: '2022',
        indicator: 'FCM3',
        lastIndicatorValue: null,
        indicatorName: 'Annual forest mask',
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
        aoiID: 'Styria',
        time: [],
        inputData: [''],
        yAxis: '',
        display: {
          protocol: 'cog',
          id: 'FCM3',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/A_FM_AustriaForestMask-2022-09-01_epsg3857-v2.tif' },
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
        description: 'Forest explorer',
        navigationDescription: 'Assessment tool',
        indicator: 'VTT',
        lastIndicatorValue: null,
        indicatorName: 'Forest explorer',
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
        ],
        cogFilters: {
          sourceLayer: 'VTT',
          filters: {
            selectedBand: {
              display: true,
              header: true,
              label: 'Displayed dataset colormap',
              id: 'selectedBand',
              dataInfo: null,
              type: 'select',
              entries: [
                { text: 'Basal area', value: 1, range: [0, 65] },
                { text: 'Broadleaf proportion', value: 2, range: [0, 100] },
                { text: 'Conifer proportion', value: 4, range: [0, 100] },
                { text: 'Tree diameter', value: 3, range: [0, 50] },
                { text: 'Tree height', value: 5, range: [0, 350] },
                { text: 'Growing stock volume', value: 6, range: [0, 800] },
              ],
              value: 1,
            },
            visualization: {
              display: true,
              label: 'Dataset colormap value range',
              id: 'visualization',
              min: 0,
              max: 65,
              range: [0, 65],
            },
            basalarea: {
              display: true,
              label: 'Filter for Basal area',
              id: 'basalarea',
              dataInfo: 'basal',
              min: 0,
              max: 80,
              range: [0, 80],
            },
            broadleaf: {
              display: true,
              label: 'Filter for broadleaf proportion [%]',
              id: 'broadleaf',
              // dataInfo: 'broadleaf',
              min: 0,
              max: 100,
              range: [0, 100],
            },
            conifer: {
              display: true,
              label: 'Filter for conifer proportion [%]',
              id: 'conifer',
              // dataInfo: 'conifer',
              min: 0,
              max: 100,
              range: [0, 100],
            },
            diameter: {
              display: true,
              label: 'Filter for tree diameter',
              id: 'diameter',
              dataInfo: 'diameter',
              min: 0,
              max: 70,
              range: [0, 70],
            },
            height: {
              display: true,
              label: 'Filter for tree height [dm]',
              id: 'height',
              // dataInfo: 'height',
              min: 0,
              max: 500,
              range: [0, 500],
            },
            volume: {
              display: true,
              label: 'Filter for growing stock volume [m3/ha]',
              id: 'volume',
              dataInfo: 'stockvolume',
              min: 0,
              max: 1000,
              range: [0, 1000],
            },
          },
          protocol: 'cog',
          id: 'VTT1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/VTT/{time}' },
          ],
          normalize: true,
          style: {
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((13.234 48, 13.234 46.5, 16.5 46.5, 16.5 48, 13.234 48))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'VTT',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_basal_area_DA_2021_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_broadleaf_DA_2021_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_diameter_DA_2021_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_conifer_2015_8bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_height_DA_2021_16bit-EPSG3857-COG.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/VTT/Styria_volume_DA_2021_16bit-EPSG3857-COG.tif' },
          ],
          style: {
            variables: {
              selectedBand: 1,
              visualizationMin: 0,
              visualizationMax: 65,
              basalareaMin: 0,
              basalareaMax: 100,
              broadleafMin: 0,
              broadleafMax: 100,
              diameterMin: 0,
              diameterMax: 70,
              coniferMin: 0,
              coniferMax: 100,
              heightMin: 0,
              heightMax: 500,
              volumeMin: 0,
              volumeMax: 1000,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 1], ['var', 'basalareaMin'], ['var', 'basalareaMax']],
                ['between', ['band', 2], ['var', 'broadleafMin'], ['var', 'broadleafMax']],
                ['between', ['band', 3], ['var', 'diameterMin'], ['var', 'diameterMax']],
                ['between', ['band', 4], ['var', 'coniferMin'], ['var', 'coniferMax']],
                ['between', ['band', 5], ['var', 'heightMin'], ['var', 'heightMax']],
                ['between', ['band', 6], ['var', 'volumeMin'], ['var', 'volumeMax']],
              ],
              [
                'interpolate',
                ['linear'],
                normalize(['band', ['var', 'selectedBand']], 'visualizationMin', 'visualizationMax'),
                ...getColorStops('viridis', 0, 1, 9, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Forest coverage',
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
          ['2021-09', 'NRT_FCM_Changes-2021-09_epsg3857.tif'],
          ['2021-10', 'NRT_FCM_Changes-2021-10_epsg3857.tif'],
          ['2021-11', 'NRT_FCM_Changes-2021-11_epsg3857.tif'],
          ['2022-03', 'NRT_FCM_Changes-2022-03_epsg3857.tif'],
          ['2022-04', 'NRT_FCM_Changes-2022-04_epsg3857.tif'],
          ['2022-05', 'NRT_FCM_Changes-2022-05_epsg3857.tif'],
          ['2022-06', 'NRT_FCM_Changes-2022-06_epsg3857.tif'],
          ['2022-07', 'NRT_FCM_Changes-2022-07_epsg3857.tif'],
          ['2022-08', 'NRT_FCM_Changes-2022-08_epsg3857.tif'],
        ],
        inputData: [''],
        yAxis: '',
        display: [{
          protocol: 'cog',
          id: 'FCM1',
          sources: [
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/{time}' },
          ],
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => date[0],
          style: {
            color: [
              'case',
              ['==', ['band', 1], 1],
              ['color', 255, 0, 0, 1],
              ['color', 0, 0, 0, 0],
            ],
          },
          name: 'Forest change detections',
        },
        {
          protocol: 'GeoJSON',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/AT_biomass_loss.geojson',
          name: 'Biomass loss',
          style: {
            strokeColor: 'rgba(0,0,0,0.9)',
            fillColor: 'rgba(0,0,0,0.0001)',
          },
          minZoom: 1,
          tooltip: {
            tooltipFormatFunction: (feature) => [
              `Region: ${feature.get('NUTS_NAME')}`,
              `Biomass loss: ${Number(feature.get('BMLoss_sum')).toFixed(2)}`,
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
        queryParameters: {
          sourceLayer: 'wind_average_zsp',
          selected: '1,2,3,4,5,6,7,8,9,10,11,12',
          items: [],
        },
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
              label: 'Distance to settlements WSF [m]',
              id: 'settlementDistance',
              dataInfo: 'SettlementDistance',
              type: 'slider',
              inverted: false,
              min: 0,
              max: 5000,
              value: 0,
            },
            cadasterDistance: {
              display: false,
              label: 'Distance to settlements Austrian Cadaster [m]',
              id: 'cadasterDistance',
              dataInfo: 'CadasterDistance',
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
              inverted: true,
              min: 0,
              max: 25000,
              value: 25000,
            },
            ruggedness: {
              display: false,
              label: 'Filter for ruggedness index',
              id: 'ruggedness',
              type: 'slider',
              inverted: true,
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
        display: [{
          processingEnabled: true,
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
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/CadasterDistance_COG_v2.tif' },
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
              cadasterDistance: 0,
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
                ['>=', ['band', 8], ['var', 'cadasterDistance']],
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
          name: 'Wind Power Density',
        }, {
          ...nutsStyle,
          layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_AT_Zaehlsprengel_3857',
          protocol: 'geoserverTileLayer',
          name: 'Admin units (Zählsprengel)',
          visible: true,
          minZoom: 12,
          selection: {
            mode: 'single',
          },
          tooltip: true,
          allowedParameters: ['name'],
        }, {
          protocol: 'GeoJSON',
          visible: true,
          name: 'Wind turbine detections',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/wind_turbines/wind-turbines-austria-version1.geojson',
          style: {
            strokeColor: '#ff0000',
            width: 4,
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
        city: 'Austria',
        siteName: 'global',
        description: 'Wind Turbine Detections',
        navigationDescription: 'Wind Turbine Detections',
        indicator: 'REP6',
        lastIndicatorValue: null,
        indicatorName: 'Wind Turbines',
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
        display: [{
          dateFormatFunction: (date) => `${DateTime.fromFormat(date, 'yyyyMMdd').toFormat('yyyy-MM-dd')}/${DateTime.fromFormat(date, 'yyyyMMdd').plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Sentinel 2 L2A',
          minZoom: 13,
          timeFromProperty: true,
        }, {
          minZoom: 13,
          protocol: 'GeoJSON',
          tooltip: true,
          getTimeFromProperty: 'detection_time',
          visible: true,
          name: 'Wind turbine detections',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/wind_turbines/wind-turbines-austria-version1.geojson',
          style: {
            strokeColor: '#ff0000',
            width: 5,
          },
          selection: {
            mode: 'single',
          },
        }, {
          maxZoom: 13,
          protocol: 'GeoJSON',
          clusterLayer: true,
          visible: true,
          name: 'Wind turbine detections clusters',
          url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/wind_turbines/wind-turbines-austria-version1.geojson',
        }],
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
        description: 'Micro Hydropower Potential Assessment',
        navigationDescription: 'Micro Hydropower',
        indicator: 'REP5',
        lastIndicatorValue: null,
        indicatorName: 'Micro Hydropower',
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
        display: [{
          minZoom: 5,
          protocol: 'GeoJSON',
          tooltip: {
            tooltipFormatFunction: (feature) => [
              `ws_code: ${feature.get('ws_code')}`,
              `Area: ${Number((feature.get('area_sqm')) / 10e6).toFixed(2)} km²`,
              `Flow Rate: ${Number(feature.get('flowrate')).toFixed(1)} m³/s`,
              'Gravity: 9.82 m/s²',
              'Density: 1000 kg/m³',
              `Power rating: ${Number(feature.get('pr_mw')).toFixed(2)} MW`,
              `Annual power: ${Number(feature.get('annp')).toFixed(0)} kWh`,
              `Annual power potential: ${Number(feature.get('gwh_pot')).toFixed(2)} gWh`,
              'Capacity: 50 %',
              `Annual power actual: ${(Number(feature.get('pr_mw')) / 2).toFixed(2)} MW`,
            ],
          },
          visible: true,
          name: 'Micro Hydropower Potential',
          url: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_hydro_power_potential&outputFormat=application/json',
          styleFunction: (feature) => {
            let radius = 0;
            const powerGenerationValue = feature.get('gwh_pot');
            if (powerGenerationValue > 0 && powerGenerationValue < 1) {
              radius = 5;
            } else if (powerGenerationValue >= 1 && powerGenerationValue <= 10) {
              radius = 8;
            } else if (powerGenerationValue > 10 && powerGenerationValue <= 50) {
              radius = 12;
            } else if (powerGenerationValue > 50 && powerGenerationValue <= 750) {
              radius = 16;
            } else {
              radius = 20;
            }
            const fill = new Fill({
              color: 'rgba(255, 255, 255, 0.3)',
            });
            const stroke = new Stroke({
              width: 3,
              color: '#003247',
            });
            const style = new Style({
              image: new Circle({
                fill,
                stroke,
                radius,
              }),
            });
            return style;
          },
          selection: {
            mode: 'single',
          },
        }, {
          minZoom: 5,
          protocol: 'GeoJSON',
          visible: true,
          name: 'Micro Hydropower Watersheds',
          urlTemplateSelectedFeature: 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_hydro_watersheds&outputFormat=application/json&cql_filter=hydropowerpotential_ws_code={ws_code}',
          style: {
            strokeColor: '#003247',
            width: 2,
            fillColor: 'rgba(179, 240, 252, 0.5)',
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
              label: 'Global Horizontal Irradiation [kWh/m²/day]',
              id: 'solar',
              header: true,
              min: 0,
              max: 8,
              range: [0, 8],
              changeablaDataset: {
                items: [
                  {
                    description: 'Annual',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Annual_COG_clipped_3857_fixed.tif',
                  },
                  {
                    description: 'Fall',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Fall_COG_clipped_3857_fixed.tif',
                  },
                  {
                    description: 'Spring',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Spring_COG_clipped_3857_fixed.tif',
                  },
                  {
                    description: 'Summer',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Summer_COG_clipped_3857_fixed.tif',
                  },
                  {
                    description: 'Winter',
                    url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Winter_COG_clipped_3857_fixed.tif',
                  },
                ],
              },
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
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/v2/SolarPowerPotential_Annual_COG_clipped_3857_fixed.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/DHI/Natura2000_Austria_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              solarMin: 2,
              solarMax: 4,
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
                ['>', ['band', 1], 1],
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
                normalize(['band', 1], 'solarMin', 'solarMax'),
                ...getColorStops('viridis', 0, 1, 64, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Solar Energy',
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
        display: [{
          protocol: 'xyz',
          tileSize: 256,
          opacity: 1,
          url: 'https://tileserver.geoville.com/heatMap/LST_aggregated_reproc_filt_clipped_AT_buffered/%7Bz%7D/%7Bx%7D/%7By%7D.png/LST_aggregated_reproc_filt_clipped_AT_buffered/{z}/{x}/{y}.png',
          name: 'Heat Explorer',
        }, {
          name: 'Communities',
          id: 'heatmap_vector',
          styleFile: 'data/gtif/data/heatmap_vector.json',
          attribution: '{}',
          visible: true,
          protocol: 'vectortile',
          tooltip: {
            // trigger: 'singleclick',
            tooltipFormatFunction: (feature) => [
              `${feature.get('gemeinde')}`,
              `Mean temperature: ${Number(feature.get('mean_temp')).toFixed(2)}°C`,
              `Maximum temperature: ${Number(feature.get('max_temp')).toFixed(2)}°C`,
              `Minimum temperature: ${Number(feature.get('min_temp')).toFixed(2)}°C`,
              `Population exposed to surface temperature >35°C: ${Number(feature.get('percentage')).toFixed(2)}%`,
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
        city: 'Austria',
        siteName: 'global',
        description: 'Snowdepth',
        indicator: 'EO4A',
        lastIndicatorValue: null,
        indicatorName: 'Snow depth',
        // navigationDescription: 'EO4Alps',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: getDailyDates('2020-10-01', '2022-06-30'),
        inputData: [''],
        yAxis: '',
        display: {
          selectedTime: '2022-01-30',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          baseUrl: 'https://snow-app-gte2s.hub.eox.at/?',
          name: 'Snow depth',
          layers: 'SNOW-DEPTH',
          attribution: '{Snow depth: https://snow-app-gte2s.hub.eox.at/ }',
          protocol: 'WMS',
          dateFormatFunction: (date) => (
            `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}`
          ),
          projection: 'EPSG:4326',
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
        description: 'Snow water equivalent',
        indicator: 'EO4A2',
        lastIndicatorValue: null,
        indicatorName: 'Snow water equivalent',
        // navigationDescription: 'EO4Alps',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: getDailyDates('2020-10-01', '2022-06-30'),
        inputData: [''],
        yAxis: '',
        display: {
          selectedTime: '2022-01-30',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          baseUrl: 'https://snow-app-gte2s.hub.eox.at/?',
          name: 'Snow water equivalent',
          layers: 'SWE',
          attribution: '{Snow water equivalent: https://snow-app-gte2s.hub.eox.at/ }',
          protocol: 'WMS',
          dateFormatFunction: (date) => (
            `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}`
          ),
          projection: 'EPSG:4326',
        },
      },
    },
  },
];
