<template>
  <div ref="container" style="height: 100%; width: 100%;">
    <l-map
      ref="map"
      style="height: 100%; width: 100%; background: #cad2d3; z-index: 1;"
      :options="defaultMapOptions"
      :maxZoom="mapDefaults.maxMapZoom"
      :minZoom="mapDefaults.minMapZoom"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      v-resize="onResize"
      :center="center"
      :zoom="zoom"
      @ready="onMapReady()"
    >
      <l-control-zoom position="topright"></l-control-zoom>
      <l-feature-group ref="customAreaFilterFeatures"></l-feature-group>
      <l-control position="topright"
        v-if="customAreaFilter && validDrawnArea && renderTrashBin">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                color="error"
                x-small
                fab
                class="pa-0"
                :style="`${$vuetify.breakpoint.mdAndDown
                  ? 'width: 30px; height: 30px;'
                  : 'width: 26px; height: 26px;'} border-radius: 4px`"
                @click="clearCustomAreaFilter"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
            <span>Clear selection</span>
        </v-tooltip>
      </l-control>
      <l-control position="topright"
        v-if="mergedConfigsData[0].customAreaIndicator && validDrawnArea && renderTrashBin">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block"
            :style="`border: 3px solid ${appConfig.branding.primaryColor};
            border-radius: 6px;`">
              <v-btn
                color="white"
                x-small
                fab
                depressed
                class="pa-0"
                :style="`${$vuetify.breakpoint.mdAndDown
                  ? 'width: 36px; height: 36px;'
                  : 'width: 30px; height: 30px;'}
                  border-radius: 4px;
                  color: ${appConfig.branding.primaryColor};`"
                @click="fetchCustomAreaIndicator"
              >
                <v-icon small>mdi-poll</v-icon>
              </v-btn>
            </div>
          </template>
            <span>Draw chart from sub-area</span>
        </v-tooltip>
      </l-control>
      <LTileLayer
        v-for="layer in baseLayers.filter(b => b.protocol === 'xyz')"
        v-bind="layer"
        ref="baseLayers"
        layer-type="base"
        :key="layer.name"
        :opacity="opacityTerrain[zoom]"
        :options="layerOptions(null, layer)"
      >
      </LTileLayer>
      <LWMSTileLayer
        v-for="layer in baseLayers.filter(b => b.protocol === 'WMS')"
        :key="layer.name"
        v-bind="layer"
        :options="layerOptions(null, layer)"
        layer-type="base"
      >
      </LWMSTileLayer>
      <l-geo-json
      :geojson="subAoiInverse"
      :pane="popupPane"
      layer-type="overlay"
      name='Reference area overlay'
      :optionsStyle="subAoiInverseStyle"
      >
      </l-geo-json>
      <l-layer-group ref="dataLayers">
        <l-geo-json
        :geojson="indicator.subAoi"
        :pane="tooltipPane"
        :optionsStyle="subAoiStyle('data')"
        >
        </l-geo-json>
        <l-marker-cluster v-if="mergedConfigsData[0].featuresClustering"
          ref="featuresDataCluster"
          :options="clusterOptions"
          >
        </l-marker-cluster>
        <l-geo-json
            v-else-if="dataJson.features"
            ref="featureJsonData"
            :geojson="dataJson.features"
            :options="featureOptions('data')"
            :pane="tooltipPane"
            :key="dataJsonKey"
          >
        </l-geo-json>
        <l-circle-marker
          v-if="showAoi"
          :lat-lng="aoi"
          :radius="12"
          :color="appConfig.branding.primaryColor"
          :weight="2"
          :dashArray="'3'"
          :fill="true"
          :fillColor="aoiFillStyle('data')"
          :fillOpacity="1"
          :pane="tooltipPane"
        >
        </l-circle-marker>
        <!-- XYZ grouping is not implemented yet -->
        <template v-if="dataLayerTime && dataSearchId">
          <LTileLayer
          v-for="(layerConfig, i) in mergedConfigsData.filter(l => l.protocol === 'xyz')"
            ref="dataLayerArrayXYZ"
            :data-key-originalindex="i"
            :key="dataLayerKeyXYZ[i]"
            v-bind="layerConfig"
            :options="layerOptions(dataLayerTime, layerConfig)"
            :pane="overlayPane"
            layer-type="overlay"
          >
          </LTileLayer>
        </template>
        <template v-if="dataLayerTime && getCombinedWMSLayers().length > 0">
          <l-layer-group ref="dataLayerArrayWMS">
            <l-layer-group
            v-for="combLayer in this.getCombinedWMSLayers()"
              :key="combLayer.name"
              :name="combLayer.name"
              layer-type="overlay"
            >
              <LWMSTileLayer
              v-for="cLayerConfig in combLayer.combinedLayers"
                :key="cLayerConfig.name"
                v-bind="cLayerConfig"
                :options="layerOptions(dataLayerTime, cLayerConfig)"
                :pane="overlayPane"
              >
              </LWMSTileLayer>
            </l-layer-group>
            <LWMSTileLayer
            v-for="layerConfig in this.getSimpleWMSLayers()"
              :key="layerConfig.name"
              v-bind="layerConfig"
              :options="layerOptions(dataLayerTime, layerConfig)"
              :pane="overlayPane"
              layer-type="overlay"
            >
            </LWMSTileLayer>
          </l-layer-group>
        </template>
        <template v-else-if="dataLayerTime">
          <LWMSTileLayer
          v-for="layerConfig in this.getSimpleWMSLayers()"
            ref="dataLayerArrayWMS"
            :key="layerConfig.name"
            v-bind="layerConfig"
            :options="layerOptions(dataLayerTime, layerConfig)"
            :pane="overlayPane"
            layer-type="overlay"
          >
          </LWMSTileLayer>
        </template>
      </l-layer-group>
      <l-layer-group ref="compareLayers">
        <!-- XYZ grouping is not implemented yet -->
        <template v-if="compareLayerTime && compareSearchId">
          <LTileLayer
          v-for="(layerConfig, i) in mergedConfigsCompare.filter(l => l.protocol === 'xyz')"
            ref="compareLayerArrayXYZ"
            :data-key-originalindex="i"
            :key="compareLayerKeyXYZ[i]"
            v-bind="layerConfig"
            :visible="enableCompare"
            :options="layerOptions(compareLayerTime, layerConfig)"
            :pane="overlayPane"
          >
          </LTileLayer>
        </template>
        <template v-if="compareLayerTime && getCombinedWMSLayers('compare').length > 0">
          <l-layer-group ref="compareLayerArrayWMS">
            <l-layer-group
            v-for="combLayer in this.getCombinedWMSLayers('compare')"
              :key="combLayer.name"
            >
              <LWMSTileLayer
              v-for="cLayerConfig in combLayer.combinedLayers"
                :key="cLayerConfig.name"
                v-bind="cLayerConfig"
                :visible="enableCompare"
                :options="layerOptions(compareLayerTime, cLayerConfig)"
                :pane="overlayPane"
              >
              </LWMSTileLayer>
            </l-layer-group>
            <LWMSTileLayer
            v-for="layerConfig in this.getSimpleWMSLayers('compare')"
              :key="layerConfig.name"
              v-bind="layerConfig"
              :visible="enableCompare"
              :options="layerOptions(compareLayerTime, layerConfig)"
              :pane="overlayPane"
            >
            </LWMSTileLayer>
          </l-layer-group>
        </template>
        <template v-else-if="compareLayerTime">
          <LWMSTileLayer
          v-for="layerConfig in this.getSimpleWMSLayers('compare')"
            ref="compareLayerArrayWMS"
            :key="layerConfig.name"
            v-bind="layerConfig"
            :visible="enableCompare"
            :options="layerOptions(compareLayerTime, layerConfig)"
            :pane="overlayPane"
          >
          </LWMSTileLayer>
        </template>
        <l-geo-json
          :geojson="indicator.subAoi"
          :pane="shadowPane"
          :visible="enableCompare"
          :optionsStyle="subAoiStyle('compare')"
        >
        </l-geo-json>
        <l-marker-cluster v-if="mergedConfigsData[0].featuresClustering"
          ref="featuresCompareCluster" :options="clusterOptions">
        </l-marker-cluster>
        <l-geo-json
          v-else-if="compareJson.features"
          ref="featureJsonCompare"
          :visible="enableCompare"
          :geojson="compareJson.features"
          :options="featureOptions('compare')"
          :pane="shadowPane"
          :key="compareJsonKey"
        >
        </l-geo-json>
        <l-circle-marker
          v-if="showAoi"
          :lat-lng="aoi"
          :visible="enableCompare"
          :radius="12"
          :color="appConfig.branding.primaryColor"
          :weight="2"
          :dashArray="3"
          :fill="true"
          :fillColor="aoiFillStyle('compare')"
          :fillOpacity="1"
          :pane="shadowPane"
        >
        </l-circle-marker>
      </l-layer-group>
      <l-layer-group ref="overlayLayers" v-if="!countrySelection">
        <LTileLayer
          v-for="layer in overlayLayers.filter(b => b.protocol === 'xyz')"
          :key="layer.name"
          v-bind="layer"
          :pane="markerPane"
          :opacity="opacityOverlay[zoom]"
          :options="layerOptions(null, layer)"
          layer-type="overlay"
        >
        </LTileLayer>
        <LWMSTileLayer
          v-for="layer in overlayLayers.filter(b => b.protocol === 'WMS')"
          v-bind="layer"
          :key="layer.name"
          :options="layerOptions(null, layer)"
          :pane="markerPane"
          :opacity="opacityOverlay[zoom]"
          layer-type="overlay"
        >
        </LWMSTileLayer>
      </l-layer-group>
      <l-geo-json
      v-if="countrySelection"
      :geojson="countriesJson"
      :optionsStyle="countriesStyle"
      :options="countriesOptions()"
      name="Country vectors"
      layer-type="overlay"
      >
      </l-geo-json>
      <l-feature-group ref="gsaLayer"
        v-if="borderSelection">
        <l-circle-marker v-for="(feature) in gsaJson"
          :key="feature.id"
          ref="markers"
          :lat-lng="feature.AOI.split(',').map(Number)"
          :name="feature.name"
          color="#fff"
          :radius="selectedBorder === feature.borderId ? 6 : 4"
          :fillColor="selectedBorder === feature.borderId ?
            appConfig.branding.secondaryColor : appConfig.branding.primaryColor"
          :weight="selectedBorder === feature.borderId ? 2 : 1"
          :opacity="selectedBorder === feature.borderId ? 1.0 : 0.8"
          :fillOpacity="selectedBorder === feature.borderId ? 1.0 : 0.9"
          @click="selectGSAIndicator(feature)"
        >
        <l-tooltip class="tooltip text-center" :options="{ direction: 'top' }">
            <p class="ma-0">
              <strong>{{ feature.name }}</strong>
            </p>
          </l-tooltip>
        </l-circle-marker>
      </l-feature-group>
      <div
      :style="`position: absolute; z-index: 700; top: 10px; left: 10px;`">
        <img v-if="mergedConfigsData[0].legendUrl"
        :src="mergedConfigsData[0].legendUrl" alt=""
        :class="`map-legend ${$vuetify.breakpoint.xsOnly ? 'map-legend-expanded' :
        (legendExpanded && 'map-legend-expanded')}`"
        @click="legendExpanded = !legendExpanded"
        :style="`background: rgba(255, 255, 255, 0.8);`">
        <div
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
        </div>
      </div>
      <div
        class="d-flex justify-center"
        style="position: relative; width: 100%; height: 100%;"
        @click.stop=""
        @dblclick.stop=""
      >
        <h3 :class="`brand-${appConfig.id} px-3 py-1`"
          v-if="enableCompare && indicator.compareDisplay && indicator.compareDisplay.mapLabel"
          style="position:absolute; z-index:1000; right: 0px; bottom: 45%;
          background: rgba(255, 255, 255, 0.6); font-size: 16px; pointer-events: none;">
            {{indicator.display.mapLabel}}
        </h3>
        <h3 :class="`brand-${appConfig.id} px-3 py-1`"
          v-if="enableCompare && indicator.compareDisplay && indicator.display.mapLabel"
          style="position:absolute; z-index:1000; left: 0px; bottom: 45%;
          background: rgba(255, 255, 255, 0.6); font-size: 16px; pointer-events: none;">
            {{indicator.compareDisplay.mapLabel}}
        </h3>
        <indicator-time-selection
          ref="timeSelection"
          v-if="dataLayerTime && !mergedConfigsData[0].disableTimeSelection"
          :autofocus="!disableAutoFocus"
          :available-values="availableTimeEntries"
          :indicator="indicator"
          :compare-active.sync="enableCompare"
          :compare-time.sync="compareLayerTime"
          :original-time.sync="dataLayerTime"
          :enable-compare="!mergedConfigsData[0].disableCompare"
          :large-time-duration="mergedConfigsData[0].largeTimeDuration"
          @focusSelect="focusSelect"
        />
      </div>
      <l-control-attribution position="bottomright" prefix=''></l-control-attribution>
      <l-control-layers position="topright" ref="layersControl"></l-control-layers>
    </l-map>
  </div>
</template>

<script>
// Utilities
import {
  mapState,
  mapGetters,
} from 'vuex';
import {
  geoJson, latLngBounds, latLng, circleMarker, DivIcon, Point,
} from 'leaflet';
import {
  LMap, LTileLayer, LWMSTileLayer, LGeoJson, LCircleMarker,
  LControlLayers, LControlAttribution, LControlZoom, LLayerGroup,
  LFeatureGroup, LControl, LTooltip,
} from 'vue2-leaflet';
import { DateTime } from 'luxon'; // TODO: MIGRATE
import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import 'leaflet-mouse-position';
import 'leaflet-side-by-side';
import 'leaflet-loading';
import 'leaflet-loading/src/Control.Loading.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // eslint-disable-line import/no-extraneous-dependencies
import turfDifference from '@turf/difference';

import countries from '@/assets/countries.json';
import gsaFile from '@/assets/gsa_data.json';

import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
} from '@/helpers/mapConfig';
import fetchCustomAreaObjects from '@/helpers/customAreaObjects';
import IndicatorTimeSelection from './IndicatorTimeSelection.vue';

const emptyF = {
  type: 'FeatureCollection',
  features: [],
};

export default {
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
    LMap,
    LTileLayer,
    LWMSTileLayer,
    LGeoJson,
    LCircleMarker,
    LControlLayers,
    LControlAttribution,
    LControlZoom,
    LLayerGroup,
    LFeatureGroup,
    LControl,
    LTooltip,
    'l-marker-cluster': Vue2LeafletMarkerCluster,
    IndicatorTimeSelection,
  },
  data() {
    return {
      map: null,
      compareLayerKeyXYZ: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      dataLayerKeyXYZ: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
      dataJsonKey: 0,
      compareJsonKey: -1,
      zoom: null,
      center: null,
      bounds: null,
      enableCompare: false,
      opacityTerrain: [1],
      opacityOverlay: [1],
      tilePane: 'tilePane',
      overlayPane: 'overlayPane',
      markerPane: 'markerPane',
      shadowPane: 'shadowPane',
      tooltipPane: 'tooltipPane',
      popupPane: 'popupPane',
      legendExpanded: false,
      slider: null,
      drawControl: null,
      renderTrashBin: false,
      defaultMapOptions: {
        attributionControl: false,
        zoomControl: false,
      },
      dataLayerTime: null,
      compareLayerTime: null,
      dataLayerIndex: 0,
      compareLayerIndex: 0,
      dataFeaturesCount: 0,
      compareFeaturesCount: 0,
      selectedCountry: null,
      selectedBorder: null,
      selectedLayer: null,
      ro: null,
      dataJson: { features: null },
      compareJson: { features: null },
      dataSearchId: null,
      compareSearchId: null,
    };
  },
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapGetters('indicators', [
      'getIndicatorFilteredInputData',
    ]),
    countriesJson() {
      return countries;
    },
    gsaJson() {
      return gsaFile;
    },
    countriesStyle() {
      return {
        color: '#222',
        weight: 1,
        fillColor: '#fff',
        opacity: 1,
        fillOpacity: 0.5,
      };
    },
    subAoiInverseStyle() {
      return {
        stroke: false,
        fillColor: this.getIndicatorColor('primary'),
        fillOpacity: this.mergedConfigsData[0].subAoiFillOpacity || 0.5,
      };
    },
    baseLayers() {
      // expects an array of objects
      return this.mergedConfigsData[0].baseLayers || this.baseConfig.baseLayersRightMap;
    },
    overlayLayers() {
      return this.mergedConfigsData[0].overlayLayers || this.baseConfig.overlayLayersRightMap;
    },
    mapDefaults() {
      return {
        ...this.baseConfig.mapDefaults,
        ...this.mergedConfigsData[0],
      };
    },
    countrySelection() {
      return this.mergedConfigsData[0].countrySelection;
    },
    borderSelection() {
      return this.mergedConfigsData[0].borderSelection;
    },
    indicator() {
      return this.getIndicatorFilteredInputData(this.currentIndicator);
    },
    showAoi() {
      return this.aoi && (!this.subAoi || this.subAoi.features.length === 0);
    },
    validDrawnArea() {
      // allows for further validation on area size etc.
      return this.drawnArea !== null;
    },
    drawnArea() {
      return this.$store.state.features.selectedArea;
    },
    customAreaFilter() {
      return this.mergedConfigsData[0].customAreaFeatures
        || this.mergedConfigsData[0].customAreaIndicator;
    },
    mergedConfigsData() {
      return createConfigFromIndicator(
        this.indicator,
        'data',
        this.getCurrentIndex('data'),
        this.dataSearchId, // Only passed to make sure mergedConfigs are updated
      );
    },
    mergedConfigsCompare() {
      return createConfigFromIndicator(
        this.indicator,
        'compare',
        this.getCurrentIndex('compare'),
        this.compareSearchId, // Only passed to make sure mergedConfigs are updated
      );
    },
    availableTimeEntries() {
      return createAvailableTimeEntries(
        this.indicator,
        this.mergedConfigsData, // TODO do we really need to pass the config here?
      );
    },
    aoi() {
      return this.indicator.aoi;
    },
    subAoi() {
      return this.indicator.subAoi;
    },
    subAoiInverse() {
      // create an inverse of subaoi, using difference of whole world and subaoi
      const subaoiInv = JSON.parse(JSON.stringify(this.subAoi));
      // both Object.assign({}, this.subAoi) and { ...this.subAoi } create shallow copy
      if (subaoiInv.features.length === 1) {
        const globalBox = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
          },
        };
        const diff = turfDifference(globalBox, subaoiInv.features[0]);
        subaoiInv.features[0] = diff;
      }
      return subaoiInv;
    },
    clusterOptions() {
      return {
        disableClusteringAtZoom: 13,
        animate: false,
        // zoomToBoundsOnClick: false,
        iconCreateFunction(cluster) { // eslint-disable-line func-names
          // modified selected cluster style
          const childCount = cluster.getChildCount();
          return new DivIcon({
            html: `<div><span>${childCount}</span></div>`,
            className: 'marker-cluster',
            iconSize: new Point(40, 40),
          });
        },
        polygonOptions: {
          fillColor: this.appConfig.branding.primaryColor,
          color: this.appConfig.branding.primaryColor,
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.3,
          dashArray: 4,
        },
      };
    },
    drawOptions() {
      return {
        position: 'topright',
        draw: {
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false,
          polygon: {
            shapeOptions: {
              color: this.appConfig.branding.primaryColor,
            },
          },
          rectangle: {
            showArea: false,
            shapeOptions: {
              color: this.appConfig.branding.primaryColor,
            },
          },
        },
      };
    },
  },
  mounted() {
    if (!this.dataLayerTimeProp) {
      this.dataLayerTime = {
        value: this.mergedConfigsData[0].usedTimes.time[
          this.mergedConfigsData[0].usedTimes.time.length - 1
        ],
      };
      if (this.mergedConfigsData[0].mosaicIndicator) {
        this.generateMosaic({
          value: this.mergedConfigsData[0].usedTimes.time[
            this.mergedConfigsData[0].usedTimes.time.length - 1
          ],
        }, 'data');
      } else {
        // We set this as layers wait for this property to be set to work with
        // async mosaic id generation
        this.dataSearchId = 'value';
        this.compareSearchId = 'value';
      }
    }

    if (!this.compareLayerTimeProp) {
      this.$nextTick(() => {
        if (this.$refs.timeSelection) {
          this.compareLayerTime = this.$refs.timeSelection.getInitialCompareTime();
        }
      });
    }

    this.ro = new ResizeObserver(this.onResize)
      .observe(this.$refs.container);

    if (this.compareLayerTimeProp) {
      this.$nextTick(() => { this.enableCompare = true; });
    }
  },
  destroyed() {
    delete this.ro;
  },
  methods: {
    focusSelect(on) {
      const lMap = this.$refs.map.mapObject;
      if (on) {
        lMap.scrollWheelZoom.disable();
      } else {
        lMap.scrollWheelZoom.enable();
      }
    },
    createLatLng(latlng) {
      const llobj = latlng.split(',').map(Number);
      return llobj;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
      this.$emit('update:zoom', zoom);
    },
    centerUpdated(center) {
      this.center = center;
      this.$emit('update:center', center);
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
      this.$emit('update:bounds', bounds);
    },
    dataLayerTimeUpdated(time) {
      this.$emit('update:datalayertime', time);
    },
    compareLayerTimeUpdated(time) {
      this.$emit('update:comparelayertime', time);
    },
    onMapReady() {
      this.map = this.$refs.map.mapObject;
      const layerButtons = document.querySelectorAll('.leaflet-control-layers-toggle');
      layerButtons.forEach((lB) => lB.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${this.appConfig.branding.primaryColor}" width="32px" height="32px"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>`); // eslint-disable-line
      // update leaflet controls
      L.control.mousePosition({ // eslint-disable-line no-undef
        emptyString: '',
        formatter: (lon, lat) => `${lon.toFixed(3)}, ${lat.toFixed(3)}`,
        position: 'bottomright',
      }).addTo(this.map);
      // hide attribution under icon
      this.map.attributionControl._update = function () { // eslint-disable-line
        const attribs = [];
        const kk = Object.keys(this._attributions);
        for (let i = 0; i < kk.length; i += 1) {
          if (this._attributions[kk[i]]) {
            attribs.push(kk[i]);
          }
        }
        const prefixAndAttribs = [];
        if (this.options.prefix) {
          prefixAndAttribs.push(this.options.prefix);
        }
        if (attribs.length) {
          prefixAndAttribs.push(attribs.join(', '));
        }
        this._container.innerHTML = `<div class='attribution-body'>${prefixAndAttribs.join(' | ')}</div><div class='attribution-icon'>ℹ</div>`;
      };
      this.map.attributionControl._update();
      // add loading indicator
      L.Control.loading({
        position: 'bottomleft',
        delayIndicator: 200,
      }).addTo(this.map);
      // add A/B slider
      const leftLayers = this.extractActualLayers(this.$refs.compareLayers);
      const rightLayers = this.extractActualLayers(this.$refs.dataLayers);
      this.slider = L.control.sideBySide(leftLayers, rightLayers);
      this.drawControl = new L.Control.Draw(this.drawOptions);
      this.map.on(L.Draw.Event.CREATED, function (e) { // eslint-disable-line
        // set global area geometry as json
        this.$store.commit('features/SET_SELECTED_AREA', e.layer.toGeoJSON().geometry);
      }.bind(this)); // eslint-disable-line
      // only draw one feature at a time
      this.map.on(L.Draw.Event.DRAWSTART, function () { // eslint-disable-line
        this.clearCustomAreaFilter();
      }.bind(this));

      this.initialDrawSelectedArea();
      this.onResize();
      if (!this.mergedConfigsData[0].customAreaFeatures || this.validDrawnArea) {
        this.fetchFeatures('data');
      }
      this.$emit('ready');
      setTimeout(() => {
        this.flyToBounds();
      }, 100);
    },
    onResize() {
      // to fix panel size for reference image window
      if (this.map) {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    },
    initialDrawSelectedArea() {
      if (this.customAreaFilter) {
        if (!this.hideCustomAreaControls) {
          // add draw controls
          this.drawControl.addTo(this.map);
          this.renderTrashBin = true;
        }
        this.updateSelectedAreaFeature();
      }
    },
    updateSelectedAreaFeature() {
      let ftrs = null;
      if (this.validDrawnArea) {
        this.fetchFeatures('data');
        if (this.enableCompare) {
          this.fetchFeatures('compare');
        }
        ftrs = { ...this.drawnArea };
      }
      if (ftrs) {
        // add feature to be drawn into layer
        this.$refs.customAreaFilterFeatures.mapObject.addLayer(geoJson(ftrs, {
          style: {
            color: this.appConfig.branding.primaryColor,
          },
        }));
      } else {
        this.$refs.customAreaFilterFeatures.mapObject.clearLayers();
      }
    },
    countriesOptions() {
      const currentIndicator = this.indicator;
      return {
        onEachFeature: function onEachFeature(feature, layer) {
          layer.bindTooltip(
            () => feature.properties.name,
            { direction: 'top', sticky: true },
          );

          layer.on('click', () => {
            const countryA2 = feature.properties.alpha2;
            this.fetchMobilityData(countryA2, currentIndicator.aoiID);
            if (this.selectedLayer !== null) {
              this.selectedLayer.setStyle({
                color: '#222',
                weight: 1,
                fillColor: '#fff',
                opacity: 1,
                fillOpacity: 0.5,
              });
            }
            this.selectedCountry = countryA2;
            this.selectedLayer = layer;
            this.popupName = feature.properties.name;
          });
          layer.on('mouseover', (e) => {
            const currLayer = e.target;
            currLayer.setStyle({
              weight: 2,
              color: this.$vuetify.theme.currentTheme.primary,
              fillColor: this.$vuetify.theme.currentTheme.primary,
              fillOpacity: 0.7,
            });

            if (!L.Browser.ie && !L.Browser.opera) {
              layer.bringToFront();
            }
          });
          layer.on('mouseout', (e) => {
            const currLayer = e.target;
            if (this.selectedCountry !== feature.properties.alpha2) {
              currLayer.setStyle({
                color: '#222',
                weight: 1,
                fillColor: '#fff',
                opacity: 1,
                fillOpacity: 0.5,
              });
            }
          });
        }.bind(this),
      };
    },
    featureOptions(side = 'data') {
      const style = (this.usedConfig(side)[0].features && this.usedConfig(side)[0].features.style) ? this.usedConfig(side)[0].features.style : {}; // eslint-disable-line
      return {
        onEachFeature: function onEachFeature(feature, layer) {
          // if featuresParameters available, show only properties from mapping, otherwise dump all
          const allowedParams = this.usedConfig(side)[0].features ? this.usedConfig(side)[0].features.allowedParameters : null; // eslint-disable-line
          const allKeys = Object.keys(feature.properties);
          let tooltip = '';
          for (let i = 0; i < allKeys.length; i++) {
            if (!allowedParams || (typeof allowedParams === 'object' && Object.keys(allowedParams).includes(allKeys[i]))
              || (Array.isArray(allowedParams) && allowedParams.includes(allKeys[i]))) {
              tooltip += `<span><b>${allKeys[i]}</b>: ${feature.properties[allKeys[i]]}</span><br>`;
            }
          }
          if (tooltip !== '') {
            layer.bindTooltip(tooltip, { pane: this.popupPane });
          }
          // to make clustering work
          if (this.mergedConfigsData[0].featuresClustering) {
            layer.getLatLng = () => geoJson(feature).getBounds().getCenter(); //eslint-disable-line
            layer.setLatLng = () => { }; //eslint-disable-line
            layer._latlng = layer.getLatLng(); //eslint-disable-line
          }
        }.bind(this),
        // point circle marker styling
        pointToLayer: function (feature, latlng) { // eslint-disable-line
          return circleMarker(latlng, {
            radius: style.radius || 8,
            color: style.color || '#FFA500',
            weight: style.weight || 2,
            opacity: style.opacity || 1,
            dashArray: style.dashArray || null,
            dashOffset: style.dashOffset || null,
            fillOpacity: style.fillOpacity || 1,
            fillColor: style.fillColor || '#FFA500',
            fill: style.fill || true,
            pane: side === 'data' ? this.tooltipPane : this.shadowPane,
          });
        }.bind(this),
        // polygon and line styling
        style: {
          color: style.color || '#FFA500',
          weight: style.weight || 2,
          opacity: style.opacity || 1,
          dashArray: style.dashArray || null,
          dashOffset: style.dashOffset || null,
          fillOpacity: style.fillOpacity || 0,
          fillColor: style.fillColor || '#FFA500',
          fill: style.fill || true,
        },
      };
    },
    getColorCode(side) {
      const i = this.getCurrentIndex(side);
      let currentValue = null;
      // compensate for color code with only one entry, still showing it
      if (this.mergedConfigsData[0].usedTimes.colorCode) {
        const colors = this.mergedConfigsData[0].usedTimes.colorCode;
        if (Array.isArray(colors) && colors.length === 1) {
          currentValue = colors[0]; // eslint-disable-line prefer-destructuring
        } else if (Array.isArray(colors) && colors[i]) {
          currentValue = colors[i]; // eslint-disable-line prefer-destructuring
        }
      }
      return currentValue;
    },
    aoiFillStyle(side) {
      const currentValue = this.getColorCode(side);
      return currentValue
        ? this.getIndicatorColor(currentValue)
        : this.appConfig.branding.primaryColor;
    },
    getCurrentIndex(side) {
      return side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
    },
    subAoiStyle(side) {
      // return getSubAoiStyle(side);
      const currentValue = this.getColorCode(side);
      return {
        color: currentValue
          ? this.getIndicatorColor(currentValue)
          : this.appConfig.branding.primaryColor,
        weight: 3,
        fill: false,
      };
    },
    getCombinedWMSLayers(side = 'data') {
      const combLayers = this.usedConfig(side).filter((l) => (
        l.protocol === 'WMS' && Object.keys(l).indexOf('combinedLayers') !== -1
      ));
      return combLayers;
    },
    getSimpleWMSLayers(side = 'data') {
      const simpleLayers = this.usedConfig(side).filter((l) => (
        l.protocol === 'WMS' && Object.keys(l).indexOf('combinedLayers') === -1
      ));
      return simpleLayers;
    },
    flyToBounds() {
      // zooms to subaoi if present or area around aoi if not
      const boundsPad = this.mergedConfigsData[0].largeSubAoi ? 5 : (this.mergedConfigsData[0].midSubAoi ? 1 : 0.15); // eslint-disable-line
      if (this.subAoi && this.subAoi.features.length > 0) {
        const viewBounds = this.mergedConfigsData[0].presetView
          ? geoJson(this.mergedConfigsData[0].presetView).getBounds()
          : geoJson(this.subAoi).getBounds();
        const bounds = geoJson(this.subAoi).getBounds();
        const southBound = bounds.getSouth() - boundsPad;
        const westBound = bounds.getWest() - boundsPad;
        const northBound = bounds.getNorth() + boundsPad;
        const eastBound = bounds.getEast() + boundsPad;
        const cornerMax1 = latLng([
          southBound > -90 ? southBound : -90, westBound > -180 ? westBound : -180]);
        const cornerMax2 = latLng([
          northBound < 90 ? northBound : 90, eastBound < 180 ? eastBound : 180]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.fitBounds(viewBounds);
        // limit user movement around map
        this.map.setMaxBounds(boundsMax);
        if (this.mergedConfigsData[0].largeSubAoi) {
          this.map.setMinZoom(2);
        } else if (this.mergedConfigsData[0].midSubAoi) {
          this.map.setMinZoom(9);
        } else {
          this.map.setMinZoom(10);
        }
      } else if (this.mergedConfigsData[0].presetView) {
        // if only preset view move map there without limiting movement
        const viewBounds = geoJson(this.mergedConfigsData[0].presetView).getBounds();
        this.map.fitBounds(viewBounds);
      } else if (this.aoi) {
        const southBound = this.aoi.lat - boundsPad;
        const westBound = this.aoi.lng - boundsPad;
        const northBound = this.aoi.lat + boundsPad;
        const eastBound = this.aoi.lng + boundsPad;
        const cornerMax1 = latLng([
          southBound > -90 ? southBound : -90, westBound > -180 ? westBound : -180]);
        const cornerMax2 = latLng([
          northBound < 90 ? northBound : 90, eastBound < 180 ? eastBound : 180]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.setZoom(16);
        this.map.panTo(this.aoi);
        if (this.mergedConfigsData[0].largeSubAoi) {
          this.map.setMinZoom(2);
        } else if (this.mergedConfigsData[0].midSubAoi) {
          this.map.setMinZoom(9);
        } else {
          this.map.setMinZoom(12);
        }
        // limit user movement around map
        this.map.setMaxBounds(boundsMax);
      } else {
        // zoom to default bbox from config
        this.map.setMinZoom(this.mapDefaults.minMapZoom);
        this.map.setMaxBounds(null);
        this.map.fitBounds(latLngBounds(this.mapDefaults.bounds));
      }
    },
    layerOptions(time, sourceOptionsObj) {
      const additionalSettings = {};
      if (Object.prototype.hasOwnProperty.call(sourceOptionsObj, 'siteMapping')) {
        const currSite = sourceOptionsObj.siteMapping(
          this.indicator.aoiID,
        );
        additionalSettings.site = currSite;
      }
      if (time) {
        // time as is gets automatically injected to WMS query OR xyz url {time} template
        const fixTime = time.value || time;
        additionalSettings.time = typeof sourceOptionsObj.dateFormatFunction === 'function'
          ? sourceOptionsObj.dateFormatFunction(fixTime) : fixTime;
        if (sourceOptionsObj.specialEnvTime) {
          additionalSettings.env = `year:${additionalSettings.time}`;
        }
        if (sourceOptionsObj.features) {
          additionalSettings.featuresTime = typeof sourceOptionsObj.features.dateFormatFunction === 'function'
            ? sourceOptionsObj.features.dateFormatFunction(fixTime) : fixTime;
        }
      }
      const paramsToPassThrough = ['minZoom', 'maxZoom', 'minNativeZoom', 'maxNativeZoom', 'bounds', 'layers', 'styles',
        'format', 'width', 'height', 'transparent', 'srs', 'env', 'searchid'];
      paramsToPassThrough.forEach((param) => {
        if (typeof sourceOptionsObj[param] !== 'undefined') {
          additionalSettings[param] = sourceOptionsObj[param];
        }
      });
      return additionalSettings;
    },
    async generateMosaic(timeObj, side) {
      // These special layers first need to be "registered" to allow visualization
      const res = await axios.post('https://staging-raster.delta-backend.com/mosaic/register', {
        collections: [this.indicator.display.collection],
        datetime: this.indicator.display.dateFormatFunction(timeObj.value),
        'filter-lang': 'cql-json',
      }, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (side === 'data') {
        this.indicator.display.dataSearchId = res.data.searchid;
        this.dataSearchId = res.data.searchid;
        this.refreshLayers('data');
        this.$nextTick(() => {
          this.slider.setRightLayers(
            this.extractActualLayers(this.$refs.dataLayers),
          );
        });
      } else {
        this.indicator.display.compareSearchId = res.data.searchid;
        this.compareSearchId = res.data.searchid;
        this.refreshLayers('compare');
        this.$nextTick(() => {
          this.slider.setLeftLayers(
            this.extractActualLayers(this.$refs.compareLayers),
          );
        });
      }
    },
    dataLayerTimeSelection(timeObj) {
      if (this.indicator.display && this.indicator.display.mosaicIndicator) {
        this.generateMosaic(timeObj, 'data');
      } else {
        // We set this as layers wait for this property to be set to work with
        // async mosaic id generation
        this.dataSearchId = 'value';
        this.compareSearchId = 'value';

        this.dataLayerTime = timeObj;
        const newIndex = this.availableTimeEntries
          .map((i) => i.value)
          .indexOf(this.dataLayerTime.value ? this.dataLayerTime.value : this.dataLayerTime);
        this.dataLayerIndex = newIndex;
        this.refreshLayers('data');
        this.$nextTick(() => {
          this.slider.setRightLayers(
            this.extractActualLayers(this.$refs.dataLayers),
          );
        });
        if (this.indicator.compareDisplay) {
          // shared time on both sides in case of compareDisplay being set
          this.compareLayerTime = this.dataLayerTime;
          this.refreshLayers('compare');
          this.$nextTick(() => {
            this.slider.setLeftLayers(
              this.extractActualLayers(this.$refs.compareLayers),
            );
          });
        }
        this.dataLayerTimeUpdated(this.dataLayerTime.name);
      }
    },
    extractActualLayers(group) {
      let actualLayers = [];
      if (group.$children.length > 0) {
        group.$children.forEach((child) => {
          actualLayers = actualLayers.concat(this.extractActualLayers(child));
        });
      } else {
        actualLayers.push(group.mapObject);
      }
      return actualLayers;
    },
    compareLayerTimeSelection(timeObj) {
      if (this.indicator.display && this.indicator.display.mosaicIndicator) {
        this.generateMosaic(timeObj, 'compare');
      } else {
        this.compareLayerTime = timeObj;
        const newIndex = this.availableTimeEntries
          .map((i) => i.value)
          .indexOf(
            this.compareLayerTime.value ? this.compareLayerTime.value : this.compareLayerTime,
          );
        this.compareLayerIndex = newIndex;
        this.refreshLayers('compare');
        this.$nextTick(() => {
          this.slider.setLeftLayers(
            this.extractActualLayers(this.$refs.compareLayers),
          );
        });
        this.compareLayerTimeUpdated(this.compareLayerTime.name);
      }
    },
    refreshGroup(group, time, side) {
      // Group can also be an array depending on type
      if (group) {
        let toIterate;
        if (Array.isArray(group)) {
          toIterate = group;
        } else {
          toIterate = group.$children;
        }
        if (toIterate) {
          toIterate.forEach((item) => {
            // We check if we have a simple layer or a grouped layer
            if (item.$children.length > 0) {
              // This is a grouped layer, we iterate over the layers
              item.$children.forEach((subItem) => {
                // TODO: propsData do not have all the parameters we need (like dateFormatFunction)
                // TODO extend this getting the mergedConfigs in a same way as when non-grouped
                subItem.mapObject.setUrl(subItem.$options.propsData.baseUrl);
                subItem.mapObject.setParams(this.layerOptions(
                  time, subItem.$options.propsData,
                ));
                // force redraw of layer
                subItem.$forceUpdate();
              });
            } else {
              const originalConfig = this.usedConfig(side).find((config) => (
                config.name === item.name
              ));
              item.mapObject.setUrl(originalConfig.baseUrl);
              item.mapObject.setParams(this.layerOptions(
                time, originalConfig,
              ));
              // force redraw of layer
              item.$forceUpdate();
            }
          });
        }
      }
    },
    refreshLayers(side) {
      // compare(left) or data(right)
      if (side === 'compare' || this.indicator.compareDisplay) {
        this.refreshGroup(this.$refs.compareLayerArrayWMS, this.compareLayerTime, 'compare');
        if (this.$refs.compareLayerArrayXYZ) {
          this.$refs.compareLayerArrayXYZ.forEach((item) => {
            const originalIndex = parseInt(item.$attrs['data-key-originalindex'], 10);
            this.compareLayerKeyXYZ[originalIndex] = Math.random();
          });
        }
        if (!this.mergedConfigsData[0].featuresStatic
          && (!this.mergedConfigsData[0].customAreaFeatures || this.validDrawnArea)) {
          if (this.mergedConfigsData[0].featuresClustering) {
            if (this.$refs.featuresCompareCluster) {
              this.$refs.featuresCompareCluster.mapObject.clearLayers();
            }
          }
          this.fetchFeatures('compare');
        }
      }
      if (side === 'data') {
        this.refreshGroup(this.$refs.dataLayerArrayWMS, this.dataLayerTime, 'data');
        if (this.$refs.dataLayerArrayXYZ) {
          this.$refs.dataLayerArrayXYZ.forEach((item) => {
            const originalIndex = parseInt(item.$attrs['data-key-originalindex'], 10);
            this.dataLayerKeyXYZ[originalIndex] = Math.random();
          });
        }
        if (!this.mergedConfigsData[0].featuresStatic
          && (!this.mergedConfigsData[0].customAreaFeatures || this.validDrawnArea)) {
          if (this.mergedConfigsData[0].featuresClustering) {
            if (this.$refs.featuresDataCluster) {
              this.$refs.featuresDataCluster.mapObject.clearLayers();
            }
          }
          this.fetchFeatures('data');
        }
      }
    },
    usedConfig(side) {
      return side === 'data'
        ? this.mergedConfigsData
        : this.mergedConfigsCompare;
    },
    async fetchData({
      type, side, feature, countryCode, aoiID,
    }) {
      // fetching of customFeatures, customIndicator, gsaIndicator or mobilityData
      // depending on fetch success/failure the map loads data or errors are shown
      const usedTime = side === 'data'
        ? this.dataLayerTime
        : this.compareLayerTime;
      if (this.map) {
        this.map.fireEvent('dataloading');
        try {
          if (type === 'customFeatures' || type === 'customIndicator') {
            if (type === 'customFeatures' && !this.usedConfig(side)[0].features) {
              this.map.fireEvent('dataload');
              return;
            }
            if (type === 'customIndicator' && !this.usedConfig(side)[0].areaIndicator) {
              this.map.fireEvent('dataload');
              return;
            }

            const options = this.layerOptions(usedTime, this.usedConfig(side)[0]);
            const custom = await fetchCustomAreaObjects(
              options,
              this.drawnArea,
              this.validDrawnArea,
              this.usedConfig(side)[0],
              this.indicator,
              type === 'customFeatures' ? 'features' : 'areaIndicator',
              this.$store,
            );
            if (type === 'customFeatures') {
              this.updateJsonLayers(custom, side);
            } else {
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', custom,
              );
              this.$emit('fetchCustomAreaIndicator');
            }
          } else if (type === 'gsaIndicator' || type === 'mobilityData') {
            if (type === 'gsaIndicator') {
              this.selectedBorder = feature.borderId;
            }
            const dataUrl = `./eodash-data/internal/${type === 'gsaIndicator'
              ? feature.borderId
              : `${countryCode}-${aoiID}`}.json`;
            fetch(dataUrl).then((response) => {
              if (!response.ok) {
                throw Error(response.statusText);
              } else {
                return response.json();
              }
            })
              .then((indicator) => {
                let returnIndicator = {};
                if (type === 'gsaIndicator') {
                  returnIndicator.values = { ...indicator };
                  returnIndicator.indicator = 'GSA';
                  // Get all times of available border crossings to allow finding min max
                  returnIndicator.time = [];
                  Object.keys(indicator).forEach((key) => {
                    const currVals = indicator[key].values;
                    for (let i = 0; i < currVals.length; i += 1) {
                      returnIndicator.time.push(DateTime.fromISO(currVals[i].timestamp));
                    }
                  });
                  returnIndicator.measurement = [0];
                  returnIndicator.title = feature.name;
                  returnIndicator.yAxis = this.indicator.yAxis;
                } else {
                  returnIndicator = { ...indicator };
                  returnIndicator.indicator = aoiID;
                  returnIndicator.time = indicator.Values.map((row) => DateTime.fromISO(row.date));
                  returnIndicator.measurement = [0];
                  returnIndicator.country = indicator.CountryCode;
                  returnIndicator.title = indicator.CountryName;
                  returnIndicator.yAxis = this.indicator.yAxis;
                  returnIndicator.includesIndicator = true;
                  returnIndicator.city = indicator.CountryName;
                  returnIndicator.description = this.indicator.description;
                }
                this.map.fireEvent('dataload');
                this.$store.commit(
                  'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', returnIndicator,
                );
                this.$emit('fetchCustomAreaIndicator');
              });
          }
          this.map.fireEvent('dataload');
        } catch (err) {
          this.map.fireEvent('dataload');
          if (type === 'customFeatures') {
            this.updateJsonLayers(emptyF, side);
          } else if (type === 'customIndicator') {
            this.$store.commit(
              'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null,
            );
          } else if (type === 'gsaIndicator' || type === 'mobilityData') {
            this.$store.commit(
              'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', { isEmpty: true },
            );
          }
          console.error(err);
          this.$store.commit('sendAlert', {
            message: `Error requesting data, error message: ${err}.</br>
              If the issue persists, please use the feedback button to let us know.`,
            type: 'error',
          });
        }
      }
    },
    fetchFeatures(side) {
      this.fetchData({
        type: 'customFeatures',
        side,
      });
    },
    selectGSAIndicator(feature) {
      this.fetchData({
        type: 'gsaIndicator',
        feature,
      });
    },
    fetchMobilityData(countryCode, aoiID) {
      this.fetchData({
        type: 'mobilityData',
        countryCode,
        aoiID,
      });
    },
    fetchCustomAreaIndicator() {
      this.fetchData({
        type: 'customIndicator',
        side: 'data',
      });
    },
    clearCustomAreaFilter() {
      this.$store.commit('features/SET_SELECTED_AREA', null);
    },
    updateJsonLayers(ftrs, side) {
      if (typeof ftrs === 'undefined') {
        return;
      }
      if (this.mergedConfigsData[0].featuresClustering) {
        // markercluster needs manual adding of all geojsons it will show
        // and cleanup of previous content
        const geojsonFromData = geoJson(ftrs, {
          ...this.featureOptions(side),
          pane: side === 'data' ? this.tooltipPane : this.shadowPane,
        });
        if (this.$refs.featuresDataCluster) {
          if (side === 'data') {
            this.$refs.featuresDataCluster.mapObject.clearLayers();
            this.$refs.featuresDataCluster.mapObject.addLayers([geojsonFromData]);
            this.dataFeaturesCount = ftrs.features.length;
          } else if (this.$refs.featuresCompareCluster) {
            this.$refs.featuresCompareCluster.mapObject.clearLayers();
            this.$refs.featuresCompareCluster.mapObject.addLayers([geojsonFromData]);
            this.compareFeaturesCount = ftrs.features.length;
          }
        }
      } else if (side === 'data') {
        // normal geojson layer just needs manual refresh
        this.dataJson = Object.freeze(ftrs);
        this.dataJsonKey = Math.random();
        this.dataFeaturesCount = ftrs.features.length;
      } else {
        this.compareJson = Object.freeze(ftrs);
        this.compareJsonKey = Math.random();
        this.compareFeaturesCount = ftrs.features.length;
      }
    },
  },
  watch: {
    zoomProp: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) this.zoom = v;
      },
    },
    centerProp: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) this.center = v;
      },
    },
    dataLayerTime(timeObj) {
      this.dataLayerTimeSelection(timeObj);
    },
    compareLayerTime(timeObj) {
      this.compareLayerTimeSelection(timeObj);
    },
    dataLayerTimeProp: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) this.dataLayerTime = this.availableTimeEntries.find((item) => item.name === v);
      },
    },
    compareLayerTimeProp: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) this.compareLayerTime = this.availableTimeEntries.find((item) => item.name === v);
      },
    },
    enableCompare(on) {
      if (!on) {
        if (this.slider !== null) {
          this.map.removeControl(this.slider);
          this.map.removeLayer(this.$refs.compareLayers.mapObject);
        }

        // Unset compare time for server storage
        this.compareLayerTimeUpdated(undefined);
      } else {
        this.map.addLayer(this.$refs.compareLayers.mapObject);
        if (!this.mergedConfigsData[0].customAreaFeatures || this.validDrawnArea) {
          this.fetchFeatures('compare');
        }
        this.$nextTick(() => {
          this.slider.setLeftLayers(
            this.extractActualLayers(this.$refs.compareLayers),
          );
          this.slider.setRightLayers(
            this.extractActualLayers(this.$refs.dataLayers),
          );
          this.slider.addTo(this.map);
        });
        // The following two calls set initial compare
        // and data layer times containing name and value.
        const cTime = this.availableTimeEntries
          .find((v) => v.value === this.compareLayerTime.value);
        if (this.mergedConfigsData[0].mosaicIndicator) {
          this.generateMosaic(cTime, 'compare');
        }
        this.compareLayerTimeUpdated(cTime.name);

        const dTime = this.availableTimeEntries
          .find((v) => v.value === this.dataLayerTime.value);
        this.dataLayerTimeUpdated(dTime.name);
      }

      this.$emit('compareEnabled');
    },
    drawnArea() {
      // watch on drawn area prop change triggering update of draw layer, fetching custom features
      this.updateSelectedAreaFeature();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .leaflet-tooltip-top {
  background: #00000099;
  border-radius: 3px;
  color: #fff;
  pointer-events: none;
  white-space: nowrap;
  border: none;
  &:before {
    border-top-color: #00000099;
  }
}
::v-deep .leaflet-control-attribution:active :not(.attribution-icon),
::v-deep .leaflet-control-attribution:hover :not(.attribution-icon),
::v-deep .leaflet-control-attribution .attribution-icon {
  display: inline-block;
}
::v-deep .leaflet-control-attribution :not(.attribution-icon),
::v-deep .leaflet-control-attribution:active .attribution-icon,
::v-deep .leaflet-control-attribution:hover .attribution-icon {
  display: none;
}
::v-deep .attribution-icon {
  font-size: 1.2em;
  margin: 1px;
}
::v-deep .leaflet-control-mouseposition {
  background-color: rgba(255, 255, 255, 0.8);
  transform: translate3d(-8px, 32px, 0);
  padding: 2px 4px;
}
::v-deep .leaflet-sbs-divider {
  background-color: var(--v-primary-base);
  opacity: 0.7;
}
::v-deep .leaflet-control-layers-toggle {
  background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23003247" width="32px" height="32px"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>');
}
::v-deep .leaflet-bar a, ::v-deep .leaflet-control-attribution {
  color: var(--v-primary-base) !important;
}
::v-deep .leaflet-control-layers-toggle {
  background-image: none;
  svg {
    width: 100%;
    height: 100%;
  }
}
::v-deep .leaflet-tooltip {
  z-index: 700;
}
::v-deep .leaflet-draw-actions a {
  background-color: var(--v-primary-base);
  color: #fff;
}
::v-deep .marker-cluster {
  background-color: rgba(#003247, 0.5);
  div {
    background-color: var(--v-primary-base);
    span {
      color: white;
    }
  }
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

::v-deep .leaflet-top.leaflet-right {
  margin-top: 45px;
}
</style>
