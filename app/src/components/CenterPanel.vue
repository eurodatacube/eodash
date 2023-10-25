<template>
  <Map
    v-if="mapDataReady"
    ref="map"
    class="fill-height"
    :disableAutoFocus="false"
  />
</template>

<script>
// Utilities
import {
  mapGetters,
  mapState,
} from 'vuex';
import Map from '@/components/map/Map.vue';

export default {
  components: {
    Map,
  },
  computed: {
    ...mapGetters('features', [
      'getGroupedFeatures',
    ]),
    ...mapState('config', ['baseConfig']),
    mapDataReady() {
      return !!(this.baseConfig);
    },
  },
};
</script>
