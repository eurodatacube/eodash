import colormap from 'colormap';
// eslint-disable-next-line import/no-named-default
import { default as powerOpenInsfrastructureStyle } from '@/assets/openinframap/style_oim_power';
import GeoJSON from 'ol/format/GeoJSON';
import WKB from 'ol/format/WKB';
import { DateTime } from 'luxon';
import { Wkt } from 'wicket';

const wkb = new WKB();
const geojsonFormat = new GeoJSON();
const wkt = new Wkt();

export function normalize(value, varMin, varMax) {
  return ['/', ['-', value, ['var', varMin]], ['-', ['var', varMax], ['var', varMin]]];
}

export function getColorStops(name, min, max, steps, reverse) {
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
  cloudless2019: {
    name: 'EOxCloudless 2019',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2018: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019) }',
    visible: false,
    maxZoom: 17,
    protocol: 'xyz',
  },
  cloudless2020: {
    name: 'EOxCloudless 2020',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2018: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020) }',
    visible: false,
    maxZoom: 17,
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
    url: 'https://mapsneu.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxNativeZoom: 18,
    protocol: 'xyz',
  },
  bmapgelaende: {
    name: 'Geoland Basemap Gelände',
    url: 'https://mapsneu.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxNativeZoom: 18,
    protocol: 'xyz',
  },
  bmaporthofoto30cm: {
    name: 'Geoland Basemap Orthofoto',
    url: 'https://mapsneu.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg',
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
    legendUrl: 'https://www.eea.europa.eu/data-and-maps/figures/corine-land-cover-2000-by-country-3/legend/image_large',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 7,
  },
  ESA_WORLD_COVER: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    name: 'ESA World cover 2020',
    layers: 'ESA_WORLD_COVER',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 3,
    layerAdditionalDescription: `<table>
          <tbody><tr>
              <td style="width: 20px; background: rgb(0, 100, 0)"></td>
              <td><span>Tree cover</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(255, 187, 34)"></td>
              <td><span>Shrubland</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(255, 255, 76)"></td>
              <td><span>Grassland</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(240, 150, 255)"></td>
              <td><span>Cropland</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(250, 0, 0)"></td>
              <td><span>Built-up</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(180, 180, 180)"></td>
              <td><span>Bare / sparse vegetation</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(240, 240, 240)"></td>
              <td><span>Snow and ice</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(0, 100, 200)"></td>
              <td><span>Permanent water bodies</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(0, 150, 160)"></td>
              <td><span>Herbaceous wetland</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(0, 207, 117)"></td>
              <td><span>Mangroves</span></td>
          </tr>
          <tr>
              <td style="width: 20px; background: rgb(250, 230, 160)"></td>
              <td><span>Moss and lichen</span></td>
          </tr>
      </tbody></table>`,
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
    minNativeZoom: 2,
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
    minNativeZoom: 2,
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
    name: 'Protected areas (CDDA 2022)',
    protocol: 'geoserverTileLayer',
    visible: false,
    selection: 'single',
    layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_protected_areas_cdda_2022',
    style: {
      fillColor: '#99cc3388',
      strokeColor: '#339900',
    },
    tooltip: true,
    allowedParameters: ['sitename'],
  },
  protectionZonesNatura: {
    name: 'Protected areas (Natura 2000)',
    protocol: 'geoserverTileLayer',
    visible: false,
    selection: 'single',
    layerName: 'geodb_debd884d-92f9-4979-87b6-eadef1139394:GTIF_protected_areas_natura_2000',
    style: {
      fillColor: '#99cc3388',
      strokeColor: '#339900',
    },
    tooltip: true,
    allowedParameters: ['sitename'],
  },
});

export const cnrData = () => ({
  url: 'https://xcube-geodb.brockmann-consult.de/eodash/6bf15325-f6a0-4b6a-bf80-a2491753f8f2/eodash_Water_Discharge_timeseries?aoi_id=eq.IT20&select=site_name,city,color_code,time,aoi,measurement_value,indicator_value,reference_time,eo_sensor,reference_value,input_data',
  name: 'CNR data',
  callbackFunction: (response, indicator) => {
    const newData = {
      time: [],
      measurement: [],
      colorCode: [],
    };
    response.forEach((entry) => {
      // convert to structure indicatorData expects
      newData.time.push(DateTime.fromISO(entry.time));
      newData.measurement.push(Number(entry.measurement_value));
      if (entry.input_data !== '/') {
        newData.colorCode.push('#b34b4b');
      } else {
        newData.colorCode.push('#00000000');
      }
    });
    // eslint-disable-next-line no-param-reassign
    indicator.yAxis = '';
    // eslint-disable-next-line no-param-reassign
    indicator.name = 'Water discharge';
    const ind = {
      ...indicator,
      ...newData,
    };
    return ind;
  },
});

