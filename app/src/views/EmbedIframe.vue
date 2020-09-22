<template>
  <div class="fill-height pa-1" style="background: transparent">
    <v-card
      v-if="$store.state.indicators.selectedIndicator"
      class="fill-height elevation-3 d-flex flex-column"
      style="background: white;"
    >
      <v-card-title v-if="$store.state.indicators.selectedIndicator"
        :class="$store.state.indicators.selectedIndicator.description ===
          $store.state.indicators.selectedIndicator.indicatorName && 'preventEllipsis'"
        color="primary"
        class="flex-grow-0"
      >
        {{ $store.state.indicators.selectedIndicator.city }},
        {{ $store.state.indicators.selectedIndicator.description }}
      </v-card-title>
      <v-card-subtitle v-if="
        $store.state.indicators.selectedIndicator.description !==
        $store.state.indicators.selectedIndicator.indicatorName"
        class="subheading pb-1 flex-grow-0" style="font-size: 0.8em">
        {{ $store.state.indicators.selectedIndicator.indicatorName }}
      </v-card-subtitle>
      <div>
        <v-tabs
          v-if="multipleProviderCompare.length > 1"
          v-model="selectedProviderTab"
          grow
        >
          <v-tab
            v-for="providerData in multipleProviderCompare"
            :key="providerData.properties.indicatorObject.dataProvider"
            :href="`#${providerData.properties.indicatorObject.dataProvider}`"
          >
            <div
              class="d-flex align-center justify-center"
            >
              <img
                :src="appConfig.providerIcons[providerData.properties.indicatorObject.dataProvider]"
                style="height: 28px; position: absolute"
              />
            </div>
          </v-tab>
        </v-tabs>
      </div>
      <div
        v-if="indicatorObject"
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
          This data is updated: {{ indicatorObject.updateFrequency }}
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
  mapGetters,
  mapState,
} from 'vuex';

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
    selectedProviderTab: null,
    setProviderTab: false,
  }),
  computed: {
    ...mapGetters('features', [
      'getFeatures',
    ]),
    ...mapState('config', ['appConfig']),
    globalData() {
      return ['all'].includes(this.indicatorObject.country) || Array.isArray(this.indicatorObject.country);
    },
    indicatorObject() {
      let indicatorObject;
      if (this.multipleProviderCompare.length > 1) {
        const feature = this.multipleProviderCompare.find(p => p.properties.indicatorObject.dataProvider === this.selectedProviderTab);
        indicatorObject = feature && feature.properties.indicatorObject;
      } else {
        indicatorObject = this.$store.state.indicators.selectedIndicator;
      }
      return indicatorObject;
    },
    multipleProviderCompare() {
      const selectedIndicator = this.$store.state.indicators.selectedIndicator;
      return this.getFeatures.filter((f) => {
        return f.properties.indicatorObject.aoiID === selectedIndicator.aoiID && f.properties.indicatorObject.indicator === selectedIndicator.indicator;
      }).reverse();
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
  watch: {
    multipleProviderCompare() {
      if (!this.setProviderTab) {
        this.selectedProviderTab = this.$route.query.provider || this.multipleProviderCompare[0].properties.indicatorObject.dataProvider;
        this.setProviderTab = true;
      }
    },
    selectedProviderTab(provider) {
      this.$store.commit(
        'indicators/SET_SELECTED_INDICATOR',
        this.multipleProviderCompare.find(p => p.properties.indicatorObject.dataProvider === provider)
          .properties.indicatorObject);
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
