<template>
  <div
    :style="`${$vuetify.breakpoint.mdAndDown ? ''
    : 'height: calc(100% - 64px - ' + bannerHeight + 'px);'}`"
    ref="wrapper"
  >
    <div
      class="pt-0 pb-0"
      :class="$vuetify.breakpoint.xsOnly ? 'mx-0' : ''"
      :style="expanded ? `width: 100%;` : ``
    ">
      <v-row v-if="indicatorObject" class="d-flex">
        <v-col
          v-if="!showMap
            || (showMap && mergedConfigsData[0].customAreaIndicator)
            || appConfig.id === 'gtif'"
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          class="pa-0"
          :style="`height: auto`"
        >
        <template v-if="mergedConfigsData[0].adminLayersCustomIndicator">
          <AdminLayersInfoBar class="pb-6"
          :mergedConfigsData="mergedConfigsData[0]"/>
        </template>
          <v-card
            v-if="showCustomAreaCard"
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? (expanded
                              ? (bannerHeight ? 65 : 70) : 30) : 45}vh;`"
            ref="mapPanel"
          >
            <v-card-title
              v-if="customAreaIndicator"
              style="padding-top: 10px; padding-bottom: 0px;">
                {{ customAreaIndicator.title }}
            </v-card-title>
            <v-btn
              v-if="customAreaIndicator && showRegenerateButton"
              ref="regenerateButton"
              color="secondary"
              style="display: block; position: absolute; right: 90px; top: 6px;"
              elevation="2"
              x-small
              @click="generateChart"
            >
              Regenerate
            </v-btn>
            <template
              v-if="customAreaIndicator && !customAreaIndicator.isEmpty"
            >
              <indicator-data
                style="margin-top: 0px;"
                class="pa-2 chart"
              />
            </template>
            <v-col
              v-else-if="showMap &&
                (mergedConfigsData[0].customAreaIndicator &&
                  !mergedConfigsData[0].adminLayersCustomIndicator
                )"
              class="d-flex flex-col align-center justify-center"
              style="flex-direction: column; height: 100%; position: absolute; top: 0;"
            >
              <template>
              <v-icon color="secondary" width="32" height="32">mdi-analytics</v-icon>
                <p style="max-width: 75%; text-align: center">
                  Draw an area on the map using the shape buttons to generate a custom chart!
                </p>
                <v-btn
                  class="mt-3"
                  color="secondary"
                  :loading="isLoadingCustomAreaIndicator"
                  :disabled="!selectedArea"
                  @click="generateChart"
                >
                  Generate Chart
                </v-btn>
              </template>
            </v-col>
            <template v-else-if="mergedConfigsData[0].adminLayersCustomIndicator">
            </template>
            <indicator-data
              style="top: 0px; position: absolute;"
              v-else
              class="pa-5 chart"
            />
          </v-card>
          <v-row
            v-if="(customAreaIndicator && !customAreaIndicator.isEmpty)
              && (!showMap || !customAreaIndicator.isEmpty)"
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
                  v-if="customAreaIndicator"
                  :indicatorObject="customAreaIndicator">
                </add-to-dashboard-button>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-else-if="showCustomAreaCard"
            :class="customAreaIndicator && !expanded ? 'mt-6' : 'mt-0'"
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
                  v-if="indicatorObject
                    && !showMap
                    && !this.baseConfig.indicatorsDefinition[
                      indicatorObject.indicator
                    ].disableCSV"
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <iframe-button
                  :indicatorObject="indicatorObject"
                  :embedMap="false"
                  v-if="!customAreaIndicator || expanded"
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
                  v-else-if="!showMap"
                  :indicatorObject="indicatorObject"
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
          <filter-controls v-if="indicatorObject.cogFilters"
            :cogFilters="indicatorObject.cogFilters"
          >
          </filter-controls>
          <!--
          TODO disabling this for now as it is not ready for public use
          <v-col v-if="indicatorObject.cogFilters"
            :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
            :style="`height: auto`"
          >
            <v-btn
              text
              color="primary"
              class="mx-3"
              @click="showScatterplot = !showScatterplot"
            >
              Expand controls
              <v-icon right :style="`transform: rotate(${showScatterplot
                ? 90
                : 0}deg); transition: all .3s ease-in-out;`">mdi-chevron-right</v-icon>
            </v-btn>
            <scatter-plot v-if="indicatorObject.cogFilters
              && indicatorObject.cogFilters.sourceLayer === 'REP1' && showScatterplot"
              :filters="indicatorObject.cogFilters.filters"
            >
            </scatter-plot>
          </v-col>
          -->
          <!-- TODO: using style-controls breaks ide highlighting using StyleControls isntead-->
          <StyleControls v-if="indicatorObject.vectorStyles"
            :vectorStyles="indicatorObject.vectorStyles"
          >
          </StyleControls>
          <vector-tile-style-control v-if="indicatorObject.queryParameters"
            :queryParameters="indicatorObject.queryParameters"
          >
          </vector-tile-style-control>
          <wms-style-controls v-if="indicatorObject.wmsStyles"
            :wmsStyles="indicatorObject.wmsStyles"
          >
          </wms-style-controls>
          <!-- TODO: remove GTIF brand check -->
          <data-mockup-view v-if="appConfig.id === 'gtif'"
            :indicatorObject="indicatorObject"
            :adminLayer="$store.state.features.adminBorderLayerSelected"
            :adminFeature="$store.state.features.adminBorderFeatureSelected"
          >
          </data-mockup-view>
        </v-col>
        <v-col
          v-else-if="expanded"
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :style="`padding-bottom: 0px; height: ${$vuetify.breakpoint.mdAndDown
                  ? 'auto'
                  : (expanded
                    ? wrapperHeight + 'px'
                    : wrapperHeight - mapPanelHeight - (showMap ? 40 : 0)
                    - buttonRowHeight + 'px') }`"
        />
        <v-col
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :class="$vuetify.breakpoint.smAndUp ? 'scrollContainer' : ''"
          :style="`padding-bottom: 0px; height: ${$vuetify.breakpoint.mdAndDown
                  ? 'auto'
                  : (expanded
                    ? wrapperHeight + 'px'
                    : wrapperHeight - mapPanelHeight - (showMap ? 40 : 0)
                    - buttonRowHeight + 'px') }`"
        >
          <v-row
            class="mt-0 fill-height pb-2"
          >
            <v-col
              cols="12"
              class="pb-0"
            >
              <div
                v-html="story"
                class="md-body"
              ></div>

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
      <v-row v-else>
        <v-col
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :style="`height: auto`"
        >
          <v-card
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? (expanded
            ? (bannerHeight ? 65 : 70) : 45) : 25}vh;`"
            ref="mapPanel"
          >
            <v-col
              class="d-flex flex-col align-center justify-center"
              style="flex-direction: column; height: 100%">
              <v-icon color="secondary" width="32" height="32">mdi-analytics</v-icon>
              <p style="max-width: 75%; text-align: center">
