// config global variables here for now
// temporary solution
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import { DateTime } from 'luxon';
import { shS2TimeFunction } from '@/utils';
import colormap from 'colormap';
import {
  baseLayers, overlayLayers, trucksFeatures, trucksAreaIndicator,
} from '@/config/layers';
import E13dMapTimes from '@/config/data_dates_e13d.json';
import shTimeFunction from '../shTimeFunction';

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

const wkb = new WKB();
const geojsonFormat = new GeoJSON();

export const dataPath = './eodash-data/internal/';
export const STACEndpoint = 'https://eurodatacube.github.io/eodash-catalog/RACE/catalog.json';

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

const geodbFeatures = {
  name: 'Ship detections',
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
    url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_Sentinel_1_Vessel_Density_Europe-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
  },
}];

export const indicatorsDefinition = Object.freeze({
  E200: {
    features: geodbFeatures,
  },
  E13b: {
    features: {
      ...geodbFeatures,
      name: 'Plane detections',
    },
  },
  E13c: {
    features: {
      name: 'Ship detections',
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
      url: './eodash-data/features/E13c/E13c_{aoiID}_{featuresTime}.geojson',
    },
  },
  E13d: {
    features: {
      ...geodbFeatures,
      name: 'Plane detections',
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

export const geoDBFeatureParameters = Object.freeze({
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash`,
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
  minZoom: 1,
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
  {
    properties: {
      indicatorObject: {
        indicator: 'E10a3',
        disableTimeSelection: true,
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'E10a8',
        disableTimeSelection: true,
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
      indicatorObject: {
        indicator: 'CROPOM',
        queryParameters: [{
          sourceLayer: 'cropom',
          title: 'Forecast parameter',
          selected: 'yield',
          items: [
            {
              id: 'yield',
              description: 'Yield',
              yAxis: 't/ha',
            },
            {
              id: 'water_need',
              description: 'Water need',
              yAxis: 'mm',
            },
          ],
        }, {
          title: 'Crop type',
          selected: 'Wheat',
          items: [
            {
              id: 'Wheat',
              description: 'Wheat',
              min_y: 6,
              max_y: 10,
              min_w: 0,
              max_w: 200,
            },
            {
              id: 'Maize',
              description: 'Maize',
              min_y: 0,
              max_y: 8,
              min_w: 250,
              max_w: 550,
            },
            {
              id: 'Sunflower',
              description: 'Sunflower',
              min_y: 0,
              max_y: 3,
              min_w: 250,
              max_w: 550,
            },
            {
              id: 'Soybean',
              description: 'Soybean',
              min_y: 0,
              max_y: 3,
              min_w: 250,
              max_w: 550,
            },
          ],
        }, {
          title: 'Scenario',
          selected: 'average',
          items: [
            {
              id: 'worst',
              description: 'Worst',
            },
            {
              id: 'average',
              description: 'Average',
            },
            {
              id: 'best',
              description: 'Best',
            },
          ],
        }],
        display: {
          baseUrl: null,
          customAreaIndicator: true,
          disableVisualAnalysisAddons: true,
          tooltip: {
            tooltipFormatFunction: (feature, _, store) => {
              const ind = store.state.indicators.selectedIndicator;
              const selectedParameter = ind.queryParameters[0].items.find((item) => item.id === ind.queryParameters[0].selected);

              const selectedCrop = ind.queryParameters[1].items.find((item) => item.id === ind.queryParameters[1].selected);
              const selectedScenario = ind.queryParameters[2].selected;
              const value = feature.get(selectedParameter.id)[selectedCrop.id][selectedScenario];
              return [
                `Region: ${feature.get('NUTS_NAME')}`,
                `${selectedCrop.description} ${selectedParameter.description}, scenario ${selectedScenario}: ${value}`,
              ]
            },
          },
          features: {
            name: 'CropOM',
            url: 'https://api.cropomservices.com/crop_model/regional_forcast?country_code=HU',
            id: 'cropom',
            projection: {
              name: 'EPSG:3035',
              def: '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
            },
            style: {
              strokeColor: 'rgba(0,0,0,0)',
              getColor: (feature, store) => {
                let color = '#00000000';
                const ind = store.state.indicators.selectedIndicator;
                const selectedParameter = ind.queryParameters[0].selected;
                const selectedCrop = ind.queryParameters[1].items.find((item) => item.id === ind.queryParameters[1].selected);
                const selectedScenario = ind.queryParameters[2].selected;
                const colormapUsed = selectedParameter === 'yield' ? getColormap('chlorophyll', true) : getColormap('density', true);
                const min = selectedParameter === 'yield' ? selectedCrop.min_y : selectedCrop.min_w;
                const max = selectedParameter === 'yield' ? selectedCrop.max_y : selectedCrop.max_w;
                const value = feature.get('yield')[selectedCrop.id][selectedScenario];
                const f = clamp((value - min) / (max - min), 0, 1);
                color = colormapUsed.colors[Math.round(f * (colormapUsed.steps - 1))];
                return color;
              },
            },
            selection: {
              mode: 'single',
            },
            adminZoneKey: 'FID',
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'E12c',
        yAxis: 'Number of trucks detected',
        time: getDailyDates('2020-01-01', '2021-12-31'),
        display: [{
          customAreaIndicator: true,
          customAreaFeatures: true,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A',
          minZoom: 7,
          areaIndicator: trucksAreaIndicator(),
          features: trucksFeatures,
          style: {
            color: '#00c3ff',
          },
          drawnAreaLimitExtent: true,
        }, {
          // get layer for this month
          dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
            .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
            .toFormat('yyyy-MM-dd')}`,
          name: 'Monthly Aggregated Truck Traffic 10km',
          layers: 'VIS_TRUCK_DETECTION_MOTORWAYS_NEW',
          maxZoom: 14,
          opacity: 0.7,
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        indicator: 'E12d',
        time: getDailyDates('2020-01-01', '2021-12-31'),
        yAxis: 'Number of trucks detected',
        display: [{
          customAreaIndicator: true,
          customAreaFeatures: true,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).plus({ days: 1 }).toFormat('yyyy-MM-dd')}`,
          layers: 'SENTINEL-2-L2A-TRUE-COLOR',
          name: 'Daily Sentinel 2 L2A',
          minZoom: 7,
          areaIndicator: trucksAreaIndicator(),
          features: trucksFeatures,
          style: {
            color: '#00c3ff',
          },
          drawnAreaLimitExtent: true,
        }, {
          // get layer for this month
          dateFormatFunction: (date) => `${DateTime.fromISO(date).set({ days: 1 })
            .toFormat('yyyy-MM-dd')}/${DateTime.fromISO(date).set({ days: 1 }).plus({ months: 1 }).minus({ days: 1 })
            .toFormat('yyyy-MM-dd')}`,
          name: 'Monthly Aggregated Truck Traffic 10km',
          layers: 'VIS_TRUCK_DETECTION_PRIMARY_NEW',
          minZoom: 7,
          maxZoom: 14,
          opacity: 0.7,
        }],
      },
    },
  },
];
