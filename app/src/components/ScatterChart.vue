<script>
import { Scatter, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Scatter,
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
    this.$data._chart.destroy();
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
              return labelObjects;
            },
            ...this.options.labelsExtend,
          },
          ...this.options.legendExtend,
        },
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
              display: true,
              labelString: this.options.xAxis,
              padding: 2,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.options.yAxis,
              padding: 2,
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
      this.renderChart(this.chartData, extendedSettings);
    },
  },
  computed: {},
};
</script>
