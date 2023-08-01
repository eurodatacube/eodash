// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import { DateTime } from 'luxon';
import latLng from '@/latLng';
import { shTimeFunction, shS2TimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import availableDates from '@/config/data_dates.json';
import E13dMapTimes from '@/config/data_dates_e13d.json';

import {
  // statisticalApiHeaders,
  // statisticalApiBody,
  // evalScriptsDefinitions,
  // parseStatAPIResponse,
  shFisAreaIndicatorStdConfig,
} from '@/helpers/customAreaObjects';

const wkt = new Wkt();
const wkb = new WKB();
const geojsonFormat = new GeoJSON();

export const dataPath = './eodash-data/internal/';
export const STACEndpoint = 'http://127.0.0.1:8000/RACE/catalog.json';
export const dataEndpoints = [
  // {
  //   type: 'eox',
  //   provider: './data/internal/pois_eodash.json',
  // },
];

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

const E1bConfigInputDataAsc = [{
  dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
  layers: 'S1-GRD-IW-ASC-VV',
  name: 'Daily Sentinel 1 VV Asc',
  minZoom: 7,
  maxZoom: 18,
  legendUrl: 'legends/esa/VIS_SENTINEL_1_VESSEL_DENSITY_EUROPE.png',
  features: {
    ...geodbFeatures,
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
  features: {
    ...geodbFeatures,
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

const cloudlessBaseLayerDefault = [{
  ...baseLayers.cloudless,
  visible: true,
}, baseLayers.eoxosm, baseLayers.terrainLight];

export const indicatorsDefinition = Object.freeze({
  C1: {
    indicatorSummary: 'Combined 1',
    indicatorOverwrite: 'Ports and Shipping - impact on air quality',
    themes: ['economy', 'air'],
  },
  C2: {
    indicatorSummary: 'Combined 2',
    themes: ['economy', 'air'],
  },
  C3: {
    indicatorSummary: 'Combined 3',
    themes: ['economy', 'air'],
  },
  E200: {
    indicatorSummary: 'Changes in Ships traffic within the Port',
    themes: ['economy'],
    story: '/eodash-data/stories/E200',
    features: geodbFeatures,
  },
  E1: {
    indicatorSummary: 'Status of metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)', 'classification', 'TIMESTAMP UTC', 'TYPE_NAME', 'LENGTH'],
    },
  },
  E1_S2: {
    indicatorSummary: 'Status of metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E1a: {
    indicatorSummary: 'Status of non-metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1a',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['classification'],
    },
  },
  E1a_S2: {
    indicatorSummary: 'Status of non-metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1a',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E1b: {
    indicatorSummary: 'Vessel density',
    themes: ['economy'],
    story: '/eodash-data/stories/E1b',
  },
  E2: {
    indicatorSummary: 'Volume of oil stockpiled (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E2',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['classification'],
    },
  },
  E2_S2: {
    indicatorSummary: 'Volume of oil stockpiled (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E2',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E2a: {
    indicatorSummary: 'Level of flaring activity',
    themes: ['economy'],
  },
  E3: {
    indicatorSummary: 'Inventory levels of factory inputs',
    themes: ['economy'],
  },
  E4: {
    indicatorSummary: 'Production activity of intermediate goods',
    themes: ['economy'],
    story: '/eodash-data/stories/E4',
  },
  /*
  E5: {
    indicatorSummary: 'Inventory levels of intermediate goods',
    themes: ['economy'],
    story: '/eodash-data/stories/E5',
  },
  */
  E6: {
    indicatorSummary: 'Inventory levels of factory inputs',
    themes: ['economy'],
  },
  E7: {
    indicatorSummary: 'Production activity of finished goods',
    themes: ['economy'],
  },
  E8: {
    indicatorSummary: 'Inventory Levels',
    themes: ['economy'],
    story: '/eodash-data/stories/E8',
    maxDecimals: 5,
  },
  E9: {
    indicatorSummary: 'Construction activity',
    themes: ['economy'],
  },
  E10a1: {
    indicatorSummary: 'Harvesting activity',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a1',
  },
  E10a2: {
    indicatorSummary: 'Cum. proportion of total area under active mgmt.',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a2',
    maxDecimals: 4,
  },
  E10a3: {
    indicatorSummary: 'Evolution of the cultivated areas for production of white asparagus',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a2',
  },
  E10a5: {
    indicatorSummary: 'Harvesting activity',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a5',
  },
  E10a6: {
    indicatorSummary: 'Harvested parcels/area evolution over time',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a6',
    maxDecimals: 4,
  },
  E10a8: {
    indicatorSummary: 'Cumulative harvested area',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a8',
  },
  E10a9: {
    indicatorSummary: 'Tomatoes cultivation',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a9',
  },
  E10a10: {
    indicatorSummary: 'Harvesting evolution over time',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a10',
  },
  E10b: {
    indicatorSummary: 'Field preparation activity',
    themes: ['agriculture'],
  },
  E11: {
    indicatorSummary: 'Volume of activity at shopping centers',
    themes: ['economy'],
    story: '/eodash-data/stories/E11',
  },
  E11a: {
    indicatorSummary: 'Indicator definition placeholder',
    themes: ['economy'],
  },
  E12a: {
    indicatorSummary: 'Volume of activity logistic interchange centers',
    themes: ['economy'],
  },
  E12b: {
    indicatorSummary: 'Throughput at border crossing points',
    themes: ['economy'],
    story: '/eodash-data/stories/E12b',
    maxDecimals: 3,
  },
  E12c: {
    indicatorSummary: 'Number of Trucks',
    themes: ['economy'],
    customAreaIndicator: true,
    customAreaFeatures: true,
    story: '/eodash-data/stories/E12c',
  },
  E12d: {
    indicatorSummary: 'Number of Trucks',
    themes: ['economy'],
    customAreaIndicator: true,
    customAreaFeatures: true,
    story: '/eodash-data/stories/E12d',
  },
  E13a: {
    indicatorSummary: 'Throughput at principal rail stations',
    themes: ['economy'],
  },
  E13c: {
    themes: ['economy'],
    story: '',
  },
  E13d: {
    indicatorSummary: 'Airports: airplanes traffic',
    themes: ['economy'],
    story: '/eodash-data/stories/E13d',
    baseLayers: cloudlessBaseLayerDefault,
    mapTimeLabelExtended: true,
    features: {
      ...geodbFeatures,
      url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_{indicator}-detections?{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
      dateFormatFunction: (date) => {
        // +- 45 minutes to fix detections being few minutes from each other (adjacent scenes)
        const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss";
        const dateObj = DateTime.fromISO(date);
        const dateFuture = dateObj.plus({ minutes: 45 }).toFormat(defaultFormat);
        const datePast = dateObj.minus({ minutes: 45 }).toFormat(defaultFormat);
        const query = `time=gte.${datePast}&time=lte.${dateFuture}`;
        return query;
      },
    },
    largeTimeDuration: true,
  },
  E13e: {
    indicatorSummary: 'Ports and Shipping - traffic (AIS)',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13f: {
    indicatorSummary: 'Maritime traffic: fishing',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13g: {
    indicatorSummary: 'Maritime traffic: tanker',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13h: {
    indicatorSummary: 'Maritime traffic: tug',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13i: {
    indicatorSummary: 'Maritime traffic: search, rescue',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13l: {
    indicatorSummary: 'Maritime traffic: pleasure craft',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13m: {
    indicatorSummary: 'Maritime traffic: passenger',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13n: {
    indicatorSummary: 'Ports and Shipping - traffic (AIS, Sentinel-1, mobile)',
    themes: ['economy'],
    story: '/eodash-data/stories/E13n',
  },
  E13o: {
    indicatorSummary: 'Vessel density for all',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  E13p: {
    indicatorSummary: 'Vessel density for cargo',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  E13q: {
    indicatorSummary: 'Vessel density for tankers',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  E13r: {
    indicatorSummary: 'Vessel density for others',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  H1: {
    indicatorSummary: 'Number of temp. treatment sites',
    themes: ['health'],
  },
  N1: {
    indicatorSummary: 'Air quality',
    themes: ['air'],
    story: '/eodash-data/stories/N1',
    externalData: {
      label: 'Sentinel-5p Mapping Service',
      url: 'https://maps.s5p-pal.com',
    },
    largeTimeDuration: true,
  },
  N1a: {
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1b: {
    indicatorSummary: 'CAMS Air quality',
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1c: {
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1d: {
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  NASAPopulation: {
    indicatorSummary: 'Population',
    themes: ['economy'],
    story: '/data/trilateral/NASAPopulation',
  },
  WSF: {
    indicatorSummary: 'World Settlement Footprint',
    themes: ['economy'],
    story: '/eodash-data/stories/WSF-WSF',
  },
  N2: {
    indicatorSummary: 'CO2 emissions',
    themes: ['air'],
    largeTimeDuration: true,
  },
  N3: {
    indicatorSummary: 'CHL concentration',
    themes: ['water'],
    story: '/eodash-data/stories/N3',
  },
  /*
  N3a2: {
    indicatorSummary: 'CHL concentration',
    themes: ['water'],
    story: '/eodash-data/stories/N3a2',
    customAreaIndicator: true,
  },
  */
  N4a: {
    indicatorSummary: 'Changes in land fill sites',
    themes: ['land'],
    story: '/eodash-data/stories/N4a',
    disableCSV: true,
  },
  N4b: {
    indicatorSummary: 'Illegal waste levels',
    themes: ['land'],
  },
  N3c: {
    indicatorSummary: 'CMEMS Water Quality',
    themes: ['water'],
    largeTimeDuration: true,
    story: '/eodash-data/stories/N3c',
  },
  N4c: {
    indicatorSummary: 'Changes in land fill sites',
    themes: ['land'],
    story: '/eodash-data/stories/N4c',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HH"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
    disableCSV: true,
  },
  OX: {
    indicatorSummary: 'Crude Oil Storage Utilization',
    themes: ['economy'],
    story: '/eodash-data/stories/OX',
    disableCSV: true,
  },
  GG: {
    indicatorSummary: 'Mobility',
    themes: ['economy'],
    disableTimeSelection: true,
    story: '/eodash-data/stories/GG-GG',
    disableCSV: true,
  },
  CV: {
    indicatorSummary: 'Covid-19 cases',
    themes: ['health'],
    disableTimeSelection: true,
    story: '/eodash-data/stories/CV-CV',
    disableCSV: true,
  },
  OW: {
    indicatorSummary: 'Covid-19 vaccinations',
    themes: ['health'],
    disableTimeSelection: true,
    story: '/eodash-data/stories/OW-OW',
    disableCSV: true,
  },
  /*
  GSA: {
    indicatorSummary: 'Mobility',
    themes: ['economy'],
    disableTimeSelection: true,
    borderSelection: true,
    story: '/eodash-data/stories/GSA-GSA',
  },
  */
  CDS1: {
    indicatorSummary: 'C3S Data',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  CDS2: {
    indicatorSummary: 'Relative humidity',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  CDS3: {
    indicatorSummary: 'Wind U field',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  CDS4: {
    indicatorSummary: 'Wind V field',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  d: { // dummy for locations without Indicator code
    indicatorSummary: 'Upcoming data',
    themes: ['economy'],
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

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.eoxosm, baseLayers.cloudless];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.eoxosm, baseLayers.cloudless];

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
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

export const cmemsDisplay = {
  tileSize: 256,
  minZoom: 1,
  layers: 'CHL',
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

export const excludeMapTimes = {
};

export const replaceMapTimes = {
  ...E13dMapTimes,
};

export const globalIndicators = [
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
        indicatorName: 'CAMS daily averaged NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'NO2 (μmol/m2)',
        display: {
          styles: 'sh_OrangesTransparent40_surface_concentration',
          baseUrl: 'https://eccharts.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged NO2',
          layers: 'composition_europe_no2_analysis_surface',
          legendUrl: 'legends/esa/GCAQ1-N1b.png',
          crossOrigin: null,
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
        indicatorName: 'CAMS daily averaged PM2.5',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'PM2.5 (μg/m3)',
        display: {
          styles: 'sh_PurplesTransparent40_surface_concentration',
          baseUrl: 'https://eccharts.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          crossOrigin: null,
          layers: 'composition_europe_pm2p5_analysis_surface',
          legendUrl: 'legends/esa/GCAQ2-N1b.png',
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
        indicatorName: 'CAMS daily averaged PM10',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'PM10 (μg/m3)',
        display: {
          styles: 'sh_GreensTransparent40_surface_concentration',
          baseUrl: 'https://eccharts.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          crossOrigin: null,
          layers: 'composition_europe_pm10_analysis_surface',
          legendUrl: 'legends/esa/GCAQ3-N1b.png',
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
        indicatorName: 'CAMS daily averaged O3',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'O3 (μg/m3)',
        display: {
          styles: 'sh_OrangesTransparent240_surface_concentration',
          baseUrl: 'https://eccharts.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          crossOrigin: null,
          layers: 'composition_europe_o3_analysis_surface',
          legendUrl: 'legends/esa/GCAQ4-N1b.png',
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
        description: 'WSF Evolution',
        indicator: 'WSF',
        indicatorName: 'World Settlement Footprint (WSF) Evolution',
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
        dataLoadFinished: true,
        country: 'all',
        city: 'Europe',
        siteName: 'global',
        description: 'CMEMS Water Quality',
        indicator: 'N3c',
        indicatorName: 'CMEMS Water Quality',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates.CHL,
        inputData: [''],
        externalData: {
          label: 'Copernicus Marine Service - Product Details',
          url: 'https://data.marine.copernicus.eu/products?q=Sea+ocean+colour&facets=mainVariables~Plankton',
        },
        display: [{
          name: 'CHL L4 Product',
          legendUrl: 'legends/esa/N3c.png',
          attribution: '{ E.U. Copernicus Marine Service Information; <a href="https://doi.org/10.48670/moi-00303" target="_blank"> doi:10.48670/moi-00303</a>;  <a href="https://doi.org/10.48670/moi-00300" target="_blank"> doi:10.48670/moi-00300 </a>;  <a href="https://doi.org/10.48670/moi-00287" target="_blank"> doi:10.48670/moi-00287 </a>; }',
          combinedLayers: [
            {
              ...cmemsDisplay,
              baseUrl: 'https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_atl_bgc-plankton_my_l4-multi-1km_P1M?LOGSCALE=true&COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Atlantic coast CHL L4 Product',
              extent: [-46, 19.5, 13, 66],
            }, {
              ...cmemsDisplay,
              baseUrl: 'https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_med_bgc-plankton_my_l4-multi-1km_P1M?LOGSCALE=true&COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Mediterranean CHL L4 Product',
              extent: [-6, 30, 37, 46],
            }, {
              ...cmemsDisplay,
              baseUrl: 'https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_blk_bgc-plankton_my_l4-multi-1km_P1M?LOGSCALE=true&COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Black sea CHL L4 Product',
              extent: [26.5, 40, 42, 48],
            },
          ],
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([48.87, 2.78]),
        aoiID: 'FR16',
        country: ['FR'],
        city: 'Disneyland Paris',
        description: 'Volume of activity at shopping center',
        indicator: 'E11',
        indicatorName: 'Volume of activity at shopping center',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.76907 48.86129,2.76907 48.88170,2.79872 48.88170,2.79872 48.86129,2.76907 48.86129))').toJson(),
          }],
        },
        time: availableDates['AWS_ICEYE-E11'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E11',
          minZoom: 5,
          name: 'Disneyland Paris',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: cloudlessBaseLayerDefault,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([52.244, 21.045]),
        aoiID: 'PL7',
        country: ['PL'],
        city: 'Warsaw',
        description: 'Volume of activity at parking lot',
        indicator: 'E11a',
        indicatorName: 'Volume of activity at parking lot',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((21.03890 52.23563,21.03890 52.24898,21.05229 52.24898,21.05229 52.23563,21.03890 52.23563))').toJson(),
          }],
        },
        time: availableDates['AWS_ICEYE-E11A'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E11A',
          minZoom: 5,
          name: 'Warsaw parking lot',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: cloudlessBaseLayerDefault,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([50.604, -2.37]),
        aoiID: 'UK9',
        country: ['GB'],
        city: 'Weymouth',
        description: 'Ports and Shipping - impact on cruises',
        indicator: 'E13c',
        indicatorName: 'Ports and Shipping - impact on cruises',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-2.39347 50.58519,-2.39347 50.62474,-2.33785 50.62474,-2.33785 50.58519,-2.39347 50.58519))').toJson(),
          }],
        },
        time: availableDates['AWS_ICEYE-E12B'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E12B',
          minZoom: 5,
          name: 'Weimouth ships',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/E12b/E12b_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: cloudlessBaseLayerDefault,
        },
      },
    },
  },
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
