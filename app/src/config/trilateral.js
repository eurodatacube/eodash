// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import { latLng, latLngBounds } from 'leaflet';
import { DateTime } from 'luxon';
import { shTimeFunction } from '@/utils';

export const nasaEndpoints = [
  'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/',
];

export const indicatorsDefinition = Object.freeze({
  E1: {
    indicator: 'Status of metallic ores',
    class: 'economic',
    file: './data/trilateral/E1.csv',
    story: '/data/trilateral/E1',
  },
  E1a: {
    indicator: 'Status of non-metallic ores',
    class: 'economic',
    file: './data/trilateral/E1a.csv',
    story: '/data/trilateral/E1a',
  },
  E2: {
    indicator: 'Volume of oil stockpiled',
    class: 'economic',
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
  },
  E5: {
    indicator: 'Inventory levels of intermediate goods',
    class: 'economic',
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
    file: './data/trilateral/E8.csv',
    story: '/data/trilateral/E8_tri',
    largeSubAoi: true,
  },
  E9: {
    indicator: 'Construction activity',
    class: 'economic',
    file: './data/trilateral/E9.csv',
    story: '/data/trilateral/SG01-E9',
    largeSubAoi: true,
  },
  E10a1: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    file: './data/trilateral/E10a1.csv',
    story: '/data/trilateral/E10a1',
    largeSubAoi: true,
  },
  E10a2: {
    indicator: 'Cum. proportion of total area under active mgmt.',
    class: 'agriculture',
    file: './eodash-data/data/E10a2.csv',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a3: {
    indicator: 'Evolution of the cultivated areas for production of white asparagus',
    class: 'agriculture',
    file: './eodash-data/data/E10a3.csv',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a6: {
    indicator: 'Harvested parcels evolution over time',
    class: 'agriculture',
    file: './eodash-data/data/E10a6.csv',
    story: '/eodash-data/stories/E10a6',
    largeSubAoi: true,
  },
  E10a7: {
    indicator: 'Harvested area evolution over time',
    class: 'agriculture',
    file: './eodash-data/data/E10a7.csv',
    story: '/eodash-data/stories/E10a7',
    largeSubAoi: true,
  },
  E10a8: {
    indicator: 'Cumulative harvested area',
    class: 'agriculture',
    file: './eodash-data/data/E10a8.csv',
    story: '/eodash-data/stories/E10a8',
    largeSubAoi: true,
  },
  E10b: {
    indicator: 'Field preparation activity',
    class: 'agriculture',
  },
  E10c: {
    indicator: 'Rice Planted Area',
    class: 'agriculture',
    file: './data/trilateral/E10c.csv',
    story: '/data/trilateral/US05-E10c',
    largeSubAoi: true,
  },
  E11: {
    indicator: 'Volume of activity at shopping centers',
    class: 'economic',
  },
  E12a: {
    indicator: 'Volume of activity logistic interchange centers',
    class: 'economic',
  },
  E12b: {
    indicator: 'Throughput at border crossing points',
    class: 'economic',
  },
  E13a: {
    indicator: 'Throughput at principal rail stations',
    class: 'economic',
  },
  E13b: {
    indicator: 'Throughput at principal hub airports',
    class: 'economic',
    file: './data/trilateral/E13b.csv',
    story: '/data/trilateral/JP01-E13b',
    largeSubAoi: true,
  },
  E13c: {
    indicator: 'Number of Ships in Port',
    class: 'economic',
    file: './data/trilateral/E13c.csv',
    story: '/data/trilateral/E13c',
    largeSubAoi: true,
  },
  H1: {
    indicator: 'Number of temp. treatment sites',
    class: 'health',
  },
  N1: {
    indicator: 'Air quality',
    class: 'environment',
    file: './data/trilateral/N1.csv',
    story: '/data/trilateral/N1',
    largeTimeDuration: true,
    largeSubAoi: true,
  },
  NASAPopulation: {
    indicator: 'Population',
    class: 'economic',
  },
  N2: {
    indicator: 'Greenhouse Gases',
    class: 'environment',
    file: './data/trilateral/N2.csv',
    story: '/data/trilateral/N2',
    largeTimeDuration: true,
    largeSubAoi: true,
  },
  N3: {
    indicator: 'Water Quality',
    class: 'environment',
    // file: './data/trilateral/N3.csv',
    // story: '/data/trilateral/N3',
  },
  N3b: {
    indicator: 'Chl-a concentration anomaly',
    class: 'environment',
    file: './data/trilateral/N3b.csv',
    story: '/data/trilateral/N3b',
  },
  N3a2: {
    indicator: 'CHL concentration',
    class: 'environment',
    story: '/eodash-data/stories/N3a2',
    largeSubAoi: true,
  },
  N4a: {
    indicator: 'Changes in land fill sites',
    class: 'environment',
  },
  N4b: {
    indicator: 'Illegal waste levels',
    class: 'environment',
  },
  N5: {
    indicator: 'Nightlights (Suomi NPP VIIRS)',
    class: 'economic',
    story: '/data/trilateral/N5',
    largeSubAoi: true,
  },
  d: { // dummy for locations without Indicator code
    indicator: 'Upcoming data',
    class: 'economic',
  },
});

export const layerNameMapping = Object.freeze({
  // "inputdata" -> wms layer name and baseurl
  '[NEW] Planetscope COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'PlanetScope - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'Planetscope COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Planet COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'Pleiades - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  // 'DS_PHR1A': {
  //   base`rl: 'https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  //   layers: 'NEW_PLEIADES_COVID19',
  // },
  '[NEW] Pleiades - 2.8m - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_28_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades 16bit': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_16BIT',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'Sentinel 2 L2A': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  S2L2A: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  S1GRD: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'E8_SENTINEL1',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'S1A - GRD': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'E8_SENTINEL1',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'LANDSAT-8-TRUE-COLOUR': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'LANDSAT-8-TRUE-COLOUR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'LANDSAT-8-NIR': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'LANDSAT-8-NIR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  N1: {
    maxMapZoom: 8,
  },
  NASAPopulation: {
    maxMapZoom: 8,
  },
  'ALOS-2': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2FALOS_SAMPLE%2Falos2-s1-beijing_{time}.tif&resampling_method=nearest&bidx=1&rescale=0%2C65536',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  GOSAT_XCO2: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/GOSAT_XCO2_{time}_{site}_BG_circle_cog.tif&resampling_method=nearest',
    protocol: 'xyz',
    maxNativeZoom: 12,
    maxMapZoom: 12,
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMM'),
    siteMapping: (eoID) => {
      const mapping = {
        CN01: 'be',
        CN02: 'sh',
        BD01: 'dh',
        IN01: 'dl',
        IN02: 'mb',
        US01: 'ny',
        JP01: 'tk',
      };
      return mapping[eoID];
    },
    legendUrl: 'data/trilateral/N2-XCO2-legend.png',
  },
  airport_tk: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fairport%2Ftk_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  industry_sg: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Findustry%2Fsg_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  ports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fplanet%2F{site}-{time}.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        US01: 'ny',
        US02: 'la',
        US03: 'sf',
      };
      return mapping[eoID];
    },
    featuresDateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    featuresUrl: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/ship/{site}/{featuresTime}.geojson',
    featuresParameters: { // can also be a simple list
      verified: {},
    },
  },
  'SGLI L2 Reflectance 8-day composited': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fagriculture%2Fgcom-c-{time}.tif&resampling_method=bilinear&bidx=1&rescale=0%2C1&color_map=cfastie',
    protocol: 'xyz',
    tileSize: 256,
    legendUrl: 'data/trilateral/NDVI.png',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  N5: {
    maxMapZoom: 15,
  },
  N2limited: {
    maxMapZoom: 5,
  },
});

