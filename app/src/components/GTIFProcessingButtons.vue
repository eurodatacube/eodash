<template>
  <v-col
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <v-card class="pa-2">
    <v-card-title class="pa-2">Processing</v-card-title>
      <v-row class="pa-3 justify-center" style="margin-top:10px;">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                small
                :disabled="adminSelected"
                :loading="zonesLoading"
                color="primary"
                class="mr-3"
                @click="fetchData('zones')"
              >
                Export best zones
              </v-btn>
            </div>
            </template>
            <span>{{ this.hoverText() }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                small
                :disabled="adminSelected"
                :loading="reportLoading"
                color="primary"
                class="mr-3"
                @click="fetchData('report')"
              >
                Create report
              </v-btn>
            </div>
            </template>
            <span>{{ this.hoverText() }}</span>
        </v-tooltip>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>

export default {
  name: 'GTIFProcessingButtons',
  props: {
  },
  data() {
    return {
      reportLoading: false,
      zonesLoading: false,
    };
  },
  created() {
    window.addEventListener(
      'fetch-data-report-loading', this.fetchDataReportLoading,
    );
    window.addEventListener(
      'fetch-data-zones-loading', this.fetchDataZonesLoading,
    );
  },
  computed: {
    adminSelected() {
      let selection = null;
      if (this.$store.state && this.$store.state.features.selectedFeatures.length > 0) {
        selection = true;
      }
      let disabled = true;
      if (selection !== null) {
        disabled = false;
      }
      // Check if other button is loading
      if (this.zonesLoading || this.reportLoading) {
        disabled = true;
      }
      return disabled;
    },
  },
  methods: {
    hoverText() {
      let selection = false;
      if (this.$store.state && this.$store.state.features.selectedFeatures.length > 0) {
        selection = true;
      }
      let text = 'Please select Census Track (Zählsprengel) zone';
      if (selection) {
        text = 'Download';
      }
      return text;
    },
    fetchData(process) {
      window.dispatchEvent(new CustomEvent('fetch-data-report', { detail: process }));
    },
    fetchDataZonesLoading(e) {
      this.zonesLoading = e.detail;
    },
    fetchDataReportLoading(e) {
      this.reportLoading = e.detail;
    },
  },
  beforeDestroy() {
    window.removeEventListener(
      'fetch-data-report-loading',
      this.fetchDataReportLoading,
    );
    window.removeEventListener(
      'fetch-data-zones-loading',
      this.fetchDataZonesLoading,
    );
  },
};
</script>

<style lang="scss" scoped>
::v-deep .compass .v-progress-circular__overlay {
  transition: none !important;
}
</style>
