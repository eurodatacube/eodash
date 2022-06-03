<template>
  <MapOverlay
   :mapId="mapId"
   :overlayHeaders="overlayHeaders"
   :overlayRows="overlayRows"
   :overlayCoordinate="overlayCoordinate"
  />
</template>

<script>
import getMapInstance from '@/components/map/map';
import MapOverlay from '@/components/map/MapOverlay.vue';
import { createLayerFromConfig } from '@/components/map/layers';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { getCenter } from 'ol/extent';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});

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
    indicator: Object,
    layerName: String,
    time: {
      required: false,
    },
  },
  data() {
    return {
      overlayHeaders: [],
      overlayRows: [],
      overlayCoordinate: null,
    };
  },
  watch: {},
  computed: {},
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const layer = createLayerFromConfig(this.indicator, {
      zIndex: 2,
      // optional time
      // if not defined, the layer will get the selected time from store.
      time: this.time,
    });
    layer.set('name', this.layerName);
    const { presetView } = this.indicator;
    if (presetView?.features?.length) {
      const presetGeom = geoJsonFormat.readGeometry(presetView.features[0].geometry);
      map.getView().fit(presetGeom.getExtent());
    }
    let featureLayer;
    if (layer instanceof LayerGroup) {
      featureLayer = layer.getLayers().getArray().find((l) => l instanceof VectorLayer);
    } else {
      featureLayer = layer;
    }
    this.pointerMoveHandler = (e) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: ((candidate) => candidate === featureLayer),
      });
      // consider layergroup
      if (features.length) {
        const feature = features[0];
        // center coordinate of extent, passable approximation for small or regular features
        const coordinate = getCenter(feature.getGeometry().getExtent());
        this.overlayCoordinate = coordinate;
        const rows = [];
        const props = feature.getProperties();
        // some indicators have "allowedParameters", which define the keys to display
        const keys = this.indicator.features.allowedParameters
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
