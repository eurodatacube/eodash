<template>
  <div
    class="fill-height d-flex flex-column"
    :style="{
      background: $vuetify.theme.currentTheme.background,
    }"
  >
    <v-row
      class="ma-0"
    >
      <v-col
        cols="12"
        class="pa-0"
      >
        <section
          id="header"
          style="height: calc(var(--vh, 1vh) * 8); padding-right: 100px"
        >
          <template
            v-if="selectedIndicator || firstIndicatorObject"
          >
            <p
              v-if="selectedIndicator"
            >
              {{ selectedIndicator.city }}: {{ selectedIndicator.indicatorName }}
            </p>
            <p v-else>
              {{ firstIndicatorObject.description }}
            </p>

            <p
              v-if="selectedIndicator
                && (selectedIndicator.indicatorName !== selectedIndicator.description)
                && customAreaIndicator === null"
            >
              {{ selectedIndicator.description }}
            </p>
            <p v-else-if="firstIndicatorObject.indicatorName !== firstIndicatorObject.description">
              {{ firstIndicatorObject.indicatorName }}
            </p>
          </template>
        </section>
      </v-col>
      <v-col
        :cols="expanded ? 6 : 12"
        class="pa-0"
      >
        <section
          id="chart"
          class="pa-5"
          :style="`height: calc(var(--vh, 1vh) * ${expanded ? 82 : 32}`"
        >
          <v-card
            class="fill-height"
          >
            <!-- <indicator-globe
              v-if="showGlobe"
              @update:direction="d => direction = d"
              @update:position="p => position = p"
              @update:right="r => right = r"
              @update:up="u => up = u"
              @update:datalayertime="d => datalayertime = d"
              @update:comparelayertime="c => comparelayertime = c"
              @compareEnabled="compareEnabled = !compareEnabled"
              class="d-flex justify-center"
              style="top: 0px; position: absolute;"
            /> -->
            <v-col
              v-if="mergedConfigsData.customAreaIndicator"
              class="d-flex flex-col align-center justify-center"
              style="flex-direction: column; height: 100%"
            >
              <v-icon color="secondary" width="32" height="32">mdi-analytics</v-icon>
              <p style="max-width: 75%; text-align: center">
Draw an area on the map using the shape buttons to generate a custom chart!
              </p>
              <v-btn
                class="mt-3"
                color="secondary"
                :loading="isLoadingCustomAreaIndicator"
                :disabled="!selectedArea"
                @click="generateChart"
              >
                Generate Chart
              </v-btn>
            </v-col>
            <v-col
              v-else-if="showMap"
              class="d-flex flex-col align-center justify-center"
              style="flex-direction: column; height: 100%"
            >
              <v-icon color="secondary" width="32" height="32">mdi-analytics</v-icon>
              <p style="max-width: 75%; text-align: center">
Browse the map to explore this indicator's data!
              </p>
            </v-col>
            <IndicatorData
              v-else-if="selectedIndicator || (customAreaIndicator && !customAreaIndicator.isEmpty)"
            />
            <v-col
              v-else
              class="d-flex flex-col align-center justify-center"
              style="flex-direction: column; height: 100%"
            >
              <v-icon color="secondary" width="32" height="32">mdi-analytics</v-icon>
              <p style="max-width: 75%; text-align: center">
