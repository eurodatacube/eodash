/* eslint-disable max-len */
import { Wkt } from 'wicket';
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import { DateTime } from 'luxon';
import {
  shS2TimeFunction, shWeeklyTimeFunction,
} from '@/utils';
import shTimeFunction from '@/shTimeFunction';
import {
  baseLayers, overlayLayers, trucksAreaIndicator, trucksFeatures,
} from '@/config/layers';
import {
  nasaStatisticsConfig,
} from '@/helpers/customAreaObjects';

const wkt = new Wkt();
const wkb = new WKB();
const geojsonFormat = new GeoJSON();

export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/trilateral/catalog.json';

const geodbFeatures = {
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_{indicator}-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
  dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
  callbackFunction: (responseJson) => { // geom from wkb to geojson features
    const ftrs = [];
    if (responseJson) {
      responseJson.forEach((ftr) => {
        const { geometry, ...properties } = ftr;
        // conversion to GeoJSON because followup parts of code depend on that
        const geom = geojsonFormat.writeGeometryObject(wkb.readGeometry(geometry));
        if (geom.type === 'MultiPoint' || geom.type === 'MultiPolygon') {
          geom.coordinates.forEach((coordPair) => {
            const singleGeometry = {
              type: geom.type === 'MultiPoint' ? 'Point' : 'Polygon',
              coordinates: coordPair,
            };
            ftrs.push({
              type: 'Feature',
              properties,
              geometry: singleGeometry,
            });
          });
        } else {
          ftrs.push({
            type: 'Feature',
            properties,
            geometry: geom,
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
};

const cloudlessBaseLayerDefault = [{
  ...baseLayers.cloudless,
  visible: true,
}, baseLayers.cloudless2020, baseLayers.cloudless2019, baseLayers.cloudless2018, baseLayers.eoxosm, baseLayers.terrainLight];

const antarcticBaseMaps = [
  baseLayers.terrainLightStereoSouth,
  baseLayers.cloudless,
  baseLayers.eoxosm,
  {
    name: 'Antarctic hillshade, bathymetry',
    baseUrl: 'https://maps.bas.ac.uk/antarctic/wms',
    projection: 'EPSG:3031',
    layers: 'add:antarctic_hillshade_and_bathymetry',
    minZoom: 2,
    maxZoom: 17,
    visible: true,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    attribution: '{ REMA: Howat, I. M., Porter, C., Smith, B. E., Noh, M.-J., and Morin, P.: The Reference Elevation Model of Antarctica, The Cryosphere, 13, 665-674, https://doi.org/10.5194/tc-13-665-2019, 2019. ; GEBCO Compilation Group (2019) GEBCO 2019 Grid (doi:10.5285/836f016a-33be-6ddc-e053-6c86abc0788e) Available from: GEBCO; https://www.gebco.net/ }',
  },
];

const antarcticOverlayMaps = [
  {
    name: 'Antarctic coastline',
    baseUrl: 'https://maps.bas.ac.uk/antarctic/wms',
    projection: 'EPSG:3031',
    layers: 'add:antarctic_coastline_line_medium',
    attribution: '{ Gerrish, L., Fretwell, P., & Cooper, P. (2022). Medium resolution vector polylines of the Antarctic coastline (7.6) [Data set]. UK Polar Data Centre, Natural Environment Research Council, UK Research & Innovation. https://doi.org/10.5285/1db7f188-6c3e-46cf-a3bf-e39dbd77e14c }',
    minZoom: 2,
    maxZoom: 17,
    visible: true,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
  },
  {
    name: 'Antarctic labels',
    baseUrl: 'https://add.data.bas.ac.uk/ogc/64/wms',
    projection: 'EPSG:3031',
    layers: 'apip_extended_toponymy_labels',
    minZoom: 2,
    maxZoom: 17,
    visible: true,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    attribution: '{ Place Names sourced from SCAR Composite Gazetteer of Antarctica }',
  },
];

const arcticBaseMaps = [
  {
    ...baseLayers.terrainLightStereoNorth,
    visible: true,
  },
  baseLayers.cloudless,
  baseLayers.eoxosm,
];

const arcticOverlayMaps = [];

const polarStereographicProjection = {
  name: 'EPSG:3411',
  def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs +type=crs',
  extent: [-3314763.31, -3314763.31, 3314763.31, 3314763.31],
};

const sharedPalsarFNFConfig = Object.freeze({
  url: 'https://ogcpreview1.restecmap.com/examind/api/WS/wmts/JAXA_WMTS_Preview/1.0.0/WMTSCapabilities.xml',
  protocol: 'WMTSCapabilities',
  labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
  attribution: '{ <a href="https://www.eorc.jaxa.jp/ALOS/en/dataset/fnf_e.htm" target="_blank">JAXA Global PALSAR-2/PALSAR/JERS-1 Mosaic and Forest/Non-Forest maps</a> is available to use with no charge under the <a href="https://earth.jaxa.jp/policy/en.html" target="_blank">JAXA Terms of Use of Research Data</a>.; }',
});

const antarcticDatasets = Object.freeze({
  features: {
    name: 'Thaites glacier outline',
    url: './data/trilateral/thwaites.geojson',
  },
  mapProjection: {
    name: 'EPSG:3031',
    def: '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
    extent: [-3299207.53, -3333134.03, 3299207.53, 3333134.03],
  },
  projection: 'EPSG:3031',
  baseLayers: antarcticBaseMaps,
  overlayLayers: antarcticOverlayMaps,
});

const polarSHDatasets = Object.freeze({
  // projection and layers overrides
  baseLayers: arcticBaseMaps,
  overlayLayers: arcticOverlayMaps,
  dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
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
  projection: 'EPSG:3413',
});
export const indicatorsDefinition = Object.freeze({
  E13c: {
    features: {
      ...geodbFeatures,
      name: 'Ship detections',
      url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_E13c_tri-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
    },
    baseLayers: cloudlessBaseLayerDefault,
  },
  E10a2: {
    maxDecimals: 4,
  },
  E10a6: {
    maxDecimals: 4,
  },
  E13b: {
    features: {
      // valid for default (geodb) features, NASA have 'input_data' 'airports' override
      ...geodbFeatures,
      name: 'Plane detections',
      url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_E13b_tri-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
    },
  },
  N3b_tsm: {
    sensorColorMap: {
      'Sentinel-3A OLCI': '#a37',
      'Aqua MODIS': '#47a',
      'MODIS Aqua': '#47a',
      'GCOM-C/SGLI': '#6ce',
    },
  },
  N3b_chl: {
    sensorColorMap: {
      'Sentinel-3A OLCI': '#a37',
      'Aqua MODIS': '#47a',
      'MODIS Aqua': '#47a',
      'GCOM-C/SGLI': '#6ce',
    },
  },
  N7: {
    disableCompare: true,
    baseLayers: cloudlessBaseLayerDefault,
  },
  N8: {
    disableCompare: true,
    baseLayers: cloudlessBaseLayerDefault,
  },
  GGI_CH4: {
    baseLayers: cloudlessBaseLayerDefault,
  },
  GGI_N2O: {
    baseLayers: cloudlessBaseLayerDefault,
  },
  GGI_CO2: {
    baseLayers: cloudlessBaseLayerDefault,
  },
});

export const layerNameMapping = Object.freeze({
  // "inputdata" -> wms layer name and baseurl
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
    dateFormatFunction: shTimeFunction,
  },
  'S1A - GRD': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shTimeFunction,
  },
  'LANDSAT-8-TRUE-COLOUR': {
    layers: 'LANDSAT-8-TRUE-COLOUR',
  },
  'LANDSAT-8-NIR': {
    layers: 'LANDSAT-8-NIR',
  },
  'Sentinel-1': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shTimeFunction,
  },
  'ALOS-2': {
    layers: 'AWS_JAXA_CARS_CONTAINERS_ALOS2',
  },
  GOSAT_XCO2: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/GOSAT_XCO2_{time}_{site}_BG_circle_cog.tif&resampling_method=nearest',
    protocol: 'xyz',
    maxZoom: 12,
    tileSize: 256,
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
  },
  airport_tk: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fairport%2Ftk_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        JP02: 'tk', // just to fix transition
      };
      return mapping[eoID];
    },
  },
  industry: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Findustry%2F{site}_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        SG01: 'sg',
      };
      return mapping[eoID];
    },
  },
  ports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fplanet%2F{site}-{time}.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        US01: 'ny',
        US02: 'la',
        US03: 'sf',
      };
      return mapping[eoID];
    },
  },
  airports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/planet/{z}/{x}/{y}?date={time}&site={site}',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        US021: 'la',
        US022: 'la',
        US031: 'sf',
        US032: 'sf',
        US033: 'sf',
        US034: 'sf',
        US035: 'sf',
        US036: 'sf',
        US037: 'sf',
        US041: 'ny',
        US042: 'ny',
        CN011: 'be',
        CN012: 'be',
        JP02: 'tk',
        JP012: 'tk',
      };
      return mapping[eoID];
    },
  },
  water_quality_chl: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/{site}-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        NorthAdriaticCHL: 'oc3_chla_anomaly/anomaly-chl-nas',
        US03: 'oc3_chla_anomaly/anomaly-chl-sf',
        US04: 'oc3_chla_anomaly/anomaly-chl-ny',
        NorthAdriaticTSM: 'spm_anomaly/anomaly-spm-nas',
        US03SPM: 'spm_anomaly/anomaly-spm-sf',
        US04TSM: 'spm_anomaly/anomaly-spm-ny',
      };
      return mapping[eoID];
    },
  },
  'SGLI L2 Reflectance 8-day composited': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fagriculture%2Fgcom-c-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-1%2C1&color_map=cfastie',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  palsarFNF2017: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2017-Yearly',
  },
  palsarFNF2018: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2018-Yearly',
  },
  palsarFNF2019: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2019-Yearly',
  },
  palsarFNF2020: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2020-Yearly',
  },
});

