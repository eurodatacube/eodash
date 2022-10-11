<template>
  <MapOverlay
   :mapId="mapId"
   :overlayId="layerName"
   :overlayHeaders="overlayHeaders"
   :overlayRows="overlayRows"
   :overlayCoordinate="overlayCoordinate"
  />
</template>

<script>
import getMapInstance from '@/components/map/map';
import MapOverlay from '@/components/map/MapOverlay.vue';
import { createLayerFromConfig } from '@/components/map/layers';
import VectorLayer from 'ol/layer/Vector';
import { getCenter } from 'ol/extent';

/**
 * this component handles global indicators and will add and remove layers
 * and associated interactions on mount / destroy.
 * the view of the associated map will be updated if the given indicator
 * demands such behavior (e.g. if a preset view is set)
 *
 * as this layer is meant for global POIs, this will not show up in the layer
 * control by design
 */
export default {
  components: {
    MapOverlay,
  },
  props: {
    mapId: String,
    mergedConfig: Object,
    layerName: String,
    /**
     * @property {*} options.time
     * @property {boolean} options.indicator
     * @property {boolean} options.aoiId
     */
    options: {
      type: Object,
      default: () => ({}),
      required: false,
    },
    // layer swipe position (x-pixel from left border)
    swipePixelX: Number,
  },
  data() {
    return {
      overlayHeaders: [],
      overlayRows: [],
      overlayCoordinate: null,
    };
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const options = { ...this.options };
    options.zIndex = 3;
    const layer = createLayerFromConfig(this.mergedConfig, options);
    layer.set('name', this.layerName);
    const featureLayer = layer.getLayers().getArray().find((l) => l instanceof VectorLayer);
    this.pointerMoveHandler = (e) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: ((candidate) => candidate === featureLayer),
      });
      // when layer swiping is active, only check for features on this layers side
      const isRightLayer = !this.layerName.includes('_compare');
      // check if the layer
      const isCorrectSide = this.swipePixelX !== null
        ? ((isRightLayer && this.swipePixelX < e.pixel[0])
        || (!isRightLayer && this.swipePixelX > e.pixel[0]))
        : true;
      // consider layergroup
      if (isCorrectSide && features.length && this.mergedConfig.features) {
        const feature = features[0];
        // center coordinate of extent, passable approximation for small or regular features
        const coordinate = getCenter(feature.getGeometry().getExtent());
        this.overlayCoordinate = coordinate;
        const rows = [];
        const props = feature.getProperties();
        // some indicators have "allowedParameters", which define the keys to display
        const keys = this.mergedConfig.features.allowedParameters
        || Object.keys(props).filter((k) => k !== 'geometry');
        keys.forEach((key) => {
          if (props[key]) {
            rows.push(`${key}: ${props[key]}`);
          }
        });
        this.overlayRows = rows;
      } else {
        this.overlayCoordinate = null;
        this.overlayContent = null;
      }
    };
    map.on('pointermove', this.pointerMoveHandler);
    map.addLayer(layer);
  },
  methods: {},
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const layer = map.getLayers().getArray().find((l) => l.get('name') === this.layerName);
    map.removeLayer(layer);
    map.un('pointermove', this.pointerMoveHandler);
  },
};
</script>

<style lang="scss" scoped>
</style>
