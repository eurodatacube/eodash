<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
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
    const yAxes = this.options.yAxis.map((value) => (
      {
        scaleLabel: {
          display: true,
          labelString: value,
          padding: 2,
        },
      }));
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
            ...this.options.labelsExtend,
          },
          ...this.options.legendExtend,
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: this.options.timeConfig ? this.options.timeConfig : {
              unit: 'week',
              displayFormats: {
                month: 'MMM yy',
              },
              tooltipFormat: 'dd. MMM yy',
            },
            distribution: this.options.distribution ? this.options.distribution : 'linear',
            ticks: {},
          }],
          yAxes,
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
    resetZoomExtent() {
      const [min, max] = this.minMaxDate();
      this.$data._chart.options.scales.xAxes[0].ticks.min = min;
      this.$data._chart.options.scales.xAxes[0].ticks.max = max;
      this.$data._chart.chart.update();
    },
    extentChangedEvent() {
      this.$emit('extentChanged', true);
    },
    render() {
      const extendedSettings = Object.assign(this.defaultOptions, this.options);
      if ('yAxisOverwrite' in extendedSettings) {
        extendedSettings.scales.yAxes[0] = {
          ...extendedSettings.scales.yAxes[0],
          ...extendedSettings.yAxisOverwrite,
        };
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
