<template>
  <div class="fill-height pa-1" style="background: transparent">
    <v-card
      v-if="$store.state.indicators.selectedIndicator"
      class="fill-height elevation-3 d-flex flex-column"
    >
      <v-card-title v-if="$store.state.indicators.selectedIndicator && !enableScrollyMode"
        :class="$store.state.indicators.selectedIndicator.description ===
          $store.state.indicators.selectedIndicator.name && 'preventEllipsis'
        "
        color="primary"
        class="flex-grow-0"
      >
        {{ $store.state.indicators.selectedIndicator.city || $store.state.indicators.selectedIndicator.country }},
        {{ $store.state.indicators.selectedIndicator.description }}
      </v-card-title>
      <v-card-subtitle v-if="
        $store.state.indicators.selectedIndicator.description !==
        $store.state.indicators.selectedIndicator.name"
        class="subheading pb-1 flex-grow-0" style="font-size: 0.8em">
        {{ $store.state.indicators.selectedIndicator.name }}
      </v-card-subtitle>
      <div
        v-if="selectedIndicator"
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
          v-if="$route.query.embedMap === 'true'"
          class="pt-0 fill-height"
          mapId="embedMap"
          v-bind="mapPosition"
          :onScrollyModeChange="(v) => { enableScrollyMode = v }"
        />
        <indicator-data
          style="top: 0px; position: absolute;"
          v-else
          class="pa-5 fill-height"
        />
      </div>
      <v-card-actions
        v-if="!enableScrollyMode"
        :style="`background: ${$vuetify.theme.themes.light.primary}`"
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
    enableScrollyMode: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    selectedIndicator() {
      return this.$store.state.indicators.selectedIndicator;
    },
    mapPosition() {
      const result = {};
      if (this.$route.query.lat && this.$route.query.lng) {
        result.centerProp = {
          lat: parseFloat(this.$route.query.lat, 10),
          lng: parseFloat(this.$route.query.lng, 10),
        };
      }
      if (this.$route.query.z) {
        result.zoomProp = parseFloat(this.$route.query.z, 10);
      }
      return result;
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
