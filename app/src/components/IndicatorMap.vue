<template>
  <div ref="container" class="d-flex justify-center" style="height: 100%; width: 100%;">
    <DataMap
      ref="map"
      v-if="mapDataReady"
      :mapId="mapId"
      style="height: 100%; min-width: 100%; background: #cad2d3; z-index: 1;"
      :options="defaultMapOptions"
      :maxZoom="mapDefaults.maxMapZoom"
      :minZoom="minZoom"
      :zoomExtent="zoomExtent"
      :constrainExtent="constrainExtent"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      v-resize="onResize"
      :center="center"
      :zoom="zoom"
      :overlayConfigs="overlayLayers"
      :baseLayerConfigs="baseLayers"
      @ready="onMapReady()"
    />
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
    </div>
    <indicator-time-selection
      ref="timeSelection"
      class=""
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
</template>

<script>
// Utilities
import {
  mapState,
  mapGetters,
} from 'vuex';
import { geoJson, circleMarker } from 'leaflet';
import DataMap from '@/components/map/DataMap.vue';
import { DateTime } from 'luxon'; // TODO: MIGRATE
import axios from 'axios';
import turfDifference from '@turf/difference';
import GeoJSON from 'ol/format/GeoJSON';
import getMapInstance from '@/components/map/map';
import {
  createConfigFromIndicator,
  createAvailableTimeEntries,
} from '@/helpers/mapConfig';
import fetchCustomAreaObjects from '@/helpers/customAreaObjects';
import { transformExtent } from 'ol/proj';
import IndicatorTimeSelection from './IndicatorTimeSelection.vue';

const emptyF = {
  type: 'FeatureCollection',
  features: [],
};

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});

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
    DataMap,
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
    mapId() {
      return this.$route.query.poi;
    },
    mapDataReady() {
      return !!(this.indicator && this.indicator.dataLoadFinished);
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
    subAoiLayerConfigs() {
      if (this.subAoiInverse) {
        return [{
          protocol: 'GeoJSON',
          name: 'Reference Area Overlay',
          data: {
            type: 'FeatureCollection',
            features: [this.subAoiInverse],
          },
          visible: true,
          style: this.subAoiStyle('data'),
        }];
      }
      return [];
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
      const overlayLayers = this.mergedConfigsData[0].overlayLayers
        || this.baseConfig.overlayLayersRightMap;
      return [...this.subAoiLayerConfigs, ...overlayLayers, this.mergedConfigsData[0]];
    },
    mapDefaults() {
      return {
        ...this.baseConfig.mapDefaults,
        ...this.mergedConfigsData[0],
      };
    },
    minZoom() {
      if (this.subAoi || this.aoi) {
        if (this.mergedConfigsData[0].largeSubAoi) {
          return 2;
        } if (this.mergedConfigsData[0].midSubAoi) {
          return 9;
        }
        if ((!this.subAoi.features || !this.subAoi.features.length)) {
          return 0;
        }
        return 13;
      }
      return this.mapDefaults.minMapZoom;
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
      if (this.subAoi && this.subAoi.features.length) {
        const subaoiInv = JSON.parse(JSON.stringify(this.subAoi.features[0]));
        // both Object.assign({}, this.subAoi) and { ...this.subAoi } create shallow copy
        if (subaoiInv) {
          const globalBox = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
            },
          };
          const diff = turfDifference(globalBox, subaoiInv.geometry);
          subaoiInv.geometry = diff.geometry;
        }
        return subaoiInv;
      }
      return null;
    },
    zoomExtent() {
      // extent to be zoomed to on mount. Padding will be applied.
      if (this.subAoi && this.subAoi.features.length) {
        if (this.subAoi.features[0].geometry.coordinates.length) {
          const subAoiGeom = geoJsonFormat.readGeometry(this.subAoi.features[0].geometry);
          return subAoiGeom.getExtent();
        }
        // geoJsonFormat
        return []; // this.subAoi[0].getGeometry().getExtent();
      }
      if (this.mergedConfigsData[0].presetView) {
        // pre-defined geojson view
        const presetViewGeom = geoJsonFormat.readGeometry(this.mergedConfigsData[0]
          .presetView.features[0].geometry);
        return presetViewGeom.getExtent();
      }
      if (this.aoi) {
        return transformExtent([this.aoi.lng, this.aoi.lat, this.aoi.lng, this.aoi.lat],
          'EPSG:4326',
          'EPSG:3857');
      }
      // if nothing else, fit to default bounds
      const { bounds } = this.mapDefaults;
      return transformExtent([bounds._southWest.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._northEast.lat], 'EPSG:4326',
        'EPSG:3857');
    },
    constrainExtent() {
      // constraining extent, map can not be moved past the bound of this extent.
      if (this.subAoi) {
        return this.zoomExtent;
      }
      return null;
    },
    selectedTime() {
      return this.$store.state.indicators.selectedTime;
    },
  },
  mounted() {
    // this.calculateExtents();
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

    if (this.compareLayerTimeProp) {
      this.$nextTick(() => { this.enableCompare = true; });
    }
  },
  destroyed() {
    delete this.ro;
  },
  methods: {
    focusSelect() {
      // TO DO: handle scrolling?
      /* const lMap = this.$refs.map.mapObject;
      if (on) {
        lMap.scrollWheelZoom.disable();
      } else {
        lMap.scrollWheelZoom.enable();
      } */
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
      // add A/B slider
      /* const leftLayers = this.extractActualLayers(this.$refs.compareLayers);
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
      }.bind(this)); */

      this.initialDrawSelectedArea();
      this.onResize();
      if (!this.mergedConfigsData[0].customAreaFeatures || this.validDrawnArea) {
        this.fetchFeatures('data');
      }
      this.$emit('ready');
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
      const res = await axios.post('https://staging-raster.delta-backend.xyz/mosaic/register', {
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
        /* this.$nextTick(() => {
          this.slider.setLeftLayers(
            this.extractActualLayers(this.$refs.compareLayers),
          );
        }); */
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
        this.$store.commit('indicators/SET_SELECTED_TIME', this.availableTimeEntries[newIndex].value);
        this.refreshLayers('data');
        /* this.$nextTick(() => {
          this.slider.setRightLayers(
            this.extractActualLayers(this.$refs.dataLayers),
          );
        }); */
        if (this.indicator.compareDisplay) {
          // shared time on both sides in case of compareDisplay being set
          this.compareLayerTime = this.dataLayerTime;
          this.refreshLayers('compare');
          /* this.$nextTick(() => {
            this.slider.setLeftLayers(
              this.extractActualLayers(this.$refs.compareLayers),
            );
          }); */
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
      // TO DO: is this obsolete?
      // layers should be redrawn in store watcher
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
    selectedTime(value) {
      // redraw all time-dependant layers
      const { map } = getMapInstance(this.mapId);
      const layers = map.getLayers().getArray();
      this.overlayLayers.filter((config) => config.usedTimes?.time?.length).forEach((config) => {
        const layer = layers.find((l) => l.get('name') === config.name);
        if (layer) {
          const source = layer.getSource();
          if (config.protocol === 'WMS') {
            source.updateParams({
              LAYERS: config.layers,
              time: config.dateFormatFunction(value),
              env: `year:${value}`,
            });
          }
          source.refresh();
        }
      });
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
        /* this.$nextTick(() => {
          this.slider.setLeftLayers(
            this.extractActualLayers(this.$refs.compareLayers),
          );
          this.slider.setRightLayers(
            this.extractActualLayers(this.$refs.dataLayers),
          );
          this.slider.addTo(this.map);
        }); */

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
