<template>
  <div ref="totalContainer" style="height: 100%; width: 100%;">
    <eox-map ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3; z-index: 1" class="d-flex justify-center" :id="mapId">
    </eox-map>
    <div ref="toolContainer" style="height: 100%; width: 100%;" class="d-flex justify-center">
      <!-- a layer adding a (potential) dark overlay, z-index 4 -->
      <DarkOverlayLayer
        :mapId="mapId"
        :configs="darkOverlayLayers"
        v-if="darkOverlayLayers.length > 0"
      />
      <!-- a layer adding a (potential) subaoi, z-index 5 -->
      <SubaoiLayer
        :mapId="mapId"
        :indicator="indicator"
        :mergedConfigsData="mergedConfigsData[0]"
        :isGlobal="!featureObject"
        v-if="dataLayerName"
        :key="dataLayerKey + '_subAoi'"
      />
      <!-- a layer displaying a selected global poi
      these layers will have z-Index 3 -->
      <SpecialLayer
        v-if="showSpecialLayer"
        :mapId="mapId"
        :mergedConfigs="mergedConfigsData"
        :options="specialLayerOptions"
        :key="dataLayerKey  + '_specialLayer'"
        :swipePixelX="swipePixelX"
        :resetProjectionOnDestroy='true'
        @updatecenter="handleSpecialLayerCenter"
        @updatezoom="handleSpecialLayerZoom"
        @setMapTime="(time) => dataLayerTime = {value: time}"
        @setTimeArray="handleSetTimeArray"
      />
      <!-- additional special layer showing frozen indicator-->
      <SpecialLayer
        v-if="showFrozenLayer"
        :mapId="mapId"
        :mergedConfigs="mergedConfigsFrozenData"
        :options="frozenLayerOptions"
        :key="frozenLayerName + '_specialLayer'"
      />
      <div
        class="d-flex justify-center fill-height"
        style="position: absolute; bottom: 0; left: 0; pointer-events: none;
        transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%"
      >
        <LayerSwipe
          v-if="compareLayerTime"
          :mapId="mapId"
          :time="compareLayerTime.value"
          :mergedConfigsData="mergedConfigsLayerSwipe"
          :specialLayerOptionProps="specialLayerOptions"
          :enable="enableCompare"
          :drawnArea="drawnArea"
          @updateSwipePosition="updateSwipePosition"
          :key="dataLayerName + '_layerSwipe'"
        />
        <indicator-time-selection
          ref="timeSelection"
          style="pointer-events: all;"
          v-if="displayTimeSelection && !enableScrollyMode
            && ($vuetify.breakpoint.xsOnly ? mobileTimeselectionToggle : true)"
          :autofocus="!disableAutoFocus && !isInIframe"
          :available-values="availableTimeEntries"
          :indicator="mergedConfigsData[0]"
          :compare-active.sync="enableCompare"
          :compare-time.sync="compareLayerTime"
          :original-time.sync="dataLayerTime"
          :enable-compare="mergedConfigsData[0] && !mergedConfigsData[0].disableCompare"
          :large-time-duration="indicator.largeTimeDuration"
          :key="dataLayerName + '_timeSelection'"
          @focusSelect="focusSelect"
          :style="calculatePosition"
        />

        <v-btn
          v-if="isMinesweeperConfigured && !!minesweeper.game"
        >{{ minesweeper.game.mineCount - minesweeper.game.flagCount }} 💣 remaining</v-btn>

        <div v-if="isMinesweeperConfigured && !!minesweeper.game">
          <v-btn
            v-if="isMinesweeperDebugEnabled"
            @click="minesweeper.game.revealAllTiles()"
          >GAME: Reveal all</v-btn>
          <MinesweeperDialog
            :mode="minesweeper.mode"
            :game="minesweeper.game"
            :elapsedSeconds="minesweeper.elapsedSeconds"
            :is-enabled="this.minesweeper.isDialogEnabled"
            :bbox="minesweeper.bbox"
            :enableSpeciesDisplay="minesweeper.spDisplay"
            @close="minesweeper.isDialogEnabled = false"
            :indicatorObject="indicator"
          />
        </div>
      </div>
      <!-- an overlay for showing information when hovering over clusters -->
      <MapOverlay
        :mapId="mapId"
        overlayId="clusterOverlay"
        :overlayHeaders="overlayHeaders"
        :overlayRows="overlayRows"
        :overlayCoordinate="overlayCoordinate"
      />
      <div
        ref="bottomControlsContainer"
        class="bottomControlsContainer pa-2 d-flex flex-column align-end"
        :class="{'hidden': enableScrollyMode}"
        :style="calculatePadding"
      >
      <div class="mouse-container"
        :style="mousePosConStyle"
        ref="mousePositionContainer"/>
      </div>
      <!-- Container for all controls. Will move when map is resizing -->
      <div
        ref="controlsContainer"
        class="controlsContainer pa-2 d-flex flex-column align-end"
        :class="{'hidden': enableScrollyMode}"
        :style="`margin-right: ${$vuetify.breakpoint.xsOnly ? 0 : controlsContainerStyle}`"
      >
        <FullScreenControl
          v-if="mapId !== 'centerMap'"
          :mapId="mapId" class="pointerEvents"
        />
        <ZoomControl
          v-show="!enableScrollyMode"
          :mapId="mapId"
          class="pointerEvents"
        />
        <LayerControl
          v-if="loaded && mapId !== 'centerMap'"
          class="pointerEvents"
          :mapId="mapId"
        />
        <!-- will add a drawing layer to the map (z-index 3) -->
        <CustomAreaButtons
          v-if="loaded && mapId === 'centerMap'"
          class="pointerEvents"
          :mapId="mapId"
          :mergedConfigsData="mergedConfigsData"
          :key="dataLayerName  + '_customArea'"
          :drawnArea.sync="drawnArea"
        />
        <eox-geosearch
          v-if="searchEndpoint"
          style="
            pointer-events: auto;
            margin-right: 4px;
            --button-size: 36px;
            --button-bg: #fff;
            --button-fg: #000;
          "
          label="Search"
          button
          small
          list-direction="left"
          results-direction="down"
          interval="1000"
          :endpoint="searchEndpoint"
        ></eox-geosearch>
        <v-btn
          v-if="$vuetify.breakpoint.xsOnly && displayTimeSelection"
          :color="$vuetify.theme.currentTheme.background"
          class="pointerEvents"
          style="min-width: 36px; width: 36px; height: 36px;right: 4px;"
          @click="mobileTimeselectionToggle = !mobileTimeselectionToggle"
        >
          <v-icon>mdi-map-clock-outline</v-icon>
        </v-btn>
        <DatePickerControl
          v-if="loaded && mergedConfigsData.length && mergedConfigsData[0].mapTimeDatepicker"
          @selectedDate="setDateFromDatePicker"
          class="pointerEvents"
          :mapId="mapId"
        />
        <SliderControl
          v-if="loaded && mergedConfigsData.length && mergedConfigsData[0].sliderConfig"
          class="pointerEvents"
          :mapId="mapId"
          :config="mergedConfigsData[0].sliderConfig"
        />
        <CustomFeaturesFetchButton
        v-if="loaded && mergedConfigsData.length
          && mergedConfigsData[0].mapTimeDatepicker"
          class="pointerEvents"
          v-on:fetchCustomAreaFeatures="updateSelectedAreaFeature(true)"
        />
        <div
          v-if="$route.name !== 'demo'"
          class="pointerEvents mb-2"
          style="padding-right: 4px; margin-top: 5px;"
        >
          <IframeButton
            v-if="mapId === 'centerMap'
              && indicator
              && indicatorHasMapData()
              && appConfig.id !== 'gtif'"
            :featureObject="featureObject"
            :indicatorObject="indicator"
            :zoom.sync="currentZoom"
            :center.sync="currentCenter"
            mapControl
          />
        </div>
        <div
          v-if="$route.name !== 'demo'"
          class="pointerEvents mb-2"
          style="padding-right: 4px;"
        >
          <AddToDashboardButton
            v-if="mapId === 'centerMap'
              && indicator
              && indicatorHasMapData()
              && (appConfig.id !== 'gtif' || $route.query.customDashboard)"
            :indicatorObject="indicator"
            :featureObject="featureObject"
            :zoom.sync="currentZoom"
            :center.sync="currentCenter"
            :datalayertime="dataLayerTime ? dataLayerTime.name :  null"
            :comparelayertime="enableCompare && compareLayerTime ? compareLayerTime.name : null"
            mapControl
          />
        </div>
        <div
          v-if="$route.name !== 'demo'"
          class="pointerEvents mb-2"
          style="padding-right: 4px; margin-top: 2px;"
        >
          <OLExportButton
            v-if="mapId === 'centerMap'
              && indicator
              && indicatorHasMapData()
              && appConfig.id !== 'gtif'"
            :featureObject="featureObject"
            :indicatorObject="indicator"
            :zoom.sync="currentZoom"
            :center.sync="currentCenter"
            mapControl
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapMutations,
} from 'vuex';
import LayerControl from '@/components/map/LayerControl.vue';
import FullScreenControl from '@/components/map/FullScreenControl.vue';
import ZoomControl from '@/components/map/ZoomControl.vue';
import getCluster from '@/components/map/Cluster';
import SpecialLayer from '@/components/map/SpecialLayer.vue';
import LayerSwipe from '@/components/map/LayerSwipe.vue';
import CustomAreaButtons from '@/components/map/CustomAreaButtons.vue';
import DatePickerControl from '@/components/map/DatePickerControl.vue';
import CustomFeaturesFetchButton from '@/components/map/CustomFeaturesFetchButton.vue';
import SliderControl from '@/components/map/SliderControl.vue';
import { getMapInstance } from '@/components/map/map';
import { createLayerFromConfig } from '@/components/map/layers';
import MapOverlay from '@/components/map/MapOverlay.vue';
import IndicatorTimeSelection from '@/components/IndicatorTimeSelection.vue';
import IframeButton from '@/components/IframeButton.vue';
import OLExportButton from '@/components/OLExportButton.vue';
import AddToDashboardButton from '@/components/AddToDashboardButton.vue';
import { updateTimeLayer } from '@/components/map/timeLayerUtils';
import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
  indicatorHasMapData,
} from '@/helpers/mapConfig';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { fetchCustomAreaObjects } from '@/helpers/customAreaObjects';
import Attribution from 'ol/control/Attribution';
import MousePosition from 'ol/control/MousePosition';
import ScaleLine from 'ol/control/ScaleLine';
import { toStringXY } from 'ol/coordinate';
import { DateTime } from 'luxon';

