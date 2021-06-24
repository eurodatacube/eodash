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
      v-if="mergedConfigs()[0].customAreaIndicator && validDrawnArea && renderTrashBin">
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
      <l-marker-cluster v-if="mergedConfigs()[0].featuresClustering"
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
        :color="appConfig.branding.primaryColor"
        :weight="2"
        :dashArray="'3'"
        :fill="true"
        :fillColor="getAoiFill('data')"
        :fillOpacity="1"
        :pane="tooltipPane"
      >
      </l-circle-marker>
      <!-- XYZ grouping is not implemented yet -->
      <LTileLayer
      v-for="(layerConfig, i) in mergedConfigs().filter(l => l.protocol === 'xyz')"
        ref="dataLayerArrayXYZ"
        :data-key-originalindex="i"
        :key="dataLayerKeyXYZ[i]"
        v-bind="layerConfig"
        :options="layerOptions(currentTime, layerConfig)"
        :pane="overlayPane"
        layer-type="overlay"
      >
      </LTileLayer>
      <template v-if="getCombinedWMSLayers().length > 0">
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
              :options="layerOptions(currentTime, cLayerConfig)"
              :pane="overlayPane"
            >
            </LWMSTileLayer>
          </l-layer-group>
          <LWMSTileLayer
          v-for="layerConfig in this.getSimpleWMSLayers()"
            :key="layerConfig.name"
            v-bind="layerConfig"
            :options="layerOptions(currentTime, layerConfig)"
            :pane="overlayPane"
            layer-type="overlay"
          >
          </LWMSTileLayer>
        </l-layer-group>
      </template>
      <template v-else>
        <LWMSTileLayer
        v-for="layerConfig in this.getSimpleWMSLayers()"
          ref="dataLayerArrayWMS"
          :key="layerConfig.name"
          v-bind="layerConfig"
          :options="layerOptions(currentTime, layerConfig)"
          :pane="overlayPane"
          layer-type="overlay"
        >
        </LWMSTileLayer>
      </template>
    </l-layer-group>
    <l-layer-group ref="compareLayers">
      <!-- XYZ grouping is not implemented yet -->
      <LTileLayer
      v-for="(layerConfig, i) in mergedConfigs('compare').filter(l => l.protocol === 'xyz')"
        ref="compareLayerArrayXYZ"
        :data-key-originalindex="i"
        :key="compareLayerKeyXYZ[i]"
        v-bind="layerConfig"
        :visible="enableCompare"
        :options="layerOptions(currentCompareTime, layerConfig)"
        :pane="overlayPane"
      >
      </LTileLayer>
      <template v-if="getCombinedWMSLayers('compare').length > 0">
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
              :options="layerOptions(currentCompareTime, cLayerConfig)"
              :pane="overlayPane"
            >
            </LWMSTileLayer>
          </l-layer-group>
          <LWMSTileLayer
          v-for="layerConfig in this.getSimpleWMSLayers('compare')"
            :key="layerConfig.name"
            v-bind="layerConfig"
            :visible="enableCompare"
            :options="layerOptions(currentCompareTime, layerConfig)"
            :pane="overlayPane"
          >
          </LWMSTileLayer>
        </l-layer-group>
      </template>
      <template v-else>
        <LWMSTileLayer
        v-for="layerConfig in this.getSimpleWMSLayers('compare')"
          ref="compareLayerArrayWMS"
          :key="layerConfig.name"
          v-bind="layerConfig"
          :visible="enableCompare"
          :options="layerOptions(currentCompareTime, layerConfig)"
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
      <l-marker-cluster v-if="mergedConfigs()[0].featuresClustering"
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
        :color="appConfig.branding.primaryColor"
        :weight="2"
        :dashArray="3"
        :fill="true"
        :fillColor="getAoiFill('compare')"
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
      <img v-if="mergedConfigs()[0].legendUrl"
      :src="mergedConfigs()[0].legendUrl" alt=""
      :class="`map-legend ${$vuetify.breakpoint.xsOnly ? 'map-legend-expanded' :
      (legendExpanded && 'map-legend-expanded')}`"
      @click="legendExpanded = !legendExpanded"
      :style="`background: rgba(255, 255, 255, 0.8);`">
      <div
      v-if="mergedConfigs()[0].customAreaFeatures &&
      (mergedConfigs()[0].features.featureLimit === dataFeaturesCount ||
      mergedConfigs()[0].features.featureLimit === compareFeaturesCount)"
      :style="`width: fit-content; background: rgba(255, 255, 255, 0.8);`"
      >
        <h3 :class="`brand-${appConfig.id} px-3 py-2`">
          Limit of drawn features is for performance reasons set to
          <span :style="`font-size: 17px;`">{{mergedConfigs()[0].features.featureLimit}}
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
        v-if="!mergedConfigs()[0].disableTimeSelection"
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
            v-if="!mergedConfigs()[0].disableCompare">
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
    <l-control-attribution position="bottomright" prefix=''></l-control-attribution>
    <l-control-layers position="topright" ref="layersControl"></l-control-layers>
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
  LFeatureGroup, LControl, LTooltip,
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

import countries from '@/assets/countries.json';
import gsaFile from '@/assets/gsa_data.json';


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
    LTooltip,
    'l-marker-cluster': Vue2LeafletMarkerCluster,
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
        fillOpacity: this.mergedConfigs()[0].subAoiFillOpacity || 0.5,
      };
    },
    baseLayers() {
      // expects an array of objects
      return this.mergedConfigs()[0].baseLayers || this.baseConfig.baseLayersRightMap;
    },
    overlayLayers() {
      return this.mergedConfigs()[0].overlayLayers || this.baseConfig.overlayLayersRightMap;
    },
    mapDefaults() {
      return {
        ...this.baseConfig.mapDefaults,
        ...this.mergedConfigs()[0],
      };
    },
    countrySelection() {
      return this.mergedConfigs()[0].countrySelection;
    },
    borderSelection() {
      return this.mergedConfigs()[0].borderSelection;
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
    customAreaFilter() {
      return this.mergedConfigs()[0].customAreaFeatures
        || this.mergedConfigs()[0].customAreaIndicator;
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
    this.dataLayerIndex = this.usedTimes.time.length - 1;
    this.dataLayerTime = { value: this.usedTimes.time[this.dataLayerIndex] };
    this.compareLayerTime = { value: this.getInitialCompareTime() };
  },
  methods: {
    createLatLng(latlng) {
      const llobj = latlng.split(',').map(Number);
      console.log(llobj);
      return llobj;
    },
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
      if (!this.mergedConfigs()[0].customAreaFeatures || this.validDrawnArea) {
        this.fetchFeatures('data');
      }
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
    featureOptions(side) {
      const style = (this.mergedConfigs(side)[0].features && this.mergedConfigs(side)[0].features.style) ? this.mergedConfigs(side)[0].features.style : {}; // eslint-disable-line
      return {
        onEachFeature: function onEachFeature(feature, layer) {
          // if featuresParameters available, show only properties from mapping, otherwise dump all
          const allowedParams = this.mergedConfigs(side)[0].features ? this.mergedConfigs(side)[0].features.allowedParameters : null; // eslint-disable-line
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
          if (this.mergedConfigs()[0].featuresClustering) {
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
        : this.appConfig.branding.primaryColor;
    },
    subAoiStyle(side) {
      const currentValue = this.getColorCode(side);
      return {
        color: currentValue
          ? this.getIndicatorColor(currentValue)
          : this.appConfig.branding.primaryColor,
        weight: 3,
        fill: false,
      };
    },
    configFromInputData(side) {
      const i = side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
      const inputData = this.usedTimes.inputData.length === 1
        ? this.usedTimes.inputData[0]
        : this.usedTimes.inputData[i];
      if (this.baseConfig.layerNameMapping.hasOwnProperty(inputData)) { // eslint-disable-line
        let config = this.baseConfig.layerNameMapping[inputData];
        if (!Array.isArray(config)) {
          // assure array is returned
          config = [config];
        }
        return config;
      }
      // empty config used later for merging
      return [];
    },
    getCombinedWMSLayers(side) {
      const combLayers = this.mergedConfigs(side).filter((l) => (
        l.protocol === 'WMS' && Object.keys(l).indexOf('combinedLayers') !== -1
      ));
      return combLayers;
    },
    getSimpleWMSLayers(side) {
      const combLayers = this.mergedConfigs(side).filter((l) => (
        l.protocol === 'WMS' && Object.keys(l).indexOf('combinedLayers') === -1
      ));
      return combLayers;
    },
    mergedConfigs(side = 'data') {
      // first check if special compare layer configured
      let displayTmp = side === 'compare' && this.indicator.compareDisplay ? this.indicator.compareDisplay : this.indicator.display;
      // following configuration merging is done:
      // defaultLayersDisplay (to avoid having to configure it before)
      // indDefinition - indicator code specific configuration
      // display - coming from js configuration - esa.js OR
      // configFromInputData - coming from input data reference from csvs

      if (displayTmp) {
        // from layer configuration
        if (!Array.isArray(displayTmp)) {
          // always make an Array of layer configurations
          displayTmp = [displayTmp];
        }
      }
      const finalConfigs = [];
      let usedConfigForMerge = {};
      let name = this.indicator.description;

      if (!displayTmp && this.configFromInputData(side).length === 0) {
        // no additional config specified, use defaults
        usedConfigForMerge = [{ name }];
      } else if (!displayTmp) {
        // use configFromInputData
        usedConfigForMerge = this.configFromInputData(side);
      } else {
        // use displayTmp even if configFromInputData set too
        usedConfigForMerge = displayTmp;
      }
      usedConfigForMerge.forEach((item) => {
        // merge configs for each layer
        name = item.name || name;
        // Check to see if we have grouped layers, if we do we need to add
        // the default to them too
        const extendedItem = item;
        if (Object.keys(item).indexOf('combinedLayers') !== -1) {
          for (let i = 0; i < item.combinedLayers.length; i += 1) {
            extendedItem.combinedLayers[i] = {
              ...this.baseConfig.defaultLayersDisplay,
              ...this.indDefinition,
              ...item.combinedLayers[i],
            };
          }
        }
        finalConfigs.push({
          ...this.baseConfig.defaultLayersDisplay,
          ...this.indDefinition,
          ...extendedItem,
          name,
        });
      });
      return finalConfigs;
    },
    flyToBounds() {
      // zooms to subaoi if present or area around aoi if not
      const boundsPad = this.mergedConfigs()[0].largeSubAoi ? 5 : (this.mergedConfigs()[0].midSubAoi ? 1 : 0.15); // eslint-disable-line
      if (this.subAoi && this.subAoi.features.length > 0) {
        const viewBounds = this.mergedConfigs()[0].presetView
          ? geoJson(this.mergedConfigs()[0].presetView).getBounds()
          : geoJson(this.subAoi).getBounds();
        const bounds = geoJson(this.subAoi).getBounds();
        const cornerMax1 = latLng([bounds.getSouth() - boundsPad, bounds.getWest() - boundsPad]);
        const cornerMax2 = latLng([bounds.getNorth() + boundsPad, bounds.getEast() + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.fitBounds(viewBounds);
        // limit user movement around map
        this.map.setMaxBounds(boundsMax);
        if (this.mergedConfigs()[0].largeSubAoi) {
          this.map.setMinZoom(2);
        } else if (this.mergedConfigs()[0].midSubAoi) {
          this.map.setMinZoom(9);
        } else {
          this.map.setMinZoom(13);
        }
      } else if (this.mergedConfigs()[0].presetView) {
        // if only preset view move map there without limiting movement
        const viewBounds = geoJson(this.mergedConfigs()[0].presetView).getBounds();
        this.map.fitBounds(viewBounds);
      } else if (this.aoi) {
        const cornerMax1 = latLng([this.aoi.lat - boundsPad, this.aoi.lng - boundsPad]);
        const cornerMax2 = latLng([this.aoi.lat + boundsPad, this.aoi.lng + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.setZoom(16);
        this.map.panTo(this.aoi);
        if (this.mergedConfigs()[0].largeSubAoi) {
          this.map.setMinZoom(2);
        } else if (this.mergedConfigs()[0].midSubAoi) {
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
        if (this.mergedConfigs()[0].mapTimeLabelExtended) {
          return time.map((d) => DateTime.fromISO(d).toISO({ suppressMilliseconds: true })).join(' - ');
        }
        return time.map((d) => DateTime.fromISO(d).toISODate()).join(' - ');
      } else if (time instanceof DateTime) { // eslint-disable-line no-else-return
        if (this.mergedConfigs()[0].mapTimeLabelExtended) {
          return time.toISO({ suppressMilliseconds: true });
        }
        return time.toISODate();
      }
      if (this.mergedConfigs()[0].mapTimeLabelExtended) {
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
      if (typeof sourceOptionsObj.bounds !== 'undefined') {
        additionalSettings.bounds = sourceOptionsObj.bounds;
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
      this.refreshLayers('data');
      this.$nextTick(() => {
        this.slider.setRightLayers(
          this.extractActualLayers(this.$refs.dataLayers),
        );
      });
      if (this.indicator.compareDisplay) {
        // shared time on both sides in case of compareDisplay being set
        this.compareLayerTime = this.dataLayerTime;
        this.compareLayerIndex = newIndex;
        this.refreshLayers('compare');
        this.$nextTick(() => {
          this.slider.setLeftLayers(
            this.extractActualLayers(this.$refs.compareLayers),
          );
        });
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
      this.refreshLayers('compare');
      this.$nextTick(() => {
        this.slider.setLeftLayers(
          this.extractActualLayers(this.$refs.compareLayers),
        );
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
      if (this.mergedConfigs()[0].largeTimeDuration) {
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
    refreshGroup(group, time) {
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
                subItem.mapObject.setParams(this.layerOptions(
                  time, subItem.$options.propsData,
                ));
                // force redraw of layer
                subItem.$forceUpdate();
              });
            } else {
              const originalConfig = this.mergedConfigs().find((config) => (
                config.name === item.name
              ));
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
        this.refreshGroup(this.$refs.compareLayerArrayWMS, this.currentCompareTime);
        if (this.$refs.compareLayerArrayXYZ) {
          this.$refs.compareLayerArrayXYZ.forEach((item) => {
            const originalIndex = parseInt(item.$attrs['data-key-originalindex'], 10);
            this.compareLayerKeyXYZ[originalIndex] = Math.random();
          });
        }
        if (!this.mergedConfigs()[0].featuresStatic
          && (!this.mergedConfigs()[0].customAreaFeatures || this.validDrawnArea)) {
          if (this.mergedConfigs()[0].featuresClustering) {
            this.$refs.featuresCompareCluster.mapObject.clearLayers();
          }
          this.fetchFeatures('compare');
        }
      }
      if (side === 'data') {
        this.refreshGroup(this.$refs.dataLayerArrayWMS, this.currentTime);
        if (this.$refs.dataLayerArrayXYZ) {
          this.$refs.dataLayerArrayXYZ.forEach((item) => {
            const originalIndex = parseInt(item.$attrs['data-key-originalindex'], 10);
            this.dataLayerKeyXYZ[originalIndex] = Math.random();
          });
        }
        if (!this.mergedConfigs()[0].featuresStatic
          && (!this.mergedConfigs()[0].customAreaFeatures || this.validDrawnArea)) {
          if (this.mergedConfigs()[0].featuresClustering) {
            this.$refs.featuresDataCluster.mapObject.clearLayers();
          }
          this.fetchFeatures('data');
        }
      }
    },
    fetchFeatures(side) {
      if (this.mergedConfigs(side)[0].features) {
        const options = this.layerOptions(side === 'compare' ? this.currentCompareTime : this.currentTime,
          this.mergedConfigs(side)[0]);
        // add custom area if present
        let customArea = {};
        if (this.validDrawnArea) {
          customArea = typeof this.mergedConfigs()[0].features.areaFormatFunction === 'function'
            ? this.mergedConfigs()[0].features.areaFormatFunction(this.drawnArea)
            : { area: JSON.stringify(this.drawnArea) };
        }
        const templateSubst = {
          ...this.indicator,
          ...options,
          ...customArea,
        };
        const templateRe = /\{ *([\w_ -]+) *\}/g;
        const url = template(templateRe, this.mergedConfigs()[0].features.url, templateSubst);
        let requestBody = null;
        if (this.mergedConfigs()[0].features.requestBody) {
          requestBody = {
            ...this.mergedConfigs()[0].features.requestBody,
          };
          const params = Object.keys(requestBody);
          for (let i = 0; i < params.length; i += 1) {
            // substitute template strings with values
            requestBody[params[i]] = template(templateRe, requestBody[params[i]], templateSubst);
          }
        }
        const requestOpts = {
          credentials: 'same-origin',
          method: this.mergedConfigs()[0].features.requestMethod || 'GET',
          headers: this.mergedConfigs()[0].features.requestHeaders || {},
        };
        if (requestBody) {
          requestOpts.body = JSON.stringify(requestBody);
        }
        this.map.fireEvent('dataloading');
        fetch(url, requestOpts).then((r) => r.json())
          .then((rawdata) => {
            // if custom response -> feature mapping function configured, apply it
            if (typeof this.mergedConfigs()[0].features.callbackFunction === 'function') {
              return this.mergedConfigs()[0].features.callbackFunction(rawdata);
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
    selectGSAIndicator(feature) {
      this.selectedBorder = feature.borderId;
      const dataUrl = `./eodash-data/internal/${feature.borderId}.json`;
      this.map.fireEvent('dataloading');
      fetch(dataUrl).then((r) => r.json())
        .then((indicator) => {
          const returnIndicator = {};
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
          this.map.fireEvent('dataload');
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', returnIndicator,
          );
          this.$emit('fetchCustomAreaIndicator');
        })
        .catch((err) => {
          this.map.fireEvent('dataload');
          // It seems data could not be loaded lets show a no data found message
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', { isEmpty: true },
          );
          console.log(err);
        });
    },
    fetchMobilityData(countryCode, aoiID) {
      const dataUrl = `./eodash-data/internal/${countryCode}-${aoiID}.json`;
      this.map.fireEvent('dataloading');
      fetch(dataUrl).then((r) => r.json())
        .then((indicator) => {
          indicator.indicator = aoiID; // eslint-disable-line
          indicator.time = indicator.Values.map((row) => DateTime.fromISO(row.date)); // eslint-disable-line
          indicator.measurement = [0]; // eslint-disable-line
          indicator.country = indicator.CountryCode; // eslint-disable-line
          indicator.title = indicator.CountryName; // eslint-disable-line
          indicator.yAxis = this.indicator.yAxis; // eslint-disable-line
          this.map.fireEvent('dataload');
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', indicator,
          );
          this.$emit('fetchCustomAreaIndicator');
        })
        .catch((err) => {
          this.map.fireEvent('dataload');
          // It seems data could not be loaded lets show a no data found message
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', { isEmpty: true },
          );
          console.log(err);
        });
    },
    fetchCustomAreaIndicator() {
      const options = this.layerOptions(this.currentTime, this.mergedConfigs()[0]);
      // add custom area if present
      let customArea = {};
      if (this.validDrawnArea) {
        customArea = typeof this.mergedConfigs()[0].areaIndicator.areaFormatFunction === 'function'
          ? this.mergedConfigs()[0].areaIndicator.areaFormatFunction(this.drawnArea)
          : { area: JSON.stringify(this.drawnArea) };
      }
      this.indicator.title = 'User defined area of interest';
      const templateSubst = {
        ...this.indicator,
        ...options,
        ...customArea,
      };
      const templateRe = /\{ *([\w_ -]+) *\}/g;
      const url = template(templateRe, this.mergedConfigs()[0].areaIndicator.url, templateSubst);
      let requestBody = null;
      if (this.mergedConfigs()[0].areaIndicator.requestBody) {
        requestBody = {
          ...this.mergedConfigs()[0].areaIndicator.requestBody,
        };
        const params = Object.keys(requestBody);
        for (let i = 0; i < params.length; i += 1) {
          // substitute template strings with values
          if (typeof requestBody[params[i]] === 'string') {
            requestBody[params[i]] = template(templateRe, requestBody[params[i]], templateSubst);
          }
          // Convert geojsons back to an object
          if (params[i] === 'geojson') {
            requestBody[params[i]] = JSON.parse(requestBody[params[i]]);
          }
        }
      }
      const requestOpts = {
        credentials: 'same-origin',
        method: this.mergedConfigs()[0].areaIndicator.requestMethod || 'GET',
        headers: this.mergedConfigs()[0].areaIndicator.requestHeaders || {},
      };
      if (requestBody) {
        requestOpts.body = JSON.stringify(requestBody);
      }
      this.map.fireEvent('dataloading');
      fetch(url, requestOpts).then((r) => r.json())
        .then((rawdata) => {
          if (typeof this.mergedConfigs()[0].areaIndicator.callbackFunction === 'function') {
            // merge data from current indicator data and new data from api
            // returns new indicator object to set as custom area indicator
            return this.mergedConfigs()[0].areaIndicator.callbackFunction(rawdata, this.indicator);
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
      if (this.mergedConfigs()[0].featuresClustering) {
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
          } else {
            this.$refs.featuresCompareCluster.mapObject.clearLayers();
            this.$refs.featuresCompareCluster.mapObject.addLayers([geojsonFromData]);
            this.compareFeaturesCount = ftrs.features.length;
          }
        }
      } else if (side === 'data') {
        // normal geojson layer just needs manual refresh
        this.dataJsonComputed = ftrs;
        this.dataJsonKey = Math.random();
        this.dataFeaturesCount = ftrs.features.length;
      } else {
        this.compareJsonComputed = ftrs;
        this.compareJsonKey = Math.random();
        this.compareFeaturesCount = ftrs.features.length;
      }
    },
  },
  watch: {
    enableCompare(on) {
      if (!on) {
        if (this.slider !== null) {
          this.map.removeControl(this.slider);
          this.map.removeLayer(this.$refs.compareLayers.mapObject);
        }
      } else {
        this.map.addLayer(this.$refs.compareLayers.mapObject);
        if (!this.mergedConfigs()[0].customAreaFeatures || this.validDrawnArea) {
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
      }
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

::v-deep .leaflet-top.leaflet-right {
  margin-top: 45px;
}
</style>
