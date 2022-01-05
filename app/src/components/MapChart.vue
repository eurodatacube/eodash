<script>
import { generateChart, mixins } from 'vue-chartjs';
// import to auto register
import 'chartjs-chart-geo';

const BubbleMap = generateChart('bubbleMap', 'bubbleMap');
const { reactiveProp } = mixins;

export default {
  extends: BubbleMap,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.renderChart(
      this.chartData,
      Object.assign(this.defaultOptions, this.options),
    );
  },
  watch: {
    options: {
      handler() {
        this.renderChart(
          this.chartData,
          Object.assign(this.defaultOptions, this.options),
        );
      },
      deep: true,
    },
  },
  data() {
    return {
      defaultOptions: {
        plugins: {
          datalabels: {
            display: false,
          },
        },
        geo: {
          radiusScale: {
            display: true,
            size: [1, 20],
          },
        },
        scale: {
          projection: 'mercator',
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: {},
          yAxes: [{
            ticks: {
              suggestedMin: Number.NaN,
              suggestedMax: Number.NaN,
              padding: -20,
            },
            scaleLabel: {
              display: true,
              labelString: this.$attrs.yAxis,
              padding: 2,
            },
          }]
        }
      }
    };
  }
};
</script>
