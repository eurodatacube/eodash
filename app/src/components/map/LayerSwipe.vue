<template>
  <div
    class="swipe-container"
    ref="container"
  >
    <!-- a comparelayer for a selected global poi with a time component -->
    <SpecialLayer
      mapId="centerMap"
      :indicator="mergedConfigsData"
      :layerName="swipeLayerName"
      :key="mergedConfigsData.name"
      :time="time"
    />
    <slot name="close"></slot>
    <input id="swipe" type="range" v-model="swipe">
      :style="`clip-path: inset(0px 0px 0px ${clipRight}px`"
    <div id="swipe_handle_separator" :style="`left: calc(${swipe}% - 1px)`">
      <div id="swipe_handle" style="display: flex; align-items: center">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="white" d="M8,14V18L2,12L8,6V10H16V6L22,12L16,18V14H8Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

import gsap from 'gsap';
import getMapInstance from '@/components/map/map';
import SpecialLayer from '@/components/map/SpecialLayer.vue';
import { updateTimeLayer } from '@/components/map/timeLayerUtils';

export default {
  name: 'MapLayerSwipe',
  components: {
    SpecialLayer,
  },
  props: {
    mapId: String,
    mergedConfigsData: Object,
    time: String,
  },
  data: () => ({
    swipeLayerObject: null,
    swipe: 100,
    clipLeft: 0,
    clipRight: 0,
  }),
  computed: {
    swipeLayerName() {
      return `${this.mergedConfigsData.name}_compare`;
    },
    originalLayerName() {
      return this.mergedConfigsData.name;
    },
  },
  watch: {
    swipe() {
      const { map } = getMapInstance(this.mapId);
      const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
      swipeLayer.changed();
    },
    time(time) {
      // redraw all time-dependant layers, if time is passed via WMS params
      const { map } = getMapInstance('centerMap');
      const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
      updateTimeLayer(swipeLayer, this.mergedConfigsData, time);
    },
  },
  created() {},
  mounted() {
    const { map } = getMapInstance(this.mapId);
    gsap.to(this.$data, { duration: 0.8, swipe: 50 });
    map.on('postrender', () => {
      const originalLayer = map.getLayers().getArray().find((l) => l.get('name') === this.mergedConfigsData.name);
      const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
      if (swipeLayer) {
        swipeLayer.on('prerender', this.onPrerender);
        swipeLayer.on('postrender', this.onPostrender);
        originalLayer.on('prerender', this.onPrerender);
        originalLayer.on('postrender', this.onPostrender);
      }
    });
  },
  methods: {
    onPrerender(evt) {
      // clip the originalLayer from right, the comparing layer from left
      const ctx = evt.context;
      const width = ctx.canvas.width * (this.swipe / 100);
      ctx.save();
      if (evt.target.get('name') === this.originalLayerName) {
        ctx.beginPath();
        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
        ctx.clip();
        if (Object.keys(this.$refs).length > 0) {
          const w = this.$refs.container.clientWidth * (this.swipe / 100);
          this.clipLeft = 0 - w;
          this.clipRight = w - this.$refs.container.clientWidth;
        }
      } else {
        ctx.beginPath();
        ctx.rect(0, 0, width, ctx.canvas.height);
        ctx.clip();
        if (Object.keys(this.$refs).length > 0) {
          const w = this.$refs.container.clientWidth * (this.swipe / 100);
          this.clipLeft = 0 - w;
          this.clipRight = w - this.$refs.container.clientWidth;
        }
      }
    },
    onPostrender(evt) {
      const ctx = evt.context;
      ctx.restore();
    },
  },
};
</script>

<style lang="scss" scoped>
.swipe-container {
  position: absolute;
  height: 100%;
  width: 100%;
}
.v-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.5);
  z-index: 3;
}
#swipe_handle {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #fff;
    background: var(--v-primary-base);
    top: 50%;
    left: 100%;
    transform: translate3d(-26px, -25px, 0);
}
#swipe:hover ~ #swipe_handle {
    background-color: var(--v-primary-base);
}
#swipe_handle_separator {
    position: absolute;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: #fff;
    filter: drop-shadow(0 0 3px rgba(50, 50, 0, 0.5));
    z-index: 2;
}
#swipe {
    position: absolute;
    z-index: 10;
    width: 100%;
    top: 50%;
    pointer-events: none;
    opacity: 0;
}
input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
}
input[type="range"]:focus {
    outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 0;
    cursor: pointer;
    box-shadow: 0 0 0 #000, 0 0 0 #0d0d0d;
    background: 0 0;
    border-radius: 1.3px;
    border: 0.2px solid transparent;
}
input[type="range"]::-webkit-slider-thumb {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    background: 0 0;
    cursor: ew-resize;
    -webkit-appearance: none;
    margin-top: -16.9px;
    pointer-events: all;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
    background: transparent;
}
input[type="range"]::-moz-range-track {
    width: 100%;
    height: 0;
    cursor: pointer;
    box-shadow: 0 0 0 #000, 0 0 0 #0d0d0d;
    background: 0 0;
    border-radius: 1.3px;
    border: 0.2px solid transparent;
}
input[type="range"]::-moz-range-thumb {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    background: 0 0;
    cursor: ew-resize;
    border: 0.2px solid transparent;
    pointer-events: all;
}
input[type="range"]::-moz-focus-outer {
    border: 0;
}
input[type="range"]::-ms-track {
    width: 100%;
    height: 0;
    cursor: pointer;
    background: 0 0;
    border-color: transparent;
    color: transparent;
}
input[type="range"]::-ms-fill-lower {
    background: 0 0;
    border: 0.2px solid transparent;
    border-radius: 2.6px;
    box-shadow: 0 0 0 #000, 0 0 0 #0d0d0d;
}
input[type="range"]::-ms-fill-upper {
    background: 0 0;
    border: 0.2px solid transparent;
    border-radius: 2.6px;
    box-shadow: 0 0 0 #000, 0 0 0 #0d0d0d;
}
input[type="range"]::-ms-thumb {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    background: 0 0;
    cursor: ew-resize;
    height: 1.6px;
    pointer-events: all;
}
input[type="range"]:focus::-ms-fill-lower {
    background: transparent;
}
input[type="range"]:focus::-ms-fill-upper {
    background: transparent;
}
</style>
