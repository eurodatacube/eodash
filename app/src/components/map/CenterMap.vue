<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3; z-index: 1"></div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';

import countries from '@/assets/countries.json';
import { createLayerFromConfig } from '@/components/map/layers';
import Cluster from '@/components/map/Cluster';
import getMapInstance from '@/components/map/map';


export default {
  components: {
  },
  props: {},
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
    getMapInstance('centerMap').map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
  },
  methods: {
    initMap() {
      const { map } = getMapInstance('centerMap');
      const layers = this.baseLayers.map(createLayerFromConfig);
      layers.forEach((l) => {
        map.addLayer(l);
      });
      const overlayLayers = this.overlayLayers.map(createLayerFromConfig);
      overlayLayers.forEach((l) => {
        map.addLayer(l);
      });
      const cluster = new Cluster(map, this, this.getGroupedFeatures);
      cluster.setActive(true);
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>

</style>
