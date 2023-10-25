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
      <span>Choose range</span>
    </v-tooltip>
    <v-card v-else class="sliderContainer">
      <v-card-text>
        <v-range-slider
          v-model="selectedRange"
          :min="minVal"
          :max="maxVal"
          :step="1"
          thumb-label="always"
        ></v-range-slider>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { VRangeSlider } from 'vuetify/lib';
import { getMapInstance } from '@/components/map/map';

export default {
  props: {
    mapId: String,
    minVal: Number,
    maxVal: Number,
  },
  components: {
    VRangeSlider,
  },
  data() {
    return {
      show: false,
      selectedRange: [this.minVal, this.maxVal],
    };
  },
  watch: {
    show(val) {
      if (val) {
        getMapInstance(this.mapId).map.once('click', () => {
          this.show = false;
        });
      }
    },
    selectedRange(range) {
      const store = this.$store;

      // Check, if at least 1500ms have passed since the last change, otherwise we commit
      // every small change, which makes the slider slow.
      this.lastChangeTimestamp = Date.now();
      setTimeout(() => {
        const currentTime = Date.now();
        if (currentTime - this.lastChangeTimestamp >= 1500) {
          store.commit('features/SET_SELECTED_RANGE', range);
        }
      }, 1500);
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
