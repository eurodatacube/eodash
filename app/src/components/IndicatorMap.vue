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
              dark
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
    <LTileLayer
      v-for="layer in baseLayers"
      v-bind="layer"
      ref="baseLayers"
      layer-type="base"
      :key="layer.name"
      :opacity="opacityTerrain[zoom]"
      :options="layerOptions(null, layer)"
    >
    </LTileLayer>
    <l-layer-group ref="dataLayers">
      <l-geo-json
      ref="subaoiLayer"
      :geojson="indicator.subAoi"
      :pane="tooltipPane"
      :optionsStyle="subAoiStyle('data')"
      >
      </l-geo-json>
      <l-marker-cluster v-if="featuresClustering"
        ref="featuresDataCluster"
        :options="clusterOptions">
        <l-geo-json
          ref="featureJsonData"
          v-for="geoJson in featureJson.data.features"
          :key="geoJson.properties.id" :geojson="geoJson"
          :options="featureOptions('data')"
          :pane="tooltipPane"
        >
        </l-geo-json>
      </l-marker-cluster>
      <l-geo-json
          v-else
          ref="featureJsonData"
          v-for="geoJson in featureJson.data.features"
          :key="geoJson.properties.id" :geojson="geoJson"
          :options="featureOptions('data')"
          :pane="tooltipPane"
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
      v-if="layerDisplay('data').protocol === 'xyz'"
        ref="dataLayer"
        :key="dataLayerKey"
        v-bind="layerDisplay('data')"
        :options="layerOptions(currentTime, layerDisplay('data'))"
        :pane="overlayPane"
        layer-type="overlay"
      >
      </LTileLayer>
      <LWMSTileLayer
      v-else-if="layerDisplay('data').protocol === 'WMS'"
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
        v-if="layerDisplay('compare').protocol === 'xyz'"
        ref="compareLayer"
        :key="compareLayerKey"
        v-bind="layerDisplay('compare')"
        :visible="enableCompare"
        :options="layerOptions(currentCompareTime, layerDisplay('compare'))"
        :pane="overlayPane"
      >
      </LTileLayer>
      <LWMSTileLayer
      v-else-if="layerDisplay('compare').protocol === 'WMS'"
        ref="compareLayer"
        :key="compareLayerKey"
        v-bind="layerDisplay('compare')"
        :visible="enableCompare"
        :options="layerOptions(currentCompareTime, layerDisplay('compare'))"
        :pane="overlayPane"
      >
      </LWMSTileLayer>
      <l-geo-json
        ref="subaoiCompareLayer"
        :geojson="indicator.subAoi"
        :pane="shadowPane"
        :visible="enableCompare"
        :optionsStyle="subAoiStyle('compare')"
      >
      </l-geo-json>
      <l-marker-cluster v-if="featuresClustering"
        ref="featuresCompareCluster" :options="clusterOptions">
        <l-geo-json
          ref="featureJsonCompare"
          :visible="enableCompare"
          v-for="geoJson in featureJson.compare.features"
          :key="geoJson.properties.id" :geojson="geoJson"
          :options="featureOptions('compare')"
          :pane="shadowPane"
        >
        </l-geo-json>
      </l-marker-cluster>
      <l-geo-json
        v-else
        ref="featureJsonCompare"
        :visible="enableCompare"
        v-for="geoJson in featureJson.compare.features"
        :key="geoJson.properties.id" :geojson="geoJson"
        :options="featureOptions('compare')"
        :pane="shadowPane"
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
      v-for="layer in overlayLayers"
      :key="layer.name"
      v-bind="layer"
      :pane="markerPane"
      :opacity="opacityOverlay[zoom]"
      :options="layerOptions(null, layer)"
      layer-type="overlay"
    >
    </LTileLayer>
    <img v-if="layerDisplay('data').legendUrl"
    :src="layerDisplay('data').legendUrl" alt=""
      style="position: absolute; width: 250px; z-index: 700;
      top: 10px; left: 10px; background: rgba(255, 255, 255, 0.8); ">
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
      <v-row
        v-if="!disableTimeSelection"
        class="justify-center align-center timeSelection"
        :class="enableCompare && !indicator.compareDisplay && 'mr-5 ml-0'"
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
      </v-row>
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

