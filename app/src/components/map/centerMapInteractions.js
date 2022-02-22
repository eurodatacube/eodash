import { createEmpty, extend, getWidth } from 'ol/extent';
import { clusterHullStyle } from './olMapHelpers';


let hoverFeature;
let clickInteraction;
let pointermoveInteraction;

export function getHoverFeature() {
  return hoverFeature;
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
  pointermoveInteraction = (event) => {
    clusters.getFeatures(event.pixel).then((features) => {
      if (features[0] !== hoverFeature) {
        // Display the convex hull on hover.
        // eslint-disable-next-line prefer-destructuring
        hoverFeature = features[0];
        clusterHulls.setStyle(clusterHullStyle);
        // Change the cursor style to indicate that the cluster is clickable.
        // eslint-disable-next-line no-param-reassign
        map.getTargetElement().style.cursor = hoverFeature
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
        } else {
          const { indicatorObject } = features[0].getProperties().features[0].getProperties().properties;
          if (!indicatorObject.dummyFeature) {
            vm.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
            const query = { ...this.$route.query };
            delete query.sensor;
            vm.$router.replace({ query }).catch(() => {});
          }
        }
      }
    });
  };

  map.on('click', clickInteraction);
}
