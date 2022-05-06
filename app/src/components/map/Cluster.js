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
import { Feature, Overlay } from 'ol';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { getColor } from './olMapColors';
import getMapInstance from './map';


const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});

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
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.globalCompositeOperation = 'screen';
        context.fillStyle = 'white';
        context.fillRect(0, 0, image.width, image.height);
        context.globalCompositeOperation = 'destination-in';
        context.drawImage(image, 0, 0);
        acc[key] = {
          small: new Icon({
            scale: 0.66,
            img: canvas,
            imgSize: [image.width, image.height],
          }),
          large: new Icon({
            scale: 1,
            img: canvas,
            imgSize: [image.width, image.height],
          }),
        };
        if (onStylesLoaded && Object.keys(acc).length === Object.keys(indicatorClassesIcons)
          .length) {
          onStylesLoaded.forEach((cb) => cb());
          onStylesLoaded = undefined;
        }
      });
      image.src = `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${indicatorClassesIcons[key].substr(4)}.svg`;
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
      [this.clusters, this.clusterHulls, this.clusterCircles].forEach((l) => {
        this.map.addLayer(l);
      });
      this.map.on('pointermove', this.pointermoveInteraction.bind(this, overlayCallback));
      this.map.on('click', this.clickInteraction);
      const overlay = new Overlay({
        element: document.getElementById(`${this.map.get('id')}Overlay`),
        id: 'clusterOverlay',
        offset: [0, -22],
        positioning: 'bottom-center',
      });
      this.map.addOverlay(overlay);
    } else {
      [this.clusters, this.clusterHulls, this.clusterCircles].forEach((l) => {
        this.map.removeLayer(l);
      });
      this.map.un('pointermove', this.pointermoveInteraction);
      this.map.un('click', this.clickInteraction);
      this.map.getOverlayById('clusterOverlay').setMap(null);
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

  /**
 * opens the indicator panel for a given indicator feature
 * @param {*} feature ol feature
 */
  openIndicator(feature) {
    const { indicatorObject } = feature.getProperties().properties;
    if (!indicatorObject.dummyFeature) {
      store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
      const query = { ...this.vm.$route.query };
      delete query.sensor;
      this.vm.$router.replace({ query }).catch(() => {});
    }
  }

  createInteractions() {
    this.pointermoveInteraction = async (callback, event) => {
      const openClusterFeatures = await this.clusterCircles.getFeatures(event.pixel);
      const clusterFeatures = await this.clusters.getFeatures(event.pixel);
      if (clusterFeatures[0] !== this.hoverFeature) {
        // Display the convex hull on hover.
        // eslint-disable-next-line prefer-destructuring
        this.hoverFeature = clusterFeatures[0];
        this.clusterHulls.setStyle(this.clusterHullStyle.bind(this));
      }
      // Change the cursor style to indicate that the cluster is clickable.
      // eslint-disable-next-line no-param-reassign
      this.map.getTargetElement().style.cursor = this.hoverFeature || openClusterFeatures.length
        ? 'pointer'
        : '';
      // show or hide popup
      const overlay = this.map.getOverlayById('clusterOverlay');
      if (openClusterFeatures.length || (this.hoverFeature && this.hoverFeature.get('features').length === 1)) {
        let coords;
        let hoverFeature;
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
        overlay.setMap(this.map);
        overlay.setPosition(coords);
        const { indicatorObject } = hoverFeature.getProperties().properties;
        callback(indicatorObject);
        overlay.getElement().style.display = 'block';
      } else {
        overlay.setMap(null);
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
              this.expanded = true;
              this.reRender();
              this.map.getView().once('change:resolution', () => {
                this.expanded = false;
              });
            } else {
              // Zoom to the extent of the cluster members.
              view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
            }
          } else {
            this.openIndicator(features[0].getProperties().features[0]);
          }
        }
      }
      this.reRender();
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
      const selectedIndicatorFeature = clusterMembers.find(isFeatureSelected);
      if (hasClickedFeature && this.expanded) {
        // "expanded" style, will collapse after resolution change
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
      const styles = [
        new Style({
          image: selectedIndicatorFeature ? outerCircleSelected : outerCircle,
        }),
        new Style({
          image: innerCircle,
          text: new Text({
            text: clusterMembers.length.toString(),
            fill: textFill,
            font: '12px sans-serif',
          }),
        }),
      ];
      // display subaoi of selected indicator, also when cluster is collapsed
      if (selectedIndicatorFeature) {
        const selectedIndicatorObject = selectedIndicatorFeature.get('properties').indicatorObject;
        if (selectedIndicatorObject.subAoi) {
          styles.push(this.getStyleForSubaoi(selectedIndicatorObject, selectedIndicatorFeature));
        }
      }
      return styles;
    }
    const originalFeature = feature.get('features')[0];
    return this.clusterMemberStyle(originalFeature, this.vm);
  }

  /**
   * set the cluster features.
   * @param {Array} indicatorFeatures indicator feature definition objects
   */
  setFeatures(indicatorFeatures) {
    const features = indicatorFeatures.filter((i) => i.latlng).map((i) => {
      const feature = new Feature({
        properties: i.properties,
        geometry: new Point(fromLonLat([i.latlng.lng, i.latlng.lat])),
      });
      feature.setId(i.id);
      return feature;
    });
    const clusterSource = this.clusters.getSource().getSource();
    clusterSource.clear();
    clusterSource.addFeatures(features);
    if (features.length) {
      this.map.once('postrender', () => {
        this.map.getView().fit(clusterSource.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 8,
          duration: 200,
        });
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

    const themeColor = this.vm.$vuetify.theme.themes.light.primary;
    const fillColor = [...asArray(themeColor)];
    fillColor[3] = 0.3;
    convexHullFill.setColor(fillColor);
    convexHullStroke.setColor(themeColor);

    // Layer displaying the convex hull of the hovered cluster.
    this.clusterHulls = new VectorLayer({
      name: 'clusterHulls',
      zIndex: 9,
      source: clusterSource,
      style: this.clusterHullStyle.bind(this),
    });

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
 * Single feature style, for clusters with 1 feature and cluster circles.
 * @param {Feature} clusterMember A feature from a cluster.
 * @return {Style} An icon style for the cluster member's location.
 */
  clusterMemberStyle(clusterMember) {
    const { indicatorObject } = clusterMember.getProperties().properties;
    const indicatorCode = indicatorObject.indicator;
    const indicator = store.getters['features/getIndicators'].find((i) => i.code === indicatorCode);
    const isSelected = isFeatureSelected(clusterMember);
    const circleStyle = new Style({
      image: new CircleStyle({
        radius: isSelected ? 16 : 12,
        fill: new Fill({
          color: getColor(indicatorObject, this.vm),
        }),
        stroke: isSelected ? selectedStroke : new Stroke({
          color: 'white',
          width: 2,
        }),
      }),
      geometry: clusterMember.getGeometry(),
    });
    const image = indicatorClassesStyles[indicator.class][isSelected ? 'large' : 'small'];
    const iconStyle = new Style({
      image,
      geometry: clusterMember.getGeometry(),
    });
    const memberStyle = [circleStyle, iconStyle];
    if (isSelected && indicatorObject.subAoi) {
      memberStyle.push(this.getStyleForSubaoi(indicatorObject, clusterMember));
    }
    return memberStyle;
  }

  /**
   * @param {*} indicatorObject indicator object containing the subaoi
   * @param {*} subAoiGeom ol geometry of subAoi
   * @returns {*} SubAOI Style
   */
  getStyleForSubaoi(indicatorObject, indicatorFeature) {
    // pre-calculate geometry once to avoid unnecessary computation in style function
    if (!indicatorFeature.get('olSubAoiGeom')) {
      indicatorFeature.set('olSubAoiGeom', geoJsonFormat
        .readGeometry(indicatorObject.subAoi.features[0].geometry));
    }
    const subAoiColor = [...asArray(getColor(indicatorObject, this.vm)
        || this.vm.appConfig.branding.primaryColor)];
      // set opacity of rgba color
    subAoiColor[3] = 0.5;
    return new Style({
      fill: new Fill({
        color: subAoiColor,
      }),
      stroke: new Stroke({
        color: 'white',
        width: 1,
      }),
      geometry: indicatorFeature.get('olSubAoiGeom'),
    });
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
