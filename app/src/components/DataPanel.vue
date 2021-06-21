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
          <v-tabs
            v-if="multipleTabCompare"
            v-model="selectedSensorTab"
            grow
          >
            <v-tab
              v-for="(sensorData, index) in multipleTabCompare.features"
              :key="sensorData.properties.indicatorObject.id"
              :class="multipleTabCompare.features.indexOf(sensorData) == selectedSensorTab
                ? 'primary white--text'
                : ''"
            >
              {{ Array.isArray(multipleTabCompare.label)
                ? multipleTabCompare.label[index]
                : (Array.isArray(sensorData.properties.indicatorObject[multipleTabCompare.label])
                ? sensorData.properties.indicatorObject[multipleTabCompare.label][0]
                : sensorData.properties.indicatorObject[multipleTabCompare.label])
              }}
            </v-tab>
          </v-tabs>
          <v-tabs-items
            v-if="multipleTabCompare"
            touchless
            v-model="selectedSensorTab"
          >
            <v-tab-item
              v-for="sensorData in multipleTabCompare.features"
              :key="sensorData.properties.indicatorObject.id"
              :transition="false" :reverse-transition="false"
            >
              <v-card
                class="fill-height"
                :style="`${!(!customAreaIndicator || expanded) ? 'display: none;' : ''}
                height: ${$vuetify.breakpoint.mdAndUp ?
                                  (expanded ? ( bannerHeight ? 60 : 70) : 40) : 60}vh;`"
              >
                <full-screen-button />
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
                <indicator-map
                  ref="indicatorMap"
                  style="top: 0px; position: absolute;"
                  v-if="['all'].includes(sensorData.properties.indicatorObject.country) ||
                  Array.isArray(sensorData.properties.indicatorObject.country)"
                  class="pt-0 fill-height"
                  :currentIndicator="sensorData.properties.indicatorObject"
                />
                <indicator-data
                  style="top: 0px; position: absolute;"
                  v-else
                  class="pa-5 chart"
                  :currentIndicator="sensorData.properties.indicatorObject"
                />
                <v-row class="mt-0">
                  <v-col cols="12" sm="5" ></v-col>
                  <v-col
                    cols="12"
                    sm="7"
                    v-if="!isFullScreen"
                    ref="customButtonRow"
                    style="margin-top: -12px;"
                  >
                    <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                      <v-btn
                        color="primary"
                        text
                        small
                        :href="dataCustomHrefCSV"
                        :download="customAOIDownloadFilename"
                        target="_blank"
                        v-if="customAreaIndicator && !isFullScreen"
                      >
                        <v-icon left>mdi-download</v-icon>
                        download csv
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
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
                  <v-btn
                    icon
                    @click="clearSelection">
                    <v-icon medium>mdi-close</v-icon>
                  </v-btn>
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
                  :style="`height: ${mapPanelHeight - 15}px`"
                  class="px-5 py-0 chart"
                />
              </v-card>
              <v-row class="mt-0">
                <v-col cols="12" sm="5" ></v-col>
                <v-col
                  cols="12"
                  sm="7"
                  v-if="!isFullScreen"
                  ref="customButtonRow"
                  style="margin-top: -12px;"
                >
                  <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                    <v-btn
                      color="primary"
                      text
                      small
                      :href="dataCustomHrefCSV"
                      :download="customAOIDownloadFilename"
                      target="_blank"
                      v-if="customAreaIndicator && !isFullScreen"
                    >
                      <v-icon left>mdi-download</v-icon>
                      download csv
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
          <v-card
            v-else-if="customAreaIndicator && !expanded"
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? 43 : 60}vh;`"
            style="border: none; !important"
            ref="indicatorData"
            outlined
          >
          <v-card-title
            style="padding-top: 10px; padding-bottom: 0px;">
              <v-btn
                icon
                @click="clearSelection">
                <v-icon medium>mdi-close</v-icon>
              </v-btn>
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
            <indicator-map
              ref="indicatorMap"
              style="top: 0px; position: absolute;"
              v-show="false"
              class="pt-0 fill-height"
            />
            <indicator-data
              v-if="!customAreaIndicator.isEmpty"
              style="margin-top: 0px;"
              class="pa-5 chart"
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
                  <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                    <v-btn
                      color="primary"
                      text
                      small
                      :href="dataCustomHrefCSV"
                      :download="customAOIDownloadFilename"
                      target="_blank"
                      v-if="customAreaIndicator && !isFullScreen"
                    >
                      <v-icon left>mdi-download</v-icon>
                      download csv
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
          </v-card>
          <v-card
            v-else
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? (expanded
                              ? (bannerHeight ? 65 : 70) : 40) : 60}vh;`"
            ref="mapPanel"
          >
            <full-screen-button />
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
            <indicator-map
              ref="indicatorMap"
              style="top: 0px; position: absolute;"
              v-if="showMap"
              class="pt-0 fill-height"
            />
            <indicator-data
              style="top: 0px; position: absolute;"
              v-else
              class="pa-5 chart"
            />
          </v-card>
          <v-row
            class="mt-0"
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
                  v-if="indicatorObject && !showMap && !isFullScreen"
                >
                  <v-icon left>mdi-download</v-icon>
                  download csv
                </v-btn>
                <iframe-button
                  :indicatorObject="indicatorObject"
                  v-if="!customAreaIndicator || expanded"
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
                    - buttonRowHeight
                    - (multipleTabCompare ? 48 : 0) + 'px') }`"
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
              <v-row
                class="mt-0"
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
                  style="margin-top: -30px;"
                >
                  <div :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                    <v-btn
                      color="primary"
                      text
                      small
                      :href="dataCustomHrefCSV"
                      :download="customAOIDownloadFilename"
                      target="_blank"
                      v-if="customAreaIndicator && !isFullScreen"
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
                :minHeight="wrapperHeight - mapPanelHeight - (multipleTabCompare ? 48 : 0)
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
              <indicator-map
                ref="referenceMap"
                :style="`height: calc(100% - ${$vuetify.application.top}px)`"
              />
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
import { loadIndicatorData } from '@/utils';
import { DateTime } from 'luxon';
import dialogMixin from '@/mixins/dialogMixin';

