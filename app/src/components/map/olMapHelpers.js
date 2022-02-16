import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import Cluster from 'ol/source/Cluster';
import VectorSource from 'ol/source/Vector';
import { LineString, Point, Polygon } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { createEmpty, extend, getWidth } from 'ol/extent';
import monotoneChainConvexHull from 'monotone-chain-convex-hull';
import store from '@/store';

import { asArray } from 'ol/color';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import {
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import { indicatorClassesIcons } from '../../config/trilateral';
import { getColor } from './olMapColors';

const onStylesLoaded = [];

const indicatorClassesStyles = Object.keys(indicatorClassesIcons).reduce((acc, key) => {
  const image = new Image();
  image.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'screen';
    context.fillStyle = 'white';
    context.fillRect(0, 0, image.width, image.height);
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(image, 0, 0);
    acc[key] = new Icon({
      scale: 0.66,
      img: canvas,
      imgSize: [image.width, image.height],
    });
    if (Object.keys(acc).length === Object.keys(indicatorClassesIcons).length) {
      onStylesLoaded.forEach((cb) => cb());
    }
  });
  image.src = `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${indicatorClassesIcons[key].substr(4)}.svg`;
  return acc;
}, {});


/**
 * generate a layer from a given config Object
 * @returns {*} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config) {
  let source;
  if (config.protocol === 'xyz') {
    source = new XYZSource({
      attributions: config.attribution,
      crossOrigin: 'anonymous',
      url: config.url,
    });
  }
  return new TileLayer({
    name: config.name,
    visible: config.visible,
    maxZoom: config.maxNativeZoom,
    source,
  });
}

const circleDistanceMultiplier = 1;
const circleFootSeparation = 28;
const circleStartAngle = Math.PI / 2;

const convexHullFill = new Fill({});
const convexHullStroke = new Stroke({
  width: 0.5,
  lineDash: [4, 4],
});
const outerCircleFill = new Fill({
  color: 'rgba(58, 104, 142, 0.5)',
});
const innerCircleFill = new Fill({
  color: '#282828',
});
const textFill = new Fill({
  color: '#fff',
});

const innerCircle = new CircleStyle({
  radius: 14,
  fill: innerCircleFill,
});
const outerCircle = new CircleStyle({
  radius: 18,
  fill: outerCircleFill,
});


const textStyle = new Text({
  text: '',
  fill: new Fill({
    color: 'white',
  }),
  font: '18px "Material Design Icons"',
});


/**
 * Single feature style, users for clusters with 1 feature and cluster circles.
 * @param {Feature} clusterMember A feature from a cluster.
 * @param {Object} vm vue instance
 * @return {Style} An icon style for the cluster member's location.
 */
