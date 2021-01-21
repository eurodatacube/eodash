<template>
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
    @ready="onMapReady()"
  >
    <l-control-attribution position="bottomright" prefix=''></l-control-attribution>
    <l-control-layers position="topright" ref="layersControl"></l-control-layers>
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
      v-if="customAreaIndicator && validDrawnArea && renderTrashBin">
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
      <l-marker-cluster v-if="featuresClustering"
        ref="featuresDataCluster"
        :options="clusterOptions"
        >
      </l-marker-cluster>
      <l-geo-json
          v-else
          ref="featureJsonData"
          :geojson="getDataF().features"
          :options="featureOptions('data')"
          :pane="tooltipPane"
          :key="dataJsonKey"
        >
      </l-geo-json>
      <l-circle-marker
        v-if="showAoi"
        :lat-lng="aoi"
        :radius="12"
        :color="$vuetify.theme.themes.light.primary"
        :weight="2"
        :dashArray="dasharrayPoi"
        :fill="true"
        :fillColor="getAoiFill('data')"
        :fillOpacity="1"
        :pane="tooltipPane"
      >
      </l-circle-marker>
      <LTileLayer
      v-if="layerDisplay('data').protocol === 'xyz'
        && layerDisplay('data').mapLayerEnable !== false"
        ref="dataLayer"
        :key="dataLayerKey"
        v-bind="layerDisplay('data')"
        :options="layerOptions(currentTime, layerDisplay('data'))"
        :pane="overlayPane"
        layer-type="overlay"
      >
      </LTileLayer>
      <LWMSTileLayer
      v-else-if="layerDisplay('data').protocol === 'WMS'
        && layerDisplay('data').mapLayerEnable !== false"
        ref="dataLayer"
        :key="dataLayerKey"
        v-bind="layerDisplay('data')"
        :options="layerOptions(currentTime, layerDisplay('data'))"
        :pane="overlayPane"
        layer-type="overlay"
      >
      </LWMSTileLayer>
    </l-layer-group>
    <l-layer-group ref="compareLayers">
      <LTileLayer
        v-if="layerDisplay('compare').protocol === 'xyz'
          && layerDisplay('compare').mapLayerEnable !== false"
        ref="compareLayer"
        :key="compareLayerKey"
        v-bind="layerDisplay('compare')"
        :visible="enableCompare"
        :options="layerOptions(currentCompareTime, layerDisplay('compare'))"
        :pane="overlayPane"
      >
      </LTileLayer>
      <LWMSTileLayer
      v-else-if="layerDisplay('compare').protocol === 'WMS'
        && layerDisplay('compare').mapLayerEnable !== false"
        ref="compareLayer"
        :key="compareLayerKey"
        v-bind="layerDisplay('compare')"
        :visible="enableCompare"
        :options="layerOptions(currentCompareTime, layerDisplay('compare'))"
        :pane="overlayPane"
      >
      </LWMSTileLayer>
      <l-geo-json
        :geojson="indicator.subAoi"
        :pane="shadowPane"
        :visible="enableCompare"
        :optionsStyle="subAoiStyle('compare')"
      >
      </l-geo-json>
      <l-marker-cluster v-if="featuresClustering"
        ref="featuresCompareCluster" :options="clusterOptions">
      </l-marker-cluster>
      <l-geo-json
        v-else
        ref="featureJsonCompare"
        :visible="enableCompare"
        :geojson="getCompareF().features"
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
        :color="$vuetify.theme.themes.light.primary"
        :weight="2"
        :dashArray="dasharrayPoi"
        :fill="true"
        :fillColor="getAoiFill('compare')"
        :fillOpacity="1"
        :pane="shadowPane"
      >
      </l-circle-marker>
    </l-layer-group>
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
    <div
    :style="`position: absolute; z-index: 700; top: 10px; left: 10px;`">
      <img v-if="layerDisplay('data').legendUrl"
      :src="layerDisplay('data').legendUrl" alt=""
      :class="`map-legend ${$vuetify.breakpoint.xsOnly ? 'map-legend-expanded' :
      (legendExpanded && 'map-legend-expanded')}`"
      @click="legendExpanded = !legendExpanded"
      :style="`background: rgba(255, 255, 255, 0.8);`">
      <div
      v-if="customAreaFeatures && (layerDisplay('data').features.featureLimit === dataFeaturesNum ||
      layerDisplay('data').features.featureLimit === compareFeaturesNum)"
      :style="`width: fit-content; background: rgba(255, 255, 255, 0.8);`"
      >
        <h3 :class="`brand-${appConfig.id} px-3 py-2`">
          Limit of drawn features is for performance reasons set to
          <span :style="`font-size: 17px;`">{{layerDisplay('data').features.featureLimit}}
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
      <v-sheet
        v-if="!disableTimeSelection"
        class="row justify-center align-center"
        style="position: absolute; bottom: 30px; z-index: 1000; width: auto; max-width: 100%;"
      >
        <v-col
          v-if="enableCompare && !indicator.compareDisplay"
          cols="6"
          class="pr-0"
        >
          <v-select
            v-if="enableCompare"
            outlined
            dense
            autofocus
            hide-details
            :prepend-inner-icon="(arrayOfObjects && compareLayerTime) && (arrayOfObjects
              .map((i) => i.value)
              .indexOf(compareLayerTime.value) > 0
                ? 'mdi-arrow-left-drop-circle'
                : 'mdi-asterisk')"
            :append-icon="(arrayOfObjects && compareLayerTime) && (arrayOfObjects
              .map((i) => i.value)
              .indexOf(compareLayerTime.value) < arrayOfObjects.length - 1
                ? 'mdi-arrow-right-drop-circle'
                : 'mdi-asterisk')"
            menu-props="auto"
            :items="arrayOfObjects"
            item-value="value"
            item-text="name"
            v-model="compareLayerTime"
            @change="compareLayerTimeSelection"
            @click:prepend-inner="compareLayerReduce"
            @click:append="compareLayerIncrease"
          ></v-select>
        </v-col>
        <v-col
          :cols="enableCompare && !indicator.compareDisplay ? 6 : 12"
        >
          <v-select
            outlined
            dense
            autofocus
            hide-details
            :prepend-inner-icon="(arrayOfObjects && dataLayerTime) && (arrayOfObjects
              .map((i) => i.value)
              .indexOf(dataLayerTime.value) > 0
                ? 'mdi-arrow-left-drop-circle'
                : 'mdi-asterisk')"
            :append-icon="(arrayOfObjects && dataLayerTime) && (arrayOfObjects
              .map((i) => i.value)
              .indexOf(dataLayerTime.value) < arrayOfObjects.length - 1
                ? 'mdi-arrow-right-drop-circle'
                : 'mdi-asterisk')"
            menu-props="auto"
            :items="arrayOfObjects"
            item-value="value"
            item-text="name"
            v-model="dataLayerTime"
            @change="dataLayerTimeSelection"
            @click:prepend-inner="dataLayerReduce"
            @click:append="dataLayerIncrease"
          >
            <template v-slot:prepend
            v-if="!disableCompareButton">
              <v-tooltip
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="enableCompare = !enableCompare">mdi-compare</v-icon>
                </template>
                Compare two images
              </v-tooltip>
            </template>
          </v-select>
        </v-col>
      </v-sheet>
    </div>
  </l-map>
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
import { template } from '@/utils';
import {
  LMap, LTileLayer, LWMSTileLayer, LGeoJson, LCircleMarker,
  LControlLayers, LControlAttribution, LControlZoom, LLayerGroup,
  LFeatureGroup, LControl,
} from 'vue2-leaflet';
import { DateTime } from 'luxon';

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


const emptyF = {
  type: 'FeatureCollection',
  features: [],
};
let dataF = emptyF;
let compareF = emptyF;

export default {
  props: [
    'currentIndicator',
  ],
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
    'l-marker-cluster': Vue2LeafletMarkerCluster,
  },
  data() {
    return {
      map: null,
      compareLayerKey: 0,
      dataLayerKey: 1,
      dataJsonKey: 0,
      compareJsonKey: 1,
      dasharrayPoi: '3',
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
      dataFeaturesNum: 0,
      compareFeaturesNum: 0,
    };
  },
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapGetters('indicators', [
      'getIndicatorFilteredInputData',
    ]),
    dataJsonComputed: {
      // to avoid each of thousands of geojson features have its own
      // getter/setter set by vue - freezing the app on large number of pts
      // we manually rerender relevant vue components anyway
      get: () => this.getDataF(),
      set: (v) => {
        dataF = v;
      },
    },
    compareJsonComputed: {
      get: () => this.getCompareF(),
      set: (v) => {
        compareF = v;
      },
    },
    subAoiInverseStyle() {
      return {
        stroke: false,
        fillColor: this.getIndicatorColor('primary'),
        fillOpacity: 0.5,
      };
    },
    baseLayers() {
      // expects an array of objects
      return this.layerDisplay('data').baseLayers ? this.layerDisplay('data').baseLayers : this.baseConfig.baseLayersRightMap;
    },
    overlayLayers() {
      return this.layerDisplay('data').overlayLayers ? this.layerDisplay('data').overlayLayers : this.baseConfig.overlayLayersRightMap;
    },
    mapDefaults() {
      return {
        ...this.baseConfig.mapDefaults,
        ...this.shLayerConfig('data'),
      };
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    indDefinition() {
      return this.baseConfig.indicatorsDefinition[this.indicator.indicator];
    },
    additionalMapTimes() {
      return this.baseConfig.additionalMapTimes && this.baseConfig.additionalMapTimes[`${this.indicator.aoiID}-${this.indicator.indicator}`];
    },
    excludeMapTimes() {
      return this.baseConfig.excludeMapTimes && this.baseConfig.excludeMapTimes[`${this.indicator.aoiID}-${this.indicator.indicator}`];
    },
    replaceMapTimes() {
      return this.baseConfig.replaceMapTimes && this.baseConfig.replaceMapTimes[`${this.indicator.aoiID}-${this.indicator.indicator}`];
    },
    indicator() {
      return this.getIndicatorFilteredInputData(this.currentIndicator || null);
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
    disableTimeSelection() {
      return (this.layerDisplay('data') && typeof this.layerDisplay('data').disableTimeSelection !== 'undefined') ? this.layerDisplay('data').disableTimeSelection : this.indDefinition.disableTimeSelection;
    },
    disableCompareButton() {
      return (this.layerDisplay('data') && typeof this.layerDisplay('data').disableCompare !== 'undefined') ? this.layerDisplay('data').disableCompare : this.indDefinition.disableCompare;
    },
    customAreaFeatures() {
      return (this.layerDisplay('data') && typeof this.layerDisplay('data').customAreaFeatures !== 'undefined') ? this.layerDisplay('data').customAreaFeatures : this.indDefinition.customAreaFeatures;
    },
    customAreaIndicator() {
      return this.layerDisplay('data').customAreaIndicator || this.indDefinition.customAreaIndicator || this.indicator.customAreaIndicator;
    },
    customAreaFilter() {
      return this.customAreaFeatures || this.customAreaIndicator;
    },
    featuresClustering() {
      return (this.layerDisplay('data') && typeof this.layerDisplay('data').featuresClustering !== 'undefined') ? this.layerDisplay('data').featuresClustering : this.indDefinition.featuresClustering;
    },
    usedTimes() {
      let times = this.indicator.time;
      let eoSensor = Array.isArray(this.indicator.eoSensor) && this.indicator.eoSensor;
      let inputData = Array.isArray(this.indicator.inputData) && this.indicator.inputData;
      let colorCode = Array.isArray(this.indicator.colorCode) && this.indicator.colorCode;
      // completely replace given times or eoSensor
      if (this.replaceMapTimes && Array.isArray(this.replaceMapTimes.time)) {
        times = this.replaceMapTimes.time;
      }
      if (this.replaceMapTimes && Array.isArray(this.replaceMapTimes.eoSensor)) {
        eoSensor = this.replaceMapTimes.eoSensor; // just for display
      }
      if (this.replaceMapTimes && Array.isArray(this.replaceMapTimes.inputData)) {
        inputData = this.replaceMapTimes.inputData;
        // needs to be used unless indicator.display is used (that overrides it)
      }
      if (this.replaceMapTimes && Array.isArray(this.replaceMapTimes.colorCode)) {
        colorCode = this.replaceMapTimes.colorCode;
      }
      if (this.additionalMapTimes) {
        // add additional times and eoSensor to original arrays
        // sort time ascending and sort arrays based on time array via helper list combining all
        const dtObjects = this.additionalMapTimes.time.map((t) => DateTime.fromISO(t));
        const mergedTimes = times.concat(dtObjects);
        const mergedSensors = eoSensor.concat(this.additionalMapTimes.eoSensor);
        const mergedInputData = inputData.concat(this.additionalMapTimes.inputData);
        const mergedColorCode = colorCode.concat(this.additionalMapTimes.colorCode);
        // combine the arrays
        const list = [];
        for (let j = 0; j < mergedTimes.length; j++) {
          list.push({
            time: mergedTimes[j],
            eoSensor: mergedSensors[j],
            inputData: mergedInputData[j],
            colorCode: mergedColorCode[j],
          });
        }
        // sort mapping by time asc
        list.sort((a, b) => (a.time.toMillis() - b.time.toMillis()));
        // separate them back out
        for (let k = 0; k < list.length; k++) {
          mergedTimes[k] = list[k].time;
          mergedSensors[k] = list[k].eoSensor;
          mergedInputData[k] = list[k].inputData;
          mergedColorCode[k] = list[k].colorCode;
        }
        times = mergedTimes;
        eoSensor = mergedSensors;
        inputData = mergedInputData;
        colorCode = mergedColorCode;
      }
      if (this.excludeMapTimes && Array.isArray(this.excludeMapTimes)) {
        // exclude times and respective entries from other arrays
        const dtObjects = this.excludeMapTimes.map((t) => DateTime.fromISO(t));
        const indToDelete = times.reduce((a, e, i) => {
          // find if any time is in to be deleted
          const found = dtObjects.find((time) => time.toMillis() === e.toMillis());
          if (typeof found !== 'undefined') {
            // add its index to list
            a.push(i);
          }
          return a;
        }, []);
        // set items in all arrays to null
        indToDelete.forEach((i) => {
          times[i] = null;
          if (typeof eoSensor[i] !== 'undefined') {
            eoSensor[i] = null;
          }
          if (typeof inputData[i] !== 'undefined') {
            inputData[i] = null;
          }
          if (typeof colorCode[i] !== 'undefined') {
            colorCode[i] = null;
          }
        });
        // filter out nulls
        times = times.filter((e) => e !== null);
        eoSensor = eoSensor.filter((e) => e !== null);
        inputData = inputData.filter((e) => e !== null);
        colorCode = colorCode.filter((e) => e !== null);
      }
      return {
        time: times, eoSensor, inputData, colorCode,
      };
    },
    arrayOfObjects() {
      const selectionOptions = [];
      for (let i = 0; i < this.usedTimes.time.length; i += 1) {
        let label = this.getTimeLabel(this.usedTimes.time[i]);
        if (this.usedTimes.eoSensor) {
          const eoSensor = this.usedTimes.eoSensor.length === 1
            ? this.usedTimes.eoSensor[0]
            : this.usedTimes.eoSensor[i];
          label += ` - ${eoSensor}`;
        }
        selectionOptions.push({
          value: this.usedTimes.time[i],
          name: label,
        });
      }
      return selectionOptions;
    },
    currentTime() {
      let returnTime = this.usedTimes.time[this.usedTimes.time.length - 1];
      if (this.dataLayerTime !== null) {
        returnTime = this.dataLayerTime;
      }
      return returnTime;
    },
    currentCompareTime() {
      let returnTime = this.getInitialCompareTime();
      if (this.compareLayerTime !== null) {
        returnTime = this.compareLayerTime;
      }
      if (this.indicator.compareDisplay) {
        // shared time on both layers in case of compareDisplay being set
        returnTime = this.dataLayerTime;
      }
      return returnTime;
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
          fillColor: this.$vuetify.theme.themes.light.primary,
          color: this.$vuetify.theme.themes.light.primary,
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
    this.dataLayerIndex = this.usedTimes.time.length - 1;
    this.dataLayerTime = { value: this.usedTimes.time[this.dataLayerIndex] };
    this.compareLayerTime = { value: this.getInitialCompareTime() };
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
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
      this.slider = L.control.sideBySide(this.$refs.compareLayers.mapObject.getLayers(), this.$refs.dataLayers.mapObject.getLayers()); // eslint-disable-line
      this.drawControl = new L.Control.Draw(this.drawOptions);
      this.map.on(L.Draw.Event.CREATED, function (e) { // eslint-disable-line
        // set global area as json
        this.$store.commit('features/SET_SELECTED_AREA', e.layer.toGeoJSON());
      }.bind(this)); // eslint-disable-line
      // only draw one feature at a time
      this.map.on(L.Draw.Event.DRAWSTART, function () { // eslint-disable-line
        this.clearCustomAreaFilter();
      }.bind(this));

      this.initialDrawSelectedArea();
      this.onResize();
      if (!this.customAreaFeatures || this.validDrawnArea) {
        this.fetchFeatures('data');
      }
      setTimeout(() => {
        this.flyToBounds();
      }, 100);
    },
    onResize() {
      // to fix panel size for reference image window
      if (this.map) {
        this.map._onResize();
      }
    },
    initialDrawSelectedArea() {
      if (this.customAreaFilter) {
        // add draw controls
        this.drawControl.addTo(this.map);
        this.renderTrashBin = true;
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
    featureOptions(side) {
      const style = (this.layerDisplay(side).features && this.layerDisplay(side).features.style) ? this.layerDisplay(side).features.style : {}; // eslint-disable-line
      return {
        onEachFeature: function onEachFeature(feature, layer) {
          // if featuresParameters available, show only properties from mapping, otherwise dump all
          const allowedParams = this.layerDisplay(side).features ? this.layerDisplay(side).features.allowedParameters : null; // eslint-disable-line
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
          layer.getLatLng = () => geoJson(feature).getBounds().getCenter(); //eslint-disable-line
          layer.setLatLng = () => { }; //eslint-disable-line
          layer._latlng = layer.getLatLng(); //eslint-disable-line
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
      const i = side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
      let currentValue = null;
      // compensate for color code with only one entry, still showing it
      if (this.usedTimes.colorCode) {
        const colors = this.usedTimes.colorCode;
        if (Array.isArray(colors) && colors.length === 1) {
          currentValue = colors[0]; // eslint-disable-line prefer-destructuring
        } else if (Array.isArray(colors) && colors[i]) {
          currentValue = colors[i]; // eslint-disable-line prefer-destructuring
        }
      }
      return currentValue;
    },
    getAoiFill(side) {
      const currentValue = this.getColorCode(side);
      return currentValue
        ? this.getIndicatorColor(currentValue)
        : this.$vuetify.theme.themes.light.primary;
    },
    subAoiStyle(side) {
      const currentValue = this.getColorCode(side);
      return {
        color: currentValue
          ? this.getIndicatorColor(currentValue)
          : this.$vuetify.theme.themes.light.primary,
        weight: 3,
        fill: false,
      };
    },
    shLayerConfig(side) {
      const i = side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
      const inputData = this.usedTimes.inputData.length === 1
        ? this.usedTimes.inputData[0]
        : this.usedTimes.inputData[i];
      if (this.layerNameMapping.hasOwnProperty(inputData)) { // eslint-disable-line
        return this.layerNameMapping[inputData];
      }
      return {};
    },
    layerDisplay(side) {
      // if display not specified (global layers), suspect SIN layer
      // first check if special compare layer configured
      const displayTmp = side === 'compare' && this.indicator.compareDisplay ? this.indicator.compareDisplay : this.indicator.display;
      let name = this.indicator.description;
      if (side === 'compare') {
        name += ' - compare (left)';
      }
      return displayTmp || {
        ...this.baseConfig.defaultWMSDisplay,
        ...this.indDefinition,
        ...this.shLayerConfig(side),
        name,
      };
    },
    flyToBounds() {
      // zooms to subaoi if present or area around aoi if not
      const boundsPad = this.indDefinition.largeSubAoi ? 5 : (this.indDefinition.midSubAoi ? 1 : 0.15); // eslint-disable-line
      if (this.subAoi && this.subAoi.features.length > 0) {
        const viewBounds = this.layerDisplay('data').presetView ? geoJson(this.layerDisplay('data').presetView).getBounds() : geoJson(this.subAoi).getBounds();
        const bounds = geoJson(this.subAoi).getBounds();
        const cornerMax1 = latLng([bounds.getSouth() - boundsPad, bounds.getWest() - boundsPad]);
        const cornerMax2 = latLng([bounds.getNorth() + boundsPad, bounds.getEast() + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.fitBounds(viewBounds);
        // limit user movement around map
        this.map.setMaxBounds(boundsMax);
        if (this.indDefinition.largeSubAoi) {
          this.map.setMinZoom(2);
        } else if (this.indDefinition.midSubAoi) {
          this.map.setMinZoom(10);
        } else {
          this.map.setMinZoom(13);
        }
      } else if (this.aoi) {
        const cornerMax1 = latLng([this.aoi.lat - boundsPad, this.aoi.lng - boundsPad]);
        const cornerMax2 = latLng([this.aoi.lat + boundsPad, this.aoi.lng + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.setZoom(16);
        this.map.panTo(this.aoi);
        if (this.indDefinition.largeSubAoi) {
          this.map.setMinZoom(2);
        } else if (this.indDefinition.midSubAoi) {
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
    getTimeLabel(time) {
      if (Array.isArray(time) && time.length === 2) {
        // show start - end
        if (this.indDefinition.mapTimeLabelExtended) {
          return time.map((d) => DateTime.fromISO(d).toISO({ suppressMilliseconds: true })).join(' - ');
        }
        return time.map((d) => DateTime.fromISO(d).toISODate()).join(' - ');
      } else if (time instanceof DateTime) { // eslint-disable-line no-else-return
        if (this.indDefinition.mapTimeLabelExtended) {
          return time.toISO({ suppressMilliseconds: true });
        }
        return time.toISODate();
      }
      if (this.indDefinition.mapTimeLabelExtended) {
        return DateTime.fromISO(time).toISO({ suppressMilliseconds: true });
      }
      return DateTime.fromISO(time).toISODate();
    },
    layerOptions(time, sourceOptionsObj) {
      const additionalSettings = {};
      if (Object.prototype.hasOwnProperty.call(sourceOptionsObj, 'siteMapping')) {
        const currSite = sourceOptionsObj.siteMapping(
          this.indicator.aoiID,
        );
        additionalSettings.site = currSite;
      }
      if (typeof sourceOptionsObj.minZoom !== 'undefined') {
        additionalSettings.minZoom = sourceOptionsObj.minZoom;
      }
      if (typeof sourceOptionsObj.maxZoom !== 'undefined') {
        additionalSettings.maxZoom = sourceOptionsObj.maxZoom;
      }
      if (typeof sourceOptionsObj.minNativeZoom !== 'undefined') {
        additionalSettings.minNativeZoom = sourceOptionsObj.minNativeZoom;
      }
      if (typeof sourceOptionsObj.maxNativeZoom !== 'undefined') {
        additionalSettings.maxNativeZoom = sourceOptionsObj.maxNativeZoom;
      }
      if (time !== null) {
        // time as is gets automatically injected to WMS query OR xyz url {time} template
        const fixTime = time.value || time;
        additionalSettings.time = typeof sourceOptionsObj.dateFormatFunction === 'function'
          ? sourceOptionsObj.dateFormatFunction(fixTime) : fixTime;
        if (sourceOptionsObj.features) {
          additionalSettings.featuresTime = typeof sourceOptionsObj.features.dateFormatFunction === 'function'
            ? sourceOptionsObj.features.dateFormatFunction(fixTime) : fixTime;
        }
      }
      return additionalSettings;
    },
    dataLayerTimeSelection(payload) {
      // Different object returned either by arrow use or by dropdown use
      if (Array.isArray(payload) || !(payload.value)) {
        this.dataLayerTime = { value: payload, name: `${payload}` };
      } else {
        this.dataLayerTime = payload;
      }
      const newIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.dataLayerTime.value ? this.dataLayerTime.value : this.dataLayerTime);
      this.dataLayerIndex = newIndex;
      this.refreshLayer('data');
      this.$nextTick(() => {
        this.slider.setRightLayers(this.$refs.dataLayers.mapObject.getLayers());
      });
      if (this.indicator.compareDisplay) {
        // shared time on both layers in case of compareDisplay being set
        this.compareLayerTime = this.dataLayerTime;
        this.compareLayerIndex = newIndex;
        this.refreshLayer('compare');
        this.$nextTick(() => {
          this.slider.setLeftLayers(this.$refs.compareLayers.mapObject.getLayers());
        });
      }
    },
    compareLayerTimeSelection(payload) {
      // Different object returned either by arrow use or by dropdown use
      if (Array.isArray(payload) || !(payload.value)) {
        this.compareLayerTime = { value: payload, name: `${payload}` };
      } else {
        this.compareLayerTime = payload;
      }
      const newIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.compareLayerTime.value ? this.compareLayerTime.value : this.compareLayerTime);
      this.compareLayerIndex = newIndex;
      this.refreshLayer('compare');
      this.$nextTick(() => {
        this.slider.setLeftLayers(this.$refs.compareLayers.mapObject.getLayers());
      });
    },
    dataLayerReduce() {
      const currentIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.dataLayerTime.value ? this.dataLayerTime.value : this.dataLayerTime);
      this.dataLayerIndex = currentIndex - 1;
      this.dataLayerTimeSelection(this.arrayOfObjects[currentIndex - 1]);
    },
    dataLayerIncrease() {
      const currentIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.dataLayerTime.value ? this.dataLayerTime.value : this.dataLayerTime);
      this.dataLayerIndex = currentIndex + 1;
      this.dataLayerTimeSelection(this.arrayOfObjects[currentIndex + 1]);
    },
    compareLayerReduce() {
      const currentIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.compareLayerTime.value ? this.compareLayerTime.value : this.compareLayerTime);
      this.compareLayerIndex = currentIndex - 1;
      this.compareLayerTimeSelection(this.arrayOfObjects[currentIndex - 1]);
    },
    compareLayerIncrease() {
      const currentIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.compareLayerTime.value ? this.compareLayerTime.value : this.compareLayerTime);
      this.compareLayerIndex = currentIndex + 1;
      this.compareLayerTimeSelection(this.arrayOfObjects[currentIndex + 1]);
    },
    getInitialCompareTime() {
      // find closest entry one year before latest time
      if (this.indDefinition.largeTimeDuration) {
        // if interval, use just start to get closest
        const times = this.usedTimes.time.map((item) => (Array.isArray(item) ? item[0] : item));
        const lastTimeEntry = DateTime.fromISO(times[times.length - 1]);
        const oneYearBefore = lastTimeEntry.minus({ years: 1 });
        // select closest to one year before
        const closestOneYearBefore = times.find((item, i) => (
          i === times.length - 1 || (
            Math.abs(oneYearBefore.toMillis() - DateTime.fromISO(item).toMillis())
            < Math.abs(oneYearBefore.toMillis() - DateTime.fromISO(times[i + 1]).toMillis())
          )
        ));
        // Get index and return object from original times as there are also
        // arrays of time tuple arrays
        const foundIndex = times.indexOf(closestOneYearBefore);
        return this.usedTimes.time[foundIndex];
      }
      // use first time
      return this.usedTimes.time[0];
    },
    refreshLayer(side) {
      // compare(left) or data(right)
      if (side === 'compare' || this.indicator.compareDisplay) {
        if (this.layerDisplay('compare').protocol === 'WMS' && this.$refs.compareLayer) {
          this.$refs.compareLayer.mapObject
            .setParams(this.layerOptions(this.currentCompareTime, this.layerDisplay('compare')));
        } else if (this.layerDisplay('compare').protocol === 'xyz' && this.$refs.compareLayer) {
          this.$refs.compareLayer.mapObject
            .setUrl(this.layerDisplay('compare').url);
        }
        if (!this.customAreaFeatures || this.validDrawnArea) {
          this.fetchFeatures('compare');
        }
        // redraw
        this.compareLayerKey = Math.random();
      }
      if (side === 'data') {
        if (this.layerDisplay('data').protocol === 'WMS' && this.$refs.dataLayer) {
          this.$refs.dataLayer.mapObject
            .setParams(this.layerOptions(this.currentTime, this.layerDisplay('data')));
        } else if (this.layerDisplay('data').protocol === 'xyz' && this.$refs.dataLayer) {
          this.$refs.dataLayer.mapObject
            .setUrl(this.layerDisplay('data').url);
        }
        if (!this.customAreaFeatures || this.validDrawnArea) {
          if (this.featuresClustering) {
            this.$refs.featuresDataCluster.mapObject.clearLayers();
          }
          this.fetchFeatures('data');
        }
        // redraw
        this.dataLayerKey = Math.random();
      }
    },
    fetchFeatures(side) {
      if (this.layerDisplay(side).features) {
        const options = this.layerOptions(side === 'compare' ? this.currentCompareTime : this.currentTime,
          this.layerDisplay(side));
        // add custom area if present
        let customArea = {};
        if (this.validDrawnArea) {
          customArea = typeof this.layerDisplay('data').features.areaFormatFunction === 'function'
            ? this.layerDisplay('data').features.areaFormatFunction(this.drawnArea) : { area: JSON.stringify(this.drawnArea) };
        }
        const templateSubst = {
          ...this.indicator,
          ...options,
          ...customArea,
        };
        const templateRe = /\{ *([\w_ -]+) *\}/g;
        const url = template(templateRe, this.layerDisplay(side).features.url, templateSubst);
        let requestBody = null;
        if (this.layerDisplay(side).features.requestBody) {
          requestBody = {
            ...this.layerDisplay(side).features.requestBody,
          };
          const params = Object.keys(requestBody);
          for (let i = 0; i < params.length; i += 1) {
            // substitute template strings with values
            requestBody[params[i]] = template(templateRe, requestBody[params[i]], templateSubst);
          }
        }
        const requestOpts = {
          credentials: 'same-origin',
          method: this.layerDisplay('data').features.requestMethod || 'GET',
          headers: this.layerDisplay('data').features.requestHeaders || {},
        };
        if (requestBody) {
          requestOpts.body = JSON.stringify(requestBody);
        }
        this.map.fireEvent('dataloading');
        fetch(url, requestOpts).then((r) => r.json())
          .then((rawdata) => {
            // if custom response -> feature mapping function configured, apply it
            if (typeof this.layerDisplay('data').features.callbackFunction === 'function') {
              return this.layerDisplay('data').features.callbackFunction(rawdata);
            }
            return rawdata;
          })
          .then((data) => {
            this.map.fireEvent('dataload');
            this.updateJsonLayers(data, side);
          })
          .catch(() => {
            this.map.fireEvent('dataload');
            this.updateJsonLayers(emptyF, side);
          });
      } else {
        this.updateJsonLayers(emptyF, side);
      }
    },
    fetchCustomAreaIndicator() {
      const options = this.layerOptions(this.currentTime, this.layerDisplay('data'));
      // add custom area if present
      let customArea = {};
      if (this.validDrawnArea) {
        customArea = typeof this.layerDisplay('data').areaIndicator.areaFormatFunction === 'function'
          ? this.layerDisplay('data').areaIndicator.areaFormatFunction(this.drawnArea) : { area: JSON.stringify(this.drawnArea) };
      }
      const templateSubst = {
        ...this.indicator,
        ...options,
        ...customArea,
      };
      const templateRe = /\{ *([\w_ -]+) *\}/g;
      const url = template(templateRe, this.layerDisplay('data').areaIndicator.url, templateSubst);
      let requestBody = null;
      if (this.layerDisplay('data').areaIndicator.requestBody) {
        requestBody = {
          ...this.layerDisplay('data').areaIndicator.requestBody,
        };
        const params = Object.keys(requestBody);
        for (let i = 0; i < params.length; i += 1) {
          // substitute template strings with values
          requestBody[params[i]] = template(templateRe, requestBody[params[i]], templateSubst);
        }
      }
      const requestOpts = {
        credentials: 'same-origin',
        method: this.layerDisplay('data').areaIndicator.requestMethod || 'GET',
        headers: this.layerDisplay('data').areaIndicator.requestHeaders || {},
      };
      if (requestBody) {
        requestOpts.body = JSON.stringify(requestBody);
      }
      this.map.fireEvent('dataloading');
      fetch(url, requestOpts).then((r) => r.json())
        .then((rawdata) => {
          if (typeof this.layerDisplay('data').areaIndicator.callbackFunction === 'function') {
            // merge data from current indicator data and new data from api
            // returns new indicator object to set as custom area indicator
            return this.layerDisplay('data').areaIndicator.callbackFunction(rawdata, this.indicator);
          }
          return rawdata;
        })
        .then((indicator) => {
          this.map.fireEvent('dataload');
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', indicator,
          );
          this.$emit('fetchCustomAreaIndicator');
        })
        .catch((err) => {
          this.map.fireEvent('dataload');
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null,
          );
          console.log(err);
        });
    },
    clearCustomAreaFilter() {
      this.$store.commit('features/SET_SELECTED_AREA', null);
    },
    getDataF() {
      return dataF;
    },
    getCompareF() {
      return compareF;
    },
    updateJsonLayers(ftrs, side) {
      if (this.featuresClustering) {
        // markercluster needs manual adding of all geojsons it will show
        // and cleanup of previous content
        const geojsonFromData = geoJson(ftrs, {
          ...this.featureOptions(side),
          pane: side === 'data' ? this.tooltipPane : this.shadowPane,
        });
        if (side === 'data') {
          if (this.$refs.featuresDataCluster) {
            this.$refs.featuresDataCluster.mapObject.clearLayers();
            this.$refs.featuresDataCluster.mapObject.addLayers([geojsonFromData]);
            this.dataFeaturesNum = ftrs.features.length;
          }
        } else {
          if (this.$refs.featuresDataCluster) {
            this.$refs.featuresCompareCluster.mapObject.clearLayers();
            this.$refs.featuresCompareCluster.mapObject.addLayers([geojsonFromData]);
            this.compareFeaturesNum = ftrs.features.length;
          }
        }
      } else if (side === 'data') {
        // normal geojson layer just needs manual refresh
        this.dataJsonComputed = ftrs;
        this.dataJsonKey = Math.random();
        this.dataFeaturesNum = ftrs.features.length;
      } else {
        this.compareJsonComputed = ftrs;
        this.compareJsonKey = Math.random();
        this.compareFeaturesNum = ftrs.features.length;
      }
    },
  },
  watch: {
    enableCompare(on) {
      if (!on) {
        if (this.slider !== null) {
          if (this.$refs.compareLayer) {
            this.$refs.layersControl.mapObject.removeLayer(this.$refs.compareLayer.mapObject);
          }
          this.map.removeControl(this.slider);
          this.map.removeLayer(this.$refs.compareLayers.mapObject);
        }
      } else {
        if (this.$refs.compareLayer) {
          this.$refs.layersControl.mapObject.addOverlay(this.$refs.compareLayer.mapObject, this.$refs.compareLayer.name); // eslint-disable-line
        }
        this.map.addLayer(this.$refs.compareLayers.mapObject);
        if (!this.customAreaFeatures || this.validDrawnArea) {
          this.fetchFeatures('compare');
        }
        this.$nextTick(() => {
          this.slider.setLeftLayers(this.$refs.compareLayers.mapObject.getLayers());
          this.slider.setRightLayers(this.$refs.dataLayers.mapObject.getLayers());
          this.slider.addTo(this.map);
        });
      }
    },
    drawnArea() {
      // watch on drawn area prop change triggering update of draw layer and fetching custom features
      this.updateSelectedAreaFeature();
    },
  },
};
</script>

<style lang="scss" scoped>
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
::v-deep .mdi-asterisk {
  visibility: hidden;
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
</style>
