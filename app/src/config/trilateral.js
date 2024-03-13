// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import latLng from '@/latLng';
import { DateTime } from 'luxon';
import {
  simplifiedshTimeFunction, shS2TimeFunction, shWeeklyTimeFunction,
} from '@/utils';
import shTimeFunction from '@/shTimeFunction';
import { baseLayers, overlayLayers } from '@/config/layers';
import availableDates from '@/config/data_dates.json';
import locations from '@/config/locations.json';
import {
  statisticalApiHeaders,
  statisticalApiBody,
  evalScriptsDefinitions,
  parseStatAPIResponse,
  nasaStatisticsConfig,
} from '@/helpers/customAreaObjects';

const wkt = new Wkt();
const wkb = new WKB();
const geojsonFormat = new GeoJSON();

export const dataPath = './data/internal/';
export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/trilateral/catalog.json';
// export const STACEndpoint = 'http://127.0.0.1:8000/trilateral/catalog.json';

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
}, baseLayers.cloudless2018, baseLayers.eoxosm, baseLayers.terrainLight];

const mapBoxHighResoSubst = [{
  ...baseLayers.mapboxHighReso,
  visible: true,
}, baseLayers.terrainLight, baseLayers.eoxosm, baseLayers.cloudless];

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
  N3b: {
    sensorColorMap: {
      'Sentinel-3A OLCI': '#a37',
      'Aqua MODIS': '#47a',
      'MODIS Aqua': '#47a',
      'GCOM-C/SGLI': '#6ce',
    },
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

const cairoPresetView = Object.freeze({
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {},
    geometry: wkt.read('POLYGON((30 31.4,32.1 31.6,32.2 28,31 28,30 28,29.7 31,30 31.4))').toJson(),
  }],
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
  NO2_Cairo: {
    baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
    layers: 'NO2-TROPOMI-Cairo-Daily',
    maxZoom: 14,
    legendUrl: 'legends/trilateral/NO2_Cairo.png',
    presetView: cairoPresetView,
  },
  GOSAT_XCO2_JAXA: {
    baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
    layers: 'XCO2-GOSAT-Cairo',
    maxZoom: 14,
    legendUrl: 'legends/trilateral/GOSAT_XCO2_JAXA.png',
    presetView: cairoPresetView,
  },
  SIF_TROPOMI_Cairo: {
    baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
    layers: 'SIF-TROPOMI-Cairo-Monthly',
    maxZoom: 14,
    legendUrl: 'legends/trilateral/SIF_TROPOMI_Cairo.png',
    presetView: cairoPresetView,
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
    legendUrl: 'legends/trilateral/GOSAT_XCO2.png',
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
  'SGLI L2 Reflectance 8-day composited': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fagriculture%2Fgcom-c-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-1%2C1&color_map=cfastie',
    protocol: 'xyz',
    tileSize: 256,
    legendUrl: 'legends/trilateral/NDVI_cfastie.png',
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

const getDailyDates = (start, end, interval = 1) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
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
        aoiID: 'W8',
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sea Ice Thickness (Envisat)',
        indicator: 'SIE',
        indicatorName: 'Sea Ice Thickness (Envisat)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['ESA-CCI-V2-ENVISAT'],
        inputData: [],
        yAxis: 'Sea Ice Thickness (Envisat)',
        showGlobe: true,
        display: {
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Ice Thickness (Envisat)',
          layers: 'ESA-CCI-V2-ENVISAT',
          legendUrl: 'legends/trilateral/SITI-W10.png',
          minZoom: 2,
          maxZoom: 13,
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
        aoiID: 'W9',
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sea Ice Thickness (Cryosat)',
        indicator: 'SIC',
        indicatorName: 'Sea Ice Thickness (Cryosat)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['ESA-CCI-V2-CRYOSAT'],
        inputData: [],
        yAxis: 'ESA-CCI-V2-CRYOSAT',
        showGlobe: true,
        display: {
          baseLayers: arcticBaseMaps,
          overlayLayers: arcticOverlayMaps,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Ice Thickness (Cryosat)',
          layers: 'ESA-CCI-V2-CRYOSAT',
          legendUrl: 'legends/trilateral/SITI-W10.png',
          minZoom: 2,
          maxZoom: 13,
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
    properties: {
      indicatorObject: {
        aoiID: 'SO2',
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sulfur Dioxide (TROPOMI)',
        indicator: 'N1',
        indicatorName: 'Sulfur Dioxide (TROPOMI)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.AWS_VIS_SO2_DAILY_DATA,
        inputData: [],
        yAxis: 'SO2',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'SO2',
          layers: 'AWS_VIS_SO2_DAILY_DATA',
          legendUrl: 'legends/esa/AWS_VIS_SO2_DAILY_DATA.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SO2_DAILY_DATA,
              'byoc-4ad9663f-d173-411d-8d28-3081d4d9e3aa',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Population Density (SEDAC)',
        indicator: 'NASAPopulation',
        indicatorName: 'Population Density (SEDAC)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W6',
        time: ['2020-05-14T00:00:00Z'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Population',
          layers: 'AWS_POPULATION_DENSITY',
          legendUrl: 'legends/esa/AWS_POPULATION_DENSITY.png',
          minZoom: 1,
          maxZoom: 7,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          disableCompare: true,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'World Settlement Footprint',
        indicator: 'WSF',
        indicatorName: 'World Settlement Footprint',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'WSF',
        time: getYearlyDates('1985', '2015'),
        inputData: [''],
        display: [{
          baseUrl: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          name: 'DLR WSF 2019 coverage',
          layers: 'WSF_2019',
          legendUrl: 'data/trilateral/wsf_legend.png',
          minZoom: 1,
          maxZoom: 17,
          labelFormatFunction: (date) => date,
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Copyright DLR (2021);|Contains modified Copernicus Sentinel-1 and Sentinel-2 data [2019]}',
        }, {
          baseUrl: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          name: 'DLR WSF Evolution 1985-2015',
          layers: 'WSF_Evolution',
          minZoom: 1,
          maxZoom: 17,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
          labelFormatFunction: (date) => date,
          specialEnvTime: true,
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Contains modified Landsat-5/-7 data [1985-2015] }',
        }],
      },
    },
  },
  {
    properties: {
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
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Ocean Primary Productivity (GCOM-C)',
        indicator: 'N11',
        indicatorName: 'Ocean Primary Productivity (GCOM-C)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['ONPP-GCOMC-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'ONPP-GCOMC-World-Monthly',
          layers: 'ONPP-GCOMC-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/N11.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Soil Moisture Anomaly',
        indicator: 'SMC',
        indicatorName: 'Soil Moisture Anomaly',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['SMC-Anomaly-GCOMW-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'SMC-Anomaly-GCOMW-World-Monthly',
          layers: 'SMC-Anomaly-GCOMW-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/SMC.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Precipitation Anomaly',
        indicator: 'PRC',
        indicatorName: 'Precipitation Anomaly',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['PRC-Anomaly-GSMaP-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'PRC-Anomaly-GSMaP-World-Monthly',
          layers: 'PRC-Anomaly-GSMaP-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/PRC.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Precipitation',
        indicator: 'PRCG',
        indicatorName: 'Precipitation',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['PRC-GSMaP-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'PRC-GSMaP-World-Monthly',
          layers: 'PRC-GSMaP-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/PRCG.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Soil Moisture Content',
        indicator: 'SMCG',
        indicatorName: 'Soil Moisture Content',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['SMC-GCOMW-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'SMC-GCOMW-World-Monthly',
          layers: 'SMC-GCOMW-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/smc_gcom.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic_ESA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (Sentinel-3)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.83938 44.49919,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic_NASA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Chlorophyll-a (Chl-a) concentration from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (MODIS)',
        dataProvider: 'NASA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,14 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'],
          ['2020-03-18'], ['2020-03-25'], ['2020-04-01'], ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'],
          ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24'], ['2020-07-01'], ['2020-07-08'], ['2020-07-15'], ['2020-07-22'], ['2020-07-29'], ['2020-08-05'], ['2020-08-12'],
          ['2020-09-02'], ['2020-09-09'], ['2020-09-16'], ['2020-09-23'], ['2020-09-30'], ['2020-10-14'], ['2020-10-21'], ['2020-10-28'], ['2020-11-11'], ['2020-11-18'], ['2020-11-25'],
          ['2020-12-09'], ['2020-12-16'], ['2020-12-23'], ['2020-12-30'], ['2021-01-06'], ['2021-01-13'], ['2021-01-20'], ['2021-01-27'], ['2021-02-03'], ['2021-02-10'], ['2021-02-17'],
          ['2021-02-24'], ['2021-03-03'], ['2021-03-10'], ['2021-03-17'], ['2021-03-24'], ['2021-03-31'], ['2021-04-07'], ['2021-04-14'], ['2021-04-21'], ['2021-04-21'], ['2021-04-28'],
          ['2021-05-05'], ['2021-05-12'], ['2021-05-19'], ['2021-05-26'], ['2021-06-02'], ['2021-06-09'], ['2021-06-16'], ['2021-06-23'], ['2021-06-30'], ['2021-07-07'], ['2021-07-14'],
          ['2021-07-21'], ['2021-07-28'], ['2021-08-04'], ['2021-08-11'], ['2021-08-18'], ['2021-08-25'], ['2021-09-01'], ['2021-10-06'], ['2021-10-13'], ['2021-10-20'], ['2021-10-27'],
          ['2021-11-03'], ['2021-11-10'], ['2021-11-17'], ['2021-11-24'], ['2021-12-01'], ['2021-12-08'], ['2021-12-15'], ['2021-12-22'], ['2021-12-29'], ['2022-01-05'], ['2022-01-12'],
          ['2022-01-19'], ['2022-01-26'], ['2022-02-02'], ['2022-02-09'], ['2022-02-16'], ['2022-02-23'], ['2022-03-02'], ['2022-03-09'], ['2022-03-16']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic_JAXA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        dataProvider: 'JAXA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.8 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_NorthAdriatic_JAXA,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_CHLA,
              'byoc-198aa13a-b0c0-4b78-8f69-e08fc58551a7',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Chlorophyll-a (Chl-a) concentration from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.60330 37.39634,-122.60330 38.15399,-121.69693 38.15399,-121.69693 37.39634,-122.60330 37.39634))').toJson(),
          }],
        },
        time: [['2020-03-02'], ['2020-04-03'], ['2020-04-19'], ['2020-05-04'], ['2020-05-05'], ['2020-05-19'], ['2020-05-21'], ['2020-05-24'], ['2020-06-01'], ['2020-06-03'], ['2020-06-06'], ['2020-06-13'], ['2020-06-18'], ['2020-06-21'], ['2020-06-22'], ['2020-06-23'], ['2020-06-26'], ['2020-06-28'], ['2020-07-01'], ['2020-07-03'], ['2020-07-06'], ['2020-07-08'], ['2020-07-13'], ['2020-08-09'], ['2020-08-27'], ['2020-09-06'], ['2020-10-03'], ['2020-10-12'], ['2020-10-19'], ['2020-10-21'], ['2020-10-26'], ['2020-10-28'], ['2020-11-29'], ['2020-12-06'], ['2020-12-15'], ['2020-12-22'], ['2020-12-31'], ['2021-01-07'], ['2021-01-09'], ['2021-01-14'], ['2021-01-16'], ['2021-01-19'], ['2021-01-23'], ['2021-01-29'], ['2021-02-01'], ['2021-02-03'], ['2021-02-08'], ['2021-02-17'], ['2021-02-23'], ['2021-02-24'], ['2021-02-28'], ['2021-03-05'], ['2021-03-12'], ['2021-03-21'], ['2021-03-25'], ['2021-04-06'], ['2021-04-09'], ['2021-04-14'], ['2021-04-24']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: 'legends/trilateral/N3a2_NASA.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([41.0114, -73.09]),
        aoiID: 'US04',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Chlorophyll-a (Chl-a) concentration from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-74.16735 40.17179,-74.16735 41.53390,-70.97122 41.53390,-70.97122 40.17179,-74.16735 40.17179))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-01', '2022-03-16').filter((item) => !['2020-08-19', '2020-08-26'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([35.61, 139.78]),
        aoiID: 'JP01',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.24347 34.83871,139.24347 35.69310,140.26520 35.69310,140.26520 34.83871,139.24347 34.83871))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_JP01,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_CHLA,
              'byoc-198aa13a-b0c0-4b78-8f69-e08fc58551a7',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDelta',
        country: ['FR'],
        city: 'Rhone Delta',
        siteName: 'Fos-sur-Mer',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (Sentinel-3)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585 43.49375, 4.19491 43.49564, 4.62253 43.49564, 4.69632 43.49753, 4.69537 43.48618, 4.67361 43.46442, 4.64523 43.45401, 4.67172 43.42090, 4.70389 43.41428, 4.71146 43.43698, 4.75592 43.43320, 4.78525 43.41806, 4.81647 43.38495, 4.83918 43.38495, 4.82877 43.40671, 4.81552 43.42469, 4.81836 43.43604, 4.86661 43.41050, 4.87040 43.41523, 4.84012 43.44928, 4.85999 43.46821, 4.88459 43.42942, 4.89499 43.43793, 4.91297 43.43509, 4.92621 43.44172, 4.94608 43.49280, 5.21949 43.49753, 5.23558 43.48996, 5.24693 43.46726, 5.23842 43.43415, 5.21476 43.41428, 5.16557 43.39157, 5.08988 43.39157, 5.01420 43.39252, 5.01893 43.37927, 5.03690 43.35657, 5.07096 43.34143, 5.11070 43.33859, 5.15327 43.34427, 5.21760 43.34049, 5.27247 43.35373, 5.30275 43.37265, 5.33208 43.36698, 5.35194 43.35657, 5.36140 43.34143, 5.36992 43.32535, 5.36992 43.31305, 5.36613 43.29791, 5.36613 43.28845, 5.37654 43.27521, 5.38600 43.26102, 5.38316 43.25250, 5.37276 43.24210, 5.35478 43.23263, 5.35005 43.22128, 5.35857 43.21088, 5.37749 43.21655, 5.39925 43.21939, 5.42195 43.21561, 5.45412 43.21939, 5.50331 43.20141, 5.50615 42.99990, 4.19301 42.99896, 4.19585 43.49375))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([34.7, 136.9]),
        aoiID: 'JP04',
        country: ['JP'],
        city: 'Nagoya',
        siteName: 'Nagoya',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((136.4 34.2, 137.4 34.2, 137.4 35.2, 136.4 35.2, 136.4 34.2))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_JP04,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_CHLA,
              'byoc-198aa13a-b0c0-4b78-8f69-e08fc58551a7',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([34.35, 135]),
        aoiID: 'JP02',
        country: ['JP'],
        city: 'Kobe',
        siteName: 'Kobe',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((134.5 33.85, 135.5 33.85, 135.5 34.85, 134.5 34.85, 134.5 33.85))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_JP02,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_CHLA,
              'byoc-198aa13a-b0c0-4b78-8f69-e08fc58551a7',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM_ESA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Total Suspended Matter (TSM) from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (Sentinel-3)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.83938 44.49919,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM_TSMNN,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.05, 29.9]),
        aoiID: 'DanubeDelta',
        country: ['RO'],
        city: 'Danube Delta - Chlorophyll-a concentration',
        siteName: 'Danube Delta',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (Sentinel-3)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((28.981 45.011,28.985 44.39,30.63 44.39,30.62 45.616,29.59 45.61,29.586 44.88,29.266 44.83,29.19 44.86,29.12 45.024,28.981 45.011))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.05, 29.9]),
        aoiID: 'DanubeDelta',
        country: ['RO'],
        city: 'Danube Delta - TSM concentration',
        siteName: 'Danube Delta',
        description: 'Total Suspended Matter (TSM) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (Sentinel-3)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((28.981 45.011,28.985 44.39,30.63 44.39,30.62 45.616,29.59 45.61,29.586 44.88,29.266 44.83,29.19 44.86,29.12 45.024,28.981 45.011))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([43.4, 4.94000]),
        aoiID: 'RhoneDeltaTSM',
        country: ['FR'],
        city: 'Rhone Delta',
        siteName: 'Fos-sur-Mer',
        description: 'Total Suspended Matter (TSM) from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (Sentinel-3)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585 43.49375, 4.19491 43.49564, 4.62253 43.49564, 4.69632 43.49753, 4.69537 43.48618, 4.67361 43.46442, 4.64523 43.45401, 4.67172 43.42090, 4.70389 43.41428, 4.71146 43.43698, 4.75592 43.43320, 4.78525 43.41806, 4.81647 43.38495, 4.83918 43.38495, 4.82877 43.40671, 4.81552 43.42469, 4.81836 43.43604, 4.86661 43.41050, 4.87040 43.41523, 4.84012 43.44928, 4.85999 43.46821, 4.88459 43.42942, 4.89499 43.43793, 4.91297 43.43509, 4.92621 43.44172, 4.94608 43.49280, 5.21949 43.49753, 5.23558 43.48996, 5.24693 43.46726, 5.23842 43.43415, 5.21476 43.41428, 5.16557 43.39157, 5.08988 43.39157, 5.01420 43.39252, 5.01893 43.37927, 5.03690 43.35657, 5.07096 43.34143, 5.11070 43.33859, 5.15327 43.34427, 5.21760 43.34049, 5.27247 43.35373, 5.30275 43.37265, 5.33208 43.36698, 5.35194 43.35657, 5.36140 43.34143, 5.36992 43.32535, 5.36992 43.31305, 5.36613 43.29791, 5.36613 43.28845, 5.37654 43.27521, 5.38600 43.26102, 5.38316 43.25250, 5.37276 43.24210, 5.35478 43.23263, 5.35005 43.22128, 5.35857 43.21088, 5.37749 43.21655, 5.39925 43.21939, 5.42195 43.21561, 5.45412 43.21939, 5.50331 43.20141, 5.50615 42.99990, 4.19301 42.99896, 4.19585 43.49375))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM_TSMNN,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticSST',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic - Sea Surface Temperature',
        siteName: 'North Adriatic',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.83938 44.49919,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDeltaSST',
        country: ['FR'],
        city: 'Rhone Delta - Sea Surface Temperature',
        siteName: 'Fos-sur-Mer',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585 43.49375, 4.19491 43.49564, 4.62253 43.49564, 4.69632 43.49753, 4.69537 43.48618, 4.67361 43.46442, 4.64523 43.45401, 4.67172 43.42090, 4.70389 43.41428, 4.71146 43.43698, 4.75592 43.43320, 4.78525 43.41806, 4.81647 43.38495, 4.83918 43.38495, 4.82877 43.40671, 4.81552 43.42469, 4.81836 43.43604, 4.86661 43.41050, 4.87040 43.41523, 4.84012 43.44928, 4.85999 43.46821, 4.88459 43.42942, 4.89499 43.43793, 4.91297 43.43509, 4.92621 43.44172, 4.94608 43.49280, 5.21949 43.49753, 5.23558 43.48996, 5.24693 43.46726, 5.23842 43.43415, 5.21476 43.41428, 5.16557 43.39157, 5.08988 43.39157, 5.01420 43.39252, 5.01893 43.37927, 5.03690 43.35657, 5.07096 43.34143, 5.11070 43.33859, 5.15327 43.34427, 5.21760 43.34049, 5.27247 43.35373, 5.30275 43.37265, 5.33208 43.36698, 5.35194 43.35657, 5.36140 43.34143, 5.36992 43.32535, 5.36992 43.31305, 5.36613 43.29791, 5.36613 43.28845, 5.37654 43.27521, 5.38600 43.26102, 5.38316 43.25250, 5.37276 43.24210, 5.35478 43.23263, 5.35005 43.22128, 5.35857 43.21088, 5.37749 43.21655, 5.39925 43.21939, 5.42195 43.21561, 5.45412 43.21939, 5.50331 43.20141, 5.50615 42.99990, 4.19301 42.99896, 4.19585 43.49375))').toJson(),
          }],
        },
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([40.985, 1.769]),
        aoiID: 'BarcelonaSST',
        country: ['ES'],
        city: 'Barcelona - Sea Surface Temperature',
        siteName: 'Barcelona',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.51654 40.48551,2.52203 41.56245,2.29138 41.48024,2.21137 41.41621,2.16469 41.3132,2.04936 41.27401,1.91756 41.26782,1.69241 41.21208,1.44803 41.17489,1.26680 41.12942,1.16796 41.07770,0.95079 41.02793,0.72612 40.81047,0.84918 40.72269,0.85468 40.68523,0.65970 40.6644,0.54987 40.57688,0.48396 40.48501,2.51654 40.48551))').toJson(),
          }],
        },
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.05, 29.9]),
        aoiID: 'DanubeDeltaSST',
        country: ['RO'],
        city: 'Danube Delta  - Sea Surface Temperature',
        siteName: 'Danube Delta',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((28.981 45.011,28.985 44.39,30.63 44.39,30.62 45.616,29.59 45.61,29.586 44.88,29.266 44.83,29.19 44.86,29.12 45.024,28.981 45.011))').toJson(),
          }],
        },
        yAxis: '%',
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03SPM',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Total Suspended Matter (TSM) from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.60330 37.39634,-122.60330 38.15399,-121.69693 38.15399,-121.69693 37.39634,-122.60330 37.39634))').toJson(),
          }],
        },
        time: [['2020_03_02'], ['2020_04_03'], ['2020_04_19'], ['2020_05_04'], ['2020_05_05'], ['2020_05_21'], ['2020_05_24'], ['2020_05_28'], ['2020-06-01'], ['2020-06-03'], ['2020-06-06'], ['2020-06-13'], ['2020-06-21'], ['2020-06-22'], ['2020-06-23'], ['2020-06-25'], ['2020-06-28'], ['2020-07-01'], ['2020-07-03'], ['2020-08-09'], ['2020-08-27'], ['2020-09-16'], ['2020-09-17'], ['2020-09-21'], ['2020-09-26'], ['2020-10-01'], ['2020-10-03'], ['2020-10-12'], ['2020-10-19'], ['2020-10-21'], ['2020-10-26'], ['2020-10-28'], ['2020-11-29'], ['2020-12-06'], ['2020-12-22'], ['2020-12-31'], ['2021-01-07'], ['2021-01-09'], ['2021-01-14'], ['2021-01-16'], ['2021-01-19'], ['2021-01-23'], ['2021-01-29'], ['2021-02-01'], ['2021-02-03'], ['2021-02-08'], ['2021-02-17'], ['2021-02-23'], ['2021-02-24'], ['2021-02-28'], ['2021-03-05'], ['2021-03-12'], ['2021-03-21'], ['2021-03-25'], ['2021-04-06'], ['2021-04-09'], ['2021-04-14'], ['2021-04-24']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxZoom: 18,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: 'legends/trilateral/N3a2_NASA_TSMNN.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM_JAXA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        dataProvider: 'JAXA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.8 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_NorthAdriaticTSM_JAXA,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_TSM,
              'byoc-925b4bf6-ca1b-45df-a523-88f30823ab07',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([35.61, 139.78]),
        aoiID: 'JP01TSM',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.24347 34.83871,139.24347 35.69310,140.26520 35.69310,140.26520 34.83871,139.24347 34.83871))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_JP01TSM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_TSM,
              'byoc-925b4bf6-ca1b-45df-a523-88f30823ab07',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([34.7, 136.9]),
        aoiID: 'JP04TSM',
        country: ['JP'],
        city: 'Nagoya',
        siteName: 'Nagoya',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((136.4 34.2, 137.4 34.2, 137.4 35.2, 136.4 35.2, 136.4 34.2))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_JP04TSM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_TSM,
              'byoc-925b4bf6-ca1b-45df-a523-88f30823ab07',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([34.35, 135]),
        aoiID: 'JP02TSM',
        country: ['JP'],
        city: 'Kobe',
        siteName: 'Kobe',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((134.5 33.85, 135.5 33.85, 135.5 34.85, 134.5 34.85, 134.5 33.85))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_JP02TSM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_JAXA_TSM,
              'byoc-925b4bf6-ca1b-45df-a523-88f30823ab07',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM_NASA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Total Suspended Matter (TSM) from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (MODIS)',
        dataProvider: 'NASA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,14 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'], ['2020-03-18'], ['2020-03-25'], ['2020-04-01'],
          ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'], ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24'], ['2020-07-01'], ['2020-07-08'],
          ['2020-07-15'], ['2020-07-22'], ['2020-07-29'], ['2020-08-05'], ['2020-08-12'], ['2020-09-02'], ['2020-09-09'], ['2020-09-16'], ['2020-09-23'], ['2020-09-30'], ['2020-10-14'], ['2020-10-21'], ['2020-10-28'], ['2020-11-11'],
          ['2020-11-18'], ['2020-11-25'], ['2020-12-16'], ['2020-12-23'], ['2020-12-30'], ['2021-01-06'], ['2021-01-13'], ['2021-01-20'], ['2021-01-27'], ['2021-02-03'], ['2021-02-10'], ['2021-02-17'], ['2021-02-24'], ['2021-03-03'],
          ['2021-03-10'], ['2021-03-17'], ['2021-03-24'], ['2021-03-31'], ['2021-04-07'], ['2021-04-14'], ['2021-04-21'], ['2021-04-28'], ['2021-05-05'], ['2021-05-12'], ['2021-05-19'], ['2021-05-26'], ['2021-06-02'], ['2021-06-09'],
          ['2021-06-16'], ['2021-06-23'], ['2021-06-30'], ['2021-07-07'], ['2021-07-14'], ['2021-07-21'], ['2021-07-28'], ['2021-08-04'], ['2021-08-11'], ['2021-08-18'], ['2021-08-25'], ['2021-09-01'], ['2021-10-06'], ['2021-10-13'],
          ['2021-10-20'], ['2021-10-27'], ['2021-11-03'], ['2021-11-10'], ['2021-11-17'], ['2021-11-24'], ['2021-12-01'], ['2021-12-08'], ['2021-12-15'], ['2021-12-22'], ['2021-12-29'], ['2022-01-05'], ['2022-01-12'], ['2022-01-19'],
          ['2022-01-26'], ['2022-02-02'], ['2022-02-09'], ['2022-02-16'], ['2022-02-23'], ['2022-03-02'], ['2022-03-09'], ['2022-03-16']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA_TSMNN.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([41.0114, -73.09]),
        aoiID: 'US04TSM',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Total Suspended Matter (TSM) from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-74.16735 40.17179,-74.16735 41.53390,-70.97122 41.53390,-70.97122 40.17179,-74.16735 40.17179))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-01', '2022-03-16').filter((item) => !['2020-08-19', '2020-08-26'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA_TSMNN.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'GEOGLAM Crop Conditions',
        indicator: 'N6',
        indicatorName: 'Cropped Area',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W6',
        time: availableDates.geoglam,
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxZoom: 6,
          minZoom: 1,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=nearest&bidx=1&colormap=%7B%221%22%3A%20%5B120%2C%20120%2C%20120%2C%20255%5D%2C%222%22%3A%20%5B130%2C%2065%2C%200%2C%20255%5D%2C%223%22%3A%20%5B66%2C%20207%2C%2056%2C%20255%5D%2C%224%22%3A%20%5B245%2C%20239%2C%200%2C%20255%5D%2C%225%22%3A%20%5B241%2C%2089%2C%2032%2C%20255%5D%2C%226%22%3A%20%5B168%2C%200%2C%200%2C%20255%5D%2C%227%22%3A%20%5B0%2C%20143%2C%20201%2C%20255%5D%7D',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          name: 'Agriculture GEOGLAM',
          legendUrl: './data/trilateral/agriculture-GEOGLAM-legend.png',
          tileSize: 256,
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
      indicatorObject: {
        aoi: latLng([39.9, 116.38]),
        aoiID: 'CN01',
        country: ['CN'],
        city: 'Beijing',
        siteName: 'Beijing',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((116.07330 39.76632,116.07330 40.21244,116.72973 40.21244,116.72973 39.76632,116.07330 39.76632))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-be.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([38.90472, -77.01638]),
        aoiID: 'US10',
        country: ['US'],
        city: 'Washington, D.C.',
        siteName: 'Washington, D.C.',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-78.1073 38.43207,-78.1073 39.84650,-75.81665 39.84650,-75.81665 38.43207,-78.1073 38.43207))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-dc.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([51.03613, 2.28537]),
        aoiID: 'FR03',
        country: ['FR'],
        city: 'Port of Dunkirk',
        siteName: 'Port of Dunkirk',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((1.59059 50.73317,1.55490 50.87717,1.73736 50.95414,2.04078 51.01463,2.30437 51.06383,2.50345 51.08280,2.90296 51.24205,3.14734 51.34076,3.60589 51.36905,3.78379 50.85797,2.62231 50.72956,2.57014 50.84064,1.59059 50.73317))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-du.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([51.09155, 3.74008]),
        aoiID: 'BE03',
        country: ['BE'],
        city: 'Port of Ghent',
        siteName: 'Port of Ghent',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19612 51.38292,4.33341 51.41247,4.44187 51.28043,4.63779 50.92072,4.12278 50.84820,3.39652 50.72981,3.22898 51.27339,3.71924 51.35408,3.85245 51.34550,3.90876 51.37295,3.95133 51.41408,4.01999 51.40979,4.05844 51.37552,4.19612 51.38292))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-gh.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([35.61, 139.78]),
        aoiID: 'JP01',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((138.70513 34.89269,138.70513 36.46105,140.90240 36.46105,140.90240 34.89269,138.70513 34.89269))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-tk.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([6.13333, 1.21666]),
        aoiID: 'TG01',
        country: ['TG'],
        city: 'Togo',
        siteName: 'Togo',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-0.89538 11.34271,-0.71960 10.23384,-0.28564 8.48867,-0.00137 6.31120,0.24444 5.71984,0.88439 5.74580,1.14807 6.01901,1.51062 6.18151,1.97204 6.25523,2.29202 6.28390,2.30850 7.075,2.28241 7.54493,2.15744 8.59867,1.57379 9.62106,1.30874 10.26897,1.59576 11.05308,1.32934 11.47464,0.81024 11.63340,0.23620 11.59036,-0.34881 11.47060,-0.89538 11.34271))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-togo.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([34.05, -118.25]),
        aoiID: 'US02',
        country: ['US'],
        city: 'Los Angeles',
        siteName: 'Los Angeles',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-118.76220 33.53217,-118.95172 34.37965,-117.95471 34.54270,-117.94647 34.42497,-116.99615 34.56758,-116.83548 34.00482,-116.76544 33.40390,-118.76220 33.53217))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-la.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([-6.8, 39.28333]),
        aoiID: 'TZ01',
        country: ['TZ'],
        city: 'Dar El Salam',
        siteName: 'Dar El Salam',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((38.64561 -6.64517,38.64561 -6.4528,38.87615 -6.40213,39.04747 -6.45859,39.29809 -6.70893,39.50271 -6.87939,39.56949 -7.01946,39.53653 -7.20206,39.43508 -7.22386,39.25226 -7.24940,38.96919 -7.30594,38.78757 -7.33420,38.74088 -7.06341,38.67239 -6.78616,38.64561 -6.64517))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-dar.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([41.0114, -73.09]),
        aoiID: 'US04',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-75.14099 40.24599,-75.38269 41.13729,-72.89428 41.69342,-71.5979 40.87614,-75.14099 40.24599))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-ny.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63968 37.09977,-122.63968 38.19095,-120.95375 38.19095,-120.95375 37.09977,-122.63968 37.09977))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-sf.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([38.715, -121.944]),
        aoiID: 'US06',
        country: ['US'],
        city: 'Sacramento',
        siteName: 'Sacramento',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-120.8 38, -120.8 40, -122.8 40, -122.8 38, -120.8 38))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-sacramento.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
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
  {
    properties: {
      indicatorObject: {
        aoi: latLng([40.985, 1.769]),
        aoiID: 'BarcelonaTSM_ESA',
        country: ['ES'],
        city: 'Barcelona - Total Suspended Matter',
        siteName: 'Barcelona',
        description: 'Total Suspended Matter (TSM) from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.51654 40.48551,2.52203 41.56245,2.29138 41.48024,2.21137 41.41621,2.16469 41.3132,2.04936 41.27401,1.91756 41.26782,1.69241 41.21208,1.44803 41.17489,1.26680 41.12942,1.16796 41.07770,0.95079 41.02793,0.72612 40.81047,0.84918 40.72269,0.85468 40.68523,0.65970 40.6644,0.54987 40.57688,0.48396 40.48501,2.51654 40.48551))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM_TSMNN,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: './legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoi: latLng([40.985, 1.769]),
        aoiID: 'Barcelona_ESA',
        country: ['ES'],
        city: 'Barcelona - Chlorophyll-a concentration',
        siteName: 'Barcelona',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.51654 40.48551,2.52203 41.56245,2.29138 41.48024,2.21137 41.41621,2.16469 41.3132,2.04936 41.27401,1.91756 41.26782,1.69241 41.21208,1.44803 41.17489,1.26680 41.12942,1.16796 41.07770,0.95079 41.02793,0.72612 40.81047,0.84918 40.72269,0.85468 40.68523,0.65970 40.6644,0.54987 40.57688,0.48396 40.48501,2.51654 40.48551))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: './legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
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
      indicatorObject: {
        indicator: 'FNF',
        aoiID: 'World',
        inputData: ['palsarFNF2017', 'palsarFNF2018', 'palsarFNF2019', 'palsarFNF2020'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'World',
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
        aoiID: 'World',
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
        aoiID: 'World',
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
        aoiID: 'World',
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
        aoiID: 'World',
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
        aoiID: 'World',
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
        aoiID: 'Tulare',
        aoi: latLng([36.0508, -119.7830]),
        country: ['US'],
        city: 'Lake Tulare',
        siteName: 'Lake Tulare',
        description: 'Sentinel 2 L2A - Tulare Lake cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2023-01-01', '2023-01-06', '2023-01-21', '2023-01-26', '2023-01-31', '2023-02-05', '2023-02-10', '2023-02-15', '2023-03-02', '2023-03-07', '2023-03-27', '2023-04-01', '2023-04-06', '2023-04-11', '2023-04-21', '2023-04-26', '2023-05-11', '2023-05-16', '2023-05-21', '2023-05-26'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-119.986955 36.176881, -119.488389 36.176881, -119.488389 35.706412,-119.986955 35.706412 ,-119.986955 36.176881))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Aral',
        aoi: latLng([45.303, 58.581]),
        country: ['UZ', 'KZ'],
        city: 'Aral Lake',
        siteName: 'Aral Lake',
        description: 'Sentinel 2 L2A - Aral Lake cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2017-04-07', '2017-08-05', '2017-08-20', '2017-08-25', '2017-09-14', '2018-04-02', '2018-04-12', '2018-04-27', '2018-05-17', '2018-06-16', '2018-07-01', '2018-07-26', '2018-08-30', '2018-09-14', '2018-09-24', '2018-10-04', '2018-10-09', '2019-06-06', '2019-07-16', '2019-07-22', '2019-08-20', '2019-08-25', '2019-09-19', '2019-10-04', '2019-10-19', '2019-10-22', '2019-11-08', '2020-05-26', '2020-06-15', '2020-06-20', '2020-07-15', '2020-07-20', '2020-09-03', '2020-09-28', '2020-10-18', '2020-10-28', '2020-11-22', '2021-04-11', '2021-04-16', '2021-05-16', '2021-06-20', '2021-06-25', '2021-07-20', '2021-07-25', '2021-08-09', '2021-08-19', '2021-08-24', '2021-09-03', '2021-09-23', '2021-10-13', '2021-10-18', '2021-10-28', '2021-11-07', '2022-04-01', '2022-05-16', '2022-06-25', '2022-06-30', '2022-07-20', '2022-08-19', '2022-08-24', '2022-08-29', '2022-09-13', '2022-09-23', '2022-10-03', '2022-10-08', '2022-10-13', '2022-10-18', '2023-03-17', '2023-03-22', '2023-03-27', '2023-04-01', '2023-04-21', '2023-06-05'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((57 47.72,62.29 47.72,62.29 43.24,57 43.24,57 47.72))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Aral',
        aoi: latLng([45.303, 58.581]),
        country: ['UZ', 'KZ'],
        city: 'Aral Lake',
        siteName: 'Aral Lake',
        description: 'Landsat - Aral Lake cloud free',
        indicator: 'NLK',
        indicatorName: 'Landsat',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-lakes-aral-sea'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          minZoom: 1,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}?collection=landsat-c2l2-sr-lakes-aral-sea&{time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          name: 'Lakes aral sea (NASA)',
          dateFormatFunction: (date) => `item=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((56.91258402 43.48369514, 56.91258402 47.12012485, 63.64131735 47.12012485, 63.64131735 43.48369514, 56.91258402 43.48369514))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Biwa',
        aoi: latLng([35.284, 136.095]),
        country: ['JP'],
        city: 'Lake Biwa',
        siteName: 'Lake Biwa',
        description: 'Sentinel 2 L2A - Biwa Lake cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2017-07-15', '2017-12-07', '2018-03-12', '2018-05-11', '2018-06-25', '2018-07-15', '2018-08-04', '2018-10-03', '2018-11-07', '2018-11-27', '2018-12-02', '2019-04-16', '2019-05-11', '2019-08-09', '2019-11-02', '2020-03-21', '2020-03-26', '2020-04-25', '2020-04-30', '2020-08-23', '2020-10-02', '2020-10-27', '2021-03-31', '2021-04-10', '2021-04-15', '2021-04-20', '2021-05-10', '2021-07-24', '2021-09-27', '2021-10-22', '2021-11-06', '2022-01-10', '2022-02-09', '2022-04-05', '2022-04-10', '2022-04-20', '2022-05-05', '2022-06-09', '2022-07-24', '2022-09-12', '2022-10-02', '2022-11-06', '2023-03-06', '2023-03-11', '2023-04-10', '2023-05-10'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((135.81 35.54,136.36 35.54,136.36 34.94,135.81 34.94,135.81 35.54))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Biwa',
        aoi: latLng([35.284, 136.095]),
        country: ['JP'],
        city: 'Lake Biwa',
        siteName: 'Lake Biwa',
        description: 'Landsat- Biwa Lake cloud free',
        indicator: 'NLK',
        indicatorName: 'Landsat',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-lakes-lake-biwa'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          minZoom: 1,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}?collection=landsat-c2l2-sr-lakes-lake-biwa&{time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          name: 'Lake Biwa (NASA)',
          dateFormatFunction: (date) => `item=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((135.13362826 33.53534479, 135.13362826 35.75089521, 138.17282533 35.75089521, 138.17282533 33.53534479, 135.13362826 33.53534479))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Colorado',
        aoi: latLng([37.4, -110.7]),
        country: ['US'],
        city: 'Colorado River and Lake Powel',
        siteName: 'Lake Powel',
        description: 'Sentinel 2 L2A - Colorado River and Lake Powel cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2017-01-18', '2017-01-28', '2017-02-04', '2017-02-14', '2017-04-15', '2017-05-05', '2017-06-14', '2017-06-27', '2017-06-29', '2017-07-04', '2017-07-17', '2017-08-06', '2017-08-13', '2017-08-26', '2017-09-02', '2017-09-15', '2017-10-05', '2017-10-07', '2017-10-12', '2017-10-20', '2017-10-25', '2017-10-27', '2017-11-01', '2017-11-09', '2017-12-19', '2018-01-13', '2018-01-28', '2018-02-02', '2018-02-04', '2018-02-07', '2018-02-17', '2018-04-23', '2018-05-08', '2018-05-10', '2018-05-15', '2018-05-18', '2018-05-20', '2018-05-25', '2018-06-04', '2018-06-07', '2018-06-09', '2018-06-12', '2018-06-14', '2018-06-19', '2018-06-22', '2018-06-24', '2018-06-27', '2018-07-02', '2018-07-04', '2018-07-07', '2018-07-09', '2018-07-22', '2018-08-06', '2018-08-08', '2018-08-13', '2018-08-23', '2018-08-28', '2018-09-02', '2018-09-07', '2018-09-10', '2018-09-12', '2018-09-17', '2018-09-20', '2018-09-22', '2018-09-27', '2018-10-27', '2018-11-06', '2018-11-14', '2018-11-24', '2018-11-26', '2018-12-09', '2018-12-16', '2018-12-19', '2018-12-24', '2018-12-29', '2019-01-03', '2019-01-28', '2019-03-16', '2019-03-19', '2019-04-18', '2019-04-25', '2019-05-03', '2019-05-13', '2019-05-18', '2019-05-25', '2019-06-02', '2019-06-04', '2019-06-19', '2019-06-24', '2019-06-27', '2019-07-02', '2019-07-04', '2019-07-09', '2019-07-14', '2019-07-17', '2019-07-27', '2019-07-29', '2019-08-13', '2019-08-16', '2019-08-16', '2019-08-18', '2019-08-21', '2019-08-23', '2019-08-28', '2019-08-31', '2019-09-02', '2019-09-05', '2019-09-07', '2019-09-12', '2019-09-20', '2019-09-22', '2019-09-27', '2019-09-30', '2019-10-05', '2019-10-15', '2019-10-22', '2019-10-25', '2019-10-27', '2019-11-01', '2019-11-04', '2019-11-06', '2019-11-09', '2019-11-11', '2019-11-16', '2019-11-24', '2019-12-19', '2019-12-29', '2019-12-31', '2020-01-13', '2020-01-15', '2020-01-28', '2020-02-02', '2020-02-12', '2020-02-24', '2020-02-27', '2020-03-03', '2020-03-05', '2020-03-28', '2020-04-04', '2020-04-24', '2020-04-27', '2020-04-29', '2020-05-02', '2020-05-04', '2020-05-09', '2020-05-19', '2020-05-22', '2020-05-24', '2020-05-27', '2020-06-11', '2020-06-13', '2020-06-18', '2020-06-23', '2020-07-01', '2020-07-06', '2020-07-08', '2020-07-18', '2020-07-28', '2020-07-31', '2020-08-07', '2020-08-10', '2020-08-12', '2020-08-15', '2020-09-01', '2020-09-04', '2020-09-06', '2020-09-11', '2020-09-14', '2020-09-24', '2020-09-29', '2020-10-04', '2020-10-06', '2020-10-14', '2020-10-16', '2020-10-19', '2020-10-21', '2020-10-29', '2020-10-31', '2020-11-05', '2020-11-13', '2020-11-15', '2020-11-23', '2020-11-25', '2020-11-28', '2020-11-30', '2020-12-05', '2020-12-08', '2020-12-15', '2020-12-18', '2020-12-20', '2020-12-25', '2020-12-30', '2021-01-02', '2021-01-04', '2021-01-07', '2021-01-17', '2021-02-06', '2021-02-11', '2021-02-21', '2021-02-23', '2021-03-05', '2021-03-08', '2021-03-18', '2021-03-28', '2021-03-30', '2021-04-02', '2021-04-07', '2021-04-09', '2021-04-12', '2021-04-14', '2021-04-19', '2021-04-29', '2021-05-07', '2021-05-12', '2021-05-14', '2021-05-19', '2021-05-24', '2021-05-27', '2021-06-01', '2021-06-06', '2021-06-08', '2021-06-11', '2021-06-13', '2021-06-16', '2021-07-03', '2021-07-06', '2021-07-11', '2021-07-16', '2021-07-21', '2021-07-31', '2021-08-05', '2021-08-10', '2021-08-15', '2021-08-17', '2021-08-20', '2021-08-22', '2021-08-25', '2021-08-27', '2021-09-06', '2021-09-09', '2021-09-14', '2021-09-16', '2021-09-21', '2021-09-24', '2021-10-04', '2021-10-16', '2021-10-19', '2021-10-29', '2021-11-05', '2021-11-10', '2021-11-13', '2021-11-25', '2021-11-28', '2021-11-30', '2021-12-05', '2021-12-13', '2021-12-18', '2021-12-20', '2022-01-07', '2022-01-09', '2022-01-12', '2022-01-14', '2022-01-22', '2022-01-24', '2022-01-27', '2022-01-29', '2022-02-06', '2022-02-11', '2022-02-13', '2022-02-18', '2022-02-22', '2022-02-26', '2022-02-28', '2022-03-08', '2022-03-15', '2022-03-18', '2022-03-23', '2022-03-25', '2022-04-02', '2022-04-04', '2022-04-07', '2022-04-17', '2022-04-29', '2022-05-02', '2022-05-07', '2022-05-09', '2022-05-12', '2022-05-14', '2022-05-17', '2022-05-24', '2022-06-01', '2022-06-08', '2022-06-13', '2022-06-16', '2022-06-21', '2022-06-23', '2022-06-28', '2022-07-06', '2022-07-08', '2022-07-13', '2022-07-16', '2022-07-21', '2022-08-07', '2022-08-10', '2022-08-17', '2022-08-27', '2022-08-30', '2022-09-04', '2022-09-06', '2022-09-09', '2022-09-19', '2022-09-24', '2022-10-06', '2022-10-09', '2022-10-11', '2022-10-14', '2022-10-19', '2022-10-26', '2022-10-31', '2022-11-13', '2022-11-15', '2022-11-18', '2022-11-20', '2022-11-25', '2022-11-30', '2022-12-08', '2022-12-13', '2022-12-15', '2023-01-07', '2023-01-12', '2023-02-01', '2023-02-06', '2023-02-08', '2023-02-16', '2023-03-03', '2023-03-05', '2023-03-18', '2023-04-07', '2023-04-09', '2023-04-17', '2023-04-29', '2023-05-02', '2023-05-09', '2023-05-19', '2023-05-22', '2023-06-03', '2023-06-08'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-111.83 37.93,-110.32 37.93,-110.32 36.80,-111.83 36.80,-111.83 37.93))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'Sentinel 2 L2A - Tonlé Sap Lake cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2017-01-15', '2017-01-24', '2017-02-13', '2017-05-04', '2017-09-01', '2017-10-21', '2017-12-30', '2018-02-08', '2018-02-13', '2018-02-28', '2018-03-10', '2018-04-14', '2018-04-24', '2018-05-09', '2018-09-06', '2018-09-26', '2018-10-31', '2018-11-05', '2018-12-20', '2018-12-25', '2019-01-09', '2019-01-19', '2019-01-24', '2019-01-29', '2019-02-03', '2019-02-13', '2019-02-28', '2019-03-05', '2019-04-09', '2019-04-19', '2019-04-29', '2019-05-04', '2019-05-19', '2019-11-05', '2019-11-15', '2019-12-10', '2019-12-15', '2019-12-25', '2019-12-30', '2020-01-09', '2020-01-14', '2020-01-19', '2020-02-08', '2020-02-13', '2020-02-18', '2020-02-23', '2020-03-09', '2020-04-08', '2020-04-28', '2020-08-26', '2020-11-09', '2020-11-14', '2020-11-24', '2021-01-13', '2021-02-02', '2021-02-07', '2021-02-12', '2021-02-22', '2021-02-27', '2021-03-29', '2021-08-16', '2021-08-27', '2022-01-08', '2022-01-28', '2022-03-19', '2022-04-13', '2022-04-28', '2022-12-14', '2022-12-19', '2023-01-03', '2023-01-23', '2023-02-17', '2023-02-27', '2023-03-24', '2023-04-03', '2023-04-18'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((103.58 13.33,104.88 13.33,104.88 12.03,103.58 12.03,103.58 13.33))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap_HH',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'ALOS2 Lakes',
        indicator: 'Lakes_ALOS2',
        indicatorName: 'ALOS2 HH - Tonlé Sap',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2016-11-23T00:00:00', '2017-11-22T00:00:00', '2020-11-04T00:00:00', '2021-11-03T00:00:00', '2022-02-09T00:00:00', '2022-03-23T00:00:00', '2022-04-20T00:00:00', '2022-06-01T00:00:00', '2022-07-13T00:00:00', '2022-08-24T00:00:00', '2022-09-21T00:00:00', '2022-12-14T00:00:00'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'JAXA_LAKES_ALOS2_HH',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((103.58 13.33,104.88 13.33,104.88 12.03,103.58 12.03,103.58 13.33))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap_HV',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'ALOS2 Lakes',
        indicator: 'Lakes_ALOS2',
        indicatorName: 'ALOS2 HV - Tonlé Sap',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2016-11-23T00:00:00', '2017-11-22T00:00:00', '2020-11-04T00:00:00', '2021-11-03T00:00:00', '2022-02-09T00:00:00', '2022-03-23T00:00:00', '2022-04-20T00:00:00', '2022-06-01T00:00:00', '2022-07-13T00:00:00', '2022-08-24T00:00:00', '2022-09-21T00:00:00', '2022-12-14T00:00:00'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'JAXA_LAKES_ALOS2_HV',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((103.58 13.33,104.88 13.33,104.88 12.03,103.58 12.03,103.58 13.33))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap_VH',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'Sentinel 1 Lakes',
        indicator: 'Lakes_Sentinel1',
        indicatorName: 'Sentinel 1 IW VH - Tonlé Sap',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2015-05-15', '2015-10-18', '2016-03-22', '2016-10-24', '2016-10-24', '2017-10-07', '2017-10-07', '2018-05-11', '2018-05-11', '2018-10-20', '2018-10-20', '2019-05-06', '2019-05-06', '2019-10-09', '2019-10-09', '2020-05-12', '2020-10-15', '2020-10-15', '2021-05-07', '2021-10-10', '2021-10-10', '2021-10-24', '2022-05-14', '2022-05-14', '2022-10-17', '2022-10-17'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL_1_IW_VH',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((103.58 13.33,104.88 13.33,104.88 12.03,103.58 12.03,103.58 13.33))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap_VV',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'Sentinel 1 Lakes',
        indicator: 'Lakes_Sentinel1',
        indicatorName: 'Sentinel 1 IW VV - Tonlé Sap',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2015-05-15', '2015-10-18', '2016-03-22', '2016-10-24', '2017-10-07', '2018-05-11', '2018-10-20', '2019-05-06', '2019-10-09', '2020-05-12', '2020-10-15', '2021-05-07', '2021-10-10', '2021-10-24', '2022-05-14', '2022-10-17'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL_1_IW_VV',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((103.58 13.33,104.88 13.33,104.88 12.03,103.58 12.03,103.58 13.33))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'Landsat - Tonlé Sap Lake cloud free',
        indicator: 'NLK',
        indicatorName: 'Landsat',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-lakes-tonle-sap'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          minZoom: 1,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}?collection=landsat-c2l2-sr-lakes-tonle-sap&{time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          name: 'Lake Tonle Sap (NASA)',
          dateFormatFunction: (date) => `item=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((101.93844223 11.94560442, 101.93844223 14.06740558, 106.37030883 14.06740558, 106.37030883 11.94560442, 101.93844223 11.94560442))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Vanern',
        aoi: latLng([59.07, 13.535]),
        country: ['SW'],
        city: 'Vänern Lake',
        siteName: 'Vänern Lake',
        description: 'Sentinel 2 L2A - Vänern Lake cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2017-03-11', '2017-07-19', '2018-04-10', '2018-04-20', '2018-05-05', '2018-05-10', '2018-05-15', '2018-05-20', '2018-05-30', '2018-06-29', '2018-07-04', '2018-07-14', '2018-07-24', '2018-08-13', '2018-09-02', '2018-10-07', '2018-10-22', '2019-01-20', '2019-03-31', '2019-04-15', '2019-04-20', '2020-02-24', '2020-05-29', '2020-06-18', '2020-06-23', '2020-08-12', '2020-09-11', '2020-11-20', '2021-02-28', '2021-03-05', '2021-04-04', '2021-04-19', '2021-05-29', '2021-07-23', '2021-08-22', '2021-10-11', '2022-01-14', '2022-02-08', '2022-02-18', '2022-03-15', '2022-03-20', '2022-05-09', '2022-06-18', '2022-08-12', '2023-02-18', '2023-03-15', '2023-04-19', '2023-05-24'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((12.05 59.5,14.4 59.5,14.4 58.2,12.05 58.2,12.05 59.5))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Vanern',
        aoi: latLng([59.07, 13.535]),
        country: ['SW'],
        city: 'Vänern Lake',
        siteName: 'Vänern Lake',
        description: 'Landsat - Vänern Lake cloud free',
        indicator: 'NLK',
        indicatorName: 'Landsat',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-lakes-vanern'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          minZoom: 1,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}?collection=landsat-c2l2-sr-lakes-vanern&{time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          name: 'Lake Vanern (NASA)',
          dateFormatFunction: (date) => `item=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((10.69941816 57.35328549, 10.69941816 59.83119443, 15.98482535 59.83119443, 15.98482535 57.35328549, 10.69941816 57.35328549))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Balaton',
        aoi: latLng([45.89, 17.77]),
        country: ['HU'],
        city: 'Balaton Lake',
        siteName: 'Balaton Lake',
        description: 'Sentinel 2 L2A - Balaton Lake cloud free',
        indicator: 'Lakes_S2L2A',
        indicatorName: 'Sentinel-2 L2A',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: ['2016-11-29', '2016-12-29', '2017-03-29', '2017-05-28', '2017-07-17', '2017-08-01', '2017-08-26', '2017-08-31', '2017-09-10', '2017-10-15', '2017-11-04', '2017-12-19', '2018-04-08', '2018-04-28', '2018-06-12', '2018-08-31', '2018-09-10', '2018-09-30', '2018-10-05', '2018-10-10', '2018-10-20', '2018-11-14', '2018-11-29', '2019-02-17', '2019-02-27', '2019-03-24', '2019-03-29', '2019-06-12', '2019-06-27', '2019-08-31', '2019-09-05', '2019-09-15', '2019-10-15', '2019-10-20', '2019-10-25', '2020-02-02', '2020-03-08', '2020-03-18', '2020-04-02', '2020-04-07', '2020-04-12', '2020-04-22', '2020-07-01', '2020-07-11', '2020-07-21', '2020-07-31', '2020-08-25', '2020-09-09', '2020-09-14', '2020-09-24', '2020-11-18', '2021-02-26', '2021-03-03', '2021-06-16', '2021-07-01', '2021-07-06', '2021-09-09', '2021-10-04', '2021-10-09', '2021-10-24', '2021-10-29', '2021-11-23', '2021-12-18', '2022-01-07', '2022-02-11', '2022-03-13', '2022-03-23', '2022-03-28', '2022-04-12', '2022-05-12', '2022-07-01', '2022-07-06', '2022-07-21', '2022-08-05', '2022-08-25', '2022-10-14', '2022-11-08', '2022-12-13', '2022-12-18', '2023-02-21', '2023-03-13', '2023-03-18', '2023-04-22', '2023-05-22', '2023-06-01'],
        inputData: [''],
        display: {
          dateFormatFunction: shTimeFunction,
          minZoom: 7,
          maxZoom: 17,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((17.08 47.12,18.24 47.12,18.24 46.55,17.08 46.55,17.08 47.12))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Balaton',
        aoi: latLng([45.89, 17.77]),
        country: ['HU'],
        city: 'Balaton Lake',
        siteName: 'Balaton Lake',
        description: 'Landsat - Balaton Lake cloud free',
        indicator: 'NLK',
        indicatorName: 'Landsat',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-lakes-lake-balaton'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          minZoom: 1,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}?collection=landsat-c2l2-sr-lakes-lake-balaton&{time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          name: 'Lake Balaton (NASA)',
          dateFormatFunction: (date) => `item=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((15.04798484 46.34951509, 15.04798484 48.51911491, 19.16156268 48.51911491, 19.16156268 46.34951509, 15.04798484 46.34951509))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Biwa',
        aoi: latLng([35.284, 136.095]),
        country: ['JP'],
        city: 'Lake Biwa',
        siteName: 'Lake Biwa',
        description: 'Surface Water Temperature - Biwa Lake',
        indicator: 'Lakes_SWT',
        indicatorName: 'Surface Water Temperature',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.LAKES_SURFACE_WATER_TEMPERATURE_Biwa,
        inputData: [''],
        yAxis: 'Lake Surface Temperature [K]',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((135.81 35.54,136.36 35.54,136.36 34.94,135.81 34.94,135.81 35.54))').toJson(),
            }],
          },
          baseLayers: cloudlessBaseLayerDefault,
          dateFormatFunction: simplifiedshTimeFunction,
          minZoom: 7,
          maxZoom: 14,
          layers: 'LAKES_SURFACE_WATER_TEMPERATURE',
          legendUrl: 'legends/trilateral/LAKES_SURFACE_WATER_TEMPERATURE.png',
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.LAKES_SURFACE_WATER_TEMPERATURE,
              'byoc-9fdb8c27-9000-4912-b715-1465f840a1db',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Aral',
        aoi: latLng([45.303, 58.581]),
        country: ['UZ', 'KZ'],
        city: 'Lake Aral',
        siteName: 'Lake Aral',
        description: 'Surface Water Temperature - Aral Lake',
        indicator: 'Lakes_SWT',
        indicatorName: 'Surface Water Temperature',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.LAKES_SURFACE_WATER_TEMPERATURE_Aral,
        inputData: [''],
        yAxis: 'Lake Surface Temperature [K]',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((57 47.72,62.29 47.72,62.29 43.24,57 43.24,57 47.72))').toJson(),
            }],
          },
          baseLayers: cloudlessBaseLayerDefault,
          dateFormatFunction: simplifiedshTimeFunction,
          minZoom: 7,
          maxZoom: 14,
          layers: 'LAKES_SURFACE_WATER_TEMPERATURE',
          legendUrl: 'legends/trilateral/LAKES_SURFACE_WATER_TEMPERATURE.png',
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.LAKES_SURFACE_WATER_TEMPERATURE,
              'byoc-9fdb8c27-9000-4912-b715-1465f840a1db',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'TonleSap',
        aoi: latLng([12.7, 104.2]),
        country: ['KH'],
        city: 'Tonlé Sap Lake',
        siteName: 'Tonlé Sap',
        description: 'Surface Water Temperature - Tonlé Sap Lake',
        indicator: 'Lakes_SWT',
        indicatorName: 'Surface Water Temperature',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.LAKES_SURFACE_WATER_TEMPERATURE_Tonlesap,
        inputData: [''],
        yAxis: 'Lake Surface Temperature [K]',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((103.58 13.33,104.88 13.33,104.88 12.03,103.58 12.03,103.58 13.33))').toJson(),
            }],
          },
          baseLayers: cloudlessBaseLayerDefault,
          dateFormatFunction: simplifiedshTimeFunction,
          minZoom: 7,
          maxZoom: 14,
          layers: 'LAKES_SURFACE_WATER_TEMPERATURE',
          legendUrl: 'legends/trilateral/LAKES_SURFACE_WATER_TEMPERATURE.png',
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.LAKES_SURFACE_WATER_TEMPERATURE,
              'byoc-9fdb8c27-9000-4912-b715-1465f840a1db',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Vanern',
        aoi: latLng([59.07, 13.535]),
        country: ['SW'],
        city: 'Vänern Lake',
        siteName: 'Vänern Lake',
        description: 'Vänern Lake Surface Water Temperature',
        indicator: 'Lakes_SWT',
        indicatorName: 'Surface Water Temperature',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.LAKES_SURFACE_WATER_TEMPERATURE_Vanern,
        inputData: [''],
        yAxis: 'Lake Surface Temperature [K]',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((12.05 59.5,14.4 59.5,14.4 58.2,12.05 58.2,12.05 59.5))').toJson(),
            }],
          },
          baseLayers: cloudlessBaseLayerDefault,
          dateFormatFunction: simplifiedshTimeFunction,
          minZoom: 7,
          maxZoom: 14,
          layers: 'LAKES_SURFACE_WATER_TEMPERATURE',
          legendUrl: 'legends/trilateral/LAKES_SURFACE_WATER_TEMPERATURE.png',
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.LAKES_SURFACE_WATER_TEMPERATURE,
              'byoc-9fdb8c27-9000-4912-b715-1465f840a1db',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'Balaton',
        aoi: latLng([45.89, 17.77]),
        country: ['HU'],
        city: 'Balaton Lake',
        siteName: 'Balaton Lake',
        description: 'Balaton Lake Surface Water Temperature',
        indicator: 'Lakes_SWT',
        indicatorName: 'Surface Water Temperature',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.LAKES_SURFACE_WATER_TEMPERATURE_Balaton,
        inputData: [''],
        yAxis: 'Lake Surface Temperature [K]',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((17.08 47.12,18.24 47.12,18.24 46.55,17.08 46.55,17.08 47.12))').toJson(),
            }],
          },
          baseLayers: cloudlessBaseLayerDefault,
          dateFormatFunction: simplifiedshTimeFunction,
          minZoom: 7,
          maxZoom: 14,
          layers: 'LAKES_SURFACE_WATER_TEMPERATURE',
          legendUrl: 'legends/trilateral/LAKES_SURFACE_WATER_TEMPERATURE.png',
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.LAKES_SURFACE_WATER_TEMPERATURE,
              'byoc-9fdb8c27-9000-4912-b715-1465f840a1db',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Global Turbidity Layer Lakes CCI',
        indicator: 'Lakes_WQ_TURB',
        indicatorName: 'Lake Water Quality Turbidity',
        eoSensor: 'Sentinel-3 OLCI',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        aoiID: 'World',
        time: availableDates.LAKE_WATER_QUALITY_TURBIDITY_MEAN,
        inputData: [''],
        yAxis: 'Turbidity [NTU]',
        display: {
          baseLayers: cloudlessBaseLayerDefault,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Lakes Water Quality Turbidity Mean CCI 300m',
          layers: 'LAKE_WATER_QUALITY_TURBIDITY_MEAN',
          legendUrl: 'legends/trilateral/LAKE_WATER_QUALITY_TURBIDITY_MEAN.png',
          minZoom: 8,
          maxZoom: 16,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((7.99 46.55,13.04 46.55,13.04 43.08,7.99 43.08,7.99 46.55))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Global Water Quality True Color Lakes CCI',
        indicator: 'Lakes_WQ_TC',
        indicatorName: 'Lake Water Quality True Color',
        eoSensor: 'Sentinel-3 OLCI',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        aoiID: 'World',
        time: availableDates.LAKE_WATER_QUALITY_TURBIDITY_MEAN,
        inputData: [''],
        yAxis: '',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Lakes Water Quality True Color CCI 300m',
          layers: 'LAKE_WATE_QUALITY_TRUECOLOR',
          minZoom: 8,
          maxZoom: 16,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((7.99 46.55,13.04 46.55,13.04 43.08,7.99 43.08,7.99 46.55))').toJson(),
            }],
          },
        },
      },
    },
  },
];

const createSlowDownIndicator = (aoiID, city, country, aoi, geometry, cog, eoSensor, time) => (
  {
    properties: {
      indicatorObject: {
        aoi,
        aoiID,
        country,
        city,
        siteName: city,
        description: 'Slowdown Proxy Maps',
        indicator: 'N7',
        indicatorName: 'Slowdown & Recovery Proxy Maps',
        eoSensor,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry,
          }],
        },
        time,
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: `https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fslowdown_proxy_map%2F${cog}.tif&resampling_method=bilinear&bidx=1%2C2%2C3`,
          name: 'Movement slowdown',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N7.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  }
);

const slowdownIndicators = [
  {
    aoi: latLng([39.9, 116.38]),
    aoiID: 'CN01',
    country: ['CN'],
    city: 'Beijing',
    eoSensor: ['2020-01-01 compared to 2020-01-29 - 2020-03-01 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((116.07330 39.76632,116.07330 40.21244,116.72973 40.21244,116.72973 39.76632,116.07330 39.76632))').toJson(),
    time: ['2019-11-01'],
    cog: 'Beijing_S1_TA142_SPM_20191101-20200101_20200129-20200301_th-0.cog',
  },
  {
    aoi: latLng([38.90472, -77.01638]),
    aoiID: 'US10',
    country: ['US'],
    city: 'Washington, D.C.',
    eoSensor: ['2020-02-06 compared to 2020-03-28 - 2020-04-24 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-78.1073 38.43207,-78.1073 39.84650,-75.81665 39.84650,-75.81665 38.43207,-78.1073 38.43207))').toJson(),
    time: ['2020-01-03'],
    cog: 'DC_S1_TA004_SPM_20200103-20200206_20200328-20200424_th-0.3.cog',
  },
  {
    aoi: latLng([51.03613, 2.28537]),
    aoiID: 'FR03',
    country: ['FR'],
    city: 'Port of Dunkirk',
    eoSensor: ['2020-02-15 compared to 2020-04-01 - 2020-04-31 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((1.59059 50.73317,1.55490 50.87717,1.73736 50.95414,2.04078 51.01463,2.30437 51.06383,2.50345 51.08280,2.90296 51.24205,3.14734 51.34076,3.60589 51.36905,3.78379 50.85797,2.62231 50.72956,2.57014 50.84064,1.59059 50.73317))').toJson(),
    time: ['2020-01-01'],
    cog: 'Dunkirk_S1_TA161_SPM_20200101-20200215_20200401-20200431_th-0.cog',
  },
  {
    aoi: latLng([51.09155, 3.74008]),
    aoiID: 'BE03',
    country: ['BE'],
    city: 'Port of Ghent',
    eoSensor: ['2020-02-06 compared to 2020-04-01 - 2020-04-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((4.19612 51.38292,4.33341 51.41247,4.44187 51.28043,4.63779 50.92072,4.12278 50.84820,3.39652 50.72981,3.22898 51.27339,3.71924 51.35408,3.85245 51.34550,3.90876 51.37295,3.95133 51.41408,4.01999 51.40979,4.05844 51.37552,4.19612 51.38292))').toJson(),
    time: ['2020-01-03'],
    cog: 'Ghent_S1_TA161_SPM_20200103-20200206_20200401-20200430_th-0.cog',
  },
  {
    aoi: latLng([-12.05, -77.03333]),
    aoiID: 'PE01',
    country: ['PE'],
    city: 'Lima',
    eoSensor: ['2020-03-02 compared to 2020-03-26 - 2020-05-01 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-77.17552 -11.72754,-77.00111 -11.66837,-76.88404 -11.66131,-76.80027 -11.62836,-76.68422 -11.63777,-76.68148 -11.72351,-76.52767 -11.82232,-76.52938 -11.95032,-76.53144 -12.16688,-76.42295 -12.38192,-76.43222 -12.42316,-76.70517 -12.57902,-76.81640 -12.51702,-76.80748 -12.39164,-76.93519 -12.29035,-77.07595 -12.1991,-77.23251 -12.15278,-77.29087 -12.07088,-77.28538 -11.74300,-77.17552 -11.72754))').toJson(),
    time: ['2020-01-14'],
    cog: 'Lima_S1_TA018_SPM_20200114-20200302_20200326-20200501_th-0.cog',
  },
  {
    aoi: latLng([34.05, -118.25]),
    aoiID: 'US02A2',
    country: ['US'],
    city: 'Los Angeles - A2',
    eoSensor: ['2020-02-28 compared to 2020-04-01 - 2020-04-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-118.76220 33.53217,-118.95172 34.37965,-117.95471 34.54270,-117.94647 34.42497,-116.99615 34.56758,-116.83548 34.00482,-116.76544 33.40390,-118.76220 33.53217))').toJson(),
    time: ['2020-01-01'],
    cog: 'LosAngeles_A2_SPM_10m_20200101-20200228_20200401-20200430_th-0.35.cog',
  },
  {
    aoi: latLng([34.05, -118.25]),
    aoiID: 'US02',
    country: ['US'],
    city: 'Los Angeles',
    eoSensor: ['2020-02-28 compared to 2020-04-01 - 2020-04-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-118.76220 33.53217,-118.95172 34.37965,-117.95471 34.54270,-117.94647 34.42497,-116.99615 34.56758,-116.83548 34.00482,-116.76544 33.40390,-118.76220 33.53217))').toJson(),
    time: ['2020-01-03'],
    cog: 'LosAngeles_S1_TA064_SPM_20200103-20200228_20200401-20200430_th-0.cog',
  },
  {
    aoi: latLng([19.076, 72.8777]),
    aoiID: 'IN02',
    country: ['IN'],
    city: 'Mumbai',
    eoSensor: ['2020-01-22 compared to 2020-03-22 - 2020-04-27 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((72.77343 19.45882,73.16894 19.45623,73.91052 19.29299,73.64685 18.58637,72.78991 18.65925,72.67730 18.94006,72.77343 19.45882))').toJson(),
    time: ['2020-01-10'],
    cog: 'Mumbai_S1_TD034_SPM_20200110-20200122_20200322-20200427_th-0.cog',
  },
  {
    aoi: latLng([41.0114, -73.09]),
    aoiID: 'US04',
    country: ['US'],
    city: 'New York',
    eoSensor: ['2020-02-15 compared to 2020-04-01 - 2020-04-31 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-75.14099 40.24599,-75.38269 41.13729,-72.89428 41.69342,-71.5979 40.87614,-75.14099 40.24599))').toJson(),
    time: ['2020-01-01'],
    cog: 'Newyork_S1_TA033_SPM_20200101-20200215_20200401-20200431_th-0.cog',
  },
  {
    aoi: latLng([37.7775, -122.41638]),
    aoiID: 'US03',
    country: ['US'],
    city: 'San Francisco',
    eoSensor: ['2020-02-15 compared to 2020-04-03 - 2020-04-27 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-122.63968 37.09977,-122.63968 38.19095,-120.95375 38.19095,-120.95375 37.09977,-122.63968 37.09977))').toJson(),
    time: ['2020-01-28'],
    cog: 'SanFrancisco_S1_TA035_SPM_20200128-20200215_20200403-20200427_th-0.cog',
  },
  {
    aoi: latLng([-33.45, -70.66666]),
    aoiID: 'CL01',
    country: ['CL'],
    city: 'Santiago',
    eoSensor: ['2020-02-01 compared to 2020-04-01 - 2020-06-12 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-71.29275 -34.15707,-70.54019 -33.91125,-70.48251 -32.91858,-71.60861 -33.02228,-71.52072 -33.49539,-71.29275 -34.15707))').toJson(),
    time: ['2020-01-08'],
    cog: 'Santiago_S1_TA018_SPM_20200108-20200201_20200401-20200612_th-0.cog',
  },
  {
    aoi: latLng([-23.55, -46.63333]),
    aoiID: 'BR02',
    country: ['BR'],
    city: 'Sao Paulo',
    eoSensor: ['2020-02-04 compared to 2020-03-29 - 2020-04-28 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-46.55 -23.45, -46.75 -23.45, -46.75 -23.65, -46.55 -23.65, -46.55 -23.45))').toJson(),
    time: ['2020-01-05'],
    cog: 'SaoPaulo_S1_TD053_SPM_20200105-20200204_20200329-20200428_th-0.cog',
  },
  {
    aoi: latLng([1.26485, 103.84766]),
    aoiID: 'SG01',
    country: ['SG'],
    city: 'Singapore',
    eoSensor: ['2020-02-12 compared to 2020-04-24 - 2020-05-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((104.37973 0.99284,102.85125 0.88299,102.84919 1.13563,103.43078 1.35119,103.33122 1.54270,103.14239 1.63193,103.14548 1.68959,103.49773 1.72425,103.98834 1.68959,104.19502 1.76645,104.29355 1.60962,104.31518 1.35634,104.38522 1.01240,104.37973 0.99284))').toJson(),
    time: ['2020-01-07'],
    cog: 'Singapore_S1_TA171_SPM_20200107-20200212_20200424-20200530_th-0.cog',
  },
  {
    aoi: latLng([35, 137]),
    aoiID: 'JP01',
    country: ['JP'],
    city: 'Aichi',
    eoSensor: ['2020-01-09 compared to 2020-04-26 - 2020-05-08 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((135.864 34.257,138.0622 34.257,138.0622 35.771,135.864 35.771,135.864 34.257))').toJson(),
    time: ['2020-01-09'],
    cog: 'Aichi_S1_TA112_SPM_20200109-20200214_20200426-20200508_th-0.35.cog',
  },
  {
    aoi: latLng([-22.875, -43.3305]),
    aoiID: 'BR03',
    country: ['BR'],
    city: 'Rio de Janeiro',
    eoSensor: ['2020-01-12 compared to 2020-03-24 - 2020-04-29 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-44.292 -23.472,-42.369 -23.472,-42.369 -22.278,-44.292 -22.278,-44.292 -23.472))').toJson(),
    time: ['2020-01-12'],
    cog: 'RiodeJaneiro_S1_TD155_SPM_20200112-20200217_20200324-20200429_th-0.3.cog',
  },
];

slowdownIndicators.forEach((ind) => (
  globalIndicators.push(createSlowDownIndicator(
    ind.aoiID, ind.city, ind.country, ind.aoi,
    ind.geometry, ind.cog, ind.eoSensor, ind.time,
  ))
));

const createSTACCollectionIndicator = (collection, key, value, url,
  indicator, description, legendUrl) => {
  const bbox = JSON.parse(key);
  const aoi = latLng([
    bbox[1] + (bbox[3] - bbox[1]) / 2,
    bbox[0] + (bbox[2] - bbox[0]) / 2,
  ]);
  const geometry = {
    coordinates: [[
      [bbox[0], bbox[1]],
      [bbox[2], bbox[1]],
      [bbox[2], bbox[3]],
      [bbox[0], bbox[3]],
      [bbox[0], bbox[1]],
    ]],
    type: 'Polygon',
  };
  const indicatorObject = {
    properties: {
      indicatorObject: {
        aoi,
        id: value.id,
        aoiID: value.id,
        country: [value.country],
        city: value.location,
        siteName: value.location,
        description,
        indicator,
        indicatorName: '',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry,
          }],
        },
        time: availableDates[`${collection}-${value.id}`],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 5,
          url,
          name: description,
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          legendUrl,
        },
      },
    },
  };
  return indicatorObject;
};
const urlMapping = {
  'nightlights-hd-monthly': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,255&bidx=1&colormap_name=inferno',
  'nightlights-hd-1band': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,255&bidx=1&colormap_name=inferno',
  'blue-tarp-planetscope': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}',
  'blue-tarp-detection': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,10000&bidx=1&colormap_name=inferno',
};

Object.keys(locations).forEach((collection) => {
  Object.entries(locations[collection].entries).forEach(([key, value]) => {
    globalIndicators.push(createSTACCollectionIndicator(
      collection, key, value, urlMapping[collection],
      locations[collection].indicator, locations[collection].description,
      locations[collection].legendUrl,
    ));
  });
});
