import { createEmpty, extend, getWidth } from 'ol/extent';
import { LineString, Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
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
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { calculatePadding } from '@/utils';
import { getMapInstance } from './map';

const circleDistanceMultiplier = 1;
const circleFootSeparation = 28;
const circleStartAngle = Math.PI / 2;
const convexHullStroke = new Stroke({
  width: 0.5,
  lineDash: [4, 4],
});
const outerCircleFill = new Fill({
  color: '#ffffff77',
});
// TODO: this should be configurable per brand
const innerCircleFill = new Fill({
  color: '#00ae92',
});
const textFill = new Fill({
  color: '#fff',
});
const innerCircle = new CircleStyle({
  radius: 14,
  fill: innerCircleFill,
});
const selectedStroke = new Stroke({
  color: '#282828',
  width: 1.5,
  lineDash: [6, 4],
});
const outerCircle = new CircleStyle({
  radius: 18,
  fill: outerCircleFill,
});
const outerCircleSelected = new CircleStyle({
  radius: 18,
  fill: outerCircleFill,
  stroke: selectedStroke,
});

const innerCircleTransparent = new CircleStyle({
  radius: 14,
  fill: new Fill({
    color: 'rgba(40, 40, 40, 0.2)',
  }),
});
const outerCircleTransparent = new CircleStyle({
  radius: 18,
  fill: new Fill({
    color: 'rgba(58, 104, 142, 0.2)',
  }),
});

let onStylesLoaded = [];
let indicatorClassesStyles;

function loadImages() {
  const { indicatorClassesIcons } = store.state.config.baseConfig;
  indicatorClassesStyles = Object.keys(indicatorClassesIcons)
    .reduce((acc, key) => {
      const image = new Image();
      acc[key] = {
        small: null,
        large: null,
      };
      image.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const context = canvas.getContext('2d');
        const halfWidth = canvas.width / 2;
        canvas.style.imageRendering = 'pixelated';
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;

        // svg-icon, clipped in white rectangle
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'destination-in';
        context.drawImage(image, halfWidth - image.width / 2,
          halfWidth - image.height / 2, image.width, image.height);

        // circles
        context.globalCompositeOperation = 'destination-over';
        context.beginPath();
        context.arc(halfWidth, halfWidth, 20, 0, 2 * Math.PI, false);
        const color = store.state.themes.themes.find((th) => th.slug === key)?.color;
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 6;
        context.strokeStyle = 'white';
        context.stroke();

        acc[key] = {
          small: new Icon({
            scale: 0.6,
            img: canvas,
            imgSize: [50, 50],
          }),
          large: new Icon({
            scale: 0.8,
            img: canvas,
            imgSize: [50, 250],
          }),
        };
        if (onStylesLoaded && Object.keys(acc).every((accKey) => acc[accKey].small)) {
          onStylesLoaded.forEach((cb) => cb());
          onStylesLoaded = undefined;
        }
      });
      image.src = `https://cdn.jsdelivr.net/npm/@mdi/svg@6.1.95/svg/${indicatorClassesIcons[key].substr(4)}.svg`;
      return acc;
    }, {});
}

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
 * get the cluster member of an (open) cluster feature by calculating the points circle
 * @param {*} map ol map
 * @param {*} openClusterFeature cluster feature
 * @param {Array} coordinate coordinate
 * @returns {*} Object with feature and calculated coords
 */
function getClusterMemberForCoordinate(map, openClusterFeature, coordinate) {
  const members = openClusterFeature.get('features');
  const coords = generatePointsCircle(members.length,
    openClusterFeature.getGeometry().getCoordinates(),
    map.getView().getResolution());
  let dist = Infinity;
  let index;
  for (let i = 0, ii = coords.length; i < ii; ++i) {
    const newDist = (coordinate[0] - coords[i][0]) ** 2
      + (coordinate[1] - coords[i][1]) ** 2;
    if (newDist < dist) {
      index = i;
      dist = newDist;
    }
  }
  return { feature: members[index], coords: coords[index] };
}

/**
 * returns true if given ol indicator feature is currently selected
 * @param {*} feature ol indicator feature
 * @returns {boolean}
 */
function isFeatureSelected(feature) {
  const { indicatorObject } = feature.getProperties().properties;
  const { selectedIndicator } = store.state.indicators;
  return selectedIndicator && selectedIndicator.indicator === indicatorObject.indicator
  && selectedIndicator.aoiID === indicatorObject.aoiID;
}

/**
 * Single feature style, for clusters with 1 feature and cluster circles.
 * @param {Feature} clusterMember A feature from a cluster.
 * @return {Style} An icon style for the cluster member's location.
 */
function clusterMemberStyle(clusterMember) {
  const { indicatorObject } = clusterMember.getProperties().properties;
  const indicatorCode = indicatorObject.indicator;
  const indicator = store.getters['features/getIndicators'].find((i) => i.code === indicatorCode);
  const isSelected = isFeatureSelected(clusterMember);
  const image = indicatorClassesStyles[indicator.themes[0]]?.[isSelected ? 'large' : 'small'];
  const iconStyle = new Style({
    image,
    geometry: clusterMember.getGeometry(),
  });
  return [iconStyle];
}

