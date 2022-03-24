<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3; z-index: 1">
    <LayerControl
      v-if="loaded"
      mapId="centerMap"
      :baseLayers="baseLayers"
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
import { createLayerFromConfig } from '@/components/map/layers';
import Cluster from '@/components/map/Cluster';
import getMapInstance from '@/components/map/map';
import { formatLabel } from '@/components/map/formatters';


export default {
  components: {
    LayerControl,
  },
  props: {},
  data() {
    return {
      map: null,
      loaded: false,
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
      tooltip: {
        city: '',
        indicator: '',
        description: '',
      },
      overlayConfigs: [],
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
    countriesJson() {
      return countries;
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
  },
  mounted() {
    getMapInstance('centerMap').map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
  },
  methods: {
    initMap() {
      const { map } = getMapInstance('centerMap');
      const layers = this.baseLayers.map((l) => createLayerFromConfig(l, this));
      layers.forEach((l) => {
        map.addLayer(l);
      });
      const countriesConfig = {
        name: 'Country vectors',
        protocol: 'countries',
        visible: true,
      };

      this.overlayConfigs.length = 0;
      this.overlayConfigs.push(...[countriesConfig, ...this.baseConfig.overlayLayersLeftMap]);
      const overlayLayers = this.overlayConfigs.map((l) => createLayerFromConfig(l, this));
      overlayLayers.forEach((l) => {
        map.addLayer(l);
      });

      const view = map.getView();
      map.on('moveend', () => {
        this.updateOverlayOpacity(overlayLayers, view);
      });
      this.updateOverlayOpacity(overlayLayers, view);

      const cluster = new Cluster(map, this, this.getGroupedFeatures);
      cluster.setActive(true, this.overlayCallback);
      this.$watch('$store.state.indicators.selectedIndicator', () => {
        cluster.reRender();
      });
      this.loaded = true;
    },
    updateOverlayOpacity(overlayLayers, view) {
      const zoom = Math.floor(view.getZoom());
      overlayLayers.forEach((l) => {
        if (l.get('name') === 'Country vectors') {
          l.setOpacity(this.opacityCountries[zoom]);
        } else {
          l.setOpacity(this.opacityOverlay[zoom]);
        }
      });
    },
    overlayCallback(indicatorObject) {
      this.tooltip = formatLabel(indicatorObject, this);
    },
  },
  beforeDestroy() {},
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
