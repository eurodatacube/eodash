<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; background: #cad2d3;
    z-index: 1" class="d-flex justify-center">
    <!-- a layer adding a (potential) subaoi, z-index 5 -->
    <SubaoiLayer
      :mapId="mapId"
      :indicator="indicator"
      :isGlobal="isGlobalIndicator"
      v-if="dataLayerName"
      :key="dataLayerKey + '_subAoi'"
    />
    <!-- a layer displaying a selected global poi
     these layers will have z-Index 3 -->
    <SpecialLayer
      v-if="mergedConfigsData.length && dataLayerName && indicatorHasMapData(indicator)"
      :mapId="mapId"
      :mergedConfig="mergedConfigsData[0]"
      :layerName="dataLayerName"
      :options="specialLayerOptions"
      :key="dataLayerKey  + '_specialLayer'"
      :swipePixelX="swipePixelX"
    />
    <!-- compare layer has same zIndex as specialLayer -->
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
        :mergedConfigsData="mergedConfigsData[0]"
        :specialLayerOptionProps="specialLayerOptions"
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
        :enable-compare="!mergedConfigsData[0].disableCompare"
        :large-time-duration="indicator.largeTimeDuration"
        :key="dataLayerName + '_timeSelection'"
        @focusSelect="focusSelect"
        :style="mapId === 'centerMap' && $vuetify.breakpoint.smAndUp ? 'bottom: 155px' : ''"
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
      class="move-with-panel"
      :style="`position: absolute; z-index: 7; top: 10px; right: 50px;`"
    >
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

    <!-- Container for all controls. Will move when map is resizing -->
    <div ref="controlsContainer" class="controlsContainer move-with-panel pa-2
      d-flex flex-column align-end"
      :style="$vuetify.breakpoint.xsOnly
        ? `padding-bottom: ${indicator
          ? '36vh'
          : `${$vuetify.application.footer + 10}px`} !important`
        : ''"
    >
      <FullScreenControl v-if="mapId !== 'centerMap'" :mapId="mapId" class="pointerEvents"/>
      <ZoomControl :mapId="mapId" class="pointerEvents" />
      <!-- overlay-layers have zIndex 2 and 4, base layers have 0 -->
      <LayerControl
        v-if="loaded"
        class="pointerEvents"
        :key="layerControlKey"
        :mapId="mapId"
        :baseLayerConfigs="baseLayerConfigs"
        :overlayConfigs="overlayConfigs"
        :isGlobalIndicator="isGlobalIndicator"
      />
      <!-- will add a drawing layer to the map (z-index 3) -->
      <CustomAreaButtons
        v-if="loaded && mapId === 'centerMap'"
        class="pointerEvents"
        :mapId="mapId"
        :mergedConfigsData="mergedConfigsData[0]"
        :hideCustomAreaControls="hideCustomAreaControls"
        @fetchCustomAreaIndicator="onFetchCustomAreaIndicator"
        :key="dataLayerName  + '_customArea'"
        :drawnArea.sync="drawnArea"
        :loading.sync="customAreaLoading"
      />
      <div class="pointerEvents mt-auto mb-2">
        <IframeButton
          v-if="mapId === 'centerMap' && indicator"
          :indicatorObject="indicator"
          mapControl
        />
      </div>
      <div class="pointerEvents mb-2">
        <AddToDashboardButton
          v-if="mapId === 'centerMap' && indicator"
          :indicatorObject="indicator"
          :zoom="currentZoom"
          :center="currentCenter"
          :datalayertime="dataLayerTime ? dataLayerTime.name :  null"
          :comparelayertime="enableCompare && compareLayerTime ? compareLayerTime.name : null"
          mapControl
        />
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
import getMapInstance from '@/components/map/map';
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
import fetchCustomAreaObjects from '@/helpers/customAreaObjects';
import Attribution from 'ol/control/Attribution';
import MousePosition from 'ol/control/MousePosition';
import { toStringXY } from 'ol/coordinate';
import SubaoiLayer from '@/components/map/SubaoiLayer.vue';
import Link from 'ol/interaction/Link';
import {
  calculatePadding,
  getIndicatorFilteredInputData,
} from '@/utils';

