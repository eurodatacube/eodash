<template>
  <div class="fill-height pb-8">
    <v-tabs
      v-model="tab"
      :color="$vuetify.theme.themes.light.primary"
      grow
      icons-and-text
    >
      <v-tab ref="mapTab" @click="mapTabClick"
      >
        Map
        <v-icon>mdi-map-search</v-icon>
      </v-tab>
      <v-tab
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
               :key="feature['Indicator code']"
               class="line"
               style="cursor: pointer"
               @click="selectGlobal(feature.properties
                 .indicatorObject['Indicator code'])"
             >
              <v-list-item-icon
              class="d-flex align-center mr-0">
                <div class="circle"
                  :style="
                  $store.state.indicators.selectedIndicator &&
                  $store.state.indicators.selectedIndicator['Indicator code']
                  === feature.properties.indicatorObject['Indicator code']
                  ? { 'border': `2px dashed ${$vuetify.theme.themes.light.primary}` }
                  : {}"
                >
                </div>
              </v-list-item-icon>
             <v-list-item-content>
              {{feature.properties.indicatorObject.Description}}
              </v-list-item-content>
             </v-list-item>
            </v-list>
        </v-menu>
      </v-tab-item>
      <v-tab-item
        class="fill-height"
        style="overflow: auto"
      >
        <feature-table
          style="height: auto"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// Utilities
import {
  mapGetters,
} from 'vuex';

import FeatureTable from '@/components/FeatureTable.vue';
import Map from '@/components/Map.vue';

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
    ]),
    globalIndicators() {
      return this.getFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject['Site Name']));
    },
    someGlobalIndicator() {
      return this.globalIndicators
        .filter((i) => this.$store.state.features.featureFilters.indicators
          .includes(i.properties.indicatorObject['Indicator code']));
    },
  },
  methods: {
    selectGlobal(indicatorCode) {
      this.$store.commit(
        'indicators/SET_SELECTED_INDICATOR',
        this.$store.state.features.allFeatures
          .find((f) => f.properties
            .indicatorObject['Indicator code'] === indicatorCode)
          .properties.indicatorObject,
      );
    },
    mapTabClick() {
      this.$refs.map.onResize();
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
  width: 14px;
  height: 14px;
  background: var(--v-info-base);
  border: 2px solid white;
  box-sizing: content-box;
  border-radius: 50%;
  margin-right: 2px;
  cursor: pointer;
}
</style>
