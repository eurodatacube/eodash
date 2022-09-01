<template>
  <CenterMap
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
import CenterMap from '@/components/map/CenterMap.vue';

export default {
  components: {
    CenterMap,
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
