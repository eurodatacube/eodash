<template>
  <div style="width: 100%; height: 100%;"
    v-if="barChartIndicators.includes(indicatorObject.indicator)">
      <bar-chart v-if='datacollection'
        id="chart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection'
        :options='chartOptions()'
        v-bind="indicatorObject"></bar-chart>
  </div>
  <div style="width: 100%; height: 100%;"
    v-else-if="mapchartIndicators.includes(indicatorObject.indicator)">
      <map-chart
        id="chart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection'
        :options='chartOptions()'
        v-bind="indicatorObject">
      </map-chart>
      <img v-if="indicatorObject.indicator=='E10a3'"
        :src="require('@/assets/E10a3_label.jpg')" alt="color legend"
        style="position: absolute; width: 200px; z-index: 0;
        top: 0px; right: 0px;"/>
      <img v-else
        :src="require('@/assets/E10a8_label.jpg')" alt="color legend"
        style="position: absolute; width: 150px; z-index: 0;
        top: 0px; right: 0px;"/>
      <v-row
        class="justify-center align-center timeSelection mr-6 ml-0"
        style="position: absolute; bottom: 0px; z-index: 1000;
          width: auto; max-width: 100%;left:-45px;"
      >
        <v-col cols="6">
          <v-select
            outlined dense autofocus hide-details
            :prepend-inner-icon="(arrayOfObjects && dataLayerTime) && (arrayOfObjects
              .map((i) => i.value)
              .indexOf(dataLayerTime) > 0
                ? 'mdi-arrow-left-drop-circle'
                : 'mdi-asterisk')"
            :append-icon="(arrayOfObjects && dataLayerTime) && (arrayOfObjects
              .map((i) => i.value)
              .indexOf(dataLayerTime) < arrayOfObjects.length - 1
                ? 'mdi-arrow-right-drop-circle'
                : 'mdi-asterisk')"
            menu-props="auto"
            :items="arrayOfObjects"
            item-value="value"
            item-text="name"
            v-model="dataLayerTime"
            @change="dataLayerTimeSelection"
            @click:prepend-inner="dataLayerReduce"
            @click:append="dataLayerIncrease">
          </v-select>
        </v-col>
      </v-row>
  </div>
  <div style="width: 100%; height: 100%;" v-else>
    <line-chart v-if='lineChartIndicators.includes(indicatorObject.indicator)'
      id="chart"
      class="fill-height"
      :width="null"
      :height="null"
      :chart-data='datacollection'
      :options='chartOptions()'
      v-bind="indicatorObject"></line-chart>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import {
  mapState,
} from 'vuex';
import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';
import MapChart from '@/components/MapChart.vue';
import NUTS from '@/assets/NUTS_RG_03M_2016_4326_ESL2-DEL3.json';

