<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        fab
        :raised="false"
        x-small
        class="fs-btn elevation-3"
        :class="touch && 'fs-btn-touch'"
        @click="toggleFullscreen"
      >
        <v-icon
          :class="touch && 'fs-icon-touch'"
        >{{ fullscreen
          ? 'mdi-fullscreen-exit'
          : 'mdi-fullscreen' }}</v-icon>
      </v-btn>
    </template>
    <span v-if="!isFullScreen">Full screen</span>
  </v-tooltip>
</template>

<script>
import fullscreen from 'vue-fullscreen';
import Vue from 'vue';
import { mapState } from 'vuex';

Vue.use(fullscreen);

export default {
  data: () => ({
    fullscreen: false,
    fullScreenElement: null,
    touch: false,
  }),
  computed: {
    ...mapState(['isFullScreen'])
  },
  mounted() {
    this.$nextTick(() => {
      this.touch = window.L.Browser.touch;
    });
  },
  methods: {
    toggleFullscreen(event) {
      // Toggle fullscreen Element in the container element
      const { parentElement } = event.target.closest('.v-btn');
      this.fullScreenElement = parentElement;
      if(this.$fullscreen.support) {
        this.$fullscreen.toggle(parentElement, {
          wrap: false,
          callback: this.fullscreenChange,
        });
      } else {
        this.fullscreenChange(!this.isFullScreen);
      }
    },
    fullscreenChange(fullscreenActive) {
      this.fullscreen = fullscreenActive;
      const app = document.querySelector('.v-application');
      if (fullscreenActive) {
        app.classList.add('fullScreenActive');
        this.fullScreenElement.classList.add('fullscreenElement');
      } else {
        app.classList.remove('fullScreenActive');
        this.fullScreenElement.classList.remove('fullscreenElement');
      }
      this.$store.commit('changeFullScreen', fullscreenActive);
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize')); // Fixes Safari bug(#810)
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.fs-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  margin: 10px;
  border-radius: 5px;
  width: 26px;
  height: 26px;
}
.fs-btn-touch {
  width: 34px;
  height: 34px;
  border: 2px solid rgba(0,0,0,.2);
  box-shadow: none !important;
}
.fs-icon-touch {
  font-size: 24px !important;
}
</style>

<style lang="scss">
.data-panel .showFullScreenButton .leaflet-top {
  top: 38px;
}
.data-panel .showFullScreenButton .leaflet-touch .leaflet-top {
  top: 45px;
}
// global setting to have the fullscreen container
// 100% width and height, to fix safari issues
// *|*:fullscreen:not(:root) {
//   position: fixed !important;
//   top: 0 !important;
//   left: 0 !important;
//   right: 0 !important;
//   bottom: 0 !important;
//   width: 100% !important;
//   // height: 100% !important;
//   margin: 0 !important;
//   min-width: 0 !important;
//   max-width: none !important;
//   min-height: 0 !important;
//   max-height: none !important;
//   box-sizing: border-box !important;
//   object-fit: contain;
//   transform: none !important;
// }
// .fullscreenElement {
//   width: 100% !important;
//   height: calc(100vh - 104px)!important;
// }
// .fullScreenActive .drawerLeft,
// .fullScreenActive header,
// .fullScreenActive footer,
// .fullScreenActive .Cookie {
//   display: none;
// }
// .fullScreenActive .data-panel {
//   height: 100vh !important;
//   margin-top: 0 !important;
//   width: 100vw !important;
// }
</style>
