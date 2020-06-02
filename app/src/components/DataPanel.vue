<template>
  <div style="height: auto;"
    :style="$vuetify.breakpoint.mdAndDown && 'padding-bottom: 100px'"
  >
    <v-container class="pt-0">
      <v-row>
        <v-col
          cols="12"
        >
          <v-card
            class="fill-height"
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? (expanded ? 70 : 40) : 60}vh;`"
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
              <div
                v-html="story"
                class="md-body"
              ></div>
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
              v-if="indicatorObject && baseConfig
                .indicatorsDefinition[indicatorObject['Indicator code']].externalData"
              :href= "baseConfig
                .indicatorsDefinition[indicatorObject['Indicator code']].externalData.url"
              target="_blank"
              color="primary"
              large
              block
              class="my-5"
            ><span><v-icon left>mdi-open-in-new</v-icon>{{baseConfig
                .indicatorsDefinition[indicatorObject['Indicator code']].externalData.label}}</span>
            </v-btn>
            <v-btn
              v-else
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
                >Reference Images</span>
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
  mapState,
} from 'vuex';

import marked from 'marked';
import ExpandableContent from '@/components/ExpandableContent.vue';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';

export default {
  props: [
    'expanded',
  ],
  components: {
    ExpandableContent,
    IndicatorData,
    IndicatorMap,
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
    ...mapState('config', ['appConfig']),
    ...mapState('config', ['baseConfig']),
    story() {
      let markdown;
      try {
        markdown = require(`../../public/eodash-data/stories/${this.indicatorObject['Indicator code']}.md`);
      } catch {
        markdown = { default: 'No indicator story provided yet.' };
      }
      return marked(markdown.default);
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    globalData() {
      return ['all', 'regional'].includes(this.indicatorObject.Country);
    },
    countryItemsCount() {
      const countries = this.getCountries.filter((item) => !['all', 'regional'].includes(item));
      return countries.length;
    },
  },
};
</script>
