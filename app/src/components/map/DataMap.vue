<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3; z-index: 1">
    <LayerControl
      v-if="loaded"
      :mapId="mapId"
      :baseLayers="baseLayers"
      :overlayConfigs="overlayConfigs"
    />
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';
import LayerControl from '@/components/map/LayerControl.vue';
import { createLayerFromConfig } from '@/components/map/layers';
import getMapInstance from '@/components/map/map';
import { formatLabel } from '@/components/map/formatters';
import LayerGroup from 'ol/layer/Group';


export default {
  components: {
    LayerControl,
  },
  props: {
    currentIndicator: String,
    /**
     * to do: define control management via options
     * @property {boolean} attributionControl
     * @property {boolean} zoomControl
     */
    options: Object,
    overlayConfigs: Array,
    baseLayers: Array,
    mapId: String,
    zoomExtent: Array,
    constrainExtent: Array,
    minZoom: Number,
  },
  data() {
    return {
      map: null,
      loaded: false,
      defaultMapOptions: {
        attributionControl: false,
        zoomControl: false,
      },
      opacityTerrain: [1],
      opacityOverlay: [0, 0, 0, 0, 0, 0, 0.4, 0.4, 0.8, 0.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      opacityCountries: [1, 1, 1, 1, 0.7, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  },
  watch: {
    getGroupedFeatures(value) {
      if (value.length) {
        this.initMap();
      }
    },
  },
  computed: {
    ...mapGetters('features', ['getGroupedFeatures']),
    ...mapState('config', ['appConfig', 'baseConfig']),
    countriesJson() {
      return countries;
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
  },
  mounted() {
    this.initMap();
    const { map } = getMapInstance(this.mapId);
    if (this.minZoom !== undefined) {
      map.getView().setMinZoom(this.minZoom);
    }
    map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
    if (this.zoomExtent) {
      map.getView().fit(this.zoomExtent, {
        padding: [30, 30, 30, 30],
      });
    }
    this.$emit('ready', true);
  },
  methods: {
    initMap() {
      const { map } = getMapInstance(this.mapId, {
        constrainExtent: this.constrainExtent,
      });
      const layers = this.baseLayers.map((l) => createLayerFromConfig(l, this));
      layers.forEach((l) => {
        map.addLayer(l);
      });

      const overlayLayers = this.overlayConfigs.map((l) => createLayerFromConfig(l, this));
      overlayLayers.forEach((l) => {
        map.addLayer(l);
      });

      const view = map.getView();
      map.on('moveend', () => {
        this.updateOverlayOpacity(overlayLayers, view);
      });
      this.updateOverlayOpacity(overlayLayers, view);
      this.loaded = true;
    },
    updateOverlayOpacity(overlayLayers, view) {
      const zoom = Math.floor(view.getZoom());
      overlayLayers.forEach((l) => {
        if (l.get('name') === 'Country vectors' || (l.get('updateOpacityOnZoom'))) {
          l.setOpacity(this.opacityCountries[zoom]);
        }
      });
    },
    overlayCallback(indicatorObject) {
      this.tooltip = formatLabel(indicatorObject, this);
    },
  },
  beforeDestroy() {
    // cleanly remove all layers
    getMapInstance(this.mapId).map.setLayerGroup(new LayerGroup());
  },
};
</script>
<style lang="scss" scoped>

.tooltip {
  position: relative;
  font-size: 14px;
  box-shadow: none !important;
  background: rgba(0, 0, 0, 0.6);
  color: #FFFFFF;
}

.tooltip:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.6);
  border-bottom: 0;
  margin-left: -10px;
  margin-bottom: -10px;
}
</style>