Select a point of interest on the map to see the data for a specific location!
              </p>
            </v-col>
          </v-card>
        </section>
        <section
          id="tools"
          class="pa-5"
          style="height: calc(var(--vh, 1vh) * 10"
        >
          <v-card
            class="fill-height d-flex flex-column justify-center"
          >
            <div
              class="d-flex align-center pa-5"
            >
              <v-icon
                color="primary"
                small
              >
                mdi-tools
              </v-icon>
              <span>Tools</span>
              <v-spacer></v-spacer>
              <v-icon
                color="primary"
              >
                mdi-chevron-down
              </v-icon>
            </div>
          </v-card>
        </section>
      </v-col>
      <v-col
        :cols="expanded ? 6 : 12"
        class="pa-0"
      >
        <section
          id="description"
          :style="`height: calc(var(--vh, 1vh) * ${expanded ? 92 : 50};
          overflow: hidden`"
        >
          <div
            class="fill-height scrollContainer"
          >
            <div
              v-html="description"
              class="md-body pa-5"
            />
            <div
              class="pa-5 pt-0"
            >
              <v-btn
                v-if="selectedIndicator && externalData"
                :href= "externalData.url"
                target="_blank"
                color="primary"
                ref="externalDataBtn"
                large
                block
              >
                <v-icon left>mdi-open-in-new</v-icon>
                {{ externalData.label }}
              </v-btn>
            </div>
          </div>
        </section>
      </v-col>
    </v-row>
    <slot></slot>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex'
import IndicatorData from '@/components/IndicatorData.vue';
// import IndicatorGlobe from '@/components/IndicatorGlobe.vue';
import { createConfigFromIndicator } from '@/helpers/mapConfig';

export default {
  props: {
    expanded: Boolean,
  },
  components: {
    IndicatorData,
    // IndicatorGlobe,
  },
  data: () => ({
    isLoadingCustomAreaIndicator: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('indicators', [
      'customAreaIndicator',
      'selectedIndicator',
    ]),
    ...mapState('features', [
      'allFeatures',
      'featureFilters',
      'selectedArea',
    ]),
    description() {
      let markdown;
      try {
        markdown = require(`../../public${this.appConfig.storyPath}${this.getLocationCode(this.selectedIndicator)}.md`);
      } catch {
        try {
          markdown = require(`../../public${this.baseConfig.indicatorsDefinition[this.selectedIndicator.indicator].story}.md`);
        } catch {
          try {
            const indicator = Array.isArray(this.featureFilters.indicators)
              ? this.featureFilters.indicators[0]
              : this.featureFilters.indicators;
            markdown = require(`../../public${this.baseConfig.indicatorsDefinition[indicator].story}.md`);
          } catch {
            markdown = { default: '' };
          }
        }
      }
      return this.$marked(markdown.default);
    },
    displayIndicatorObject() {
      return this.selectedIndicator || this.firstIndicatorObject;
    },
    externalData() {
      const dataFromDefinition = this.baseConfig.indicatorsDefinition[
        this.selectedIndicator.indicator
      ].externalData;
      const dataFromIndicator = this.selectedIndicator.externalData;
      if (dataFromDefinition) {
        return dataFromDefinition;
      }
      if (dataFromIndicator) {
        return dataFromIndicator;
      }
      return null;
    },
    firstIndicatorObject() {
      // find the first indicatorObject for the current filtering
      const indicator = Array.isArray(this.featureFilters.indicators)
        ? this.featureFilters.indicators[0]
        : this.featureFilters.indicators;
      const firstFeature = this.allFeatures
        .find((f) => f.properties.indicatorObject.indicator
          === indicator);
      return firstFeature
        ? firstFeature.properties.indicatorObject
        : undefined;
    },
    mergedConfigsData() {
      if (!this.selectedIndicator) {
        return undefined;
      }
      return createConfigFromIndicator(
        this.selectedIndicator,
        'data',
        0,
      )[0];
    },
    // showGlobe() {
    //   return this.selectedIndicator.showGlobe;
    // },
    showMap() {
      // if returns true, we have map data and usually not a chart;
      // TODO move to a global check
      return ['all'].includes(this.selectedIndicator.country)
        || this.appConfig.configuredMapPois
          .includes(`${this.selectedIndicator.aoiID}-${this.selectedIndicator.indicator}`)
          || Array.isArray(this.selectedIndicator.country);
    },
    // TODO
    // showGlobe
    // gtif stuff
    // tools section
  },
  mounted() {
    // TODO: Extract fetchData method into helper file since it needs to be used from outside.
    window.addEventListener(
      'set-custom-area-indicator-loading',
      (e) => { this.isLoadingCustomAreaIndicator = e.detail; },
      false,
    );
  },
  methods: {
    generateChart() {
      // TODO: Extract fetchData method into helper file since it needs to be used from outside.
      window.dispatchEvent(new Event('fetch-custom-area-chart'));
    },
  }
}
</script>
