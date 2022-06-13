<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3;
    z-index: 1" class="d-flex justify-center">
    <!-- a layer adding a (potential) subaoi, z-index 5 -->
    <InverseSubaoiLayer
      mapId="centerMap"
      :indicator="indicator"
    />
    <!-- a layer displaying a selected global poi
     these layers will have z-Index 2 -->
     <div>
    <SpecialLayer v-if="mergedConfigsData.length"
      mapId="centerMap"
      :indicator="mergedConfigsData[0]"
      :layerName="dataLayerName"
      :key="dataLayerName"
      :swipePixelX="swipePixelX"
    />
    </div>
    <!-- will add a drawing layer to the map (z-index 3) -->
    <CustomAreaButtons
      v-if="loaded"
      mapId="centerMap"
      :mergedConfigsData="mergedConfigsData[0]"
      :hideCustomAreaControls="hideCustomAreaControls"
      @fetchCustomAreaIndicator="onFetchCustomAreaIndicator"
      :drawnArea.sync="drawnArea"
      :loading.sync="customAreaLoading"
    />
    <!-- overlay-layers have zIndex 2 or 3, base layers have 0 -->
    <LayerControl
      v-if="loaded"
      mapId="centerMap"
      :key="dataLayerName"
      :baseLayerConfigs="baseLayerConfigs"
      :overlayConfigs="overlayConfigs"
    />
    <!-- compare layer has same zIndex as specialLayer -->
    <LayerSwipe
      v-if="compareLayerTime"
      :mapId="'centerMap'"
      :time="compareLayerTime.value"
      :mergedConfigsData="mergedConfigsData[0]"
      :enable="enableCompare"
      @updateSwipePosition="updateSwipePosition"
      :key="dataLayerName + '_layerSwipe'"
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
      :enable-compare="!indicator.disableCompare"
      :large-time-duration="indicator.largeTimeDuration"
      :key="mergedConfigsData[0].name + '_timeSelection'"
      @focusSelect="focusSelect"
    />
    <!-- an overlay for showing information when hovering over clusters -->
    <MapOverlay
      mapId="centerMap"
      overlayId="clusterOverlay"
      :overlayHeaders="overlayHeaders"
      :overlayRows="overlayRows"
      :overlayCoordinate="overlayCoordinate"
    />
    <div :style="`position: absolute; z-index: 1; top: 10px; right: 50px;`">
      <img v-if="mergedConfigsData.length > 0 && mergedConfigsData[0].legendUrl"
      :src="mergedConfigsData[0].legendUrl" alt=""
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
import InverseSubaoiLayer from '@/components/map/InverseSubaoiLayer.vue';
import LayerSwipe from '@/components/map/LayerSwipe.vue';
import CustomAreaButtons from '@/components/map/CustomAreaButtons.vue';
import getMapInstance from '@/components/map/map';
import MapOverlay from '@/components/map/MapOverlay.vue';
import IndicatorTimeSelection from '@/components/IndicatorTimeSelection.vue';
import { updateTimeLayer } from '@/components/map/timeLayerUtils';
import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
} from '@/helpers/mapConfig';
import GeoJSON from 'ol/format/GeoJSON';
import { transformExtent } from 'ol/proj';
import fetchCustomAreaObjects from '@/helpers/customAreaObjects';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});

