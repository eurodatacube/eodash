<template>
  <MapOverlay
   :mapId="mapId"
   :overlayId="'adminBordersOverlay'"
   :overlayHeaders="overlayHeaders"
   :overlayRows="overlayRows"
   :overlayCoordinate="overlayCoordinate"
  />
</template>

<script>
import MapOverlay from '@/components/map/MapOverlay.vue';
import { getMapInstance } from '@/components/map/map';
import { createLayerFromConfig } from '@/components/map/layers';
import Select from 'ol/interaction/Select';
import Group from 'ol/layer/Group';
import { getCenter } from 'ol/extent';

/**
 */
export default {
  components: {
    MapOverlay,
  },
  props: {
    mapId: String,
    administrativeConfigs: Array,
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
      overlayRows: [],
      overlayCoordinate: null,
      overlayHeaders: [],
    };
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    // initiate select interaction for admin borders
    this.selectInteraction = new Select({
      style: null,
    });
    map.addInteraction(this.selectInteraction);
    this.selectInteraction.on('select', this.adminBorderClick);
    // initiate hover over admin interaction
    map.on('pointermove', this.adminBorderHover);

    this.adminLayerGroups = this.administrativeConfigs.map((l) => createLayerFromConfig(l,
      map,
      {
        zIndex: 21,
      }));
    this.adminLayerGroups.forEach((l) => {
      map.addLayer(l);
    });
  },
  methods: {
    getLayerFromGroup(layer, config) {
      let foundLayer = null;
      if (layer instanceof Group) {
        foundLayer = layer.getLayers().getArray().find((l) => l.get('name') === config.name);
      } else {
        foundLayer = layer;
      }
      return foundLayer;
    },
    adminBorderClick(e) {
      // handles all clicks from select interaction
      const ftrs = e.target.getFeatures();
      if (ftrs.getLength() > 0) {
        // click contains features, check if was admin layer
        const feature = ftrs.getArray()[0];
        const clickLayer = this.selectInteraction.getLayer(feature);
        const layerIndex = this.administrativeConfigs.findIndex((l) => l.name === clickLayer.get('name'));
        if (layerIndex > -1) {
          // admin layer clicked
          // and update zoom to nearest minzoom or maxzoom of next layer
          this.$store.commit(
            'features/SET_ADMIN_BORDER_FEATURE_SELECTED', feature,
          );
          this.$store.commit(
            'features/SET_ADMIN_BORDER_LAYER_SELECTED', clickLayer,
          );
        }
        // if some other vector layer was clicked, do not care and do not handle the action
        // no else block
      }
    },
    clearHighlightedFeature() {
      this.overlayCoordinate = null;
      this.overlayContent = null;
      this.overlayHeaders = [];
    },
    adminBorderHover(e) {
      if (e.dragging) {
        // should handle random touchscreen mishaps with highlight being stuck there
        this.clearHighlightedFeature();
        return;
      }
      const { map } = getMapInstance(this.mapId);
      const pixel = map.getEventPixel(e.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (ftr) => ftr);
      if (feature) {
        // add feature to highlight layer if feature is part of admin layer and set pointer cursor
        let anyAdminLayerHasFeature = null;
        let foundLayer = null;
        this.adminLayerGroups.forEach((l, i) => {
          const layer = this.getLayerFromGroup(
            l, this.administrativeConfigs[i],
          );
          if (layer && layer.getSource().hasFeature(feature)) {
            anyAdminLayerHasFeature = true;
            foundLayer = layer;
          }
        });
        if (anyAdminLayerHasFeature) {
          // center coordinate of extent, passable approximation for small or regular features
          const coordinate = getCenter(feature.getGeometry().getExtent());
          // show overlay on center of polygon
          this.overlayHeaders = [foundLayer.get('name')];
          this.overlayCoordinate = coordinate;
          const props = feature.getProperties();
          const key = Object.keys(props).find(
            (k) => ['name', 'nuts_name'].includes(k.toLowerCase()),
          );
          if (props[key]) {
            this.overlayRows = [props[key]];
          } else {
            this.overlayRows = [];
          }
        } else {
          this.clearHighlightedFeature();
        }
      } else {
        this.clearHighlightedFeature();
      }
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    this.adminLayerGroups.forEach((layer) => {
      map.removeLayer(layer);
    });
    this.clearHighlightedFeature();
    map.removeInteraction(this.selectInteraction);
    map.un('pointermove', this.adminBorderHover);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