function clusterMemberStyle(clusterMember, vm) {
  const { indicatorObject } = clusterMember.getProperties().properties;
  const indicatorCode = indicatorObject.indicator;
  const indicator = store.getters['features/getIndicators'].find((i) => i.code === indicatorCode);
  const circleStyle = new Style({
    image: new CircleStyle({
      radius: 12,
      fill: new Fill({
        color: getColor(indicatorObject, vm),
      }),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
    text: textStyle,
    geometry: clusterMember.getGeometry(),
  });
  const iconStyle = new Style({
    image: indicatorClassesStyles[indicator.class],
    geometry: clusterMember.getGeometry(),
  });
  const memberStyle = [circleStyle, iconStyle];
  return memberStyle;
}

let clickFeature;
let clickResolution;

/**
 * From
 * https://github.com/Leaflet/Leaflet.markercluster/blob/31360f2/src/MarkerCluster.Spiderfier.js#L55-L72
 * Arranges points in a circle around the cluster center, with a line pointing from the center to
 * each point.
 * @param {number} count Number of cluster members.
 * @param {Array<number>} clusterCenter Center coordinate of the cluster.
 * @param {number} resolution Current view resolution.
 * @return {Array<Array<number>>} An array of coordinates representing the cluster members.
 */
function generatePointsCircle(count, clusterCenter, resolution) {
  const circumference = circleDistanceMultiplier * circleFootSeparation * (2 + count);
  let legLength = circumference / (Math.PI * 2); // radius from circumference
  const angleStep = (Math.PI * 2) / count;
  const res = [];
  let angle;
  legLength = Math.max(legLength, 35) * resolution; // Min distance to get outside the cluster icon.

  for (let i = 0; i < count; ++i) {
    // Clockwise, like spiral.
    angle = circleStartAngle + i * angleStep;
    res.push([
      clusterCenter[0] + legLength * Math.cos(angle),
      clusterCenter[1] + legLength * Math.sin(angle),
    ]);
  }
  return res;
}

/**
 * Style for clusters with features that are too close to each other, activated on click.
 * @param {Feature} cluster A cluster with overlapping members.
 * @param {number} resolution The current view resolution.
 * @return {Style} A style to render an expanded view of the cluster members.
 */
function clusterCircleStyle(cluster, resolution) {
  if (cluster !== clickFeature || resolution !== clickResolution) {
    return;
  }
  const clusterMembers = cluster.get('features');
  const centerCoordinates = cluster.getGeometry().getCoordinates();
  // eslint-disable-next-line consistent-return
  return generatePointsCircle(
    clusterMembers.length,
    cluster.getGeometry().getCoordinates(),
    resolution,
  ).reduce((styles, coordinates, i) => {
    const point = new Point(coordinates);
    const line = new LineString([centerCoordinates, coordinates]);
    const offsetStyle = clusterMemberStyle(
      new Feature({
        ...clusterMembers[i].getProperties(),
        geometry: point,
      }),
      this,
    );
    styles.unshift(
      new Style({
        geometry: line,
        stroke: convexHullStroke,
      }),
    );
    styles.push(
      ...offsetStyle,
    );
    return styles;
  }, []);
}

let hoverFeature;
let clickInteraction;
let pointermoveInteraction;

/**
 * Style for convex hulls of clusters, activated on hover.
 * @param {Feature} cluster The cluster feature.
 * @return {Style} Polygon style for the convex hull of the cluster.
 */
function clusterHullStyle(cluster) {
  if (cluster !== hoverFeature) {
    return;
  }
  const originalFeatures = cluster.get('features');
  const points = originalFeatures.map((feature) => feature.getGeometry().getCoordinates());
  // eslint-disable-next-line consistent-return
  return new Style({
    geometry: new Polygon([monotoneChainConvexHull(points)]),
    fill: convexHullFill,
    stroke: convexHullStroke,
  });
}

function createClusterStyle(vm) {
  return ((feature) => {
    const size = feature.get('features').length;
    if (size > 1) {
      return [
        new Style({
          image: outerCircle,
        }),
        new Style({
          image: innerCircle,
          text: new Text({
            text: size.toString(),
            fill: textFill,
            font: '12px sans-serif',
          }),
        }),
      ];
    }
    const originalFeature = feature.get('features')[0];
    return clusterMemberStyle(originalFeature, vm);
  });
}

/**
 * creates an OL Layer out of the existing grouped feature object
 * @param {Object} indicators Grouped Features
 * @param {Object} vm vue instance
 * @returns {*} ol cluster layer
 */
export function createIndicatorFeatureLayers(indicators, vm) {
  const features = indicators.filter((i) => i.latlng).map((i) => {
    const feature = new Feature({
      properties: i.properties,
      geometry: new Point(fromLonLat([i.latlng.lng, i.latlng.lat])),
    });
    feature.setId(i.id);
    return feature;
  });

  const indicatorSource = new VectorSource({
    features,
  });

  const clusterSource = new Cluster({
    distance: 35,
    source: indicatorSource,
  });

  // Layer displaying the clusters and individual features.
  const clusters = new VectorLayer({
    name: 'clusters',
    source: clusterSource,
    style: createClusterStyle(vm),
  });
  onStylesLoaded.push(() => {
    clusters.changed();
  });

  const themeColor = vm.$vuetify.theme.themes.light.primary;
  const fillColor = [...asArray(themeColor)];
  fillColor[3] = 0.3;
  convexHullFill.setColor(fillColor);
  convexHullStroke.setColor(themeColor);

  // Layer displaying the convex hull of the hovered cluster.
  const clusterHulls = new VectorLayer({
    name: 'clusterHulls',
    source: clusterSource,
    style: clusterHullStyle,
  });

  // Layer displaying the expanded view of overlapping cluster members.
  const clusterCircles = new VectorLayer({
    name: 'clusterCircles',
    source: clusterSource,
    style: clusterCircleStyle.bind(vm),
  });
  return [clusterHulls, clusters, clusterCircles];
}

/**
 *
 * @param {Object} map ol map
 * @param {Object} vm vue instance
 */
// eslint-disable-next-line import/prefer-default-export
export function initInteractions(map, vm) {
  const clusters = map.getLayers().getArray().find((l) => l.get('name') === 'clusters');
  const clusterHulls = map.getLayers().getArray().find((l) => l.get('name') === 'clusterHulls');
  const clusterCircles = map.getLayers().getArray().find((l) => l.get('name') === 'clusterCircles');
  pointermoveInteraction = (event) => {
    clusters.getFeatures(event.pixel).then((features) => {
      if (features[0] !== hoverFeature) {
        // Display the convex hull on hover.
        // eslint-disable-next-line prefer-destructuring
        hoverFeature = features[0];
        clusterHulls.setStyle(clusterHullStyle);
        // Change the cursor style to indicate that the cluster is clickable.
        // eslint-disable-next-line no-param-reassign
        map.getTargetElement().style.cursor = hoverFeature && hoverFeature.get('features').length > 1
          ? 'pointer'
          : '';
      }
    });
  };
  map.on('pointermove', pointermoveInteraction);

  clickInteraction = (event) => {
    clusters.getFeatures(event.pixel).then((features) => {
      if (features.length > 0) {
        const clusterMembers = features[0].get('features');
        if (clusterMembers.length > 1) {
          // Calculate the extent of the cluster members.
          const extent = createEmpty();
          clusterMembers.forEach((feature) => extend(extent, feature.getGeometry().getExtent()));
          const view = map.getView();
          const resolution = map.getView().getResolution();
          if (
            view.getZoom() === view.getMaxZoom()
            || (getWidth(extent) < resolution && getWidth(extent) < resolution)
          ) {
            // Show an expanded view of the cluster members.
            // eslint-disable-next-line prefer-destructuring
            clickFeature = features[0];
            clickResolution = resolution;
            clusterCircles.setStyle(clusterCircleStyle.bind(vm));
          } else {
            // Zoom to the extent of the cluster members.
            view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
          }
        }
      }
    });
  };

  map.on('click', clickInteraction);
}

/**
 * cleanup of cluster interactions (hover + click)
 * @param {*} map ol map
 */
export function cleanupClusterInteraction(map) {
  map.un('pointermove', pointermoveInteraction);
  map.un('click', clickInteraction);
  pointermoveInteraction = null;
  clickInteraction = null;
}