export default {
  components: {
    LayerControl,
    SpecialLayer,
    IndicatorTimeSelection,
    LayerSwipe,
    CustomAreaButtons,
    InverseSubaoiLayer,
    MapOverlay,
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
    hideCustomAreaControls: {
      required: false,
    },
    // same as currentIndicator
    initialDrawnArea: {
      type: Object,
      default: undefined,
    },
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
      customAreaLoading: false,
      // overlay data
      overlayHeaders: [],
      overlayRows: [],
      overlayCoordinate: null,
      // layer swipe position (x-pixel from left border), or null if swipe is not active
      swipePixelX: null,
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
    mapDefaults() {
      return {
        ...this.baseConfig.mapDefaults,
        ...this.mergedConfigsData[0],
      };
    },
    displayTimeSelection() {
      return this.indicator?.time.length > 1
        && !this.indicator?.disableTimeSelection && this.dataLayerTime;
    },
    isGlobalIndicator() {
      return this.$store.state.indicators.selectedIndicator?.siteName === 'global';
    },
    indicator() {
      // the current indicator definition object.
      // will use the "currentIndicator"-Prop if defined (dashboard)
      // otherwise it will use the selected indicator from the store
      return this.getIndicatorFilteredInputData(this.currentIndicator);
    },
    drawnArea() {
      // in store or prop saved as 'object', in this component and in customAreaButtons as {area: 'object'} for convenience
      return {
        area: this.initialDrawnArea || this.$store.state.features.selectedArea,
      };
    },
    mergedConfigsData() {
      // only display the "special layers" for global indicators
      if (!this.indicator) {
        return [];
      }
      // to do: indicator "code" (this.indicator.indicator, e.g. "E13b")
      // is not available after createConfigFromIndicator. it is overwritten by an indicator name
      return createConfigFromIndicator(
        this.indicator,
        'data',
        0,
      );
    },
    availableTimeEntries() {
      return createAvailableTimeEntries(
        this.indicator,
        this.mergedConfigsData, // TODO do we really need to pass the config here?
      );
    },
    selectedTime() {
      return this.$store.state.indicators.selectedTime;
    },
    dataLayerName() {
      if (this.mergedConfigsData?.length) {
        return this.mergedConfigsData[0].name;
      }
      return '';
    },
    countriesJson() {
      return countries;
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
    // extent to be zoomed to. Padding will be applied.
    zoomExtent() {
      if (!this.indicator?.subAoi?.features && !this.mergedConfigsData[0]?.presetView) {
        return null;
      }
      const { subAoi } = this.indicator;
      if (subAoi && subAoi.features.length) {
        if (subAoi.features[0].geometry.coordinates.length) {
          const subAoiGeom = geoJsonFormat.readGeometry(subAoi.features[0].geometry);
          return subAoiGeom.getExtent();
        }
        // geoJsonFormat
        return []; // this.subAoi[0].getGeometry().getExtent();
      }
      const presetView = this.mergedConfigsData[0]?.presetView;
      if (presetView) {
        // pre-defined geojson view
        const presetViewGeom = geoJsonFormat.readGeometry(presetView.features[0].geometry);
        return presetViewGeom.getExtent();
      }
      if (this.indicator.aoi) {
        return transformExtent([this.indicator.lng, this.indicator.lat,
          this.indicator.lng, this.indicator.lat],
        'EPSG:4326',
        'EPSG:3857');
      }
      // if nothing else, fit to default bounds
      const { bounds } = this.mapDefaults;
      return transformExtent([bounds._southWest.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._northEast.lat], 'EPSG:4326',
        'EPSG:3857');
    },
  },
  watch: {
    '$store.state.indicators.selectedIndicator': {
      deep: true,
      immediate: true,
      handler() {
        const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
        cluster.reRender();
        if (this.$refs.timeSelection) {
          this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
        }
        // this.updateSelectedAreaFeature();
      },
    },
    getFeatures(features) {
      if (features) {
        const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
        cluster.setFeatures(features);
      }
    },
    mergedConfigsData: {
      // set the dataLayerTime when the mergedConfigsData changes
      deep: true,
      immediate: true,
      handler() {
        this.setInitialTime();
        this.$nextTick(() => {
          if (this.$refs.timeSelection) {
            if (!this.compareLayerTimeProp) {
              // to do: accessing child component methods in nextTick is potentially dangerous
              this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
            } else {
              // to do: do we need the nextTick?
              this.$nextTick(() => { this.enableCompare = true; });
            }
          }
        });
      },
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
      // this.updateSelectedAreaFeature();
    },
    displayTimeSelection(value) {
      if (!value) {
        this.enableCompare = false;
      }
    },
    drawnArea() {
      // this.updateSelectedAreaFeature();
    },
    zoomExtent(value) {
      // when the calculated zoom extent changes, zoom the map to the new extent.
      // this is purely cosmetic and does not limit the ability to pan or zoom
      if (value) {
        getMapInstance('centerMap').map.getView().fit(value);
      }
    },
  },
  mounted() {
    const cluster = getCluster('centerMap', { vm: this, mapId: 'centerMap' });
    cluster.setActive(true, this.overlayCallback);
    cluster.setFeatures(this.getFeatures);
    this.loaded = true;
    getMapInstance('centerMap').map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
  },
  methods: {
    overlayCallback(headers, rows, coordinate) {
      this.overlayHeaders = headers;
      this.overlayRows = rows;
      this.overlayCoordinate = coordinate;
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
    updateSelectedAreaFeature() {
      if (this.drawnArea.area) {
        this.fetchFeatures('data');
        if (this.enableCompare) {
          this.fetchFeatures('compare');
        }
      }
    },
    updateSwipePosition(value) {
      this.swipePixelX = value;
    },
    fetchCustomDataOptions(time, sourceOptionsObj) {
      const outputOptionsObj = {};
      if (sourceOptionsObj?.siteMapping) {
        // substitutes {siteMapping} template
        const currSite = sourceOptionsObj.siteMapping(
          this.indicator.aoiID,
        );
        outputOptionsObj.site = currSite;
      }
      if (time) {
        // substitutes {time} template possibly utilizing dateFormatFunction
        const fixTime = time.value || time;
        outputOptionsObj.time = typeof sourceOptionsObj.dateFormatFunction === 'function'
          ? sourceOptionsObj.dateFormatFunction(fixTime) : fixTime;
        if (sourceOptionsObj.specialEnvTime) {
          outputOptionsObj.env = `year:${outputOptionsObj.time}`;
        }
        // substitutes {featuresTime} template possibly utilizing features.dateFormatFunction
        if (sourceOptionsObj?.features) {
          outputOptionsObj.featuresTime = typeof sourceOptionsObj.features.dateFormatFunction === 'function'
            ? sourceOptionsObj.features.dateFormatFunction(fixTime) : fixTime;
        }
      }
      const paramsToPassThrough = ['env', 'searchid'];
      paramsToPassThrough.forEach((param) => {
        if (typeof sourceOptionsObj[param] !== 'undefined') {
          outputOptionsObj[param] = sourceOptionsObj[param];
        }
      });
      return outputOptionsObj;
    },
    async fetchData({
      type, side,
    }) {
      // fetching of customFeatures, customIndicator
      // depending on fetch success/failure the map loads data or errors are shown
      const usedTime = side === 'data'
        ? this.dataLayerTime
        : this.compareLayerTime;
      this.customAreaLoading = true;
      try {
        if (type === 'customFeatures' || type === 'customIndicator') {
          if (type === 'customFeatures' && !this.mergedConfigsData[0]?.features) {
            this.customAreaLoading = false;
            return;
          }
          if (type === 'customIndicator' && !this.mergedConfigsData[0]?.areaIndicator) {
            this.customAreaLoading = false;
            return;
          }
          const options = this.fetchCustomDataOptions(usedTime, this.mergedConfigsData[0]);
          const custom = await fetchCustomAreaObjects(
            options,
            this.drawnArea.area,
            this.mergedConfigsData[0],
            this.indicator,
            type === 'customFeatures' ? 'features' : 'areaIndicator',
          );
          if (type === 'customFeatures') {
            // todo: this.updateJsonLayers(custom, side);
          } else {
            this.$store.commit(
              'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', custom,
            );
          }
        }
        this.customAreaLoading = false;
      } catch (err) {
        this.customAreaLoading = false;
        if (type === 'customFeatures') {
          // todo: this.updateJsonLayers(emptyF, side);
        } else if (type === 'customIndicator') {
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null,
          );
        }
        console.error(err);
        this.$store.commit('sendAlert', {
          message: `Error requesting data, error message: ${err}.</br>
            If the issue persists, please use the feedback button to let us know.`,
          type: 'error',
        });
      }
    },
    fetchFeatures(side) {
      this.fetchData({
        type: 'customFeatures',
        side,
      });
    },
    onFetchCustomAreaIndicator() {
      this.fetchData({
        type: 'customIndicator',
      });
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

.map-legend {
  max-width: 15vw;
  transition: max-width 0.5s ease-in-out;
  cursor: pointer;
  float: right;
}
.map-legend-expanded {
  width: initial;
  max-width: 80%;
}
</style>
