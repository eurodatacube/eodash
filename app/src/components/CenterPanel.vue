<template>
  <Map
    v-if="mapDataReady"
    ref="map"
    class="fill-height"
    :disableAutoFocus="false"
    :panelActive="panelActive"
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
  props: {
    panelActive: Boolean,
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
