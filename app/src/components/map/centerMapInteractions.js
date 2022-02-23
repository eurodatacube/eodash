import { createEmpty, extend, getWidth } from 'ol/extent';
// eslint-disable-next-line import/no-cycle
import { clusterHullStyle, generatePointsCircle } from './olMapHelpers';


let hoverFeature;
let clickInteraction;
let pointermoveInteraction;
// any member of a clicked cluster.
// cannot use cluster feature itself, because it changes after `changed`
let clickedClusterMember;
let clickResolution;

export function getHoverFeature() {
  return hoverFeature;
}
export function getClickedClusterMember() {
  return clickedClusterMember;
}
export function getClickResolution() {
  return clickResolution;
}

/**
 * opens the indicator panel for a given indicator feature
 * @param {*} feature ol feature
 * @param {*} vm vue instance
 */
function openIndicator(feature, vm) {
  const { indicatorObject } = feature.getProperties().properties;
  if (!indicatorObject.dummyFeature) {
    vm.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
    const query = { ...vm.$route.query };
    delete query.sensor;
    vm.$router.replace({ query }).catch(() => {});
  }
}

/**
 *
 * @param {Object} map ol map
 * @param {Object} vm vue instance
 */
// eslint-disable-next-line import/prefer-default-export
export function initCenterMapInteractions(map, vm) {
  const clusters = map.getLayers().getArray().find((l) => l.get('name') === 'clusters');
  const clusterHulls = map.getLayers().getArray().find((l) => l.get('name') === 'clusterHulls');
  const clusterCircles = map.getLayers().getArray().find((l) => l.get('name') === 'clusterCircles');
  pointermoveInteraction = async (event) => {
    const singleCircleFeatures = await clusterCircles.getFeatures(event.pixel);
    const clusterFeatures = await clusters.getFeatures(event.pixel);
    if (clusterFeatures[0] !== hoverFeature) {
      // Display the convex hull on hover.
      // eslint-disable-next-line prefer-destructuring
      hoverFeature = clusterFeatures[0];
      clusterHulls.setStyle(clusterHullStyle);
      // Change the cursor style to indicate that the cluster is clickable.
    }
    // eslint-disable-next-line no-param-reassign
    map.getTargetElement().style.cursor = hoverFeature || singleCircleFeatures.length
      ? 'pointer'
      : '';
  };
  map.on('pointermove', pointermoveInteraction);

  clickInteraction = async (event) => {
    // features of expanded clusters
    const openClusterFeatures = await clusterCircles.getFeatures(event.pixel);
    if (openClusterFeatures.length) {
      const feature = openClusterFeatures[0];
      const members = feature.get('features');
      const coords = generatePointsCircle(members.length, feature.getGeometry().getCoordinates(),
        map.getView().getResolution());
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
      openIndicator(members[index], vm);
    } else {
      const features = await clusters.getFeatures(event.pixel);
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
            clickedClusterMember = clusterMembers[0];
            clickResolution = resolution;
            clusterCircles.changed();
            clusters.changed();
            map.getView().once('change:resolution', () => {
              clickedClusterMember = undefined;
            });
          } else {
            // Zoom to the extent of the cluster members.
            view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
          }
        } else {
          openIndicator(features[0].getProperties().features[0], vm);
        }
      } else {
        clickedClusterMember = undefined;
        clusters.changed();
        clusterCircles.changed();
      }
    }
  };

  map.on('click', clickInteraction);
}
