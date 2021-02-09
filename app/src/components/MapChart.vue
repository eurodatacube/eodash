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
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: {
      handler() {
        this.renderChart(this.chartData, this.options);
      },
      deep: true,
    },
  },
};
</script>
