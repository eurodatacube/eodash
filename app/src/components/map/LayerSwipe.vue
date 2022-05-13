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
    />
    <slot name="close"></slot>
    <input id="swipe" type="range" v-model="swipe">
    <div
      class="swipeinfo swipeinfoLeft"
      ref="swipeinfoLeft"
      :style="`clip-path: inset(0px ${clipLeft}px 0px 0px`"
    >{{ originalLayerName }}</div>
    <div
      class="swipeinfo swipeinfoRight"
      ref="swipeinfoRight"
      :style="`clip-path: inset(0px 0px 0px ${clipRight}px`"
    >{{ swipeLayerName }}</div>
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

export default {
  name: 'MapLayerSwipe',
  components: {
    SpecialLayer,
  },
  props: {
    mapId: String,
    mergedConfigsData: Object,
    embeddedMode: Boolean,
    embeddedActive: Boolean,
    reverseDirection: Boolean,
    originalLayer: Object,
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
      this.$root.$emit('renderMap');
    },
  },
  created() {},
  mounted() {
    const { map } = getMapInstance(this.mapId);
    map.on('postrender', () => {
      const swipeLayer = map.getLayers().getArray().find((l) => l.get('name') === this.swipeLayerName);
      if (this.swipeLayer) {
        swipeLayer.setZIndex(99);
        swipeLayer.on('prerender', this.onPrerender);
        swipeLayer.on('postrender', this.onPostrender);
      }
    });
  },
  methods: {
    onPrerender(evt) {
      const ctx = evt.context;
      const width = ctx.canvas.width * (this.swipe / 100);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, ctx.canvas.height);
      ctx.clip();
      console.log(this.$refs);
      if (Object.keys(this.$refs).length > 0) {
        const w = this.$refs.container.clientWidth * (this.swipe / 100);
        this.clipLeft = this.$refs.swipeinfoLeft.clientWidth - w;
        this.clipRight = w - this.$refs.container.clientWidth
            + this.$refs.swipeinfoRight.clientWidth;
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
.swipeinfo {
    position: absolute;
    top: 50%;
    background: var(--v-primary-base);
    width: auto;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    transform: translateY(-25px);
    font-size: 30px;
    font-weight: 500;
    font-family: 'Roboto', sans-serif;
    color: #fff;
    text-shadow: 0 0 0 #000, 0 0 0 #0d0d0d;
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
}
.swipeinfoLeft {
    left: 0;
    text-align: left;
    clip-path: inset(0px);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.swipeinfoRight {
    right: 0;
    text-align: right;
    clip-path: inset(0px);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}
</style>
