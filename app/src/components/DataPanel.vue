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
        <filter-controls v-if="indicatorObject.cogFilters"
          :cogFilters="indicatorObject.cogFilters"
        >
        </filter-controls>

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
        <v-col
          v-if="!showMap
            ||  multipleTabCompare
            || (showMap && mergedConfigsData[0].customAreaIndicator)"
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :style="`height: auto`"
        >
          <v-card
            v-if="!showMap || (showMap && mergedConfigsData[0].customAreaIndicator)"
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
            <indicator-globe
              v-if="showGlobe"
              @update:direction="d => direction = d"
              @update:position="p => position = p"
              @update:right="r => right = r"
              @update:up="u => up = u"
              @update:datalayertime="d => datalayertime = d"
              @update:comparelayertime="c => comparelayertime = c"
              @compareEnabled="compareEnabled = !compareEnabled"
              class="d-flex justify-center"
              style="top: 0px; position: absolute;"
            />
            <template
              v-else-if="customAreaIndicator && !customAreaIndicator.isEmpty"
            >
              <indicator-data
                style="margin-top: 0px;"
                class="pa-2 chart"
              />
            </template>
            <v-col
              v-else-if="showMap && (mergedConfigsData[0].customAreaIndicator)"
              class="d-flex flex-col align-center justify-center"
              style="flex-direction: column; height: 100%; position: absolute; top: 0;"
            >
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
            </v-col>
            <div v-else-if="showMap"></div>
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
                    customAreaIndicator &&
                    !this.baseConfig.indicatorsDefinition[
                      indicatorObject.indicator
                    ].countrySelection
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
            v-else
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
                  v-if="!customAreaIndicator || expanded"
                />
                <!--Custom CSV for tabbed map not expanded-->
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
                    !showMap &&
                    !this.baseConfig.indicatorsDefinition[
                      indicatorObject.indicator
                    ].countrySelection
                  "
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <add-to-dashboard-button
                  v-else-if="!this.baseConfig.indicatorsDefinition[
                    indicatorObject.indicator
                  ].countrySelection && !showMap"
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
        </v-col>
        <v-col
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :class="$vuetify.breakpoint.smAndUp ? 'scrollContainer' : ''"
          :style="`padding-bottom: 0px; height: ${$vuetify.breakpoint.mdAndDown
                  ? 'auto'
                  : (expanded
                    ? wrapperHeight + 'px'
                    : wrapperHeight - mapPanelHeight - (showMap ? 40 : 0)
                    - buttonRowHeight
                    - (multipleTabCompare ? 48 : 0) + 'px') }`"
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

      <v-row v-if="indicatorObject">

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
import { loadIndicatorData } from '@/utils';
import { createConfigFromIndicator } from '@/helpers/mapConfig';
import { DateTime } from 'luxon';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorGlobe from '@/components/IndicatorGlobe.vue';
import IframeButton from '@/components/IframeButton.vue';
import FilterControls from '@/components/map/FilterControls.vue';
import StyleControls from '@/components/map/StyleControls.vue';
import DataMockupView from '@/components/DataMockupView.vue';
import AddToDashboardButton from '@/components/AddToDashboardButton.vue';
import ScatterPlot from '@/components/ScatterPlot.vue';
import WmsStyleControls from '@/components/map/WmsStyleControls.vue';
import VectorTileStyleControl from '@/components/map/VectorTileStyleControl.vue';

export default {
  props: [
    'expanded',
    'newsBanner',
  ],
  components: {
    IndicatorData,
    IndicatorGlobe,
    IframeButton,
    AddToDashboardButton,
    FilterControls,
    StyleControls,
    WmsStyleControls,
    VectorTileStyleControl,
    ScatterPlot,
    DataMockupView,
  },
  data: () => ({
    overlay: false,
    mounted: false,
    selectedSensorTab: 0,
    multipleTabCompare: null,
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
      let indicatorObject;
      if (this.multipleTabCompare) {
        const feature = this.multipleTabCompare.features[this.selectedSensorTab];
        indicatorObject = feature && feature.properties.indicatorObject;
      } else {
        indicatorObject = this.$store.state.indicators.selectedIndicator;
      }
      return indicatorObject;
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
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    showMap() {
      // if returns true, we are showing map, if false we show chart
      return ['all'].includes(this.indicatorObject.country) || this.appConfig.configuredMapPois.includes(`${this.indicatorObject.aoiID}-${this.indicatorObject.indicator}`) || Array.isArray(this.indicatorObject.country);
    },
    showGlobe() {
      return this.indicatorObject.showGlobe;
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
    indicatorDataHeight() {
      if (this.mounted && this.$refs.indicatorData != null) {
        return this.$refs.indicatorData.$el.clientHeight;
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
    this.init();

    // TODO: Extract fetchData method into helper file since it needs to be used from outside.
    window.addEventListener(
      'set-custom-area-indicator-loading',
      (e) => { this.isLoadingCustomAreaIndicator = e.detail; },
      false,
    );
  },
  methods: {
    async init() {
      await this.checkMultipleTabCompare();
      this.selectedSensorTab = this.multipleTabCompare
        ? this.multipleTabCompare.features
          .indexOf(this.multipleTabCompare.features
            .find((s) => this.getLocationCode(s.properties.indicatorObject)
              === this.$route.query.poi))
        : 0;
    },
    async checkMultipleTabCompare() {
      let compare;
      const { selectedIndicator } = this.$store.state.indicators;
      const hasGrouping = this.appConfig.featureGrouping && this.appConfig.featureGrouping
        .find((g) => g.features.find((i) => i.includes(this.getLocationCode(selectedIndicator))));
      if (
        hasGrouping
        && !['global'].includes(selectedIndicator.properties.indicatorObject.siteName)
        // only enable tabs for charts; global layers now use the sub-indicator feature
      ) {
        compare = {};
        compare.label = hasGrouping.label;
        compare.features = hasGrouping.features;
        // Pre-load all indicators to populate tab items
        await Promise.all(compare.features.map(async (f) => {
          const feature = this.$store.state.features.allFeatures
            .find((i) => this.getLocationCode(i.properties.indicatorObject) === f);
          await loadIndicatorData(this.baseConfig, feature.properties.indicatorObject);
        }));
        compare.features = compare.features.map((f) => this.$store.state.features.allFeatures
          .find((i) => this.getLocationCode(i.properties.indicatorObject) === f));
      }
      this.multipleTabCompare = compare;
    },
    scrollToCustomAreaIndicator() {
      this.$vuetify.goTo(this.$refs.customAreaIndicator, { container: document.querySelector('.data-panel') });
    },
    clearSelection() {
      const refMap = this.$refs.indicatorMap;
      refMap.selectedCountry = null;
      refMap.selecectedLayer = null;
      this.$store.state.indicators.customAreaIndicator = null;
      this.$store.commit('indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null);
      refMap.onResize();
    },
    generateChart() {
      // TODO: Extract fetchData method into helper file since it needs to be used from outside.
      window.dispatchEvent(new Event('fetch-custom-area-chart'));
    },
  },
  watch: {
    selectedSensorTab(index) {
      if (this.multipleTabCompare.features[index]) {
        const poi = this.getLocationCode(this.multipleTabCompare.features[index]
          .properties.indicatorObject);
        this.$router.replace({ query: { ...this.$route.query, poi } }).catch(() => {});
        let currCountry = null;
        let currID = null;
        if (this.customAreaIndicator !== null) {
          currCountry = this.customAreaIndicator.country;
          currID = this.customAreaIndicator.indicator;
        }
        this.$store.commit('indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null);
        if (this.$refs.indicatorMap
          && this.$refs.indicatorMap.length > 0
          && ['CV', 'OW'].includes(currID)) {
          // For now we only refetch data when switching tabs for CV and OW data
          // Check if a country is selected for the customAreaIndicator
          const refMap = this.$refs.indicatorMap[index];
          if (currCountry && currID) {
            if (refMap) {
              refMap.fetchMobilityData(
                currCountry,
                this.$refs.indicatorMap[index].indicator.aoiID,
              );
            } else {
              // TODO: There should be a better way of doing this
              setTimeout(() => {
                this.$refs.indicatorMap[index].fetchMobilityData(
                  currCountry, this.$refs.indicatorMap[index].indicator.aoiID,
                );
              }, 500);
            }
          }
        }
      }
      if (this.$refs.indicatorMap
        && this.$refs.indicatorMap.length > 0
        && this.$refs.indicatorMap[index]) {
        const refMap = this.$refs.indicatorMap[index];
        refMap.onResize();
      }
    },
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
