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
    <span>Full screen</span>
  </v-tooltip>
</template>

<script>
import fullscreen from 'vue-fullscreen';
import Vue from 'vue';
Vue.use(fullscreen);

export default {
  data: () => ({
    fullscreen: false,
    touch: false,
  }),
  mounted() {
    this.$nextTick(() => {
      this.touch = window.L.Browser.touch;
    });
  },
  methods: {
    toggleFullscreen(event) {
      // Toggle fullscreen Element in the container element
      this.$fullscreen.toggle(event.target.closest('.v-btn').parentElement, {
        wrap: false,
        callback: this.fullscreenChange,
      })
    },
    fullscreenChange (fullscreen) {
      this.fullscreen = fullscreen;
    },
  }
}
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