const DEFAULT_PROJECTION = 'EPSG:3857';
const geoJsonFormat = new GeoJSON({
  featureProjection: DEFAULT_PROJECTION,
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
    hideCustomAreaControls: {
      required: false,
    },
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
  },
  data() {
    return {
      loaded: false,
      zoom: 3,
      tooltip: {
        city: '',
        indicator: '',
        description: '',
      },
      currentZoom: null,
      currentCenter: null,
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
      queryLink: null,
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
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
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
        && !this.indicator?.disableTimeSelection && this.dataLayerTime
        && this.indicatorHasMapData(this.indicator);
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
        0,
      );
    },
    /**
     * optional options for special layer.
     */
    specialLayerOptions() {
      return {
        // time: this.dataLayerTimeProp || this.dataLayerTime,
        time: this.dataLayerTimeProp || this.dataLayerTime.value,
        indicator: this.indicator?.indicator,
        aoiId: this.indicator?.aoiID || this.indicator?.aoiId, // to do: check this discrepency
      };
    },
    availableTimeEntries() {
      return createAvailableTimeEntries(
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
    countriesJson() {
      return countries;
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
    // extent to be zoomed to. Padding will be applied.
    zoomExtent() {
      if ((this.centerProp && this.zoomProp)
          || (!this.indicator?.subAoi?.features && !this.mergedConfigsData[0]?.presetView)) {
        return null;
      }
      const presetView = this.mergedConfigsData[0]?.presetView;
      if (presetView) {
        // pre-defined geojson view
        const presetViewGeom = geoJsonFormat.readGeometry(presetView.features[0].geometry);
        return presetViewGeom.getExtent();
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
      if (this.indicator.aoi) {
        return transformExtent([this.indicator.lng, this.indicator.lat,
          this.indicator.lng, this.indicator.lat],
        'EPSG:4326',
        DEFAULT_PROJECTION);
      }
      return undefined;
    },
  },
  watch: {
    getFeatures(features) {
      if (this.mapId === 'centerMap' && features) {
        const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
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
    dataLayerTime(timeObj) {
      if (timeObj) {
        // redraw all time-dependant layers, if time is passed via WMS params
        const { map } = getMapInstance(this.mapId);
        const layers = map.getLayers().getArray();

        this.mergedConfigsData.filter((config) => config.usedTimes?.time?.length)
          .forEach((config) => {
            const layer = layers.find((l) => l.get('name') === config.name);
            if (layer) {
              updateTimeLayer(layer, config, timeObj.value);
            }
          });
        this.$emit('update:datalayertime', timeObj.name);
      }
    },
    enableCompare(enabled) {
      this.$emit('update:comparelayertime', enabled ? this.compareLayerTime.name : null);
    },
    compareLayerTime(timeObj) {
      this.$emit('update:comparelayertime', this.enableCompare ? timeObj.name : null);
    },
    displayTimeSelection(value) {
      if (!value) {
        this.enableCompare = false;
      }
    },
    drawnArea() {
      // this.updateSelectedAreaFeature();
    },
    dataLayerTimeProp: {
      immediate: true,
      deep: true,
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
      handler(value) {
        // when the calculated zoom extent changes, zoom the map to the new extent.
        // this is purely cosmetic and does not limit the ability to pan or zoom
        // paddings are calculated globally for the view.
        if (value && !(this.centerProp || this.zoomProp)) {
          const { map } = getMapInstance(this.mapId);
          if (map.getTargetElement()) {
            const padding = calculatePadding();
            setTimeout(() => {
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
      cluster.setFeatures(this.getFeatures);
      const { x, y, z } = this.$route.query;
      if (!x && !y && !z) {
        setTimeout(() => {
          const { bounds } = this.mapDefaults;
          const extent = transformExtent([bounds._southWest.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._northEast.lat], 'EPSG:4326',
            DEFAULT_PROJECTION);
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
          cluster.clusters.setVisible(!this.indicatorHasMapData(mutation.payload));
        }
      }
    });
    map.setTarget(/** @type {HTMLElement} */ (this.$refs.mapContainer));
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
      const center = toLonLat(evt.target.getCenter());
      this.currentCenter = { lng: center[0], lat: center[1] };
      // these events are emitted to save changed made in the dashboard via the
      // "save map configuration" button
      this.$emit('update:center', this.currentCenter);
      this.$emit('update:zoom', this.currentZoom);
    });
    if (this.centerProp && this.zoomProp) {
      view.setCenter(fromLonLat([this.centerProp.lng, this.centerProp.lat]));
      view.setZoom(this.zoomProp);
    }
    this.$emit('ready', true);

    this.ro = new ResizeObserver(this.onResize);
    this.ro.observe(this.$refs.mapContainer);
    // Fetch data for custom chart if the event is fired.
    // TODO: Extract fetchData method into helper file since it needs to be used from outside.
    window.addEventListener(
      'fetch-custom-area-chart',
      () => this.fetchData({ type: 'customIndicator' }),
      false,
    );
    if (this.mapId === 'centerMap') {
      this.queryLink = new Link({ replace: true, params: ['x', 'y', 'z'] });
      map.addInteraction(this.queryLink);
    }
  },
  methods: {
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
        this.dataLayerTime = {
          value: this.mergedConfigsData[0].usedTimes.time[
            this.mergedConfigsData[0].usedTimes.time.length - 1
          ],
        };
      }
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
      const paramsToPassThrough = ['env'];
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

      if (type === 'customFeatures') {
        this.customAreaLoading = true;
      }

      // TODO: Extract fetchData method into helper file since it needs to be used from outside.
      window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: true }));

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
        // TODO: Extract fetchData method into helper file since it needs to be used from outside.
        window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
      } catch (err) {
        this.customAreaLoading = false;
        // TODO: Extract fetchData method into helper file since it needs to be used from outside.
        window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
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
    onResize() {
      getMapInstance(this.mapId).map.updateSize();
    },
  },
  beforeDestroy() {
    if (this.mapId === 'centerMap') {
      const cluster = getCluster(this.mapId, { vm: this, mapId: this.mapId });
      cluster.setActive(false, this.overlayCallback);
      this.ro.unobserve(this.$refs.mapContainer);
      getMapInstance(this.mapId).map.removeInteraction(this.queryLink);
    }
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
  }

  .pointerEvents {
    pointer-events: initial;
  }
</style>