export default {
  props: [
    'currentIndicator',
  ],
  components: {
    BarChart,
    LineChart,
    MapChart,
  },
  data() {
    return {
      dataLayerTime: null,
      dataLayerIndex: 0,
      lineChartIndicators: [
        'E12', 'E12b', 'E8', 'N1b', 'N1', 'N3', 'N3b',
        'GG', 'E10a', 'E10a9', 'CV', 'OW', 'E10c', 'E10a10',
        // Year overlap comparison
        'E10a2', 'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E10a6',

      ],
      barChartIndicators: [
        'E11', 'E13b', 'E13d', 'E200', 'E9', 'E1', 'E13b2', 'E1_S2',
        'E1a_S2', 'E2_S2', 'E4', 'E5', 'C1',
        'E13n',
        'E10a1', 'E10a5', // Year group comparison
      ],
      mapchartIndicators: ['E10a3', 'E10a8'],
    };
  },
  /*
  'E10a2', 'E10a3', 'E10a6', 'E10a7', 'E10a8', 'E10a9',
      'E10c', 'N1', 'N3', 'N3b', 'E8',
      'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m',
      'N1a', 'N1b', 'N1c', 'N1d', 'E12b', 'GG', 'GSA', 'CV', 'OW', 'OX', 'E10a10'
      */
  mounted() {
    const d = this.indicatorObject.time[this.indicatorObject.time.length - 1];
    this.dataLayerTime = d.toFormat('dd. MMM');
  },
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    arrayOfObjects() {
      const indicator = { ...this.indicatorObject };
      const indicatorCode = indicator.indicator;
      const selectionOptions = [];
      if (this.mapchartIndicators.includes(indicatorCode)) {
        // Find all unique day/month available
        const timeset = new Set(
          indicator.time.map((d) => d.toFormat('dd. MMM')),
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
    datacollection() {
      const indicator = { ...this.indicatorObject };
      const indicatorCode = indicator.indicator;
      let dataCollection;
      const refColors = [
        '#22aa99', '#a37', '#47a', '#a67', '#283', '#bbb',
        '#6ce', '#994499', '#aaaa11', '#6633cc', '#e67300',
      ];
      if (indicator) {
        let labels = [];
        const { measurement } = indicator;
        const colors = [];
        const datasets = [];
        if (['E10a9'].includes(indicatorCode)) {
          const categories = [
            'National Workers',
            'Foreign Workers',
            'Unknown',
          ];
          categories.forEach((key, idx) => {
            const data = indicator.measurement.map((row, rowIdx) => ({
              t: indicator.time[rowIdx],
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
        } else if (['GG'].includes(indicatorCode)) {
          const vals = indicator.Values;
          const datasetsObj = {
            grocery: [],
            parks: [],
            residential: [],
            retail_recreation: [],
            transit_stations: [],
          };
          for (let entry = 0; entry < vals.length; entry += 1) {
            const t = DateTime.fromISO(vals[entry].date);
            datasetsObj.grocery.push({ t, y: vals[entry].grocery });
            datasetsObj.parks.push({ t, y: vals[entry].parks });
            datasetsObj.residential.push({ t, y: vals[entry].residential });
            datasetsObj.retail_recreation.push({ t, y: vals[entry].retail_recreation });
            datasetsObj.transit_stations.push({ t, y: vals[entry].transit_stations });
          }
          Object.keys(datasetsObj).forEach((key, idx) => {
            datasets.push({
              label: key,
              data: datasetsObj[key],
              fill: false,
              borderColor: refColors[idx],
              backgroundColor: refColors[idx],
              borderWidth: 1,
              pointRadius: 2,
              cubicInterpolationMode: 'monotone',
            });
          });
        } else if (['GSA'].includes(indicatorCode)) {
          const vals = Object.keys(indicator.values);
          const datasetsObj = {};
          for (let entry = 0; entry < vals.length; entry += 1) {
            datasetsObj[vals[entry]] = [];
            const currVals = indicator.values[vals[entry]].values;
            for (let i = 0; i < currVals.length; i += 1) {
              datasetsObj[vals[entry]].push({
                t: DateTime.fromISO(currVals[i].timestamp),
                y: Number(currVals[i].waiting_time),
              });
            }
            // It seems some timstamps are mixed in order so let us sort by date
            // to get nice line connections through the timeline
            datasetsObj[vals[entry]].sort((a, b) => a.t.toMillis() - b.t.toMillis());
          }
          Object.keys(indicator.values).forEach((key, idx) => {
            datasets.push({
              label: key,
              data: datasetsObj[key],
              fill: false,
              borderColor: refColors[idx],
              backgroundColor: refColors[idx],
              borderWidth: 1,
              pointRadius: 2,
              cubicInterpolationMode: 'monotone',
            });
          });
        } else if (['CV'].includes(indicatorCode)) {
          const vals = indicator.Values;
          const datasetsObj = {
            confirmed: [],
          };
          for (let entry = 0; entry < vals.length; entry += 1) {
            const t = DateTime.fromISO(vals[entry].date);
            datasetsObj.confirmed.push({ t, y: Number(vals[entry].confirmed) });
          }
          Object.keys(datasetsObj).forEach((key, idx) => {
            datasets.push({
              label: key,
              data: datasetsObj[key],
              fill: false,
              borderColor: refColors[idx],
              backgroundColor: refColors[idx],
              borderWidth: 1,
              pointRadius: 2,
              cubicInterpolationMode: 'monotone',
            });
          });
        } else if (['OW'].includes(indicatorCode)) {
          const vals = indicator.Values;
          const pI = [
            'total_vaccinations', 'people_fully_vaccinated',
            'daily_vaccinations',
          ];
          const datasetsObj = {};
          for (let idx = 0; idx < pI.length; idx += 1) {
            datasetsObj[pI[idx]] = [];
          }
          for (let entry = 0; entry < vals.length; entry += 1) {
            const t = DateTime.fromISO(vals[entry].date);
            for (let idx = 0; idx < pI.length; idx += 1) {
              datasetsObj[pI[idx]].push({ t, y: vals[entry][pI[idx]] });
            }
          }
          Object.keys(datasetsObj).forEach((key, idx) => {
            datasets.push({
              label: key,
              data: datasetsObj[key],
              fill: false,
              borderColor: refColors[idx],
              backgroundColor: refColors[idx],
              borderWidth: 1,
              pointRadius: 2,
              cubicInterpolationMode: 'monotone',
            });
          });
        } else if (['N3b'].includes(indicatorCode)) {
          const sensors = Array.from(new Set(indicator.eoSensor)).sort();
          for (let pp = 0; pp < sensors.length; pp += 1) {
            const pKey = sensors[pp];
            const data = indicator.time.map((date, i) => {
              let output = null;
              if (indicator.eoSensor[i] === pKey) {
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
        } else if (['N4c'].includes(indicatorCode)) {
          const measData = indicator.measurement.map(Number);
          measData.shift();
          const refData = indicator.referenceValue.map(Number);
          refData.shift();

          labels = [
            indicator.referenceTime[0].toISODate(),
            indicator.time[0].toISODate(),
            indicator.time[5].toISODate(),
          ];

          datasets.push({
            label: 'metallic waste area',
            data: [refData[0], measData[0], measData[5]],
            backgroundColor: refColors[0],
          });
          datasets.push({
            label: 'mixed waste area',
            data: [refData[1], measData[1], measData[6]],
            backgroundColor: refColors[1],
          });
          datasets.push({
            label: 'plastic waste area',
            data: [refData[2], measData[2], measData[7]],
            backgroundColor: refColors[2],
          });
          datasets.push({
            label: 'soil waste area',
            data: [refData[3], measData[3], measData[8]],
            backgroundColor: refColors[3],
          });
        } else if (['E10a1', 'E10a5'].includes(indicatorCode)) {
          const uniqueRefs = [];
          const uniqueMeas = [];
          const referenceValue = indicator.referenceValue.map(Number);
          indicator.time.forEach((date, i) => {
            const meas = {
              t: date.set({
                year: 2000, day: 1, hour: 1, minute: 0, second: 0,
              }),
              y: measurement[i],
              indicatorValue: indicator.indicatorValue[i],
            };
            if (typeof uniqueMeas.find((item) => item.t.equals(meas.t)) === 'undefined') {
              uniqueMeas.push(meas);
            }
          });
          indicator.referenceTime.forEach((date, i) => {
            if (!['', '/'].includes(indicator.referenceValue[i])) {
              const ref = {
                t: date.set({
                  year: 2000, day: 1, hour: 1, minute: 0, second: 0,
                }),
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
        } else if (['E10a2', 'E10a6', 'E10a7', 'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m'].includes(indicatorCode)) {
          const uniqueRefs = [];
          const uniqueMeas = [];
          const referenceValue = indicator.referenceValue.map(Number);
          indicator.time.forEach((date, i) => {
            const meas = {
              t: date.set({ year: 2000 }),
              y: measurement[i],
            };
            if (typeof uniqueMeas.find((item) => item.t.equals(meas.t)) === 'undefined') {
              uniqueMeas.push(meas);
            }
          });
          indicator.referenceTime.forEach((date, i) => {
            if (!['', '/'].includes(indicator.referenceValue[i])) {
              const ref = {
                t: date.set({ year: 2000 }),
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
        } else if (['E10a10'].includes(indicatorCode)) {
          const data = [];
          const refData = [];
          indicator.time.forEach((t, i) => {
            data.push({ t, y: measurement[i] * 100 });
            refData.push({ t, y: indicator.referenceValue[i] * 100 });
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
          indicator.indicatorValue.forEach((ind, idx) => {
            if (Object.keys(types).includes(ind)) {
              types[ind].push({
                t: DateTime.fromISO(indicator.time[idx]),
                y: Number(indicator.measurement[idx]),
              });
            } else {
              types[ind] = [{
                t: DateTime.fromISO(indicator.time[idx]),
                y: Number(indicator.measurement[idx]),
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
        } else if (['N2', 'E10c'].includes(indicatorCode)) {
          /* Group data by year in month slices */
          const data = indicator.time.map((date, i) => {
            colors.push(this.getIndicatorColor(indicator.colorCode[i]));
            return { t: date, y: measurement[i] };
          });
          const dataGroups = {};
          const colorGroups = {};
          for (let i = 0; i < data.length; i += 1) {
            const currYear = data[i].t.year;
            if (Object.prototype.hasOwnProperty.call(dataGroups, currYear)) {
              dataGroups[currYear].push({
                t: data[i].t.set({ year: 2000 }),
                y: [data[i].y],
              });
              colorGroups[currYear].push(colors[i]);
            } else {
              dataGroups[currYear] = [{
                t: data[i].t.set({ year: 2000 }),
                y: [data[i].y],
              }];
              colorGroups[currYear] = [colors[i]];
            }
          }
          const uniqueYears = Object.keys(dataGroups);
          uniqueYears.sort();
          const yLength = uniqueYears.length - 1;
          uniqueYears.forEach((key, i) => {
            datasets.push({
              // fill with empty values
              indLabels: Array(dataGroups[key].length).join('.').split('.'),
              label: key,
              fill: false,
              data: dataGroups[key],
              backgroundColor: refColors[yLength - i],
              borderColor: refColors[yLength - i],
              borderWidth: 2,
            });
          });
        } else if (['OX'].includes(indicatorCode)) {
          const data = [];
          const average = [];
          let counter = 0;
          let tmpVal = 0;
          let tmpTime = 0;
          indicator.measurement.forEach((item, i) => {
            data.push({
              t: indicator.time[i],
              y: item,
              color: indicator.indicatorValue[i],
            });
            if (counter < 4) {
              tmpVal += item;
              tmpTime += indicator.time[i].toMillis();
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
              lowData.push({ t: entry.t, y: 0.35 });
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
              regularData.push({ t: entry.t, y: 0.5 });
            }
          });
          datasets.push({
            label: 'Site Regular',
            data: regularData,
            fill: false,
            borderColor: this.getIndicatorColor('BLUE'),
            backgroundColor: this.getIndicatorColor('BLUE'),
            borderWidth: 0,
            pointRadius: 3,
            showLine: false,
          });
          const highData = [];
          data.forEach((entry) => {
            if (entry.color === 'Red (High)' || entry.color === 'Orange (High)') {
              highData.push({ t: entry.t, y: 0.65 });
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
        } else if (['N1'].includes(indicatorCode)) {
          const stdDevMin = [];
          const stdDevMax = [];
          const min = [];
          const max = [];
          const median = [];
          const data = [];
          indicator.referenceValue.forEach((item, i) => {
            const t = indicator.time[i];
            data.push({ y: measurement[i], t });
            if (!Number.isNaN(item) && !['NaN', '/'].includes(item)) {
              const obj = JSON.parse(item);
              // [median,std,max,min,percentage valid pixels]
              median.push({ y: obj[0], t });
              if (obj[1] !== null) {
                stdDevMin.push({ y: measurement[i] - obj[1], t });
                stdDevMax.push({ y: measurement[i] + obj[1], t });
              }
              max.push({ y: obj[2], t });
              min.push({ y: obj[3], t });
            } else {
              median.push({ y: Number.NaN, t });
              stdDevMin.push({ y: Number.NaN, t });
              stdDevMax.push({ y: Number.NaN, t });
              max.push({ y: Number.NaN, t });
              min.push({ y: Number.NaN, t });
            }
          });
          datasets.push({
            label: indicator.yAxis,
            data,
            fill: false,
            backgroundColor: refColors[0],
            borderColor: refColors[0],
            spanGaps: false,
            borderWidth: 2,
          });
          // Check for empty array, if it is the case do not include data
          if (typeof (median.find((a) => a.y !== null)) !== 'undefined') {
            datasets.push({
              label: 'Median',
              data: median,
              fill: false,
              pointRadius: 0,
              borderColor: 'black',
              borderWidth: 1,
              pointStyle: 'line',
              spanGaps: false,
            });
          }
          // Check for empty array, if it is the case do not include data
          if (typeof (min.find((a) => a.y !== null)) !== 'undefined') {
            datasets.push({
              label: 'Min',
              data: min,
              fill: false,
              pointRadius: 0,
              backgroundColor: refColors[4],
              borderColor: refColors[4],
              borderWidth: 1,
              pointStyle: 'line',
              spanGaps: false,
            });
          }
          // Check for empty array, if it is the case do not include data
          if (typeof (max.find((a) => a.y !== null)) !== 'undefined') {
            datasets.push({
              label: 'Max',
              data: max,
              fill: false,
              pointRadius: 0,
              backgroundColor: refColors[1],
              borderColor: refColors[1],
              borderWidth: 1,
              pointStyle: 'line',
              spanGaps: false,
            });
          }
          // Check for empty array, if it is the case do not include data
          if (typeof (stdDevMax.find((a) => a.y !== null)) !== 'undefined') {
            datasets.push({
              label: 'Standard deviation (STD)',
              data: stdDevMax,
              fill: '+1',
              pointRadius: 0,
              spanGaps: false,
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderColor: 'rgba(0,0,0,0.0)',
              pointStyle: 'rect',
            });
          }
          // Check for empty array, if it is the case do not include data
          if (typeof (stdDevMin.find((a) => a.y !== null)) !== 'undefined') {
            datasets.push({
              label: 'hide_',
              data: stdDevMin,
              fill: '-1',
              pointRadius: 0,
              spanGaps: false,
              backgroundColor: 'rgba(0,0,0,0.0)',
              borderColor: 'rgba(0,0,0,0.0)',
              pointStyle: 'rect',
            });
          }
        } else if (['N3'].includes(indicatorCode)) {
          let referenceValue = [];
          const stdDev = [];
          indicator.referenceValue.forEach((item) => {
            if (!Number.isNaN(item) && !['NaN', '[NaN NaN]', '/'].includes(item)) {
              const obj = JSON.parse(item.replace(/,/g, '.').replace(' ', ','));
              if (obj[0] !== -999 && obj[1] !== -999) {
                referenceValue.push(obj[0]);
                stdDev.push(obj[1]);
              } else {
                referenceValue.push(Number.NaN);
                stdDev.push(Number.NaN);
              }
            } else {
              referenceValue.push(Number.NaN);
              stdDev.push(Number.NaN);
            }
          });

          const stdDevMax = stdDev.map((dev, i) => (
            Number.isNaN(referenceValue[i])
              ? Number.NaN
              : (10 ** (referenceValue[i] + dev))
          ));
          const stdDevMin = stdDev.map((dev, i) => (
            Number.isNaN(referenceValue[i])
              ? Number.NaN
              : (10 ** (referenceValue[i] - dev))
          ));

          referenceValue = referenceValue.map((val) => (
            Number.isNaN(val) ? Number.NaN : (10 ** val)
          ));

          for (let i = 0; i < indicator.time.length; i += 1) {
            if (!Number.isNaN(indicator.time[i].toMillis())) {
              labels.push(indicator.time[i].toISODate());
            } else {
              labels.push(i);
            }
            let colorCode = '';
            if (Object.prototype.hasOwnProperty.call(indicator, 'colorCode')) {
              colorCode = indicator.colorCode[i];
            }
            colors.push(this.getIndicatorColor(colorCode));
          }

          datasets.push({
            label: 'Weekly climatology of chlorophyll conc. (CHL_clim) 2017-2019',
            data: referenceValue,
            fill: false,
            pointRadius: 0,
            borderColor: 'black',
            pointStyle: 'line',
            spanGaps: false,
          });
          datasets.push({
            label: 'Standard deviation (STD)',
            data: stdDevMax,
            fill: '+1',
            pointRadius: 0,
            spanGaps: false,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderColor: 'rgba(0,0,0,0.0)',
            pointStyle: 'rect',
          });
          datasets.push({
            label: 'hide_',
            data: stdDevMin,
            fill: '-1',
            pointRadius: 0,
            spanGaps: false,
            backgroundColor: 'rgba(0,0,0,0.0)',
            borderColor: 'rgba(0,0,0,0.0)',
            pointStyle: 'rect',
          });

          // Find unique indicator values
          const indicatorValues = {};
          indicator.indicatorValue.map((val, i) => {
            let key = val.toLowerCase();
            key = key.charAt(0).toUpperCase() + key.slice(1);
            if (!['', '/'].includes(key) && typeof indicatorValues[key] === 'undefined') {
              indicatorValues[key] = this.getIndicatorColor(
                indicator.colorCode[i],
              );
            }
            return null;
          });

          Object.entries(indicatorValues).forEach(([key, value]) => {
            const currMeas = measurement.map((row, i) => {
              let val = row;
              if (indicator.indicatorValue[i] !== key.toUpperCase()) {
                val = NaN;
              }
              return val;
            });
            datasets.push({
              label: key,
              data: currMeas.map((val) => (
                Number.isNaN(val) ? Number.NaN : (10 ** val)
              )),
              backgroundColor: value,
              borderColor: value,
              fill: false,
              showLine: false,
              spanGaps: false,
            });
          });
        } else if (['N1a', 'N1b', 'N1c', 'N1d', 'E12b', 'E8'].includes(indicatorCode)) {
          const maxRef = [];
          const minRef = [];
          const mean7dRef = [];
          const mean7d2020 = [];
          indicator.referenceValue.forEach((item, i) => {
            const t = indicator.time[i];
            if (!['', '/'].includes(item)) {
              const obj = item.replace(/[[\] ]/g, '').split(',')
                .map((str) => (str === '' ? Number.NaN : Number(str)));
              maxRef.push({ y: obj[0], t });
              minRef.push({ y: obj[1], t });
              mean7dRef.push({ y: obj[2], t });
              mean7d2020.push({ y: obj[3], t });
            } else {
              maxRef.push({ y: Number.NaN, t });
              minRef.push({ y: Number.NaN, t });
              mean7dRef.push({ y: Number.NaN, t });
              mean7d2020.push({ y: Number.NaN, t });
            }
          });

          datasets.push({
            label: 'Value',
            data: measurement.map((meas, i) => ({ y: meas, t: indicator.time[i] })),
            backgroundColor: 'rgba(255,255,255,0.0)',
            borderColor: 'red',
            spanGaps: false,
            pointRadius: 0,
            borderWidth: 1.5,
          });
          datasets.push({
            label: '7-day mean',
            data: mean7d2020,
            backgroundColor: 'rgba(255,255,255,0.0)',
            pointRadius: 0,
            borderColor: 'red',
            spanGaps: false,
            borderDash: [6, 3],
            borderWidth: 2,
          });
          datasets.push({
            label: '2017-2019 7d mean',
            data: mean7dRef,
            backgroundColor: 'rgba(255,255,255,0.0)',
            pointRadius: 0,
            borderColor: 'grey',
            spanGaps: false,
            borderDash: [6, 3],
            borderWidth: 2,
          });
          datasets.push({
            label: '2017-2019 range',
            data: maxRef,
            fill: 4,
            pointRadius: 0,
            spanGaps: false,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(0,0,0,0.0)',
            pointStyle: 'rect',
          });
          datasets.push({
            label: 'hide_',
            data: minRef,
            fill: 3,
            pointRadius: 0,
            spanGaps: false,
            backgroundColor: 'rgba(0,0,0,0.0)',
            borderColor: 'rgba(0,0,0,0.0)',
            pointStyle: 'rect',
          });

          // Find unique indicator values
          const indicatorValues = {};
          indicator.indicatorValue.map((val, i) => {
            let key = val.toLowerCase();
            key = key.charAt(0).toUpperCase() + key.slice(1);
            if (!['', '/'].includes(key) && typeof indicatorValues[key] === 'undefined') {
              indicatorValues[key] = this.getIndicatorColor(
                indicator.colorCode[i],
              );
            }
            return null;
          });

          Object.entries(indicatorValues).forEach(([key, value]) => {
            datasets.push({
              label: key,
              data: [],
              backgroundColor: value,
              borderColor: value,
            });
          });
        } else if (['E10a3', 'E10a8'].includes(indicatorCode)) {
          const nutsFeatures = NUTS.features;
          const outline = [];
          const currIDs = [];
          let features = measurement.map((meas, i) => {
            // Find correct NUTS ID Shape
            const geom = nutsFeatures.find((f) => (
              f.properties.NUTS_ID === indicator.siteName[i]));
            let output;
            if (geom) {
              if (currIDs.indexOf(indicator.siteName[i]) === -1) {
                currIDs.push(indicator.siteName[i]);
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
                time: indicator.time[i],
                value: Number(meas),
                referenceTime: indicator.referenceTime[i],
                referenceValue: indicator.referenceValue[i],
                color: indicator.colorCode[i],
              };
              if (indicatorCode === 'E10a8') {
                // Swap value to have reference value
                output.value = Number(indicator.referenceValue[i]);
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
            if (d.time instanceof DateTime) {
              include = d.time.toFormat('dd. MMM') === this.dataLayerTime
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
        } else {
          const data = indicator.time.map((date, i) => {
            colors.push(this.getIndicatorColor(indicator.colorCode[i]));
            return { t: date, y: measurement[i] };
          });
          datasets.push({
            data,
            label: indicator.yAxis,
            backgroundColor: colors,
            borderColor: colors,
          });
        }
        dataCollection = {
          labels,
          datasets,
        };
      }
      return dataCollection;
    },
    indicatorObject() {
      return this.currentIndicator
        || this.$store.state.indicators.customAreaIndicator
        || this.$store.state.indicators.selectedIndicator;
    },
    indDefinition() {
      return this.baseConfig.indicatorsDefinition[this.indicatorObject.indicator];
    },
  },
  methods: {
    dataLayerTimeSelection(payload) {
      this.dataLayerTime = payload;
      const newIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.dataLayerTime);
      this.dataLayerIndex = newIndex;
    },
    dataLayerReduce() {
      const currentIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.dataLayerTime);
      this.dataLayerIndex = currentIndex - 1;
      this.dataLayerTimeSelection(this.arrayOfObjects[currentIndex - 1].value);
    },
    dataLayerIncrease() {
      const currentIndex = this.arrayOfObjects
        .map((i) => i.value)
        .indexOf(this.dataLayerTime);
      this.dataLayerIndex = currentIndex + 1;
      this.dataLayerTimeSelection(this.arrayOfObjects[currentIndex + 1].value);
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
    getMinMaxDate(timeData) {
      let timeMin = Math.min.apply(null, timeData.map((d) => d.toMillis()));
      let timeMax = Math.max.apply(null, timeData.map((d) => d.toMillis()));
      const buffer = (timeMax - timeMin) / timeData.length;
      timeMin -= buffer;
      timeMax += buffer;
      return [timeMin, timeMax];
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
      const reference = Number.parseFloat(this.indicatorObject.referenceValue);
      const annotations = [];
      let low = 0;
      let high = 0;

      if (!Number.isNaN(reference) && ['E13b'].includes(indicatorCode)) {
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

      if (['E10a3'].includes(indicatorCode)) {
        // Special tooltip information for this indicator
        customSettings.tooltips = {
          callbacks: {
            label: (context) => {
              const { datasets } = this.datacollection;
              const obj = datasets[context.datasetIndex].data[context.index];
              return obj.name;
            },
            footer: (context) => {
              const { datasets } = this.datacollection;
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

      if ([
        'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E10a1', 'E10a2', 'E10a5', 'E10a6',
      ].includes(indicatorCode)) {
        // Special time range for same year comparisons
        customSettings.sameYearComparison = true;
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
              const { datasets } = this.datacollection;
              const obj = datasets[context.datasetIndex].data[context.index];
              return obj.name;
            },
            footer: (context) => {
              const { datasets } = this.datacollection;
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
                    const percVal = (percentage * 100).toPrecision(4);
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
      return {
        ...customSettings,
        annotation: {
          annotations,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.md-body {
  font-size: small;
}
::v-deep .mdi-asterisk {
  visibility: hidden;
}
</style>
