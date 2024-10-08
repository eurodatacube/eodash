<template>
  <div
    v-if="swipeActive"
    class="swipe-container"
    ref="container"
  >
    <!-- a comparelayer for a selected global poi with a time component -->
    <SpecialLayer
      :mapId="mapId"
      :mergedConfigs="mergedConfigsData"
      :compare='true'
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
import { getMapInstance } from '@/components/map/map';
import SpecialLayer from '@/components/map/SpecialLayer.vue';
import { updateTimeLayer } from '@/components/map/timeLayerUtils';
import { loadIndicatorExternalData } from '@/utils';

export default {
  name: 'MapLayerSwipe',
  components: {
    SpecialLayer,
  },
  props: {
    mapId: String,
    mergedConfigsData: Array[Object],
    specialLayerOptionProps: Object,
    time: {
      required: true,
    },
    drawnArea: Object,
    enable: Boolean,
  },
  data: () => ({
    swipeActive: false,
    swipeLayerObject: null,
    swipe: 0,
    swipePixelX: null,
    _time: null,
  }),
  computed: {
    specialLayerOptions() {
      const options = { ...this.specialLayerOptionProps };
      options.time = this.time;
      options.dataProp = 'compareMapData'; // Used to modify which data source location to use
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
          const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
          this.mergedConfigsData.forEach((config) => {
            const originalLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === config.name);
            const swipeLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === `${config.name}_compare`);
            if (swipeLayer) {
              swipeLayer.on('prerender', this.onPrerender);
              swipeLayer.on('postrender', this.onPostrender);
              originalLayer.on('prerender', this.onPrerender);
              originalLayer.on('postrender', this.onPostrender);
              if (config.protocol === 'cog') {
                // special case because otherwise last time is used on enabling compare
                updateTimeLayer(swipeLayer, config, this.time, this.drawnArea);
              }
            }
          });
        });
      } else {
        const deactivate = () => {
          this.swipeActive = false;
          const { map } = getMapInstance(this.mapId);
          const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
          this.mergedConfigsData.forEach((config) => {
            const originalLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === config.name);
            originalLayer.un('prerender', this.onPrerender);
            originalLayer.un('postrender', this.onPostrender);
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
      const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
      this.mergedConfigsData.forEach((config) => {
        const swipeLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === `${config.name}_compare`);
        swipeLayer.changed();
      });
    },
    time(time) {
      // redraw all time-dependant layers, if time is passed via WMS params
      const { map } = getMapInstance(this.mapId);
      const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
      this.mergedConfigsData.forEach((config) => {
        const swipeLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === `${config.name}_compare`);
        if (config.protocol === 'geoserverTileLayer' && swipeLayer) {
          loadIndicatorExternalData(
            time, config,
          ).then((data) => {
            this.$store.state.indicators.selectedIndicator.compareMapData = data;
            swipeLayer.changed();
          });
        } else if (swipeLayer) {
          updateTimeLayer(swipeLayer, config, time, this.drawnArea);
        }
      });
    },
    drawnArea(area) {
      // redraw all area features
      const { map } = getMapInstance(this.mapId);
      const dataGroup = map.getLayers().getArray().find((l) => l.get('id') === 'dataGroup');
      this.mergedConfigsData.forEach((config) => {
        const swipeLayer = dataGroup.getLayers().getArray().find((l) => l.get('name') === `${config.name}_compare`);
        if (config.protocol === 'geoserverTileLayer' && swipeLayer) {
          loadIndicatorExternalData(
            time, config,
          ).then((data) => {
            this.$store.state.indicators.selectedIndicator.compareMapData = data;
            swipeLayer.changed();
          });
        } else if (swipeLayer) {
          updateTimeLayer(swipeLayer, config, this.time, area, 'updateArea');
        }
      });
    },
  },
  methods: {
    onPrerender(evt) {
      // clip the originalLayer from right, the comparing layer from left
      if (this.$refs.container) {
        const ctx = evt.context;
        const sidePadding = document.querySelector('.data-panel') !== null // eslint-disable-line
          ? !document.querySelector('.data-panel').className.includes('v-navigation-drawer--open')
            ? 0
            : document.querySelector('.data-panel').scrollWidth * window.devicePixelRatio
          : 0;
        // on retina displays, the actual part of canvas that data-panel occupies
        // need to be multiplied by the devicePixelRatio
        const actualWidth = ctx.canvas.width;
        const actualHeight = ctx.canvas.height;
        this.swipePixelX = (actualWidth - sidePadding) * (this.swipe / 100);
        this.$emit('updateSwipePosition', this.swipePixelX);
        // check if the event-layer is displayed on the right side
        const isRightLayer = !evt.target.get('name').includes('_compare');
        if (isRightLayer) {
          if (ctx instanceof WebGLRenderingContext) {
            if (this._time !== evt.frameState.time) {
              ctx.clearColor(0, 0, 0, 0);
              ctx.clear(ctx.COLOR_BUFFER_BIT);
              this._time = evt.frameState.time;
            }
            ctx.enable(ctx.SCISSOR_TEST);
            ctx.scissor(
              this.swipePixelX, 0, actualWidth - this.swipePixelX, actualHeight,
            );
            ctx.clearColor(0, 0, 0, 0);
            ctx.clear(ctx.COLOR_BUFFER_BIT);
          } else {
            ctx.save();
            ctx.beginPath();
            ctx.rect(this.swipePixelX, 0, actualWidth - this.swipePixelX, actualHeight);
            ctx.clip();
          }
        } else if (ctx instanceof WebGLRenderingContext) {
          if (this._time !== evt.frameState.time) {
            ctx.clearColor(0, 0, 0, 0);
            ctx.clear(ctx.COLOR_BUFFER_BIT);
            this._time = evt.frameState.time;
          }
          ctx.clearColor(0, 0, 0, 0);
          ctx.enable(ctx.SCISSOR_TEST);
          ctx.scissor(0, 0, this.swipePixelX, actualHeight);
          ctx.clearColor(0, 0, 0, 0);
          ctx.clear(ctx.COLOR_BUFFER_BIT);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, this.swipePixelX, actualHeight);
          ctx.clip();
        }
      }
    },
    onPostrender(evt) {
      const ctx = evt.context;
      if (ctx instanceof WebGLRenderingContext) {
        ctx.disable(ctx.SCISSOR_TEST);
      } else {
        ctx.restore();
      }
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
