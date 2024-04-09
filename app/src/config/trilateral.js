/* eslint-disable max-len */
import { Wkt } from 'wicket';
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import { DateTime } from 'luxon';
import {
  shS2TimeFunction, shWeeklyTimeFunction,
} from '@/utils';
import shTimeFunction from '@/shTimeFunction';
import { baseLayers, overlayLayers } from '@/config/layers';
// import locations from '@/config/locations.json';
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
    dateFormatFunction: shS2TimeFunction,
  },
  'S1A - GRD': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shS2TimeFunction,
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
    features: {
      name: 'Ship detections',
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
      url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/ship/{site}/{featuresTime}.geojson',
      allowedParameters: ['verified'],
    },
  },
  airports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/planet/{z}/{x}/{y}?date={time}&site={site}',
    name: 'Throughput at principal hub airports',
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
    features: {
      name: 'Plane detections',
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
      url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/plane/{site}/{featuresTime}.geojson',
      allowedParameters: ['Country', 'label', 'score'],
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
      indicatorObject: {
        indicator: 'SITI',
        display: {
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          // WGS1984Quad as a workaround for EPSG:3857 crashing on z=0 default view for polar areas
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WGS1984Quad/{z-1}/{x}/{y}?&resampling_method=nearest&bidx=1&colormap_name=plasma&rescale=0.0,4.0&{time}',
          projection: 'EPSG:4326',
          mapProjection: polarStereographicProjection,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'SIE',
        display: {
          // projection and layers overrides
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
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
        },
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
        display: {
          // projection and layers overrides
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          projection: 'EPSG:3413',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
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
        },
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
          maxZoom: 6,
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
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([33.94, -118.41]),
  //       aoiID: 'US021',
  //       country: ['US'],
  //       city: 'Los Angeles',
  //       siteName: 'Los Angeles International Airport - LAX',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Los Angeles International Airport - LAX, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-118.44 33.93, -118.38 33.93, -118.38 33.95, -118.44 33.95, -118.44 33.93))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-10'], ['2020-02-01'], ['2020-04-21'], ['2020-05-05'], ['2020-05-17'], ['2020-05-20'], ['2020-06-08'], ['2020-06-15'], ['2020-07-04'], ['2020-07-10'], ['2020-08-18'], ['2020-08-28'], ['2020-09-22'], ['2020-09-30'], ['2020-10-02'], ['2020-10-15']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([34.057, -117.6]),
  //       aoiID: 'US022',
  //       country: ['US'],
  //       city: 'Ontario',
  //       siteName: 'Ontario International Airport - ONT',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Ontario International Airport - ONT, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-117.575 34.048, -117.63 34.048, -117.63 34.065, -117.575 34.065, -117.575 34.048))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-14'], ['2020-02-03'], ['2020-03-22'], ['2020-04-15'], ['2020-05-04'], ['2020-05-23'], ['2020-05-24'], ['2020-06-11'], ['2020-07-06'], ['2020-07-21'], ['2020-08-01'], ['2020-08-16'], ['2020-09-01'], ['2020-09-19'], ['2020-10-04'], ['2020-10-27']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([37.622, -122.378]),
  //       aoiID: 'US031',
  //       country: ['US'],
  //       city: 'San Francisco',
  //       siteName: 'San Francisco International Airport - SFO',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'San Francisco International Airport - SFO, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.4 37.605, -122.355 37.605, -122.355 37.64, -122.4 37.64, -122.4 37.605))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-11'], ['2020-02-20'], ['2020-03-09'], ['2020-04-03'], ['2020-05-05'], ['2020-05-19'], ['2020-05-26'], ['2020-06-04'], ['2020-06-23'], ['2020-07-06'], ['2020-07-14'], ['2020-08-07'], ['2020-08-13'], ['2020-09-23'], ['2020-09-30'], ['2020-10-12'], ['2020-10-26']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([37.363, -121.93]),
  //       aoiID: 'US032',
  //       country: ['US'],
  //       city: 'San Jose',
  //       siteName: 'Norman Y. Mineta San Jose International Airport - SJC',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Norman Y. Mineta San Jose International Airport - SJC, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-121.945 37.35, -121.912 37.35, -121.912 37.377, -121.945 37.377, -121.945 37.35))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-12'], ['2020-02-10'], ['2020-03-12'], ['2020-04-07'], ['2020-05-07'], ['2020-05-16'], ['2020-05-29'], ['2020-06-21'], ['2020-06-29'], ['2020-07-22'], ['2020-07-31'], ['2020-08-03'], ['2020-08-08'], ['2020-10-20'], ['2020-10-31']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([37.722, -122.226]),
  //       aoiID: 'US033',
  //       country: ['US'],
  //       city: 'Oakland',
  //       siteName: 'Oakland International Airport - OAK',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Oakland International Airport - OAK, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.252 37.7, -122.2 37.7, -122.2 37.745, -122.252 37.745, -122.252 37.7))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-13'], ['2020-02-15'], ['2020-03-19'], ['2020-04-15'], ['2020-05-04'], ['2020-05-27'], ['2020-06-11'], ['2020-06-18'], ['2020-07-07'], ['2020-07-27'], ['2020-08-04'], ['2020-09-22'], ['2020-09-24'], ['2020-10-15']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([37.6585, -122.121]),
  //       aoiID: 'US034',
  //       country: ['US'],
  //       city: 'Hayward',
  //       siteName: 'Hayward Executive Airport - HWD',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Hayward Executive Airport - HWD, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.132 37.653, -122.11 37.653, -122.11 37.664, -122.132 37.664, -122.132 37.653))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-13'], ['2020-02-18'], ['2020-03-12'], ['2020-04-22'], ['2020-05-19']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([38.216, -122.276]),
  //       aoiID: 'US035',
  //       country: ['US'],
  //       city: 'Napa',
  //       siteName: 'Napa County Airport - APC',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Napa County Airport - APC, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.286 38.206, -122.266 38.206, -122.266 38.226, -122.286 38.226, -122.286 38.206))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-13'], ['2020-02-06'], ['2020-03-10'], ['2020-04-07'], ['2020-06-28'], ['2020-07-17'], ['2020-07-25'], ['2020-08-09'], ['2020-09-04'], ['2020-10-21'], ['2020-10-28']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([38.144, -122.557]),
  //       aoiID: 'US036',
  //       country: ['US'],
  //       city: 'Marin',
  //       siteName: 'Marin County Airport - NOT',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Marin County Airport - NOT, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.565 38.137, -122.55 38.137, -122.55 38.150, -122.565 38.150, -122.565 38.137))').toJson(),
  //         }],
  //       },
  //       time: [['2020-02-07'], ['2020-03-12'], ['2020-04-02']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([37.99, -122.057]),
  //       aoiID: 'US037',
  //       country: ['US'],
  //       city: 'Buchannan',
  //       siteName: 'Buchannan Field Airport - CCR',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Buchannan Field Airport - CCR, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.064 37.98, -122.05 37.98, -122.05 38.0, -122.064 38.0, -122.064 37.98))').toJson(),
  //         }],
  //       },
  //       time: [['2020-03-12']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([40.642, -73.788]),
  //       aoiID: 'US041',
  //       country: ['US'],
  //       city: 'New York',
  //       siteName: 'John F. Kennedy International Airport - JFK',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'John F. Kennedy International Airport - JFK, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-73.825 40.62, -73.753 40.62, -73.753 40.664, -73.825 40.664, -73.825 40.62))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-16'], ['2020-02-17'], ['2020-03-15'], ['2020-04-15'], ['2020-05-14'], ['2020-05-27'], ['2020-05-30'], ['2020-06-04'], ['2020-06-10'], ['2020-07-02'], ['2020-07-06'], ['2020-08-10'], ['2020-08-26'], ['2020-09-16'], ['2020-09-25'], ['2020-10-06']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([40.689, -74.172]),
  //       aoiID: 'US042',
  //       country: ['US'],
  //       city: 'Newark',
  //       siteName: 'Newark Liberty International Airport - EWR',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Newark Liberty International Airport - EWR, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-74.19 40.67, -74.155 40.67, -74.155 40.708, -74.19 40.708, -74.19 40.67))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-20'], ['2020-02-19'], ['2020-03-09'], ['2020-04-06'], ['2020-05-05'], ['2020-05-20'], ['2020-05-31'], ['2020-06-01'], ['2020-06-09'], ['2020-07-19'], ['2020-07-21'], ['2020-08-03'], ['2020-08-17'], ['2020-09-13'], ['2020-09-21'], ['2020-10-08'], ['2020-10-15']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([40.072, 116.593]),
  //       aoiID: 'CN011',
  //       country: ['CN'],
  //       city: 'Beijing',
  //       siteName: 'Beijing Capital International Airport - PEK',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Beijing Capital International Airport - PEK, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((116.566 40.05, 116.621 40.05, 116.621 40.105, 116.566 40.105, 116.566 40.05))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-12'], ['2020-02-10'], ['2020-03-12'], ['2020-04-11'], ['2020-05-05']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([39.495, 116.419]),
  //       aoiID: 'CN012',
  //       country: ['CN'],
  //       city: 'Beijing Daxing',
  //       siteName: 'Beijing Daxing International Airport - PKX',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Beijing Daxing International Airport - PKX, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((116.362 39.466, 116.476 39.466, 116.476 39.524, 116.362 39.524, 116.362 39.466))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-09'], ['2020-01-12'], ['2020-01-14'], ['2020-02-18'], ['2020-03-13'], ['2020-03-19'], ['2020-04-11'], ['2020-05-14']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([35.774, 140.385]),
  //       aoiID: 'JP012',
  //       country: ['JP'],
  //       city: 'Narita',
  //       siteName: 'Narita International Airport - NRT',
  //       description: 'Airports: throughput',
  //       indicator: 'E13b',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Narita International Airport - NRT, Throughput at principal hub airports',
  //       lastColorCode: 'BLUE',
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((140.364 35.742, 140.406 35.742, 140.406 35.806, 140.364 35.806, 140.364 35.742))').toJson(),
  //         }],
  //       },
  //       time: [['2020-01-19'], ['2020-02-05'], ['2020-03-19'], ['2020-04-10'], ['2020-05-16'], ['2020-08-11'], ['2020-08-11'], ['2020-08-14'], ['2020-09-02'], ['2020-09-09'], ['2020-09-10'], ['2020-10-02'], ['2020-10-22'], ['2020-10-25']],
  //       inputData: ['airports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([34.05, -118.251]),
  //       aoiID: 'US02',
  //       country: ['US'],
  //       city: 'Los Angeles',
  //       siteName: 'Los Angeles',
  //       description: 'Ports: Ship throughput',
  //       indicator: 'E13c',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Number of Ships in Port',
  //       lastColorCode: 'BLUE',
  //       eoSensor: ['Planet Labs/NASA (PlanetScope)'],
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-118.78075 33.42020,-118.78075 33.95016,-117.92406 33.95016,-117.92406 33.42020,-118.78075 33.42020))').toJson(),
  //         }],
  //       },
  //       time: ['2020-01-01', '2020-01-06', '2020-01-07', '2020-01-09', '2020-01-10', '2020-01-12', '2020-01-13', '2020-01-14', '2020-01-17', '2020-01-18', '2020-01-19', '2020-01-22', '2020-01-23', '2020-01-24', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-02', '2020-02-03', '2020-02-27', '2020-02-29', '2020-03-03', '2020-03-08', '2020-03-15', '2020-03-21', '2020-03-22', '2020-03-27', '2020-04-23', '2020-04-24', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-11', '2020-05-12', '2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16', '2020-05-17', '2020-05-19', '2020-05-20', '2020-05-21', '2021-06-23', '2021-08-27', '2021-10-09', '2021-10-15'],
  //       inputData: ['ports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([40.6, -74.05]),
  //       aoiID: 'US01',
  //       country: ['US'],
  //       city: 'New York',
  //       siteName: 'New York',
  //       description: 'Ports: Ship throughput',
  //       indicator: 'E13c',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Number of Ships in Port',
  //       lastColorCode: 'BLUE',
  //       eoSensor: ['Planet Labs/NASA (PlanetScope)'],
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-73.97302 40.77222,-74.03550 40.76234,-74.11241 40.66345,-74.19480 40.64366,-74.30329 40.50440,-74.22639 40.44643,-73.99087 40.40461,-73.79311 40.39520,-73.64617 40.44695,-73.61665 40.58319,-73.75123 40.59519,-73.79174 40.66033,-73.87895 40.65720,-73.97576 40.61187,-74.00117 40.66189,-73.93868 40.74830,-73.97302 40.77222))').toJson(),
  //         }],
  //       },
  //       time: ['2020-01-02', '2020-01-09', '2020-01-11', '2020-01-16', '2020-01-17', '2020-01-19', '2020-01-20', '2020-01-21', '2020-01-22', '2020-01-23', '2020-01-24', '2020-01-30', '2020-02-02', '2020-02-03', '2020-02-29', '2020-03-08', '2020-03-18', '2020-03-22', '2020-03-27', '2020-05-02', '2020-05-05', '2020-05-09', '2020-05-10', '2020-05-13', '2020-05-14', '2020-05-16', '2020-05-19', '2020-05-20', '2020-05-21'],
  //       inputData: ['ports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([37.7775, -122.41638]),
  //       aoiID: 'US03',
  //       country: ['US'],
  //       city: 'San Francisco',
  //       siteName: 'San Francisco',
  //       description: 'Ports: Ship throughput',
  //       indicator: 'E13c',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Number of Ships in Port',
  //       lastColorCode: 'BLUE',
  //       eoSensor: ['Planet Labs/NASA (PlanetScope)'],
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((-122.63488 37.61314, -122.25654 37.61314, -122.25654 37.88081, -122.63488 37.88081, -122.63488 37.61314))').toJson(),
  //         }],
  //       },
  //       time: ['2020-01-02', '2020-01-03', '2020-01-05', '2020-01-07', '2020-01-10', '2020-01-11', '2020-01-12', '2020-01-13', '2020-01-14', '2020-01-17', '2020-01-18', '2020-01-22', '2020-01-23', '2020-01-27', '2020-01-30', '2020-01-31', '2020-02-03', '2020-02-27', '2020-02-29', '2020-03-03', '2020-03-08', '2020-03-10', '2020-03-11', '2020-04-21', '2020-05-01', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-15', '2020-05-16', '2020-05-17', '2020-05-19', '2020-05-20', '2020-05-21'],
  //       inputData: ['ports'],
  //     },
  //   },
  // },
  // {
  //   properties: {
  //     indicatorObject: {
  //       aoi: latLng([30.05, 32.56]),
  //       aoiID: 'EG01',
  //       country: ['EG'],
  //       city: 'Suez',
  //       siteName: 'Suez Canal',
  //       description: 'Ports: Ship throughput',
  //       indicator: 'E13c',
  //       lastIndicatorValue: 'normal',
  //       indicatorName: 'Number of Ships in Port',
  //       lastColorCode: 'BLUE',
  //       eoSensor: ['Planet Labs/NASA (PlanetScope)'],
  //       subAoi: {
  //         type: 'FeatureCollection',
  //         features: [{
  //           type: 'Feature',
  //           properties: {},
  //           geometry: wkt.read('POLYGON((32.11595 30.28275,31.88249 31.09994,31.95115 31.72112,32.73942 31.67906,32.78062 31.56211,32.59111 30.32306,32.65428 29.99058,32.64878 29.81916,32.44554 29.84060,32.39335 30.15221,32.11595 30.28275))').toJson(),
  //         }],
  //       },
  //       time: ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04', '2020-01-05', '2020-01-06', '2020-01-07', '2020-01-08', '2020-01-09', '2020-01-12', '2020-01-13', '2020-01-14', '2020-01-15', '2020-01-17', '2020-01-18', '2020-01-19', '2020-01-21', '2020-01-22', '2020-01-23', '2020-01-24', '2020-01-25', '2020-01-26', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-02', '2020-02-03', '2020-02-27', '2020-02-29', '2020-03-03', '2020-03-08', '2020-04-21', '2020-04-23', '2020-04-24', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16', '2020-05-17', '2020-05-19', '2020-05-20', '2020-05-21', '2020-08-06', '2020-08-07', '2020-08-08', '2020-08-09', '2020-08-10'],
  //       inputData: [''],
  //       display: {
  //         url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/planet/{z}/{x}/{y}?date={time}&site=sc',
  //         protocol: 'xyz',
  //         tileSize: 256,
  //         dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  //         features: {
  //           name: 'Ship detections',
  //           dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  //           url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/ship/sc/{featuresTime}.geojson',
  //         },
  //       },
  //     },
  //   },
  // },
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
        time: getYearlyDates('2007-01-01', '2021-06-30'),
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
        indicator: 'ADD_Melt_Season_End',
        time: getYearlyDates('2007-01-02', '2021-12-31'),
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
        indicator: 'ADD_Melt_Onset',
        time: getYearlyDates('2007-01-02', '2021-12-31'),
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
        indicator: 'sen4ama',
        time: [ // times for a monthly composite
          '2017-01-01', '2017-02-01', '2017-03-01', '2017-04-01', '2017-05-01', '2017-06-01', '2017-07-01', '2017-08-01', '2017-09-01', '2017-10-01', '2017-11-01', '2017-12-01', '2018-01-01', '2018-02-01', '2018-03-01', '2018-04-01', '2018-05-01', '2018-06-01', '2018-07-01', '2018-08-01', '2018-09-01', '2018-10-01', '2018-11-01', '2018-12-01', '2019-01-01', '2019-02-01', '2019-03-01', '2019-04-01', '2019-05-01', '2019-06-01', '2019-07-01', '2019-08-01', '2019-09-01', '2019-10-01', '2019-11-01', '2019-12-01', '2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01', '2020-06-01', '2020-07-01', '2020-08-01', '2020-09-01', '2020-10-01', '2020-11-01', '2020-12-01', '2021-01-01', '2021-02-01', '2021-03-01', '2021-04-01', '2021-05-01', '2021-06-01', '2021-07-01', '2021-08-01', '2021-09-01', '2021-10-01', '2021-11-01',
        ],
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
];
