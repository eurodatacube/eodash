<template>
  <div class="fill-height pa-1" style="background: transparent">
    <v-card
      v-if="$store.state.indicators.selectedIndicator"
      class="fill-height elevation-3 d-flex flex-column"
    >
      <v-card-title v-if="$store.state.indicators.selectedIndicator"
        :class="$store.state.indicators.selectedIndicator.description ===
          $store.state.indicators.selectedIndicator.indicatorName && 'preventEllipsis'"
        color="primary"
        class="flex-grow-0"
      >
        {{ $store.state.features.allFeatures
            .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
            .properties.indicatorObject.city }},
        {{ $store.state.features.allFeatures
            .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
            .properties.indicatorObject.description }}
      </v-card-title>
      <v-card-subtitle v-if="
        $store.state.indicators.selectedIndicator.description !==
        $store.state.indicators.selectedIndicator.indicatorName"
        class="subheading pb-1 flex-grow-0" style="font-size: 0.8em">
        {{ $store.state.features.allFeatures
          .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
          .properties.indicatorObject.indicatorName }}
      </v-card-subtitle>
      <div>
        <v-tabs
          v-if="multipleTabCompare"
          v-model="selectedSensorTab"
          grow
        >
          <v-tab
            v-for="sensorData in multipleTabCompare.features"
            :key="sensorData.properties.indicatorObject.id"
            :class="multipleTabCompare.features.indexOf(sensorData) == selectedSensorTab
              ? 'primary white--text'
              : ''"
          >
            {{ Array.isArray(sensorData.properties.indicatorObject[multipleTabCompare.label])
              ? sensorData.properties.indicatorObject[multipleTabCompare.label][0]
              : sensorData.properties.indicatorObject[multipleTabCompare.label] }}
          </v-tab>
        </v-tabs>
      </div>
      <v-tabs-items
        v-if="multipleTabCompare"
        touchless
        v-model="selectedSensorTab"
        class="fill-height"
      >
        <v-tab-item
          v-for="sensorData in multipleTabCompare.features"
          :key="sensorData.properties.indicatorObject.id"
          class="fill-height"
        >
          <div
            style="height: 100%;z-index: 500; position: relative;"
            v-if="$vuetify.breakpoint.mdAndDown && !dataInteract"
            @click="dataInteract = true"
            v-touch="{
              left: () => swipe(),
              right: () => swipe(),
              up: () => swipe(),
              down: () => swipe(),
          }">
          </div>
          <v-overlay :value="overlay" absolute
            v-if="!dataInteract"
            @click="dataInteract = true">
            Tap to interact
          </v-overlay>
          <indicator-map
            style="top: 0px; position: absolute;"
            v-if="globalData"
            class="pt-0 fill-height"
            :currentIndicator="sensorData.properties.indicatorObject"
          />
          <indicator-data
            style="top: 0px; position: absolute;"
            v-else
            class="pa-5"
            :currentIndicator="sensorData.properties.indicatorObject"
          />
        </v-tab-item>
      </v-tabs-items>
      <div
        v-else-if="indicatorObject"
        style="position: relative; height: 50vh"
        class="flex-grow-1"
      >
        <div
          style="height: 100%;z-index: 500; position: relative;"
          v-if="$vuetify.breakpoint.mdAndDown && !dataInteract"
          @click="dataInteract = true"
          v-touch="{
            left: () => swipe(),
            right: () => swipe(),
            up: () => swipe(),
            down: () => swipe(),
        }">
        </div>
        <v-overlay :value="overlay" absolute
          v-if="!dataInteract"
          @click="dataInteract = true">
          Tap to interact
        </v-overlay>
        <indicator-map
          style="top: 0px; position: absolute;"
          v-if="globalData"
          class="pt-0 fill-height"
        />
        <indicator-data
          style="top: 0px; position: absolute;"
          v-else
          class="pa-5 fill-height"
        />
      </div>
      <v-card-text v-if="indicatorObject && indicatorObject.updateFrequency" class="flex-grow-0">
        <small v-if="indicatorObject && indicatorObject.updateFrequency">
          <span v-if="indicatorObject.updateFrequency
            === 'Retired'">This indicator is no longer updated</span>
          <span v-else-if="indicatorObject.updateFrequency
            === 'EndSeason'">Due to end of season, this indicator is no longer updated</span>
          <span v-else>This data is updated: {{ indicatorObject.updateFrequency }}</span>
        </small>
      </v-card-text>
      <v-card-actions :style="`background: ${$vuetify.theme.themes.light.primary}`"
        class="flex-grow-0"
      >
        <small class="white--text ml-2">Read the
          <a :href="`/?poi=${this.getLocationCode($store.state.indicators.selectedIndicator)}`"
            target="_blank" class="white--text">full story on this indicator</a>.
        </small>

        <v-spacer></v-spacer>
          <h3
            class="text-uppercase mr-2 subtitle ml-2 white--text"
          >
            <a href="/"
              target="_blank" class="white--text" style="text-decoration: none">
              {{ appConfig && appConfig.branding.appName }}
            </a>
          </h3>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import { loadIndicatorData } from '@/utils';