export const indicatorClassesIcons = Object.freeze({
  economy: 'mdi-cash',
  agriculture: 'mdi-barley',
  atmosphere: 'mdi-weather-windy',
  oceans: 'mdi-water',
  biomass: 'mdi-leaf',
  'covid-19': 'mdi-hospital-box-outline',
  cryosphere: 'mdi-snowflake',
  'extreme-events': 'mdi-lightning-bolt',
});

export const geoDBFeatureParameters = Object.freeze({
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash`,
});

export const mapDefaults = Object.freeze({
  bounds: [-170, -70, 170, 70],
});

export const baseLayersMap = [
  baseLayers.eoxosm,
  baseLayers.cloudless,
  {
    ...baseLayers.terrainLight, visible: true,
  },
];
export const overlayLayersMap = [{
  ...overlayLayers.eoxOverlay,
  visible: true,
}];

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank"> Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  minZoom: 1,
  maxZoom: 18,
  visible: true,
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

const e10cDates = {
  time: [
    '2018-03-06',
    '2018-03-14',
    '2018-03-22',
    '2018-03-30',
    '2018-04-07',
    '2018-04-15',
    '2018-04-23',
    '2018-05-01',
    '2018-05-09',
    '2018-05-17',
    '2018-05-25',
    '2018-06-02',
    '2018-06-10',
    '2018-06-18',
    '2018-06-26',
    '2018-07-04',
    '2018-07-12',
    '2018-07-20',
    '2018-07-28',
    '2019-03-06',
    '2019-03-14',
    '2019-03-22',
    '2019-03-30',
    '2019-04-07',
    '2019-04-15',
    '2019-04-23',
    '2019-05-01',
    '2019-05-09',
    '2019-05-17',
    '2019-05-25',
    '2019-06-02',
    '2019-06-10',
    '2019-06-18',
    '2019-06-26',
    '2019-07-04',
    '2019-07-12',
    '2019-07-20',
    '2019-07-28',
    '2020-03-05',
    '2020-03-13',
    '2020-03-21',
    '2020-03-29',
    '2020-04-06',
    '2020-04-14',
    '2020-04-22',
    '2020-04-30',
    '2020-05-08',
    '2020-05-16',
    '2020-05-24',
    '2020-06-01',
    '2020-06-09',
    '2020-06-17',
  ],
  eoSensor: [
    'GCOM-C SGLI',
  ],
  inputData: [
    'SGLI L2 Reflectance 8-day composited',
  ],
};

export const replaceMapTimes = {
  'US07-E10c': e10cDates,
  'US06-E10c': e10cDates,
  'US05-E10c': e10cDates,
};

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

const getDailyDates = (start, end, interval = 1, s3Path = null, formatFunction = null) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    if (s3Path) {
      const t = DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd');
      let evaluated = s3Path.replace('{time}', t);
      if (formatFunction) {
        evaluated = s3Path.replace('{time}', formatFunction(t));
      }
      dateArray.push([t, evaluated]);
    } else {
      dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    }
    currentDate = DateTime.fromISO(currentDate).plus({ days: interval });
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

const createRECCAP2Config = (indicatorCode, time) => ({
  properties: {
    indicatorObject: {
      indicator: indicatorCode,
      time,
      display: {
        minNativeZoom: 3,
        maxNativeZoom: 5,
      },
    },
  },
});

export const globalIndicators = [
  createRECCAP2Config('RECCAP2_1'),
  createRECCAP2Config('RECCAP2_2'),
  createRECCAP2Config('RECCAP2_3'),
  createRECCAP2Config('RECCAP2_4'),
  createRECCAP2Config('RECCAP2_5', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_6', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_7', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_8', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_9', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_10', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_11', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('RECCAP2_12', getYearlyDates('2011-01-01', '2018-01-01')),
  createRECCAP2Config('ESDC_gross_primary_productivity', getDailyDates('2001-01-05', '2018-12-23', 8)),
  createRECCAP2Config('ESDC_net_ecosystem_exchange', getDailyDates('2001-01-05', '2018-12-23', 8)),
  createRECCAP2Config('ESDC_kndvi', getDailyDates('2000-03-01', '2021-12-31', 8)),
  {
    properties: {
      // override dates for precipitation
      indicatorObject: {
        indicator: 'ESDL_Hydrology_Precipitation',
        time: getDailyDates('2015-01-01', '2021-12-31'),
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'ESDL_Hydrology_SM',
        display: {
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
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
          mapProjection: polarStereographicProjection,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'SIE',
        display: polarSHDatasets,
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Modis_SNPP_2023',
        display: [{
          features: {
            ...trucksFeatures,
            drawnAreaLimitExtent: true,
            name: 'Modis fire detections',
            requestBody: {
              collection: 'eodash_MODIS_timeseries',
              select: 'brightness,geometry,date_time,confidence,frp,daynight,type,bright_t31',
              where: 'ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry) AND date_time LIKE \'{featuresTime}%\'',
            },
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
            style: {
              strokeColor: '#ff0000',
              width: 4,
            },
          },
          areaIndicator: {
            ...trucksAreaIndicator(false, 'date_time'),
            requestBody: {
              collection: 'eodash_MODIS_timeseries',
              select: 'date_time,geometry',
              order: 'date_time',
              where: 'ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
            },
          },
          customAreaIndicator: true,
          customAreaFeatures: true,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).minus({ days: 1 }).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A +-1 day',
          minZoom: 1,
          drawnAreaLimitExtent: true,
        }, {
          baseUrl: `https://creodias.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}`,
          layers: 'TESTING_CO_FROM_SENTINELHUB',
          name: 'Daily S5P L2 Tropomi CO',
          opacity: 0.45,
          drawnAreaLimitExtent: true,
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // area indicator unit division override
        indicator: 'N9',
        yAxis: 'NO2 [10^14 molecules/cm²]',
        display: {
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          areaIndicator: nasaStatisticsConfig(
            (value) => value / 1e14, 'NASACustomLineChart',
          ),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'SIC',
        showGlobe: true,
        display: polarSHDatasets,
      },
    },
  },
  {
    // custom override of name + specialEnvTime
    properties: {
      indicatorObject: {
        indicator: 'WSF',
        display: [{
          name: 'DLR WSF Evolution 1985-2015',
          specialEnvTime: true,
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Contains modified Landsat-5/-7 data [1985-2015] }',
        },
        {
          url: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          layers: 'WSF_2019',
          name: 'DLR WSF 2019 coverage',
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Copyright DLR (2021);|Contains modified Copernicus Sentinel-1 and Sentinel-2 data [2019]}',
        },
        ],
      },
    },
  },
  {
    properties: {
      // projection, time and layers overrides
      indicatorObject: {
        indicator: 'N12_1_sea_ice_concentration_arctic',
        time: getDailyDates('1978-11-01', '2024-01-30'),
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
  {
    properties: {
      // projection, time and layers overrides
      indicatorObject: {
        indicator: 'N12_sea_ice_concentration_antarctic',
        time: getDailyDates('1978-11-01', '2024-01-30'),
        display: {
          baseLayers: antarcticBaseMaps,
          overlayLayers: antarcticOverlayMaps,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
          projection: 'EPSG:3031',
          mapProjection: {
            name: 'EPSG:3031',
            def: '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3299207.53, -3333134.03, 3299207.53, 3333134.03],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'N6',
        display: {
          // manually adding administrative features
          maxNativeZoom: 6,
          features: {
            name: 'Administrative zones ADM0',
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}.geojson',
            allowedParameters: ['ADM0_NAME', 'Name'],
            style: {
              strokeColor: '#696868',
              opacity: 0.5,
            },
          },
        },
      },
    },
  },
  {
    properties: {
      // nonstandard way that each layer is different time
      indicatorObject: {
        indicator: 'FNF',
        inputData: ['palsarFNF2017', 'palsarFNF2018', 'palsarFNF2019', 'palsarFNF2020'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: 'ADD_West_Antarctica_S1',
        time: getWeeklyDates('2017-05-18', '2022-01-15'),
        display: {
          ...antarcticDatasets,
          dateFormatFunction: shWeeklyTimeFunction,
          minZoom: 5,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: 'ADD_Meltmap',
        time: getDailyDates('2007-01-02', '2021-12-31'),
        display: {
          ...antarcticDatasets,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: 'ADD_Melt_Duration',
        display: {
          ...antarcticDatasets,
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: 'ADD_Melt_Season_End',
        display: {
          ...antarcticDatasets,
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: 'ADD_Melt_Onset',
        display: {
          ...antarcticDatasets,
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
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
        display: polarSHDatasets,
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: '4D_Greenland_Melt_Duration',
        display: polarSHDatasets,
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: '4D_Greenland_Melt_Season_End',
        display: polarSHDatasets,
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating times and additional layers
        indicator: '4D_Greenland_Melt_Onset',
        display: polarSHDatasets,
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        // updating additional layers
        indicator: 'ADD_Landsat_L2_Antarctica',
        display: {
          ...antarcticDatasets,
          projection: 'EPSG:3857',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'MCD',
        display: {
          baseLayers: cloudlessBaseLayerDefault,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sentinel-1 for Science Amazonas area of forest loss',
          layers: 'ID-AMAZONAS_PROJECT',
          minZoom: 5,
          maxZoom: 16,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ months: 1 }).minus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON ((-58.193359 -5.652236, -58.193359 -1.537901, -52.625 -1.537901, -52.625 -5.652236, -58.193359 -5.652236))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'Lakes_WQ_TURB',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON ((16.99585 46.55886, 16.99585 47.182246, 18.308716 47.182246, 18.308716 46.55886, 16.99585 46.55886))').toJson(),
            }],
          },
        },
      },
    },
  },
];
