import { createEmpty, extend, getWidth } from 'ol/extent';
import { LineString, Point, Polygon } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import monotoneChainConvexHull from 'monotone-chain-convex-hull';
import store from '@/store';
import {
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import ClusterSource from 'ol/source/Cluster';
import VectorSource from 'ol/source/Vector';
import { asArray } from 'ol/color';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { getColor } from './olMapColors';
import { indicatorClassesIcons } from '../../config/trilateral';

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
const innerCircleSelected = new CircleStyle({
  radius: 14,
  fill: new Fill({
    color: 'rgba(40, 40, 40, 0.2)',
  }),
});
const outerCircleSelected = new CircleStyle({
  radius: 18,
  fill: new Fill({
    color: 'rgba(58, 104, 142, 0.2)',
  }),
});
const textStyle = new Text({
  text: '',
  fill: new Fill({
    color: 'white',
  }),
  font: '18px "Material Design Icons"',
});
let onStylesLoaded = [];

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
      onStylesLoaded = undefined;
    }
  });
  image.src = `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${indicatorClassesIcons[key].substr(4)}.svg`;
  return acc;
}, {});

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
  const clusterMembers = cluster.get('features');
  if (!clusterMembers.includes(this.clickedClusterMember)) {
    return;
  }
  const centerCoordinates = cluster.getGeometry().getCoordinates();
  // eslint-disable-next-line consistent-return
  return generatePointsCircle(
    clusterMembers.length,
    cluster.getGeometry().getCoordinates(),
    resolution,
  ).reduce((styles, coordinates, i) => {
    const point = new Point(coordinates);
    const line = new LineString([centerCoordinates, coordinates]);
    const offsetStyle = this.clusterMemberStyle(
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


export default class Cluster {
  /**
   * cluster component, will create layers and interaction and add
   * them to the given map
   * @param {*} map ol map
   * @param {*} vm Vue Instance
   * @param {Array} indicators array of indicators
   */
  constructor(map, vm, indicators) {
    this.map = map;
    this.vm = vm;
    this.indicators = indicators;
    this.createIndicatorFeatureLayers();
    this.createInteractions();
  }

  /**
   * adding layer and interactions if active=true, otherwise removing them from the map
   * @param {boolean} active
   */
  setActive(active) {
    if (active) {
      [this.clusters, this.clusterHulls, this.clusterCircles].forEach((l) => {
        this.map.addLayer(l);
      });
      this.map.on('pointermove', this.pointermoveInteraction);
      this.map.on('click', this.clickInteraction);
    } else {
      [this.clusters, this.clusterHulls, this.clusterCircles].forEach((l) => {
        this.map.removeLayer(l);
      });
      this.map.un('pointermove', this.pointermoveInteraction);
      this.map.un('click', this.clickInteraction);
    }
  }

  /**
 * opens the indicator panel for a given indicator feature
 * @param {*} feature ol feature
 * @param {*} vm vue instance
 */
  openIndicator(feature) {
    const { indicatorObject } = feature.getProperties().properties;
    if (!indicatorObject.dummyFeature) {
      this.vm.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
      const query = { ...this.vm.$route.query };
      delete query.sensor;
      this.vm.$router.replace({ query }).catch(() => {});
    }
  }

  createInteractions() {
    this.pointermoveInteraction = async (event) => {
      const singleCircleFeatures = await this.clusterCircles.getFeatures(event.pixel);
      const clusterFeatures = await this.clusters.getFeatures(event.pixel);
      if (clusterFeatures[0] !== this.hoverFeature) {
        // Display the convex hull on hover.
        // eslint-disable-next-line prefer-destructuring
        this.hoverFeature = clusterFeatures[0];
        this.clusterHulls.setStyle(this.clusterHullStyle.bind(this));
        // Change the cursor style to indicate that the cluster is clickable.
      }
      // eslint-disable-next-line no-param-reassign
      this.map.getTargetElement().style.cursor = this.hoverFeature || singleCircleFeatures.length
        ? 'pointer'
        : '';
    };
    this.clickInteraction = async (event) => {
      // features of expanded clusters
      const openClusterFeatures = await this.clusterCircles.getFeatures(event.pixel);
      if (openClusterFeatures.length) {
        const feature = openClusterFeatures[0];
        const members = feature.get('features');
        const coords = generatePointsCircle(members.length, feature.getGeometry().getCoordinates(),
          this.map.getView().getResolution());
        let dist = Infinity;
        let index;
        for (let i = 0, ii = coords.length; i < ii; ++i) {
          const newDist = (event.coordinate[0] - coords[i][0]) ** 2
            + (event.coordinate[1] - coords[i][1]) ** 2;
          if (newDist < dist) {
            index = i;
            dist = newDist;
          }
        }
        this.openIndicator(members[index]);
      } else {
        const features = await this.clusters.getFeatures(event.pixel);
        if (features.length > 0) {
          const clusterMembers = features[0].get('features');
          if (clusterMembers.length > 1) {
            // Calculate the extent of the cluster members.
            const extent = createEmpty();
            clusterMembers.forEach((feature) => extend(extent, feature.getGeometry().getExtent()));
            const view = this.map.getView();
            const resolution = this.map.getView().getResolution();
            if (
              view.getZoom() === view.getMaxZoom()
                || (getWidth(extent) < resolution && getWidth(extent) < resolution)
            ) {
              // Show an expanded view of the cluster members.
              // eslint-disable-next-line prefer-destructuring
              this.clickedClusterMember = clusterMembers[0];
              this.clickResolution = resolution;
              this.clusterCircles.changed();
              this.clusters.changed();
              this.map.getView().once('change:resolution', () => {
                this.clickedClusterMember = undefined;
              });
            } else {
              // Zoom to the extent of the cluster members.
              view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
            }
          } else {
            this.openIndicator(features[0].getProperties().features[0]);
          }
        } else {
          this.clickedClusterMember = undefined;
          this.clusters.changed();
          this.clusterCircles.changed();
        }
      }
    };
  }

  /**
 * Style for convex hulls of clusters, activated on hover.
 * @param {Feature} cluster The cluster feature.
 * @return {Style} Polygon style for the convex hull of the cluster.
 */
  clusterHullStyle(cluster) {
    if (cluster !== this.hoverFeature) {
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

  clusterStyle(feature) {
    const clusterMembers = feature.get('features');
    if (clusterMembers.length > 1) {
      const hasClickedFeature = clusterMembers.includes(this.clickedClusterMember);
      return [
        new Style({
          image: hasClickedFeature ? outerCircleSelected : outerCircle,
        }),
        new Style({
          image: hasClickedFeature ? innerCircleSelected : innerCircle,
          text: new Text({
            text: clusterMembers.length.toString(),
            fill: textFill,
            font: '12px sans-serif',
          }),
        }),
      ];
    }
    const originalFeature = feature.get('features')[0];
    return this.clusterMemberStyle(originalFeature, this.vm);
  }

  /**
   * creates an OL Layer out of the existing grouped feature object
   * @returns {*} ol cluster layer
   */
  createIndicatorFeatureLayers() {
    const features = this.indicators.filter((i) => i.latlng).map((i) => {
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

    const clusterSource = new ClusterSource({
      distance: 35,
      source: indicatorSource,
    });

    // Layer displaying the clusters and individual features.
    this.clusters = new VectorLayer({
      name: 'clusters',
      source: clusterSource,
      // style: this.createClusterStyle(),
      style: this.clusterStyle.bind(this),
    });
    if (onStylesLoaded) {
      onStylesLoaded.push(() => {
        clusters.changed();
      });
    }

    const themeColor = this.vm.$vuetify.theme.themes.light.primary;
    const fillColor = [...asArray(themeColor)];
    fillColor[3] = 0.3;
    convexHullFill.setColor(fillColor);
    convexHullStroke.setColor(themeColor);

    // Layer displaying the convex hull of the hovered cluster.
    this.clusterHulls = new VectorLayer({
      name: 'clusterHulls',
      source: clusterSource,
      style: this.clusterHullStyle.bind(this),
    });

    // Layer displaying the expanded view of overlapping cluster members.
    this.clusterCircles = new VectorLayer({
      name: 'clusterCircles',
      source: clusterSource,
      style: clusterCircleStyle.bind(this),
    });
  }

  /**
 * Single feature style, for clusters with 1 feature and cluster circles.
 * @param {Feature} clusterMember A feature from a cluster.
 * @return {Style} An icon style for the cluster member's location.
 */
  clusterMemberStyle(clusterMember) {
    const { indicatorObject } = clusterMember.getProperties().properties;
    const indicatorCode = indicatorObject.indicator;
    const indicator = store.getters['features/getIndicators'].find((i) => i.code === indicatorCode);
    const circleStyle = new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({
          color: getColor(indicatorObject, this.vm),
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
}
