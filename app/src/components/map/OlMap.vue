<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3; z-index: 1"></div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';

import countries from '@/assets/countries.json';
import {
  createLayerFromConfig, createIndicatorFeatureLayers, initInteractions, cleanupClusterInteraction,
} from '@/components/map/olMapHelpers';
import 'ol/ol.css';

export default {
  components: {},
  data() {
    return {
      map: null,
      minMapZoom: 3,
      zoom: 3,
      maxMapZoom: 14,
      center: [55, 10],
      bounds: null,
      currentSelected: null,
      currentSelectedIndex: null,
      subAoi: null,
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
    baseLayers() {
      return this.baseConfig.baseLayersLeftMap;
    },
    overlayLayers() {
      return this.baseConfig.overlayLayersLeftMap;
    },
    countriesJson() {
      return countries;
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
    countriesStyle() {
      return {
        color: '#a2a2a2',
        weight: 1,
        fillColor: '#fff',
        opacity: this.opacityCountries[this.zoom],
        fillOpacity: this.opacityCountries[this.zoom],
      };
    },
  },
  mounted() {
    this.$map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
  },
  methods: {
    initMap() {
      const layers = this.baseLayers.map(createLayerFromConfig);
      layers.forEach((l) => {
        this.$map.addLayer(l);
      });
      const overlayLayers = this.overlayLayers.map(createLayerFromConfig);
      overlayLayers.forEach((l) => {
        this.$map.addLayer(l);
      });
      const indicatorFeatureLayers = createIndicatorFeatureLayers(this.getGroupedFeatures, this);
      indicatorFeatureLayers.forEach((l) => {
        this.$map.addLayer(l);
      });
      initInteractions(this.$map, this);
    },
  },
  beforeDestroy() {
    cleanupClusterInteraction(this.$map);
  },
};
</script>

<style lang="scss" scoped>

</style>
