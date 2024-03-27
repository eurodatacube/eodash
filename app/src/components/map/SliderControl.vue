<template>
  <div class="rangeSliderControls mb-2">
    <v-tooltip v-if="!show" left>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="pa-0 elevation-2 round rangeSliderBtn"
          style="min-width: 0"
          v-on="on"
          @click="show = true"
        >
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
      <span>{{config.title}}</span>
    </v-tooltip>
    <v-card v-else class="sliderContainer">
      <v-card-title class="mb-4">
        {{config.title}}
      </v-card-title>
      <v-card-text>
        <v-slider
          v-model="sliderValue"
          :max="config.max || 100"
          :min="config.min || 0"
          :step="config.step || 1"
          thumb-label="always"
          track-color="grey"
        ></v-slider>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { VSlider } from 'vuetify/lib';
import { getMapInstance } from '@/components/map/map';

export default {
  props: {
    mapId: String,
    config: Object,
  },
  components: {
    VSlider,
  },
  data() {
    return {
      show: false,
      sliderValue: null,
    };
  },
  created() {
    if (this.config?.default) {
      // initial setup
      this.sliderValue = this.config?.default;
      this.$store.commit('features/SET_SLIDER_VALUE', this.sliderValue);
    }
  },
  watch: {
    show(val) {
      if (val) {
        getMapInstance(this.mapId).map.once('click', () => {
          this.show = false;
        });
      }
    },
    sliderValue(val) {
      const store = this.$store;
      // Check, if at least 300ms have passed since the last change, otherwise we commit
      // every small change, which makes the slider slow.
      this.lastChangeTimestamp = Date.now();
      setTimeout(() => {
        const currentTime = Date.now();
        if (currentTime - this.lastChangeTimestamp >= 300) {
          store.commit('features/SET_SLIDER_VALUE', val);
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss">
.rangeSliderControls {
  .rangeSliderBtn {
    width: 36px;
    height: 36px !important;
    pointer-events: initial;
  }

  .sliderContainer {
    width: 300px;
  }
}
</style>
