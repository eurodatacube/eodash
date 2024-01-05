<template>
  <div
    style="height: 100%; width: 100%;"
  >
    <div
      v-if="timestamp"
      ref="container"
      :id="`cesiumContainer-${timestamp}`"
      style="height: 100%; width: 100%;"
    >
      <!-- Loader -->
      <div
        v-if="!loaded && dataLayerTime"
        class="fill-height d-flex align-center justify-center"
        style="width: 100%; position: absolute; z-index: 1;"
      >
        <div
          class="fill-height"
          style="width: 100%; position: absolute;
            background: var(--v-background-base); opacity: 0.3"
        ></div>
        <div class="sk-fold">
          <div class="sk-fold-cube"></div>
          <div class="sk-fold-cube"></div>
          <div class="sk-fold-cube"></div>
          <div class="sk-fold-cube"></div>
        </div>
      </div>
      <!-- End loader -->
      <div
        class="d-flex justify-center"
        style="position: relative; width: 100%; height: 100%;"
      >
        <indicator-time-selection
          ref="timeSelection"
          v-if="dataLayerTime && !mergedConfigsData[0].disableTimeSelection"
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
      <v-sheet
        class="d-flex align-center"
        style="position: absolute; right: 0; bottom: 0; border-radius: 4px;
        z-index: 1001; padding: 2px"
      >
        <ul
          v-if="showAttribution"
          style="font-size: 10px"
        >
          <li
            v-for="(attribution, key) in attributions"
            :key="key"
            class="mr-1"
            style="display: inline; list-style: none; text-decoration: none"
            v-html="attribution"
          >
          </li>
        </ul>
        <button
          title="Attributions"
          class="d-flex align-center justify-center"
          style="width: 22px; height: 22px; cursor: pointer"
          @click="showAttribution = !showAttribution"
        >
          <span
            class="v-card ol-attribution-expand"
            style="font-weight: bold; line-height: .4em; font-size: 16px"
          >
            {{ showAttribution ? '›' : 'i' }}
          </span>
        </button>
      </v-sheet>
    </div>
  </div>
</template>

