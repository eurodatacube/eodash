// eslint-disable-next-line import/no-named-default
import { default as powerOpenInsfrastructureStyle } from '@/assets/openinframap/style_oim_power';
import GeoJSON from 'ol/format/GeoJSON';
import WKB from 'ol/format/WKB';
import { DateTime } from 'luxon';
import { Wkt } from 'wicket';

const wkb = new WKB();
const geojsonFormat = new GeoJSON();
const wkt = new Wkt();

export const baseLayers = Object.freeze({
  cloudless: {
    name: 'EOxCloudless 2021',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2021: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2021) }',
    visible: false,
    maxNativeZoom: 17,
    protocol: 'xyz',
  },
  cloudless2018: {
    name: 'EOxCloudless 2018',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2018_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2018: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2018) }',
    visible: false,
    maxNativeZoom: 17,
    protocol: 'xyz',
  },
  terrainLight: {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxNativeZoom: 16,
    visible: false,
    protocol: 'xyz',
  },
  eoxosm: {
    name: 'OSM Background',
    url: '//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ OSM: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxNativeZoom: 16,
    visible: false,
    protocol: 'xyz',
  },
  // S2GLC: {
  //   baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
  //   protocol: 'WMS',
  //   format: 'image/png',
  //   tileSize: 512,
  //   name: 'S2GLC - Europe Land Cover 2017',
  //   layers: 'S2GLC_2017',
  //   attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  //   visible: false,
  //   minZoom: 7,
  // },
  geolandbasemap: {
    name: 'Geoland Basemap',
    url: '//maps1.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxNativeZoom: 18,
    protocol: 'xyz',
  },
  bmapgelaende: {
    name: 'Geoland Basemap Gelände',
    url: '//maps1.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxNativeZoom: 18,
    protocol: 'xyz',
  },
  bmaporthofoto30cm: {
    name: 'Geoland Basemap Orthofoto',
    url: '//maps1.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxNativeZoom: 18,
    protocol: 'xyz',
  },
  bodenwertigkeitskarte_agri: {
    name: 'Soil value - Cropland - bodenkarte.at',
    id: 'bodenwertigkeitskarte_agri',
    styleFile: 'https://bodenkarte.at/styles/ackerwert.json',
    attribution: '{ Digital soil map Austria; <a href="https://bodenkarte.at" target="_blank"> Digitale Bodenkarte</a> }',
    visible: false,
    maxZoom: 17,
    protocol: 'vectortile',
  },
  bodenwertigkeitskarte_grassland: {
    name: 'Soil value - Grassland - bodenkarte.at',
    id: 'bodenwertigkeitskarte_grassland',
    styleFile: 'https://bodenkarte.at/styles/gruenlandwert.json',
    attribution: '{ Digital soil map Austria; <a href="https://bodenkarte.at" target="_blank"> Digitale Bodenkarte</a> }',
    visible: false,
    maxZoom: 17,
    protocol: 'vectortile',
  },
  dsr_schnelllade_10km: {
    name: 'Funding map for fast charging stations',
    id: 'schnellade',
    styleFile: 'data/gtif/data/schnelllade.json',
    attribution: '{ Funding map: green = enough fast charging available, grey = subsidies available - source <a href="https://www.austriatech.at/" target="_blank"> Austriatech </a> }',
    visible: false,
    maxZoom: 17,
    protocol: 'vectortile',
  },
  CORINE_LAND_COVER: {
    baseUrl: `https://creodias.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    name: 'CORINE Land cover',
    layers: 'CORINE_LAND_COVER',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 7,
  },
  ESA_WORLD_COVER: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    name: 'ESA World cover',
    layers: 'ESA_WORLD_COVER',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 6,
  },
  mapboxHighReso: {
    name: 'Mapbox high resolution',
    url: `//api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${shConfig.mbAccessToken}`,
    attribution: '{ <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>, <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>, <a href="https://www.maxar.com/" target="_blank">© Maxar</a> }',
    visible: false,
    protocol: 'xyz',
  },
  s2AT2021: {
    name: 'Sentinel-2 Austrian mosaic 2021',
    attribution: '{ Contains modified Copernicus Sentinel data 2021 }',
    visible: false,
    protocol: 'cog',
    sources: [
      { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/S2_Austrian_Mosaic_rendered_2021_COG.tif' },
    ],
    normalize: true,
  },
  s2AT2022: {
    name: 'Sentinel-2 Austrian mosaic 2022',
    attribution: '{ Contains modified Copernicus Sentinel data 2022 }',
    visible: false,
    protocol: 'cog',
    sources: [
      { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/S2_Austrian_Mosaic_rendered_2022_COG.tif' },
    ],
    normalize: true,
  },
  s1EodcBackscattervv: {
    name: 'EODC Sentinel 1 VV Polarisation',
    url: '//s1map.eodc.eu/vv/{z}/{x}/{-y}.png',
    attribution: 'Bauer-Marschallinger, B., Cao, S., Navacchi, C., Freeman, V., Reuß, F., Geudtner, D., Rommen, B., Vega, F. C., Snoeij, P., Attema, E., Reimer, C., & Wagner, W. (2021). The Sentinel-1 Global Backscatter Model (S1GBM) - Mapping Earth Land Surface with C-Band Microwaves (1.0) [Data set]. TU Wien. https://doi.org/10.48436/n2d1v-gqb91',
    visible: false,
    maxNativeZoom: 13,
    protocol: 'xyz',
  },
  s1EodcBackscattervh: {
    name: 'EODC Sentinel 1 VH Polarisation',
    url: '//s1map.eodc.eu/vh/{z}/{x}/{-y}.png',
    attribution: 'Bauer-Marschallinger, B., Cao, S., Navacchi, C., Freeman, V., Reuß, F., Geudtner, D., Rommen, B., Vega, F. C., Snoeij, P., Attema, E., Reimer, C., & Wagner, W. (2021). The Sentinel-1 Global Backscatter Model (S1GBM) - Mapping Earth Land Surface with C-Band Microwaves (1.0) [Data set]. TU Wien. https://doi.org/10.48436/n2d1v-gqb91',
    visible: false,
    maxNativeZoom: 13,
    protocol: 'xyz',
  },
  terrainLightStereoNorth: {
    baseUrl: 'https://sxcat-demo.eox.at/sxcat_maps/wms',
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    layers: 'sx-cat_ortho680500',
    name: 'Terrain Light Stereographic North',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxZoom: 16,
    visible: false,
    projection: {
      name: 'ORTHO:680500',
      def: '+proj=ortho +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs',
      extent: [-6422528, -6422528, 6422528, 6422528],
    },
  },
  terrainLightStereoSouth: {
    baseUrl: 'https://sxcat-demo.eox.at/sxcat_maps/wms',
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    layers: 'sx-cat_ortho320500',
    name: 'Terrain Light Stereographic South',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxZoom: 16,
    visible: false,
    projection: {
      name: 'ORTHO:320500',
      def: '+proj=ortho +lat_0=-90 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs',
      extent: [-6422528, -6422528, 6422528, 6422528],
    },
  },
});

