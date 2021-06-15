// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import { DateTime } from 'luxon';
import { latLng, latLngBounds } from 'leaflet';
import { shTimeFunction, shS2TimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { E13bRemovedFtrs } from '@/config/otherdata';
import availableDates from '@/config/data_dates.json';

export const dataPath = './eodash-data/internal/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/internal/pois_eodash.json',
  },
];

export const indicatorsDefinition = Object.freeze({
  C1: {
    indicator: 'Combined 1',
    indicatorOverwrite: 'Port Activity & Air Quality',
    class: 'combined',
  },
  C2: {
    indicator: 'Combined 2',
    class: 'combined',
    hideInFilters: true,
  },
  C3: {
    indicator: 'Combined 3',
    class: 'combined',
    hideInFilters: true,
  },
  E1: {
    indicator: 'Status of metallic ores (Archived)',
    class: 'economic',
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)', 'classification', 'TIMESTAMP UTC', 'TYPE_NAME', 'LENGTH'],
    },
  },
  E1_S2: {
    indicator: 'Status of metallic ores',
    class: 'economic',
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E1a: {
    indicator: 'Status of non-metallic ores (Archived)',
    class: 'economic',
    story: '/eodash-data/stories/E1a',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['classification'],
    },
  },
  E1a_S2: {
    indicator: 'Status of non-metallic ores (Archived)',
    class: 'economic',
    story: '/eodash-data/stories/E1a',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E2: {
    indicator: 'Volume of oil stockpiled (Archived)',
    class: 'economic',
    story: '/eodash-data/stories/E2',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['classification'],
    },
  },
  E2_S2: {
    indicator: 'Volume of oil stockpiled',
    class: 'economic',
    story: '/eodash-data/stories/E2',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E2a: {
    indicator: 'Level of flaring activity',
    class: 'economic',
  },
  E3: {
    indicator: 'Inventory levels of factory inputs',
    class: 'economic',
  },
  E4: {
    indicator: 'Production activity of intermediate goods',
    class: 'economic',
    story: '/eodash-data/stories/E4',
  },
  E5: {
    indicator: 'Inventory levels of intermediate goods',
    class: 'economic',
    story: '/eodash-data/stories/E5',
  },
  E6: {
    indicator: 'Inventory levels of factory inputs',
    class: 'economic',
  },
  E7: {
    indicator: 'Production activity of finished goods',
    class: 'economic',
  },
  E8: {
    indicator: 'Inventory Levels',
    class: 'economic',
    story: '/eodash-data/stories/E8',
    maxDecimals: 5,
  },
  E9: {
    indicator: 'Construction activity',
    class: 'economic',
  },
  E10a1: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    story: '/eodash-data/stories/E10a1',
    largeSubAoi: true,
    baseLayers: [baseLayers.cloudless, baseLayers.terrainLight, {
      ...baseLayers.S2GLC,
      visible: true,
    }],
    legendUrl: 'eodash-data/data/LegendGLC.png',
  },
  E10a2: {
    indicator: 'Cum. proportion of total area under active mgmt.',
    class: 'agriculture',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
    baseLayers: [baseLayers.cloudless, baseLayers.terrainLight, {
      ...baseLayers.S2GLC,
      visible: true,
    }],
    legendUrl: 'eodash-data/data/LegendGLC.png',
    maxDecimals: 4,
  },
  E10a3: {
    indicator: 'Evolution of the cultivated areas for production of white asparagus',
    class: 'agriculture',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a5: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    story: '/eodash-data/stories/E10a5',
    largeSubAoi: true,
  },
  E10a6: {
    indicator: 'Harvested parcels/area evolution over time',
    class: 'agriculture',
    story: '/eodash-data/stories/E10a6',
    largeSubAoi: true,
    maxDecimals: 4,
  },
  E10a8: {
    indicator: 'Cumulative harvested area',
    class: 'agriculture',
    story: '/eodash-data/stories/E10a8',
    largeSubAoi: true,
  },
  E10a9: {
    indicator: 'Tomatoes cultivation',
    class: 'agriculture',
    largeSubAoi: true,
    story: '/eodash-data/stories/E10a9',
  },
  E10b: {
    indicator: 'Field preparation activity',
    class: 'agriculture',
  },
  E11: {
    indicator: 'Volume of activity at shopping centers',
    class: 'economic',
    story: '/eodash-data/stories/E11',
  },
  E11a: {
    indicator: 'Indicator definition placeholder',
    class: 'economic',
  },
  E12a: {
    indicator: 'Volume of activity logistic interchange centers',
    class: 'economic',
  },
  E12b: {
    indicator: 'Throughput at border crossing points',
    class: 'economic',
    story: '/eodash-data/stories/E12b',
    midSubAoi: true,
    maxDecimals: 3,
  },
  E12c: {
    indicator: 'Number of Trucks (Beta)',
    class: 'economic',
    customAreaFeatures: true,
    customAreaIndicator: true,
    largeSubAoi: true,
    featuresClustering: true,
    disableCompare: true,
    story: '/eodash-data/stories/E12c',
  },
  E13a: {
    indicator: 'Throughput at principal rail stations',
    class: 'economic',
  },
  E13c: {
    class: 'economic',
    story: '',
  },
  E13b: {
    indicator: 'Throughput at principal hub airports',
    class: 'economic',
    story: '/eodash-data/stories/E13b_PLES',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
    largeTimeDuration: true,
  },
  E13b2: {
    indicator: 'Throughput at principal hub airports Aerospacelab archived',
    class: 'economic',
    story: '/eodash-data/stories/E13b',
  },
  E13d: {
    indicator: 'Airports: airplanes traffic',
    class: 'economic',
    story: '/eodash-data/stories/E13d',
  },
  E13d2: {
    indicator: 'Airports: airplanes traffic',
    class: 'economic',
    story: '/eodash-data/stories/E13d',
    hideInFilters: true,
    baseLayers: [baseLayers.terrainLight, {
      ...baseLayers.cloudless,
      visible: true,
    }],
    midSubAoi: true,
    mapTimeLabelExtended: true,
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmm"),
      url: './eodash-data/features/E13d/E13d_{aoiID}_{featuresTime}.geojson',
    },
    largeTimeDuration: true,
  },
  E13e: {
    indicator: 'Maritime traffic: cargo',
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13f: {
    indicator: 'Maritime traffic: fishing',
    hideInFilters: true,
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13g: {
    indicator: 'Maritime traffic: tanker',
    hideInFilters: true,
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13h: {
    indicator: 'Maritime traffic: tug',
    hideInFilters: true,
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13i: {
    indicator: 'Maritime traffic: search, rescue',
    hideInFilters: true,
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13l: {
    indicator: 'Maritime traffic: pleasure craft',
    hideInFilters: true,
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13m: {
    indicator: 'Maritime traffic: passenger',
    hideInFilters: true,
    class: 'economic',
    story: '/eodash-data/stories/E13e',
  },
  E13n: {
    indicator: 'Changes in traffic fluxes',
    class: 'economic',
    story: '/eodash-data/stories/E1',
  },
  H1: {
    indicator: 'Number of temp. treatment sites',
    class: 'health',
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
  },
  N1a: {
    hideInFilters: true,
    class: 'air',
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1b: {
    indicator: 'CAMS Air quality',
    class: 'air',
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1c: {
    hideInFilters: true,
    class: 'air',
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1d: {
    hideInFilters: true,
    class: 'air',
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  NASAPopulation: {
    indicator: 'Population',
    class: 'economic',
    story: '/data/trilateral/NASAPopulation',
  },
  N2: {
    indicator: 'CO2 emissions',
    class: 'air',
    largeTimeDuration: true,
  },
  N3: {
    indicator: 'CHL concentration',
    class: 'water',
    story: '/eodash-data/stories/N3',
    largeSubAoi: true,
  },
  N3a2: {
    indicator: 'CHL concentration',
    class: 'water',
    story: '/eodash-data/stories/N3a2',
    largeSubAoi: true,
  },
  N4a: {
    indicator: 'Changes in land fill sites',
    class: 'land',
    story: '/eodash-data/stories/N4a',
    baseLayers: [baseLayers.cloudless, baseLayers.terrainLight, {
      ...baseLayers.S2GLC,
      visible: true,
    }],
    legendUrl: 'eodash-data/data/LegendGLC.png',
  },
  N4b: {
    indicator: 'Illegal waste levels',
    class: 'land',
  },
  N3c: {
    indicator: 'CMEMS Water Quality',
    class: 'water',
    largeTimeDuration: true,
    largeSubAoi: true,
    story: '/eodash-data/stories/N3c',
  },
  N4c: {
    indicator: 'Changes in land fill sites',
    class: 'land',
    story: '/eodash-data/stories/N4c',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HH"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
    baseLayers: [baseLayers.cloudless, baseLayers.terrainLight, {
      ...baseLayers.S2GLC,
      visible: true,
    }],
    legendUrl: 'eodash-data/data/LegendGLC.png',
  },
  GG: {
    indicator: 'Mobility',
    class: 'economic',
    disableTimeSelection: true,
    countrySelection: true,
    story: '/eodash-data/stories/GG-GG',
  },
  CV: {
    indicator: 'Covid cases',
    class: 'health',
    disableTimeSelection: true,
    countrySelection: true,
    story: '/eodash-data/stories/CV-CV',
  },
  OW: {
    indicator: 'Vaccinations',
    class: 'health',
    disableTimeSelection: true,
    countrySelection: true,
    hideInFilters: true,
    story: '/eodash-data/stories/OW-OW',
  },
  /*
  GSA: {
    indicator: 'Mobility',
    class: 'economic',
    disableTimeSelection: true,
    borderSelection: true,
    story: '/eodash-data/stories/GSA-GSA',
  },
  */
  CDS1: {
    indicator: 'CDS Data',
    class: 'air',
    story: '/eodash-data/stories/CDS',
  },
  CDS2: {
    indicator: 'Relative humidity',
    class: 'air',
    story: '/eodash-data/stories/CDS',
    hideInFilters: true,
  },
  CDS3: {
    indicator: 'Wind U field',
    class: 'air',
    story: '/eodash-data/stories/CDS',
    hideInFilters: true,
  },
  CDS4: {
    indicator: 'Wind V field',
    class: 'air',
    story: '/eodash-data/stories/CDS',
    hideInFilters: true,
  },
  d: { // dummy for locations without Indicator code
    indicator: 'Upcoming data',
    class: 'economic',
  },
});

export const layerNameMapping = Object.freeze({
  // "inputdata" -> wms layer name and baseurl
  '[NEW] Planetscope COVID-19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  'PlanetScope - COVID19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  'Planetscope COVID-19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  '[NEW] Planet COVID-19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  '[NEW] Pleiades': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES',
  },
  'Pleiades - COVID19': {
    layers: 'NEW_PLEIADES_COVID19',
  },
  'Deimos - COVID19': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'DEIMOS',
  },
  '[NEW] Pleiades COVID-19': {
    layers: 'NEW_PLEIADES_COVID19',
  },
  '[NEW] Pleiades COVID19': {
    layers: 'NEW_PLEIADES_COVID19',
  },
  '[NEW] Pleiades - 2.8m - COVID19': {
    layers: 'NEW_PLEIADES_28_COVID19',
  },
  '[NEW] Pleiades 16bit': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_16BIT',
  },
  'Sentinel 2 L2A': {
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    dateFormatFunction: shS2TimeFunction,
  },
  S2L2A: {
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    dateFormatFunction: shS2TimeFunction,
  },
  S1GRD: {
    layers: 'E8_SENTINEL1',
  },
  'S1A - GRD': {
    layers: 'E8_SENTINEL1',
  },
});

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
  minMapZoom: 2,
  maxMapZoom: 18,
  bounds: latLngBounds(latLng([35, -10]), latLng([70, 33])),
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

export const cmemsDisplay = {
  tileSize: 256,
  minZoom: 1,
  layers: 'CHL',
  legendUrl: 'eodash-data/data/cmems-legend.png',
  dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T00:00:00Z'"),
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

const getFortnightIntervalDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = end === 'now' ? DateTime.utc().minus({ days: 13 }) : DateTime.fromISO(end).minus({ days: 13 });
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push([
      DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'),
      DateTime.fromISO(currentDate).plus({ days: 13 }).toFormat('yyyy-MM-dd'),
    ]);
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
};

const getDaily2DayIntervalDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push([
      DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'),
      DateTime.fromISO(currentDate).plus({ days: 2 }).toFormat('yyyy-MM-dd'),
    ]);
    currentDate = DateTime.fromISO(currentDate).plus({ days: 1 });
  }
  return dateArray;
};

// AOI_ID key with value = array of additional ISO times to be used in map
// export const additionalMapTimes = {
//   'AT4-E13b': {
//     time: ['2020-11-19T15:37:27'],
//     eoSensor: ['DEIMOS'],
//     inputData: ['Sentinel 2 L2A'],
//     colorCode: ['BLUE'],
//   },
// };
// AOI_ID key with value = array of ISO times to be excluded from map
// overrides set 'Input Data' on the entries
// export const excludeMapTimes = {
//   'AT4-E13b': ['2020-10-04T09:57:22'],
// };

export const additionalMapTimes = {
  ...E13bRemovedFtrs,
};

export const excludeMapTimes = {
};

export const replaceMapTimes = {
  'GR4-N4c': {
    time: ['2020-02-26T00:00:00', '2020-05-20T00:00:00', '2020-06-06T00:00:00'],
    eoSensor: ['Pleiades', 'Pleiades', 'Deimos'],
    colorCode: Array(3).fill('BLUE'),
    inputData: ['Pleiades - COVID19', 'Pleiades - COVID19', 'Deimos - COVID19'],
  },
};

const wkt = new Wkt();

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        aoiID: 'GG',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Mobility Data',
        indicatorName: '(select country to load data)',
        indicator: 'GG',
        lastIndicatorValue: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        inputData: [''],
        yAxis: 'percent change from baseline',
        time: ['TBD'],
        display: {
        },
      },
    },
  },
  /*
  {
    properties: {
      indicatorObject: {
        aoiID: 'GSA',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Truck border crossing times',
        indicatorName: '(select point to load data)',
        indicator: 'GSA',
        lastIndicatorValue: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        inputData: [''],
        yAxis: 'waiting time (min)',
        time: ['TBD'],
        display: {
        },
      },
    },
  },
  */
  {
    properties: {
      indicatorObject: {
        aoiID: 'CV',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Covid19 Data',
        indicatorName: '(select country to load data)',
        indicator: 'CV',
        lastIndicatorValue: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        inputData: [''],
        yAxis: 'aggregated covid cases',
        time: ['TBD'],
        display: {
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'OW',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Vaccination Data',
        indicatorName: '(select country to load data)',
        indicator: 'OW',
        lastIndicatorValue: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        inputData: [''],
        yAxis: 'vaccination data',
        time: ['TBD'],
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
        time: getFortnightIntervalDates('2019-01-07', 'now'),
        inputData: [''],
        yAxis: 'Tropospheric NO2 (μmol/m2)',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Tropospheric NO2',
          layers: 'NO2-VISUALISATION',
          minZoom: 1,
          legendUrl: 'eodash-data/data/no2Legend.png',
          dateFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            url: `https://shservices.mundiwebservices.com/ogc/fis/${shConfig.shInstanceId}?LAYER=NO2_RAW_DATA&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
            callbackFunction: (responseJson, indicator) => {
              if (Array.isArray(responseJson.C0)) {
                const data = responseJson.C0;
                const newData = {
                  time: [],
                  measurement: [],
                  referenceValue: [],
                  colorCode: [],
                };
                data.sort((a, b) => ((DateTime.fromISO(a.date) > DateTime.fromISO(b.date))
                  ? 1
                  : -1));
                data.forEach((row) => {
                  if (row.basicStats.max < 5000) {
                    // leaving out falsely set nodata values disrupting the chart
                    newData.time.push(DateTime.fromISO(row.date));
                    newData.colorCode.push('');
                    newData.measurement.push(row.basicStats.mean);
                    newData.referenceValue.push(`[${row.basicStats.mean}, ${row.basicStats.stDev}, ${row.basicStats.max}, ${row.basicStats.min}]`);
                  }
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
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ1',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'NO2 (μmol/m2)',
        display: {
          styles: 'sh_OrangesTransparent40_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged NO2',
          layers: 'composition_europe_no2_analysis_surface',
          legendUrl: 'eodash-data/data/cams_no2.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ2',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged PM2.5',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'PM2.5 (μg/m3)',
        display: {
          styles: 'sh_PurplesTransparent40_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          layers: 'composition_europe_pm2p5_analysis_surface',
          legendUrl: 'eodash-data/data/cams_pm25.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ3',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged PM10',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'PM10 (μg/m3)',
        display: {
          styles: 'sh_GreensTransparent40_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          layers: 'composition_europe_pm10_analysis_surface',
          legendUrl: 'eodash-data/data/cams_pm10.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ4',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged O3',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'O3 (μg/m3)',
        display: {
          styles: 'sh_OrangesTransparent240_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          layers: 'composition_europe_o3_analysis_surface',
          legendUrl: 'eodash-data/data/cams_o3.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
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
        description: 'Population',
        indicator: 'NASAPopulation',
        lastIndicatorValue: null,
        indicatorName: 'Population density 2020',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W6',
        time: ['2020-05-01T00:00:00Z'],
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Population',
          layers: 'POPULATION_DENSITY',
          legendUrl: 'data/trilateral/NASAPopulation_legend.png',
          minZoom: 1,
          maxMapZoom: 7,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          disableCompare: true,
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
        description: 'CDS Data',
        indicator: 'CDS1',
        lastIndicatorValue: null,
        indicatorName: 'Temperature - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.VIS_2MTEMPERATURE,
        inputData: [],
        yAxis: 'Temperature °C',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'VIS_2MTEMPERATURE',
          legendUrl: 'eodash-data/data/temperature.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
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
        description: 'Relative humidity 1000HPA (CDS)',
        indicator: 'CDS2',
        lastIndicatorValue: null,
        indicatorName: 'Relative humidity 1000HPA - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.VIS_RELHUMIDITY1000HPA,
        inputData: [],
        yAxis: 'Relative Humidity 1000HPA',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'VIS_RELHUMIDITY1000HPA',
          legendUrl: 'eodash-data/data/humidity.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
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
        description: 'Wind U field (CDS)',
        indicator: 'CDS3',
        lastIndicatorValue: null,
        indicatorName: 'Wind U field - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.VIS_WIND_U_10M,
        inputData: [],
        yAxis: 'wind',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'VIS_WIND_U_10M',
          legendUrl: 'eodash-data/data/windu_cds.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
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
        description: 'Wind V field (CDS)',
        indicator: 'CDS4',
        lastIndicatorValue: null,
        indicatorName: 'Wind V field - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.VIS_WIND_V_10M,
        inputData: [],
        yAxis: 'wind',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'VIS_WIND_V_10M',
          legendUrl: 'eodash-data/data/windv_cds.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9999,
    latlng: latLng([45.197522, 13.029785]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9999,
        aoi: latLng([45.197522, 13.029785]),
        aoiID: 'NorthAdriatic',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic - Chlorophyll-a concentration',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.174395 44.778037,12.196361 44.816998,12.085149 45.405263,12.426024 45.583514,13.153667 45.779148,13.603981 45.811687,13.804426 45.675662,13.823647 45.596962,13.626039 45.443008,13.549156 45.433376,13.626039 45.323461,13.713905 45.095238,13.78383 44.980605,13.830519 44.892158,13.839389 44.499195,12.234821 44.481556,12.06659 44.581469,12.174395 44.778037))').toJson(),
          }],
        },
        time: availableDates.N3_CUSTOM,
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM',
          legendUrl: 'eodash-data/data/waterLegend.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9998,
    latlng: latLng([43.4, 4.94]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9999,
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDelta',
        country: ['FR'],
        city: 'Rhone Delta - Chlorophyll-a concentration',
        siteName: 'Fos-sur-Mer',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        time: availableDates.N3_CUSTOM,
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM',
          legendUrl: 'eodash-data/data/waterLegend.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9997,
    latlng: latLng([45.197522, 13.0297851]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9997,
        aoi: latLng([45.197522, 13.0297851]),
        aoiID: 'NorthAdriaticTSM',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic - Total Suspended Matter',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.174395 44.778037,12.196361 44.816998,12.085149 45.405263,12.426024 45.583514,13.153667 45.779148,13.603981 45.811687,13.804426 45.675662,13.823647 45.596962,13.626039 45.443008,13.549156 45.433376,13.626039 45.323461,13.713905 45.095238,13.78383 44.980605,13.830519 44.892158,13.839389 44.499195,12.234821 44.481556,12.06659 44.581469,12.174395 44.778037))').toJson(),
          }],
        },
        time: availableDates.N3_CUSTOM_TSMNN,
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TSMNN',
          legendUrl: 'eodash-data/data/waterLegend_tsm.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9996,
    latlng: latLng([43.4, 4.9400001]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9996,
        aoi: latLng([43.4, 4.9400001]),
        aoiID: 'RhoneDeltaTSM',
        country: ['FR'],
        city: 'Rhone Delta - Total Suspended Matter',
        siteName: 'Fos-sur-Mer',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        time: availableDates.N3_CUSTOM_TSMNN,
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TSMNN',
          legendUrl: 'eodash-data/data/waterLegend_tsm.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
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
        description: 'Number of Trucks (Beta)',
        indicator: 'E12c',
        lastIndicatorValue: 'Regional Truck Traffic Motorways',
        indicatorName: 'Motorways',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-15 35, -15 70, 40 70, 40 35, -15 35))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        eoSensor: ['2017-06-30', '2018-06-30', '2019-06-30', '2020-06-30'],
        aoi: null,
        aoiID: 'W2',
        time: availableDates.E12C_NEW_MOTORWAY,
        inputData: [''],
        yAxis: 'Number of trucks detected',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Aggregated Truck Traffic 10km',
          layers: 'E12C_NEW_MOTORWAY',
          legendUrl: 'eodash-data/data/E12c-legend.png',
          minZoom: 1,
          maxZoom: 10,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-01-01')}/${DateTime.fromISO(date).toFormat('yyyy-12-31')}`,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((5 45,5 50,15 50,15 45,5 45))').toJson(),
            }],
          },
          features: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'id, sum_observations, ST_AsText(geometry) as "geometry", truck_count_normalized',
              where: 'osm_value=1 AND date_part(\'year\',time)={featuresTime} AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
              limit: '5000',
            },
            style: {
              radius: 3,
              weight: 1,
            },
            featureLimit: 5000,
            allowedParameters: ['osm_name', 'truck_count_normalized', 'sum_observations'],
            dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy')}`,
            callbackFunction: (responseJson) => { // geom from wkb to geojson features
              const ftrs = [];
              if (Array.isArray(responseJson[0].src)) {
                responseJson[0].src.forEach((ftr) => {
                  ftrs.push({
                    type: 'Feature',
                    properties: ftr,
                    geometry: wkt.read(ftr.geometry).toJson(),
                  });
                });
              }
              const ftrColl = {
                type: 'FeatureCollection',
                features: ftrs,
              };
              return ftrColl;
            },
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
          areaIndicator: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'sum(truck_count_normalized), time',
              group: 'time',
              where: 'osm_value=1 AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
            },
            callbackFunction: (responseJson, indicator) => {
              if (Array.isArray(responseJson[0].src)) {
                const data = responseJson[0].src;
                const newData = {
                  time: [],
                  measurement: [],
                  colorCode: [],
                  referenceValue: [],
                };
                data.sort((a, b) => ((DateTime.fromISO(a.time) > DateTime.fromISO(b.time))
                  ? 1
                  : -1));
                data.forEach((row) => {
                  let updateDate = row.time;
                  // temporary workaround until DB gets updated 2020-01-01 - 2020-04-01
                  if (row.time === '2020-01-01T00:00:00') {
                    updateDate = '2020-04-01T00:00:00';
                  }
                  newData.time.push(DateTime.fromISO(updateDate)); // actual data
                  newData.measurement.push(Math.round(row.sum * 10) / 10); // actual data
                  newData.colorCode.push('BLUE'); // made up data
                  newData.referenceValue.push('0'); // made up data
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
        city: 'Europe',
        siteName: 'global',
        description: 'Number of Trucks (Beta)',
        indicator: 'E12c',
        lastIndicatorValue: 'Regional Truck Traffic Primary',
        indicatorName: 'Primary Roads',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-15 35, -15 70, 40 70, 40 35, -15 35))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        eoSensor: ['2017-06-30', '2018-06-30', '2019-06-30', '2020-06-30'],
        aoi: null,
        aoiID: 'W3',
        time: availableDates.E12D_NEW_PRIMARYROADS,
        inputData: [''],
        yAxis: 'Number of trucks detected',
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Aggregated Truck Traffic 10km',
          layers: 'E12D_NEW_PRIMARYROADS',
          legendUrl: 'eodash-data/data/E12c-legend.png',
          minZoom: 1,
          maxZoom: 10,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-01-01')}/${DateTime.fromISO(date).toFormat('yyyy-12-31')}`,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((5 45,5 50,15 50,15 45,5 45))').toJson(),
            }],
          },
          features: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'id, sum_observations, ST_AsText(geometry) as "geometry", truck_count_normalized, time',
              where: 'osm_value=3 AND date_part(\'year\',time)={featuresTime} AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
              limit: '5000',
            },
            style: {
              radius: 3,
              weight: 1,
            },
            featureLimit: 5000,
            allowedParameters: ['truck_count_normalized', 'sum_observations'],
            dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy')}`,
            callbackFunction: (responseJson) => { // geom from wkb to geojson features
              const ftrs = [];
              if (Array.isArray(responseJson[0].src)) {
                responseJson[0].src.forEach((ftr) => {
                  ftrs.push({
                    type: 'Feature',
                    properties: ftr,
                    geometry: wkt.read(ftr.geometry).toJson(),
                  });
                });
              }
              const ftrColl = {
                type: 'FeatureCollection',
                features: ftrs,
              };
              return ftrColl;
            },
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
          areaIndicator: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'sum(truck_count_normalized), time',
              group: 'time',
              where: 'osm_value=3 AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
            },
            callbackFunction: (responseJson, indicator) => {
              if (Array.isArray(responseJson[0].src)) {
                const data = responseJson[0].src;
                const newData = {
                  time: [],
                  measurement: [],
                  colorCode: [],
                  referenceValue: [],
                };
                data.sort((a, b) => ((DateTime.fromISO(a.time) > DateTime.fromISO(b.time))
                  ? 1
                  : -1));
                data.forEach((row) => {
                  let updateDate = row.time;
                  // temporary workaround until DB gets updated 2020-01-01 - 2020-04-01
                  if (row.time === '2020-01-01T00:00:00') {
                    updateDate = '2020-04-01T00:00:00';
                  }
                  newData.time.push(DateTime.fromISO(updateDate)); // actual data
                  newData.measurement.push(Math.round(row.sum * 10) / 10); // actual data
                  newData.colorCode.push('BLUE'); // made up data
                  newData.referenceValue.push('0'); // made up data
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
          },
        },
      },
    },
  },
  {
    id: 9995,
    latlng: latLng([40.985, 1.769]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9995,
        aoi: latLng([40.985, 1.769]),
        aoiID: 'Barcelona',
        country: ['ES'],
        city: 'Barcelona - Chlorophyll-a concentration',
        siteName: 'Barcelona',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.516544 40.485512,2.522036 41.562459,2.291387 41.480243,2.211372 41.416219,2.164693 41.3132,2.049368 41.27401,1.917569 41.26782,1.692412 41.212083,1.448034 41.174899,1.266809 41.129423,1.16796 41.077707,0.950799 41.027932,0.726123 40.810478,0.849188 40.722691,0.85468 40.68523,0.659705 40.6644,0.549872 40.576882,0.483966 40.485017,2.516544 40.485512))').toJson(),
          }],
        },
        time: availableDates.N3_CUSTOM,
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM',
          legendUrl: 'eodash-data/data/waterLegend.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9994,
    latlng: latLng([40.985, 1.769]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9994,
        aoi: latLng([40.985, 1.769]),
        aoiID: 'BarcelonaTSM',
        country: ['ES'],
        city: 'Barcelona - Total Suspended Matter',
        siteName: 'Barcelona',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.516544 40.485512,2.522036 41.562459,2.291387 41.480243,2.211372 41.416219,2.164693 41.3132,2.049368 41.27401,1.917569 41.26782,1.692412 41.212083,1.448034 41.174899,1.266809 41.129423,1.16796 41.077707,0.950799 41.027932,0.726123 40.810478,0.849188 40.722691,0.85468 40.68523,0.659705 40.6644,0.549872 40.576882,0.483966 40.485017,2.516544 40.485512))').toJson(),
          }],
        },
        time: availableDates.N3_CUSTOM_TSMNN,
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TSMNN',
          legendUrl: 'eodash-data/data/waterLegend_tsm.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
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
        description: 'CMEMS Water Quality',
        indicator: 'N3c',
        lastIndicatorValue: null,
        indicatorName: 'CMEMS Water Quality',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: getDailyDates('2020-01-07', DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        externalData: {
          label: 'Copernicus Marine Service - Product Details',
          url: 'https://resources.marine.copernicus.eu/?option=com_csw%20&view=details%20&product_id=OCEANCOLOUR_MED_CHL_L4_NRT_OBSERVATIONS_009_041',
        },
        display: [{
          name: 'CHL L4 Product',
          legendUrl: 'eodash-data/data/cmems-legend.png',
          combinedLayers: [
            {
              ...cmemsDisplay,
              baseUrl: 'https://nrt.cmems-du.eu/thredds/wms/dataset-oc-atl-bio-multi-l4-chl_interpolated_1km_daily-rt?COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Atlantic coast CHL L4 Product',
              bounds: latLngBounds(latLng([20, -45]), latLng([66, 10.5])),
            }, {
              ...cmemsDisplay,
              baseUrl: 'https://nrt.cmems-du.eu/thredds/wms/dataset-oc-med-chl-multi-l4-interp_1km_daily-rt-v02?COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Mediterranean CHL L4 Product',
              bounds: latLngBounds(latLng([30, -6]), latLng([46, 37])),
            }, {
              ...cmemsDisplay,
              baseUrl: 'https://nrt.cmems-du.eu/thredds/wms/dataset-oc-bs-chl-multi-l4-interp_1km_daily-rt-v02?COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Black sea CHL L4 Product',
              bounds: latLngBounds(latLng([40, 26.5]), latLng([48, 42])),
            },
          ],
        }, {
          ...cmemsDisplay,
          baseUrl: 'https://nrt.cmems-du.eu/thredds/wms/dataset-oc-bal-chl-olci_a-l3-nn_1km_daily-rt-v02?COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
          name: 'Baltic sea CHL L3 Product',
          visible: false,
          bounds: latLngBounds(latLng([53.25, 9]), latLng([65.85, 30.5])),
        }],
      },
    },
  },
  {
    id: 9993,
    latlng: latLng([51.954, 4.094]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9993,
        aoi: latLng([51.954, 4.094]),
        aoiID: 'NL3',
        country: ['NL'],
        city: 'Rotterdam port',
        description: 'Oil Storage Volume',
        indicator: 'E3',
        lastIndicatorValue: null,
        indicatorName: 'Oil Storage Volume',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.097986 51.948021,4.100561 51.954105,4.088116 51.957331,4.086485 51.953787,4.09584 51.948127,4.097986 51.948021))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['ICEYE-E3'],
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'ICEYE-E3',
          minZoom: 5,
          name: 'Oil silos volume change',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9991,
    latlng: latLng([48.87, 2.78]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9991,
        aoi: latLng([48.87, 2.78]),
        aoiID: 'FR16',
        country: ['FR'],
        city: 'Disneyland Paris',
        description: 'Volume of activity at shopping center',
        indicator: 'E11',
        lastIndicatorValue: null,
        indicatorName: 'Volume of activity at shopping center',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.76907 48.861299,2.76907 48.881707,2.798724 48.881707,2.798724 48.861299,2.76907 48.861299))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['ICEYE-E11'],
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'ICEYE-E11',
          minZoom: 5,
          maxZoom: 19,
          name: 'Disneyland Paris',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9990,
    latlng: latLng([52.244, 21.045]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9990,
        aoi: latLng([52.244, 21.045]),
        aoiID: 'PL7',
        country: ['PL'],
        city: 'Warsaw',
        description: 'Volume of activity at parking lot',
        indicator: 'E11a',
        lastIndicatorValue: null,
        indicatorName: 'Volume of activity at parking lot',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((21.038904 52.235632,21.038904 52.248981,21.052294 52.248981,21.052294 52.235632,21.038904 52.235632))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['ICEYE-E11A'],
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'ICEYE-E11A',
          minZoom: 5,
          maxZoom: 19,
          name: 'Warsaw parking lot',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9989,
    latlng: latLng([50.604, -2.37]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9989,
        aoi: latLng([50.604, -2.37]),
        aoiID: 'UK9',
        country: ['GB'],
        city: 'Weymouth',
        description: 'Ports: throughput',
        indicator: 'E13c',
        lastIndicatorValue: null,
        indicatorName: 'Ports: throughput',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-2.393477 50.585198,-2.393477 50.624746,-2.337859 50.624746,-2.337859 50.585198,-2.393477 50.585198))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['ICEYE-E12B'],
        inputData: [''],
        display: {
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'ICEYE-E12B',
          minZoom: 5,
          maxZoom: 18,
          name: 'Weimouth ships',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/E12b/E12b_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9988,
    latlng: latLng([50.04, 8.5]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9988,
        aoi: latLng([50.04, 8.5]),
        aoiID: 'DE18',
        country: ['DE'],
        city: 'Frankfurt am Main',
        description: 'Airports: Throughput',
        indicator: 'E13b',
        lastIndicatorValue: null,
        indicatorName: 'Airports: Throughput',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((8.516043 50.03769,8.516043 50.04915,8.533462 50.04915,8.533462 50.03769,8.516043 50.03769))').toJson(),
          }],
        },
        lastColorCode: null,
        time: ['2020-05-12T13:35:00'],
        inputData: [''],
        display: {
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'ICEYE-E13B',
          minZoom: 5,
          maxZoom: 18,
          name: 'Airports: Detected planes',
          features: {
            allowedParameters: [],
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9987,
    latlng: latLng([40.413, -1.23]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9987,
        aoi: latLng([40.413, -1.23]),
        aoiID: 'ES17',
        country: ['ES'],
        city: 'Teruel',
        description: 'Airports: Throughput',
        indicator: 'E13b',
        lastIndicatorValue: null,
        indicatorName: 'Airports: Throughput',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-1.245922 40.394281,-1.245922 40.429571,-1.20747 40.429571,-1.20747 40.394281,-1.245922 40.394281))').toJson(),
          }],
        },
        lastColorCode: null,
        time: ['2020-03-20T03:50:00', '2020-08-25T03:15:00'],
        inputData: [''],
        display: {
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'ICEYE-E13B',
          minZoom: 5,
          maxZoom: 18,
          name: 'Airports: Detected planes',
          features: {
            allowedParameters: [],
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
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
        description: 'TROPOMI CO',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'TROPOMI CO',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'WorldCO',
        time: getDaily2DayIntervalDates('2018-04-30', DateTime.utc().minus({ days: 3 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 5,
          minZoom: 0,
          opacity: 0.6,
          tileSize: 256,
          name: 'Tropospheric CO',
          url: '//obs.eu-de.otc.t-systems.com/s5p-pal-l3-external/maps/s5p-l3-co/3day/{time}/{z}/{x}/{-y}.png',
          legendUrl: 'data/trilateral/s5pCOLegend.png',
          dateFormatFunction: (date) => {
            // example path 2021/06/nrt-20210606-20210608-20210609
            const d1 = DateTime.fromISO(date[0]);
            const d2 = DateTime.fromISO(date[0]).plus({ days: 2 });
            const arr = [DateTime.fromISO(date[0]).plus({ days: 5 }), DateTime.utc()];
            const d3 = arr.reduce((pr, cu) => (pr < cu ? pr : cu)); // lower of "now" and d1+5
            let prefix = '001';
            if (d3.diff(d1, 'days').toObject().days < 5) {
              // two last products - difference from d1 and d3 lower than 5 days
              // the filename starts with 'nrt' otherwise '001'
              prefix = 'nrt';
            }
            // example dates
            // 17,19,22 .5
            // 3,5,8. 6
            // 4,6,9. 6
            // 5,7,9. 6
            // 6,8,9. 6 (today is 9.6.)
            const filePathFormatted = `${d1.toFormat('yyyy')}/${d1.toFormat('LL')}/${prefix}-${d1.toFormat('yyyyLLdd')}-${d2.toFormat('yyyyLLdd')}-${d3.toFormat('yyyyLLdd')}`;
            return filePathFormatted;
          },
        },
      },
    },
  },
];
