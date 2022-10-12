<template>
  <v-tooltip left>
    <template v-slot:activator="{ on }">
      <v-btn
        :color="$vuetify.theme.currentTheme.background"
        class="controlButton mb-2"
        v-on="on"
        @click="setFullScreen"
      >
        <v-icon>{{fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'}}</v-icon>
      </v-btn>
    </template>
    <span>Fullscreen</span>
  </v-tooltip>
</template>

<script>
import getMapInstance from '@/components/map/map';

export default {
  components: {},
  props: {
    mapId: String,
  },
  data() {
    return {
      fullscreen: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    setFullScreen() {
      const elem = getMapInstance(this.mapId).map.getTargetElement();
      if (elem) {
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          this.fullscreen = false;
        } else {
          if (elem.requestFullscreen) {
            console.log(1);
            elem.requestFullscreen();
          } else if (elem.msRequestFullscreen) {
            console.log(2);
            elem.msRequestFullscreen();
          } else if (elem.mozRequestFullScreen) {
            console.log(3);
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) {
            console.log(4);
            elem.webkitRequestFullscreen();
          }
          this.fullscreen = true;
        }
      }
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
  .controlButton {
    width: 36px;
    min-width: 0px !important;
    height: 36px !important;
    z-index: 2;
    pointer-events: initial;
  }
</style>
