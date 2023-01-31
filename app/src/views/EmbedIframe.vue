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
        <Map
          style="top: 0px; position: absolute;"
          v-if="globalData"
          class="pt-0 fill-height"
          mapId="embedMap"
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
          <a
            :href="`${$router.options.routes.find((r) => r.name === 'explore')
              .path}?poi=${this.getLocationCode($store.state.indicators.selectedIndicator)}`"
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

import IndicatorData from '@/components/IndicatorData.vue';
import Map from '@/components/map/Map.vue';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  components: {
    IndicatorData,
    Map,
  },
  data: () => ({
    overlay: false,
    dataInteract: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    globalData() {
      return ['all'].includes(this.indicatorObject.country) || this.appConfig.configuredMapPois.includes(`${this.indicatorObject.aoiID}-${this.indicatorObject.indicator}`) || Array.isArray(this.indicatorObject.country);
    },
    selectedIndicator() {
      return this.$store.state.indicators.selectedIndicator;
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
  },
  mounted() {
    document.body.classList.add('iframe');
  },
  methods: {
    swipe() {
      this.overlay = true;
      setTimeout(() => { this.overlay = false; }, 2000);
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
