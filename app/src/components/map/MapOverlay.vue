<template>
  <v-card :id="`${mapId}_overlay`" class="tooltip pa-2">
    <p v-for="(header, index) in overlayHeaders" :key="index" class="ma-0" strong>
      {{header}}
      </p>
    <p v-for="(row, index) in overlayRows" :key="index" class="ma-0">
      {{ row }}
    </p>
  </v-card>
</template>
<script>

import getMapInstance from '@/components/map/map';
import Overlay from 'ol/Overlay';

/**
 * a component that will handle map overlays, e.g. for displaying information on hover
 */
export default {
  components: {},
  props: {
    mapId: String,
    overlayHeaders: Array,
    overlayRows: Array,
    overlayCoordinate: Array,
  },
  data() {
    return {
      overlay: null,
    };
  },
  watch: {
    overlayCoordinate(value) {
      if (!value) {
        this.overlay.setPosition(null);
      } else {
        this.overlay.setPosition(this.overlayCoordinate);
      }
    },
  },
  computed: {},
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const overlay = new Overlay({
      element: document.getElementById(`${this.mapId}_overlay`),
      id: `overlay_${this.mapId}`,
      offset: [0, -16],
      positioning: 'bottom-center',
    });
    map.addOverlay(overlay);
    this.overlay = overlay;
  },
  methods: {},
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    map.removeOverlay(this.overlay);
  },
  render: () => null,
};
</script>

<style lang="scss">
.tooltip {
  position: relative;
  font-size: 14px;
  box-shadow: none !important;
  background: rgba(0, 0, 0, 0.6);
  color: #FFFFFF;
}

.tooltip:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.6);
  border-bottom: 0;
  margin-left: -10px;
  margin-bottom: -10px;
}
</style>