export const overlayLayers = Object.freeze({
  eoxOverlay: {
    name: 'Overlay labels',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Overlay: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a href="//eox.at" target="_blank">EOX</a> }',
    visible: false,
    maxNativeZoom: 14,
    protocol: 'xyz',
  },
  powerOpenInfrastructure: {
    name: 'Power Open Infrastructure Map',
    protocol: 'vectortile',
    visible: false,
    styleFile: {
      version: 8,
      sprite: './data/gtif/data/openinframap/sprite',
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      id: 'openinframap',
      name: 'OpenInfraMap',
      layers: powerOpenInsfrastructureStyle,
      sources: {
        openinframap: {
          type: 'vector',
          url: 'data/gtif/data/openinframap/openinframap.json',
        },
      },
    },
  },
  protectionZones: {
    name: 'Protection zones',
    protocol: 'geoserverTileLayer',
    visible: false,
    tooltip: {
      tooltipFormatFunction: (feature) => [
        feature.get('sitename'),
      ],
    },
    layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_protected_areas_cdda_2022',
    style: {
      fillColor: 'rgba(0, 0, 0, 0)',
      strokeColor: '#aa0000',
    },
  },
});

export const trucksAreaIndicator = (gtifAustria = false) => ({
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
  requestMethod: 'POST',
  requestHeaders: {
    'Content-Type': 'application/json',
  },
  requestBody: {
    collection: 'eodash_{indicator}-detections',
    select: 'time,geometry',
    order: 'time',
    where: `${gtifAustria ? 'aoi_id=\'AT\' AND ' : ''}ST_Intersects(ST_GeomFromText('{area}',4326), geometry)`,
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
});

export const trucksFeatures = {
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
  requestMethod: 'POST',
  name: 'Truck detections',
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

export const xcubeViewerColormaps = [
  'magma',
  'inferno',
  'plasma',
  'viridis',
  'cividis',
  'Blues',
  'BuGn',
  'BuPu',
  'GnBu',
  'Greens',
  'Greys',
  'OrRd',
  'Oranges',
  'PuBu',
  'PuBuGn',
  'PuRd',
  'Purples',
  'RdPu',
  'Reds',
  'YlGn',
  'YlGnBu',
  'YlOrBr',
  'YlOrRd',
  'Wistia',
  'afmhot',
  'autumn',
  'binary',
  'bone',
  'cool',
  'copper',
  'gist_gray',
  'gist_heat',
  'gist_yarg',
  'gray',
  'hot',
  'pink',
  'spring',
  'summer',
  'winter',
  'BrBG',
  'PRGn',
  'PiYG',
  'PuOr',
  'RdBu',
  'RdGy',
  'RdYlBu',
  'RdYlGn',
  'Spectral',
  'bwr',
  'coolwarm',
  'seismic',
  'Accent',
  'Dark2',
  'Paired',
  'Pastel1',
  'Pastel2',
  'Set1',
  'Set2',
  'Set3',
  'tab10',
  'tab20',
  'tab20b',
  'tab20c',
  'twilight',
  'twilight_shifted',
  'hsv',
  'reg_map',
  'thermal',
  'haline',
  'solar',
  'ice',
  'gray',
  'oxy',
  'deep',
  'dense',
  'algae',
  'matter',
  'turbid',
  'speed',
  'amp',
  'tempo',
  'rain',
  'phase',
  'topo',
  'balance',
  'delta',
  'curl',
  'diff',
  'tarn',
  'turbo',
  'CMRmap',
  'brg',
  'cubehelix',
  'flag',
  'gist_earth',
  'gist_ncar',
  'gist_rainbow',
  'gist_stern',
  'gnuplot',
  'gnuplot2',
  'jet',
  'nipy_spectral',
  'ocean',
  'prism',
  'rainbow',
  'terrain',
];
