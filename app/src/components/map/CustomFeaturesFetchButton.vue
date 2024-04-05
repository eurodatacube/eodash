<template>
  <div class="fetchBtnControls mb-2">
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="pa-0 elevation-2 round fetchBtn"
          style="min-width: 0"
          :loading="isLoadingCustomFeatures"
          v-on="on"
          @click="$emit('fetchCustomAreaFeatures');"
        >
          <v-icon>mdi-map-search-outline</v-icon>
        </v-btn>
      </template>
      <span>Get detections</span>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isLoadingCustomFeatures: false,
    };
  },
  mounted() {
    window.addEventListener(
      'set-custom-area-features-loading',
      this.customAreaFeaturesLoading,
    );
  },
  methods: {
    customAreaFeaturesLoading(e) {
      this.isLoadingCustomFeatures = e.detail;
    },
  },
  beforeDestroy() {
    window.removeEventListener(
      'set-custom-area-features-loading',
      this.customAreaFeaturesLoading,
    );
  },
};
</script>

<style lang="scss">
.fetchBtnControls {
  .fetchBtn {
    width: 36px;
    height: 36px !important;
    pointer-events: initial;
  }
}
</style>
