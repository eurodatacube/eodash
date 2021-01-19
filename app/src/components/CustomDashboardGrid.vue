<template>
  <v-container style="background: #fff">
    <h1 class="display-2 font-weight-light primary--text mt-7 mb-5">
      Test Custom Dashboard</h1>
    <v-row>
      <template
        v-for="(element, index) in dashboardFeatures"
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
              v-if="index < dashboardFeatures.length - 1"
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
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';

export default {
  props: {
    dashboardFeatures: Array,
  },
  components: {
    IndicatorData,
    IndicatorMap,
  },
  methods: {
    resizeSmaller(element) {
      this.dashboardFeatures.find((e) => e.poi === element.poi).width -= 1;
    },
    resizeLarger(element) {
      this.dashboardFeatures.find((e) => e.poi === element.poi).width += 1;
    },
    moveLower(element) {
      this.arrayMove(
        this.dashboardFeatures,
        this.dashboardFeatures.indexOf(element),
        this.dashboardFeatures.indexOf(element) - 1,
      );
    },
    moveHigher(element) {
      this.arrayMove(
        this.dashboardFeatures,
        this.dashboardFeatures.indexOf(element),
        this.dashboardFeatures.indexOf(element) + 1,
      );
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