const emptyF = {
  type: 'FeatureCollection',
  features: [],
};

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
      dasharrayPoi: '3',
      zoom: null,
      center: null,
      bounds: null,
      enableCompare: false,
      fetchDataClicked: false,
      opacityTerrain: [1],
      opacityOverlay: [1],
      tilePane: 'tilePane',
      overlayPane: 'overlayPane',
      markerPane: 'markerPane',
      shadowPane: 'shadowPane',
      tooltipPane: 'tooltipPane',
      popupPane: 'popupPane',
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
      featureJson: {
        data: emptyF,
        compare: emptyF,
      },
    };
  },
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapGetters('indicators', [
      'getIndicatorFilteredInputData',
    ]),
    baseLayers() {
      return [
        ...this.baseConfig.baseLayers,
        ...(this.layerDisplay('data').baseLayers || []),
      ];
    },
    overlayLayers() {
      return this.baseConfig.overlayLayers;
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
    indicatorsDefinition() {
      return this.baseConfig.indicatorsDefinition;
    },
    indDefinition() {
      return this.indicatorsDefinition[this.indicator.indicator];
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
    customAreaFilter() {
      return (this.layerDisplay('data') && typeof this.layerDisplay('data').customAreaFilter !== 'undefined') ? this.layerDisplay('data').customAreaFilter : this.indDefinition.customAreaFilter;
    },
    featuresClustering() {
      return (this.layerDisplay('data') && typeof this.layerDisplay('data').featuresClustering !== 'undefined') ? this.layerDisplay('data').featuresClustering : this.indDefinition.featuresClustering;
    },
    usedTimes() {
      let times = this.indicator.time;
      if (this.layerDisplay('data').replaceDataMap && this.layerDisplay('data').replaceDataMap.time) {
        times = this.layerDisplay('data').replaceDataMap.time;
      }
      return times;
    },
    usedEoSensor() {
      let eoSensor = Array.isArray(this.indicator.eoSensor) && this.indicator.eoSensor;
      if (this.layerDisplay('data').replaceDataMap && this.layerDisplay('data').replaceDataMap.eoSensor) {
        eoSensor = this.layerDisplay('data').replaceDataMap.eoSensor;
      }
      return eoSensor;
    },
    arrayOfObjects() {
      const selectionOptions = [];
      for (let i = 0; i < this.usedTimes.length; i += 1) {
        let label = this.getTimeLabel(this.usedTimes[i]);
        if (this.usedEoSensor) {
          label += ` - ${this.usedEoSensor[i]}`;
        }
        selectionOptions.push({
          value: this.usedTimes[i],
          name: label,
        });
      }
      return selectionOptions;
    },
    currentTime() {
      let returnTime = this.usedTimes[this.usedTimes.length - 1];
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
    clusterOptions() {
      return {
        disableClusteringAtZoom: 13,
        animate: false,
        // zoomToBoundsOnClick: false,
        iconCreateFunction: function (cluster) { // eslint-disable-line func-names
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
              color: '#75e6b5',
            },
          },
          rectangle: {
            showArea: false,
            shapeOptions: {
              color: '#75e6b5',
            },
          },
        },
      };
    },
  },
  mounted() {
    this.dataLayerIndex = this.usedTimes.length - 1;
    this.dataLayerTime = { value: this.usedTimes[this.dataLayerIndex] };
    this.compareLayerTime = { value: this.getInitialCompareTime() };
    this.$nextTick(() => {
      const layerButtons = document.querySelectorAll('.leaflet-control-layers-toggle');
      layerButtons.forEach((lB) => lB.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${this.appConfig.branding.primaryColor}" width="32px" height="32px"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>`); // eslint-disable-line

      this.$refs.subaoiLayer.mapObject.bindTooltip('Reference area', {
        direction: 'top',
        pane: this.popupPane,
      });
      this.$refs.subaoiCompareLayer.mapObject.bindTooltip('Reference area', {
        direction: 'top',
        pane: this.popupPane,
      });
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
        // add newly drawn layer to layer group
        this.$refs.customAreaFilterFeatures.mapObject.addLayer(e.layer);
        // set global area as json
        this.$store.commit('features/SET_SELECTED_AREA', e.layer.toGeoJSON());
      }.bind(this)); // eslint-disable-line
      // only draw one feature at a time
      this.map.on(L.Draw.Event.DRAWSTART, function () { // eslint-disable-line
        this.clearCustomAreaFilter();
      }.bind(this));

      this.map.on(L.Draw.Event.DRAWSTOP, function () { // eslint-disable-line
        this.featureJson.data = emptyF;
        this.featureJson.compare = emptyF;
        if (this.featuresClustering) {
          this.$refs.featuresDataCluster.mapObject.clearLayers();
          this.$refs.featuresCompareCluster.mapObject.clearLayers();
        }
        if (this.fetchDataClicked) {
          this.fetchFeatures('data');
          if (this.enableCompare) {
            this.fetchFeatures('compare');
          }
        }
      }.bind(this));

      if (this.customAreaFilter) {
        this.drawControl.addTo(this.map);
        this.renderTrashBin = true;
        let ftrs = null;
        if (this.validDrawnArea) {
          const jsonGeom = this.drawnArea;
          ftrs = [{
            type: 'Feature',
            properties: {},
            geometry: jsonGeom,
          }];
        }
        if (ftrs) {
          this.$refs.customAreaFilterFeatures.mapObject.addLayer(geoJson(ftrs, {
            style: {
              color: '#75e6b5',
            },
          }));
        }
      }
      this.onResize();
      if (!this.customAreaFilter) {
        this.fetchFeatures('data');
      }
      setTimeout(() => {
        this.flyToBounds();
      }, 100);
    });
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
    },
    onResize() {
      // to fix panel size for reference image window
      if (this.map) {
        this.map._onResize();
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
          layer.getLatLng = () => { return geoJson(feature).getBounds().getCenter(); };
          layer.setLatLng = () => { };
          layer._latlng = layer.getLatLng();
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
      const index = side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
      let currentValue = null;
      // compensate for color code with only one entry, still showing it
      if (this.indicator && this.indicator.colorCode) {
        const colors = this.indicator.colorCode;
        if (Array.isArray(colors) && colors.length === 1) {
          currentValue = colors[0]; // eslint-disable-line prefer-destructuring
        } else if (Array.isArray(colors) && colors[index]) {
          currentValue = colors[index]; // eslint-disable-line prefer-destructuring
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
      const index = side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
      const inputData = this.indicator.inputData[index];
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
      const boundsPad = this.indDefinition.largeSubAoi ? 5 : 0.15;
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
        } else {
          this.map.setMinZoom(13);
        }
      } else if (this.aoi) {
        const cornerMax1 = latLng([this.aoi.lat - boundsPad, this.aoi.lng - boundsPad]);
        const cornerMax2 = latLng([this.aoi.lat + boundsPad, this.aoi.lng + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.setZoom(18);
        this.map.panTo(this.aoi);
        if (this.indDefinition.largeSubAoi) {
          this.map.setMinZoom(2);
        } else {
          // might need tweaking further on
          this.map.setMinZoom(14);
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
        const converted = time.map((d) => DateTime.fromISO(d).toISODate());
        return converted.join(' - ');
      } else if (time instanceof DateTime) { // eslint-disable-line no-else-return
        return time.toISODate();
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
        const times = this.usedTimes.map((item) => (Array.isArray(item) ? item[0] : item));
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
        return this.usedTimes[foundIndex];
      }
      // use first time
      return this.usedTimes[0];
    },
    refreshLayer(side) {
      // compare(left) or data(right)
      if (side === 'compare' || this.indicator.compareDisplay) {
        if (this.layerDisplay('compare').protocol === 'WMS') {
          this.$refs.compareLayer.mapObject
            .setParams(this.layerOptions(this.currentCompareTime, this.layerDisplay('compare')));
        } else if (this.layerDisplay('compare').protocol === 'xyz') {
          this.$refs.compareLayer.mapObject
            .setUrl(this.layerDisplay('compare').url);
        }
        if (this.fetchDataClicked || !this.customAreaFilter) {
          this.fetchFeatures('compare');
          this.featureJson.compare = emptyF;
          if (this.featuresClustering) {
            this.$refs.featuresCompareCluster.mapObject.clearLayers();
          }
        }
        // redraw
        this.compareLayerKey = Math.random();
      }
      if (side === 'data') {
        if (this.layerDisplay('data').protocol === 'WMS') {
          this.$refs.dataLayer.mapObject
            .setParams(this.layerOptions(this.currentTime, this.layerDisplay('data')));
        } else if (this.layerDisplay('data').protocol === 'xyz') {
          this.$refs.dataLayer.mapObject
            .setUrl(this.layerDisplay('data').url);
        }
        if (this.fetchDataClicked || !this.customAreaFilter) {
          this.featureJson.data = emptyF;
          if (this.featuresClustering) {
            this.$refs.featuresDataCluster.mapObject.clearLayers()
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
        fetch(url, requestOpts).then((r) => r.json())
          .then((rawdata) => {
            // if custom response -> feature mapping function configured, apply it
            if (typeof this.layerDisplay('data').features.callbackFunction === 'function') {
              return this.layerDisplay('data').features.callbackFunction(rawdata);
            }
            return rawdata;
          })
          .then((data) => {
            this.featureJson[side] = data;
          })
          .catch(() => {
            this.featureJson[side] = emptyF;
          });
      } else {
        this.featureJson[side] = emptyF;
      }
    },
    fetchCustomAreaFeatures() {
      if (!this.fetchDataClicked) {
        this.fetchDataClicked = true;
      }
      this.fetchFeatures('data');
      if (this.enableCompare) {
        this.fetchFeatures('compare');
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
          this.$store.commit(
            'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', indicator,
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    refreshBaselayersSelection() {
      /*
       if there were additional baseLayers added on top of default ones in previous indicator
       new baseLayer probably had visible:true set
       if you manually de-select and select this new baseLayer via layers control
       and newly selected indicator does not have it configured
       no baseLayer is selected in the map, even though default visible property
       is applied to respective this.$refs.baseLayers entity (terrain light)
       this code re-selects the terrain light via layer selection control
      */
      // find HTML element <label> in layer control selection which contains "Terrain light" in it
      const baseLayerLabelsLayerSel = this.$refs.layersControl.mapObject._baseLayersList.children;
      // check if additional baseLayer is going to be removed in current map tick
      if (baseLayerLabelsLayerSel.length !== this.baseLayers.length) {
        for (let i = 0; i < baseLayerLabelsLayerSel.length; i++) {
          // if span in layer selection div contains string
          if (baseLayerLabelsLayerSel[i].children[0].children[1].innerHTML.includes('Terrain')) {
            // click on respective radio input button to re-enable default layer
            baseLayerLabelsLayerSel[i].children[0].children[0].click();
          }
        }
      }
    },
    clearCustomAreaFilter() {
      this.$refs.customAreaFilterFeatures.mapObject.clearLayers();
      this.$store.commit('features/SET_SELECTED_AREA', null);
    },
  },
  watch: {
    enableCompare(on) {
      if (!on) {
        if (this.slider !== null) {
          this.$refs.layersControl.mapObject.removeLayer(this.$refs.compareLayer.mapObject);
          this.map.removeControl(this.slider);
          this.map.removeLayer(this.$refs.compareLayers.mapObject);
        }
      } else {
        this.fetchFeatures('compare');
        this.$refs.layersControl.mapObject.addOverlay(this.$refs.compareLayer.mapObject, this.$refs.compareLayer.name); // eslint-disable-line
        this.map.addLayer(this.$refs.compareLayers.mapObject);
        this.$nextTick(() => {
          this.slider.setLeftLayers(this.$refs.compareLayers.mapObject.getLayers());
          this.slider.setRightLayers(this.$refs.dataLayers.mapObject.getLayers());
          this.slider.addTo(this.map);
        });
      }
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
.timeSelection {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.65);
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
  background-color: rgba(#72a875, 0.5);
  div {
    background-color: var(--v-success-base);
    span {
      color: white;
    }
  }
}
</style>
