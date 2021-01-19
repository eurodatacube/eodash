<template>
  <div class="scrollContainer">
    <custom-dashboard-grid
      v-if="dashboardFeatures"
      :dashboardFeatures="dashboardFeatures"
    />
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import { loadIndicatorData } from '@/utils';
import axios from 'axios';

import CustomDashboardGrid from '@/components/CustomDashboardGrid.vue';

export default {
  components: {
    CustomDashboardGrid,
  },
  data: () => ({
    dashboardViewingId: null,
    dashboardEditingId: null,
    dashboardFeatures: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
  },
  mounted() {
    if (this.$route.params.viewingId) {
      this.dashboardViewingId = this.$route.params.viewingId;
    }
    if (this.$route.params.editingId) {
      this.dashboardEditingId = this.$route.params.editingId;
    }
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/ADD_NEW_FEATURES') {
        this.fetchDashboard();
      }
    });
  },
  methods: {
    async fetchDashboard() {
      try {
        const response = await axios.get(`${this.appConfig.customDashboardUrl}/${this.dashboardViewingId}`);
        this.loadFeatures(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async loadFeatures(features) {
      let dashboardFeatures = features;
      // Pre-load all indicators to populate items
      dashboardFeatures = await Promise.all(dashboardFeatures.map(async (f) => {
        const feature = this.$store.state.features.allFeatures
          .find((i) => this.getLocationCode(i.properties.indicatorObject) === f.poi);
        const indicatorObject = await loadIndicatorData(
          this.baseConfig,
          feature.properties.indicatorObject,
        );
        return {
          ...f,
          indicatorObject,
        };
      }));
      this.dashboardFeatures = dashboardFeatures;
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollContainer {
  overflow-y: scroll;
}
</style>
