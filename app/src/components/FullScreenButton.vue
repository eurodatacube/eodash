<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        fab
        :raised="false"
        x-small
        class="btn elevation-3"
        @click="toggleFullscreen"
      >
        <v-icon>{{ fullscreen 
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
  }),
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
.btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  margin: 10px;
  border-radius: 5px;
  width: 26px;
  height: 26px;
}
</style>
