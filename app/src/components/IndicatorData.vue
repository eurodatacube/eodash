<template>
  <div style="width: 100%; height: 100%;"
    v-if="!['E10a2', 'E10a3', 'E10a6', 'E10a7', 'E10a8', 'E10a9',
      'E10c', 'N1', 'N3', 'N3b', 'E8',
      'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m',
      'N1a', 'N1b', 'N1c', 'N1d', 'E12b', 'GG', 'GSA', 'CV', 'OW']
      .includes(indicatorObject.indicator)">
      <bar-chart v-if='datacollection'
        id="chart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection'
        :options='chartOptions()'></bar-chart>
  </div>
  <div style="width: 100%; height: 100%;"
    v-else-if="['E10a3', 'E10a8'].includes(indicatorObject.indicator)">
      <map-chart
        id="chart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection'
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
    <line-chart v-if='datacollection'
      id="chart"
      class="fill-height"
      :width="null"
      :height="null"
      :chart-data='datacollection'
      :options='chartOptions()'></line-chart>
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
import lockdownTimes from '@/assets/lockdown_data.json';
import countries from '@/assets/countries.json';

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
    };
  },
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
      if (['E10a3', 'E10a8'].includes(indicatorCode)) {
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
        if (['E10a1', 'E10a5'].includes(indicatorCode)) {
          const referenceValue = indicator.referenceValue.map(Number);
          for (let i = 0; i < indicator.time.length; i += 1) {
            if (!Number.isNaN(indicator.time[i].toMillis())) {
              const d = indicator.time[i];
              const formattedDate = d.toFormat('dd. MMM');
              labels.push(formattedDate);
            } else {
              labels.push(i);
            }
          }
          const labelref = '2019';
          const labelmeas = '2020';
          datasets.push({
            indLabels: Array(indicator.indicatorValue.length).join('.').split('.'),
            label: labelref,
            data: referenceValue,
            fill: false,
            backgroundColor: 'grey',
          });
          datasets.push({
            indLabels: indicator.indicatorValue,
            label: labelmeas,
            data: measurement,
            fill: false,
            backgroundColor: 'black',
          });
        } else if (['E10a9'].includes(indicatorCode)) {
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
        } else if (['E10a2', 'E10a6', 'E10a7', 'E8', 'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m'].includes(indicatorCode)) {
          const uniqueRefs = [];
          const uniqueMeas = [];
          const referenceValue = indicator.referenceValue.map(Number);
          indicator.time.forEach((date, i) => {
            const meas = { t: date.set({ year: 2000 }), y: measurement[i] };
            if (typeof uniqueRefs.find((item) => item.t.equals(meas.t)) === 'undefined') {
              uniqueMeas.push(meas);
            }
          });
          indicator.referenceTime.forEach((date, i) => {
            if (!['', '/'].includes(indicator.referenceValue[i])) {
              const ref = { t: date.set({ year: 2000 }), y: referenceValue[i] };
              if (typeof uniqueRefs.find((item) => item.t.equals(ref.t)) === 'undefined') {
                uniqueRefs.push(ref);
              }
            }
          });
          datasets.push({
            label: '2020',
            data: uniqueMeas,
            fill: false,
            borderColor: refColors[1],
            backgroundColor: refColors[1],
            borderWidth: 2,
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
        } else if (['N1a', 'N1b', 'N1c', 'N1d', 'E12b'].includes(indicatorCode)) {
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
      const indicatorCode = this.indicatorObject.indicator;
      const reference = Number.parseFloat(this.indicatorObject.referenceValue);
      let timeMinMax = this.getMinMaxDate(this.indicatorObject.time);
      const annotations = [];
      let low = 0;
      let high = 0;
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
      if (!Number.isNaN(reference)
        && !['E10a1', 'E10a2', 'E10a5', 'E10a6', 'E10a7', 'E10a9', 'N4c', 'E8', 'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m', 'E12c', 'E12d']
          .includes(indicatorCode)) {
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
      } else if (['E11', 'E1a', 'E1', 'E2', 'E2_S2', 'E1a_S2', 'E1_S2'].includes(indicatorCode)) {
        if (indicatorCode === 'E11') {
          low = 0.3 * reference;
          high = 0.7 * reference;
        } else if (['E1a', 'E1', 'E2', 'E2_S2', 'E1a_S2', 'E1_S2'].includes(indicatorCode)) {
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

      // Introduce background area annotations for lockdown times, does not
      // work for all chart types, so we make sure it is not any of those charts
      if (!['E10a3', 'E10a8', 'N2', 'E12c', 'E12d', 'GSA'].includes(indicatorCode)) {
        // Find country based on alpha-3 code
        const currCountry = countries.features.find(
          (cntr) => cntr.properties.alpha2 === this.indicatorObject.country,
        );
        if (typeof currCountry !== 'undefined'
          && Object.prototype.hasOwnProperty.call(lockdownTimes, currCountry.id)) {
          const lckTs = lockdownTimes[currCountry.id]['C7_Restrictions on internal movement'];
          for (let i = 0; i < lckTs.length; i++) {
            let areaColor = 'rgba(0, 0, 0, 0.0)';
            if (lckTs[i].value === 1) {
              areaColor = 'rgba(204, 143, 143, 0.24)';
            } else if (lckTs[i].value === 2) {
              areaColor = 'rgba(207, 109, 109, 0.54)';
            }
            // We also have special date handling for some chart types as we
            // simulate year agnostic rendering, so we convert all dates to
            // one year
            let start = DateTime.fromISO(lckTs[i].start);
            let end = DateTime.fromISO(lckTs[i].end);
            if (['E10a2', 'E10a6', 'E10a7', 'E10c', 'E8', 'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m'].includes(indicatorCode)) {
              start = start.set({ year: 2000 });
              end = end.set({ year: 2000 });
            }
            if (lckTs[i].value !== 0) {
              annotations.push({
                drawTime: 'beforeDatasetsDraw',
                type: 'box',
                xScaleID: 'x-axis-0',
                xMin: start.toISODate(),
                xMax: end.toISODate(),
                borderColor: areaColor,
                borderWidth: 0,
                backgroundColor: areaColor,
              });
            }
          }
        }
      }

      let xAxes = {};
      if (!['E10a1', 'E10a2', 'E10a3', 'E10a5', 'E10a6', 'E10a7', 'E10a8', 'E10c', 'E12c', 'E12d', 'N2'].includes(indicatorCode)) {
        xAxes = [{
          type: 'time',
          time: {
            unit: 'week',
          },
          ticks: {
            min: timeMinMax[0],
            max: timeMinMax[1],
          },
          barThickness: 'flex',
        }];
        if (!['N3', 'N3b'].includes(indicatorCode)) {
          xAxes[0].distribution = 'series';
        }
      }

      if (['E10a2', 'E10a6', 'E10a7', 'E10c', 'E8', 'E13e', 'E13f', 'E13g', 'E13h', 'E13i', 'E13l', 'E13m'].includes(indicatorCode)) {
        /* Recalculate to get min max months in data converted to one year */
        timeMinMax = this.getMinMaxDate(
          this.indicatorObject.time.map((date) => (
            date.set({ year: 2000 })
          )),
        );
        /* Check also for reference time */
        const refTimeMinMax = this.getMinMaxDate(
          this.indicatorObject.referenceTime.map((date) => (
            date.set({ year: 2000 })
          )),
        );
        xAxes = [{
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM',
            },
            tooltipFormat: 'dd. MMM',
          },
          ticks: {
            min: (timeMinMax[0] < refTimeMinMax[0]) ? timeMinMax[0] : refTimeMinMax[0],
            max: (timeMinMax[1] > refTimeMinMax[1]) ? timeMinMax[1] : refTimeMinMax[1],
          },
        }];
      }

      if (['N2'].includes(indicatorCode)) {
        timeMinMax = this.getMinMaxDate(
          this.indicatorObject.time.map((date) => (
            date.set({ year: 2000 })
          )),
        );
        xAxes = [{
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM',
            },
            tooltipFormat: 'dd. MMM',
          },
          distribution: 'series',
          ticks: {
            min: timeMinMax[0],
            max: timeMinMax[1],
          },
        }];
      }

      if (['E12c', 'E12d'].includes(indicatorCode)) {
        xAxes = [{
          type: 'time',
          time: {
            unit: 'year',
            displayFormats: {
              year: 'yyyy',
            },
            tooltipFormat: 'yyyy-MM-dd - yyyy-06-30',
          },
          distribution: 'series',
          ticks: {
            min: timeMinMax[0],
            max: timeMinMax[1],
          },
        }];
      }

      if (['E13d', 'E13n', 'C1', 'C2', 'C3'].includes(indicatorCode)) {
        xAxes = [{
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM yy',
            },
            tooltipFormat: 'MMM yyyy',
          },
          distribution: 'series',
          ticks: {
            min: timeMinMax[0],
            max: timeMinMax[1],
          },
        }];
      }


      let plugins = {
        datalabels: {
          display: false,
        },
      };

      const yAxes = [{
        scaleLabel: {
          display: true,
          labelString: this.indicatorObject.yAxis,
          padding: 2,
        },
        ticks: {
          lineHeight: 1,
          suggestedMin: Math.min(
            ...this.indicatorObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ) - 1,
          suggestedMax: Math.max(
            ...this.indicatorObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ) + 1,
        },
      }];

      // This indicator has an array of values so we need to calculate min/max
      // different
      if (['E10a9'].includes(indicatorCode)) {
        const measFlat = this.indicatorObject.measurement.flat();
        yAxes[0].ticks.suggestedMin = Math.min(...measFlat);
        yAxes[0].ticks.suggestedMax = Math.max(...measFlat);
      }

      const legend = {
        labels: {
          generateLabels: (chart) => {
            const { datasets } = chart.data;
            const { labels } = chart.legend.options;
            const { usePointStyle } = labels;
            const overrideStyle = labels.pointStyle;
            let labelSet = chart._getSortedDatasetMetas();
            labelSet = labelSet.filter((meta) => {
              let includeLabel = false;
              if (Object.prototype.hasOwnProperty.call(datasets[meta.index], 'label')) {
                includeLabel = !datasets[meta.index].label.startsWith('hide_');
              }
              return includeLabel;
            });
            const labelObjects = labelSet.map((meta) => {
              const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
              const borderWidth = 2;
              let hidden = false;
              if (meta.hidden === true) {
                hidden = true;
              }
              return {
                text: datasets[meta.index].label,
                fillStyle: style.backgroundColor,
                hidden,
                lineCap: style.borderCapStyle,
                lineDash: style.borderDash,
                lineDashOffset: style.borderDashOffset,
                lineJoin: style.borderJoinStyle,
                lineWidth: borderWidth,
                strokeStyle: style.borderColor,
                pointStyle: overrideStyle || style.pointStyle,
                rotation: style.rotation,
                // Below is extra data used for toggling the datasets
                datasetIndex: meta.index,
              };
            }, this);
            // Now we add our default 2 lockdown labels but we exclude indicators
            // where it is not applicable
            if (!['E10a1', 'E10a5', 'E10a8', 'N2', 'N4c', 'E12c', 'E12d', 'GSA', 'N1']
              .includes(this.indicatorObject.indicator)) {
              labelObjects.push({
                text: 'Low Restrictions',
                fillStyle: 'rgba(204, 143, 143, 0.24)',
                hidden: false,
                lineWidth: 0,
                datasetIndex: -1,
              });
              labelObjects.push({
                text: 'High Restrictions',
                fillStyle: 'rgba(207, 109, 109, 0.54)',
                hidden: false,
                lineWidth: 0,
                datasetIndex: -1,
              });
            }
            return labelObjects;
          },
        },
      };

      if (['N4c'].includes(indicatorCode)) {
        xAxes = [{
          stacked: true,
        }];
        yAxes[0].stacked = true;
        yAxes[0].ticks.beginAtZero = true;
        yAxes[0].ticks.suggestedMin = Math.min(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
        yAxes[0].ticks.suggestedMax = Math.max(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
      }

      if (['E12b'].includes(indicatorCode)) {
        // update used yaxis chart max to be max value
        yAxes[0].ticks.suggestedMax = Math.max(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
      }

      if (['E12b', 'E1a', 'E1', 'E2', 'E2_S2', 'E1a_S2', 'E1_S2', 'E13d'].includes(indicatorCode)) {
      // update used yaxis chart min to be min value
        yAxes[0].ticks.suggestedMin = Math.min(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
      }
      if (['CV', 'OW'].includes(indicatorCode)) {
        yAxes[0].ticks.beginAtZero = true;
        yAxes[0].ticks = {
          lineHeight: 1,
          suggestedMin: Math.min(
            ...this.indicatorObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ),
          suggestedMax: Math.max(
            ...this.indicatorObject.measurement
              .filter((d) => !Number.isNaN(d)),
          ),
        };
      }

      if (['E10a1', 'E10a5'].includes(indicatorCode)) {
        yAxes[0].ticks.beginAtZero = true;
        plugins = {
          datalabels: {
            labels: {
              value: {
                anchor: 'end',
                align: 'end',
                offset: 10,
                formatter: (value, context) => {
                  let labelRes = '';
                  const percentage = context.chart.data.datasets[context.datasetIndex]
                    .indLabels[context.dataIndex];
                  if (!['', '/'].includes(percentage)) {
                    const percVal = Number((percentage * 100).toPrecision(4));
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
                    .indLabels[context.dataIndex] > 0) {
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
                formatter: (value) => value.toFixed(1),
              },
            },
          },
        };
      }
      if (['E8'].includes(indicatorCode)) {
        yAxes[0].ticks.suggestedMin = Math.min(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
        yAxes[0].ticks.suggestedMax = Math.max(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
      }
      if (['E9'].includes(indicatorCode)) {
        yAxes[0].ticks.suggestedMin = 0;
        yAxes[0].ticks.suggestedMax = Math.max(
          ...this.indicatorObject.measurement
            .filter((d) => !Number.isNaN(d)),
        );
      }
      if (['E10a6', 'E10a7'].includes(indicatorCode)) {
        yAxes[0].ticks.beginAtZero = true;
        plugins = {
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

      if (['N2', 'E12c', 'E12d'].includes(indicatorCode)) {
        yAxes[0].ticks.beginAtZero = true;
      }

      if (['E10a3', 'E10a8'].includes(indicatorCode)) {
        yAxes[0].ticks = {
          suggestedMin: Number.NaN,
          suggestedMax: Number.NaN,
          padding: -20,
        };
      }
      if (['E10c', 'E10a2', 'E10a6', 'E10a7'].includes(indicatorCode)) {
        yAxes[0].ticks.suggestedMin += 1;
        yAxes[0].ticks.suggestedMax -= 1;
      }

      if (['N3'].includes(indicatorCode)) {
        yAxes[0].type = 'myLogScale';
        if (this.indicatorObject.aoiID === 'ES19') {
          yAxes[0].min = 0.02;
          yAxes[0].max = 1;
        }
        yAxes[0].ticks = {
          callback: (...args) => {
            const value = Chart.Ticks.formatters.logarithmic.call(this, ...args);
            if (value.length) {
              return Number(value).toLocaleString();
            }
            return value;
          },
        };
        legend.labels.usePointStyle = true;
        legend.labels.boxWidth = 5;
        legend.onClick = function onClick(e, legendItem) {
          if (legendItem.text === 'Standard deviation (STD)') {
            const masterIndex = legendItem.datasetIndex;
            const slaveIndex = 3;
            const ci = this.chart;
            const masterMeta = ci.getDatasetMeta(masterIndex);
            const meta = ci.getDatasetMeta(slaveIndex);
            if (masterMeta.hidden === null) {
              masterMeta.hidden = true;
              meta.hidden = true;
            } else {
              masterMeta.hidden = !masterMeta.hidden;
              meta.hidden = !meta.hidden;
            }
            ci.update();
          } else {
            Chart.defaults.global.legend.onClick.call(this, e, legendItem);
          }
        };
      }

      const defaultSettings = {
        responsive: true,
        maintainAspectRatio: false,
        plugins,
        legend,
        scales: {
          xAxes,
          yAxes,
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          enabled: true,
          mode: 'x',
        },
        tooltips: {
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
        },
      };

      if (['N3'].includes(indicatorCode)) {
        defaultSettings.tooltips = {
          callbacks: {
            label: (context) => {
              const { datasets } = this.datacollection;
              const val = datasets[context.datasetIndex].data[context.index];
              return `Value (Log10): ${Math.log10(val).toPrecision(4)}`;
            },
          },
        };
      }

      if (['E10a3'].includes(indicatorCode)) {
        defaultSettings.geo = {
          radiusScale: {
            display: true,
            size: [1, 20],
          },
        };

        defaultSettings.scale = {
          projection: 'mercator',
        };

        defaultSettings.pan.mode = 'xy';
        defaultSettings.zoom.mode = 'xy';
        defaultSettings.legend.display = false;

        defaultSettings.tooltips = {
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

      if (['E10a8'].includes(indicatorCode)) {
        defaultSettings.geo = {
          radiusScale: {
            display: true,
            range: [5, 25],
            ticks: {
              max: 2000000,
            },
          },
        };

        defaultSettings.scale = {
          projection: 'mercator',
          max: 20,
        };

        defaultSettings.pan.mode = 'xy';
        defaultSettings.zoom.mode = 'xy';
        defaultSettings.legend.display = false;

        defaultSettings.tooltips = {
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

      return {
        ...defaultSettings,
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
