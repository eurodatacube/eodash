<template>
  <div
    id="data-panel-parent"
    :style="`${$vuetify.breakpoint.mdAndDown ? ''
    : 'height: calc(100% - 64px);'}`"
    ref="wrapper"
  >
    <style-form-controls
      v-if="mergedConfigsData[0].flatStyle && mergedConfigsData[0].flatStyle.jsonform"
      :flatStyle="mergedConfigsData[0].flatStyle"
      >
    </style-form-controls>
    <style-form-controls
      v-if="mergedConfigsData[0].style && mergedConfigsData[0].style.jsonform"
      :flatStyle="mergedConfigsData[0].style"
      >
    </style-form-controls>
    <span
      v-if="customAreaIndicator && !customAreaIndicator.isEmpty || dataObject && dataObject.time"
      class="ml-5"
    >
      <FullScreenControl selector="#data-panel-parent" />
    </span>
    <div
      class="pt-0 pb-0"
      id="data-panel"
      :class="$vuetify.breakpoint.xsOnly ? 'mx-0' : ''">
      <div v-if="indicatorObject" class="d-flex ma-0">
        <v-col
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
        <feature-filters v-if="indicatorObject.featureFilters"
            :featureFilters="indicatorObject.featureFilters"
            :adminLayer="$store.state.features.adminBorderLayerSelected"
            :adminFeature="$store.state.features.adminBorderFeatureSelected"
            :mergedConfigsData="mergedConfigsData[0]"
            :indicatorCode="indicatorObject.indicator"
        ></feature-filters>
        <template v-if="selectableLayerConfigs.length > 0">
            <SelectionInfoBar class="pb-2"
            :selectableLayerConfigs="selectableLayerConfigs"/>
        </template>
        <div v-if="showCustomAreaCard" ref="chart-div">
          <div v-if="(mergedConfigsData[0].customAreaIndicator &&
            !hasSelectionEnabled) && !customAreaIndicator" class="justify-center align-center">
              <p class="justify-self-start px-2 py-0">
                <v-icon color="black">mdi-shape-polygon-plus</v-icon>
                Draw a polygon in order to start analysis
              </p>
          </div>
          <div v-else-if="showingChart"
            class="pb-2 col"
          >
            <v-card
              class="pb-2 col chartareapanel">
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
                  style="margin-top: 0px; height: 40vh"
                  class="pa-2 chart"
                />
              </template>
              <indicator-data
                v-else-if="dataObject && dataObject.time"
                :enableMapTimeInteraction="true"
                style="top: 0px; height: 40vh;"
                class="pa-5 chart"
              />
            </v-card>
          </div>
          <div class="justify-center text-center align-center"
          v-if="isLoadingCustomAreaIndicator">
            <v-progress-circular
            indeterminate
            color="secondary"
            ></v-progress-circular>
          </div>
          <div
            v-else-if="showCustomAreaCard"
            class="ma-0 pa-2"
          >
            <v-col
              v-if="$route.name !== 'demo'"
              cols="12"
            >
              <v-btn
                color="primary"
                text
                small
                :href="dataHrefCSV"
                :download="downloadFileName"
                target="_blank"
                v-if="dataObject && dataObject.time
                  && !showMap"
              >
                <v-icon left>mdi-download</v-icon>
                download csv
              </v-btn>
              <iframe-button
                :indicatorObject="indicatorObject"
                :featureObject="featureObject"
                v-if="indicatorObject && featureObject && !customAreaIndicator"
              />
              <v-btn
                color="primary"
                text
                small
                :href="dataCustomHrefCSV"
                :download="customAOIDownloadFilename"
                target="_blank"
                v-if="customAreaIndicator"
              >
                <v-icon left>mdi-download</v-icon>
                download csv area
              </v-btn>
              <add-to-dashboard-button
                v-if="(indicatorObject && featureObject && !customAreaIndicator) && (appConfig.id !== 'gtif' || $route.query.customDashboard)"
                :indicatorObject="indicatorObject"
                :featureObject="featureObject"
              />
            </v-col>
          </div>
        </div>
        <data-mockup-view v-if="appConfig.id === 'gtif'"
          :indicatorObject="indicatorObject"
          :adminLayer="$store.state.features.adminBorderLayerSelected"
          :adminFeature="$store.state.features.adminBorderFeatureSelected"
        >
        </data-mockup-view>
          <data-mockup-view v-if="appConfig.id === 'gtif'"
            :indicatorObject="indicatorObject"
            :selectedFeatures="$store.state.features.selectedFeatures"
            :updateQueryParametersTrigger="updateQueryParametersTrigger"
          >
          </data-mockup-view>
          <StyleControls v-if="indicatorObject.vectorStyles && indicatorObject.vectorStyles.items.length > 1"
            :vectorStyles="indicatorObject.vectorStyles"
          >
          </StyleControls>
          <VectorStyleControl v-if="useVectorStyleControl"
            :queryParameters="indicatorObject.queryParameters"
            @updatequeryparameter="updateQueryParameters"
            >
          </VectorStyleControl>
          <vector-tile-style-control v-if="indicatorObject.queryParameters && !Array.isArray(indicatorObject.queryParameters)"
            :queryParameters="indicatorObject.queryParameters"
            @updatequeryparameter="updateQueryParameters"
          >
          </vector-tile-style-control>
          <wms-style-controls v-if="indicatorObject.wmsStyles && indicatorObject.wmsStyles.items.length > 1"
            :wmsStyles="indicatorObject.wmsStyles"
          >
          </wms-style-controls>
          <custom-wms-variables v-if="indicatorObject.display.wmsVariables"
            :wmsVariables="indicatorObject.display.wmsVariables"
            :mergedConfigsData="mergedConfigsData[0]"
          >
          </custom-wms-variables>
          <AreaStatistics v-if="mergedConfigsData
            && mergedConfigsData[0].enableCustomAreaStatistics">
          </AreaStatistics>
          <FeatureQueryParams
            v-if="indicatorObject.display.features
              && indicatorObject.display.features.featureQueryParams"
              :featureQueryParams="indicatorObject.display.features.featureQueryParams"
              :mergedConfigsData="mergedConfigsData[0]"
          >
          </FeatureQueryParams>
        </v-col>
      </div>
      <div v-if="indicatorObject.features?.length && !featureObject">
        <p class="pa-2">
          <v-icon color="black">mdi-chart-areaspline</v-icon>
          Select a point of interest on the map to see more information
        </p>
      </div>
      <v-col v-if="showVisualAnalysisAddons"
        :style="`height: auto`"
      >
        <v-card class="pa-2" >
          <v-card-title class="pa-2">Visual Analysis Add-Ons</v-card-title>
          <v-list-item @click="freezeLayer()" class="pa-0">
            <v-list-item-content>
              <v-list-item-title> <v-icon left>mdi-content-duplicate</v-icon> Save as custom layer to layers panel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-text-field
            hide-details
            label="Custom layer name"
            v-model="frozenLayerName">
          </v-text-field>
        </v-card>
      </v-col>
      <v-card
        class="ma-5"
        v-if="indicatorSelected
          && indicatorSelected.indicator === 'IND2_1'"
      >
        <h1 class="ml-5">Species Info</h1>
        <v-col>
          <SpeciesList v-if="selectedArea && sortedSpecies.length > 0"
            :species=sortedSpecies />
            <div v-else-if="selectedArea">No species in this area.</div>
          <div v-else>
            Select an area on the map using the rectangle or polygon buttons.
          </div>
        </v-col>
      </v-card>
      <GTIFProcessingButtons
      v-if="mergedConfigsData[0].processingEnabled">
      </GTIFProcessingButtons>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import { Wkt } from 'wicket';
import { createConfigFromIndicator, indicatorHasMapData } from '@/helpers/mapConfig';
import { DateTime } from 'luxon';
import IndicatorData from '@/components/IndicatorData.vue';
import IframeButton from '@/components/IframeButton.vue';
import FilterControls from '@/components/map/FilterControls.vue';
import FeatureFilters from '@/components/map/FeatureFilters.vue';
import StyleControls from '@/components/map/StyleControls.vue';
import DataMockupView from '@/components/DataMockupView.vue';
import AddToDashboardButton from '@/components/AddToDashboardButton.vue';
import WmsStyleControls from '@/components/map/WmsStyleControls.vue';
import CustomWmsVariables from '@/components/map/CustomWmsVariables.vue';
import VectorTileStyleControl from '@/components/map/VectorTileStyleControl.vue';
import VectorStyleControl from '@/components/map/VectorStyleControl.vue';
import SelectionInfoBar from '@/components/SelectionInfoBar.vue';
import FeatureQueryParams from '@/components/map/FeatureQueryParams.vue';
import SpeciesList from '@/components/SpeciesList.vue';
import AreaStatistics from '@/components/AreaStatistics.vue';
import { getSpeciesList } from '@/plugins/minesweeper/utils';
import GTIFProcessingButtons from '@/components/GTIFProcessingButtons.vue';
import FullScreenControl from '@/components/map/FullScreenControl.vue';
import StyleFormControls from '@/components/map/StyleFormControls.vue';

export default {
  components: {
    IndicatorData,
    IframeButton,
    AddToDashboardButton,
    FilterControls,
    FeatureFilters,
    StyleControls,
    WmsStyleControls,
    VectorTileStyleControl,
    CustomWmsVariables,
    SelectionInfoBar,
    FeatureQueryParams,
    SpeciesList,
    AreaStatistics,
    DataMockupView,
    GTIFProcessingButtons,
    VectorStyleControl,
    FullScreenControl,
    StyleFormControls,
  },
  data: () => ({
    mounted: false,
    frozenLayerName: null,
    isLoadingCustomAreaIndicator: false,
    showRegenerateButton: null,
    updateQueryParametersTrigger: null,
    sortedSpecies: [],
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
    showingChart() {
      return this.customAreaIndicator || this.dataObject?.time;
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    showCustomAreaCard() {
      if (this.hasSelectionEnabled && !this.customAreaIndicator) {
        return false;
      }
      if (this.dataObject && ['N3a2_chl_nasa', 'N3a2_tsm_nasa'].includes(this.featureObject.indicator)) {
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
        'time', 'siteName', 'measurement',
        'indicatorValue', 'referenceTime', 'eoSensor', 'colorCode', 'inputData',
      ];
      const header = `${exportKeys.join()}\n`;
      let csv = header;
      for (let i = 0; i < this.dataObject.time.length; i++) {
        let row = '';
        for (let kk = 0; kk < exportKeys.length; kk++) {
          const cKey = exportKeys[kk];
          const txtVal = `"${this.dataObject[cKey][i]}",`;
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
      if (this.customAreaIndicator?.time) {
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
      return `${city}_${currDate}_${currInd.siteName}-${currInd.indicator}.csv`;
    },
    customAOIDownloadFilename() {
      const currDate = DateTime.utc().toFormat('yyyy-LL-dd');
      return `user_AOI_${currDate}_${this.indicatorObject.indicator}.csv`;
    },
    useVectorStyleControl() {
      return Array.isArray(this.indicatorObject?.queryParameters);
    },
    showVisualAnalysisAddons() {
      let show = false;
      if (['polar', 'gtif'].includes(this.appConfig.id)) {
        const showVar = this.indicatorHasMapData;
        const hideVar = this.mergedConfigsData[0].disableVisualAnalysisAddons;
        show = showVar && !hideVar;
      }
      return show;
    },
    showMap() {
      // show map means that only information on the map is shown and no indicator data is expected
      // currently this seems to be only the case for indicatorobjects with no features
      // customarea seems to be handled differently
      return !this.indicatorObject.features?.length;
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
    indicatorSelected() {
      return this.$store.state.indicators.selectedIndicator
        || this.$store.state.features.featureFilters.indicators.length > 0;
    },
    indicatorHasMapData() {
      if (!this.indicatorObject) {
        return false;
      }
      return indicatorHasMapData(this.indicatorObject, this.featureObject);
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
    async refreshSpeciesInfo() {
      if (this.selectedArea
        && this.indicatorSelected?.indicator === 'IND2_1'
      ) {
        const bbox = [
          ...this.selectedArea.coordinates[0][0],
          ...this.selectedArea.coordinates[0][2],
        ];
        const sortedSpecies = await getSpeciesList(bbox);
        this.sortedSpecies = sortedSpecies;
      } else {
        this.sortedSpecies = [];
      }
    },
  },
  watch: {
    async selectedArea(area) {
      this.showRegenerateButton = this.customAreaIndicator && !!area;
      this.refreshSpeciesInfo();
    },
  },
  async indicatorSelected() {
    this.refreshSpeciesInfo();
  },
};
</script>

<style lang="scss" scoped>

.v-card.fullscreenElement {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 100vh !important;
}
</style>