import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  components: {
    IndicatorData,
    IndicatorMap,
  },
  data: () => ({
    overlay: false,
    dataInteract: false,
    selectedSensorTab: 0,
    setSensorTab: false,
    multipleTabCompare: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    globalData() {
      return ['all'].includes(this.indicatorObject.country) || Array.isArray(this.indicatorObject.country);
    },
    selectedIndicator() {
      return this.$store.state.indicators.selectedIndicator;
    },
    indicatorObject() {
      let indicatorObject;
      if (this.multipleTabCompare) {
        const feature = this.multipleTabCompare.features[0];
        indicatorObject = feature && feature.properties.indicatorObject;
      } else {
        indicatorObject = this.$store.state.indicators.selectedIndicator;
      }
      return indicatorObject;
    },
  },
  mounted() {
    document.body.classList.add('iframe');
  },
  methods: {
    async init() {
      await this.checkMultipleTabCompare();
      this.selectedSensorTab = this.multipleTabCompare
        ? this.multipleTabCompare.features
          .indexOf(this.multipleTabCompare.features
            .find((s) => this.getLocationCode(s.properties.indicatorObject)
              === this.$route.query.poi))
        : 0;
    },
    async checkMultipleTabCompare() {
      let compare;
      const { selectedIndicator } = this;
      const hasGrouping = this.appConfig.featureGrouping
        .find((g) => g.features.find((i) => i.includes(this.getLocationCode(selectedIndicator))));
      if (hasGrouping) {
        compare = {};
        compare.label = hasGrouping.label;
        compare.features = hasGrouping.features;
        // Pre-load all indicators to populate tab items
        await Promise.all(compare.features.map(async (f) => {
          const feature = this.$store.state.features.allFeatures
            .find((i) => this.getLocationCode(i.properties.indicatorObject) === f);
          await loadIndicatorData(this.baseConfig, feature.properties.indicatorObject);
        }));
        compare.features = compare.features.map((f) => this.$store.state.features.allFeatures
          .find((i) => this.getLocationCode(i.properties.indicatorObject) === f));
      }
      this.multipleTabCompare = compare;
    },
    swipe() {
      this.overlay = true;
      setTimeout(() => { this.overlay = false; }, 2000);
    },
  },
  watch: {
    selectedIndicator() {
      this.init();
    },
    selectedSensorTab(index) {
      if (this.multipleTabCompare.features[index]) {
        const poi = this.getLocationCode(this.multipleTabCompare.features[index]
          .properties.indicatorObject);
        this.$router.replace({ query: { ...this.$route.query, poi } }).catch(() => {});
      }
    },
  },
};
</script>

<style lang="scss">
// html {
//   overflow: hidden;
// }
.iframe .v-application {
  background: none transparent !important;
}
</style>
