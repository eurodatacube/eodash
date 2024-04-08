<template>
  <div style="width: 100%; height: 100%;"
    v-if="barChartIndicators.includes(indicatorObject.indicator)">
      <bar-chart v-if='datacollection()'
        id="chart"
        ref="barChart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection()'
        @extentChanged="extentChanged"
        :options='chartOptions()'></bar-chart>
        <v-btn
          ref="zoomResetButton"
          style="position: absolute; right: 40px; top: 13px;display: none;"
          elevation="2"
          x-small
          @click="resetZoom"
        >
          Reset Zoom
        </v-btn>
  </div>
  <div style="width: 100%; height: 100%;"
    v-else-if="mapchartIndicators.includes(indicatorObject.indicator)">
      <map-chart
        v-if='datacollection()'
        id="chart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection()'
        :options='chartOptions()'>
      </map-chart>
      <img v-if="indicatorObject.indicator=='E10a3'"
        :src="require('@/assets/E10a3_label.jpg')" alt="color legend"
        style="position: absolute; width: 200px; z-index: 0;
        top: 0px; right: 0px;"/>
      <img v-else
        :src="require('@/assets/E10a8_label.jpg')" alt="color legend"
        style="position: absolute; width: 150px; z-index: 0;
        top: 0px; right: 0px;"/>
      <div style="position: absolute; width: 100%; max-width: 180px; left: 75px; bottom: -10px">
        <indicator-time-selection
          v-if="dataLayerTime"
          :autofocus="!disableAutoFocus"
          :available-values="arrayOfObjects"
          :original-time.sync="dataLayerTime"
          :enable-compare="false"
        />
      </div>
  </div>
  <div style="width: 100%; height: 100%;"
    v-else-if="scatterChartIndicators.includes(indicatorObject.indicator)">
    <scatter-chart
      id="chart" ref="scatterChart"
      @extentChanged="extentChanged"
      class="fill-height"
      :width="null"
      :height="null"
      :chart-data='datacollection()'
      :options='chartOptions()'></scatter-chart>
    <v-btn
      ref="zoomResetButton"
      style="position: absolute; right: 40px; top: 13px;display: none;"
      elevation="2"
      x-small
      @click="resetZoom"
    >
      Reset Zoom
    </v-btn>
  </div>
  <div style="width: 100%; height: 100%;" v-else>
    <line-chart v-if='lineChartIndicators.includes(indicatorObject.indicator) && dataObject'
      id="chart" ref="lineChart"
      @extentChanged="extentChanged"
      class="fill-height"
      :width="null"
      :height="null"
      :chart-data='datacollection()'
      :options='chartOptions()'></line-chart>
    <v-btn
      ref="zoomResetButton"
      style="position: absolute; right: 40px; top: 13px;display: none;"
      elevation="2"
      x-small
      @click="resetZoom"
    >
      Reset Zoom
    </v-btn>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import {
  mapState,
} from 'vuex';
import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';
import ScatterChart from '@/components/ScatterChart.vue';
import MapChart from '@/components/MapChart.vue';
import NUTS from '@/assets/NUTS_RG_03M_2016_4326_ESL2-DEL3.json';

import IndicatorTimeSelection from './IndicatorTimeSelection.vue';

