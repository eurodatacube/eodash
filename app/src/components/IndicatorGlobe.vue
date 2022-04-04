<template>
  <div
    ref="container"
    id="cesiumContainer"
    style="height: 100%; width: 100%; position: relative;"
  >
    <!-- Loader -->
    <div
      v-if="!loaded"
      class="fill-height d-flex align-center justify-center"
      style="width: 100%; position: absolute; z-index: 1;"
    >
      <div
        class="fill-height"
        style="width: 100%; position: absolute; background: var(--v-background-base); opacity: 0.3"
      ></div>
      <div class="sk-fold">
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
      </div>
    </div>
    <!-- End loader -->
    <indicator-time-selection
      ref="timeSelection"
      v-if="!mergedConfigsData[0].disableTimeSelection"
      :autofocus="!disableAutoFocus"
      :available-values="availableTimeEntries"
      :indicator="indicator"
      :compare-active.sync="enableCompare"
      :compare-time.sync="compareLayerTime"
      :original-time.sync="dataLayerTime"
      :enable-compare="false"
      :large-time-duration="mergedConfigsData[0].largeTimeDuration"
    />
  </div>
</template>

<script>
/* eslint no-undef: "off" */
import {
  mapState,
  mapGetters,
} from 'vuex';
import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
} from '@/helpers/mapConfig';
import IndicatorTimeSelection from './IndicatorTimeSelection.vue';

export default {
  name: 'Globe',
  props: {
    currentIndicator: Object,
    dataLayerTimeProp: {
      required: false,
    },
    compareLayerTimeProp: {
      required: false,
    },
    zoomProp: {
      required: false,
    },
    centerProp: {
      required: false,
    },
    hideCustomAreaControls: {
      required: false,
    },
    disableAutoFocus: Boolean,
  },
  components: {
    IndicatorTimeSelection,
  },
  data: () => ({
    viewer: null,
    loaded: false,
    enableCompare: false,
    dataLayerTime: null,
    dataLayer: null,
    compareLayerTime: null,
    dataLayerIndex: 0,
    compareLayerIndex: 0,
  }),
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapGetters('indicators', [
      'getIndicatorFilteredInputData',
    ]),
    baseLayers() {
      // expects an array of objects
      return this.mergedConfigsData[0].baseLayers || this.baseConfig.baseLayersRightMap;
    },
    overlayLayers() {
      return this.mergedConfigsData[0].overlayLayers || this.baseConfig.overlayLayersRightMap;
    },
    indicator() {
      return this.getIndicatorFilteredInputData(this.currentIndicator);
    },
    indicatorObject() {
      console.log(this.currentIndicator
        || this.$store.state.indicators.selectedIndicator);
      return this.currentIndicator
        || this.$store.state.indicators.selectedIndicator;
    },
    mergedConfigsData() {
      return createConfigFromIndicator(
        this.indicator,
        'data',
        this.getCurrentIndex('data'),
      );
    },
    availableTimeEntries() {
      return createAvailableTimeEntries(
        this.indicator,
        this.mergedConfigsData, // TODO do we really need to pass the config here?
      );
    },
  },
  mounted() {
    if (!this.dataLayerTimeProp) {
      this.dataLayerTime = {
        value: this.mergedConfigsData[0].usedTimes.time[
          this.mergedConfigsData[0].usedTimes.time.length - 1
        ],
      };
    }
    if (!window.cesiumLoaded) {
      const isDev = process.env.NODE_ENV !== 'production';
      const CESIUM_URL = `https://cdn.jsdelivr.net/npm/cesium@1.90.0/Build/${isDev
        ? 'CesiumUnminified/'
        : 'Cesium/'}`;

      const cesiumStyle = document.createElement('link');
      cesiumStyle.href = `${CESIUM_URL}Widgets/widgets.css`;
      cesiumStyle.rel = 'stylesheet';
      document.head.appendChild(cesiumStyle);

      const cesiumScript = document.createElement('script');
      cesiumScript.async = true;
      cesiumScript.src = `${CESIUM_URL}Cesium.js`;
      document.head.appendChild(cesiumScript);
      window.cesiumLoaded = true;
      cesiumScript.onload = () => {
        this.createGlobe();
      };
    } else {
      this.createGlobe();
    }
  },
  watch: {
    dataLayerTime(timeObj) {
      this.dataLayerTimeSelection(timeObj);
    },
    dataLayerTimeProp: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) this.dataLayerTime = this.availableTimeEntries.find((item) => item.name === v);
      },
    },
  },
  methods: {
    refreshLayers() {
      const index = this.viewer.imageryLayers.indexOf(this.dataLayer);
      // Remove and readd layer to make sure new time is loaded
      this.viewer.imageryLayers.remove(this.dataLayer, false);
      this.viewer.imageryLayers.add(this.dataLayer, index);
    },
    createGlobe() {
      const imageryProvider = (config) => {
        // TODO use @/config/layers
        // TODO implement dynamic creation
        let imagery;
        if (!config) {
          imagery = new Cesium.WebMapTileServiceImageryProvider({
            url: 'https://tiles.maps.eox.at/wmts/1.0.0/terrain-light/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
            layer: 'terrain-light',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'WGS84',
            maximumLevel: 12,
            tilingScheme: new Cesium.GeographicTilingScheme({
              numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1,
            }),
            credit: new Cesium.Credit('{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }'),
          });
        } else {
          // TODO currently only necessary methods supported
          switch (config.protocol) {
            case 'xyz':
              imagery = new Cesium.UrlTemplateImageryProvider({
                url: config.url.replace('{-y}', '{reverseY}'),
                maximumLevel: 5,
                customTags: {
                  // TODO dynamic date
                  time: () => this.dataLayerTime.value[0],
                },
              });
            break;
            default:
              console.log('Protocol not yet supported on Globe');
          }
        }
        return imagery;
      };
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: imageryProvider(),
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        creditContainer: null,
        animation: false,
        skyBox: false,
        skyAtmosphere: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      });
      // TODO currently we only support one layer
      this.dataLayer = this.viewer.imageryLayers.addImageryProvider(
        imageryProvider(this.mergedConfigsData[0])
      );
      this.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
      this.viewer.scene.fog.enabled = false;
      this.viewer.scene.globe.showGroundAtmosphere = false;
      this.viewer.scene.globe.tileLoadProgressEvent.addEventListener((queued) => {
        if (queued === 0) {
          this.loaded = true;
        }
      });
    },
    dataLayerTimeUpdated(time) {
      this.$emit('update:datalayertime', time);
    },
    compareLayerTimeUpdated(time) {
      this.$emit('update:comparelayertime', time);
    },
    dataLayerTimeSelection(timeObj) {
      this.dataLayerTime = timeObj;
      const newIndex = this.availableTimeEntries
        .map((i) => i.value)
        .indexOf(this.dataLayerTime.value ? this.dataLayerTime.value : this.dataLayerTime);
      this.dataLayerIndex = newIndex;
      this.refreshLayers();
      this.dataLayerTimeUpdated(this.dataLayerTime.name);
    },
    getCurrentIndex(side) {
      return side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
    },
  },
};
</script>

<style scoped>
::v-deep .cesium-widget-credits {
    display:none !important;
}
</style>
