// config global variables here for now
// temporary solution
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import { DateTime } from 'luxon';
import { shTimeFunction, shS2TimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import E13dMapTimes from '@/config/data_dates_e13d.json';

const wkb = new WKB();
const geojsonFormat = new GeoJSON();

export const dataPath = './eodash-data/internal/';
export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/RACE/catalog.json';

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

/*
const trucksAreaIndicator = {
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    collection: 'eodash_{indicator}-detections',
    select: 'time,geometry',
    where: 'ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
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
  drawnAreaLimitExtent: true,
  name: 'Daily truck detections',
  style: {
    strokeColor: '#00c3ff',
  },
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
*/
const E1bConfigInputDataAsc = [{
  dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
  layers: 'S1-GRD-IW-ASC-VV',
  name: 'Daily Sentinel 1 VV Asc',
  minZoom: 7,
  maxZoom: 18,
  legendUrl: 'legends/esa/VIS_SENTINEL_1_VESSEL_DENSITY_EUROPE.png',
  features: {
    ...geodbFeatures,
    name: 'Ship detections',
    url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_Sentinel_1_Vessel_Density_Europe-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
  },
}, {
  // get layer for this month
  dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
    .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
    .toFormat('yyyy-MM-dd')}`,
  name: 'Monthly Aggregated Vessel density',
  layers: 'VIS_SENTINEL_1_VESSEL_DENSITY_EUROPE',
  minZoom: 6,
  maxZoom: 14,
  opacity: 0.6,
}];

const E1bConfigInputDataDes = [{
  dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
  layers: 'S1-GRD-IW-DES-VV',
  name: 'Daily Sentinel 1 VV Desc',
  minZoom: 7,
  maxZoom: 18,
  legendUrl: 'legends/esa/VIS_SENTINEL_1_VESSEL_DENSITY_EUROPE.png',
}, {
  // get layer for this month
  dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
    .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
    .toFormat('yyyy-MM-dd')}`,
  name: 'Monthly Aggregated Vessel density',
  layers: 'VIS_SENTINEL_1_VESSEL_DENSITY_EUROPE',
  minZoom: 6,
  maxZoom: 14,
  opacity: 0.6,
  features: {
    ...geodbFeatures,
    name: 'Ship detections',
    url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_Sentinel_1_Vessel_Density_Europe-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
  },
}];

export const indicatorsDefinition = Object.freeze({
  E200: {
    features: geodbFeatures,
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
    layers: 'NEW_PLEIADES',
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
    dateFormatFunction: shS2TimeFunction,
  },
  'S1A - GRD': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shS2TimeFunction,
  },
  'S1B - GRD': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shS2TimeFunction,
  },
  'Sentinel-2 L1C': {
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    dateFormatFunction: shS2TimeFunction,
  },
  'Sentinel-5p Level-3 NO2': {
    layers: 'AWS_NO2-VISUALISATION',
  },
  'S1A-GRD-IW-asc-VV': E1bConfigInputDataAsc,
  'S1B-GRD-IW-asc-VV': E1bConfigInputDataAsc,
  'S1A-GRD-IW-des-VV': E1bConfigInputDataDes,
  'S1B-GRD-IW-des-VV': E1bConfigInputDataDes,
});

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
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

export const excludeMapTimes = {
};

export const replaceMapTimes = {
  ...E13dMapTimes,
};

export const globalIndicators = [
  /* TODO:
   * WSF Evolutioncombination with 2019 layer not implemented, need to consider how
   * CMEMS not combined into 1 indicator, but served as 3, they have different times,
   * so maybe best approach
  */
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: false,
        aoiID: 'EU1',
        country: 'indicatorall',
        city: 'Europe',
        siteName: 'global',
        description: 'Crude Oil Storage Index (EU)',
        indicator: 'OX',
        indicatorName: 'Crude Oil Storage Index (EU)',
      },
    },
  },
];
