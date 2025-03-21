import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import {
  Fill, Stroke, Style, Circle, Text,
} from 'ol/style';
import TileWMS from 'ol/source/TileWMS';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import store from '@/store';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createXYZ } from 'ol/tilegrid';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { MVT, WKB } from 'ol/format';
import { applyStyle } from 'ol-mapbox-style';
import { transformExtent } from 'ol/proj';
import { fetchCustomDataOptions, fetchCustomAreaObjects, template } from '@/helpers/customAreaObjects';
import getProjectionOl from '@/helpers/projutils';
import { replaceAll, PROJDICT } from '../../utils';

const geoJsonFormat = new GeoJSON({});
const wkb = new WKB({});

export function renderTemplateSelectedFeature(urlTemplate) {
  const templateRe = /\{ *([\w_ -]+) *\}/g;
  const ftrs = store.state.features.selectedFeatures;
  const templateSubst = ftrs[0]?.getProperties() || {};
  const url = template(templateRe, urlTemplate, templateSubst);
  return url;
}

/**
 * manually fetches geojson features and replaces the features in the source
 * invalid `null`-ids will be transformed into `undefined`-IDs
 * @param {*} source ol vector source (features of this source will be replaced)
 * @param {String} url geojson url
 */
export async function fetchData({
  usedTime, config, drawnArea, source, map,
}) {
  // fetching of customFeatures
  if (!config?.features || (config.customAreaFeatures && !drawnArea?.area)) {
    source.clear();
    return;
  }
  try {
    const options = fetchCustomDataOptions(usedTime, config, store);
    const custom = await fetchCustomAreaObjects(
      options,
      drawnArea?.area,
      config,
      {},
      'features',
      store,
    );
    source.clear();
    if (custom?.features && custom.features.length) {
      const projection = config?.features?.projection ? getProjectionOl(config.features.projection) : 'EPSG:4326';
      const features = geoJsonFormat.readFeatures(custom, {
        dataProjection: projection,
        featureProjection: map.getView().getProjection(),
      });
      features.forEach((ftr) => {
        if (ftr.getId() === null) {
          ftr.setId(undefined);
        }
        if (config.features?.selection && ftr.getId() === undefined) {
          // we need an unique ID added
          const geom = wkb.writeGeometry(ftr.getGeometry());
          ftr.setId(geom);
        }
        if (ftr.geometry) {
          ftr.setGeometry(geoJsonFormat.readGeometry(ftr.geometry, {
            dataProjection: projection,
            featureProjection: map.getView().getProjection(),
          }));
        }
      });
      source.addFeatures(features);
    }
  } catch (err) {
    source.clear();
    console.error(err);
  }
}

function dynamicColorForSelection(feature, defaultColor = 'rgba(255, 255, 255, 0.0)', applyDynamic = true) {
  const idxInSelected = store.state.features.selectedFeatures.findIndex(
    (ftr) => {
      if (feature.getId() !== undefined) {
        return ftr.getId() === feature.getId();
      }
      return ftr.get('id') === feature.get('id');
    },
  );
  if (idxInSelected !== -1 && applyDynamic) {
    if (applyDynamic) {
      // compensate for limited list of colors (start from beginning if needed)
      const colorIdx = idxInSelected % store.state.config.appConfig.refColors.length;
      return store.state.config.appConfig.refColors[colorIdx];
    }
    // if not applyDynamic, set color to white mostly transparent
    return 'rgba(255, 255, 255, 0.4)';
  }
  return defaultColor;
}

function dynamicWidth(feature, defaultWidth) {
  const idxInSelected = store.state.features.selectedFeatures.findIndex(
    (ftr) => ftr.getId() === feature.getId(),
  );
  if (idxInSelected !== -1) {
    return defaultWidth + 3;
  }
  return defaultWidth;
}

