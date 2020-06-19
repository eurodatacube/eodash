<template>
  <l-map
    ref="map"
    style="height: 100%; width: 100%; background: #cad2d3; z-index: 1;"
    :options="defaultMapOptions"
    :bounds="mapDefaults.bounds"
    :maxZoom="mapDefaults.maxMapZoom"
    :minZoom="mapDefaults.minMapZoom"
    @update:zoom="zoomUpdated"
    @update:center="centerUpdated"
    @update:bounds="boundsUpdated"
    v-resize="onResize"
    @ready="onMapReady()"
  >
    <l-control-attribution position="bottomright" prefix=''></l-control-attribution>
    <l-control-layers position="topright" ></l-control-layers>
    <l-control-zoom position="topright"  ></l-control-zoom>
    <LTileLayer
      v-for="layer in baseLayers"
      v-bind="layer"
      layer-type="base"
      :key="layer.name"
      :opacity="opacityTerrain[zoom]"
      :options="layerOptions(null, layer)"
    >
    </LTileLayer>
    <l-layer-group ref="dataLayers">
      <l-geo-json
      ref="subaoiLayer"
      :geojson="indicator['Sub-AOI']"
      :pane="shadowPane"
      :optionsStyle="subAoiStyle('data')"
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
        :pane="shadowPane"
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
        :geojson="indicator['Sub-AOI']"
        :pane="markerPane"
        :visible="enableCompare"
        :optionsStyle="subAoiStyle('compare')"
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
        :pane="markerPane"
      >
      </l-circle-marker>
    </l-layer-group>
    <LTileLayer
      v-for="layer in overlayLayers"
      :key="layer.name"
      v-bind="layer"
      :pane="tooltipPane"
      :opacity="opacityOverlay[zoom]"
      :options="layerOptions(null, layer)"
      layer-type="overlay"
    >
    </LTileLayer>
    <img v-if="layerDisplay('data').legendUrl"
    :src="layerDisplay('data').legendUrl" alt=""
      style="position: absolute; width: 250px; z-index: 700;
      top: 10px; left: 10px; background: rgba(255, 255, 255, 0.4); ">
    <div
      class="d-flex justify-center" style="position: relative; width: 100%; height: 100%;"
      @click.stop=""
      @dblclick.stop=""
    >
      <v-row
        class="justify-center align-center timeSelection"
        :class="enableCompare && 'mr-5 ml-0'"
        style="position: absolute; bottom: 30px; z-index: 1000; width: auto; max-width: 100%;"
      >
        <v-col
          v-if="enableCompare"
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
          :cols="enableCompare ? 6 : 12"
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
            <template v-slot:prepend>
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
} from 'vuex';
import { geoJson, latLngBounds, latLng } from 'leaflet';
import {
  LMap, LTileLayer, LWMSTileLayer, LGeoJson, LCircleMarker,
  LControlLayers, LControlAttribution, LControlZoom, LLayerGroup,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-mouse-position';
import 'leaflet-side-by-side';
import 'leaflet-loading';
import 'leaflet-loading/src/Control.Loading.css';
import moment from 'moment';

export default {
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
      opacityTerrain: [1],
      opacityOverlay: [1],
      tilePane: 'tilePane',
      overlayPane: 'overlayPane',
      markerPane: 'markerPane',
      shadowPane: 'shadowPane',
      tooltipPane: 'tooltipPane',
      popupPane: 'popupPane',
      slider: null,
      defaultMapOptions: {
        attributionControl: false,
        zoomControl: false,
      },
      dataLayerTime: null,
      compareLayerTime: null,
      dataLayerIndex: 0,
      compareLayerIndex: 0,
    };
  },
  computed: {
    ...mapState('config', ['baseConfig']),
    baseLayers() {
      return this.baseConfig.baseLayers;
    },
    overlayLayers() {
      return this.baseConfig.overlayLayers;
    },
    mapDefaults() {
      return this.baseConfig.mapDefaults;
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    indicatorsDefinition() {
      return this.baseConfig.indicatorsDefinition;
    },
    indicator() {
      return this.$store.state.indicators.selectedIndicator;
    },
    showAoi() {
      return this.aoi && (!this.subAoi || this.subAoi.features.length === 0);
    },
    arrayOfObjects() {
      const selectionOptions = [];
      for (let i = 0; i < this.indicator.Time.length; i += 1) {
        let label = this.getTimeLabel(this.indicator.Time[i]);
        if (this.indicator['EO Sensor']) {
          label += ` - ${this.indicator['EO Sensor'][i]}`;
        }
        selectionOptions.push({
          value: this.indicator.Time[i],
          name: label,
        });
      }
      return selectionOptions;
    },
    currentTime() {
      let returnTime = this.indicator.Time[this.indicator.Time.length - 1];
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
      return returnTime;
    },
    aoi() {
      return this.indicator.AOI;
    },
    subAoi() {
      return this.indicator['Sub-AOI'];
    },
  },
  mounted() {
    this.dataLayerIndex = this.indicator.Time.length - 1;
    this.dataLayerTime = { value: this.indicator.Time[this.dataLayerIndex] };
    this.compareLayerTime = { value: this.getInitialCompareTime() };
    this.$nextTick(() => {
      this.$refs.subaoiLayer.mapObject.bindTooltip('Reference area', {
        direction: 'top',
      });
      this.$refs.subaoiCompareLayer.mapObject.bindTooltip('Reference area', {
        direction: 'top',
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
        position: 'topright',
        delayIndicator: 200,
      }).addTo(this.map);
      // add A/B slider
      this.slider = L.control.sideBySide(this.$refs.compareLayers.mapObject.getLayers(), this.$refs.dataLayers.mapObject.getLayers()); // eslint-disable-line
      this.onResize();
      setTimeout(() => {
        this.flyToBounds();
      }, 1);
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
    getColorCode(side) {
      const index = side === 'compare' ? this.compareLayerIndex : this.dataLayerIndex;
      let currentValue = null;
      // compensate for color code with only one entry, still showing it
      if (this.indicator && this.indicator['Color code']) {
        const colors = this.indicator['Color code'];
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
      const inputData = this.indicator['Input Data'][index];
      if (this.layerNameMapping.hasOwnProperty(inputData)) { // eslint-disable-line
        return this.layerNameMapping[inputData];
      }
      return null;
    },
    layerDisplay(side) {
      // if display not specified (global layers), suspect SIN layer
      return this.indicator.display ? this.indicator.display : {
        ...this.baseConfig.defaultWMSDisplay,
        ...this.shLayerConfig(side),
        name: this.indicator.Description,
      };
    },
    flyToBounds() {
      // zooms to subaoi if present or area around aoi if not
      const boundsPad = 0.15;
      if (this.subAoi && this.subAoi.features.length > 0) {
        const bounds = geoJson(this.subAoi).getBounds();
        const cornerMax1 = latLng([bounds.getSouth() - boundsPad, bounds.getWest() - boundsPad]);
        const cornerMax2 = latLng([bounds.getNorth() + boundsPad, bounds.getEast() + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.fitBounds(bounds);
        // limit user movement around map
        this.map.setMaxBounds(boundsMax);
        if (this.indicatorsDefinition[this.indicator['Indicator code']].largeSubAoi) {
          this.map.setMinZoom(7);
        } else {
          this.map.setMinZoom(13);
        }
      } else if (this.aoi) {
        const cornerMax1 = latLng([this.aoi.lat - boundsPad, this.aoi.lng - boundsPad]);
        const cornerMax2 = latLng([this.aoi.lat + boundsPad, this.aoi.lng + boundsPad]);
        const boundsMax = latLngBounds(cornerMax1, cornerMax2);
        this.map.setZoom(18);
        this.map.panTo(this.aoi);
        // might need tweaking further on
        this.map.setMinZoom(14);
        // limit user movement around map
        this.map.setMaxBounds(boundsMax);
      } else {
        // zoom to default bbox from config
        this.map.setMinZoom(this.mapDefaults.minMapZoom);
        this.map.setMaxBounds(null);
        this.map.flyToBounds(latLngBounds(this.mapDefaults.bounds));
      }
    },
    getTimeLabel(time) {
      if (Array.isArray(time) && time.length === 2) {
        // show start - end
        return time.join(' - ');
      } else if (time instanceof Date) { // eslint-disable-line no-else-return
        return moment.utc(time).format('YYYY-MM-DDTHH:mm:ss');
      }
      return time;
    },
    layerOptions(time, sourceOptionsObj) {
      const additionalSettings = {};
      additionalSettings.site = 'be';
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
        if (typeof time.value !== 'undefined') {
          additionalSettings.time = typeof sourceOptionsObj.dateFormatFunction === 'function'
            ? sourceOptionsObj.dateFormatFunction(time.value) : time.value;
        } else {
          additionalSettings.time = typeof sourceOptionsObj.dateFormatFunction === 'function'
            ? sourceOptionsObj.dateFormatFunction(time) : time;
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
      if (this.indicatorsDefinition[this.indicator['Indicator code']].largeTimeDuration) {
        // if interval, use just start to get closest
        const times = this.indicator.Time.map((item) => (Array.isArray(item) ? item[0] : item));
        const lastTimeEntry = times[times.length - 1];
        const oneYearBefore = moment.utc(lastTimeEntry).subtract(1, 'years');
        // convert time to milliseconds
        const timesInMillis = times.map((t) => +moment.utc(t).format('x'));
        // select closest to one year before
        const closestOneYearBefore = timesInMillis.find((item, i) => i === timesInMillis.length - 1 || Math.abs(moment.utc(oneYearBefore).format('x') - item) < Math.abs(moment.utc(oneYearBefore).format('x') - timesInMillis[i + 1]));
        // assuming sorted times, get index of that entry in original intervals
        const indOrigArray = timesInMillis.indexOf(closestOneYearBefore);
        return this.indicator.Time[indOrigArray];
      }
      // use first time
      return this.indicator.Time[0];
    },
    refreshLayer(side) {
      // compare(left) or data(right)
      if (side === 'compare') {
        if (this.layerDisplay('compare').protocol === 'WMS') {
          this.$refs.compareLayer.mapObject
            .setParams(this.layerOptions(this.currentCompareTime, this.layerDisplay('compare')));
        } else if (this.layerDisplay('compare').protocol === 'xyz') {
          this.$refs.compareLayer.mapObject
            .setUrl(this.layerDisplay('compare').url);
        }
        // redraw
        this.compareLayerKey = Math.random();
      } else if (side === 'data') {
        if (this.layerDisplay('data').protocol === 'WMS') {
          this.$refs.dataLayer.mapObject
            .setParams(this.layerOptions(this.currentTime, this.layerDisplay('data')));
        } else if (this.layerDisplay('data').protocol === 'xyz') {
          this.$refs.dataLayer.mapObject
            .setUrl(this.layerDisplay('data').url);
        }
        // redraw
        this.dataLayerKey = Math.random();
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
        this.$nextTick(() => {
          this.slider.setLeftLayers(this.$refs.compareLayers.mapObject.getLayers());
          this.slider.setRightLayers(this.$refs.dataLayers.mapObject.getLayers());
          this.slider.addTo(this.map);
        });
      }
    },
    indicator() {
      this.dataLayerTime = { value: this.indicator.Time[this.indicator.Time.length - 1] };
      this.dataLayerIndex = this.indicator.Time.length - 1;
      this.compareLayerTime = { value: this.getInitialCompareTime() };
      this.compareLayerIndex = 0;
      this.$nextTick(() => {
        // first nextTick to update layer correctly if was switch from wms <-> xyz
        this.refreshLayer('data');
        if (this.slider) {
          this.refreshLayer('compare');
        }
        this.$nextTick(() => {
          // second nextTick to add correct layers to slider
          if (this.slider) {
            this.slider.setLeftLayers(this.$refs.compareLayers.mapObject.getLayers());
            this.slider.setRightLayers(this.$refs.dataLayers.mapObject.getLayers());
          }
          this.flyToBounds();
          this.onResize();
        });
      });
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
  background-color: rgba(255, 255, 255, 0.5);
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
</style>
