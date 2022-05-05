<template>
  <CenterMap ref="map" v-if="mapDataReady" class="fill-height" />
</template>

<script>
// Utilities
import {
  mapGetters,
  mapState,
} from 'vuex';
import CenterMap from '@/components/map/CenterMap.vue';

export default {
  components: {
    CenterMap,
  },
  computed: {
    ...mapGetters('features', [
      'getGroupedFeatures',
    ]),
    ...mapState('config', ['baseConfig']),
    mapDataReady() {
      return !!(this.getGroupedFeatures?.length && this.baseConfig);
    },
  },
};
</script>
