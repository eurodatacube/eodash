<template>
  <div class="fill-height pb-8">
    <v-tabs
      v-model="tab"
      :color="$vuetify.theme.themes.light.primary"
      icons-and-text
      grow
    >
      <v-tab ref="mapTab" @click="mapTabClick"
        style="width: 125px"
      >
        Map
        <v-icon>mdi-map-search</v-icon>
      </v-tab>
      <v-tab
        style="width: 125px"
      >
        Table
        <v-icon>mdi-table-search</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="tab"
      touchless
      class="fill-height pb-7"
    >
      <v-tab-item class="fill-height">
        <Map ref="map" />
        <v-menu v-if="globalIndicators && globalIndicators.length > 0"
          offset-y
          :value="openGlobalPanel"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              class="globalIndicators"
              color="primary"
              dark
            > <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-earth</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">Global Indicators</span>
          </v-btn>
          </template>
            <v-list dense>
             <v-list-item
               v-for="feature in globalIndicators"
               :key="getUniqueKey(feature.properties.indicatorObject)"
               class="line"
               style="cursor: pointer"
               @click="selectGlobal(feature)"
             >
              <v-list-item-icon
              class="d-flex align-center mr-0">
                <div
                  class="circle"
                  :style="`
                    border: 2px ${currentlySelected(feature)
                      ? 'dotted'
                      : 'solid'} white;
                    width: ${currentlySelected(feature) ? '28px' : '26px'};
                    height: ${currentlySelected(feature) ? '28px' : '26px'};`"
                >
                    <v-icon
                      color="white"
                      class="pa-1"
                      icon-url="/test"
                      small
                    >
                      {{ baseConfig.indicatorClassesIcons[baseConfig
                          .indicatorsDefinition[feature.properties.indicatorObject.indicator].class]
                          ? baseConfig.indicatorClassesIcons[baseConfig
                            .indicatorsDefinition[feature.properties.indicatorObject.indicator].class]
                          : 'mdi-lightbulb-on-outline'}}
                    </v-icon>
                </div>
              </v-list-item-icon>
             <v-list-item-content
              :class="currentlySelected(feature) && 'font-weight-bold'"
             >
              {{feature.properties.indicatorObject.indicatorName}}
              </v-list-item-content>
             </v-list-item>
            </v-list>
        </v-menu>
        <div
          style="position: absolute; left: 10px; bottom: 10px; z-index: 1;"
        >
          <v-scroll-y-transition>
            <v-chip
              v-if="$store.state.features.featureFilters.countries.length > 0"
              class="ma-0 mr-2"
              color="primary"
              text-color="white"
              close
              @click:close="resetCountry"
            >
              <v-icon small left>mdi-filter</v-icon>
              {{ countries.features
                  .find((c) => c.properties.alpha2 === $store.state.features
                    .featureFilters.countries).properties.name }}
            </v-chip>
          </v-scroll-y-transition>
          <v-scroll-y-transition>
            <v-chip
              v-if="$store.state.features.featureFilters.indicators.length > 0"
              class="ma-0"
              :class="$vuetify.breakpoint.xsOnly && 'mt-1'"
              color="primary"
              text-color="white"
              close
              @click:close="resetIndicator"
            >
              <v-icon small left>mdi-filter</v-icon>
              {{ getIndicators
                  .find((i) => i.code === $store.state.features.featureFilters.indicators[0])
              && getIndicators
              .find((i) => i.code ===
                $store.state.features.featureFilters.indicators[0]).indicator }}
            </v-chip>
          </v-scroll-y-transition>
        </div>
      </v-tab-item>
      <v-tab-item
        class="fill-height"
        style="overflow: auto"
      >
        <feature-table
          style="height: auto"
        />
        <div
          style="position: absolute; left: 10px; bottom: 10px; z-index: 1;"
        >
          <v-scroll-y-transition>
            <v-chip
              v-if="$store.state.features.featureFilters.countries.length > 0"
              class="ma-0 mr-2"
              color="primary"
              text-color="white"
              close
              @click:close="resetCountry"
            >
              <v-icon small left>mdi-filter</v-icon>
              {{ countries.features
                  .find((c) => c.properties.alpha2 === $store.state.features
                    .featureFilters.countries).properties.name }}
            </v-chip>
          </v-scroll-y-transition>
          <v-scroll-y-transition>
            <v-chip
              v-if="$store.state.features.featureFilters.indicators.length > 0"
              class="ma-0"
              :class="$vuetify.breakpoint.xsOnly && 'mt-1'"
              color="primary"
              text-color="white"
              close
              @click:close="resetIndicator"
            >
              <v-icon small left>mdi-filter</v-icon>
              {{ getIndicators
                  .find((i) => i.code === $store.state.features.featureFilters.indicators[0])
              && getIndicators
              .find((i) => i.code ===
                $store.state.features.featureFilters.indicators[0]).indicator }}
            </v-chip>
          </v-scroll-y-transition>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// Utilities
import {
  mapGetters,
  mapState,
} from 'vuex';

import FeatureTable from '@/components/FeatureTable.vue';
import Map from '@/components/Map.vue';

import countries from '@/assets/countries.json';

export default {
  components: {
    FeatureTable,
    Map,
  },
  data: () => ({
    tab: null,
    openGlobalPanel: false,
  }),
  computed: {
    ...mapGetters('features', [
      'getFeatures',
      'getGroupedFeatures',
      'getIndicators',
    ]),
    ...mapState('config', ['baseConfig']),
    countries() {
      return countries;
    },
    globalIndicators() {
      return this.getGroupedFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject.siteName));
    },
    someGlobalIndicator() {
      return this.globalIndicators
        .filter((i) => this.$store.state.features.featureFilters.indicators
          .includes(i.properties.indicatorObject.indicator));
    },
  },
  methods: {
    selectGlobal(feature) {
      this.$store.commit(
        'indicators/SET_SELECTED_INDICATOR',
        this.$store.state.features.allFeatures
          .find((f) => f.properties
            .indicatorObject.indicator === feature.properties.indicatorObject.indicator
          && f.properties
            .indicatorObject.aoiID === feature.properties.indicatorObject.aoiID)
          .properties.indicatorObject,
      );
    },
    mapTabClick() {
      this.$refs.map.onResize();
    },
    resetCountry() {
      this.$store.commit('features/SET_FEATURE_FILTER', { countries: [] });
    },
    resetIndicator() {
      this.$store.commit('features/SET_FEATURE_FILTER', { indicators: [] });
    },
    getUniqueKey(indicatorObject) {
      return this.getLocationCode(indicatorObject);
    },
    currentlySelected(feature) {
      return this.$store.state.indicators.selectedIndicator
        && this.$store.state.indicators.selectedIndicator.indicator
          === feature.properties.indicatorObject.indicator
        && this.$store.state.indicators.selectedIndicator.aoiID
          === feature.properties.indicatorObject.aoiID;
    },
  },
  watch: {
    someGlobalIndicator() {
      this.openGlobalPanel = false;
      setTimeout(() => {
        this.openGlobalPanel = this.someGlobalIndicator.length > 0;
      }, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.globalIndicators {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--v-primary-base);
  box-sizing: content-box;
  margin-right: 4px;
  cursor: pointer;
}
</style>
