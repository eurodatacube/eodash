<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3;
    z-index: 1" class="d-flex justify-center">
    <!-- a layer displaying a selected global poi -->
    <SpecialLayer v-for="mergedConfig in mergedConfigsData" mapId="centerMap"
      :indicator="mergedConfig"
      :layerName="mergedConfig.name"
      :key="mergedConfig.name"
    />
    <LayerControl
      v-if="loaded"
      mapId="centerMap"
      :key="layerControlKey"
      :baseLayerConfigs="baseLayerConfigs"
      :overlayConfigs="overlayConfigs"
    />
    <LayerSwipe v-if="enableCompare && compareLayerTime"
      :mapId="'centerMap'"
      :time="compareLayerTime.value"
      :mergedConfigsData="mergedConfigsData[0]"
    />
    <indicator-time-selection
      ref="timeSelection"
      v-if="displayTimeSelection"
      :autofocus="!disableAutoFocus"
      :available-values="availableTimeEntries"
      :indicator="mergedConfigsData[0]"
      :compare-active.sync="enableCompare"
      :compare-time.sync="compareLayerTime"
      :original-time.sync="dataLayerTime"
      :enable-compare="!globalLayerConfigs[0].disableCompare"
      :large-time-duration="globalLayerConfigs[0].largeTimeDuration"
      @focusSelect="focusSelect"
    />
    <div id="centerMapOverlay" class="tooltip v-card v-sheet text-center pa-2">
      <p class="ma-0"><strong>{{ tooltip.city }}</strong></p>
      <p class="ma-0"><strong>{{ tooltip.indicator }}</strong></p>
      <p class="ma-0"> {{ tooltip.label }} </p>
    </div>
    <div :style="`position: absolute; z-index: 700; top: 10px; left: 10px;`">
      <img v-if="globalLayerConfigs && globalLayerConfigs[0] &&
        globalLayerConfigs[0].display.legendUrl"
      :src="globalLayerConfigs[0].display.legendUrl" alt=""
      :class="`map-legend ${$vuetify.breakpoint.xsOnly ? 'map-legend-expanded' :
      (legendExpanded && 'map-legend-expanded')}`"
      @click="legendExpanded = !legendExpanded"
      :style="`background: rgba(255, 255, 255, 0.8);`">
      <!--<div
      v-if="mergedConfigsData[0].customAreaFeatures &&
      (mergedConfigsData[0].features.featureLimit === dataFeaturesCount ||
      mergedConfigsData[0].features.featureLimit === compareFeaturesCount)"
      :style="`width: fit-content; background: rgba(255, 255, 255, 0.8);`"
      >
        <h3 :class="`brand-${appConfig.id} px-3 py-2`">
          Limit of drawn features is for performance reasons set to
          <span :style="`font-size: 17px;`">{{mergedConfigsData[0].features.featureLimit}}
          </span>
        </h3>
      </div>-->
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';
import LayerControl from '@/components/map/LayerControl.vue';
import getCluster from '@/components/map/Cluster';
import SpecialLayer from '@/components/map/SpecialLayer.vue';
import LayerSwipe from '@/components/map/LayerSwipe.vue';
import getMapInstance from '@/components/map/map';
import { formatLabel } from '@/components/map/formatters';
import IndicatorTimeSelection from '@/components/IndicatorTimeSelection.vue';
import { updateTimeLayer } from '@/components/map/timeLayerUtils';
import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
} from '@/helpers/mapConfig';

export default {
  components: {
    LayerControl,
    SpecialLayer,
    IndicatorTimeSelection,
    LayerSwipe,
  },
  props: {
    // currentIndicator will only be set as prop in the custom dashboard.
    // if this is not set, use the indicator from the store (selectedIndicator)
    currentIndicator: {
      type: Object,
      default: undefined,
    },
    // to do: still needed?
    disableAutoFocus: Boolean,
  },
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
      dataLayerTime: null,
      compareLayerTime: null,
      enableCompare: false,
      legendExpanded: false,
    };
  },
  computed: {
    ...mapGetters('features', ['getGroupedFeatures', 'getFeatures']),
    ...mapGetters('indicators', ['getIndicatorFilteredInputData']),
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
    displayTimeSelection() {
      return this.globalLayerConfigs[0] && this.globalLayerConfigs[0].time.length > 1
        && !this.globalLayerConfigs[0].disableTimeSelection && this.dataLayerTime;
    },
    isGlobalIndicator() {
      return this.$store.state.indicators.selectedIndicator?.siteName === 'global';
    },
    globalLayerConfigs() {
      // global POI layers config
      // TO DO: should this be surpassed by mergedConfigsData?
      return this.isGlobalIndicator ? [this.$store.state.indicators.selectedIndicator] : [];
    },
    indicator() {
      // the current indicator definition object.
      // will use the "currentIndicator"-Prop if defined (dashboard)
      // otherwise it will use the selected indicator from the store
      return this.getIndicatorFilteredInputData(this.currentIndicator);
    },
    mergedConfigsData() {
      if (!this.indicator) {
        return [];
      }
      return createConfigFromIndicator(
        this.indicator,
        'data',
        0,
      );
    },
    availableTimeEntries() {
      return createAvailableTimeEntries(
        this.globalLayerConfigs[0],
        this.mergedConfigsData, // TODO do we really need to pass the config here?
      );
    },
    selectedTime() {
      return this.$store.state.indicators.selectedTime;
    },
    layerControlKey() {
      // this key changes only when the layers of the center map changes (== global indicators)
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
    '$store.state.indicators.selectedIndicator': () => {
      const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
      cluster.reRender();
    },
    getFeatures(features) {
      if (features) {
        const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
        cluster.setFeatures(features);
      }
    },
    mergedConfigsData() {
      // set the dataLayerTime when the mergedConfigsData changes
      this.setInitialTime();
    },
    selectedTime(value) {
      // redraw all time-dependant layers, if time is passed via WMS params
      const { map } = getMapInstance('centerMap');
      const layers = map.getLayers().getArray();

      this.mergedConfigsData.filter((config) => config.usedTimes?.time?.length)
        .forEach((config) => {
          const layer = layers.find((l) => l.get('name') === config.name);
          if (layer) {
            updateTimeLayer(layer, config, value);
          }
        });
    },
    dataLayerTime(timeObj) {
      this.$store.commit('indicators/SET_SELECTED_TIME', timeObj.value);
    },
    displayTimeSelection(value) {
      if (!value) {
        this.enableCompare = false;
      }
    },
  },
  mounted() {
    const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
    cluster.setActive(true, this.overlayCallback);
    cluster.setFeatures(this.getFeatures);
    this.loaded = true;
    this.setInitialTime();
    getMapInstance('centerMap').map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));

    if (!this.compareLayerTimeProp) {
      this.$nextTick(() => {
        if (this.$refs.timeSelection) {
          // to do: accessing child component methods in nextTick is potentially dangerous
          this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
        }
      });
    }
    if (this.compareLayerTimeProp) {
      // to do: do we need the nextTick?
      this.$nextTick(() => { this.enableCompare = true; });
    }
  },
  methods: {
    overlayCallback(indicatorObject) {
      // callback function for overlay hover events
      this.tooltip = formatLabel(indicatorObject, this);
    },
    setInitialTime() {
      if (this.mergedConfigsData?.length) {
        this.dataLayerTime = {
          value: this.mergedConfigsData[0].usedTimes.time[
            this.mergedConfigsData[0].usedTimes.time.length - 1
          ],
        };
      }
    },
    dataLayerTimeUpdated(time) {
      this.$emit('update:datalayertime', time);
    },
    compareLayerTimeUpdated(time) {
      this.$emit('update:comparelayertime', time);
    },
    focusSelect() {
      // TO DO: handle scrolling?
      /* const lMap = this.$refs.map.mapObject;
      if (on) {
        lMap.scrollWheelZoom.disable();
      } else {
        lMap.scrollWheelZoom.enable();
      } */
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

.map-legend {
  max-width: 15vw;
  transition: max-width 0.5s ease-in-out;
  cursor: pointer;
}
.map-legend-expanded {
  width: initial;
  max-width: 800%;
}
</style>
