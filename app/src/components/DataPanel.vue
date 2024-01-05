<template>
  <div
    :style="`${$vuetify.breakpoint.mdAndDown ? ''
    : 'height: calc(100% - 64px);'}`"
    ref="wrapper"
  >
    <div
      class="pt-0 pb-0"
      :class="$vuetify.breakpoint.xsOnly ? 'mx-0' : ''">
      <v-row v-if="
        indicatorObject
        && (appConfig.id === 'gtif' || !indicatorObject.features
        || dataObject || mergedConfigsData[0].customAreaIndicator)
        " class="d-flex ma-0">
        <!-- TODO: remove GTIF brand check -->
        <v-col
          v-if="!showMap
            || mergedConfigsData[0].customAreaIndicator
            || appConfig.id === 'gtif'"
          :cols="12"
          class="pa-0"
          :style="`height: auto`"
        >
        <filter-controls v-if="indicatorObject.cogFilters"
            :cogFilters="indicatorObject.cogFilters"
            :adminLayer="$store.state.features.adminBorderLayerSelected"
            :adminFeature="$store.state.features.adminBorderFeatureSelected"
            :mergedConfigsData="mergedConfigsData[0]"
            :indicatorCode="indicatorObject.indicator"
          >
          </filter-controls>
        <style-controls v-if="indicatorObject.vectorStyles"
          :vectorStyles="indicatorObject.vectorStyles"
        >
        </style-controls>
        <wms-style-controls v-if="indicatorObject.wmsStyles"
          :wmsStyles="indicatorObject.wmsStyles"
        >
        </wms-style-controls>
        <template v-if="selectableLayerConfigs.length > 0">
            <SelectionInfoBar class="pb-2"
            :selectableLayerConfigs="selectableLayerConfigs"/>
        </template>
        <data-mockup-view v-if="appConfig.id === 'gtif'"
          :indicatorObject="indicatorObject"
          :adminLayer="$store.state.features.adminBorderLayerSelected"
          :adminFeature="$store.state.features.adminBorderFeatureSelected"
        >
        </data-mockup-view>
          <div v-if="showCustomAreaCard &&  (mergedConfigsData[0].customAreaIndicator &&
            !hasSelectionEnabled) && !customAreaIndicator" class="justify-center align-center">
              <p class="justify-self-start px-2 py-0">
                <v-icon color="black">mdi-shape-polygon-plus</v-icon>
                Draw a polygon in order to start analysis
              </p>
          </div>
          <v-card
            v-else-if="showCustomAreaCard"
            class="fill-height"
            :style="`height: 45vh;`"
            ref="mapPanel"
          >
            <v-card-title
              v-if="customAreaIndicator"
              style="padding-top: 10px; padding-bottom: 0px;">
                {{ customAreaIndicator.name }}
            </v-card-title>
            <template
              v-if="customAreaIndicator && !customAreaIndicator.isEmpty"
            >
              <indicator-data
                :enableMapTimeInteraction="true"
                style="margin-top: 0px;"
                class="pa-2 chart"
              />
            </template>
            <indicator-data
              v-else-if="dataObject && dataObject.time"
              :enableMapTimeInteraction="true"
              style="top: 0px; position: absolute;"
              class="pa-5 chart"
            />
          </v-card>
          <div class="justify-center text-center align-center"
          v-if="isLoadingCustomAreaIndicator">
            <v-progress-circular
            indeterminate
            color="secondary"
            ></v-progress-circular>
          </div>
          <v-row
            v-if="(customAreaIndicator && !customAreaIndicator.isEmpty)
              && (!showMap || !customAreaIndicator.isEmpty)
              && $route.name !== 'demo'"
            class="mt-6"
          >
            <v-col cols="12" sm="5" ></v-col>
            <v-col
              cols="12"
              sm="7"
              ref="customButtonRow"
              style="margin-top: 10px;"
            >
              <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                <v-btn
                  color="primary"
                  text
                  small
                  :href="dataCustomHrefCSV"
                  :download="customAOIDownloadFilename"
                  target="_blank"
                  v-if="
                    customAreaIndicator
                  "
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <add-to-dashboard-button
                  v-if="customAreaIndicator
                    && (appConfig.id !== 'gtif' || $route.query.customDashboard)"
                  :indicatorObject="customAreaIndicator"
                  :featureObject="featureObject"
                  >
                </add-to-dashboard-button>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-else-if="showCustomAreaCard"
            :class="customAreaIndicator ? 'mt-6' : 'mt-0'"
          >
            <v-col
              cols="12"
              sm="5"
              class="d-flex align-center"
              :class="$vuetify.breakpoint.xsOnly ? 'justify-center' : 'justify-space-between'"
            >
              <small v-if="indicatorObject && indicatorObject.updateFrequency">
                <span
                  v-if="indicatorObject.updateFrequency === 'Retired'"
                >This indicator is no longer updated</span>
                <span
                  v-else-if="indicatorObject.updateFrequency === 'EndSeason'"
                >Due to end of season, this indicator is no longer updated</span>
                <span v-else>This data is updated: {{ indicatorObject.updateFrequency }}</span>
              </small>
              <small v-else> </small>
            </v-col>
            <v-col
              v-if="$route.name !== 'demo'"
              cols="12"
              sm="7"
              ref="buttonRow"
            >
              <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                <v-btn
                  color="primary"
                  text
                  small
                  :href="dataHrefCSV"
                  :download="downloadFileName"
                  target="_blank"
                  v-if="dataObject && dataObject.time
                    && !showMap
                    && !dataObject.disableCSV"
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <iframe-button
                  :indicatorObject="indicatorObject"
                  :featureObject="featureObject"
                  v-if="!customAreaIndicator"
                />
                <v-btn
                  color="primary"
                  text
                  small
                  style="margin-top:50px;"
                  :href="dataCustomHrefCSV"
                  :download="customAOIDownloadFilename"
                  target="_blank"
                  v-if="
                    customAreaIndicator &&
                    !showMap
                  "
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <add-to-dashboard-button
                  v-else-if="!showMap && (appConfig.id !== 'gtif' || $route.query.customDashboard)"
                  :indicatorObject="indicatorObject"
                  :featureObject="featureObject"
                  :zoom="zoom"
                  :center="center"
                  :direction="direction"
                  :position="position"
                  :right="right"
                  :up="up"
                  :datalayertime="datalayertime"
                  :comparelayertime="compareEnabled ? comparelayertime : undefined"
                />
              </div>
            </v-col>
          </v-row>
          <data-mockup-view v-if="appConfig.id === 'gtif'"
            :indicatorObject="indicatorObject"
            :selectedFeatures="$store.state.features.selectedFeatures"
            :updateQueryParametersTrigger="updateQueryParametersTrigger"
          >
          </data-mockup-view>
          <StyleControls v-if="indicatorObject.vectorStyles"
            :vectorStyles="indicatorObject.vectorStyles"
          >
          </StyleControls>
          <vector-tile-style-control v-if="indicatorObject.queryParameters"
            :queryParameters="indicatorObject.queryParameters"
            @updatequeryparameter="updateQueryParameters"
          >
          </vector-tile-style-control>
          <wms-style-controls v-if="indicatorObject.wmsStyles"
            :wmsStyles="indicatorObject.wmsStyles"
          >
          </wms-style-controls>
        </v-col>
        <v-col
          :cols="12"
          class="py-0"
          :class="$vuetify.breakpoint.smAndUp ? 'scrollContainer' : ''"
        >
          <v-row
            class="mt-0 fill-height pb-2"
          >
            <v-col
              cols="12"
              class="pb-0"
            >
              <v-btn
                v-if="indicatorObject && externalData"
                :href= "externalData.url"
                target="_blank"
                color="primary"
                ref="externalDataBtn"
                large
                block
                class="my-1"
              ><span><v-icon left>mdi-open-in-new</v-icon>{{externalData.label}}</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="indicatorObject.features.length && !featureObject">
        <p class="justify-self-start px-2 py-0">
          <v-icon color="black">mdi-chart-areaspline</v-icon>
          Select a point of interest on the map to see more information
        </p>
      </div>
      <v-row class="ma-0" v-if="!indicatorObject.features.length">
        <v-col :cols="6">
          <v-btn
            class="px-2 py-0"
            color="primary"
            block
            @click="freezeLayer()"
          >
            <v-icon left>mdi-content-duplicate</v-icon>
            Add as custom layer
          </v-btn>
        </v-col>
        <v-col :cols="6">
          <v-text-field
            hide-details
            label="Custom Layer Name"
            v-model="frozenLayerName">
          </v-text-field>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';
import { Wkt } from 'wicket';
import { createConfigFromIndicator } from '@/helpers/mapConfig';
import { DateTime } from 'luxon';
import IndicatorData from '@/components/IndicatorData.vue';
import IframeButton from '@/components/IframeButton.vue';
import FilterControls from '@/components/map/FilterControls.vue';
import StyleControls from '@/components/map/StyleControls.vue';
import DataMockupView from '@/components/DataMockupView.vue';
import AddToDashboardButton from '@/components/AddToDashboardButton.vue';
// import ScatterPlot from '@/components/ScatterPlot.vue';
import WmsStyleControls from '@/components/map/WmsStyleControls.vue';
import VectorTileStyleControl from '@/components/map/VectorTileStyleControl.vue';
import SelectionInfoBar from '@/components/SelectionInfoBar.vue';

export default {
  components: {
    IndicatorData,
    IframeButton,
    AddToDashboardButton,
    FilterControls,
    StyleControls,
    WmsStyleControls,
    VectorTileStyleControl,
    // ScatterPlot,
    DataMockupView,
    SelectionInfoBar,
  },
  data: () => ({
    overlay: false,
    mounted: false,
    zoom: null,
    center: null,
    direction: null,
    position: null,
    right: null,
    up: null,
    frozenLayerName: null,
    datalayertime: null,
    comparelayertime: null,
    compareEnabled: false,
    isLoadingCustomAreaIndicator: false,
    showRegenerateButton: null,
    showScatterplot: null,
    updateQueryParametersTrigger: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('features', [
      'selectedArea',
    ]),
    ...mapState('indicators', [
      'customAreaIndicator',
    ]),
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    showCustomAreaCard() {
      if (this.hasSelectionEnabled && !this.customAreaIndicator) {
        return false;
      }
      return !this.showMap || (this.showMap && this.mergedConfigsData[0].customAreaIndicator);
    },
    hasSelectionEnabled() {
      return this.mergedConfigsData.length
        && this.mergedConfigsData.find((layer) => layer?.selection || layer?.features?.selection);
    },
    dataObject() {
      return this.$store.state.features.featureData;
    },
    featureObject() {
      return this.$store.state.features.selectedFeature?.indicatorObject;
    },
    dataHrefCSV() {
      let dataHref = 'data:text/csv;charset=utf-8,';
      const exportKeys = [
        'time', 'aoi', 'measurement',
        'indicatorValue', 'referenceTime', /* 'referenceValue', */
        'dataProvider', 'eoSensor', 'colorCode', 'inputData',
      ];
      const header = `${exportKeys.join()}\n`;
      let csv = header;
      for (let i = 0; i < this.dataObject.time.length; i++) {
        let row = '';
        for (let kk = 0; kk < exportKeys.length; kk++) {
          const cKey = exportKeys[kk];
          let txtVal = '';
          if (cKey === 'aoi') {
            txtVal = `"${this.dataObject[cKey]}",`;
          } else {
            txtVal = `"${this.dataObject[cKey][i]}",`;
          }
          row += txtVal;
        }
        row = `${row.slice(0, -1)}\n`;
        csv += row;
      }
      dataHref += encodeURI(csv);
      return dataHref;
    },
    dataCustomHrefCSV() {
      let dataHref = 'data:text/csv;charset=utf-8,';
      const exportKeys = [
        'time', 'aoi', 'measurement',
      ];
      // TODO: Separate data arrays in referenceValue and add them as columns
      // let referenceKeys = [];
      const wkt = new Wkt();
      const header = `${exportKeys.join()}\n`;
      let csv = header;
      if (this.customAreaIndicator.time) {
        for (let i = 0; i < this.customAreaIndicator.time.length; i++) {
          let row = '';
          for (let kk = 0; kk < exportKeys.length; kk++) {
            const cKey = exportKeys[kk];
            let txtVal = '';
            if (cKey === 'aoi') {
              if (i === 0 && this.selectedArea !== null) {
                txtVal = `"${wkt.read(JSON.stringify(this.selectedArea)).write()}",`;
              } else {
                txtVal = ',';
              }
            } else if (this.customAreaIndicator[cKey]) {
              txtVal = `"${this.customAreaIndicator[cKey][i]}",`;
            } else {
              txtVal = ',';
            }
            row += txtVal;
          }
          row = `${row.slice(0, -1)}\n`;
          csv += row;
        }
      }
      dataHref += encodeURI(csv);
      return dataHref;
    },
    downloadFileName() {
      const currDate = DateTime.utc().toFormat('yyyy-LL-dd');
      const currInd = this.indicatorObject;
      const city = currInd.city || currInd.country || 'global';
      return `${city}_${currDate}_${currInd.aoiID}-${currInd.indicator}.csv`;
    },
    customAOIDownloadFilename() {
      const currDate = DateTime.utc().toFormat('yyyy-LL-dd');
      return `user_AOI_${currDate}_${this.indicatorObject.indicator}.csv`;
    },
    showMap() {
      // show map means that only information on the map is shown and no indicator data is expected
      // currently this seems to be only the case for indicatorobjects with no features
      // customarea seems to be handled differently
      return !this.indicatorObject.features?.length;
    },
    externalData() {
      const dataFromDefinition = this.indicatorObject.externalData;
      const dataFromIndicator = this.dataObject ? this.dataObject.externalData : null;
      if (dataFromDefinition) {
        return dataFromDefinition;
      }
      if (dataFromIndicator) {
        return dataFromIndicator;
      }
      return null;
    },
    wrapperHeight() {
      if (this.mounted && this.$refs.wrapper != null) {
        return this.$refs.wrapper.clientHeight;
      }
      return 0;
    },
    buttonRowHeight() {
      if (this.mounted && this.$refs.buttonRow != null) {
        return this.$refs.buttonRow.clientHeight;
      }
      return 0;
    },
    mapPanelHeight() {
      if (this.mounted && this.$refs.mapPanel != null) {
        return this.$refs.mapPanel.$el.clientHeight;
      }
      return 0;
    },
    mergedConfigsData() {
      if (!this.indicatorObject) {
        return [];
      }
      return createConfigFromIndicator(
        this.indicatorObject,
        0,
      );
    },
    selectableLayerConfigs() {
      return this.mergedConfigsData.filter((l) => l?.selection || l?.features?.selection);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.mounted = true;
    });
    // TODO: Extract fetchData method into helper file since it needs to be used from outside.
    window.addEventListener(
      'set-custom-area-indicator-loading',
      (e) => { this.isLoadingCustomAreaIndicator = e.detail; },
      false,
    );
    if (this.mergedConfigsData.length > 0) {
      const [resultConfig] = this.mergedConfigsData;
      this.frozenLayerName = `${resultConfig.name} (Custom layer)`;
    }
  },
  methods: {
    freezeLayer() {
      this.$store.dispatch('indicators/freezeCurrentIndicator', this.frozenLayerName);
    },
    updateQueryParameters() {
      // just passing a signal from one sibling to another, ideally would be done via store
      this.updateQueryParametersTrigger = Math.random();
    },
  },
  watch: {
    selectedArea(area) {
      this.showRegenerateButton = this.customAreaIndicator && !!area;
    },
  },
};
</script>

<style lang="scss" scoped>
.chart {
  background: #fff;
}
.v-card.fullscreenElement {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 100vh !important;
}
</style>
