<template>
  <div style="width: 100%; height: 100%;"
    v-if="!['E10a2', 'E10a3', 'E10a6', 'E10a7', 'E10a8', 'E10c', 'N1', 'N3', 'N3b']
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

import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';
import MapChart from '@/components/MapChart.vue';
import NUTS from '@/assets/NUTS_RG_03M_2016_4326_ESL2-DEL3.json';

export default {
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
  watch: {
    indicatorObject() {
      if (this.indicatorObject.time) {
        this.dataLayerIndex = this.indicatorObject.time.length - 1;
        const d = this.indicatorObject.time[this.dataLayerIndex];
        this.dataLayerTime = d.toFormat('dd. MMM');
      }
    },
  },
  computed: {
    arrayOfObjects() {
      const indicator = this.$store.state.indicators.selectedIndicator;
      const indicatorCode = this.indicatorObject.indicator;
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
      const indicator = this.$store.state.indicators.selectedIndicator;
      const indicatorCode = this.indicatorObject.indicator;
      let dataCollection;
      const refColors = [
        '#cb4', '#a37', '#47a', '#a67', '#283', '#bbb',
        '#6ce', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
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
            borderColor: 'red',
            backgroundColor: 'grey',
          });
          datasets.push({
            indLabels: indicator.indicatorValue,
            label: labelmeas,
            data: measurement,
            fill: false,
            borderColor: 'darkcyan',
            backgroundColor: 'black',
          });
        } else if (['N3b'].includes(indicatorCode)) {
          const sensors = Array.from(new Set(indicator.eoSensor)).reverse();
          for (let pp = 0; pp < sensors.length; pp += 1) {
            const pKey = sensors[pp];
            const data = indicator.time.map((date, i) => {
              let output = null;
              if (indicator.eoSensor[i] === pKey) {
                output = { t: date, y: measurement[i] };
              }
              return output;
            }).filter((d) => d !== null);
            datasets.push({
              label: pKey,
              data,
              fill: false,
              borderColor: refColors[pp],
              backgroundColor: refColors[pp],
            });
          }
        } else if (['E10a2', 'E10a6', 'E10a7'].includes(indicatorCode)) {
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
            const ref = { t: date.set({ year: 2000 }), y: referenceValue[i] };
            if (typeof uniqueRefs.find((item) => item.t.equals(ref.t)) === 'undefined') {
              uniqueRefs.push(ref);
            }
          });

          datasets.push({
            label: '2019',
            data: uniqueRefs,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'red',
          });
          datasets.push({
            label: '2020',
            data: uniqueMeas,
            fill: false,
            borderColor: 'darkcyan',
            backgroundColor: 'darkcyan',
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
            if (!Number.isNaN(item) && item !== 'NaN') {
              const obj = JSON.parse(item);
              // [median,std,max,min,percentage valid pixels]
              median.push({ y: obj[0], t });
              stdDevMin.push({ y: measurement[i] - obj[1], t });
              stdDevMax.push({ y: measurement[i] + obj[1], t });
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
          });
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
        } else if (['N3'].includes(indicatorCode)) {
          let referenceValue = [];
          const stdDev = [];
          indicator.referenceValue.forEach((item) => {
            if (!Number.isNaN(item) && item !== 'NaN') {
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
            label: 'hide_',
            data: measurement.map((val) => (
              Number.isNaN(val) ? Number.NaN : (10 ** val)
            )),
            fill: false,
            showLine: false,
            backgroundColor: colors,
            borderColor: colors,
            spanGaps: false,
          });
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
            fill: 3,
            pointRadius: 0,
            spanGaps: false,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderColor: 'rgba(0,0,0,0.0)',
            pointStyle: 'rect',
          });
          datasets.push({
            label: 'hide_',
            data: stdDevMin,
            fill: 2,
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
            if (typeof indicatorValues[key] === 'undefined') {
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
      return this.$store.state.indicators.customAreaIndicator || this.$store.state.indicators.selectedIndicator;
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
      if (!Number.isNaN(reference) && !['E10a1', 'E10a2', 'E10a5', 'E10a6', 'E10a7'].includes(indicatorCode)) {
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
      } else if (['E11', 'E8', 'E1a', 'E1', 'E2'].includes(indicatorCode)) {
        if (indicatorCode === 'E11') {
          low = 0.3 * reference;
          high = 0.7 * reference;
        } else if (indicatorCode === 'E8') {
          const ruleString = this.indicatorObject.rule;
          // find [low, high] via regex
          const regExp = new RegExp(/\[([\s\S]*?)\]/); // eslint-disable-line no-useless-escape
          const matches = regExp.exec(ruleString);
          if (matches && matches.length > 1) {
            const splitNum = matches[1].split(',');
            low = Number.parseFloat(splitNum[0]);
            high = Number.parseFloat(splitNum[1]);
          }
        } else if (['E1a', 'E1', 'E2'].includes(indicatorCode)) {
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
      const filter = (legendItem) => !`${legendItem.text}`.startsWith('hide_');
      let xAxes = {};
      if (!['E10a1', 'E10a2', 'E10a3', 'E10a5', 'E10a6', 'E10a7', 'E10a8', 'E10c', 'N2'].includes(indicatorCode)) {
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

      if (['E10a2', 'E10a6', 'E10a7', 'E10c'].includes(indicatorCode)) {
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

      const legend = {
        labels: {
          filter,
        },
      };

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
                  if (percentage !== '') {
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

      if (['N2'].includes(indicatorCode)) {
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
        yAxes[0].ticks = {
          min: 0.1,
          max: 10,
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