import SubaoiLayer from '@/components/map/SubaoiLayer.vue';
import DarkOverlayLayer from '@/components/map/DarkOverlayLayer.vue';
import Link from 'ol/interaction/Link';
import { Vector as VectorLayer } from 'ol/layer';
import {
  loadIndicatorExternalData,
  loadIndicatorData,
  calculatePadding,
  findClosest,
  getFilteredInputData,
} from '@/utils';

import Minesweeper from '@/plugins/minesweeper/game';
import { getRandomBoundingBox, findIntersections } from '@/plugins/minesweeper';
import MinesweeperDialog from '@/components/Modal/MinesweeperDialog.vue';
import '@eox/map';

const geoJsonFormat = new GeoJSON({
});

export default {
  components: {
    LayerControl,
    FullScreenControl,
    ZoomControl,
    SpecialLayer,
    IndicatorTimeSelection,
    LayerSwipe,
    CustomAreaButtons,
    DatePickerControl,
    SliderControl,
    SubaoiLayer,
    MapOverlay,
    IframeButton,
    OLExportButton,
    AddToDashboardButton,
    DarkOverlayLayer,
    MinesweeperDialog,
    CustomFeaturesFetchButton,
  },
  props: {
    mapId: {
      type: String,
      default: 'centerMap',
    },
    // currentIndicator will only be set as prop in the custom dashboard.
    // if this is not set, use the indicator from the store (selectedIndicator)
    currentIndicator: {
      type: Object,
      default: undefined,
    },
    currentFeatureData: {
      type: Object,
      default: undefined,
    },
    currentFeatureObject: {
      type: Object,
      default: undefined,
    },
    // to do: still needed?
    disableAutoFocus: Boolean,
    // same as currentIndicator
    initialDrawnArea: {
      type: Object,
      default: undefined,
    },
    dataLayerTimeProp: {
      type: String,
      default: undefined,
    },
    compareLayerTimeProp: {
      type: String,
      default: undefined,
    },
    centerProp: {
      type: Object,
      default: undefined,
    },
    zoomProp: {
      type: Number,
      default: undefined,
    },
    onScrollyModeChange: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loaded: false,
      zoom: 3,
      currentZoom: null,
      currentCenter: null,
      dataLayerTime: null,
      compareLayerTime: null,
      enableCompare: false,
      // overlay data
      overlayHeaders: [],
      overlayRows: [],
      overlayCoordinate: null,
      // layer swipe position (x-pixel from left border), or null if swipe is not active
      swipePixelX: null,
      queryLink: null,
      viewZoomExtentFitId: null,
      enableScrollyMode: false,
      externallySuppliedTimeEntries: null,
      minesweeper: {
        isEnabled: false,
        isDialogEnabled: false,
        isLoaded: false,
        mode: 'start',
        game: null,
        timer: null,
        bbox: [],
        elapsedSeconds: 0,
      },
      mobileTimeselectionToggle: false,
      frozenLayerKey: null,
      appRightPanelsOpened: null,
      geosearchExtent: null,
    };
  },
  computed: {
    ...mapGetters('features', ['getFeatures']),
    ...mapState('config', ['appConfig', 'baseConfig']),
    baseLayerConfigs() {
      return (this.mergedConfigsData.length && this.mergedConfigsData[0].baseLayers)
        || this.baseConfig.baseLayersMap;
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    showFrozenLayer() {
      return this.frozenIndicator && this.mergedConfigsFrozenData
      && this.mergedConfigsFrozenData.length;
    },
    showSpecialLayer() {
      return this.mergedConfigsData.length
      && this.indicatorHasMapData();
    },
    dataLayerConfigLayerControls() {
      // SpecialLayer entries in LayerControl
      let configs = null;
      if (this.showSpecialLayer) {
        configs = this.mergedConfigsData.map((config) => ({
          name: config.name,
          visible: config.visible,
        }));
      }
      return configs;
    },
    overlayConfigs() {
      const configs = [...((
        this.mergedConfigsData.length && this.mergedConfigsData[0].overlayLayers
      ) || this.baseConfig.overlayLayersMap)];
      return configs;
    },
    darkOverlayLayers() {
      // non-interactive layer definitions rendered as inverse semi-transparent overlay
      return (this.mergedConfigsData.length && this.mergedConfigsData[0].darkOverlayLayers)
        || this.baseConfig.darkOverlayLayers || [];
    },
    mapDefaults() {
      return {
        ...this.baseConfig.mapDefaults,
        ...this.mergedConfigsData[0],
      };
    },
    displayTimeSelection() {
      if (this.indicator?.indicator === 'IND4_1') {
        // custom overload
        return false;
      }
      if (this.indicator?.indicator === 'E13d' && this.featureData) {
        // custom overload for extra hassle with replaceMapTimes from config
        return true;
      }
      return (
        !this.indicator?.disableTimeSelection
          && this.featureData?.time
          && this.featureData.time?.length > 1
          && this.indicatorHasMapData()
      ) || (
        this.indicator?.time?.length > 1
        && !this.indicator?.disableTimeSelection && this.dataLayerTime
        && this.indicatorHasMapData()
      );
    },
    indicator() {
      // the current indicator definition object.
      // will use the "currentIndicator"-Prop if defined (dashboard)
      // otherwise it will use the selected indicator from the store
      let indicator = this.$store.state.indicators.selectedIndicator;
      if (this.currentIndicator) {
        indicator = this.currentIndicator;
      }
      return indicator;
    },
    frozenIndicator() {
      return this.$store.state.indicators.frozenIndicator;
    },
    featureObject() {
      let featureObject = this.$store.state.features.selectedFeature?.indicatorObject;
      if (this.currentFeatureObject) {
        featureObject = this.currentFeatureObject;
      }
      return featureObject;
    },
    featureData() {
      let { featureData } = this.$store.state.features;
      if (this.currentFeatureData) {
        featureData = this.currentFeatureData;
      }
      const filteredFeatureData = getFilteredInputData(featureData);
      return filteredFeatureData;
    },
    drawnArea() {
      // in store or prop saved as 'object', in this component and
      // in customAreaButtons as {area: 'object'} for convenience
      return {
        area: this.initialDrawnArea || this.$store.state.features.selectedArea,
      };
    },
    minesweeperOptions() {
      return this?.mergedConfigsData[0]?.minesweeperOptions;
    },
    mergedConfigsData() {
      // only display the "special layers" for global indicators
      if (!this.indicator) {
        return [];
      }
      if (this.featureObject && this.featureData && this.featureData.time) {
        // merge information from both
        const mergedIndicator = {
          ...this.featureObject,
          ...this.featureData,
        };
        // Convert feature data time to strings
        const time = this.featureData.time.map((t) => t.toISO({ suppressMilliseconds: true }));
        mergedIndicator.time = time;
        // Add name from top level indicator to feature indicator
        mergedIndicator.name = this.indicator.name;
        return createConfigFromIndicator(
          mergedIndicator,
          -1, // initial time is last in array - indexed via array.at(-1)
        );
      }
      if (!this.featureObject && this.indicator?.features?.length > 0) {
        // indicator already selected but POI not yet
        return [];
      }
      return createConfigFromIndicator(
        this.indicator,
        -1, // initial time is last in array - indexed via array.at(-1)
      );
    },
    mergedConfigsLayerSwipe() {
      if (!this.indicator) {
        return [];
      }
      if (this.featureObject && this.featureData && this.featureData.time) {
        // merge information from both
        const mergedIndicator = {
          ...this.featureObject,
          ...this.featureData,
        };
        // Convert feature data time to strings
        const time = this.featureData.time.map((t) => t.toISO({ suppressMilliseconds: true }));
        mergedIndicator.time = time;
        // Add name from top level indicator to feature indicator
        mergedIndicator.name = this.indicator.name;
        return createConfigFromIndicator(
          mergedIndicator,
          this.currentTimeIndexLayerSwipe,
        );
      }
      if (!this.featureObject && this.indicator?.features?.length > 0) {
        // indicator already selected but POI not yet
        return [];
      }
      return createConfigFromIndicator(
        this.indicator,
        this.currentTimeIndexLayerSwipe,
      );
    },
    mergedConfigsDataIndexAware() {
      // just for time update to correctly use current time index
      if (!this.indicator) {
        return [];
      }
      if (this.featureObject && this.featureData && this.featureData.time) {
        // merge information from both
        const mergedIndicator = {
          ...this.featureObject,
          ...this.featureData,
        };
        // Convert feature data time to strings
        const time = this.featureData.time.map((t) => t.toISO({ suppressMilliseconds: true }));
        mergedIndicator.time = time;
        // Add name from top level indicator to feature indicator
        mergedIndicator.name = this.indicator.name;
        return createConfigFromIndicator(
          mergedIndicator,
          this.currentTimeIndex,
        );
      }
      if (!this.featureObject && this.indicator?.features?.length > 0) {
        // indicator already selected but POI not yet
        return [];
      }
      return createConfigFromIndicator(
        this.indicator,
        this.currentTimeIndex,
      );
    },
    mergedConfigsFrozenData() {
      const config = createConfigFromIndicator(
        this.frozenIndicator,
        -1,
      );
      let resultConfig = null;
      // use only first "layer" entry
      if (config.length > 0) {
        [resultConfig] = config;
        resultConfig.name = this.frozenIndicator.frozenLayerName;
        resultConfig.id = `${resultConfig.id}_frozen`;
        resultConfig.visible = false;
        // bake in selected time by only passing one time to the frozen indicator
        if ('usedTimes' in resultConfig && this.dataLayerTime) {
          resultConfig.usedTimes.time = [
            this.dataLayerTime.value,
          ];
        }
      }
      return [resultConfig];
    },
    currentTimeIndex() {
      return this.availableTimeEntries.findIndex((item) => item.name === this.dataLayerTime.name);
    },
    currentTimeIndexLayerSwipe() {
      if (this.compareLayerTime) {
        return this.availableTimeEntries.findIndex(
          (item) => item.name === this.compareLayerTime.name,
        );
      }
      return 0;
    },
    /**
     * optional options for special layer.
     */
    specialLayerOptions() {
      return {
        time: this.dataLayerTime?.value,
        indicator: this.indicator?.indicator,
        aoiID: this.indicator?.aoiID,
        drawnArea: this.drawnArea,
      };
    },
    frozenLayerOptions() {
      const obj = {
        dataProp: 'frozenMapData',
        frozenLayer: true,
      };
      if (this.mergedConfigsFrozenData?.length) {
        obj.time = this.mergedConfigsFrozenData[0]?.usedTimes?.time[0];
      }
      return obj;
    },
    availableTimeEntries() {
      if (!this.indicator) {
        return [];
      }
      if (this.featureObject && this.featureData && this.featureData.time) {
        // merge information from both
        const mergedIndicator = {
          ...this.featureObject,
          ...this.featureData,
        };
        // Add name from top level indicator to feature indicator
        mergedIndicator.name = this.indicator.name;
        // Convert time back to strings
        const stringTime = [];
        this.featureData.time.forEach(
          (t) => stringTime.push(t.toISO({ suppressMilliseconds: true })),
        );
        mergedIndicator.time = stringTime;
        return createAvailableTimeEntries(
          mergedIndicator,
          this.mergedConfigsData,
        );
      }
      return createAvailableTimeEntries(
        this.indicator,
        this.mergedConfigsData, // TODO do we really need to pass the config here?
      );
    },
    frozenLayerName() {
      let dataLayerName;
      if (this.mergedConfigsFrozenData?.length) {
        dataLayerName = this.mergedConfigsFrozenData[0].name;
      }
      return dataLayerName || '';
    },
    dataLayerName() {
      let dataLayerName;
      if (this.mergedConfigsData?.length) {
        dataLayerName = this.mergedConfigsData[0].name;
      }
      return dataLayerName || '';
    },
    specialLayerKey() {
      return this.dataLayerName;
    },
    dataLayerKey() {
      return this.dataLayerName + this.indicator.aoiID + this.indicator.indicator;
    },
    // extent to be zoomed to. Padding will be applied.
    zoomExtent() {
      const { map } = getMapInstance(this.mapId);
      const readerOptions = {
        dataProjection: 'EPSG:4326',
        featureProjection: map.getView().getProjection(),
      };
      if (this.geosearchExtent) return this.geosearchExtent;
      // Check for possible subaoi
      if (this.featureData?.subAoi) {
        const { subAoi } = this.featureData;
        if (subAoi && subAoi.features && subAoi.features.length > 0) {
          if (subAoi.features[0].coordinates.length) {
            const subAoiGeom = geoJsonFormat.readGeometry(
              subAoi.features[0], readerOptions,
            );
            return subAoiGeom.getExtent();
          }
        }
      }
      const presetView = this.mergedConfigsData[0]?.presetView;
      if (presetView) {
        // pre-defined geojson view
        const presetViewGeom = geoJsonFormat.readGeometry(
          presetView.features[0].geometry, readerOptions,
        );
        return presetViewGeom.getExtent();
      }
      if (this?.minesweeperOptions?.locations) {
        const location = this.minesweeperOptions.locations[
          this.selectedLocationIndex
        ];
        return transformExtent(location.bbox,
          'EPSG:4326',
          map.getView().getProjection());
      }
      if (this.indicator?.extent) {
        // Try to do some sanitizing
        const extent = this.indicator.extent.spatial.bbox[0];
        if (extent.length === 4) {
          extent[0] = extent[0] > -180 ? extent[0] : -180;
          extent[1] = extent[1] > -90 ? extent[1] : -90;
          extent[2] = extent[2] < 180 ? extent[2] : 180;
          extent[3] = extent[3] < 90 ? extent[3] : 90;
        }
        return transformExtent(
          extent, 'EPSG:4326', map.getView().getProjection(),
        );
      }
      return undefined;
    },
    isInIframe() {
      return window.self !== window.top;
    },
    calculatePosition() {
      let position = 'bottom: 40px';
      if (this.$vuetify.breakpoint.xsOnly) {
        position = `bottom: ${this.$vuetify.application.footer + 70}px`;
      }
      if (this.mapId === 'centerMap'
        && this.$vuetify.breakpoint.smAndUp && this.$route.name !== 'demo') {
        position = 'bottom: 40px';
      }
      if (this.mapId === 'centerMap'
        && this.$vuetify.breakpoint.smAndUp && this.appConfig.enableESALayout) {
        position = 'bottom: 72px';
      }
      if (this.dataLayerTimeProp && this.$vuetify.breakpoint.smAndUp) {
        position = 'bottom: 25px';
      }
      if (this.mapId === 'embedMap') {
        position = ` bottom:${this.$vuetify.application.footer + 24}px`;
      }
      return position;
    },
    isMinesweeperConfigured() {
      return this.indicator && this?.minesweeperOptions;
    },
    selectedLocationIndex() {
      return this.isMinesweeperConfigured
        && this?.minesweeperOptions.selectedLocationIndex;
    },
    isMinesweeperDebugEnabled() {
      return this.isMinesweeperConfigured
        && new URLSearchParams(document.location.search).get('debug') === 'true';
    },
    calculatePadding() {
      // It seems that the footer on gtif is somehow not evaluated need to handle it differently
      let style;
      if (this.appConfig.id === 'gtif') {
        style = `padding-bottom: ${this.$vuetify.breakpoint.xsOnly
          ? this.$vuetify.application.footer + 60 : this.$vuetify.application.footer + 11}px !important;`;
      } else {
        style = `padding-bottom: ${this.$vuetify.breakpoint.xsOnly
          ? this.$vuetify.application.footer + 30 : 3}px !important;`;
      }
      return style;
    },
    mousePosConStyle() {
      let style = 'position:absolute;bottom:-5px;';
      // Trying to detect touch device, if it is, remove coordinates hover visualization
      if (matchMedia('(hover: none), (pointer: coarse)').matches) {
        style += 'display:none;';
      }
      return style;
    },
    controlsContainerStyle() {
      return this.mapId === 'centerMap' && this.appRightPanelsOpened ? 'calc(min(25%, 500px) - 18px)' : '20px';
    },
    searchEndpoint() {
      let endpoint = false;
      if ('geosearchEndpoint' in this.appConfig) {
        endpoint = this.appConfig.geosearchEndpoint;
      }
      // Apply key based on endpoint (seems i can't do this within appConfig because of linting)
      if (this.appConfig.id === 'esa') {
        endpoint += `&key=${shConfig.opencageRACE}`;
      } else if (this.appConfig.id === 'trilateral') {
        endpoint += `&key=${shConfig.opencageTrilateral}`;
      } else if (this.appConfig.id === 'gtif') {
        endpoint += `&key=${shConfig.opencageGTIF}`;
      }
      return endpoint;
    },
  },
  watch: {
    async minesweeperOptions() {
      if (this.isMinesweeperConfigured) {
        await this.tearDownMinesweeper();
        await this.setupMinesweeper();
      } else {
        this.tearDownMinesweeper();
      }
    },
    baseLayerConfigs() {
      this.updateBaseLayers();
    },
    overlayConfigs() {
      this.updateOverlayLayers();
    },
    getFeatures(features) {
      if (this.mapId === 'centerMap' && features) {
        const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
        cluster.setFeatures(features);
      }
    },
    mergedConfigsData: {
      // TODO: removed deep attribute for watch as it was triggering a change with filter attribute
      //       changes and resetting the time, it does not seem that the deep attribute is
      //       necessary, but this might creat some issues somewhere else, could not find any.
      // deep: true,
      // set the dataLayerTime when the mergedConfigsData changes
      immediate: true,
      handler() {
        this.setInitialTime();
        this.$nextTick(() => {
          if (this.$refs.timeSelection) {
            if (!this.compareLayerTimeProp) {
              // to do: accessing child component methods in nextTick is potentially dangerous
              this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
              this.enableCompare = false;
            } else {
              // to do: do we need the nextTick?
              this.$nextTick(() => { this.enableCompare = true; });
            }
          }
          this.$store.commit('features/SET_SELECTED_FEATURES', []);
        });
      },
    },
    dataLayerTime: {
      immediate: true,
      handler(timeObj) {
        if (timeObj && typeof timeObj.value !== 'undefined') {
          const { map } = getMapInstance(this.mapId);
          const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
          const layers = dataGroup.getLayers().getArray();
          if (this.indicator && 'queryParameters' in this.indicator) {
            // re-load indicator data for indicators where the rendering is based on external data
            // get only valid configs (which has 'id')
            const configs = this.mergedConfigsData.filter((item) => item.id);
            configs.forEach((item) => {
              loadIndicatorExternalData(
                timeObj.value, item,
              ).then((data) => {
                if (this.$store.state.indicators.selectedIndicator) {
                  this.$store.state.indicators.selectedIndicator.mapData = data;
                }
                // finds first layer with ID
                const currLayer = layers.find((l) => l.get('id') === item.id);
                if (currLayer) {
                  currLayer.changed();
                }
              });
            });
          }
          // redraw all time-dependant layers, if time is passed via WMS params
          const area = this.drawnArea;
          this.mergedConfigsDataIndexAware.filter(
            (config) => config.mapTimeDatepicker
              || config.timeFromProperty
              || config.usedTimes?.time?.length,
          )
            .forEach((config) => {
              const layer = layers.find((l) => l.get('name') === config.name);
              if (layer instanceof VectorLayer && config.mapTimeDatepicker) {
                // do not fetch new features on time changeempty
              } else if (layer) {
                updateTimeLayer(layer, config, timeObj.value, area);
              }
            });
          this.$emit('update:datalayertime', timeObj.name);
          window.postMessage({
            command: 'chart:setTime',
            time: this.convertDateForMsg(timeObj?.value),
          });
        } else {
          window.postMessage({
            command: 'chart:setTime',
            time: null,
          });
        }
      },
    },
    enableCompare(enabled) {
      // Make sure compare data is loaded if required
      if (this.indicator && 'queryParameters' in this.indicator) {
        // TODO: Currently using first time entry as default, pretty sure we need more logic here
        const configs = this.mergedConfigsData.filter((item) => item.id);
        configs.forEach((config) => {
          loadIndicatorExternalData(
            this.indicator.time[0], config,
          ).then((data) => {
            this.$store.state.indicators.selectedIndicator.compareMapData = data;
            this.$emit('update:comparelayertime', enabled ? this.compareLayerTime?.name : null);
          });
        });
      } else {
        this.$emit('update:comparelayertime', enabled ? this.compareLayerTime?.name : null);
      }
      if (enabled) {
        window.postMessage({
          command: 'chart:setCompareTime',
          time: this.convertDateForMsg(this.compareLayerTime?.value),
        });
      } else {
        window.postMessage({
          command: 'chart:setCompareTime',
          time: null,
        });
      }
    },
    compareLayerTime(timeObj) {
      this.$emit('update:comparelayertime', this.enableCompare ? timeObj.name : null);
      if (timeObj && this.enableCompare && typeof timeObj.value !== 'undefined') {
        window.postMessage({
          command: 'chart:setCompareTime',
          time: this.convertDateForMsg(timeObj?.value),
        });
      } else {
        window.postMessage({
          command: 'chart:setCompareTime',
          time: null,
        });
      }
    },
    displayTimeSelection(value) {
      if (!value) {
        this.enableCompare = false;
      }
    },
    drawnArea() {
      this.updateSelectedAreaFeature();
    },
    dataLayerTimeProp: {
      // immediate: true,
      // deep: true,
      handler(v) {
        // only defined for customDashBoard
        if (v) this.dataLayerTime = this.availableTimeEntries.find((item) => item.name === v);
      },
    },
    compareLayerTimeProp: {
      immediate: true,
      deep: true,
      handler(v) {
        // only defined for customDashBoard
        if (v) this.compareLayertime = this.availableTimeEntries.find((item) => item.name === v);
      },
    },
    zoomExtent: {
      deep: false,
      immediate: false,
      handler(value, old) {
        // when the calculated zoom extent changes, zoom the map to the new extent.
        // this is purely cosmetic and does not limit the ability to pan or zoom
        // paddings are calculated globally for the view.
        if (
          value
          && JSON.stringify(old) !== JSON.stringify(value)
          && !(this.centerProp || this.zoomProp)
        ) {
          const { map } = getMapInstance(this.mapId);
          // sanitize input to fit into current view projection extent
          const extent = value;
          const projectionExtent = map.getView().getProjection().getExtent();
          if (extent.length === 4) {
            extent[0] = Math.max(extent[0], projectionExtent[0]);
            extent[1] = Math.max(extent[1], projectionExtent[1]);
            extent[2] = Math.min(extent[2], projectionExtent[2]);
            extent[3] = Math.min(extent[3], projectionExtent[3]);
          }
          if (map.getTargetElement()) {
            const padding = calculatePadding();
            // clear race condition of original view and possibly new view with new projection
            if (this.viewZoomExtentFitId) {
              clearTimeout(this.viewZoomExtentFitId);
            }
            this.viewZoomExtentFitId = setTimeout(() => {
              map.getView().fit(extent, { duration: 500, padding });
            }, 30);
          } else {
            map.once('change:target', () => {
              map.getView().fit(extent);
            });
          }
        }
      },
    },
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    if (this.mapId === 'centerMap') {
      const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
      cluster.setActive(true, this.overlayCallback);
      cluster.setFeatures(this.getFeatures);
      const { x, y, z } = this.$route.query;
      if (!x && !y && !z) {
        setTimeout(() => {
          const { bounds } = this.mapDefaults;
          const extent = transformExtent(bounds, 'EPSG:4326',
            map.getView().getProjection());
          const padding = calculatePadding();
          map.getView().fit(extent, { padding });
        }, 500);
      }
    }
    this.loaded = true;

    this.updateBaseLayers();
    this.updateOverlayLayers();

    this.$store.subscribe((mutation) => {
      if (mutation.type === 'indicators/INDICATOR_LOAD_FINISHED') {
        if (this.mapId === 'centerMap') {
          const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
          cluster.reRender();
          if (this.$refs.timeSelection) {
            this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
          }
          cluster.clusters.setVisible(true);
        }
      }
    });

    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/SET_SELECTED_FEATURES') {
        if (this.indicator && ['CROPOMHU1', 'CROPOMHU2', 'CROPOMAT1', 'CROPOMAT2', 'CROPOMHUMR1', 'CROPOMHUMR2', 'CROPOMHUSC1', 'CROPOMHUSC2', 'CROPOMRO1', 'CROPOMRO2'].includes(this.indicator.indicator) && this.mapId === 'centerMap') {
          if (mutation.payload?.length > 0) {
            window.dispatchEvent(new Event('fetch-custom-area-chart'));
          } else {
            // reset custom area chart
            this.$store.commit('indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null);
          }
        }
      }
    });
    map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
    // adding a necessary reference for eox-layercontrol plugin
    this.$refs.mapContainer.map = map;

    const attributions = new Attribution();
    attributions.setTarget(this.$refs.bottomControlsContainer);
    attributions.setMap(map);

    map.addControl(new MousePosition({
      coordinateFormat: (coordinates) => {
        let lonValue = coordinates[0] % 360;
        if (lonValue > 180) {
          lonValue -= 360;
        } else if (lonValue < -180) {
          lonValue += 360;
        }
        return `<span>${toStringXY([lonValue, coordinates[1]], 3)}</span>`;
      },
      projection: 'EPSG:4326',
      target: this.$refs.mousePositionContainer,
      className: 'ol-control ol-mouse-position',
      placeholder: '',
    }));
    map.addControl(new ScaleLine());

    const view = map.getView();
    view.on(['change:center', 'change:resolution'], (evt) => {
      this.currentZoom = evt.target.getZoom();
      const center = toLonLat(evt.target.getCenter(), evt.target.getProjection());
      this.currentCenter = { lng: center[0], lat: center[1] };
      // these events are emitted to save changed made in the dashboard via the
      // "save map configuration" button
      this.$emit('update:center', this.currentCenter);
      this.$emit('update:zoom', this.currentZoom);
    });
    if (this.centerProp && this.zoomProp) {
      setTimeout(() => {
        view.setCenter(
          fromLonLat(
            [this.centerProp.lng, this.centerProp.lat], map.getView().getProjection(),
          ),
        );
        view.setZoom(this.zoomProp);
      }, 20);
    }
    this.$emit('ready', true);

    window.addEventListener('message', this.handleExternalMapMessage);

    this.ro = new ResizeObserver(this.onResize);
    this.ro.observe(this.$refs.mapContainer);
    // Fetch data for custom chart if the event is fired.
    window.addEventListener(
      'fetch-custom-area-chart',
      this.onFetchCustomAreaIndicator,
    );
    if (this.mapId === 'centerMap') {
      this.queryLink = new Link({ replace: true, params: ['x', 'y', 'z'] });
      map.addInteraction(this.queryLink);
    }

    window.addEventListener('geosearchSelect', (e) => { this.geosearchExtent = e.detail; });
  },
  methods: {
    startMineSweepCounter() {
      this.minesweeper.elapsedSeconds = 0;
      console.info('Minesweeper::StartTimer');
      this.minesweeper.timer = setInterval(() => {
        this.minesweeper.elapsedSeconds += 1;
      }, 1000);
    },
    continueMineSweepCounter() {
      if (this.minesweeper.game.isGameCompleted) {
        document.dispatchEvent(new Event('minesweeper:win'));
      }
    },
    async winMineSweep() {
      clearInterval(this.minesweeper.timer);
      this.minesweeper.mode = 'win';
      this.minesweeper.isDialogEnabled = true;
    },
    gameoverMineSweep() {
      clearInterval(this.minesweeper.timer);
      this.minesweeper.mode = 'gameover';
      this.minesweeper.isDialogEnabled = true;
    },
    restartMineSweep() {
      console.log('Minesweeper::Restart');
      this.tearDownMinesweeper();

      this.minesweeper.mode = 'start';

      window.setTimeout(() => {
        this.setupMinesweeper();
      }, 1000);
    },
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
      loadIndicatorFinished: 'INDICATOR_LOAD_FINISHED',
    }),
    ...mapMutations('features', {
      setSelectedFeature: 'SET_SELECTED_FEATURE',
    }),
    updateLayers(layerCollection, newLayers) {
      const layersToRemove = layerCollection.getArray()
        .filter((l) => !newLayers.find((nL) => (nL.get('name') === l.get('name') && nL.get('visible') === l.get('visible'))));
      const layersToAdd = newLayers
        .filter((nL) => !layerCollection.getArray().find((l) => l.get('name') === nL.get('name') && nL.get('visible') === l.get('visible')));
      // remove old layers not needed in new collection
      layersToRemove.forEach((removedLayer) => {
        const layer = layerCollection.getArray()
          .find((l) => l.get('name') === removedLayer.get('name'));
        if (!layer) { return; }
        layerCollection.remove(layer);
      });

      // add missing layers to collection
      layersToAdd.forEach((addedLayer) => {
        const layer = newLayers.find((l) => l.get('name') === addedLayer.get('name'));
        if (!layer) { return; }
        layerCollection.push(layer);
      });
    },
    updateBaseLayers() {
      const { map } = getMapInstance(this.mapId);

      const backgroundGroupCollection = map.getLayers().getArray()
        .find((l) => l.get('id') === 'backgroundGroup').getLayers();

      const baseLayers = this.baseLayerConfigs
        .filter(Boolean)
        .map((l) => {
          const createdLayer = createLayerFromConfig(l, map);
          return createdLayer;
        });
      baseLayers.forEach((l) => l.set('layerControlExclusive', true));

      this.updateLayers(backgroundGroupCollection, baseLayers);
    },
    updateOverlayLayers() {
      const { map } = getMapInstance(this.mapId);

      const overlayGroupCollection = map.getLayers().getArray()
        .find((l) => l.get('id') === 'overlayGroup').getLayers();

      const overlayLayers = this.overlayConfigs
        .filter(Boolean)
        .map((l) => {
          const createdLayer = createLayerFromConfig(l,
            map,
            {
              updateOpacityOnZoom: l.name === 'Overlay labels' || l.name === 'Country vectors',
            });
          return createdLayer;
        });

      this.updateLayers(overlayGroupCollection, overlayLayers);
    },
    convertDateForMsg(time) {
      let timeConverted = null;
      if (Array.isArray(time)) {
        [timeConverted] = time;
      } else {
        timeConverted = time;
      }
      if (timeConverted?.isLuxonDateTime && typeof timeConverted.toISODate === 'function') {
        timeConverted = timeConverted.toISODate();
      }
      return timeConverted;
    },
    handleSpecialLayerZoom(e) {
      this.$emit('update:zoom', e);
      this.currentZoom = e;
    },
    handleSpecialLayerCenter(e) {
      this.$emit('update:center', e);
      this.currentCenter = e;
    },
    setDateFromDatePicker(date) {
      this.dataLayerTime = {
        name: date,
        value: DateTime.fromISO(date),
      };
    },
    updateTime(time, compare) {
      // Define a function to update the data layer
      // direct match on name
      let timeEntry = this.availableTimeEntries.find((e) => e.name === time);
      if (timeEntry === undefined && time.isLuxonDateTime) {
        // search for closest time to datetime if provided as such
        const searchTimes = this.availableTimeEntries.map((e) => {
          const timeValue = Array.isArray(e.value) ? e.value[0] : e.value;
          if (timeValue?.isLuxonDateTime) {
            return timeValue;
          }
          return DateTime.fromISO(timeValue);
        });
        const closestTime = findClosest(searchTimes, time);
        // get back the original unmapped object with value and name
        timeEntry = this.availableTimeEntries.find((e) => {
          const timeValue = Array.isArray(e.value) ? e.value[0] : e.value;
          if (timeValue?.isLuxonDateTime) {
            return timeValue.ts === closestTime.ts;
          }
          return DateTime.fromISO(timeValue).ts === closestTime.ts;
        });
      } else {
        // Use most recent time since there is none defined in the map timeline
        timeEntry = this.availableTimeEntries[this.availableTimeEntries.length - 1];
      }
      if (compare) {
        this.compareLayerTime = timeEntry;
      } else {
        this.dataLayerTime = timeEntry;
      }
    },
    scheduleUpdateTime(time, compare) {
      // Define a function to schedule the data layer update during the next animation frame
      // Use requestAnimationFrame to schedule the update during the next animation frame
      requestAnimationFrame(() => {
        this.updateTime(time, compare);
      });
    },
    async handleExternalMapMessage(event) {
      if (event.data.command === 'map:reset') {
        // Update the state of the application using the message data
        this.resetView();
      }
      if (event.data.command === 'map:setZoom' && event.data.zoom) {
        // Update the state of the application using the message data
        const { map } = getMapInstance(this.mapId);
        const view = map.getView();
        view.setZoom(event.data.zoom);
      }

      if (event.data.command === 'map:setTime' && event.data.time) {
        this.scheduleUpdateTime(event.data.time, false);
      }

      if (event.data.command === 'map:setCompareTime' && event.data.time) {
        this.scheduleUpdateTime(event.data.time, true);
      }

      if (event.data.command === 'map:refreshCompareLayer') {
        const { map } = getMapInstance(this.mapId);
        const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
        const config = createConfigFromIndicator(
          this.indicator,
          'compare',
          0,
        )[0];
        const swipeLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === `${config.name}_compare`);
        if (swipeLayer) {
          updateTimeLayer(swipeLayer, config, this.compareLayerTime, this.drawnArea);
        }
      }

      if (event.data.command === 'map:refreshFeatures') {
        const { map } = getMapInstance(this.mapId);
        const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
        const config = createConfigFromIndicator(
          this.indicator,
          'data',
          0,
        );
        // config with .features will be always the "even" in the array of configs due to
        const featureLayer = dataGroup.getLayers().getArray().find((l) => l.get('customFeatureLayer'));
        // destructuring of .features done in createConfigFromIndicator
        if (featureLayer) {
          updateTimeLayer(featureLayer, config[1], this.dataLayerTime, this.drawnArea);
        }
      }
      if (event.data.command === 'map:setCompare') {
        this.enableCompare = event.data.compare;
      }

      if (event.data.command === 'map:setPoi' && event.data.poi) {
        const { poi } = event.data;
        const aoiID = poi.split('-')[0];
        const indicatorCode = poi.split('-')[1];
        const ind = this.indicators.find((f) => f.indicator === indicatorCode) || {};
        if (aoiID !== 'World') {
          // eslint-disable-next-line no-param-reassign
          const objectM = {
            ...ind,
            aoiID,
            disableExtraLoadingData: true,
          };
          // fetching the indicator here outside of App.vue watcher in order to
          // get the features and select the matching one which was clicked in in the Panel
          this.setSelectedIndicator(objectM);
          const indicatorObject = await loadIndicatorData(
            this.baseConfig,
            objectM,
          );
          const currentFeatureObject = indicatorObject.features.find(
            (feat) => feat.id === aoiID,
          );
          // should match if the appConfig is done correctly
          if (currentFeatureObject) {
            const test = {
              indicatorObject: {
                ...indicatorObject,
                geoDBID: currentFeatureObject.properties.indicatorObject.geoDBID,
              },
            };
            this.loadIndicatorFinished(indicatorObject);
            // manually select the feature
            this.setSelectedFeature(test);
          }
        } else {
          this.setSelectedIndicator(ind);
        }
      }

      if (event.data.command === 'map:enableLayer' && event.data.name) {
        const { map } = getMapInstance(this.mapId);
        map.getLayers().getArray().forEach((layerGroup) => {
          layerGroup.getLayers().getArray().forEach((layer) => {
            if (layer.get('name') === event.data.name) {
              layer.setVisible(true);
            }
          });
        });
      }

      if (event.data.command === 'map:disableAllLayers' && event.data.baseLayer) {
        const { map } = getMapInstance(this.mapId);
        map.getLayers().getArray().forEach((layerGroup) => {
          layerGroup.getLayers().getArray().forEach((layer) => {
            if (layer.get('name') !== event.data.baseLayer) {
              layer.setVisible(false);
            } else {
              layer.setVisible(true);
            }
          });
        });
      }

      if (event.data.command === 'app:StacInfoMounted') {
        this.appRightPanelsOpened = true;
      }

      if (event.data.command === 'map:disableLayer' && event.data.name) {
        const { map } = getMapInstance(this.mapId);
        map.getLayers().getArray().forEach((layerGroup) => {
          layerGroup.getLayers().getArray().forEach((layer) => {
            if (layer.get('name') === event.data.name) {
              layer.setVisible(false);
            }
          });
        });
      }

      if (event.data.command === 'map:setCenter' && event.data.center) {
        // Update the state of the application using the message data
        const { map } = getMapInstance(this.mapId);
        const view = map.getView();
        view.setCenter(
          fromLonLat(
            event.data.center,
            map.getView().getProjection(),
          ),
        );
      }

      if (event.data.command === 'map:enableScrolly') {
        const { map } = getMapInstance(this.mapId);
        const view = map.getView();
        this.enableScrollyMode = true;
        this.onScrollyModeChange(true);
        view.setProperties({
          transition: 0,
          constrainResolution: true,
        });
        map.getLayers().forEach((layer) => {
          if (layer.get('name') === event.data.name) {
            layer.set('transition', 0);
          }
        });
      }
    },
    handleSetTimeArray(entries) {
      this.externallySuppliedTimeEntries = entries.map((item) => {
        const obj = {
          value: item,
          name: item,
        };
        return obj;
      });
    },
    indicatorHasMapData() {
      return indicatorHasMapData(this.indicator, this.featureData);
    },
    overlayCallback(headers, rows, coordinate) {
      this.overlayHeaders = headers;
      this.overlayRows = rows;
      this.overlayCoordinate = coordinate;
    },
    setInitialTime() {
      if (this.mergedConfigsData?.length) {
        if (this.dataLayerTimeProp) {
          this.dataLayerTime = this.availableTimeEntries
            .find((item) => item.name === this.dataLayerTimeProp);
        } else if (this.mergedConfigsData[0].selectedTime) {
          this.dataLayerTime = this.availableTimeEntries
            .find((item) => item.name === this.mergedConfigsData[0].selectedTime);
        } else {
          this.dataLayerTime = {
            value: this.mergedConfigsData[0].usedTimes.time[
              this.mergedConfigsData[0].usedTimes.time.length - 1
            ],
          };
        }
        if (this.compareLayerTimeProp) {
          this.compareLayerTime = this.availableTimeEntries
            .find((item) => item.name === this.compareLayerTimeProp);
        }
      }
    },
    updateSelectedAreaFeature(manualTrigger = false) {
      const { map } = getMapInstance(this.mapId);
      const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
      const layers = dataGroup.getLayers().getArray();
      const area = this.drawnArea;
      const time = this.dataLayerTime?.value;
      this.mergedConfigsDataIndexAware.filter(
        (config) => config.mapTimeDatepicker || config.usedTimes?.time?.length,
      )
        .forEach((config) => {
          const layer = layers.find((l) => l.get('name') === config.name);
          const handler = 'updateArea';
          if (layer && layer.getSource().get(handler)) {
            if (manualTrigger) {
              updateTimeLayer(layer, config, time, area, handler);
            } else if (layer instanceof VectorLayer && config.mapTimeDatepicker) {
              // do nothing
            } else {
              updateTimeLayer(layer, config, time, area, handler);
            }
          }
        });
    },
    updateSwipePosition(value) {
      this.swipePixelX = value;
    },
    async onFetchCustomAreaIndicator() {
      // fetching of customIndicator
      // depending on fetch success/failure the map loads data or errors are shown
      // TODO: Extract fetchData method into helper file since it needs to be used from outside.
      if (!this.mergedConfigsData[0]?.areaIndicator) {
        return;
      }
      window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: true }));
      const options = {
        currentTimeIndex: this.currentTimeIndex,
      };
      try {
        const custom = await fetchCustomAreaObjects(
          options,
          this.drawnArea.area,
          this.mergedConfigsData[0],
          this.indicator,
          'areaIndicator',
          this.$store,
        );
        this.$store.commit(
          'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', custom,
        );
        // TODO: Extract fetchData method into helper file since it needs to be used from outside.
        window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
        window.postMessage({
          command: 'chart:setTime',
          time: this.convertDateForMsg(this.dataLayerTime?.value),
        });
        if (this.enableCompare) {
          window.postMessage({
            command: 'chart:setCompareTime',
            time: this.convertDateForMsg(this.compareLayerTime?.value),
          });
        }
      } catch (err) {
        // TODO: Extract fetchData method into helper file since it needs to be used from outside.
        window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
        this.$store.commit(
          'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null,
        );
        console.error(err);
        this.$store.commit('sendAlert', {
          message: `Error requesting data, error message: ${err}.</br>
            If the issue persists, please use the feedback button to let us know.`,
          type: 'error',
        });
      }
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
    onResize() {
      getMapInstance(this.mapId).map.updateSize();
    },
    resetView() {
      let extent = this.zoomExtent;
      if (!extent) {
        const { bounds } = this.mapDefaults;
        extent = transformExtent(bounds, 'EPSG:4326',
          getMapInstance(this.mapId).map.getView().getProjection());
      }
      const padding = calculatePadding();
      getMapInstance(this.mapId).map.getView().fit(extent, {
        duration: 500,
        padding,
      });
    },
    async setupMinesweeper() {
      document.addEventListener('minesweeper:start', this.startMineSweepCounter);
      document.addEventListener('minesweeper:continue', this.continueMineSweepCounter);
      document.addEventListener('minesweeper:win', this.winMineSweep);
      document.addEventListener('minesweeper:gameover', this.gameoverMineSweep);
      document.addEventListener('minesweeper:restart', this.restartMineSweep);

      const { map } = getMapInstance(this.mapId);
      let seedString = new URLSearchParams(window.location.search).get('seed');
      if (!seedString) {
        const date = new Date();
        seedString = date.toDateString();
      }
      const location = this?.minesweeperOptions.locations[
        this.selectedLocationIndex
      ];
      this.minesweeper.spDisplay = this?.minesweeperOptions.enableSpeciesDisplay;
      const bbox = getRandomBoundingBox(location.bbox, location.horizontalExtent, seedString);
      this.minesweeper.bbox = bbox;

      const res = await fetch('./data/europe_and_iceland_country_borders_fixed.geojson');
      const geojson = await res.json();

      const intersections = await findIntersections(bbox, geojson);

      let wasIntersectionFound = intersections.length > 0;

      while (!wasIntersectionFound) {
        const i = 0;
        seedString += `${i}`;
        new URLSearchParams(window.location.search).set('seed', seedString);
        const newBbox = getRandomBoundingBox(location.bbox, location.horizontalExtent, seedString);

        // eslint-disable-next-line
        const newIntersections = await findIntersections(newBbox, geojson);

        if (newIntersections.length > 0) {
          wasIntersectionFound = true;
          this.minesweeper.bbox = newBbox;
        }
      }

      this.minesweeper.game = new Minesweeper(map, {
        ...this.minesweeperOptions,
        bbox: this.minesweeper.bbox,
        selectedLocationIndex: this.selectedLocationIndex,
      });
      this.minesweeper.isEnabled = true;
      this.minesweeper.isDialogEnabled = true;
      const extent = transformExtent(
        this.minesweeper.bbox,
        'EPSG:4326',
        map.getView().getProjection(),
      );
      const padding = calculatePadding();
      map.getView().fit(extent, {
        duration: 500,
        padding,
      });
    },
    tearDownMinesweeper() {
      if (this.minesweeper.game?.vectorLayer) {
        const { map } = getMapInstance(this.mapId);
        map.removeLayer(this.minesweeper.game.vectorLayer);
      }
      if (this.minesweeper.game) {
        this.minesweeper.game.removeEventListeners();
      }
      this.minesweeper.game = null;
      this.minesweeper.isEnabled = false;
      this.minesweeper.isDialogEnabled = false;
      document.removeEventListener('minesweeper:start', this.startMineSweepCounter);
      document.removeEventListener('minesweeper:continue', this.continueMineSweepCounter);
      document.removeEventListener('minesweeper:win', this.winMineSweep);
      document.removeEventListener('minesweeper:gameover', this.gameoverMineSweep);
      document.removeEventListener('minesweeper:restart', this.restartMineSweep);
    },
  },
  beforeDestroy() {
    if (this.mapId === 'centerMap') {
      const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
      cluster.setActive(false, this.overlayCallback);
      this.ro.unobserve(this.$refs.mapContainer);
      getMapInstance(this.mapId).map.removeInteraction(this.queryLink);
    }
    window.removeEventListener(
      'fetch-custom-area-chart',
      this.onFetchCustomAreaIndicator,
    );
    window.removeEventListener('message', this.handleExternalMapMessage);
    this.tearDownMinesweeper();
  },
};
</script>
<style lang="scss" scoped>
  .map-legend {
    position: relative;
    max-width: 15vw;
    transition: max-width 0.5s ease-in-out;
    cursor: pointer;
    float: right;
  }
  .map-legend-expanded {
    width: initial;
    max-width: 80%;
  }

  .controlsContainer {
    top: 0px;
    position: absolute;
    right: 0px;
    min-width: 50px;
    height: 100%;
    pointer-events: none;
    z-index: 4;

    &.hidden {
      opacity: 0 !important;
    }
  }
  .bottomControlsContainer {
    position: absolute;
    right: 4px;
    bottom: 0px;
    min-width: 50px;
    pointer-events: none;
    z-index: 4;

    &.hidden {
      opacity: 0 !important;
    }
  }

  .pointerEvents {
    pointer-events: initial;
  }

  .mouse-container{
    display: none;
  }
  @-moz-document url-prefix() {
    .mouse-container{
    display: inline;
  }
}
  .mouse-container:has(span){
    display: inline;
  }
</style>