import ExpandableContent from '@/components/ExpandableContent.vue';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';
import FullScreenButton from '@/components/FullScreenButton.vue';
import IframeButton from '@/components/IframeButton.vue';

export default {
  mixins: [dialogMixin],
  props: [
    'expanded',
    'newsBanner',
  ],
  components: {
    ExpandableContent,
    IndicatorData,
    IndicatorMap,
    FullScreenButton,
    IframeButton,
  },
  data: () => ({
    dialog: false,
    overlay: false,
    dataInteract: false,
    mounted: false,
    selectedSensorTab: 0,
    multipleTabCompare: null,
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
    customAreaIndicator() {
      return this.$store.state.indicators.customAreaIndicator;
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    showMap() {
      // if returns true, we are showing map, if false we show chart
      return ['all'].includes(this.indicatorObject.country) || Array.isArray(this.indicatorObject.country);
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
      const lastInputData = (this.indicatorObject && this.indicatorObject.inputData)
        ? this.indicatorObject.inputData[this.indicatorObject.inputData.length - 1] : null;
      // search configuration mapping if layer is configured
      return (!this.showMap && lastInputData) ? this.layerNameMapping.hasOwnProperty(lastInputData) : false; // eslint-disable-line
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
  },
  mounted() {
    this.mounted = true;
    this.init();
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
      if (hasGrouping) {
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
    swipe() {
      this.overlay = true;
      setTimeout(() => { this.overlay = false; }, 2000);
    },
    scrollToCustomAreaIndicator() {
      this.$vuetify.goTo(this.$refs.customAreaIndicator, { container: document.querySelector('.data-panel') });
    },
    clearSelection() {
      const refMap = Array.isArray(this.$refs.indicatorMap)
        ? this.$refs.indicatorMap[this.selectedSensorTab]
        : this.$refs.indicatorMap;
      refMap.selectedCountry = null;
      refMap.selecectedLayer = null;
      this.$store.state.indicators.customAreaIndicator = null;
      this.$store.commit('indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null);
      refMap.onResize();
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
    dialog(open) {
      if (open && this.$refs.referenceMap) {
        this.$refs.referenceMap.onResize();
        setTimeout(() => {
          this.$refs.referenceMap.flyToBounds();
        }, 200);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-slide-group__prev {
  display: none !important;
}
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
