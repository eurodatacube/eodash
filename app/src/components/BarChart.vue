<script>
import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.render();
  },
  watch: {
    options: {
      handler() {
        this.render();
      },
    },
  },
  beforeDestroy() {
    if (this.$data && this.$data._chart) {
      this.$data._chart.destroy();
    }
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
                if ('label' in datasets[meta.index]
                  && typeof datasets[meta.index].label !== 'undefined') {
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
              return labelObjects;
            },
          },
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: this.options.timeConfig ? this.options.timeConfig : {
              unit: 'week',
              displayFormats: {
                month: 'MMM yy',
              },
              tooltipFormat: 'dd. MMM yyyy',
            },
            distribution: 'series',
            ticks: {},
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.options.yAxis,
              padding: 2,
            },
            ticks: {
              beginAtZero: this.options.beginAtZero ? this.options.beginAtZero : false,
            },
          }],
        },
        pan: {
          enabled: true,
          mode: 'x',
          onPanComplete: this.extentChangedEvent,
        },
        zoom: {
          enabled: true,
          mode: 'x',
          onZoomComplete: this.extentChangedEvent,
        },
        annotation: {
          annotations: [],
        },
      },
    };
  },
  methods: {
    extentChangedEvent() {
      this.$emit('extentChanged', true);
    },
    render() {
      const extendedSettings = Object.assign(this.defaultOptions, this.options);
      if ('xAxisStacked' in extendedSettings) {
        extendedSettings.scales.xAxes[0].stacked = true;
      }
      if ('yAxisRange' in extendedSettings) {
        extendedSettings.scales.yAxes[0].ticks = {
          suggestedMin: extendedSettings.yAxisRange[0],
          suggestedMax: extendedSettings.yAxisRange[1],
        };
      }
      const [min, max] = this.minMaxDate();
      extendedSettings.scales.xAxes[0].ticks.min = min;
      extendedSettings.scales.xAxes[0].ticks.max = max;
      this.renderChart(this.chartData, extendedSettings);
    },
    minMaxDate() {
      const alldata = this.chartData.datasets.map((ds) => ds.data.map((d) => d.t.toMillis()));
      const flattenedData = [].concat(...alldata);
      let timeMin = Math.min(...flattenedData);
      let timeMax = Math.max(...flattenedData);
      const buffer = (timeMax - timeMin) / (flattenedData.length / alldata.length);
      timeMin -= buffer;
      timeMax += buffer;
      return [timeMin, timeMax];
    },
  },
  computed: {},
};
</script>
