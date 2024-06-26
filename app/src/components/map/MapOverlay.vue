<template>
  <v-card :id="`${overlayId}_overlay`" :ref="`${overlayId}_overlay`" class="tooltip pa-2">
    <div class="text-center">
      <p v-for="(header, index) in overlayHeaders" :key="index" class="ma-0">
        <strong>
          {{header}}
        </strong>
      </p>
    </div>
    <div class="text-center">
      <p v-for="(row, index) in overlayRows" :key="index" class="ma-0">
        {{ row }}
      </p>
    </div>
  </v-card>
</template>
<script>

import { getMapInstance } from '@/components/map/map';
import Overlay from 'ol/Overlay';

/**
 * a component that will handle map overlays, e.g. for displaying information on hover
 */
export default {
  components: {},
  props: {
    mapId: String,
    overlayId: String,
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
        this.overlay.setPosition(value);
      }
    },
  },
  computed: {},
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const overlay = new Overlay({
      element: this.$refs[`${this.overlayId}_overlay`].$el,
      id: `overlay_${this.overlayId}`,
      className: 'ol-overlay-container ol-unselectable noPointerEvents',
      offset: [0, -16],
      positioning: 'bottom-center',
    });
    map.addOverlay(overlay);
    this.overlay = overlay;
    // TODO: i imagine we don't really want to be injecting the style but this is
    // the solution that seemed to work best right now
    const style = document.createElement('style');
    style.innerHTML = `.tooltip {
      padding: 1px 10px 1px 10px;
      margin: 0px;
      border-radius: 5px;
      position: relative;
      font-size: 14px;
      box-shadow: none !important;
      background: rgba(0, 0, 0, 0.8) !important;
      color: #FFFFFF !important;
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
    }`;
    if (this.$parent.$refs.mapContainer?.shadowRoot) {
      this.$parent.$refs.mapContainer.shadowRoot.appendChild(style);
    }
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
  background: rgba(0, 0, 0, 0.8) !important;
  color: #FFFFFF !important;
}

// arrow head bottom
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

 .noPointerEvents {
    pointer-events: none !important;
 }
</style>