export default {
  props: {
    currentIndicator: Object,
    currentFeatureData: Object,
    disableAutoFocus: Boolean,
    enableMapTimeInteraction: Boolean,
  },
  components: {
    BarChart,
    LineChart,
    ScatterChart,
    MapChart,
    IndicatorTimeSelection,
  },
  data() {
    return {
      minZoom: null,
      maxZoom: null,
      dataLayerTime: null,
      dataLayerTimeFromMap: null,
      compareLayerTimeFromMap: null,
      lineChartIndicators: [
        'E12b', 'E8', 'N1b', 'N1', 'N1_NO2_city_trilateral', 'NASACustomLineChart', 'XCubeCustomLineChart', 'SHCustomLineChart', 'N3', 'N3b_tsm', 'N3b_chl', 'SST',
        'GG', 'E10a', 'E10a9', 'CV', 'OW', 'E10c', 'E10a10', 'OX', 'OX_EU',
        'N1a', 'N1c', 'N1d', 'LWE', 'LWL',
        'AQA', 'AQB', 'AQC', 'AQ3', 'REP4_1', 'REP4_4', 'REP4_6',
        'MOBI1', 'MOBI1_1', 'PRCTS', 'SMCTS', 'VITS', 'E12c', 'E12d', 'ADO', 'ADO_1', 'ADO_2', 'ADO_3',
        'Lakes_SWT',
        // Year overlap comparison
        'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m',
        'E10a2', 'E10a6', 'N3a2', 'N3a2_chl_esa', 'N3a2_chl_jaxa', 'N3a2_TSM_esa', 'N3a2_TSM_jaxa', 'REP4_2', 'REP1', 'REP1_1', 'REP1_2',
      ],
      barChartIndicators: [
        'E11', 'E13b', 'E13d', 'E200', 'E9', 'E1', 'E13b2', 'E1_S2',
        'E1a_S2', 'E2_S2', 'E4', 'E5', 'C1', 'C2', 'C3', 'E13n',
        'E1b', 'GGI_CO2', 'GGI_CH4', 'GGI_N2O',
        // Year group comparison
        'E10a1', 'E10a5', 'N2_greenhouse_gases',
      ],
      scatterChartIndicators: [
        'SOL1', 'SOL1_1', 'SOL1_2', 'SOL1_3', 'SOL1_4', 'SOL1_5', 'SOL1_6', 'SOL1_7', 'SOL2', 'SOL2_1', 'SOL2_2', 'SOL2_3', 'REP4_5', 'AQ1', // 'AQ1_1',
        'AQ1_2', 'AQ1_3', 'AQ1_4', 'AQ1_5', 'AQ1_6',
      ],
      multiYearComparison: [
        'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m',
        'E10a2', 'E10a6', 'E10a7', 'REP4_2',
        'E10a1', 'E10a5', 'E10c', 'N2_greenhouse_gases', // Special case
      ],
      mapchartIndicators: ['E10a3', 'E10a8'],
    };
  },
  mounted() {
    const indicator = { ...this.indicatorObject };
    const featureData = this.dataObject;
    if (indicator && featureData) {
      const indicatorCode = indicator.indicator;
      if (['E10a3', 'E10a8'].includes(indicatorCode)) {
        const d = featureData.time[featureData.time.length - 1];
        const formatted = d?.toFormat('dd. MMM');
        this.dataLayerTime = {
          value: formatted,
          name: formatted,
        };
      }
    }
    // add event listener for map up
    window.addEventListener('message', this.mapTimeUpdatedHandler);
  },
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    arrayOfObjects() {
      const indicator = { ...this.indicatorObject };
      const featureData = this.dataObject;
      const indicatorCode = indicator.indicator;
      const selectionOptions = [];
      if (this.mapchartIndicators.includes(indicatorCode)) {
        // Find all unique day/month available
        const timeset = new Set(
          featureData.time.map((d) => d.toFormat('dd. MMM')),
        );
        timeset.forEach((t) => {
          selectionOptions.push({
            value: t,
            name: t,
          });
        });
      }
      return selectionOptions;
    },
    indicatorObject() {
      // Return either the set prop (custom dashbaord) or the selected feature object
      return this.currentIndicator
        || this.$store.state.indicators.customAreaIndicator
        || this.$store.state.features.selectedFeature.indicatorObject;
      // TODO: In the future we probably will want to remove the customareaindicator concept
    },
    dataObject() {
      let datObj = null;
      if (this.currentFeatureData) {
        datObj = this.currentFeatureData;
      } else if (this.$store.state.features?.featureData?.time) {
        // Only use the featureData if it has the times property (maps with locations dont have it)
        datObj = this.$store.state.features.featureData;
      } else if (this.$store.state.indicators.customAreaIndicator) {
        datObj = this.$store.state.indicators.customAreaIndicator;
      }
      return datObj;
    },
    indDefinition() {
      return this.baseConfig.indicatorsDefinition[this.indicatorObject.indicator] || {};
    },
  },
  methods: {
    // I am not saving display state of button as data property because
    // changing it rerenders complete chart which nullifies use of this
    // functionality
    extentChanged(val) {
      if (val) {
        this.$refs.zoomResetButton.$el.style.display = 'block';
        const chart = this.getChartObject();
        this.minZoom = chart.options.scales.xAxes[0].ticks.min;
        this.maxZoom = chart.options.scales.xAxes[0].ticks.max;
      } else {
        this.$refs.zoomResetButton.$el.style.display = 'none';
      }
    },
    datacollection() {
      const indicator = { ...this.indicatorObject };
      const featureData = this.dataObject;
      const indicatorCode = indicator.indicator;
      const { refColors } = this.appConfig;
      let labels = [];
      const datasets = [];
      if (indicator && featureData) {
        const { measurement } = featureData;
        const colors = [];

        // Definition of data structure type of indicator

        const measDecompose = {
          E10a9: ['National Workers', 'Foreign Workers', 'Unknown'],
        };
        const referenceDecompose = {
          N1: {
            measurementConfig: {
              label: indicator.yAxis,
              fill: false,
              backgroundColor: refColors[0],
              borderColor: refColors[0],
              spanGaps: false,
              borderWidth: 2,
            },
            referenceData: [
              {
                key: 'Median', index: 0, color: 'black', fill: false,
              },
              {
                key: 'Min', index: 3, color: refColors[4], fill: false,
              },
              {
                key: 'Max', index: 2, color: refColors[1], fill: false,
              },
              {
                key: 'Standard deviation (STD)',
                calc: (meas, obj) => meas - obj[1],
                color: 'rgba(0,0,0,0.1)',
                fill: '+1',
              },
              {
                key: 'hide_',
                calc: (meas, obj) => meas + obj[1],
                color: 'rgba(0,0,0,0.1)',
                fill: false,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === '' ? Number.NaN : Number(str)))),
          },
          GG: {
            measurementConfig: {
              label: 'Grocery',
              fill: false,
              backgroundColor: refColors[0],
              borderColor: refColors[0],
              cubicInterpolationMode: 'monotone',
              borderWidth: 1,
              pointRadius: 2,
            },
            referenceData: [
              {
                key: 'Parks',
                index: 0,
                color: 'black',
                fill: false,
                backgroundColor: refColors[1],
                borderColor: refColors[1],
                cubicInterpolationMode: 'monotone',
                borderWidth: 1,
                pointRadius: 2,
              },
              {
                key: 'Residential',
                index: 1,
                color: 'black',
                fill: false,
                backgroundColor: refColors[2],
                borderColor: refColors[2],
                cubicInterpolationMode: 'monotone',
                borderWidth: 1,
                pointRadius: 2,
              },
              {
                key: 'Retail Recreation',
                index: 2,
                color: 'black',
                fill: false,
                backgroundColor: refColors[3],
                borderColor: refColors[3],
                cubicInterpolationMode: 'monotone',
                borderWidth: 1,
                pointRadius: 2,
              },
              {
                key: 'Transit Stations',
                index: 3,
                color: 'black',
                fill: false,
                backgroundColor: refColors[4],
                borderColor: refColors[4],
                cubicInterpolationMode: 'monotone',
                borderWidth: 1,
                pointRadius: 2,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === '' ? Number.NaN : Number(str)))),
          },
          CV: {
            measurementConfig: {
              label: 'confirmed cases',
              fill: false,
              backgroundColor: refColors[0],
              borderColor: refColors[0],
              cubicInterpolationMode: 'monotone',
              borderWidth: 1,
              pointRadius: 2,
            },
          },
          OW: {
            measurementConfig: {
              label: 'Daily vaccinations',
              fill: false,
              backgroundColor: refColors[0],
              borderColor: refColors[0],
              cubicInterpolationMode: 'monotone',
              borderWidth: 1,
              pointRadius: 2,
            },
            referenceData: [
              {
                key: 'Total vaccinations',
                index: 0,
                color: 'black',
                fill: false,
                backgroundColor: refColors[1],
                borderColor: refColors[1],
                cubicInterpolationMode: 'monotone',
                borderWidth: 1,
                pointRadius: 2,
              },
              {
                key: 'People fully vaccinated',
                index: 1,
                color: 'black',
                fill: false,
                backgroundColor: refColors[2],
                borderColor: refColors[2],
                cubicInterpolationMode: 'monotone',
                borderWidth: 1,
                pointRadius: 2,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === '' ? Number.NaN : Number(str)))),
          },
          N3: {
            referenceData: [
              {
                key: 'Weekly climatology of chlorophyll conc. (CHL_clim) 2017-2019',
                calc: (meas, obj) => 10 ** obj[0],
                borderWidth: 3,
                color: 'black',
                fill: false,
                pointStyle: 'line',
                spanGaps: false,
              },
              {
                key: 'Standard deviation (STD)',
                calc: (meas, obj) => 10 ** (obj[0] - obj[1]),
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderColor: 'rgba(0,0,0,0)',
                fill: '+1',
                pointStyle: 'rect',
                spanGaps: false,
              },
              {
                key: 'hide_',
                calc: (meas, obj) => 10 ** (obj[0] + obj[1]),
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
                fill: false,
                spanGaps: false,
              },
            ],
          },
          N1a: {
            measurementConfig: {
              label: 'Value',
              backgroundColor: 'rgba(255,255,255,0.0)',
              borderColor: 'red',
              spanGaps: false,
              pointRadius: 0,
              borderWidth: 1.5,
            },
            referenceData: [
              {
                key: '7-day mean',
                index: 3,
                borderColor: 'red',
                backgroundColor: 'rgba(255,255,255,0.0)',
                borderDash: [6, 3],
                borderWidth: 2,
                spanGaps: false,
              },
              {
                key: '2017-2019 7d mean',
                index: 2,
                borderColor: 'grey',
                backgroundColor: 'rgba(255,255,255,0.0)',
                borderDash: [6, 3],
                borderWidth: 2,
                spanGaps: false,
              },
              {
                key: 'hide_',
                index: 1,
                borderColor: 'rgba(0,0,0,0.0)',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: '4',
                spanGaps: false,
              },
              {
                key: '2017-2019 range',
                index: 0,
                borderColor: 'rgba(0,0,0,0.0)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                fill: '3',
                spanGaps: false,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === '' ? Number.NaN : Number(str)))),
          },
          E8: {
            measurementConfig: {
              label: 'Value',
              backgroundColor: 'rgba(255,255,255,0.0)',
              borderColor: 'red',
              spanGaps: false,
              pointRadius: 0,
              borderWidth: 1.5,
            },
            referenceData: [
              {
                key: '7-day mean',
                index: 0,
                borderColor: 'black',
                backgroundColor: 'rgba(255,255,255,0.0)',
                borderDash: [6, 3],
                borderWidth: 2,
                spanGaps: false,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === 'nan' ? Number.NaN : Number(str)))),
          },
          GGI_CO2: {
            referenceData: [
              {
                key: 'CO2 Inventory',
                index: 0,
                borderColor: refColors[0],
                backgroundColor: refColors[0],
                borderWidth: 2,
              },
              {
                key: 'CO2 Inversion in-situ',
                index: 2,
                borderColor: refColors[2],
                backgroundColor: refColors[2],
                borderWidth: 2,
              },
              {
                key: 'CO2 Inversion satellite',
                index: 1,
                borderColor: refColors[1],
                backgroundColor: refColors[1],
                borderWidth: 2,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === 'nan' ? Number.NaN : Number(str)))),
          },
          GGI_N2O: {
            referenceData: [
              {
                key: 'N2O Inventory',
                index: 0,
                borderColor: refColors[0],
                backgroundColor: refColors[0],
                borderWidth: 2,
              },
              {
                key: 'N2O Inversion in-situ',
                index: 1,
                borderColor: refColors[2],
                backgroundColor: refColors[2],
                borderWidth: 2,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === 'nan' ? Number.NaN : Number(str)))),
          },
          GGI_CH4: {
            referenceData: [
              {
                key: 'CH4 Inventory Agriculture and waste',
                index: 0,
                backgroundColor: '#12501c',
                borderWidth: 0,
                stack: '0',
              },
              {
                key: 'CH4 Inventory Biomass',
                index: 1,
                backgroundColor: '#4e0618',
                borderWidth: 0,
                stack: '0',
              },
              {
                key: 'CH4 Inventory Fossil',
                index: 2,
                backgroundColor: '#0a355f',
                borderWidth: 0,
                stack: '0',
              },
              {
                key: 'CH4 Inversion satellite Agriculture and waste',
                index: 3,
                backgroundColor: '#328817',
                borderWidth: 0,
                stack: '1',
              },
              {
                key: 'CH4 Inversion satellite Biomass',
                index: 4,
                backgroundColor: '#c52a5c',
                borderWidth: 0,
                stack: '1',
              },
              {
                key: 'CH4 Inversion satellite Fossil',
                index: 5,
                backgroundColor: '#508ab3',
                borderWidth: 0,
                stack: '1',
              },
              {
                key: 'CH4 Inversion in-situ Agriculture and waste',
                index: 6,
                backgroundColor: '#97e970',
                borderWidth: 0,
                stack: '2',
              },
              {
                key: 'CH4 Inversion in-situ Biomass',
                index: 7,
                backgroundColor: '#dd67aa',
                borderWidth: 0,
                stack: '2',
              },
              {
                key: 'CH4 Inversion in-situ Fossil',
                index: 8,
                backgroundColor: refColors[6],
                borderWidth: 0,
                stack: '2',
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === 'nan' ? Number.NaN : Number(str)))),
          },
          E12c: {
            measurementConfig: {
              label: indicator.yAxis,
              backgroundColor: 'rgba(255,255,255,0.0)',
              borderColor: 'black',
              spanGaps: true,
              borderWidth: 2,
              pointRadius: 2,
            },
            referenceData: [],
          },
          PRCTS: {
            measurementConfig: {
              label: indicator.yAxis,
              backgroundColor: 'rgba(255,255,255,0.0)',
              borderColor: 'black',
              spanGaps: false,
              borderWidth: 2,
              pointRadius: 0,
            },
            referenceData: [
              {
                label: 'Climatic value (average)',
                index: 0,
                borderColor: 'blue',
                borderDash: [6, 3],
                backgroundColor: 'rgba(255,255,255,0.0)',
                borderWidth: 2,
                spanGaps: false,
                referenceTime: true,
                pointRadius: 0,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === '' ? Number.NaN : Number(str)))),
          },
          NASACustomLineChart: {
            measurementConfig: {
              label: indicator.yAxis,
              fill: false,
              backgroundColor: refColors[0],
              borderColor: refColors[0],
              spanGaps: false,
              borderWidth: 2,
            },
            referenceData: [
              {
                key: 'Median', index: 0, color: 'black', fill: false,
              },
              {
                key: 'Min', index: 3, color: refColors[4], fill: false,
              },
              {
                key: 'Max', index: 2, color: refColors[1], fill: false,
              },
              {
                key: 'Standard deviation (STD)',
                calc: (meas, obj) => meas - obj[1],
                color: 'rgba(0,0,0,0.1)',
                fill: '+1',
              },
              {
                key: 'hide_',
                calc: (meas, obj) => meas + obj[1],
                color: 'rgba(0,0,0,0.1)',
                fill: false,
              },
            ],
            valueDecompose: (item) => (item.replace(/[[\] ]/g, '').split(',')
              .map((str) => (str === '' ? Number.NaN : Number(str)))),
          },
        };
        referenceDecompose.N1b = referenceDecompose.N1a;
        referenceDecompose.N1_NO2_city_trilateral = referenceDecompose.N1;
        referenceDecompose.N1c = referenceDecompose.N1a;
        referenceDecompose.N1d = referenceDecompose.N1a;
        referenceDecompose.E12b = referenceDecompose.N1a;
        // Special legend for E8
        referenceDecompose.E12d = referenceDecompose.E12c;
        referenceDecompose.LWL = referenceDecompose.E12c;
        referenceDecompose.LWE = referenceDecompose.E12c;
        referenceDecompose.SHCustomLineChart = referenceDecompose.N1;
        referenceDecompose.SMCTS = referenceDecompose.PRCTS;
        referenceDecompose.VITS = referenceDecompose.PRCTS;

        referenceDecompose.SST = JSON.parse(JSON.stringify(referenceDecompose.N3));

        referenceDecompose.SST.referenceData[0].key = 'Sea Surface Temperature';
        referenceDecompose.SST.referenceData[0].calc = (meas, obj) => obj[0];
        referenceDecompose.SST.referenceData[1].calc = (meas, obj) => obj[0] - obj[1];
        referenceDecompose.SST.referenceData[2].calc = (meas, obj) => obj[0] + obj[1];

        // Generators based on data type
        if (Object.keys(referenceDecompose).includes(indicatorCode)) {
          if ('measurementConfig' in referenceDecompose[indicatorCode]) {
            const data = featureData.measurement.map((val, rowIdx) => ({
              t: featureData.time[rowIdx],
              y: val,
            }));
            datasets.push({
              ...referenceDecompose[indicatorCode].measurementConfig,
              data,
            });
          }
          if ('referenceData' in referenceDecompose[indicatorCode]) {
            referenceDecompose[indicatorCode].referenceData.forEach((entry) => {
              const data = [];
              featureData.referenceValue.forEach((item, rowIdx) => {
                const usedTime = 'referenceTime' in entry ? featureData.referenceTime[rowIdx] : featureData.time[rowIdx];
                if (!Number.isNaN(item) && !['NaN', '[NaN NaN]', '/'].includes(item)) {
                  let obj;
                  if ('valueDecompose' in referenceDecompose[indicatorCode]) {
                    obj = referenceDecompose[indicatorCode].valueDecompose(item);
                  } else {
                    obj = JSON.parse(item.replace(/,/g, '.').replace(' ', ','));
                  }
                  if (obj[0] === -999 && obj[1] === -999) {
                    data.push({
                      t: usedTime,
                      y: Number.NaN,
                    });
                  } else if ('index' in entry) {
                    data.push({
                      t: usedTime,
                      y: obj[entry.index],
                    });
                  } else if ('calc' in entry) {
                    data.push({
                      t: usedTime,
                      y: entry.calc(featureData.measurement[rowIdx], obj),
                    });
                  }
                } else {
                  data.push({
                    t: usedTime,
                    y: Number.NaN,
                  });
                }
              });
              datasets.push({
                label: entry.key,
                data,
                borderColor: entry.color,
                backgroundColor: entry.color,
                borderWidth: 1,
                pointRadius: 0,
                spanGaps: false,
                ...entry,
              });
            });
          }
        }

        // Add special points for N3
        if (['N3', 'SST'].includes(indicatorCode)) {
          // Find unique indicator values
          const indicatorValues = {};
          featureData.indicatorValue.map((val, i) => {
            let key = val.toLowerCase();
            key = key.charAt(0).toUpperCase() + key.slice(1);
            if (!['', '/'].includes(key) && typeof indicatorValues[key] === 'undefined') {
              indicatorValues[key] = this.getIndicatorColor(
                featureData.colorCode[i],
                true,
              );
            }
            return null;
          });

          Object.entries(indicatorValues).forEach(([key, value]) => {
            const data = measurement.map((row, i) => {
              let val = row;
              if (featureData.indicatorValue[i] !== key.toUpperCase()) {
                val = NaN;
              }
              let y = Number.isNaN(val) ? Number.NaN : (10 ** val);
              if (['SST'].includes(indicatorCode)) {
                y = Number.isNaN(val) ? Number.NaN : val;
              }
              return {
                t: featureData.time[i],
                y,
              };
            });
            datasets.push({
              label: key,
              data,
              backgroundColor: value,
              borderColor: value,
              fill: false,
              showLine: false,
              spanGaps: false,
            });
          });
        }

        // Generate data for datasets where a string array is passed as measurements
        if (Object.keys(measDecompose).includes(indicatorCode)) {
          measDecompose[indicatorCode].forEach((key, idx) => {
            const data = featureData.measurement.map((row, rowIdx) => ({
              t: featureData.time[rowIdx],
              y: row[idx],
            }));
            datasets.push({
              label: key,
              data,
              fill: false,
              borderColor: refColors[idx],
              backgroundColor: refColors[idx],
              cubicInterpolationMode: 'monotone',
              borderWidth: 1,
              pointRadius: 2,
            });
          });
        }

        // Generate datasets for charts that show two year comparisons (bar and line)
        if (this.multiYearComparison.includes(indicatorCode)
            && !['E10c', 'N2_greenhouse_gases', 'REP4_2'].includes(indicatorCode)) {
          const uniqueRefs = [];
          const uniqueMeas = [];
          const referenceValue = featureData.referenceValue.map(Number);
          let datemodifier = { year: 2000 };
          if ((indicatorCode === 'E10a1' && featureData.aoiID === 'ES8')
              || indicatorCode === 'E10a5') {
            // ES8 has different days as reference value, can only be grouped
            // when having same date, we set them all to day 1 of month
            datemodifier = {
              year: 2000, day: 1, hour: 1, minute: 0, second: 0,
            };
          }
          featureData.time.forEach((date, i) => {
            const meas = {
              t: date.set(datemodifier),
              y: measurement[i],
              indicatorValue: featureData.indicatorValue[i],
            };
            if (typeof uniqueMeas.find((item) => item.t.equals(meas.t)) === 'undefined') {
              uniqueMeas.push(meas);
            }
          });
          featureData.referenceTime.forEach((date, i) => {
            if (!['', '/'].includes(featureData.referenceValue[i])) {
              const ref = {
                t: date.set(datemodifier),
                y: referenceValue[i],
              };
              if (typeof uniqueRefs.find((item) => item.t.equals(ref.t)) === 'undefined') {
                uniqueRefs.push(ref);
              }
            }
          });
          if (uniqueRefs.length > 0) {
            datasets.push({
              label: '2019',
              data: uniqueRefs,
              fill: false,
              borderColor: refColors[0],
              backgroundColor: refColors[0],
              borderWidth: 2,
            });
          }
          datasets.push({
            label: '2020',
            data: uniqueMeas,
            fill: false,
            borderColor: refColors[1],
            backgroundColor: refColors[1],
            borderWidth: 2,
          });
        }

        if (['N3b_tsm', 'N3b_chl'].includes(indicatorCode)) {
          const sensors = Array.from(new Set(featureData.eoSensor)).sort();
          for (let pp = 0; pp < sensors.length; pp += 1) {
            const pKey = sensors[pp];
            const data = featureData.time.map((date, i) => {
              let output = null;
              if (featureData.eoSensor[i] === pKey) {
                output = { t: date, y: measurement[i] };
              }
              return output;
            }).filter((d) => d !== null);
            let colorUsed = refColors[pp];
            if (this.indDefinition.sensorColorMap && this.indDefinition.sensorColorMap[pKey]) {
              colorUsed = this.indDefinition.sensorColorMap[pKey];
            }
            datasets.push({
              label: pKey,
              data,
              fill: false,
              borderColor: colorUsed,
              backgroundColor: colorUsed,
              cubicInterpolationMode: 'monotone',
            });
          }
        } else if (['E10a10'].includes(indicatorCode)) {
          const data = [];
          const refData = [];
          featureData.time.forEach((t, i) => {
            data.push({ t, y: measurement[i] * 100 });
            refData.push({ t, y: featureData.referenceValue[i] * 100 });
          });
          datasets.push({
            label: 'Observation',
            data,
            fill: false,
            borderColor: refColors[1],
            backgroundColor: refColors[1],
            borderWidth: 2,
            pointRadius: 2,
          });
          datasets.push({
            label: 'Model',
            data: refData,
            fill: false,
            borderColor: refColors[0],
            backgroundColor: refColors[0],
            borderWidth: 2,
            pointRadius: 2,
          });
        } else if (['E13n', 'C1', 'C2', 'C3'].includes(indicatorCode)) {
          // Group by indicator value
          const types = {};
          featureData.indicatorValue.forEach((ind, idx) => {
            if (Object.keys(types).includes(ind)) {
              types[ind].push({
                t: DateTime.fromISO(featureData.time[idx]),
                y: Number(featureData.measurement[idx]),
              });
            } else {
              types[ind] = [{
                t: DateTime.fromISO(featureData.time[idx]),
                y: Number(featureData.measurement[idx]),
              }];
            }
          });
          Object.keys(types).forEach((key, i) => {
            datasets.push({
              label: key,
              fill: false,
              data: types[key],
              backgroundColor: refColors[i],
              borderColor: refColors[i],
              borderWidth: 2,
            });
          });
        } else if (['N2_greenhouse_gases', 'E10c', 'REP4_2'].includes(indicatorCode)) {
          /* Group data by year in month slices */
          const data = featureData.time.map((date, i) => {
            colors.push(this.getIndicatorColor(
              featureData.colorCode[i],
            ));
            const result = {
              t: date,
              y: measurement[i],
            };
            if (featureData.referenceValue[i]) {
              result.referenceValue = featureData.referenceValue[i].replace(/[[\]]/g, '');
            }
            return result;
          });
          const dataGroups = {};
          const colorGroups = {};
          for (let i = 0; i < data.length; i += 1) {
            const currYear = data[i].t.year;
            if (Object.prototype.hasOwnProperty.call(dataGroups, currYear)) {
              dataGroups[currYear].push({
                t: data[i].t.set({ year: 2000 }),
                y: [data[i].y],
                referenceValue: data[i].referenceValue,
              });
              colorGroups[currYear].push(colors[i]);
            } else {
              dataGroups[currYear] = [{
                t: data[i].t.set({ year: 2000 }),
                y: [data[i].y],
                referenceValue: data[i].referenceValue,
              }];
              colorGroups[currYear] = [colors[i]];
            }
          }
          const uniqueYears = Object.keys(dataGroups);
          uniqueYears.sort();
          const yLength = uniqueYears.length - 1;
          uniqueYears.forEach((key, i) => {
            const ds = {
              // fill with empty values
              indLabels: Array(dataGroups[key].length).join('.').split('.'),
              label: key,
              fill: false,
              data: dataGroups[key],
              backgroundColor: refColors[yLength - i],
              borderColor: refColors[yLength - i],
              borderWidth: 2,
            };
            if (['REP4_2'].includes(indicatorCode) && key === '2010') {
              ds.borderDash = [4, 2];
              ds.borderWidth = 5;
              ds.label = 'Monthly mean';
              ds.pointStyle = 'triangle';
              ds.pointRadius = 5;
            }
            datasets.push(ds);
          });
        } else if (['OX', 'OX_EU'].includes(indicatorCode)) {
          const data = [];
          const average = [];
          let counter = 0;
          let tmpVal = 0;
          let tmpTime = 0;
          const min = Math.min(...featureData.measurement);
          const max = Math.max(...featureData.measurement);
          featureData.measurement.forEach((item, i) => {
            data.push({
              t: featureData.time[i],
              y: item,
              color: featureData.indicatorValue[i],
            });
            if (counter < 4) {
              tmpVal += item;
              tmpTime += featureData.time[i].toMillis();
              counter += 1;
            } else {
              average.push({
                t: DateTime.fromMillis(tmpTime / 4),
                y: tmpVal / 4,
              });
              counter = 0;
              tmpVal = 0;
              tmpTime = 0;
            }
          });
          const lowData = [];
          data.forEach((entry) => {
            if (entry.color === 'Red (Low)' || entry.color === 'Orange (Low)') {
              lowData.push({ t: entry.t, y: min });
            }
          });
          datasets.push({
            label: 'Site Low',
            data: lowData,
            fill: false,
            borderColor: 'orange',
            backgroundColor: 'orange',
            borderWidth: 0,
            pointRadius: 3,
            showLine: false,
          });

          const regularData = [];
          data.forEach((entry) => {
            if (entry.color === 'Green') {
              regularData.push({ t: entry.t, y: min + ((max - min) / 2) });
            }
          });
          datasets.push({
            label: 'Site Regular',
            data: regularData,
            fill: false,
            borderColor: this.getIndicatorColor('BLUE', true),
            backgroundColor: this.getIndicatorColor('BLUE', true),
            borderWidth: 0,
            pointRadius: 3,
            showLine: false,
          });
          const highData = [];
          data.forEach((entry) => {
            if (entry.color === 'Red (High)' || entry.color === 'Orange (High)') {
              highData.push({ t: entry.t, y: max });
            }
          });
          datasets.push({
            label: 'Site High',
            data: highData,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'red',
            borderWidth: 0,
            pointRadius: 3,
            showLine: false,
          });

          datasets.push({
            label: 'Cluster storage utilization',
            data,
            fill: false,
            borderColor: 'grey',
            backgroundColor: 'grey',
            borderWidth: 1,
            pointRadius: 0,
            showLine: true,
            lineTension: 0,
          });
          datasets.push({
            label: 'Monthly cluster storage average',
            data: average,
            fill: false,
            borderColor: 'black',
            backgroundColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            showLine: true,
          });
        } else if (['E10a3', 'E10a8'].includes(indicatorCode)) {
          const nutsFeatures = NUTS.features;
          const outline = [];
          const currIDs = [];
          let features = measurement.map((meas, i) => {
            // Find correct NUTS ID Shape
            const geom = nutsFeatures.find((f) => (
              f.properties.NUTS_ID === featureData.siteNameNUTS[i]));
            let output;
            if (geom) {
              if (currIDs.indexOf(featureData.siteNameNUTS[i]) === -1) {
                currIDs.push(featureData.siteNameNUTS[i]);
                outline.push({
                  type: 'Feature',
                  properties: {},
                  geometry: geom.geometry,
                });
              }
              const { coordinates } = geom.geometry;
              const lons = (geom.geometry.type === 'Polygon') ? coordinates.flat(1).map((tuple) => tuple[0]) : coordinates.flat(2).map((tuple) => tuple[0]);
              const lats = (geom.geometry.type === 'Polygon') ? coordinates.flat(1).map((tuple) => tuple[1]) : coordinates.flat(2).map((tuple) => tuple[1]);
              const minLat = Math.min(...lats);
              const minLon = Math.min(...lons);
              const centerPoint = {
                lat: minLat + (Math.max(...lats) - minLat) / 2,
                lon: minLon + (Math.max(...lons) - minLon) / 2,
              };
              output = {
                type: 'Feature',
                properties: {},
                geometry: geom.geometry,
                description: 'description',
                latitude: centerPoint.lat,
                longitude: centerPoint.lon,
                name: geom.properties.NUTS_NAME,
                time: featureData.time[i],
                value: Number(meas),
                referenceTime: featureData.referenceTime[i],
                referenceValue: featureData.referenceValue[i],
                color: featureData.colorCode[i],
              };
              if (indicatorCode === 'E10a8') {
                // Swap value to have reference value
                output.value = Number(featureData.referenceValue[i]);
                output.referenceValue = Number(meas);
              }
            }
            return output;
          });

          // Filter by undefined and time
          features = features.filter((d) => (
            typeof d !== 'undefined'));

          const filteredFeatures = features.filter((d) => {
            let include = false;
            if (d.time instanceof DateTime && this.dataLayerTime) {
              include = d.time.toFormat('dd. MMM') === this.dataLayerTime.value
                && !Number.isNaN(d.value);
            }
            return include;
          });

          labels = features.map((d) => d.name);
          datasets.push({
            outline,
            outlineBackgroundColor: null,
            outlineBorderColor: 'black',
            outlineBorderWidth: 1,
            showOutline: true,
            backgroundColor: filteredFeatures.map((d) => d.color),
            borderColor: filteredFeatures.map((d) => d.color),
            borderWidth: 3,
            data: filteredFeatures,
            clipMap: 'items',
          });
        } else if (['AQA', 'AQB', 'AQC', 'MOBI1', 'MOBI1_1', 'AQ3', 'REP4_1',
          'REP4_4', 'REP4_6', 'ADO', 'ADO_1', 'ADO_2', 'ADO_3', 'XCubeCustomLineChart'].includes(indicatorCode)) {
          // Rendering for fetched data
          const data = featureData.time.map((date, i) => (
            { t: date, y: featureData.measurement[i] }
          ));
          let label = indicator.yAxis;
          if (['MOBI1', 'MOBI1_1'].includes(indicatorCode)) {
            label = 'time series for selected area';
          }
          let style = {
            backgroundColor: refColors[0],
            borderColor: refColors[0],
          };
          if (['REP4_1', 'REP4_6'].includes(indicatorCode)) {
            // special rendering of S2L2A, otherwise has S1GRD style
            const colorsArray = featureData.inputData.map((d, i) => {
              [data[i].inputData] = d.split('_');
              if (d === 'S2L2A_REP4') {
                return refColors[0];
              }
              return refColors[1];
            });
            style = {
              borderColor: colorsArray,
              backgroundColor: colorsArray,
            };
          }
          datasets.push({
            label,
            data,
            fill: false,
            borderWidth: 1,
            pointRadius: 2,
            cubicInterpolationMode: 'monotone',
            ...style,
          });
        } else if (['AQ1', // 'AQ1_1'
          'AQ1_2', 'AQ1_3', 'AQ1_4', 'AQ1_5', 'AQ1_6'].includes(indicatorCode)) {
          Object.keys(featureData.fetchedData).forEach((satelliteId, ind) => {
            const data = featureData.fetchedData[satelliteId].referenceValue.map((x, i) => (
              { x, y: featureData.fetchedData[satelliteId].measurement[i] }
            ));
            datasets.push({
              label: satelliteId,
              fill: false,
              data,
              backgroundColor: refColors[ind],
              borderColor: refColors[ind],
              borderWidth: 1,
              pointRadius: 2,
              cubicInterpolationMode: 'monotone',
            });
          });
        } else if (['SOL1', 'SOL1_1', 'SOL1_2', 'SOL1_3', 'SOL1_4', 'SOL1_5', 'SOL1_6', 'SOL1_7',
          'SOL2', 'SOL2_1', 'SOL2_2', 'SOL2_3'].includes(indicatorCode)) {
          // Rendering for fetched data for rooftops
          Object.keys(featureData.fetchedData).forEach((gemId, ind) => {
            // for each gemeinde group into a dataset
            const x = [];
            const y = [];
            const zsps = [];
            const clrs = [];
            let counter = 0;
            const availableSelectedColors = ['#ff0000', '#f56042', '#db911a',
              '#9a08c7', '#e60532', '#d66d11'];
            Object.keys(featureData.fetchedData[gemId]).forEach((zspId) => {
              x.push(featureData.fetchedData[gemId][zspId].potential);
              y.push(featureData.fetchedData[gemId][zspId].totalroof);
              zsps.push(zspId);
              if (featureData.originalZsps.map((ftr) => ftr.getId())
                .includes(parseInt(zspId, 10))) {
                const ii = counter % availableSelectedColors.length;
                clrs.push(`${availableSelectedColors[ii]}80`);
                counter += 1;
              } else {
                const index = ind % refColors.length;
                // adding 0.5 alpha to each color
                clrs.push(`${refColors[index]}80`);
              }
            });
            const data = x.map((mm, j) => (
              { x: mm, y: y[j], zsp: zsps[j] }
            ));
            datasets.push({
              label: featureData.gemIds[gemId].trim(),
              fill: false,
              data,
              backgroundColor: clrs,
              borderColor: clrs,
              borderWidth: 1,
              pointRadius: 2,
            });
          });
        } else if (['REP4_5'].includes(indicatorCode)) {
          // Rendering for reservoirs LAC curve
          const data = featureData.referenceValue.map((x, i) => (
            { x, y: featureData.measurement[i] }
          ));
          // This should be done somehow different, but xAxis is not in indicator mapping
          // eslint-disable-next-line
          this.indicatorObject.xAxis = 'Area [m²]';
          datasets.push({
            label: indicator.yAxis,
            fill: false,
            data,
            backgroundColor: refColors[0],
            borderColor: refColors[0],
            borderWidth: 1,
            pointRadius: 4,
          });
        }
        if (['REP4_1', 'REP4_6'].includes(indicatorCode)) {
          // monthly average as extra dataset
          const average = [];
          let tempDate = featureData.time[0];
          let tmpVal = 0;
          let counter = 0;
          featureData.measurement.forEach((item, i) => {
            if (
              tempDate.month === featureData.time[i].month
              && tempDate.year === featureData.time[i].year
            ) {
              tmpVal += item;
              counter += 1;
            } else {
              average.push({
                t: DateTime.fromISO(tempDate.toISODate()).set({ day: 15 }),
                y: tmpVal / counter,
              });
              tempDate = DateTime.fromISO(featureData.time[i].toISODate());
              counter = 0;
              tmpVal = 0;
            }
          });
          datasets.push({
            label: 'Monthly average',
            data: average,
            fill: false,
            borderColor: 'black',
            backgroundColor: 'black',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
          });
        }
        if (['REP1', 'REP1_1', 'REP1_2'].includes(indicatorCode)) {
          const data = [];
          featureData.measurement.forEach((item, i) => {
            data.push({
              t: featureData.time[i],
              y: item,
            });
          });
          datasets.push({
            label: 'Monthly average wind speed for selected ZSP',
            data,
            fill: false,
            borderColor: '#003247',
            backgroundColor: '#003247',
            borderWidth: 1,
            pointRadius: 4,
          });
        }
        if (datasets.length === 0) {
          // No special handling of dataset is required we use default generator
          const data = featureData.time.map((date, i) => {
            colors.push(this.getIndicatorColor(featureData.colorCode[i]));
            return { t: date, y: featureData.measurement[i] };
          });
          const conf = {
            data,
            label: indicator.yAxis,
            backgroundColor: colors,
            borderColor: colors,
          };
          if (this.barChartIndicators.includes(indicatorCode)
            && !this.multiYearComparison.includes(indicatorCode)) {
            // Add barthicknes config to specific indicators
            conf.barThickness = 'flex';
          }
          datasets.push(conf);
        }
      }
      return { labels, datasets };
    },
    mapTimeUpdatedHandler(event) {
      // enable chart map time sync only if not part of custom dashboard
      if (this.enableMapTimeInteraction) {
        // set listener to highlight points for selected time on map via annotations
        if (event.data.command === 'chart:setTime') {
          this.dataLayerTimeFromMap = event.data.time;
        }
        if (event.data.command === 'chart:setCompareTime') {
          this.compareLayerTimeFromMap = event.data.time;
        }
        this.$nextTick(() => {
          const chart = this.getChartObject();
          if (chart && this.minZoom !== null) {
            chart.options.scales.xAxes[0].ticks.min = this.minZoom;
            chart.options.scales.xAxes[0].ticks.max = this.maxZoom;
            chart.update(false);
            this.$refs.zoomResetButton.$el.style.display = 'block';
          }
        });
      }
    },
    getChartObject() {
      if (this.$refs.lineChart) {
        return this.$refs.lineChart._data._chart;
      }
      if (this.$refs.barChart) {
        return this.$refs.barChart._data._chart;
      }
      if (this.$refs.scatterChart) {
        return this.$refs.scatterChart._data._chart;
      }
      return null;
    },
    resetZoom() {
      this.extentChanged(false);
      this.minZoom = null;
      this.maxZoom = null;
      if (this.$refs.lineChart) {
        this.$refs.lineChart.resetZoomExtent();
      } else {
        const chart = this.getChartObject();
        chart.resetZoom();
      }
    },
    formatNumRef(num, maxDecimals = 3) {
      return Number.parseFloat(num.toFixed(maxDecimals));
    },
    roundValueInd(val) {
      if (this.indDefinition.maxDecimals === -1) {
        return val;
      }
      if (Number.isInteger(this.indDefinition.maxDecimals)) {
        return this.formatNumRef(val, this.indDefinition.maxDecimals);
      }
      // use default
      return this.formatNumRef(val, 2);
    },
    chartOptions() {
      const customSettings = {};

      const defaultAnnotationSettings = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        borderWidth: 2,
        borderDash: [2, 3],
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'month',
            },
          }],
        },
        label: {
          enabled: true,
          fontStyle: 'normal',
          paddingX: 2,
          paddingY: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          fontColor: 'rgba(0, 0, 0, 0.8)',
        },
      };
      const indicatorCode = this.indicatorObject.indicator;
      const reference = Number.parseFloat(this.dataObject.referenceValue);
      const annotations = [];
      let low = 0;
      let high = 0;

      customSettings.onClick = (event, elements) => {
        // enable chart map time sync only if not part of custom dashboard
        if (this.enableMapTimeInteraction) {
          if (elements.length > 0) {
            // clicked some chart
            const chart = elements[0]._chart;
            const element = chart.getElementAtEvent(event)[0];
            const dataset = chart.data.datasets[element._datasetIndex];
            const timeSelected = dataset.data[element._index].t;
            if (timeSelected) {
              // reuse map event interface for scrolly
              let command = 'map:setTime';
              if (event.ctrlKey || event.shiftKey) {
                command = 'map:setCompareTime';
              }
              window.postMessage({
                command, time: timeSelected,
              });
            }
          }
        }
      };

      // Default tooltips
      customSettings.tooltips = {
        callbacks: {
          label: function (context, data) { // eslint-disable-line
            let label = data.datasets[context.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += this.roundValueInd(Number(context.value));
            return label;
          }.bind(this),
        },
      };

      if (!Number.isNaN(reference) && ['E13b', 'E200'].includes(indicatorCode)) {
        annotations.push({
          ...defaultAnnotationSettings,
          label: {
            ...defaultAnnotationSettings.label,
            content: `reference: ${this.formatNumRef(reference)}`,
          },
          value: reference,
        });
      }
      if (['E4'].includes(indicatorCode)) {
        low = 0.2 * reference;
        annotations.push({
          ...defaultAnnotationSettings,
          borderColor: 'rgba(50, 252, 0, 0.5)',
          value: low,
          label: {
            ...defaultAnnotationSettings.label,
            content: `on/off: ${this.formatNumRef(low)}`,
          },
        });
      } else if ([
        'E11', 'E1a', 'E1', 'E2', 'E2_S2', 'E1a_S2', 'E1_S2', 'E200',
      ].includes(indicatorCode)) {
        if (indicatorCode === 'E11') {
          low = 0.3 * reference;
          high = 0.7 * reference;
        } else {
          low = 0.7 * reference;
          high = 1.3 * reference;
        }
        annotations.push({
          ...defaultAnnotationSettings,
          value: low,
          label: {
            ...defaultAnnotationSettings.label,
            content: `low: ${this.formatNumRef(low)}`,
          },
        });
        annotations.push({
          ...defaultAnnotationSettings,
          value: high,
          label: {
            ...defaultAnnotationSettings.label,
            content: `high: ${this.formatNumRef(high)}`,
          },
        });
      }

      // Add specifically reference value as annotation
      if (!Number.isNaN(reference) && ['E13n'].includes(indicatorCode)) {
        annotations.push({
          ...defaultAnnotationSettings,
          label: {
            ...defaultAnnotationSettings.label,
            content: `reference: ${this.formatNumRef(reference)}`,
          },
          value: reference,
        });
      }

      if (['C1', 'C2', 'C3'].includes(indicatorCode)) {
        customSettings.yAxisRange = [
          Math.min(
            ...this.dataObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ) - 2,
          Math.max(
            ...this.dataObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ),
        ];
        if (indicatorCode === 'C2' && this.indicatorObject.aoiID === 'IT16') {
          // Special max value
          customSettings.yAxisRange[1] = 20000;
        }
        customSettings.timeConfig = {
          unit: 'month',
          displayFormats: { month: 'MMM yyyy' },
          tooltipFormat: 'MMM yyyy',
        };
      }

      if (['REP1', 'REP1_1', 'REP1_2'].includes(indicatorCode)) {
        customSettings.timeConfig = {
          unit: 'month',
          displayFormats: { month: 'MMM' },
          tooltipFormat: 'MMM',
        };
        customSettings.yAxisRange = [0, 8];
      }

      if (['E13d', 'E13n', 'OX', 'OX_EU'].includes(indicatorCode)) {
        customSettings.timeConfig = {
          unit: 'month',
          displayFormats: { month: 'MMM yy' },
          tooltipFormat: 'MMM yy',
        };
      }

      if (this.multiYearComparison.includes(indicatorCode)) {
        customSettings.timeConfig = {
          unit: 'month',
          displayFormats: { month: 'MMM' },
          tooltipFormat: 'MMM',
        };
        // Special case for comparison as has multiple entries per month
        if (indicatorCode === 'E10a1' && this.indicatorObject.aoiID === 'DE11') {
          customSettings.timeConfig = {
            displayFormats: { month: 'dd. MMM' },
            tooltipFormat: 'dd. MMM',
          };
        }
        // Another special case to also show days in tooltip
        if (['E10c'].includes(indicatorCode)) {
          customSettings.timeConfig.tooltipFormat = 'dd. MMM';
        }
        if (['VITS', 'PRCTS', 'SMCTS'].includes(indicatorCode)) {
          // Special tooltip information for these indicator
          customSettings.tooltips = {
            callbacks: {
              label: (context, data) => {
                const label = `${data.datasets[context.datasetIndex].label} measurement: ${Number(context.value)}`;
                return label;
              },
              footer: (context) => {
                const { datasets } = this.datacollection();
                const obj = datasets[context[0].datasetIndex].data[context[0].index];
                const labelOutput = `${this.indicatorObject.name} [climatic value]: ${obj.referenceValue}`;
                return labelOutput;
              },
            },
          };
        }
      }

      if (indicatorCode === 'E10a5') {
        customSettings.yAxisRange = [
          0,
          Math.max(
            ...this.dataObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ),
        ];
      }
      if (indicatorCode === 'E10a9') {
        customSettings.distribution = 'series';
      }
      if (indicatorCode === 'GGI_CH4') {
        customSettings.xAxisStacked = true;
      }

      if (['E10a3'].includes(indicatorCode)) {
        // Special tooltip information for this indicator
        customSettings.tooltips = {
          callbacks: {
            label: (context) => {
              const { datasets } = this.datacollection();
              const obj = datasets[context.datasetIndex].data[context.index];
              return obj.name;
            },
            footer: (context) => {
              const { datasets } = this.datacollection();
              const obj = datasets[context[0].datasetIndex].data[context[0].index];
              const refT = obj.referenceTime;
              const refV = Number(obj.referenceValue);
              const labelOutput = [
                `${obj.time.toISODate()}:  ${obj.value.toPrecision(4)}`,
                `${refT.toISODate()}:  ${refV.toPrecision(4)}`,
              ];
              if (refV !== 0) {
                labelOutput.push(
                  `${(((obj.value - refV) / refV) * 100).toPrecision(2)} %`,
                );
              }
              return labelOutput;
            },
          },
        };
      }

      if (['E10a6', 'E10a7'].includes(indicatorCode)) {
        // Adding labels to each point
        customSettings.plugins = {
          datalabels: {
            labels: {
              title: {
                color: (context) => context.dataset.backgroundColor,
                font: {
                  size: 10,
                },
                anchor: 'end',
                align: 'end',
                offset: (context) => {
                  if (context.chart.data.datasets.length === 2) {
                    if (context.datasetIndex === 0) {
                      if (!Number.isNaN(context.chart.data.datasets[1].data[context.dataIndex].y)
                        && context.chart.data.datasets[0].data[context.dataIndex].y
                        > context.chart.data.datasets[1].data[context.dataIndex].y) {
                        return 0;
                      }
                      return -28;
                    }
                    if (!Number.isNaN(context.chart.data.datasets[0].data[context.dataIndex].y)
                      && context.chart.data.datasets[0].data[context.dataIndex].y
                      > context.chart.data.datasets[1].data[context.dataIndex].y) {
                      return -28;
                    }
                    return 0;
                  }
                  return 0;
                },
                formatter: (value) => `${value.y.toFixed(1)}%`,
              },
            },
          },
        };
      }

      if (['E10a8'].includes(indicatorCode)) {
        // Special geo configuration for this indicator
        customSettings.geo = {
          radiusScale: {
            display: true,
            range: [5, 25],
            ticks: {
              max: 2000000,
            },
          },
        };
        // Special tooltip information for this indicator
        customSettings.tooltips = {
          callbacks: {
            label: (context) => {
              const { datasets } = this.datacollection();
              const obj = datasets[context.datasetIndex].data[context.index];
              return obj.name;
            },
            footer: (context) => {
              const { datasets } = this.datacollection();
              const obj = datasets[context[0].datasetIndex].data[context[0].index];
              const refV = Number(obj.referenceValue);
              const labelOutput = [
                `${obj.time.toISODate()}:`,
                `${(refV).toPrecision(4)} % harvested`,
                `${(100 - refV).toPrecision(4)} % not harvested`,
                `Max. area: ${obj.value} ha`,
              ];
              return labelOutput;
            },
          },
        };
      }

      // Special chart display for oilx data
      if (['OX', 'OX_EU'].includes(indicatorCode)) {
        customSettings.hover = {
          mode: 'nearest',
        };
        // We use min max values to define y axis scale range
        const min = Math.min(...this.dataObject.measurement);
        const max = Math.max(...this.dataObject.measurement);
        customSettings.yAxisOverwrite = {
          ticks: {
            callback: (...args) => {
              let returnString;
              if (args[0] === min) {
                returnString = 'Low';
              } else if (args[0] === max) {
                returnString = 'High';
              }
              return returnString;
            },
            min,
            max,
            label: '',
          },
          scaleLabel: {
            display: false,
          },
        };
        customSettings.tooltips = {
          callbacks: {
            label: () => '',
          },
        };
      }

      // Special logarithmic scale
      if (['N3'].includes(indicatorCode)) {
        customSettings.distribution = 'series';
        customSettings.yAxisOverwrite = {
          type: 'myLogScale',
          ticks: {
            callback: (...args) => {
              const value = Chart.Ticks.formatters.logarithmic.call(this, ...args);
              if (value.length) {
                return Number(value).toLocaleString();
              }
              return value;
            },
          },
        };
        customSettings.labelsExtend = {
          usePointStyle: true,
          boxWidth: 5,
        };
        customSettings.tooltips = {
          callbacks: {
            label: (context) => {
              const { datasets } = this.datacollection();
              const val = datasets[context.datasetIndex].data[context.index];
              return `Value (Log10): ${Math.log10(val.y).toPrecision(4)}`;
            },
          },
        };
      }

      // Special handling for SH Custom area /statistics chart including STD representation
      if ([
        'N1', 'N1_NO2_city_trilateral', 'SHCustomLineChart', 'N3', 'SST',
      ].includes(indicatorCode)) {
        customSettings.legendExtend = {
          onClick: function onClick(e, legendItem) {
            if (legendItem.text === 'Standard deviation (STD)') {
              const masterIndex = legendItem.datasetIndex;
              const ci = this.chart;
              // Find corresponding dataset we want to hide
              const hideIndex = ci.config.data.datasets.findIndex(
                (item) => item.label === 'hide_',
              );
              if (hideIndex !== -1) {
                const masterMeta = ci.getDatasetMeta(masterIndex);
                const meta = ci.getDatasetMeta(hideIndex);
                if (masterMeta.hidden === null) {
                  masterMeta.hidden = true;
                  meta.hidden = true;
                } else {
                  masterMeta.hidden = !masterMeta.hidden;
                  meta.hidden = !meta.hidden;
                }
                ci.update();
              }
            } else {
              Chart.defaults.global.legend.onClick.call(this, e, legendItem);
            }
          },
        };
      }

      // Custom labels for bar comparisons
      if (['E10a1', 'E10a5'].includes(indicatorCode)) {
        customSettings.plugins = {
          datalabels: {
            labels: {
              value: {
                anchor: 'end',
                align: 'end',
                offset: 10,
                formatter: (value, context) => {
                  let labelRes = '';
                  const percentage = Number(
                    context.chart.data.datasets[context.datasetIndex]
                      .data[context.dataIndex].indicatorValue,
                  );
                  if (!Number.isNaN(percentage)) {
                    const percVal = (percentage * 100).toPrecision(2);
                    if (percVal > 0) {
                      labelRes = `+${percVal}%`;
                    } else {
                      labelRes = `${percVal}%`;
                    }
                  }
                  return labelRes;
                },
                color: (context) => {
                  let color = 'red';
                  if (context.chart.data.datasets[context.datasetIndex]
                    .data[context.dataIndex].indicatorValue > 0) {
                    color = 'green';
                  }
                  return color;
                },
              },
              title: {
                color: 'black',
                anchor: 'end',
                align: 'end',
                offset: -6,
                formatter: (value) => value.y.toFixed(1),
              },
            },
          },
        };
      }

      // Barplots that shall begin at zero
      if (['E9'].includes(indicatorCode)) {
        customSettings.beginAtZero = true;
      }

      if (['REP4_1', 'REP4_6'].includes(indicatorCode)) {
        customSettings.tooltips = {
          callbacks: {
            label: (context, data) => {
              const obj = data.datasets[context.datasetIndex].data[context.index];
              const label = `${(obj.inputData)} - ${data.datasets[context.datasetIndex].label}: ${obj.y}`;
              return label;
            },
          },
        };
      }

      if (['SOL1', 'SOL1_1', 'SOL1_2', 'SOL1_3', 'SOL1_4', 'SOL1_5', 'SOL1_6', 'SOL1_7', 'SOL2', 'SOL2_1', 'SOL2_2', 'SOL2_3'].includes(indicatorCode)) {
        customSettings.tooltips = {
          callbacks: {
            label: (context, data) => {
              const obj = data.datasets[context.datasetIndex].data[context.index];
              const label = `Gem ${data.datasets[context.datasetIndex].label}: ZSP: ${(obj.zsp)}, pot: ${obj.x[0].toFixed(4)} km², exist: ${obj.y[0].toFixed(4)} km²`;
              return label;
            },
          },
        };
        const { refColors } = this.appConfig;
        customSettings.legend = {
          labels: {
            generateLabels: (chart) => {
              const visibility = [];
              for (let i = 0; i < chart.data.datasets.length; i++) {
                if (chart.isDatasetVisible(i) === false) {
                  visibility.push(true);
                } else {
                  visibility.push(false);
                }
              }
              return chart.data.datasets.map(
                (dataset, index) => ({
                  text: dataset.label,
                  fillStyle: refColors[index],
                  strokeStyle: refColors[index],
                  fontColor: refColors[index],
                  hidden: visibility[index],
                }),
              );
            },
          },
        };
      }
      const defaultTimeAnnotation = {
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderDash: [4, 4],
        borderWidth: 3,
        label: {
          xPadding: 3,
          yPadding: 3,
          xAdjust: -28,
          enabled: true,
          content: 'Map layer',
          fontSize: 10,
          backgroundColor: 'rgba(0,0,0,0.4)',
        },
      };

      if (this.dataLayerTimeFromMap) {
        annotations.push({
          ...defaultTimeAnnotation,
          value: this.dataLayerTimeFromMap,
        });
      }
      if (this.compareLayerTimeFromMap) {
        annotations.push({
          ...defaultTimeAnnotation,
          value: this.compareLayerTimeFromMap,
          label: {
            ...defaultTimeAnnotation.label,
            content: 'Compare layer',
            xAdjust: 38,
          },
        });
      }
      return {
        ...customSettings,
        annotation: {
          annotations,
        },
        animation: {
          duration: 0,
        },
        yAxis: this.indicatorObject.yAxis,
        xAxis: this.indicatorObject.xAxis,
        country: this.indicatorObject.country,
      };
    },
  },
  beforeDestroy() {
    window.removeEventListener('message', this.mapTimeUpdatedHandler);
  },
};
</script>

<style lang="scss" scoped>
.md-body {
  font-size: small;
}
</style>
