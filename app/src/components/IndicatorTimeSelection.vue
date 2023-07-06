<template>
  <v-sheet
    class="row justify-center align-center rounded"
    :class="$vuetify.breakpoint.xsOnly && autofocus ? 'menu-top' : 'menu-bottom'"
    :style="`position: absolute; ${$vuetify.breakpoint.xsOnly && autofocus
      ? 'top: 10px'
      : 'bottom: 30px'}; z-index: 5; width: auto; max-width: 600px;`"
  >
    <v-col>
      <v-slider
        v-model="originalTimeIndex"
        :min="0"
        :max="availableValues.length - 1"
        :step="1"
        thumb-label
      >
        <template v-slot:prepend>
          <v-btn
            dark
            x-small
            color="primary"
            :disabled="originalTimeIndex === 0"
            class="h-3"
            @click="originalTimeIndex--"
          >
            <v-icon small>mdi-arrow-left</v-icon>
          </v-btn>
        </template>

        <template v-slot:append>
          <v-btn
            dark
            x-small
            color="primary"
            :disabled="originalTimeIndex === availableValues.length - 1"
            class="h-3"
            @click="originalTimeIndex++"
          >
            <v-icon small>mdi-arrow-right</v-icon>
          </v-btn>
        </template>
      </v-slider>
      <SliderTicks
        style="transform: translateY(-30px)"
        :times="availableValues"
        :width="timeSliderWidth"
      />
    </v-col>
    <v-col
      v-if="currentlyComparing"
      cols="6"
      class="pr-0"
    >
      <v-select
        ref="compareTimeSelect"
        v-if="compareActive"
        outlined
        dense
        :autofocus="autofocus"
        attach
        hide-details
        :prepend-inner-icon="(availableValues && compareTime) && (availableValues
          .findIndex((i) => i.value === compareTime.value) > 0
            ? 'mdi-arrow-left-drop-circle'
            : 'mdi-asterisk')"
        :append-icon="(availableValues && compareTime) && (availableValues
          .findIndex((i) => i.value === compareTime.value) < availableValues.length - 1
            ? 'mdi-arrow-right-drop-circle'
            : 'mdi-asterisk')"
        menu-props="auto"
        :items="availableValues"
        item-value="value"
        item-text="name"
        return-object
        v-model="compareTimeModel"
        @focus="() => $emit('focusSelect', true)"
        @blur="() => $emit('focusSelect', false)"
        @click:prepend-inner="change('compareTimeModel', -1)"
        @click:append="change('compareTimeModel', +1)"
      ></v-select>
    </v-col>
    <v-col
      :cols="currentlyComparing ? 6 : 12"
    >
      <v-select
        ref="originalTimeSelect"
        outlined
        dense
        :autofocus="autofocus"
        attach
        hide-details
        :prepend-inner-icon="(availableValues && originalTime) && (availableValues
          .findIndex((v) => v.value === originalTime.value) > 0
            ? 'mdi-arrow-left-drop-circle'
            : 'mdi-asterisk')"
        :append-icon="(availableValues && originalTime) && (availableValues
          .findIndex((i) => i.value === originalTime.value) < availableValues.length - 1
            ? 'mdi-arrow-right-drop-circle'
            : 'mdi-asterisk')"
        menu-props="auto"
        :items="availableValues"
        item-value="value"
        item-text="name"
        return-object
        v-model="originalTimeModel"
        @focus="() => $emit('focusSelect', true)"
        @blur="() => $emit('focusSelect', false)"
        @click:prepend-inner="change('originalTimeModel', -1)"
        @click:append="change('originalTimeModel', +1)"
      >
        <template v-slot:prepend
        v-if="enableCompare">
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                @click="() => $emit('update:compareActive', !compareActive)"
              >
                mdi-compare
              </v-icon>
            </template>
            Compare two images
          </v-tooltip>
        </template>
      </v-select>
    </v-col>
  </v-sheet>
</template>

<script>
import { DateTime } from 'luxon';

import SliderTicks from './map/SliderTicks.vue';

export default {
  components: {
    SliderTicks,
  },
  props: {
    autofocus: {
      type: Boolean,
      default: true,
    },
    availableValues: {
      type: Array,
      required: true,
    },
    compareActive: {
      type: Boolean,
      default: false,
    },
    compareTime: {
      type: Object,
    },
    originalTime: {
      type: Object,
      required: true,
    },
    enableCompare: {
      type: Boolean,
      default: true,
    },
    indicator: {
      type: Object,
    },
    largeTimeDuration: {
      type: Boolean,
    },
  },
  data: () => ({
    compareTimeModel: null,
    originalTimeModel: null,
    originalTimeIndex: 0,
  }),
  computed: {
    currentlyComparing() {
      let pass = true;
      if (this.indicator) {
        pass = !this.indicator.compareDisplay;
      }
      return this.compareActive && pass;
    },
    timeSliderWidth() {
      return 470;
    },
  },
  created() {
    if (!this.compareTime) {
      if (this.indicator && this.indicator.compareDisplay) {
        this.compareTimeModel = this.originalTime;
      } else {
        this.compareTimeModel = this.getInitialCompareTime();
      }
    } else {
      this.compareTimeModel = this.compareTime;
    }
    this.originalTimeModel = this.originalTime;
  },
  methods: {
    change(modelName, adjust) {
      const newIndex = this.availableValues
        .findIndex((i) => i.value === this[modelName].value) + adjust;
      this[modelName] = this.availableValues[newIndex];
    },
    getInitialCompareTime() {
      if (this.indicator && this.indicator.compareDisplay) {
        // if compareDisplay is set, both sides of map share same time
        return this.availableValues[this.availableValues.length - 1];
      }
      // find closest entry one year before latest time
      if (this.largeTimeDuration) {
        // if interval, use just start to get closest
        const times = this.availableValues
          .map((item) => (Array.isArray(item.value) ? item.value[0] : item.value));
        const lastTimeEntry = DateTime.fromISO(times[times.length - 1]);
        const oneYearBefore = lastTimeEntry.minus({ years: 1 });
        // select closest to one year before
        const closestOneYearBefore = times.find((item, i) => (
          i === times.length - 1 || (
            Math.abs(oneYearBefore.toMillis() - DateTime.fromISO(item).toMillis())
            < Math.abs(oneYearBefore.toMillis() - DateTime.fromISO(times[i + 1]).toMillis())
          )
        ));
        // Get index and return object from original times as there are also
        // arrays of time tuple arrays
        const foundIndex = times.indexOf(closestOneYearBefore);
        return this.availableValues[foundIndex];
      }
      // use first time
      return this.availableValues[0];
    },
  },
  watch: {
    compareTime: {
      deep: true,
      handler(timeObj) {
        this.compareTimeModel = timeObj;
      },
    },
    originalTime: {
      deep: true,
      handler(timeObj) {
        this.originalTimeModel = timeObj;
      },
    },
    compareTimeModel: {
      deep: true,
      handler(timeObj) {
        this.$emit('update:compareTime', timeObj);
      },
    },
    originalTimeModel: {
      deep: true,
      handler(timeObj) {
        this.$emit('update:originalTime', timeObj);
        // Update the slider if the dropdown changes the value
        this.originalTimeIndex = this.availableValues.indexOf(timeObj);
      },
    },
    originalTimeIndex: {
      deep: true,
      handler(index) {
        // Update the model when the slider index changes
        this.$emit('update:originalTime', this.availableValues[index]);
        this.originalTimeModel = this.availableValues[index];
      },
    },
  },
};
</script>

<style scoped>
::v-deep .mdi-asterisk {
  visibility: hidden;
}
.menu-bottom ::v-deep .v-menu__content {
  transform: translate(1%, -87%);
}
</style>