function createVectorLayerStyle(config, options) {
  if (config?.flatStyle) {
    // pass back flat style if contained in config
    let returnStyle = config.flatStyle;
    // Check if variables are defined and need to be "burned in" first
    if ('variables' in config.flatStyle) {
      let rawStyle = JSON.stringify(config.flatStyle);
      const { variables } = config.flatStyle;
      Object.keys(variables).forEach((key) => {
        if (typeof variables[key] === 'number') {
          rawStyle = replaceAll(rawStyle, `["var","${key}"]`, variables[key]);
        } else {
          rawStyle = replaceAll(rawStyle, `["var","${key}"]`, `"${variables[key]}"`);
        }
      });
      returnStyle = JSON.parse(rawStyle);
    }
    return returnStyle;
  }
  if (typeof config?.styleFunction === 'function') {
    // pass down the style function from config accepting a possible feature
    return config.styleFunction;
  }
  const strokeColor = config?.style?.strokeColor || '#F7A400';
  const fillColor = config?.style?.fillColor || 'rgba(255, 255, 255, 0.1)';
  const strokeWidth = config?.style?.width || 2;
  const fill = new Fill({
    color: fillColor,
  });
  const stroke = new Stroke({
    width: strokeWidth,
    color: strokeColor,
  });
  const style = new Style({
    fill,
    stroke,
    image: new Circle({
      fill,
      stroke,
      radius: 4,
    }),
  });

  const dynamicStyleFunction = (feature) => {
    let defaultC = strokeColor;
    let defaultFillC = fillColor;
    let defaultWidth = strokeWidth;
    const dynamicSelectionFill = config?.dynamicSelectionFill !== undefined
      ? config.dynamicSelectionFill : false;
    const dynamicSelectionStroke = config?.dynamicSelectionStroke !== undefined
      ? config.dynamicSelectionStroke : true;
    if (typeof config?.style?.getStrokeColor === 'function') {
      defaultC = config.style.getStrokeColor(feature, store, options);
    }
    if (typeof config?.style?.getColor === 'function') {
      defaultFillC = config.style.getColor(feature, store, options);
    }
    if (config.selection) {
      defaultC = dynamicColorForSelection(feature, defaultC, dynamicSelectionStroke);
      // todo find out a fitting selection fill style for all
      defaultFillC = dynamicColorForSelection(
        feature, defaultFillC, dynamicSelectionFill,
      );
      defaultWidth = dynamicWidth(feature, defaultWidth);
    }
    style.getStroke().setWidth(defaultWidth);
    style.getStroke().setColor(defaultC);
    style.getFill().setColor(defaultFillC);
    return style;
  };
  return dynamicStyleFunction;
}

function replaceUrlPlaceholders(baseUrl, config, options) {
  let url = baseUrl;
  const { time } = options;
  const indicator = options.indicator || store.state.indicators.selectedIndicator?.indicator;
  const aoiID = options.aoiID || store.state.indicators.selectedIndicator?.aoiID;
  url = url.replace(/{time}/i, config.dateFormatFunction(time));
  url = url.replace(/{indicator}/gi, indicator);
  url = url.replace(/{aoiID}/gi, aoiID);
  if (config?.features?.dateFormatFunction) {
    url = url.replace(/{featuresTime}/i, config.features.dateFormatFunction(time));
  }
  if (config.siteMapping) {
    const currSite = config.siteMapping(aoiID);
    url = url.replace(/{site}/gi, currSite);
  }
  return url;
}

