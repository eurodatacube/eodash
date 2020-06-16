<template>
  <div style="width: 100%; height: 100%;"
    v-if="!['E10a2', 'N3'].includes(indicatorObject['Indicator code'])">
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
      const refColors = [
        '#a5d3d8', '#dadada', '#c6b4ea', '#ead7ad', '#cdeaad', '#b82e2e',
        '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
      ];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      if (indicator) {
        let labels = [];
        const measurement = indicator['Measurement Value'];
        const colors = [];
        const datasets = [];
        if (['E10a1'].includes(indicatorCode)) {
          const referenceValue = indicator['Reference value'].map(Number);
          for (let i = 0; i < indicator.Time.length; i += 1) {
            if (!Number.isNaN(indicator.Time[i].getTime())) {
              const currDate = indicator.Time[i];
              const formattedDate = `${currDate.getDate()} - ${monthNames[currDate.getMonth()]}`;
              labels.push(formattedDate);
            } else {
              labels.push(i);
            }
          }
          datasets.push({
            indLabels: Array(indicator['Indicator Value'].length).join('.').split('.'),
            label: '2019',
            data: referenceValue,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'grey',
          });
          datasets.push({
            indLabels: indicator['Indicator Value'],
            label: '2020',
            data: measurement,
            fill: false,
            borderColor: 'darkcyan',
            backgroundColor: 'black',
          });
        } else if (['E10a2'].includes(indicatorCode)) {
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
            backgroundColor: 'red',
          });
          datasets.push({
            label: '2020',
            data,
            fill: false,
            borderColor: 'darkcyan',
            backgroundColor: 'darkcyan',
          });
        } else if (['N2'].includes(indicatorCode)) {
          /* Group data by year in month slices */
          const data = indicator.Time.map((date, i) => {
            colors.push(this.getIndicatorColor(indicator['Color code'][i]));
            return { t: date, y: measurement[i] };
          });
          const dataGroups = {};
          const colorGroups = {};
          const formDates = {};
          for (let i = 0; i < data.length; i += 1) {
            const currYear = data[i].t.getFullYear();
            const modDate = new Date(data[i].t.getTime());
            modDate.setFullYear(2000);
            if (Object.prototype.hasOwnProperty.call(dataGroups, currYear)) {
              dataGroups[currYear].push(data[i].y);
              colorGroups[currYear].push(colors[i]);
              formDates[currYear].push(
                `${monthNames[data[i].t.getMonth()]}`,
              );
            } else {
              dataGroups[currYear] = [data[i].y];
              colorGroups[currYear] = [colors[i]];
              formDates[currYear] = [
                `${monthNames[data[i].t.getMonth()]}`,
              ];
            }
          }
          const uniqueYears = Object.keys(dataGroups);
          uniqueYears.sort();
          labels = formDates[uniqueYears[0]];
          uniqueYears.forEach((key, i) => {
            datasets.push({
              // fill with empty values
              indLabels: Array(dataGroups[key].length).join('.').split('.'),
              label: key,
              fill: false,
              data: dataGroups[key].map(Number),
              backgroundColor: refColors[i],
              borderColor: refColors[i],
              borderWidth: 2,
            });
          });
        } else if (['N3'].includes(indicatorCode)) {
          let referenceValue = [];
          const stdDev = [];
          indicator['Reference value'].forEach((item) => {
            if (item !== 'NaN') {
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
          indicator['Indicator Value'].map((val, i) => {
            let key = val.toLowerCase();
            key = key.charAt(0).toUpperCase() + key.slice(1);
            if (typeof indicatorValues[key] === 'undefined') {
              indicatorValues[key] = this.getIndicatorColor(
                indicator['Color code'][i],
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
      if (!['E10a1', 'E10a2', 'N2'].includes(indicatorCode)) {
        xAxes = [{
          type: 'time',
          distribution: 'series',
          time: {
            unit: 'week',
          },
          ticks: {
            min: timeMinMax[0],
            max: timeMinMax[1],
          },
        }];
      }

      if (['E10a2'].includes(indicatorCode)) {
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

      const yAxes = [{
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
      }];

      const legend = {
        labels: {
          filter,
        },
      };

      if (['E10a1'].includes(indicatorCode)) {
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
                formatter: (value) => value.toFixed(0),
              },
            },
          },
        };
      }
      if (['N2'].includes(indicatorCode)) {
        yAxes[0].ticks.beginAtZero = true;
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
