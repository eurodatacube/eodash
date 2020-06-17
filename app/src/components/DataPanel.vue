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
              :disabled="!eodataEnabled"
            ><span><v-icon left>mdi-satellite-variant</v-icon>EO Data</span>
            <span v-if="!eodataEnabled">- Coming soon</span>
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
    overlay: false,
    dataInteract: false,
  }),
  watch: {
    dialog(open) {
      if (open && this.$refs.referenceMap) {
        this.$refs.referenceMap.onResize();
        setTimeout(() => {
          this.$refs.referenceMap.flyToBounds();
        }, 1);
      }
    },
  },
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getLatestUpdate',
    ]),
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    story() {
      let markdown;
      try {
        markdown = require(`../../public${this.appConfig.storyPath}${this.indicatorObject.AOI_ID}-${this.indicatorObject['Indicator code']}.md`);
      } catch {
        try {
          markdown = require(`../../public${this.baseConfig.indicatorsDefinition[this.indicatorObject['Indicator code']].story}.md`);
        } catch {
          markdown = { default: 'No indicator story provided yet.' };
        }
      }
      return this.$marked(markdown.default);
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    globalData() {
      return ['all', 'regional'].includes(this.indicatorObject.Country);
    },
    eodataEnabled() {
      const lastInputData = (this.indicatorObject && this.indicatorObject['Input Data']) ? this.indicatorObject['Input Data'][this.indicatorObject['Input Data'].length - 1] : null;
      // search configuration mapping if layer is configured
      return lastInputData ? this.layerNameMapping.hasOwnProperty(lastInputData) : false; // eslint-disable-line
    },
  },
  methods: {
    swipe() {
      this.overlay = true;
      setTimeout(() => { this.overlay = false; }, 2000);
    },
  },
};
</script>
