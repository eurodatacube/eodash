<template>
  <div class="zoomContainer mb-2">
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="controlButton rounded-b-0"
          v-on="on"
          @click="zoom(1)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Zoom in</span>
    </v-tooltip>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="controlButton rounded-t-0"
          v-on="on"
          @click="zoom(-1)"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>
      <span>Zoom out</span>
    </v-tooltip>
  </div>
</template>

<script>
import { getMapInstance } from '@/components/map/map';
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