export const indicatorClassesIcons = Object.freeze({
  environment: 'mdi-earth',
  health: 'mdi-hospital-box-outline',
  agriculture: 'mdi-leaf',
  economic: 'mdi-cash',
});

export const mapDefaults = Object.freeze({
  minMapZoom: 0,
  maxMapZoom: 18,
  bounds: latLngBounds(latLng([-70, -170]), latLng([70, 170])),
});

export const baseLayers = [
  {
    name: 'EOxCloudless 2019',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2019: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019) }',
    visible: false,
    maxNativeZoom: 15,
  },
  {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxNativeZoom: 16,
    visible: true,
  },
];
export const overlayLayers = [
  {
    name: 'Overlay',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Overlay: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a href="//eox.at" target="_blank">EOX</a> }',
    visible: true,
    maxZoom: 14,
  },
];

export const defaultWMSDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: 'attributiontextplaceholder',
  minZoom: 7,
};

const getMonthlyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ months: 1 });
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

const getWeeklyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
};

const getFortnightIntervalDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end).minus({ weeks: 2 });
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push([
      DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'),
      DateTime.fromISO(currentDate).plus({ weeks: 2 }).toFormat('yyyy-MM-dd')
    ]);
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
};

const wkt = new Wkt();

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Air Quality',
        'Indicator code': 'N1',
        'Indicator Value': ['TROPOMI: Nitrogen dioxide'],
        'Indicator Name': 'Air Quality - TROPOMI: NO2',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        'Color code': ['primary'],
        externalData: {
          label: 'Sentinel-5p Mapping Service',
          url: 'https://maps.s5p-pal.com',
        },
        AOI: null,
        AOI_ID: 'W1',
        Time: getFortnightIntervalDates('2019-01-07', '2020-07-13'),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: '//obs.eu-de.otc.t-systems.com/s5p-pal-l3-tms/s5p-l3-tropno2/fortnight/{time}/{z}/{x}/{-y}.png',
          name: 'Air Quality (NO2) - ESA',
          legendUrl: 'eodash-data/data/no2Legend.png',
          attribution: '{ Air Quality: <a href="//scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf" target="_blank">Sentinel data</a>, <a href="//maps.s5p-pal.com/" target="_blank">S5P-PAL</a> }',
          dateFormatFunction: (dates) => `${DateTime.fromISO(dates[0]).toFormat('yyyyMMdd')}-${DateTime.fromISO(dates[1]).toFormat('yyyyMMdd')}`,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Air Quality',
        'Indicator code': 'N1',
        'Indicator Value': ['OMI: Nitrogen dioxide'],
        'Indicator Name': 'Air Quality - OMI: NO2',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        'Color code': ['primary'],
        AOI: null,
        AOI_ID: 'W2',
        Time: getMonthlyDates('2004-10-01', '2020-06-01'),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 0.7,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x.png?url=s3://covid-eo-data/OMNO2d_HRM/OMI_trno2_0.10x0.10_{time}_Col3_V4.nc.tif&resampling_method=bilinear&bidx=1&rescale=0%2C1.8e16&color_map=reds',
          name: 'Air Quality (NASA)',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMM'),
          legendUrl: 'eodash-data/data/no2Legend.png',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Greenhouse Gases',
        'Indicator code': 'N2',
        'Indicator Value': ['OCO-2: CO2 2020'],
        'Indicator Name': 'Greenhouse Gases - OCO-2: CO2 2020',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        'Color code': ['primary'],
        AOI: null,
        AOI_ID: 'W3',
        Time: getDailyDates('2020-01-01', '2020-04-16'),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/xco2_15day_mean.{time}.tif&resampling_method=bilinear&bidx=1&rescale=0.000408%2C0.000419&color_map=rdylbu_r',
          name: 'Greenhouse Gases (NASA)',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          legendUrl: 'data/trilateral/N2-co2mean-legend.png',
          mapLabel: 'Mean',
        },
        compareDisplay: {
          protocol: 'xyz',
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/xco2_15day_base.{time}.tif&resampling_method=bilinear&bidx=1&rescale=0.000408%2C0.000419&color_map=rdylbu_r',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          mapLabel: 'Baseline',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Greenhouse Gases',
        'Indicator code': 'N2',
        'Indicator Value': ['OCO-2: Difference CO2'],
        'Indicator Name': 'Greenhouse Gases - OCO-2: Difference CO2',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        'Color code': ['primary'],
        AOI: null,
        AOI_ID: 'W5',
        Time: getDailyDates('2020-01-01', '2020-04-16'),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/xco2_15day_diff.{time}.tif&resampling_method=bilinear&bidx=1&rescale=-0.000001%2C0.000001&color_map=rdbu_r',
          name: 'Greenhouse Gases (NASA)',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          legendUrl: 'data/trilateral/N2-co2diff-legend.png',
          disableCompare: true,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Population',
        'Indicator code': 'NASAPopulation',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Population density 2020',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [],
        },
        'Color code': ['primary'],
        AOI: null,
        AOI_ID: 'W6',
        Time: ['2020-05-14T00:00:00Z'],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GPW_Population_Density_2020/default/{time}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
          name: 'Population',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          legendUrl: 'data/trilateral/NASAPopulation_legend.png',
          disableCompare: true,
        },
      },
    },
  },
  {
    latlng: latLng([35.61, 139.78]),
    id: 9998,
    properties: {
      indicatorObject: {
        AOI: latLng([35.61, 139.78]),
        id: 9998,
        AOI_ID: 'JP01',
        Country: ['JP'],
        City: 'Tokyo',
        'Site Name': 'Tokyo',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.34275817871094 35.049654646456474, 140.34809152322123 35.049654646456474, 140.34809152322123 35.93543243408203, 139.34275817871094 35.93543243408203, 139.34275817871094 35.049654646456474))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_tk_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([39.9, 116.38]),
    id: 9997,
    properties: {
      indicatorObject: {
        AOI: latLng([39.9, 116.38]),
        id: 9997,
        AOI_ID: 'CN01',
        Country: ['CN'],
        City: 'Beijing',
        'Site Name': 'Beijing',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((115.91229248046875 39.627200509676186, 116.86084804657003 39.627200509676186, 116.86084804657003 40.32575607299805, 115.91229248046875 40.32575607299805, 115.91229248046875 39.627200509676186,))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_be_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([51.036138, 2.285374]),
    id: 9996, // for now
    properties: {
      indicatorObject: {
        AOI: latLng([51.036138, 2.285374]),
        id: 9996,
        AOI_ID: 'FR03',
        Country: ['FR'],
        City: 'Port of Dunkirk',
        'Site Name': 'Port of Dunkirk',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.083559989929199 50.965508184133796, 2.416559993631381 50.965508184133796, 2.416559993631381 51.087730407714844, 2.083559989929199 51.087730407714844, 2.083559989929199 50.965508184133796))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_du_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([51.091559, 3.740081]),
    id: 9995,
    properties: {
      indicatorObject: {
        AOI: latLng([51.091559, 3.740081]),
        id: 9995,
        AOI_ID: 'BE03',
        Country: ['BE'],
        City: 'Port of Ghent',
        'Site Name': 'Port of Ghent',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((3.6453969478607178 51.06661950775742, 3.85839695022878 51.06661950775742, 3.85839695022878 51.28873062133789, 3.6453969478607178 51.28873062133789, 3.6453969478607178 51.06661950775742))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_gh_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([34.05, -118.25]),
    id: 9994,
    properties: {
      indicatorObject: {
        AOI: latLng([34.05, -118.25]),
        id: 9994,
        AOI_ID: 'US02',
        Country: ['US'],
        City: 'Los Angeles',
        'Site Name': 'Los Angeles',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-118.68741607666016 33.42670324365463, -117.0733049476039 33.42670324365463, -117.0733049476039 34.34392547607422, -118.68741607666016 34.34392547607422, -118.68741607666016 33.42670324365463))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_la_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([37.7775, -122.416389]),
    id: 9993,
    properties: {
      indicatorObject: {
        AOI: latLng([37.7775, -122.416389]),
        id: 9993,
        AOI_ID: 'US03',
        Country: ['US'],
        City: 'San Francisco',
        'Site Name': 'San Francisco',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63569641113281 37.119795894876006, -121.53514084334165 37.119795894876006, -121.53514084334165 38.35512924194336, -122.63569641113281 38.35512924194336, -122.63569641113281 37.119795894876006))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_sf_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([41.0114, -73.09]),
    id: 9992,
    properties: {
      indicatorObject: {
        AOI: latLng([41.0114, -73.09]),
        id: 9992,
        AOI_ID: 'US04',
        Country: ['US'],
        City: 'New York',
        'Site Name': 'New York',
        Description: 'Nightlights',
        'Indicator code': 'N5',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Night light composite maps (Suomi NPP VIIRS)',
        'Color code': ['BLUE'],
        'EO Sensor': Array(6).fill(['Nightlights']),
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-71.74516 41.54467, -74.43395 41.54943, -74.43219 40.47812, -71.74516 40.48343, -71.74516 41.54467))').toJson(),
          }],
        },
        Time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_ny_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    id: 19999,
    latlng: latLng([45.197522, 13.029785]),
    properties: {
      indicatorObject: {
        id: 19999,
        AOI: latLng([45.197522, 13.029785]),
        AOI_ID: 'NorthAdriaticESA',
        Country: ['HR', 'IT', 'SI'],
        City: 'North Adriatic (ESA) - Chlorophyll-a concentration',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (ESA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-14'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    latlng: latLng([45.197522, 13.0297851]),
    id: 19998,
    properties: {
      indicatorObject: {
        AOI: latLng([45.197522, 13.0297851]),
        id: 19998,
        AOI_ID: 'NorthAdriaticNASA',
        Country: ['HR', 'IT', 'SI'],
        City: 'North Adriatic (NASA)',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (NASA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'], ['2020-03-18'], ['2020-03-25'], ['2020-04-01'], ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'], ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([45.197522, 13.0297851]),
    id: 19994,
    properties: {
      indicatorObject: {
        AOI: latLng([45.197522, 13.0297851]),
        id: 19994,
        AOI_ID: 'NorthAdriaticJAXA',
        Country: ['HR', 'IT', 'SI'],
        City: 'North Adriatic (JAXA)',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (JAXA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: [['2018-01-20'], ['2018-01-27'], ['2018-03-17'], ['2018-03-24'], ['2018-03-31'], ['2018-04-07'], ['2018-04-14'], ['2018-04-21'], ['2018-04-28'], ['2018-05-05'], ['2018-05-12'], ['2018-05-19'], ['2018-05-26'], ['2018-06-02'], ['2018-06-09'], ['2018-06-16'], ['2018-06-23'], ['2018-06-30'], ['2018-07-07'], ['2018-07-14'], ['2018-07-21'], ['2018-07-28'], ['2018-08-04'], ['2018-08-11'], ['2018-08-18'], ['2018-08-25'], ['2018-09-01'], ['2018-09-08'], ['2018-09-15'], ['2018-09-22'], ['2018-09-29'], ['2018-10-06'], ['2018-10-13'], ['2018-10-20'], ['2018-10-27'], ['2018-11-03'], ['2018-11-17'], ['2018-12-01'], ['2018-12-08'], ['2018-12-15'], ['2018-12-29'], ['2019-01-05'], ['2019-01-12'], ['2019-01-19'], ['2019-01-26'], ['2019-02-02'], ['2019-02-09'], ['2019-02-16'], ['2019-02-23'], ['2019-03-02'], ['2019-03-09'], ['2019-03-16'], ['2019-03-23'], ['2019-03-30'], ['2019-04-06'], ['2019-04-13'], ['2019-04-20'], ['2019-04-27'], ['2019-05-04'], ['2019-05-18'], ['2019-05-25'], ['2019-06-01'], ['2019-06-08'], ['2019-06-15'], ['2019-06-22'], ['2019-06-29'], ['2019-07-06'], ['2019-07-13'], ['2019-07-20'], ['2019-07-27'], ['2019-08-03'], ['2019-08-10'], ['2019-08-17'], ['2019-08-24'], ['2019-08-31'], ['2019-09-07'], ['2019-09-14'], ['2019-09-21'], ['2019-09-28'], ['2019-10-05'], ['2019-10-12'], ['2019-10-19'], ['2019-10-26'], ['2019-11-02'], ['2019-11-23'], ['2019-12-07'], ['2019-12-21'], ['2019-12-28'], ['2020-01-04'], ['2020-01-11'], ['2020-01-18'], ['2020-01-25'], ['2020-02-08'], ['2020-02-15'], ['2020-02-22'], ['2020-02-29'], ['2020-03-07'], ['2020-03-14'], ['2020-03-21'], ['2020-03-28'], ['2020-04-04'], ['2020-04-11'], ['2020-04-18'], ['2020-04-25'], ['2020-05-02'], ['2020-05-09'], ['2020-05-23'], ['2020-05-30'], ['2020-06-06'], ['2020-06-13']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chla-nas-jaxa-{time}.tif&resampling_method=bilinear&bidx=1&rescale=0%2C255&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_jaxa.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([37.7775, -122.416389]),
    id: 19997,
    properties: {
      indicatorObject: {
        AOI: latLng([37.7775, -122.416389]),
        id: 19997,
        AOI_ID: 'US03',
        Country: ['US'],
        City: 'San Francisco',
        'Site Name': 'San Francisco',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (NASA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63569641113281 37.119795894876006, -121.53514084334165 37.119795894876006, -121.53514084334165 38.35512924194336, -122.63569641113281 38.35512924194336, -122.63569641113281 37.119795894876006))').toJson(),
          }],
        },
        Time: [['2020-03-02'], ['2020-04-03'], ['2020-04-19'], ['2020-05-04'], ['2020-05-05'], ['2020-05-19'], ['2020-05-21'], ['2020-05-24']],
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([41.0114, -73.09]),
    id: 19996,
    properties: {
      indicatorObject: {
        AOI: latLng([41.0114, -73.09]),
        id: 19996,
        AOI_ID: 'US04',
        Country: ['US'],
        City: 'New York',
        'Site Name': 'New York',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (NASA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-71.74516 41.54467, -74.43395 41.54943, -74.43219 40.47812, -71.74516 40.48343, -71.74516 41.54467))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-01', '2020-06-24'),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([35.61, 139.78]),
    id: 19995,
    properties: {
      indicatorObject: {
        AOI: latLng([35.61, 139.78]),
        id: 19995,
        AOI_ID: 'JP01',
        Country: ['JP'],
        City: 'Tokyo',
        'Site Name': 'Tokyo',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (JAXA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.34275817871094 35.049654646456474, 140.34809152322123 35.049654646456474, 140.34809152322123 35.93543243408203, 139.34275817871094 35.93543243408203, 139.34275817871094 35.049654646456474))').toJson(),
          }],
        },
        Time: getWeeklyDates('2017-12-27', '2020-06-10').filter(item => !['2020-05-27', '2020-04-22', '2020-03-11', '2020-02-12', '2020-01-22', '2019-12-04', '2019-10-16', '2019-09-18', '2019-07-17', '2019-07-10', '2019-07-03', '2019-06-26', '2019-06-05', '2019-05-01', '2019-04-24', '2019-04-17', '2019-02-20', '2019-02-06', '2018-12-05', '2018-10-31', '2018-10-10', '2018-08-29', '2018-08-15', '2018-06-13', '2018-06-06', '2018-05-23', '2018-03-21', '2018-02-28', '2018-02-07', '2017-12-27'].includes(item)),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-tk-{time}.tif&resampling_method=bilinear&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_jaxa.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    id: 19993,
    latlng: latLng([43.4, 4.94]),
    properties: {
      indicatorObject: {
        id: 19993,
        AOI: latLng([43.4, 4.94]),
        AOI_ID: 'RhoneDelta',
        Country: ['FR'],
        City: 'Rhone Delta - Chlorophyll-a concentration',
        'Site Name': 'Fos-sur-Mer',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (ESA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-14'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 19992,
    latlng: latLng([45.197522, 13.0297851]),
    properties: {
      indicatorObject: {
        id: 19992,
        AOI: latLng([45.197522, 13.0297851]),
        AOI_ID: 'NorthAdriaticESATSM',
        Country: ['HR', 'IT', 'SI'],
        City: 'North Adriatic (ESA) - Total Suspended Matter',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (ESA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-14'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 19991,
    latlng: latLng([43.4, 4.9400001]),
    properties: {
      indicatorObject: {
        id: 19991,
        AOI: latLng([43.4, 4.9400001]),
        AOI_ID: 'RhoneDeltaTSM',
        Country: ['FR'],
        City: 'Rhone Delta - Total Suspended Matter',
        'Site Name': 'Fos-sur-Mer',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps (ESA)',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-14'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
];
