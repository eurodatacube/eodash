<template>
<v-row>
    <template
      v-for="(element, index) in features"
    >
      <v-col v-if="!element.indicatorObject" :key="index" cols="12">
        Error: {{ element }}
      </v-col>
      <v-col
        v-else
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        style="position: relative;"
      >
        <v-card
          class="pa-0"
          style="height: 500px"
          outlined
          tile
        >
          <indicator-map
            ref="indicatorMap"
            style="top: 0px; position: absolute;"
            v-if="['all'].includes(element.indicatorObject.country) ||
            Array.isArray(element.indicatorObject.country)"
            class="pt-0 fill-height"
            :currentIndicator="element.indicatorObject"

          />
          <!-- v-on:fetchCustomAreaIndicator="scrollToCustomAreaIndicator" -->
          <indicator-data
            style="top: 0px; position: absolute;"
            v-else
            class="pa-5 chart"
            :currentIndicator="element.indicatorObject"
          />
        </v-card>
        <template v-if="enableEditing">
          <div class="buttonContainer containerTop">
            <v-btn
              v-if="element.width > 1"
              class="my-2"
              style="background: white"
              fab
              outlined
              x-small
              color="primary"
              @click="resizeSmaller(element)"
            >
              <v-icon dark>
                mdi-arrow-collapse
              </v-icon>
            </v-btn>
            <v-btn
              v-if="element.width < 4"
              class="my-2"
              style="background: white"
              fab
              outlined
              x-small
              color="primary"
              @click="resizeLarger(element)"
            >
              <v-icon dark>
                mdi-arrow-expand
              </v-icon>
            </v-btn>
          </div>
          <div class="buttonContainer containerBottom">
            <v-btn
              v-if="index > 0"
              class="my-2"
              fab
              dark
              x-small
              color="primary"
              @click="moveLower(element)"
            >
              <v-icon dark>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              v-if="index < features.length - 1"
              class="my-2"
              fab
              dark
              x-small
              color="primary"
              @click="moveHigher(element)"
            >
              <v-icon dark>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
        </template>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';

export default {
  props: {
    dashboardFeatures: Array,
    enableEditing: Boolean,
  },
  components: {
    IndicatorData,
    IndicatorMap,
  },
  data: () => ({
    features: null,
  }),
  created() {
    this.features = this.dashboardFeatures;
  },
  methods: {
    updateFeatures() {
      this.$emit('updateFeatures', this.features);
    },
    resizeSmaller(element) {
      this.features.find((e) => e.poi === element.poi).width -= 1;
      this.updateFeatures();
    },
    resizeLarger(element) {
      this.features.find((e) => e.poi === element.poi).width += 1;
      this.updateFeatures();
    },
    moveLower(element) {
      this.arrayMove(
        this.features,
        this.features.indexOf(element),
        this.features.indexOf(element) - 1,
      );
      this.updateFeatures();
    },
    moveHigher(element) {
      this.arrayMove(
        this.features,
        this.features.indexOf(element),
        this.features.indexOf(element) + 1,
      );
      this.updateFeatures();
    },
    arrayMove(arr, oldIndex, newIndex) {
      if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  position: absolute;
  right: -3px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
.containerTop {
  top: 10%;
}
.containerBottom {
  bottom: 10%;
}
.chart {
  background: #fff;
}
</style>
