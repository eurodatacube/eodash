<template>
  <div
    v-if="swipeActive"
    class="swipe-container"
    ref="container"
  >
    <!-- a comparelayer for a selected global poi with a time component -->
    <SpecialLayer
      :mapId="mapId"
      :mergedConfig="mergedConfigsData"
      :layerName="swipeLayerName"
      :options="specialLayerOptions"
      :swipePixelX="swipePixelX"
    />
    <slot name="close"></slot>
    <input id="swipe" type="range" v-model="swipe">
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
import LayerGroup from 'ol/layer/Group';

export default {
  name: 'MapLayerSwipe',
  components: {
    SpecialLayer,
  },
  props: {
    mapId: String,
    mergedConfigsData: Object,
    specialLayerOptionProps: Object,
    time: {
      required: true,
    },
    enable: Boolean,
  },
  data: () => ({
    swipeActive: false,
    swipeLayerObject: null,
    swipe: 0,
    swipePixelX: null,
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
    specialLayerOptions() {
      const options = { ...this.specialLayerOptionProps };
      options.time = this.time;
      return options;
    },
  },
  watch: {
    enable(on) {
      if (on) {
        this.swipeActive = true;
        this.$nextTick(() => {
          const { map } = getMapInstance(this.mapId);
          gsap.to(this.$data, { duration: 0.8, swipe: 50 });
          const originalLayer = map.getLayers().getArray().find((l) => l.get('name') === this.mergedConfigsData.name);
          const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
          if (swipeLayer) {
            swipeLayer.getLayers().forEach((l) => {
              l.on('prerender', this.onPrerender);
              l.on('postrender', this.onPostrender);
            });
            originalLayer.getLayers().forEach((l) => {
              l.on('prerender', this.onPrerender);
              l.on('postrender', this.onPostrender);
            });
          }
        });
      } else {
        const deactivate = () => {
          this.swipeActive = false;
          const { map } = getMapInstance(this.mapId);
          const originalLayer = map.getLayers().getArray().find((l) => l.get('name') === this.mergedConfigsData.name);
          originalLayer.getLayers().forEach((l) => {
            l.un('prerender', this.onPrerender);
            l.un('postrender', this.onPostrender);
          });
        };
        const reset = 0;
        this.swipePixelX = null;
        this.$emit('updateSwipePosition', null);
        gsap.to(this.$data, { duration: 0.8, swipe: reset, onComplete: deactivate });
      }
    },
    swipe() {
      const { map } = getMapInstance(this.mapId);
      const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
      swipeLayer.changed();
    },
    time(time) {
      // redraw all time-dependant layers, if time is passed via WMS params
      const { map } = getMapInstance(this.mapId);
      const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
      if (swipeLayer) {
        updateTimeLayer(swipeLayer, this.mergedConfigsData, time);
      }
    },
  },
  methods: {
    onPrerender(evt) {
      // clip the originalLayer from right, the comparing layer from left
      if (this.$refs.container) {
        const ctx = evt.context;
        const sidePadding = document.querySelector('.data-panel') !== null // eslint-disable-line
          ? document.querySelector('.data-panel').className.includes('v-navigation-drawer--close')
            ? 0
            : document.querySelector('.data-panel').clientWidth
          : 0;
        this.swipePixelX = (ctx.canvas.width - sidePadding) * (this.swipe / 100);
        this.$emit('updateSwipePosition', this.swipePixelX);
        ctx.save();
        const { map } = getMapInstance(this.mapId);
        const originalLayer = map.getLayers().getArray().find((l) => l.get('name') === this.mergedConfigsData.name);
        const isLayerGroup = originalLayer instanceof LayerGroup;
        // check if the event-layer is displayed on the right side, either as single layer
        // or as part of a layer group
        const isRightLayer = isLayerGroup
          ? originalLayer.getLayers().getArray().includes(evt.target)
          : evt.target.get('name') === this.originalLayerName;
        if (isRightLayer) {
          ctx.beginPath();
          ctx.rect(this.swipePixelX, 0, ctx.canvas.width - this.swipePixelX, ctx.canvas.height);
          ctx.clip();
          if (Object.keys(this.$refs).length > 0) {
            const w = this.$refs.container.clientWidth * (this.swipe / 100);
            this.clipLeft = 0 - w;
            this.clipRight = w - this.$refs.container.clientWidth;
          }
        } else {
          ctx.beginPath();
          ctx.rect(0, 0, this.swipePixelX, ctx.canvas.height);
          ctx.clip();
          if (Object.keys(this.$refs).length > 0) {
            const w = this.$refs.container.clientWidth * (this.swipe / 100);
            this.clipLeft = 0 - w;
            this.clipRight = w - this.$refs.container.clientWidth;
          }
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