/**
 * Style for clusters with features that are too close to each other, activated on click.
 * @param {Feature} cluster A cluster with overlapping members.
 * @param {number} resolution The current view resolution.
 * @return {Style} A style to render an expanded view of the cluster members.
 */
function clusterCircleStyle(cluster, resolution) {
  const clusterMembers = cluster.get('features');
  if (!clusterMembers.includes(this.clickedClusterMember) || !this.expanded) {
    return;
  }
  // collapse after next re-render (resolution change)
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

class Cluster {
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
    if (onStylesLoaded) {
      loadImages();
    }
    this.createIndicatorFeatureLayers();
    this.createInteractions();
  }

  /**
   * adding layer and interactions if active=true, otherwise removing them from the map
   * @param {boolean} active
   * @param {Function} overlayCallback callback function for populating overlay
   */
  setActive(active, overlayCallback) {
    if (active) {
      [this.clusters, this.clusterCircles].forEach((l) => {
        this.map.addLayer(l);
      });
      this.map.on('pointermove', this.pointermoveInteraction.bind(this, overlayCallback));
      this.map.on('click', this.clickInteraction);
    } else {
      [this.clusters, this.clusterCircles].forEach((l) => {
        this.map.removeLayer(l);
      });
      this.map.un('pointermove', this.pointermoveInteraction);
      this.map.un('click', this.clickInteraction);
    }
  }

  /**
   * forces a re-render of the cluster layers.
   * some actions can change the styles, without forcing a re-render themselves,
   * like a change of the selected indicator.
   */
  reRender() {
    this.clusters.changed();
    this.clusterCircles.changed();
  }

  createInteractions() {
    this.pointermoveInteraction = async (callback, event) => {
      const openClusterFeatures = await this.clusterCircles.getFeatures(event.pixel);
      const clusterFeatures = await this.clusters.getFeatures(event.pixel);
      if (clusterFeatures[0] !== this.hoverFeature) {
        // Display the convex hull on hover.
        // eslint-disable-next-line prefer-destructuring
        this.hoverFeature = clusterFeatures[0];
      }
      // Change the cursor style to indicate that the cluster is clickable.
      // eslint-disable-next-line no-param-reassign
      this.map.getTargetElement().style.cursor = this.hoverFeature || openClusterFeatures.length
        ? 'pointer'
        : '';
      if (openClusterFeatures.length || (this.hoverFeature && this.hoverFeature.get('features').length === 1)) {
        let coords;
        let hoverFeature;
        const headers = [];
        const rows = [];
        if (openClusterFeatures.length) {
          const clusterObject = getClusterMemberForCoordinate(this.map,
            openClusterFeatures[0],
            event.coordinate);
          coords = clusterObject.coords;
          hoverFeature = clusterObject.feature;
        } else {
          [hoverFeature] = this.hoverFeature.get('features');
          coords = hoverFeature.getGeometry().getCoordinates();
        }
        const { indicatorObject } = hoverFeature.getProperties().properties;
        const { city } = indicatorObject;
        const indicator = store.state.config.baseConfig
          .indicatorsDefinition[indicatorObject.indicator]
          .indicatorOverwrite || indicatorObject.indicatorName || indicatorObject.description;
        if (city) {
          headers.push(`${city}:`);
        }
        if (indicator) {
          headers.push(indicator);
        }
        callback(headers, rows, coords);
      } else {
        callback([], [], null);
      }
    };
    this.clickInteraction = async (event) => {
      this.clickedClusterMember = undefined;
      // features of expanded clusters
      const openClusterFeatures = await this.clusterCircles.getFeatures(event.pixel);
      if (openClusterFeatures.length) {
        const clickedClusterMember = getClusterMemberForCoordinate(this.map,
          openClusterFeatures[0],
          event.coordinate).feature;
        this.openIndicator(clickedClusterMember);
        this.clickedClusterMember = clickedClusterMember;
      } else if (this.clusters.getVisible()) {
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
              this.expanded = true;
              this.reRender();
              this.map.getView().once('change:resolution', () => {
                this.expanded = false;
              });
            } else {
              const urlSearchParams = new URLSearchParams(window.location.search);
              const params = Object.fromEntries(urlSearchParams.entries());
              params.clusterOpen = params.clusterOpen ? parseInt(params.clusterOpen, 10) + 1 : 1;
              const router = this.vm.$router;
              router.push({ query: params });
              // Zoom to the extent of the cluster members.
              const padding = calculatePadding();
              view.fit(extent, { duration: 500, padding });
            }
          } else {
            this.openIndicator(features[0].getProperties().features[0]);
          }
        }
      }
      this.reRender();
    };
  }

  clusterStyle(feature) {
    const clusterMembers = feature.get('features');
    if (clusterMembers.length > 1) {
      const hasClickedFeature = clusterMembers.includes(this.clickedClusterMember);
      const selectedIndicatorFeature = clusterMembers.find(isFeatureSelected);
      if (hasClickedFeature && this.expanded) {
        return [
          new Style({
            image: outerCircleTransparent,
          }),
          new Style({
            image: innerCircleTransparent,
            text: new Text({
              text: clusterMembers.length.toString(),
              fill: textFill,
              font: '12px sans-serif',
            }),
          }),
        ];
      }
      // "expanded" style, will collapse after resolution change
      const amount = clusterMembers.length;
      // minimum size for a cluster of
      // maximum size is reached at 50
      const minSize = 18;
      const maxSize = 40;
      if (amount <= 5) {
        innerCircle.setRadius(minSize);
        outerCircle.setRadius(minSize + 4);
      } else if (amount <= 50) {
        const addition = ((amount - 5) / maxSize) * (maxSize - minSize);
        // aus 0 soll 0 werden
        // aus 45 soll 30 werden
        innerCircle.setRadius(minSize + addition);
        outerCircle.setRadius(minSize + addition + 4);
      } else {
        innerCircle.setRadius(maxSize);
        outerCircle.setRadius(maxSize + 4);
      }
      const styles = [
        new Style({
          image: selectedIndicatorFeature ? outerCircleSelected : outerCircle,
        }),
        new Style({
          image: innerCircle,
          text: new Text({
            text: clusterMembers.length.toString(),
            fill: textFill,
            font: 'bold 12px Roboto, sans-serif',
          }),
        }),
      ];
      return styles;
    }
    const originalFeature = feature.get('features')[0];
    return clusterMemberStyle(originalFeature);
  }

  /**
   * set the cluster features.
   * @param {Array} indicatorFeatures indicator feature definition objects
   */
  setFeatures(indicatorFeatures) {
    if (!indicatorFeatures.length > 0) {
      return;
    }
    const features = indicatorFeatures.filter((i) => i.properties.indicatorObject.aoi).map((i) => {
      const feature = new Feature({
        properties: i.properties,
        geometry: new Point(fromLonLat(
          [i.properties.indicatorObject.aoi.lon, i.properties.indicatorObject.aoi.lat],
        )),
      });
      feature.setId(i.id);
      return feature;
    });
    const clusterSource = this.clusters.getSource().getSource();
    clusterSource.clear();
    clusterSource.addFeatures(features);
    const router = this.vm.$router;
    const { query } = router.currentRoute;
    // if search box is empty, don't reset view to all features
    if (features.length && query.search) {
      setTimeout(() => {
        const { selectedIndicator } = store.state.indicators;
        if (!selectedIndicator) {
          const padding = calculatePadding();
          this.map.getView().fit(clusterSource.getExtent(), {
            maxZoom: 8,
            duration: 200,
            padding,
          }, 0);
        }
      });
    }
  }

  /**
   * creates an OL Layer out of the existing grouped feature object
   * @returns {*} ol cluster layer
   */
  createIndicatorFeatureLayers() {
    const indicatorSource = new VectorSource({});

    const clusterSource = new ClusterSource({
      distance: 45,
      source: indicatorSource,
    });

    // Layer displaying the clusters and individual features.
    this.clusters = new VectorLayer({
      name: 'clusters',
      zIndex: 10,
      source: clusterSource,
      style: this.clusterStyle.bind(this),
    });
    if (onStylesLoaded) {
      onStylesLoaded.push(() => {
        this.clusters.changed();
      });
    }

    // Layer displaying the expanded view of overlapping cluster members.
    this.clusterCircles = new VectorLayer({
      name: 'clusterCircles',
      zIndex: 11,
      source: clusterSource,
      style: clusterCircleStyle.bind(this),
    });
    if (onStylesLoaded) {
      onStylesLoaded.push(() => {
        this.clusterCircles.changed();
      });
    }
  }

  /**
 * opens the indicator panel for a given indicator feature
 * @param {*} feature ol feature
 */
  openIndicator(feature) {
  // if no indicator was selected, set a history entry before opening the indicator
  // this way the user can go back via the back-button
    const router = this.vm.$router;
    const { query } = router.currentRoute;

    if (!query.poi) {
      // to be discussed: set history entry here?
    }

    const { indicatorObject } = feature.getProperties().properties;
    if (!indicatorObject.dummyFeature) {
      store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
    }
  }
}

/**
 * similar to the map, all instances of the cluster class
 * are stored here.
 */
const clusterRegistry = {};

/**
  * Returns the cluster with the given id.
  * Will instantiate a new cluster if not already existing.
  * @param {string} id id of cluster
  * @param {Object} options options
  * @param {Array} options.mapId optional constraining extent
  * @param {Array} options.vm vue instance
  * @returns {Map} ol map
  */
export default function getCluster(id, options = {}) {
  const cluster = clusterRegistry[id];
  if (!cluster) {
    const { map } = getMapInstance(options.mapId);
    clusterRegistry[id] = new Cluster(map, options.vm);
  }
  return clusterRegistry[id];
}
