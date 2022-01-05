<script>
import { Bar, mixins } from 'vue-chartjs';
import { DateTime } from 'luxon';
import lockdownTimes from '@/assets/lockdown_data.json';
import countries from '@/assets/countries.json';

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    const extendedSettings = Object.assign(this.defaultOptions, this.options);
    extendedSettings.annotation.annotations.push(...this.movementRestrictions);
    const [min, max] = this.minMaxDate;
    extendedSettings.scales.xAxes[0].ticks.min = min;
    extendedSettings.scales.xAxes[0].ticks.max = max;
    this.renderChart(this.chartData, extendedSettings);
  },
  watch: {
    options: {
      handler() {
        const extendedSettings = Object.assign(this.defaultOptions, this.options);
        extendedSettings.annotation.annotations.push(...this.movementRestrictions);
        const [min, max] = this.minMaxDate;
        extendedSettings.scales.xAxes[0].ticks.min = min;
        extendedSettings.scales.xAxes[0].ticks.max = max;
        this.renderChart(this.chartData, extendedSettings);
      },
      deep: true,
    },
  },
  data() {
    return {
      defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false,
          },
        },
        legend: {
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
              // if (!['E10a1', 'E10a5', 'E10a8', 'N2', 'N4c', 'E12c', 'E12d', 'GSA', 'N1']
              //  .includes(this.$attrs.indicator)) {
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
              // }
              return labelObjects;
            },
          },
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'week',
              displayFormats: {
                month: 'MMM yy',
              },
              tooltipFormat: 'dd. MMM yy',
            },
            distribution: 'series',
            ticks: {},
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.$attrs.yAxis,
              padding: 2,
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
        annotation: {
          annotations: [],
        },
      },
    };
  },
  computed: {
    minMaxDate() {
      let timeMin = Math.min.apply(null, this.$attrs.time.map((d) => d.toMillis()));
      let timeMax = Math.max.apply(null, this.$attrs.time.map((d) => d.toMillis()));
      const buffer = (timeMax - timeMin) / this.$attrs.time.length;
      timeMin -= buffer;
      timeMax += buffer;
      return [timeMin, timeMax];
    },
    movementRestrictions() {
      // Find country based on alpha-3 code
      const currCountry = countries.features.find(
        (cntr) => cntr.properties.alpha2 === this.$attrs.country,
      );
      const annotations = [];
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

          const start = DateTime.fromISO(lckTs[i].start);
          const end = DateTime.fromISO(lckTs[i].end);

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
      return annotations;
    },
  },
};
</script>
