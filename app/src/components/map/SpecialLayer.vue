<template>
  <MapOverlay
   :mapId="mapId"
   :overlayId="mergedConfigs[0].name"
   :overlayHeaders="overlayHeaders"
   :overlayRows="overlayRows"
   :overlayCoordinate="overlayCoordinate"
  />
</template>

<script>
import { getMapInstance, getViewInstance } from '@/components/map/map';
import MapOverlay from '@/components/map/MapOverlay.vue';
import { createLayerFromConfig } from '@/components/map/layers';
import getProjectionOl from '@/helpers/projutils';
import VectorLayer from 'ol/layer/Vector';
import { getCenter } from 'ol/extent';
import store from '@/store';
import { toLonLat } from 'ol/proj';

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
    mergedConfigs: Array[Object],
    compare: Boolean,
    resetProjectionOnDestroy: Boolean,
    /**
     * @property {*} options.time
     * @property {boolean} options.indicator
     * @property {boolean} options.aoiID
     * @property {boolean} options.customArea
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
      pointerMoveHandlers: [],
    };
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const options = { ...this.options };
    options.zIndex = 3;
    this.mergedConfigs.forEach((config) => {
      const layer = createLayerFromConfig(config, map, options);
      layer.set('name', this.compare ? `${config.name}_compare` : config.name);
      const featureLayer = layer.getLayers().getArray().find((l) => {
        const found = l instanceof VectorLayer;
        return found;
      });
      if (featureLayer) {
        const pointerMoveHandler = (e) => {
          const features = map.getFeaturesAtPixel(e.pixel, {
            layerFilter: ((candidate) => candidate === featureLayer),
          });
          // when layer swiping is active, only check for features on this layers side
          const isRightLayer = !config.name.includes('_compare');
          // check if the layer
          const isCorrectSide = this.swipePixelX !== null
            ? ((isRightLayer && this.swipePixelX < e.pixel[0])
            || (!isRightLayer && this.swipePixelX > e.pixel[0]))
            : true;
          // consider layergroup
          if (isCorrectSide && features.length) {
            const feature = features[0];
            // center coordinate of extent, passable approximation for small or regular features
            const coordinate = getCenter(feature.getGeometry().getExtent());
            this.overlayCoordinate = coordinate;
            const rows = [];
            const props = feature.getProperties();
            // some indicators have "allowedParameters", which define the keys to display
            const keys = config?.allowedParameters || config?.features?.allowedParameters
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
        map.on('pointermove', pointerMoveHandler);
        this.pointerMoveHandlers.push(pointerMoveHandler);
      }
      map.addLayer(layer);
    });
    // update view if previous projection !== new projection
    const defaultProjection = store.state.config.baseConfig.defaultLayersDisplay.mapProjection;
    const projection = getProjectionOl(this.mergedConfigs[0]?.mapProjection || defaultProjection);
    if (map.getView().getProjection().getCode() !== projection?.getCode()) {
      const view = getViewInstance(this.mapId, projection);
      view.on(['change:center', 'change:resolution'], (evt) => {
        const v = evt.target;
        this.reportUpdateView(v);
      });
      map.setView(view);
      this.reportUpdateView(view);
    }
  },
  methods: {
    reportUpdateView(view) {
      const center = toLonLat(view.getCenter(), view.getProjection());
      const currentCenter = { lng: center[0], lat: center[1] };
      const zoom = view.getZoom();
      // these events are emitted to save changed made in the dashboard via the
      // "save map configuration" button
      this.$emit('updatecenter', currentCenter);
      this.$emit('updatezoom', zoom);
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    this.mergedConfigs.forEach((config) => {
      const layer = map.getLayers().getArray().find((l) => l.get('name') === (this.compare ? `${config.name}_compare` : config.name));
      map.removeLayer(layer);
    });
    this.pointerMoveHandlers.forEach((h) => {
      map.un('pointermove', h);
    });
    if (this.resetProjectionOnDestroy) {
      // reset to default map ection if different from it
      const defaultProjection = store.state.config.baseConfig.defaultLayersDisplay.mapProjection;
      const projection = getProjectionOl(defaultProjection);
      if (map.getView().getProjection().getCode() !== projection?.getCode()) {
        const view = getViewInstance(this.mapId, projection);
        map.setView(view);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
