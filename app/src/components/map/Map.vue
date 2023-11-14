<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3;
    z-index: 1" class="d-flex justify-center" :id="mapId">
    <!-- a layer adding a (potential) dark overlay, z-index 4 -->
    <DarkOverlayLayer
      :mapId="mapId"
      :configs="darkOverlayLayers"
      v-if="darkOverlayLayers.length > 0"
      :key="dataLayerName + '_darkoverlay'"
    />
    <!-- a layer adding a (potential) subaoi, z-index 5 -->
    <SubaoiLayer
      :mapId="mapId"
      :indicator="indicator"
      :mergedConfigsData="mergedConfigsData[0]"
      :isGlobal="isGlobalIndicator"
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
    <div
      class="d-flex justify-center fill-height"
      :style="`position: absolute; bottom: 0; left: 0;
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      width: ${panelActive && $vuetify.breakpoint.smAndUp
        ? 'calc(100% - var(--data-panel-width))'
        : '100%'}`"
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
        v-if="displayTimeSelection && !enableScrollyMode"
        :autofocus="!disableAutoFocus && !isInIframe"
        :available-values="availableTimeEntries"
        :indicator="mergedConfigsData[0]"
        :compare-active.sync="enableCompare"
        :compare-time.sync="compareLayerTime"
        :original-time.sync="dataLayerTime"
        :enable-compare="!mergedConfigsData[0].disableCompare"
        :large-time-duration="indicator.largeTimeDuration"
        :key="dataLayerName + '_timeSelection'"
        @focusSelect="focusSelect"
        :style="calculatePosition"
      />
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
      v-if="$vuetify.breakpoint.smAndUp"
      :class="{'move-with-panel': $vuetify.breakpoint.mdAndUp}"
      :style="`position: absolute; z-index: 3; top: 10px; right: 50px;`"
    >
      <img v-if="mergedConfigsData.length > 0 && mergedConfigsData[0].legendUrl"
      :src="mergedConfigsData[0].legendUrl" alt=""
      :class="`map-legend ${$vuetify.breakpoint.xsOnly ? 'map-legend-expanded' :
      (legendExpanded && 'map-legend-expanded')}`"
      @click="legendExpanded = !legendExpanded"
      :style="`background: rgba(255, 255, 255, 0.8);`">
    </div>

    <!-- Container for all controls. Will move when map is resizing -->
    <div
      ref="controlsContainer"
      class="controlsContainer pa-2 d-flex flex-column align-end"
      :class="{'move-with-panel': $vuetify.breakpoint.mdAndUp, 'hidden': enableScrollyMode}"
      :style="$vuetify.breakpoint.xsOnly
        ? `padding-bottom: ${indicator
          ? '36vh'
          : `${$vuetify.application.footer + 10}px`} !important`
        : ''"
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
        v-if="loaded"
        class="pointerEvents"
        :key="layerControlKey"
        :mapId="mapId"
        :baseLayerConfigs="baseLayerConfigs"
        :overlayConfigs="overlayConfigs"
        :dataLayerConfigLayerControls="dataLayerConfigLayerControls"
        :isGlobalIndicator="isGlobalIndicator"
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
      <div
        v-if="$route.name !== 'demo'"
        class="pointerEvents mt-auto mb-2"
      >
        <IframeButton
          v-if="mapId === 'centerMap'
            && indicator
            && indicatorHasMapData(indicator)
            && appConfig.id !== 'gtif'"
          :indicatorObject="indicator"
          :embedMap="true"
          :zoom.sync="currentZoom"
          :center.sync="currentCenter"
          mapControl
        />
      </div>
      <div
        v-if="$route.name !== 'demo'"
        class="pointerEvents mb-2"
      >
        <AddToDashboardButton
          v-if="mapId === 'centerMap'
            && indicator
            && indicatorHasMapData(indicator)
            && (appConfig.id !== 'gtif' || $route.query.customDashboard)"
          :indicatorObject="indicator"
          :zoom.sync="currentZoom"
          :center.sync="currentCenter"
          :datalayertime="dataLayerTime ? dataLayerTime.name :  null"
          :comparelayertime="enableCompare && compareLayerTime ? compareLayerTime.name : null"
          mapControl
        />
      </div>
      <div v-else class="mt-auto">
        <!-- empty div to shift down attribution button if no other buttons present -->
      </div>
      <div ref="mousePositionContainer"/>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';
import LayerControl from '@/components/map/LayerControl.vue';
import FullScreenControl from '@/components/map/FullScreenControl.vue';
import ZoomControl from '@/components/map/ZoomControl.vue';
import getCluster from '@/components/map/Cluster';
import SpecialLayer from '@/components/map/SpecialLayer.vue';
import LayerSwipe from '@/components/map/LayerSwipe.vue';
import CustomAreaButtons from '@/components/map/CustomAreaButtons.vue';
import { getMapInstance } from '@/components/map/map';
import MapOverlay from '@/components/map/MapOverlay.vue';
import IndicatorTimeSelection from '@/components/IndicatorTimeSelection.vue';
import IframeButton from '@/components/IframeButton.vue';
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
import { toStringXY } from 'ol/coordinate';
import { DateTime } from 'luxon';

import SubaoiLayer from '@/components/map/SubaoiLayer.vue';
import DarkOverlayLayer from '@/components/map/DarkOverlayLayer.vue';
import Link from 'ol/interaction/Link';
import {
  loadIndicatorExternalData,
  calculatePadding,
  getIndicatorFilteredInputData,
  findClosest,
} from '@/utils';
import getLocationCode from '../../mixins/getLocationCode';

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
    SubaoiLayer,
    MapOverlay,
    IframeButton,
    AddToDashboardButton,
    DarkOverlayLayer,
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
    panelActive: Boolean,
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
      legendExpanded: false,
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
    };
  },
  computed: {
    ...mapGetters('features', ['getFeatures', 'getFeaturesGtifMap']),
    ...mapState('config', ['appConfig', 'baseConfig']),
    baseLayerConfigs() {
      return (this.mergedConfigsData.length && this.mergedConfigsData[0].baseLayers)
        || this.baseConfig.baseLayersMap;
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    showSpecialLayer() {
      return this.mergedConfigsData.length && this.dataLayerName
      && this.indicatorHasMapData(this.indicator);
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
      return this.externallySuppliedTimeEntries || (this.indicator?.time.length > 1
        && !this.indicator?.disableTimeSelection && this.dataLayerTime
        && this.indicatorHasMapData(this.indicator));
    },
    isGlobalIndicator() {
      return this.$store.state.indicators.selectedIndicator?.siteName === 'global';
    },
    layerControlKey() {
      // re-create all base layers when config changes
      return [...this.baseLayerConfigs, ...this.overlayConfigs].map((c) => c.name).join('');
    },
    indicator() {
      // the current indicator definition object.
      // will use the "currentIndicator"-Prop if defined (dashboard)
      // otherwise it will use the selected indicator from the store
      return getIndicatorFilteredInputData(this.currentIndicator);
    },
    drawnArea() {
      // in store or prop saved as 'object', in this component and
      // in customAreaButtons as {area: 'object'} for convenience
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
        -1, // initial time is last in array - indexed via array.at(-1)
      );
    },
    mergedConfigsLayerSwipe() {
      // only display the "special layers" for global indicators
      if (!this.indicator) {
        return [];
      }
      return createConfigFromIndicator(
        this.indicator,
        'compare',
        this.currentTimeIndexLayerSwipe,
      );
    },
    mergedConfigsDataIndexAware() {
      // just for time update to correctly use current time index
      if (!this.indicator) {
        return [];
      }
      return createConfigFromIndicator(
        this.indicator,
        'data',
        this.currentTimeIndex,
      );
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
    availableTimeEntries() {
      return this.externallySuppliedTimeEntries || createAvailableTimeEntries(
        this.indicator,
        this.mergedConfigsData, // TODO do we really need to pass the config here?
      );
    },
    dataLayerName() {
      let dataLayerName;
      if (this.mergedConfigsData?.length) {
        dataLayerName = this.mergedConfigsData[0].name;
      }
      return dataLayerName || '';
    },
    dataLayerKey() {
      return this.dataLayerName + this.indicator.aoiID + this.indicator.indicator;
    },
    // extent to be zoomed to. Padding will be applied.
    zoomExtent() {
      if ((this.centerProp && this.zoomProp)
          || (!this.indicator?.subAoi?.features && !this.mergedConfigsData[0]?.presetView)) {
        return null;
      }
      if (this.$route.name === 'demo') {
        // check if a demo item custom extent is set as override
        const demoItem = this.appConfig.demoMode[this.$route.query.event]
          .find((item) => item.poi === getLocationCode(this.indicator));
        if (demoItem && demoItem.extent) {
          return demoItem.extent;
        }
      }
      const presetView = this.mergedConfigsData[0]?.presetView;
      const { map } = getMapInstance(this.mapId);
      const readerOptions = {
        dataProjection: 'EPSG:4326',
        featureProjection: map.getView().getProjection(),
      };
      if (presetView) {
        // pre-defined geojson view
        const presetViewGeom = geoJsonFormat.readGeometry(
          presetView.features[0].geometry, readerOptions,
        );
        return presetViewGeom.getExtent();
      }
      const { subAoi } = this.indicator;
      if (subAoi && subAoi.features.length) {
        if (subAoi.features[0].geometry.coordinates.length) {
          const subAoiGeom = geoJsonFormat.readGeometry(subAoi.features[0].geometry, readerOptions);
          return subAoiGeom.getExtent();
        }
        // geoJsonFormat
        return [];
      }
      if (this.indicator.aoi) {
        return transformExtent([this.indicator.lng, this.indicator.lat,
          this.indicator.lng, this.indicator.lat],
        'EPSG:4326',
        map.getView().getProjection());
      }
      return undefined;
    },
    isInIframe() {
      return window.self !== window.top;
    },
    calculatePosition() {
      let position = 'bottom: 155px';
      if (this.mapId === 'centerMap'
        && this.$vuetify.breakpoint.smAndUp && this.$route.name !== 'demo') {
        position = 'bottom: 155px';
      }
      if (this.mapId === 'centerMap'
        && this.$vuetify.breakpoint.smAndUp && this.appConfig.enableESALayout) {
        position = 'bottom: 80px';
      }
      return position;
    },
  },
  watch: {
    getFeatures(features) {
      if (this.appConfig.id === 'gtif') {
        return;
      }
      if (this.mapId === 'centerMap' && features) {
        const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
        cluster.setFeatures(features);
      }
    },
    getFeaturesGtifMap(features) {
      if (this.appConfig.id !== 'gtif') {
        return;
      }
      if (this.mapId === 'centerMap') {
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
        if (timeObj) {
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
            (config) => config.timeFromProperty || config.usedTimes?.time?.length,
          )
            .forEach((config) => {
              const layer = layers.find((l) => l.get('name') === config.name);
              if (layer) {
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
            this.$emit('update:comparelayertime', enabled ? this.compareLayerTime.name : null);
          });
        });
      } else {
        this.$emit('update:comparelayertime', enabled ? this.compareLayerTime.name : null);
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
      if (timeObj && this.enableCompare) {
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
      deep: true,
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
          if (map.getTargetElement()) {
            const padding = calculatePadding();
            // clear race condition of original view and possibly new view with new projection
            if (this.viewZoomExtentFitId) {
              clearTimeout(this.viewZoomExtentFitId);
            }
            this.viewZoomExtentFitId = setTimeout(() => {
              map.getView().fit(value, { duration: 500, padding });
            }, 30);
          } else {
            map.once('change:target', () => {
              map.getView().fit(value);
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
      if (this.appConfig.id === 'gtif') {
        cluster.setFeatures(this.getFeaturesGtifMap);
      } else {
        cluster.setFeatures(this.getFeatures);
      }
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
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'indicators/INDICATOR_LOAD_FINISHED') {
        if (this.mapId === 'centerMap') {
          const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
          cluster.reRender();
          if (this.$refs.timeSelection) {
            this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
          }
          if (this.appConfig.id !== 'gtif') {
            cluster.clusters.setVisible(!this.indicatorHasMapData(mutation.payload));
          }
        }
      }
    });
    map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
    // adding a necessary reference for eox-layercontrol plugin
    this.$refs.mapContainer.map = map;

    const attributions = new Attribution();
    attributions.setTarget(this.$refs.controlsContainer);
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
      view.setCenter(
        fromLonLat(
          [this.centerProp.lng, this.centerProp.lat], map.getView().getProjection(),
        ),
      );
      view.setZoom(this.zoomProp);
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
  },
  methods: {
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
    updateTime(time, compare) {
      // Define a function to update the data layer
      // direct match on name
      let timeEntry = this.availableTimeEntries.find((e) => e.name === time);
      if (timeEntry === undefined && time.isLuxonDateTime) {
        // search for closest time to datetime if provided as such
        const searchTimes = this.availableTimeEntries.map((e) => {
          if (e.value?.isLuxonDateTime) {
            return e.value;
          }
          return DateTime.fromISO(e.value);
        });
        const closestTime = findClosest(searchTimes, time);
        // get back the original unmapped object with value and name
        timeEntry = this.availableTimeEntries.find((e) => {
          if (e.value?.isLuxonDateTime) {
            return e.value.ts === closestTime.ts;
          }
          return DateTime.fromISO(e.value).ts === closestTime.ts;
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
    handleExternalMapMessage(event) {
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

      if (event.data.command === 'map:setPoi' && event.data.poi) {
        const { poi } = event.data;
        const aoiID = poi.split('-')[0];
        const indicatorCode = poi.split('-')[1];

        const selectedFeature = this.$store.state.features.allFeatures.find((f) => {
          const { indicatorObject } = f.properties;
          return indicatorObject.aoiID === aoiID
            && indicatorObject.indicator === indicatorCode;
        });

        this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature
          ? selectedFeature.properties.indicatorObject
          : null);
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
    indicatorHasMapData(indicatorObject) {
      return indicatorHasMapData(indicatorObject);
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
    updateSelectedAreaFeature() {
      const { map } = getMapInstance(this.mapId);
      const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
      const layers = dataGroup.getLayers().getArray();
      const area = this.drawnArea;
      const time = this.dataLayerTime?.value;
      this.mergedConfigsDataIndexAware.filter((config) => config.usedTimes?.time?.length)
        .forEach((config) => {
          const layer = layers.find((l) => l.get('name') === config.name);
          if (layer) {
            updateTimeLayer(layer, config, time, area, 'updateArea');
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

      try {
        const custom = await fetchCustomAreaObjects(
          {},
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

  .controlsContainer {
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

  .pointerEvents {
    pointer-events: initial;
  }
</style>
