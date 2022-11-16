export const baseLayers = Object.freeze({
  cloudless: {
    name: 'EOxCloudless 2021',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2021: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2021) }',
    visible: false,
    maxZoom: 16,
    protocol: 'xyz',
  },
  terrainLight: {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxZoom: 16,
    visible: false,
    protocol: 'xyz',
  },
  mapboxHighReso: {
    name: 'Mapbox high resolution',
    url: `//api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${shConfig.mbAccessToken}`,
    attribution: '{ <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>, <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>, <a href="https://www.maxar.com/" target="_blank">© Maxar</a> }',
    visible: false,
    protocol: 'xyz',
  },
});

export const overlayLayers = Object.freeze({
  eoxOverlay: {
    name: 'Overlay labels',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Overlay: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a href="//eox.at" target="_blank">EOX</a> }',
    visible: false,
    maxZoom: 14,
    protocol: 'xyz',
  },
});