Select a point of interest on the map to see the data for a specific location!
              </p>
            </v-col>
          </v-card>
        </v-col>
        <v-col
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :class="$vuetify.breakpoint.smAndUp ? 'scrollContainer' : ''"
          :style="`padding-bottom: 0px; height: ${$vuetify.breakpoint.mdAndDown
                  ? 'auto'
                  : (expanded
                    ? wrapperHeight + 'px'
                    : wrapperHeight - mapPanelHeight
                    - buttonRowHeight
                    - 15 + 'px') }`"
        >
          <v-row
            class="mt-0 fill-height"
          >
            <v-col
              cols="12"
              class="pb-0"
              :style="`margin-top: ${customAreaIndicator && expanded ? '30px' : '0px'}`"
            >
              <div
                v-html="story"
                class="md-body"
              ></div>
            </v-col>
          </v-row>
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
import AdminLayersInfoBar from '@/components/AdminLayersInfoBar.vue';

export default {
  props: [
    'expanded',
    'newsBanner',
  ],
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
    AdminLayersInfoBar,
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
    datalayertime: null,
    comparelayertime: null,
    compareEnabled: false,
    isLoadingCustomAreaIndicator: false,
    showRegenerateButton: null,
    showScatterplot: null,
  }),
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getLatestUpdate',
    ]),
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
    story() {
      let markdown;
      try {
        markdown = require(`../../public${this.appConfig.storyPath}${this.getLocationCode(this.indicatorObject)}.md`);
      } catch {
        try {
          markdown = require(`../../public${this.baseConfig.indicatorsDefinition[this.indicatorObject.indicator].story}.md`);
        } catch {
          try {
            const indicator = Array.isArray(this.$store.state.features.featureFilters.indicators)
              ? this.$store.state.features.featureFilters.indicators[0]
              : this.$store.state.features.featureFilters.indicators;
            markdown = require(`../../public${this.baseConfig.indicatorsDefinition[indicator].story}.md`);
          } catch {
            markdown = { default: '' };
          }
        }
      }
      return this.$marked(markdown.default);
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    showCustomAreaCard() {
      if (this.mergedConfigsData[0].adminLayersCustomIndicator && !this.customAreaIndicator) {
        return false;
      }
      return !this.showMap || (this.showMap && this.mergedConfigsData[0].customAreaIndicator);
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
      for (let i = 0; i < this.indicatorObject.time.length; i++) {
        let row = '';
        for (let kk = 0; kk < exportKeys.length; kk++) {
          const cKey = exportKeys[kk];
          let txtVal = '';
          if (cKey === 'aoi') {
            txtVal = `"${this.indicatorObject[cKey]}",`;
          } else {
            txtVal = `"${this.indicatorObject[cKey][i]}",`;
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
      for (let i = 0; i < this.customAreaIndicator.time.length; i++) {
        let row = '';
        for (let kk = 0; kk < exportKeys.length; kk++) {
          const cKey = exportKeys[kk];
          let txtVal = '';
          if (cKey === 'aoi') {
            if (i === 0 && this.$store.state.features.selectedArea !== null) {
              txtVal = `"${wkt.read(JSON.stringify(this.$store.state.features.selectedArea)).write()}",`;
            } else {
              txtVal = ',';
            }
          } else {
            txtVal = `"${this.customAreaIndicator[cKey][i]}",`;
          }
          row += txtVal;
        }
        row = `${row.slice(0, -1)}\n`;
        csv += row;
      }
      dataHref += encodeURI(csv);
      return dataHref;
    },
    downloadFileName() {
      const currDate = DateTime.utc().toFormat('yyyy-LL-dd');
      const currInd = this.indicatorObject;
      return `${currInd.city}_${currDate}_${currInd.aoiID}-${currInd.indicator}.csv`;
    },
    customAOIDownloadFilename() {
      const currDate = DateTime.utc().toFormat('yyyy-LL-dd');
      return `user_AOI_${currDate}_${this.indicatorObject.indicator}.csv`;
    },
    showMap() {
      // if returns true, we are showing map, if false we show chart
      return ['all'].includes(this.indicatorObject.country) || this.appConfig.configuredMapPois.includes(`${this.indicatorObject.aoiID}-${this.indicatorObject.indicator}`) || Array.isArray(this.indicatorObject.country);
    },
    externalData() {
      const dataFromDefinition = this.baseConfig.indicatorsDefinition[
        this.indicatorObject.indicator
      ].externalData;
      const dataFromIndicator = this.indicatorObject.externalData;
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
    bannerHeight() {
      if (this.newsBanner != null) {
        return this.newsBanner.$el.clientHeight;
      }
      return 0;
    },
    mergedConfigsData() {
      if (!this.indicatorObject) {
        return [];
      }
      return createConfigFromIndicator(
        this.indicatorObject,
        'data',
        0,
      );
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
  },
  methods: {
    generateChart() {
      // TODO: Extract fetchData method into helper file since it needs to be used from outside.
      window.dispatchEvent(new Event('fetch-custom-area-chart'));
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
