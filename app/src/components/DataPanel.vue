<template>
  <div
    v-if="!$store.state.indicators.selectedIndicator"
    class="pa-7 pt-0 pb-0"
    :class="$vuetify.breakpoint.xsOnly && 'pb-10'"
    style="overflow: auto; height: 100%;"
  >
    <v-row class="mt-0 d-flex">
      <v-col
        cols="12"
      >
        <h1 class="display-3 primary--text mb-5 mt-0">COVID-19 Impact seen by Satellite</h1>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card outlined class="pa-5 text-center">
          <p>Indicator Datasets</p>
          <h2 class="primary--text display-3">{{ getIndicators.length }}</h2>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card outlined class="pa-5 text-center">
          <p>Measurements</p>
          <h2 class="primary--text display-3">{{ $store.state.features.resultsCount }}</h2>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card outlined class="pa-5 text-center">
          <p>Countries</p>
          <h2 class="primary--text display-3">{{ countryItems.length }}</h2>
        </v-card>
      </v-col>
    </v-row>
    <small>Latest measurement: {{ getLatestUpdate }}</small>
  </div>
  <div v-else>
    <v-container class="pt-0">
      <v-row>
        <v-col
          cols="12"
        >
          <v-card
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? (expanded ? 70 : 40) : 70}vh;`"
          >
            <indicator-map
              v-if="globalData"
              class="pt-0 fill-height"
            />
            <indicator-data
              v-else
              class="pa-5"
            />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          class="py-0 my-0"
        >
          <small v-if="indicatorObject && indicatorObject['Update Frequency']">
            This data is updated: {{ indicatorObject['Update Frequency'] }}
          </small>
        </v-col>
        <v-col
          cols="12"
        >
        <div>
            <expandable-content>
              <markdown-it-vue
                :content="story"
                class="md-body"
                :options="{ markdownIt: { html: true } }"
              />
            </expandable-content>
            <v-btn
              @click="dialog = true"
              color="primary"
              large
              block
              class="my-5"
            ><span><v-icon left>mdi-satellite-variant</v-icon>EO Data</span>
            </v-btn>
            <v-btn
              disabled
              color="primary"
              large
              block
              class="my-5"
            ><span><v-icon left>mdi-open-in-new</v-icon>Go to data source</span>
            </v-btn>
          </div>
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-toolbar dark color="primary">
              <v-toolbar-title >
                <span
                  v-if="indicatorObject && indicatorObject['EO Sensor']"
                >Reference Images as taken by sensor ({{indicatorObject['EO Sensor']}})</span>
                <span
                  v-else
                >Reference Images as taken by sensor</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          <IndicatorMap
            ref="referenceMap"
            :style="`height: calc(100% - ${$vuetify.application.top}px)`"
          />
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';

import ExpandableContent from '@/components/ExpandableContent.vue';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';
import MarkdownItVue from 'markdown-it-vue';

import 'markdown-it-vue/dist/markdown-it-vue.css';

export default {
  props: [
    'expanded',
  ],
  components: {
    ExpandableContent,
    IndicatorData,
    IndicatorMap,
    MarkdownItVue,
  },
  data: () => ({
    dialog: false,
  }),
  watch: {
    dialog(open) {
      if (open && this.$refs.referenceMap) {
        this.$refs.referenceMap.onResize();
        this.$refs.referenceMap.flyToBounds();
      }
    },
  },
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getLatestUpdate',
    ]),
    story() {
      let markdown;
      try {
        markdown = require(`../../public/eodash-data/stories/${this.indicatorObject['Indicator code']}.md`);
      } catch {
        markdown = { default: 'No indicator story provided yet.' };
      }
      return markdown.default;
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    globalData() {
      return this.indicatorObject.Country === 'all';
    },
    countryItems() {
      const countries = this.getCountries;
      return countries;
    },
  },
};
</script>