async function createWMTSSourceFromCapabilities(config, layer, options) {
  const s = await fetch(config.url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new WMTSCapabilities();
      const result = parser.read(text);
      const selectionOpts = {
        layer: config.layers,
        projection: getProjectionOl(config.projection),
        style: config.style,
        matrixSet: config.matrixSet,
        format: config.format,
        crossOrigin: config.crossOrigin,
      };
      const optsFromCapabilities = optionsFromCapabilities(result, selectionOpts);
      if (config.usedTimes?.time?.length) {
        const updatedDimensions = {
          ...optsFromCapabilities.dimensions,
          ...config.dimensions || {},
          time: options.time,
        };
        optsFromCapabilities.dimensions = updatedDimensions;
      }
      const source = new WMTS({
        attributions: config.attribution,
        ...optsFromCapabilities,
      });
      layer.setSource(source);
      return source;
    });
  s.set('updateTime', (updatedTime, area, configUpdate) => {
    const updatedDimensions = {
      ...layer.getSource().getDimensions(),
      time: configUpdate.dateFormatFunction(updatedTime),
    };
    layer.getSource().updateDimensions(updatedDimensions);
    layer.set('configId', `${configUpdate.name}-${updatedTime}`);
  });
  return s;
}

/**
 * generate a layer from a given config Object
 * @param {Object} config eodash config object
 *
 * layer definitions via config
 * @param {string} config.style.fillColor fill color
 * @param {number} config.style.weight stroke weight
 * @param {string} config.style.color stroke color
 * @param {Object} [opt_options={}] options
 * on the layer. this can be used inside components to update opacity
 * for overlays like labels or borders. Defaults to false.
 * @param {*} [opt_options.time=undefined] optional time.
 * @param {*} [opt_options.indicator=undefined] optional indicator. (e.g. "E13b")
 * @param {*} [opt_options.aoiID=undefined] optional aoiID.
 * @param {*} [opt_options.drawnArea=undefined] optional drawnArea object.
 * if not set, time will be retrieved from the store
 * @returns {BaseLayer} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config, map, _options = {}) {
  const options = { ..._options };
  const paramsToPassThrough = [
    'layers', 'STYLES', 'styles', 'format', 'env', 'sld', 'exceptions', 'token',
  ];
  // layer created by this config, function always returns a single layer
  let layer = null;
  let source = null;
  let featuresSource = null;
  let featuresUpdateFn = null;
  if (config.features) {
    featuresSource = new VectorSource({
      features: [],
    });
    fetchData({
      usedTime: options.time,
      config,
      drawnArea: options.drawnArea,
      source: featuresSource,
      map,
    });
    // this gives an option to update the source (most likely the time) without
    // re-creating the entire layer
    featuresUpdateFn = (time, drawnArea, configUpdate) => {
      const updatedOptions = {
        ...options,
        ...configUpdate,
      };
      updatedOptions.time = time;
      fetchData({
        usedTime: time,
        config: updatedOptions,
        drawnArea,
        source: featuresSource,
        map,
      });
    };
    featuresSource.set('updateTime', featuresUpdateFn);
    let style;
    if (config.features?.flatStyle) {
      style = config.features?.flatStyle;
    } else {
      style = createVectorLayerStyle(config.features, options);
    }
    layer = new VectorLayer({
      id: config.id,
      source: featuresSource,
      customFeatureLayer: true,
      style,
    });
  } else if (config.protocol === 'cog') {
    let updatedSources = config.sources;
    if (config.usedTimes?.time?.length) {
      // Check to see if sources are comming from time assets
      const currentTime = config.usedTimes.time[config.usedTimes.time.length - 1];
      if (Array.isArray(currentTime) && Array.isArray(currentTime[1])) {
        updatedSources = [];
        currentTime[1].forEach((te) => updatedSources.push({ url: te }));
      } else {
        updatedSources = config.sources.map((item) => {
          const url = item.url.replace(/{time}/i, config.dateFormatFunction(currentTime));
          return { url };
        });
      }
    }
    const wgSource = new GeoTIFF({
      sources: updatedSources,
      normalize: config.normalize ? config.normalize : false,
      interpolate: false,
    });
    layer = new WebGLTileLayer({
      source: wgSource,
      style: config.style,
    });
  } else if (config.protocol === 'vectortile') {
    layer = new VectorTileLayer({});
    let layerSelector = '';
    if (Array.isArray(config.selectedStyleLayer) && config.selectedStyleLayer.length > 0) {
      layerSelector = config.selectedStyleLayer;
    } else if (config.selectedStyleLayer) {
      layerSelector = [config.selectedStyleLayer];
    }
    applyStyle(layer, config.styleFile, layerSelector)
      .then(() => {
        if (config.attribution) {
          // allow to override attribution from mapbox style referenced source
          layer.getSource().setAttributions(config.attribution);
        }
      });
  } else if (config.protocol === 'WMTSCapabilities') {
    layer = new TileLayer({});
    createWMTSSourceFromCapabilities(config, layer, options);
  } else if (config.protocol === 'geoserverTileLayer') {
    let style;
    if ('flatStyle' in config) {
      style = config.flatStyle;
    } else {
      style = createVectorLayerStyle(config, options);
    }
    const geoserverUrl = 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/gwc/service/tms/1.0.0/';
    const projString = 'EPSG:3857';
    layer = new VectorTileLayer({
      style,
      source: new VectorTileSource({
        projection: projString,
        format: new MVT(),
        url: `${geoserverUrl}${config.layerName}@${projString}@pbf/{z}/{x}/{-y}.pbf`,
      }),
    });
  } else if (config.protocol === 'GeoJSON') {
    // mutually exclusive options, either direct features or url to fetch
    const url = config.urlTemplateSelectedFeature
      ? renderTemplateSelectedFeature(config.urlTemplateSelectedFeature)
      : config.url;
    let projObj = config.projection;
    if (typeof config.projection === 'string' && PROJDICT[config.projection]) {
      projObj = PROJDICT[config.projection];
    }
    const projection = projObj ? getProjectionOl(projObj) : 'EPSG:4326';
    const vectorSourceOpts = url ? {
      url,
      format: new GeoJSON({
        dataProjection: projection,
        featureProjection: map.getView().getProjection(),
      }),
    } : {
      features: geoJsonFormat.readFeatures(config.data, {
        dataProjection: projection,
        featureProjection: map.getView().getProjection(),
      }),
    };
    const dynamicStyleFunction = createVectorLayerStyle(config, options);
    const vectorSource = new VectorSource(vectorSourceOpts);
    if (config.clusterLayer) {
      const clusterSource = new ClusterSource({
        ...vectorSourceOpts,
        source: vectorSource,
        distance: 50,
        geometryFunction: (feature) => {
          const geom = feature.getGeometry();
          let polygon = geom;
          if (geom.getType() === 'Point') {
            return geom;
          }
          if (geom.getType() === 'MultiPolygon') {
            polygon = geom.getPolygon(0);
          }
          return polygon.getInteriorPoint();
        },
      });
      const styleCache = {};
      layer = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          const size = feature.get('features').length;
          let style = styleCache[size];
          if (!style) {
            style = new Style({
              image: new Circle({
                radius: 20,
                stroke: new Stroke({
                  color: '#fff',
                }),
                fill: new Fill({
                  color: store.state.config.appConfig.branding.primaryColor,
                }),
              }),
              text: new Text({
                text: size.toString(),
                font: '16px Calibri,sans-serif',
                fill: new Fill({
                  color: '#fff',
                }),
              }),
            });
            styleCache[size] = style;
          }
          return style;
        },
      });
    } else {
      // Check if source has times and if yes set to latest
      if (config.usedTimes?.time?.length) {
        const currentTime = config.usedTimes.time[config.usedTimes.time.length - 1];
        if (Array.isArray(currentTime) && Array.isArray(currentTime[1])) {
          // TODO: Currently we support only one vector source
          // if more assets are defined we will need to create multiple sources?
          vectorSource.setUrl(currentTime[1][0]);

          vectorSource.set('updateTime', (time) => {
            vectorSource.setUrl(time[1][0]);
          });
        // if config.urlTemplateSelectedFeature
        // then we do not change on time change, but on selected feature change
        } else if (!config.urlTemplateSelectedFeature) {
          const updateUrl = replaceUrlPlaceholders(config.url, config, options);
          vectorSource.setUrl(updateUrl);
          vectorSource.set('updateTime', (time, area, configUpdate) => {
            const updatedOptions = {
              ...options,
              ...configUpdate,
            };
            updatedOptions.time = time;
            const updurl = replaceUrlPlaceholders(configUpdate.url, configUpdate, updatedOptions);
            vectorSource.setUrl(updurl);
          });
        }
      }
      layer = new VectorLayer({
        source: vectorSource,
        style: dynamicStyleFunction,
      });
    }
  } else if (config.protocol === 'xyz') {
    const sourceOptions = {
      attributions: config.attribution,
      maxZoom: config.maxNativeZoom || config.maxZoom,
      minZoom: config.minNativeZoom || config.minZoom,
      crossOrigin: typeof config.crossOrigin !== 'undefined' ? config.crossOrigin : 'anonymous',
      projection: getProjectionOl(config.projection),
      transition: 0,
      url: config.url,
    };
    source = new XYZSource(sourceOptions);
    layer = new TileLayer({
      source,
    });
    if (config.usedTimes?.time?.length) {
      let url = replaceUrlPlaceholders(config.url, config, options);
      source.setUrl(url);
      source.set('updateTime', (time, area, configUpdate) => {
        const updatedOptions = {
          ...options,
          ...configUpdate,
        };
        updatedOptions.time = time;
        url = replaceUrlPlaceholders(configUpdate.url, configUpdate, updatedOptions);
        source.setUrl(url);
        let timeId = time;
        if (Array.isArray(time) && time.length > 0) {
          [timeId] = time;
        }
        layer.set('configId', `${configUpdate.name}-${timeId}`);
      });
    }
  } else if (config.protocol === 'WMS') {
    const { tileSize } = config;
    const tileGrid = tileSize === 512 ? new TileGrid({
      extent: [-20037508.342789244, -20037508.342789244,
        20037508.342789244, 20037508.342789244],
      resolutions: createXYZ({
        tileSize: 512,
      }).getResolutions(),
      tileSize: 512,
    }) : undefined;
    const params = {};
    paramsToPassThrough.forEach((param) => {
      if (typeof config[param] !== 'undefined') {
        params[param] = config[param];
      }
    });
    if (config.usedTimes?.time?.length) {
      params.time = config.dateFormatFunction(options.time);
      if (config.specialEnvTime) {
        params.env = `year:${params.time}`;
      }
    }
    if (config.specialEnvScenario4) {
      const configUsed = options.dataProp === 'compareMapData' ? config.wmsVariablesCompare : config.wmsVariables;
      const ssp = configUsed.variables.ssp.selected;
      const stormSurge = configUsed.variables.stormSurge.selected;
      const confidence = configUsed.variables.confidence.selected;
      const time = configUsed.variables.time.selected;
      params.ssp = ssp;
      params.stormSurge = stormSurge;
      params.confidence = confidence;
      params.time = `${time}-12-31T00:00:00Z,${time}-12-31T23:59:59Z`;
    }
    source = new TileWMS({
      attributions: config.attribution,
      crossOrigin: typeof config.crossOrigin !== 'undefined' ? config.crossOrigin : 'anonymous',
      transition: 0,
      projection: getProjectionOl(config.projection),
      params,
      url: config.url || config.baseUrl,
      tileGrid,
    });
    source.set('updateTime', (updatedTime, area, configUpdate) => {
      const timeString = configUpdate.dateFormatFunction(updatedTime);
      const paramsUpdate = {};
      paramsToPassThrough.forEach((param) => {
        if (typeof configUpdate[param] !== 'undefined') {
          paramsUpdate[param] = configUpdate[param];
        }
      });
      const newParams = {
        ...paramsUpdate,
        time: timeString,
      };
      if (configUpdate.specialEnvTime) {
        newParams.env = `year:${timeString}`;
      }
      if (configUpdate.specialEnvScenario4) {
        const configUsed = options.dataProp === 'compareMapData' ? configUpdate.wmsVariablesCompare : configUpdate.wmsVariables;
        const ssp = configUsed.variables.ssp.selected;
        const stormSurge = configUsed.variables.stormSurge.selected;
        const confidence = configUsed.variables.confidence.selected;
        const time = configUsed.variables.time.selected;
        newParams.ssp = ssp;
        newParams.stormSurge = stormSurge;
        newParams.confidence = confidence;
        newParams.time = `${time}-12-31T00:00:00Z,${time}-12-31T23:59:59Z`;
      }
      source.updateParams(newParams);
      layer.set('configId', `${configUpdate.name}-${updatedTime}`);
    });
    layer = new TileLayer({
      source,
    });
  }
  if (config.extent) {
    const extent = transformExtent(
      config.extent,
      'EPSG:4326',
      config.projection,
    );
    layer.setExtent(extent);
  }

  let drawnAreaExtent;
  if (config.drawnAreaLimitExtent || config?.features?.drawnAreaLimitExtent) {
    if (options?.drawnArea?.area) {
      drawnAreaExtent = transformExtent(
        geoJsonFormat.readGeometry(options.drawnArea.area).getExtent(),
        'EPSG:4326',
        config.projection,
      );
    } else {
      // default hiding everything
      drawnAreaExtent = transformExtent(
        [0, 0, 0.01, 0.01],
        'EPSG:4326',
        config.projection,
      );
    }
    layer.setExtent(drawnAreaExtent);
  }
  let id = config?.features?.id ? config.features.id : config.id;
  id = typeof id !== 'undefined' ? id : config.name;
  const layerProperties = {
    id,
    opacity: typeof config.opacity !== 'undefined' ? config.opacity : 1,
    name: config.name,
    maxZoom: typeof config.maxZoom !== 'undefined' ? config.maxZoom : 18,
    minZoom: typeof config.minZoom !== 'undefined' ? config.minZoom : 1,
    visible: config.visible,
    layerControlHide: config?.features ? config.features.layerControlHide : config.layerControlHide,
    layerControlOptional: config.layerControlOptional,
    layerConfig: config.layerConfig,
  };
  if ('legend' in config) {
    layerProperties.layerLegend = config.legend;
  } else {
    const legendUrl = config.features ? config.features.legendUrl : config.legendUrl;
    if (legendUrl || config.layerAdditionalDescription) {
      let description = '';
      if (legendUrl) {
        description += `<img src="${legendUrl}" style="max-width: 100%" />`;
      }
      if (config.layerAdditionalDescription) {
        description += config.layerAdditionalDescription;
      }
      layerProperties.description = description;
    }
  }
  layer.setProperties(layerProperties);
  if (config.drawnAreaLimitExtent || config?.features?.drawnAreaLimitExtent) {
    const areaUpdate = (time, drawnArea, configUpdate, l) => {
      if (drawnArea.area) {
        drawnAreaExtent = transformExtent(
          geoJsonFormat.readGeometry(drawnArea.area).getExtent(),
          'EPSG:4326',
          config.projection,
        );
      } else {
        drawnAreaExtent = transformExtent(
          [0, 0, 0.01, 0.01],
          'EPSG:4326',
          config.projection,
        );
      }
      l.setExtent(drawnAreaExtent);
      if (config.customAreaFeatures && featuresSource) {
        featuresUpdateFn(time, drawnArea, configUpdate);
      }
    };
    layer.getSource().set('updateArea', areaUpdate);
  }
  layer.set('configId', config.name);
  if ('id' in config) {
    layer.set('id', config.id);
  } else {
    layer.set('id', config.name);
  }
  return layer;
}
