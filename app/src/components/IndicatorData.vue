<template>
  <div style="width: 100%; height: 100%;"
    v-if="indicatorObject['Indicator code']!='E10a2' &&
    indicatorObject['Indicator code']!='N3' &&
    indicatorObject['Indicator code']!='E1'">
      <bar-chart v-if='datacollection'
        id="chart"
        class="fill-height"
        :width="null"
        :height="null"
        :chart-data='datacollection'
        :options='chartOptions()'></bar-chart>
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
import moment from 'moment';

import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';

export default {
  components: {
    BarChart,
    LineChart,
  },
  computed: {
    datacollection() {
      const indicator = this.$store.state.indicators.selectedIndicator;
      const indicatorCode = this.indicatorObject['Indicator code'];
      let dataCollection;
      if (indicator) {
        const labels = [];
        const refColors = [
          '#000', '#990099', '#999', '#ff5bcd', '#b85bff',
          '#b82e2e', '#316395', '#994499', '#22aa99',
          '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262',
          '#5574a6', '#3b3eac', '#3366cc', '#dc3912', '#ff9900', '#109618',
          '#0099c6', '#dd4477', '#66aa00',
        ];
        // set up type based on Indicator Type
        // const indicatorType = indicator['Indicator code'];

        // filter nodata entries completely
        const mask = indicator['Measurement Value'].map((item) => !Number.isNaN(item));
        for (const [key, value] of Object.entries(indicator)) { // eslint-disable-line
          if (Array.isArray(value)) {
            indicator[key] = value.filter((item, i) => mask[i]);
          }
        }
        const measurement = indicator['Measurement Value'];
        const colors = [];
        const datasets = [];
        if (['E10a1'].includes(indicatorCode)) {
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
          ];
          const referenceValue = indicator['Reference value'].map(Number);
          for (let i = 0; i < indicator.Time.length; i += 1) {
            if (!Number.isNaN(indicator.Time[i].getTime())) {
              const currDate = indicator.Time[i];
              const formattedDate = monthNames[currDate.getMonth()];
              labels.push(formattedDate);
            } else {
              labels.push(i);
            }
          }
          datasets.push({
            indLabels: ['', '', ''],
            label: '2019',
            data: referenceValue,
            fill: false,
            borderColor: 'red',
            backgroundColor: (indicatorCode === 'E10a1') ? 'grey' : 'red',
          });
          datasets.push({
            indLabels: indicator['Indicator Value'],
            label: '2020',
            data: measurement,
            fill: false,
            borderColor: 'darkcyan',
            backgroundColor: (indicatorCode === 'E10a1') ? 'black' : 'darkcyan',
          });
        } else if (['E10a1', 'E10a2'].includes(indicatorCode)) {
          const data = indicator.Time.map((date, i) => ({
            t: new Date(date.getTime()).setFullYear(2000), y: measurement[i],
          }));
          const referenceValue = indicator['Reference time']
            .map((date, i) => ({
              t: new Date(date).setFullYear(2000),
              y: Number(indicator['Reference value'][i]),
            }));
          datasets.push({
            label: '2019',
            data: referenceValue,
            fill: false,
            borderColor: 'red',
            backgroundColor: (indicatorCode === 'E10a1') ? 'grey' : 'red',
          });
          datasets.push({
            label: '2020',
            data,
            fill: false,
            borderColor: 'darkcyan',
            backgroundColor: (indicatorCode === 'E10a1') ? 'black' : 'darkcyan',
          });
        } else if (['E1'].includes(indicatorCode)) {
          /* Group data by year in month slices */
          const data = indicator.Time.map((date, i) => {
            colors.push(this.getIndicatorColor(indicator['Color code'][i]));
            return { t: date, y: measurement[i] };
          });
          const dataGroups = {};
          const colorGroups = {};
          for (let i = 0; i < data.length; i += 1) {
            const currYear = data[i].t.getFullYear();
            const modDate = new Date(data[i].t.getTime());
            modDate.setFullYear(2000);
            if (Object.prototype.hasOwnProperty.call(dataGroups, currYear)) {
              dataGroups[currYear].push({
                t: modDate, y: data[i].y,
              });
              colorGroups[currYear].push(colors[i]);
            } else {
              dataGroups[currYear] = [{
                t: modDate, y: data[i].y,
              }];
              colorGroups[currYear] = [colors[i]];
            }
          }
          Object.keys(dataGroups).forEach((key, i) => {
            datasets.push({
              label: key,
              fill: false,
              pointRadius: 5,
              data: dataGroups[key],
              backgroundColor: colorGroups[key],
              borderColor: refColors[i],
              borderWidth: 2,
            });
          });
          /* Add random element to make sure labels are re-rendered */
          datasets.push({
            label: `hide_${Math.random()}`,
            data: [],
          });
        } else if (['N3'].includes(indicatorCode)) {
          const referenceValue = [];
          const stdDev = [];
          indicator['Reference value'].forEach((item) => {
            const obj = JSON.parse(item.replace(/,/g, '.').replace(' ', ','));
            referenceValue.push(10 ** obj[0]);
            stdDev.push(obj[1]);
          });

          const stdDevMax = stdDev.map((dev, i) => referenceValue[i] + dev);
          const stdDevMin = stdDev.map((dev, i) => referenceValue[i] - dev);

          for (let i = 0; i < indicator.Time.length; i += 1) {
            if (!Number.isNaN(indicator.Time[i].getTime())) {
              const currDate = indicator.Time[i];
              const formattedDate = moment(currDate, 'YYYY-MM-DD').toDate();
              labels.push(formattedDate);
            } else {
              labels.push(i);
            }
            let colorCode = '';
            if (Object.prototype.hasOwnProperty.call(indicator, 'Color code')) {
              colorCode = indicator['Color code'][i];
            }
            colors.push(this.getIndicatorColor(colorCode));
          }
          datasets.push({
            label: indicator['Y axis'],
            data: measurement,
            fill: false,
            showLine: false,
            backgroundColor: colors,
            borderColor: colors,
          });
          datasets.push({
            label: 'Daily climatology of chlorophyll conc. (CHL_clim) 2017-2019',
            data: referenceValue,
            fill: false,
            pointRadius: 0,
            borderColor: 'black',
          });
          datasets.push({
            label: 'Standard deviation (STD)',
            data: stdDevMax,
            fill: '+1',
            pointRadius: 0,
            spanGaps: true,
            backgroundColor: 'paleturquoise',
            borderColor: 'rgba(0,0,0,0.0)',
          });
          datasets.push({
            label: 'hide_',
            fill: false,
            data: stdDevMin,
            pointRadius: 0,
            spanGaps: true,
            borderColor: 'rgba(0,0,0,0.0)',
          });
        } else {
          const data = indicator.Time.map((date, i) => {
            colors.push(this.getIndicatorColor(indicator['Color code'][i]));
            return { t: date, y: measurement[i] };
          });
          datasets.push({
            data,
            label: indicator['Y axis'],
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
      return this.$store.state.indicators.selectedIndicator;
    },
  },
  methods: {
    formatNumRef(num, maxDecimals = 3) {
      return Number.parseFloat(num.toFixed(maxDecimals));
    },
    getMinMaxDate(timeData) {
      let timeMin = new Date(
        Math.min.apply(null, timeData),
      ).getTime();
      let timeMax = new Date(
        Math.max.apply(null, timeData),
      ).getTime();
      const buffer = (timeMax - timeMin) / timeData.length;
      timeMin -= buffer;
      timeMax += buffer;
      return [timeMin, timeMax];
    },
    chartOptions() {
      const indicatorCode = this.indicatorObject['Indicator code'];
      const reference = Number.parseFloat(this.indicatorObject['Reference value']);
      let timeMinMax = this.getMinMaxDate(this.indicatorObject.Time);
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
      if (!Number.isNaN(reference) && !['E10a1', 'E10a2'].includes(indicatorCode)) {
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
          const ruleString = this.indicatorObject['Rule']; // eslint-disable-line dot-notation
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
      if (!['E10a1', 'E10a2'].includes(indicatorCode)) {
        xAxes = [{
          type: 'time',
          time: {
            unit: 'month',
          },
          ticks: {
            min: timeMinMax[0],
            max: timeMinMax[1],
          },
        }];
      }
      if (['E1', 'E10a2'].includes(indicatorCode)) {
        /* Recalculate to get min max months in data converted to one year */
        timeMinMax = this.getMinMaxDate(this.indicatorObject.Time.map((date) => {
          const tmpDate = new Date(date.getTime());
          return new Date(tmpDate.setFullYear(2000));
        }));
        /* Check also for reference time */
        const refTimeMinMax = this.getMinMaxDate(this.indicatorObject['Reference time'].map((date) => {
          const tmpDate = new Date(date);
          return new Date(tmpDate.setFullYear(2000));
        }));
        xAxes = [{
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM',
            },
            tooltipFormat: 'DD. MMM',
          },
          ticks: {
            min: (timeMinMax[0] < refTimeMinMax[0]) ? timeMinMax[0] : refTimeMinMax[0],
            max: (timeMinMax[1] > refTimeMinMax[1]) ? timeMinMax[1] : refTimeMinMax[1],
          },
        }];
      }
      let plugins = {
        datalabels: {
          display: false,
        },
      };
      if (['E10a1'].includes(indicatorCode)) {
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
                    labelRes = `${percentage * 100}%`;
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
              },
            },
          },
        };
      }

      const defaultSettings = {
        responsive: true,
        maintainAspectRatio: false,
        plugins,
        legend: {
          labels: {
            filter,
          },
        },
        scales: {
          xAxes,
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.indicatorObject['Y axis'],
              padding: 2,
            },
            ticks: {
              lineHeight: 1,
              suggestedMin: Math.min(
                ...this.indicatorObject['Measurement Value'],
              ) - 1,
              suggestedMax: Math.max(
                ...this.indicatorObject['Measurement Value'],
              ) + 1,
            },
          }],
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
</style>
