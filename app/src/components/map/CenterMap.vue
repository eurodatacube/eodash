<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3; z-index: 1">
    <SpecialLayer v-for="indicator in specialLayersConfigs" mapId="centerMap"
    :indicator="indicator" :key="indicator.indicatorName"/>
    <LayerControl
      v-if="loaded"
      mapId="centerMap"
      :key="layerControlKey"
      :baseLayerConfigs="baseLayerConfigs"
      :overlayConfigs="overlayConfigs"
    />
    <div id="centerMapOverlay" class="tooltip v-card v-sheet text-center pa-2">
      <p class="ma-0"><strong>{{ tooltip.city }}</strong></p>
      <p class="ma-0"><strong>{{ tooltip.indicator }}</strong></p>
      <p class="ma-0"> {{ tooltip.label }} </p>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';
import LayerControl from '@/components/map/LayerControl.vue';
import getCluster from '@/components/map/cluster';
import SpecialLayer from '@/components/map/SpecialLayer.vue';
import getMapInstance from '@/components/map/map';
import { formatLabel } from '@/components/map/formatters';

export default {
  components: {
    LayerControl,
    SpecialLayer,
  },
  props: {},
  data() {
    return {
      loaded: false,
      minMapZoom: 3,
      zoom: 3,
      tooltip: {
        city: '',
        indicator: '',
        description: '',
      },
      opacityTerrain: [1],
    };
  },
  computed: {
    ...mapGetters('features', ['getGroupedFeatures', 'getFeatures']),
    ...mapState('config', ['appConfig', 'baseConfig']),
    baseLayerConfigs() {
      if (this.isGlobalIndicator) {
        // use their own base layers from config, if available
        return this.baseConfig.indicatorsDefinition[this.$store
          .state.indicators.selectedIndicator.indicator].baseLayers
          || this.baseConfig.baseLayersLeftMap;
      }
      return this.baseConfig.baseLayersLeftMap;
    },
    overlayConfigs() {
      const configs = [...this.baseConfig.overlayLayersLeftMap];
      if (!this.isGlobalIndicator) {
        configs.push({
          name: 'Country vectors',
          protocol: 'countries',
          visible: true,
        });
      }
      return configs;
    },
    isGlobalIndicator() {
      return this.$store.state.indicators.selectedIndicator?.siteName === 'global';
    },
    specialLayersConfigs() {
      return this.isGlobalIndicator ? [this.$store.state.indicators.selectedIndicator] : [];
    },
    layerControlKey() {
      // this key changes only when the layers of the center map changes
      // otherwise, there will be unneeded flickering
      if (!this.$store.state.indicators.selectedIndicator
      || this.$store.state.indicators.selectedIndicator?.siteName !== 'global') {
        return '';
      }
      // changing keys for global indicators, as these affect the layers
      // of the center map
      return this.$store.state.indicators.selectedIndicator.indicator;
    },
    countriesJson() {
      return countries;
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
  },
  watch: {
    getFeatures(features) {
      const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
      cluster.setFeatures(features);
    },
  },
  mounted() {
    const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
    cluster.setActive(true, this.overlayCallback);
    cluster.setFeatures(this.getFeatures);
    this.$watch('$store.state.indicators.selectedIndicator', () => {
      cluster.reRender();
    });
    this.loaded = true;
    getMapInstance('centerMap').map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
  },
  methods: {
    overlayCallback(indicatorObject) {
      this.tooltip = formatLabel(indicatorObject, this);
    },
  },
  beforeDestroy() {
    const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
    cluster.setActive(false, this.overlayCallback);
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
