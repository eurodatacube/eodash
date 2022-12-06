<template>
  <div
    class="fill-height d-flex flex-column"
    :style="{
      background: $vuetify.theme.currentTheme.background,
    }"
  >
    <v-row
      v-if="selectedIndicator"
      class="ma-0"
    >
      <v-col
        cols="12"
        class="pa-0"
      >
        <section
          id="filters"
          style="height: calc(var(--vh, 1vh) * 45)"
        >
          <FilterControls
            v-if="selectedIndicator.cogFilters"
            :cogFilters="selectedIndicator.cogFilters"
          >
          </FilterControls>
        </section>
        <section
          id="controls"
          style="height: calc(var(--vh, 1vh) * 5)"
        >
          <v-btn
            block
            text
            color="primary"
            class="mx-3"
            @click="showScatterplot = !showScatterplot"
          >
            Expand controls
            <v-icon
              right
              :style="`transform: rotate(${showScatterplot
                ? 90
                : 0}deg); transition: all .3s ease-in-out;`"
            >
                mdi-chevron-right
            </v-icon>
          </v-btn>

          <ScatterPlot
            v-if="selectedIndicator.cogFilters
              && selectedIndicator.cogFilters.sourceLayer === 'REP1'
              && showScatterplot"
            :filters="selectedIndicator.cogFilters.filters"
          >
          </ScatterPlot>

          <StyleControls
            v-if="selectedIndicator.vectorStyles"
            :vectorStyles="selectedIndicator.vectorStyles"
          >
          </StyleControls>
        </section>
        <section
          id="view"
          style="height: calc(var(--vh, 1vh) * 0)"
        >
          <DataMockupView
            :indicatorObject="selectedIndicator"
            :adminLayer="adminBorderLayerSelected"
            :adminFeature="adminBorderFeatureSelected"
          >
          </DataMockupView>
        </section>
        <section
          id="description"
          style="height: calc(var(--vh, 1vh) * 50;
          overflow: hidden"
        >
          <div
            class="fill-height scrollContainer"
          >
            <div
              v-html="description"
              class="md-body pa-5"
            />
          </div>
        </section>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import DataMockupView from '@/components/DataMockupView.vue';
import FilterControls from '@/components/map/FilterControls.vue';
import ScatterPlot from '@/components/ScatterPlot.vue';
import StyleControls from '@/components/map/StyleControls.vue';

export default {
  components: {
    DataMockupView,
    FilterControls,
    ScatterPlot,
    StyleControls,
  },
  data: () => ({
    showScatterplot: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('features', [
      'adminBorderFeatureSelected',
      'adminBorderLayerSelected',
    ]),
    ...mapState('indicators', [
      'selectedIndicator',
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
  }
}
</script>