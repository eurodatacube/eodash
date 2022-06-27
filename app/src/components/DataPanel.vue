<template>
  <div
    :style="`${$vuetify.breakpoint.mdAndDown ? 'padding-bottom: 100px; height: auto;'
    : 'height: calc(100% - 64px - ' + bannerHeight + 'px);'}`"
    ref="wrapper"
  >
    <div class="pt-0 pb-0" :style="expanded ? `width: 100%;` : ``">
      <v-row v-if="indicatorObject">
        <v-col
          :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
          :style="`height: auto`"
        >
          <v-card
            v-if="customAreaIndicator && !expanded"
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? 43 : 60}vh;`"
            style="border: none; !important"
            ref="indicatorData"
            outlined
          >
          <v-card-title
            style="padding-top: 10px; padding-bottom: 0px;">
              {{ customAreaIndicator.title }}
          </v-card-title>
          <v-card-title
            style="padding-top: 5px"
            v-if="customAreaIndicator.isEmpty">
              No data found for selection
          </v-card-title>
            <div
              style="height: 100%;z-index: 500; position: relative;"
              v-if="$vuetify.breakpoint.mdAndDown && !dataInteract"
              @click="dataInteract = true"
              v-touch="{
                left: () => swipe(),
                right: () => swipe(),
                up: () => swipe(),
                down: () => swipe(),
            }">
            </div>
            <v-btn
              v-if="customAreaIndicator && showRegenerateButton"
              ref="regenerateButton"
              color="secondary"
              style="display: block; position: absolute; right: 130px; top: 13px;"
              elevation="2"
              x-small
              @click="generateChart"
            >
              Regenerate
            </v-btn>
            <indicator-data
              v-if="!customAreaIndicator.isEmpty"
              style="margin-top: 0px;"
              class="pa-2 chart"
            />
            <v-row class="mt-0">
              <v-col cols="12" sm="5" ></v-col>
              <v-col
                cols="12"
                sm="7"
                v-if="!isFullScreen"
                ref="customButtonRow"
                style="margin-top: -30px;"
              >
                <!--non tabbed custom area indicator not expanded-->
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
                      !isFullScreen &&
                      !showMap &&
                      !this.baseConfig.indicatorsDefinition[
                        indicatorObject.indicator
                      ].countrySelection
                    "
                  >
                    <v-icon left>mdi-download</v-icon>
                    download csv
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
          <v-card
            v-else-if="!showMap || (showMap && indicatorObject.display.customAreaIndicator)"
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? (expanded
                              ? (bannerHeight ? 65 : 70) : 40) : 60}vh;`"
            ref="mapPanel"
          >
            <!-- <full-screen-button /> -->
            <div
              style="height: 100%;z-index: 500; position: relative;"
              v-if="$vuetify.breakpoint.mdAndDown && !dataInteract"
              @click="dataInteract = true"
              v-touch="{
                left: () => swipe(),
                right: () => swipe(),
                up: () => swipe(),
                down: () => swipe(),
            }">
            </div>
            <v-overlay :value="overlay" absolute
              v-if="!dataInteract"
              @click="dataInteract = true">
              Tap to interact
            </v-overlay>
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
            <v-col v-else-if="showMap && indicatorObject.display.customAreaIndicator" class="d-flex flex-col align-center justify-center" style="flex-direction: column; height: 100%">
              <v-icon color="secondary" width="32" height="32">mdi-analytics</v-icon>
              <p style="max-width: 75%; text-align: center">Use the rectangle and polygon buttons to the left of this box to generate charts for a given area.</p>
              <v-btn
                class="mt-3"
                color="secondary"
                :loading="isLoadingCustomAreaIndicator"
                :disabled="!isCustomAreaSelected"
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
            :class="customAreaIndicator && !expanded ? 'mt-6' : 'mt-0'"
          >
            <v-col
              cols="12"
              sm="5"
              class="d-flex align-center"
              :class="$vuetify.breakpoint.xsOnly ? 'justify-center' : 'justify-space-between'"
              v-if="!isFullScreen"
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
              v-if="!isFullScreen"
              :style="customAreaIndicator && !expanded
                ? 'margin-bottom: -40px; margin-top: 20px;' : ''"
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
                    && !isFullScreen
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
                  :href="dataCustomHrefCSV"
                  :download="customAOIDownloadFilename"
                  target="_blank"
                  v-if="
                    customAreaIndicator &&
                    !isFullScreen &&
                    !this.baseConfig.indicatorsDefinition[
                      indicatorObject.indicator
                    ].countrySelection
                  "
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <AddToDashboardButton
                  v-if="customAreaIndicator && !expanded"
                  :indicatorObject="customAreaIndicator">
                </AddToDashboardButton>
                <add-to-dashboard-button
                  v-else-if="!this.baseConfig.indicatorsDefinition[
                    indicatorObject.indicator
                  ].countrySelection"
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
          :style="`padding-bottom: 0px; height: ${$vuetify.breakpoint.mdAndDown
                  ? 'auto'
                  : (expanded
                    ? wrapperHeight + 'px'
                    : wrapperHeight - mapPanelHeight - (showMap ? 40 : 0)
                    - buttonRowHeight + 'px') }`"
        >
          <v-row
            class="mt-0 fill-height scrollContainer"
          >
            <v-col
              cols="12"
              ref="customAreaIndicator"
              class="pa-0"
              v-if="!isFullScreen && customAreaIndicator && expanded"
            >
              <v-card
                v-if="customAreaIndicator"
                class="fill-height"
                :style="`height: ${$vuetify.breakpoint.mdAndUp ? 50 : 60}vh;`"
                style="border: none; !important"
                ref="indicatorData"
                outlined
              >
              <v-card-title
                style="padding-top: 5px"
                v-if="customAreaIndicator.title">
                  {{ customAreaIndicator.title }}
              </v-card-title>
              <v-card-title
                style="padding-top: 5px"
                v-if="customAreaIndicator.isEmpty">
                  No data found for selection
              </v-card-title>
                <div
                  style="height: 100%;z-index: 500; position: relative;"
                  v-if="$vuetify.breakpoint.mdAndDown && !dataInteract"
                  @click="dataInteract = true"
                  v-touch="{
                    left: () => swipe(),
                    right: () => swipe(),
                    up: () => swipe(),
                    down: () => swipe(),
                }">
                </div>
                <indicator-data
                  v-if="!customAreaIndicator.isEmpty"
                  style="margin-top: 0px;"
                  class="pa-5 chart"
                />
              </v-card>
              <div class="mt-6" style="float:right">
                <AddToDashboardButton
                  v-if="customAreaIndicator"
                  :indicatorObject="customAreaIndicator">
                </AddToDashboardButton>
              </div>
              <v-row
                class="mt-3"
              >
                <v-col
                  cols="12"
                  sm="5"
                >
                </v-col>
                <v-col
                  cols="12"
                  sm="7"
                  v-if="!isFullScreen"
                  ref="customButtonRow"
                >
                  <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                    <!--download button for tabbed custom aoi selection expanded view-->
                    <v-btn
                      color="primary"
                      text
                      small
                      :href="dataCustomHrefCSV"
                      :download="customAOIDownloadFilename"
                      target="_blank"
                      v-if="
                        customAreaIndicator &&
                        !isFullScreen &&
                        !this.baseConfig.indicatorsDefinition[
                          indicatorObject.indicator
                        ].countrySelection
                      "
                    >
                      <v-icon left>mdi-download</v-icon>
                      download csv
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              class="pb-0"
              :style="`margin-top: ${customAreaIndicator && expanded ? '30px' : '0px'}`"
              v-if="!isFullScreen"
            >
              <expandable-content
                :minHeight="wrapperHeight - mapPanelHeight
                          - buttonRowHeight - eoDataBtnHeight - (showMap ? 40 : 0)
                          - indicatorDataHeight - 60"
                :disableExpand="expanded || $vuetify.breakpoint.mdAndDown"
              >
                <div
                  v-html="story"
                  class="md-body"
                ></div>
              </expandable-content>
              <v-btn
                v-if="eodataEnabled"
                @click="dialog = true"
                ref="EODataBtn"
                color="primary"
                large
                block
                class="my-1"
              ><span><v-icon left>mdi-satellite-variant</v-icon>EO Data</span>
              </v-btn>
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
              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <v-toolbar dark color="primary">
                  <v-toolbar-title >
                    <span
                    >Reference Images</span>
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-dialog>
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
import { DateTime } from 'luxon';
import dialogMixin from '@/mixins/dialogMixin';
import ExpandableContent from '@/components/ExpandableContent.vue';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorGlobe from '@/components/IndicatorGlobe.vue';
import FullScreenButton from '@/components/FullScreenButton.vue';
import IframeButton from '@/components/IframeButton.vue';
import AddToDashboardButton from '@/components/AddToDashboardButton.vue';

export default {
  mixins: [dialogMixin],
  props: [
    'expanded',
    'newsBanner',
  ],
  components: {
    ExpandableContent,
    IndicatorData,
    IndicatorGlobe,
    FullScreenButton,
    IframeButton,
    AddToDashboardButton,
  },
  data: () => ({
    dialog: false,
    overlay: false,
    dataInteract: false,
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
    ...mapState(['isFullScreen']),
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
          markdown = { default: '' };
        }
      }
      return this.$marked(markdown.default);
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
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
    eodataEnabled() {
      let matchingInputDataAgainstConfig = [];
      if (this.indicatorObject && this.indicatorObject.inputData) {
        matchingInputDataAgainstConfig = this.indicatorObject.inputData
          .filter((item) => Object.prototype.hasOwnProperty.call(this.layerNameMapping, item));
      }
      // showMap triggers dispay of the map directly, so EO Data button is hidden
      // search configuration mapping if layer is configured for at least one inputData value
      return !this.showMap && matchingInputDataAgainstConfig.length > 0;
    },
    wrapperHeight() {
      if (this.mounted) {
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
    eoDataBtnHeight() {
      if (this.mounted) {
        if (this.$refs.EODataBtn != null) {
          return this.$refs.EODataBtn.$el.clientHeight;
        }
        if (this.$refs.externalDataBtn != null) {
          return this.$refs.externalDataBtn.$el.clientHeight;
        }
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

    isCustomAreaSelected() {
      return !!this.$store.state.features.selectedArea;
    },
  },
  mounted() {
    this.mounted = true;

    window.addEventListener(
      'set-custom-area-indicator-loading',
      (e) => { this.isLoadingCustomAreaIndicator = e.detail },
      false,
    )
  },
  methods: {
    swipe() {
      this.overlay = true;
      setTimeout(() => { this.overlay = false; }, 2000);
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
      this.previousArea = { ...this.selectedArea };
      // TODO: Extract fetchData method into helper file since it needs to be used from outside.
      window.dispatchEvent(new Event('fetch-custom-area-chart'));
    },
  },
  watch: {
    dialog(open) {
      if (open && this.$refs.referenceMap) {
        this.$refs.referenceMap.onResize();
        setTimeout(() => {
          this.$refs.referenceMap.flyToBounds();
        }, 200);
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
