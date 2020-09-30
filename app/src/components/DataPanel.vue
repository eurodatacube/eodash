<template>
  <div style="height: auto;"
    :style="$vuetify.breakpoint.mdAndDown && 'padding-bottom: 100px'"
  >
    <v-container class="pt-0">
      <v-row v-if="indicatorObject">
        <v-col
          cols="12"
        >
          <v-tabs
            v-if="multipleSensorCompare.length > 1"
            v-model="selectedSensorTab"
            grow
          >
            <v-tab
              v-for="sensorData in multipleSensorCompare"
              :key="sensorData.properties.indicatorObject.eoSensor"
              :class="multipleSensorCompare.indexOf(sensorData) == selectedSensorTab
                ? 'primary white--text'
                : ''"
            >
              {{ sensorData.properties.indicatorObject.eoSensor }}
            </v-tab>
          </v-tabs>
          <v-tabs-items
            v-if="multipleSensorCompare.length > 1"
            v-model="selectedSensorTab"
          >
            <v-tab-item
              v-for="sensorData in multipleSensorCompare"
              :key="sensorData.properties.indicatorObject.eoSensor"
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
                  :currentIndicator="sensorData.properties.indicatorObject"
                />
                <indicator-data
                  style="top: 0px; position: absolute;"
                  v-else
                  class="pa-5"
                />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <v-card
            v-else
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
          class="py-0 my-0 d-flex justify-space-between"
        >
          <small v-if="indicatorObject && indicatorObject.updateFrequency">
            <span v-if="indicatorObject.updateFrequency === 'Retired'">This indicator is no longer updated</span>
            <span v-else-if="indicatorObject.updateFrequency === 'EndSeason'">Due to end of season, this indicator is no longer updated</span>
            <span v-else>This data is updated: {{ indicatorObject.updateFrequency }}</span>
          </small>
          <small v-else> </small>
          <v-dialog
            v-model="iframeDialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                text
                x-small
                v-bind="attrs"
                @click="copySuccess = false"
                v-on="on"
              >
                <v-icon left>mdi-poll-box</v-icon>
                embed chart
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline primary white--text">
                Embed this chart into your website
              </v-card-title>

              <v-card-text class="py-5">
                Copy and paste this code into your HTML file:
                <code class="pa-3">{{ iframeCode }}
                </code>
                <div class="d-flex align-center justify-end pt-3">
                  <v-expand-transition>
                    <div v-if="copySuccess" class="success--text mr-3">
                    <v-icon
                      color="success"
                      left
                    >mdi-clipboard-check-outline</v-icon>
                      <small>copied!</small>
                    </div>
                  </v-expand-transition>
                  <v-btn
                    small
                    text
                    @click="copy(iframeCode)"
                  >
                    <v-icon left>mdi-content-copy</v-icon>
                    copy to clipboard
                  </v-btn>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="iframeDialog = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
              v-if="eodataEnabled"
              @click="dialog = true"
              color="primary"
              large
              block
              class="my-5"
            ><span><v-icon left>mdi-satellite-variant</v-icon>EO Data</span>
            </v-btn>
            <v-btn
              v-if="indicatorObject && externalData"
              :href= "externalData.url"
              target="_blank"
              color="primary"
              large
              block
              class="my-5"
            ><span><v-icon left>mdi-open-in-new</v-icon>{{externalData.label}}</span>
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
    iframeDialog: false,
    copySuccess: false,
    selectedSensorTab: 0,
  }),
  watch: {
    dialog(open) {
      if (open && this.$refs.referenceMap) {
        this.$refs.referenceMap.onResize();
        setTimeout(() => {
          this.$refs.referenceMap.flyToBounds();
        }, 200);
      }
    },
  },
  computed: {
    ...mapGetters('features', [
      'getFeatures',
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
        markdown = require(`../../public${this.appConfig.storyPath}${this.getLocationCode(this.indicatorObject)}.md`);
      } catch {
        try {
          markdown = require(`../../public${this.baseConfig.indicatorsDefinition[this.indicatorObject.indicator].story}.md`);
        } catch {
          markdown = { default: '' };
        }
      }
      return this.$marked(markdown.default);
    },
    iframeCode() {
      return `<iframe class="item" src="${window.location.origin}/iframe?poi=${this.getLocationCode(this.indicatorObject)}${this.$route.query.sensor ? `&sensor=${this.$route.query.sensor}` : ''}" width="800px" height="500px" frameBorder="0" scroll="no" style="overflow:hidden"></iframe>`;
    },
    indicatorObject() {
      let indicatorObject;
      if (this.multipleSensorCompare.length > 1) {
        const feature = this.multipleSensorCompare[0];
        indicatorObject = feature && feature.properties.indicatorObject;
      } else {
        indicatorObject = this.$store.state.indicators.selectedIndicator;
      }
      return indicatorObject;
    },
    multipleSensorCompare() {
      const selectedIndicator = this.$store.state.indicators.selectedIndicator;
      return this.getFeatures.filter((f) => {
        return f.properties.indicatorObject.aoiID === selectedIndicator.aoiID && f.properties.indicatorObject.indicator === selectedIndicator.indicator;
      }).reverse();
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    globalData() {
      return ['all'].includes(this.indicatorObject.country) || Array.isArray(this.indicatorObject.country);
    },
    externalData() {
      const dataFromDefinition = this.baseConfig.indicatorsDefinition[
        this.indicatorObject.indicator
      ].externalData;
      const dataFromIndicator = this.indicatorObject.externalData;
      if (dataFromDefinition) {
        return dataFromDefinition;
      }
      if (dataFromIndicator) {
        return dataFromIndicator;
      }
      return null;
    },
    eodataEnabled() {
      const lastInputData = (this.indicatorObject && this.indicatorObject.inputData)
        ? this.indicatorObject.inputData[this.indicatorObject.inputData.length - 1] : null;
      // search configuration mapping if layer is configured
      return lastInputData ? this.layerNameMapping.hasOwnProperty(lastInputData) : false; // eslint-disable-line
    },
  },
  mounted() {
    this.selectedSensorTab = this.multipleSensorCompare
      .indexOf(this.multipleSensorCompare.find(s => s.properties.indicatorObject.eoSensor === this.$route.query.sensor))
    || 0;
  },
  methods: {
    async copy(s) {
      await navigator.clipboard.writeText(s);
      this.copySuccess = true;
    },
    swipe() {
      this.overlay = true;
      setTimeout(() => { this.overlay = false; }, 2000);
    },
  },
  watch: {
    selectedSensorTab(index) {
      if (this.multipleSensorCompare[index]) {
        const sensor = this.multipleSensorCompare[index].properties.indicatorObject.eoSensor;
        this.$router.replace({ query: { ...this.$route.query, sensor } }).catch(()=>{});
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          this.multipleSensorCompare[index].properties.indicatorObject,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-slide-group__prev {
  display: none !important;
}
</style>