<script>
/* eslint no-undef: "off" */
import {
  mapState,
} from 'vuex';
import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
} from '@/helpers/mapConfig';
import { getIndicatorFilteredInputData } from '@/utils';
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
    directionProp: {
      required: false,
    },
    positionProp: {
      required: false,
    },
    rightProp: {
      required: false,
    },
    upProp: {
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
    dataLayers: null,
    compareLayerTime: null,
    dataLayerIndex: 0,
    compareLayerIndex: 0,
    showAttribution: false,
    cameraIsMoving: false,
    cameraLastPosition: {},
    legendExpanded: false,
    timestamp: null,
  }),
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    baseLayers() {
      // expects an array of objects
      return this.baseConfig.baseLayersMap;
    },
    overlayLayers() {
      return this.baseConfig.overlayLayersMap;
    },
    attributions() {
      return [
        ...this.baseLayers.filter((l) => l.visible).map((l) => l.attribution),
        ...this.overlayLayers.filter((l) => l.visible).map((l) => l.attribution),
      ];
    },
    indicator() {
      return getIndicatorFilteredInputData(this.currentIndicator);
    },
    indicatorObject() {
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
  created() {
    this.timestamp = +new Date();
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
      cesiumScript.onload = () => {
        this.createGlobe();
        window.cesiumLoaded = true;
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
      if (this.viewer) {
        const newDataLayers = [];
        this.dataLayers.forEach((layer, index) => {
          const lIndex = this.viewer.imageryLayers.indexOf(layer);
          // Remove and recreate layer to make sure new time is loaded
          this.viewer.imageryLayers.remove(layer, true);
          newDataLayers.push(this.viewer.imageryLayers.addImageryProvider(
            this.createImageryProvider(this.mergedConfigsData[index]), lIndex,
          ));
        });
        this.dataLayers = newDataLayers;
      }
    },
    createImageryProvider(config) {
      let imagery;
      if (!config) {
        imagery = new Cesium.UrlTemplateImageryProvider({
          name: 'EOxCloudless 2021',
          url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg',
          credit: '{ EOxCloudless 2021: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2021) }',
          maximumLevel: 16,
        });
      } else {
        // TODO currently only necessary methods supported
        switch (config.protocol) {
          case 'xyz':
            imagery = new Cesium.UrlTemplateImageryProvider({
              url: config.url.replace('{-y}', '{reverseY}'),
              minimumLevel: config.minZoom ? config.minZoom : 1,
              maximumLevel: config.maxZoom ? config.maxZoom : 10,
              customTags: {
                time: () => config.dateFormatFunction(this.dataLayerTime.value),
              },
            });
            break;
          case 'WMS':
            imagery = new Cesium.WebMapServiceImageryProvider({
              url: config.baseUrl,
              layers: config.layers,
              minimumLevel: config.minZoom ? config.minZoom : 1,
              maximumLevel: config.maxZoom ? config.maxZoom : 10,
              parameters: {
                format: 'image/png',
                transparent: 'true',
                time: config.dateFormatFunction(this.dataLayerTime.value),
              },
              tileWidth: config.tileSize,
              tileHeight: config.tileSize,
            });
            break;
          default:
            console.log('Protocol not yet supported on Globe component');
        }
      }
      return imagery;
    },
    createGlobe() {
      // TODO: Currently only one base layer can be used
      // Find enabled baselayer
      const baseLayerConf = this.baseLayers.filter((layer) => layer.visible);
      this.viewer = new Cesium.Viewer(`cesiumContainer-${this.timestamp}`, {
        imageryProvider: this.createImageryProvider(baseLayerConf[0]),
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
      this.dataLayers = [];
      this.mergedConfigsData.forEach((layerDef) => {
        this.dataLayers.push(this.viewer.imageryLayers.addImageryProvider(
          this.createImageryProvider(layerDef),
        ));
      });
      this.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
      this.viewer.scene.fog.enabled = false;
      this.viewer.scene.globe.showGroundAtmosphere = false;
      this.viewer.scene.globe.tileLoadProgressEvent.addEventListener((queued) => {
        if (queued === 0) {
          this.loaded = true;
        }
      });
      if (this.directionProp) {
        [
          this.viewer.scene.camera.direction.x,
          this.viewer.scene.camera.direction.y,
          this.viewer.scene.camera.direction.z,
        ] = this.directionProp;
      }
      if (this.positionProp) {
        [
          this.viewer.scene.camera.position.x,
          this.viewer.scene.camera.position.y,
          this.viewer.scene.camera.position.z,
        ] = this.positionProp;
      }
      if (this.rightProp) {
        [
          this.viewer.scene.camera.right.x,
          this.viewer.scene.camera.right.y,
          this.viewer.scene.camera.right.z,
        ] = this.rightProp;
      }
      if (this.upProp) {
        [
          this.viewer.scene.camera.up.x,
          this.viewer.scene.camera.up.y,
          this.viewer.scene.camera.up.z,
        ] = this.upProp;
      }
      this.cameraLastPosition = {
        x: this.viewer.scene.camera.position.x,
        y: this.viewer.scene.camera.position.y,
        z: this.viewer.scene.camera.position.z,
      };
      this.viewer.clock.onTick.addEventListener(this.handleTick);
    },
    globeCameraUpdated(direction, position, right, up) {
      this.$emit('update:direction', direction);
      this.$emit('update:position', position);
      this.$emit('update:right', right);
      this.$emit('update:up', up);
    },
    handleTick() {
      // Cesium does not provide a method to know when the camera has stopped,
      // this approach seems to work well enough but there might be a better
      // solution
      const c = this.viewer.scene.camera;
      let th = [1, 1, 1];
      // If current mode is either Columbus or Scene2D lower threshold
      if (this.viewer.scene.mode === 1 || this.viewer.scene.mode === 2) {
        th = [0, 0, 0];
      }
      if (!this.cameraIsMoving) {
        if (Math.abs(this.cameraLastPosition.x - c.position.x) > th[0]
                && Math.abs(this.cameraLastPosition.y - c.position.y) > th[1]
                && Math.abs(this.cameraLastPosition.z - c.position.z) >= th[2]) {
          this.cameraIsMoving = true;
        }
      } else if (Math.abs(this.cameraLastPosition.x - c.position.x) <= th[0]
                && Math.abs(this.cameraLastPosition.y - c.position.y) <= th[1]
                && Math.abs(this.cameraLastPosition.z - c.position.z) <= th[2]) {
        this.cameraIsMoving = false;
        this.globeCameraUpdated(
          [c.direction.x, c.direction.y, c.direction.z],
          [c.position.x, c.position.y, c.position.z],
          [c.right.x, c.right.y, c.right.z],
          [c.up.x, c.up.y, c.up.z],
        );
      } else {
        this.cameraLastPosition.x = c.position.x;
        this.cameraLastPosition.y = c.position.y;
        this.cameraLastPosition.z = c.position.z;
      }
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

::v-deep .cesium-viewer {
  position: absolute
}

.map-legend {
  max-width: 20vw;
  transition: max-width 0.5s ease-in-out;
  cursor: pointer;
}
.map-legend-expanded {
  width: initial;
  max-width: 80%;
}
</style>
