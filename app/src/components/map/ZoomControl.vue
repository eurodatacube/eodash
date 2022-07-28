<template>
  <div class="zoomContainer">
    <v-btn class="controlButton" @click="zoom(1)">+</v-btn>
    <v-btn class="controlButton" @click="zoom(-1)">-</v-btn>
  </div>
</template>

<script>
import getMapInstance from '@/components/map/map';
import { easeOut } from 'ol/easing';

export default {
  components: {},
  props: {
    mapId: String,
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    zoom(value) {
      const view = getMapInstance(this.mapId).map.getView();
      const zoom = view.getZoom();
      view.animate({
        zoom: zoom + value,
        duration: 250,
        easing: easeOut,
      });
    },
  },
  beforeDestroy() {

  },
};
</script>

<style lang="scss" scoped>
  .zoomContainer {
    width: 36px;
  }

  .controlButton {
    width: 36px;
    min-width: 0px !important;
    height: 36px !important;
    z-index: 2;
    pointer-events: initial;
  }
</style>