export const trucksAreaIndicator = (gtifAustria = false, timeParameter = 'time') => ({
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
        } else {
          const intersects = areaAsGeom.intersectsCoordinate(geom.coordinates);
          if (intersects) {
            intersectingFtrs += 1;
          }
        }
        if (intersectingFtrs > 0) {
          // as data is structured one entry per country, we need to aggregate on date
          if (row[timeParameter]) {
            if (row[timeParameter] in datesObj) {
              datesObj[row[timeParameter]] += intersectingFtrs;
            } else {
              datesObj[row[timeParameter]] = intersectingFtrs;
            }
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
        } else {
          const { geometry, ...properties } = ftr;
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
  dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-MM-dd')}T00:00:00`,
  areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
};

export const marineDataStoreDepths = [
  '-4000', '-3500', '-3000', '-2500', '-2000', '-1800', '-1600', '-1400', '-1200', '-1000', '-900', '-800', '-700', '-600', '-500', '-450', '-400', '-350', '-300', '-250', '-200', '-175', '-150', '-125', '-100', '-90', '-80', '-70', '-60', '-50', '-40', '-30', '-25', '-20', '-15', '-10', '-6', '-4', '-2', '0'].reverse();

export const marineDataStoreColorscales = [
  'algae', 'amp', 'balance', 'cividis', 'cyclic', 'delta', 'dense', 'gray', 'haline', 'ice', 'inferno', 'magma', 'matter', 'phase', 'plasma', 'rainbow', 'solar', 'speed', 'tempo', 'thermal', 'viridis',
];

export const xcubeViewerColormaps = [
  'magma', 'inferno', 'plasma', 'viridis', 'cividis', 'Blues', 'BuGn', 'BuPu', 'GnBu', 'Greens', 'Greys', 'OrRd', 'Oranges', 'PuBu', 'PuBuGn', 'PuRd', 'Purples', 'RdPu', 'Reds', 'YlGn', 'YlGnBu', 'YlOrBr', 'YlOrRd', 'Wistia', 'afmhot', 'autumn', 'binary', 'bone', 'cool', 'copper', 'gist_gray', 'gist_heat', 'gist_yarg', 'gray', 'hot', 'pink', 'spring', 'summer', 'winter', 'BrBG', 'PRGn', 'PiYG', 'PuOr', 'RdBu', 'RdGy', 'RdYlBu', 'RdYlGn', 'Spectral', 'bwr', 'coolwarm', 'seismic', 'Accent', 'Dark2', 'Paired', 'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3', 'tab10', 'tab20', 'tab20b', 'tab20c', 'twilight', 'twilight_shifted', 'hsv', 'reg_map', 'thermal', 'haline', 'solar', 'ice', 'gray', 'oxy', 'deep', 'dense', 'algae', 'matter', 'turbid', 'speed', 'amp', 'tempo', 'rain', 'phase', 'topo', 'balance', 'delta', 'curl', 'diff', 'tarn', 'turbo', 'CMRmap', 'brg', 'cubehelix', 'flag', 'gist_earth', 'gist_ncar', 'gist_rainbow', 'gist_stern', 'gnuplot', 'gnuplot2', 'jet', 'nipy_spectral', 'ocean', 'prism', 'rainbow', 'terrain',
];

const cropomdefaults = (parameter) => ({
  baseUrl: null,
  customAreaIndicator: true,
  disableVisualAnalysisAddons: true,
  tooltip: {
    tooltipFormatFunction: (feature, _, store) => {
      const selectedParams = store.state.features.selectedJsonformParameters;
      const { crop, vstat } = selectedParams;
      const value = feature.get(parameter)[crop][vstat];
      const unit = parameter === 'yield' ? 't/ha' : 'mm';
      const name = feature.get('NUTS_NAME') || feature.get('NAME');
      return [
        `Region: ${name}`,
        `${crop} ${parameter}, scenario ${vstat}: ${value} ${unit}`,
      ];
    },
  },
  areaIndicator: {
    url: 'https://api.cropom-dev.com/crop_model/regional_forecast?nuts_id={adminZone}&crop={crop}&scenario={scenario}',
    adminZoneKey: 'NUTS_ID',
    requestMethod: 'GET',
    callbackFunction: (responseJson, indicator) => {
      const data = responseJson.growth;
      const newData = {
        time: [],
        measurement: [],
        referenceValue: [],
      };
      Object.entries(data).forEach(([key, value]) => {
        newData.time.push(DateTime.fromISO(key));
        newData.measurement.push(value.yield_);
        newData.referenceValue.push(value.biomass);
      });
      newData.yAxis = ['t/ha', 'g/m2'];
      const ind = {
        ...indicator,
        ...newData,
      };
      return ind;
    },
  },
  selection: {
    mode: 'single',
  },
});

export const createCropomDatasetConfigs = () => [
  'CROPOMHU1', 'CROPOMAT1', 'CROPOMHUMR1', 'CROPOMHUSC1', 'CROPOMRO1',
].map((n) => ({
  properties: {
    indicatorObject: {
      indicator: n,
      display: cropomdefaults('yield'),
    },
  },
})).concat([
  'CROPOMHU2', 'CROPOMAT2', 'CROPOMHUMR2', 'CROPOMHUSC2', 'CROPOMRO2',
].map((n) => ({
  properties: {
    indicatorObject: {
      indicator: n,
      display: cropomdefaults('water_need'),
    },
  },
})));
