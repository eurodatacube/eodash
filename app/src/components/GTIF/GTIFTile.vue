<template>
  <v-col
    cols="12"
    md="6"
    class="gtif-dashboard-col white"
  >
    <v-row class="fill-width ma-4">
      <div class="color-primary rounded-md" style="border-radius: 50%; height: 36px; width: 36px; background: #f99;"></div>
      <v-col class="ml-3" style="transform: translateY(-3px)">
        <v-row class="text-subtitle-2 font-weight-regular text-blue-grey lighten-1">Annual CO2 Emissions</v-row>
        <v-row class="text-h5">31.5 GT/a</v-row>
      </v-col>
    </v-row>

    <v-row>
      <GtifTileLineChart />
    </v-row>
  </v-col>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

import GtifTileLineChart from './GTIFTileLineChart.vue';

export default {
  name: 'GTIFTile',
  props: {
    type: String,
    required: true,
  },
  components: {
    GtifTileLineChart,
  },
  data() {
    return {
      lineExampleData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }],
      },
    };
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.gtif-dashboard-tile {

}
</style>
