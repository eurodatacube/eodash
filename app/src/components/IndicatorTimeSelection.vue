<template>
  <v-sheet
    class="row justify-center align-center"
    style="position: absolute; bottom: 30px; z-index: 1000; width: auto; max-width: 100%;"
  >
    <v-col
      v-if="compareActive && !indicator.compareDisplay"
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
          .map((i) => i.value)
          .indexOf(compareTime.value) > 0
            ? 'mdi-arrow-left-drop-circle'
            : 'mdi-asterisk')"
        :append-icon="(availableValues && compareTime) && (availableValues
          .map((i) => i.value)
          .indexOf(compareTime.value) < availableValues.length - 1
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
      :cols="compareActive && !indicator.compareDisplay ? 6 : 12"
    >
      <v-select
        ref="originalTimeSelect"
        outlined
        dense
        :autofocus="autofocus"
        attach
        hide-details
        :prepend-inner-icon="(availableValues && originalTime) && (availableValues
          .map((i) => i.value)
          .indexOf(originalTime.value) > 0
            ? 'mdi-arrow-left-drop-circle'
            : 'mdi-asterisk')"
        :append-icon="(availableValues && originalTime) && (availableValues
          .map((i) => i.value)
          .indexOf(originalTime.value) < availableValues.length - 1
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
export default {
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
      required: true,
    },
  },
  data: () => ({
    compareTimeModel: null,
    originalTimeModel: null,
  }),
  created() {
    this.compareTimeModel = this.compareTime;
    this.originalTimeModel = this.originalTime;
  },
  methods: {
    change(modelName, adjust) {
      const newIndex = this.availableValues
        .findIndex((i) => i.value === this[modelName].value) + adjust;
      this[modelName] = this.availableValues[newIndex];
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
      },
    },
  },
};
</script>

<style scoped>
::v-deep .mdi-asterisk {
  visibility: hidden;
}
</style>
