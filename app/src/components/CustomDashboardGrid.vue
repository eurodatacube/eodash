<template>
  <loading-animation v-if="features.length === 0" style="height: 400px" />
  <v-row
    v-else
    id="elementsContainer"
    v-scroll:#scroll-target="onScroll"
  >
    <template v-for="(element, index) in features">
      <v-col v-if="!element.indicatorObject && !element.text" :key="index" cols="12">
        Error: {{ element }}
      </v-col>
      <v-col
        v-else-if="!($vuetify.breakpoint.xsOnly && !!element.text)"
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        style="position: relative;"
        :class="$vuetify.breakpoint.xsOnly ? 'px-0' : ''"
      >
        <div
          class="d-flex flex-column"
          :style="`height: ${storyMode ? 'calc((var(--vh, 1vh) * 100) - 140px)' : '500px'}`"
        >
          <div
            class="d-flex align-center"
          >
            <span
              v-if="element.title" @click="redirectToPoi(element.indicatorObject)"
              style="cursor: pointer">
              {{ element.title }}
            </span>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="enableEditing"
                  icon
                  small
                  v-on="on"
                  @click="featureTitle = element.title; featurePOI = element.poi; dialog = true"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit element title</span>
            </v-tooltip>
          </div>
          <v-card
            class="pa-0 flex-grow-1 elementCard"
            outlined
            tile
          >
            <div
              v-if="features[index + 1] && features[index + 1].text
                && $vuetify.breakpoint.xsOnly && !showText"
              class="fill-height"
              :style="`position: absolute; width: 100%;
                box-shadow: ${$vuetify.theme.dark ? '#363636' : 'white'} 0px -80px 30px -35px inset;
                z-index: 3; pointer-events: none;`"
            >
            </div>
            <div
              :style="`position: relative; height: ${($vuetify.breakpoint.xsOnly
              && features[index + 1]
              && features[index + 1].text)
                ? '60%'
                : '100%'}`"
            >
              <div
                v-if="element.text"
                class="textAreaContainer"
              >
                <div
                  class="pa-5 textArea"
                  v-html="convertToMarkdown(element.text)"
                ></div>
              </div>
              <indicator-map
                ref="indicatorMap"
                style="top: 0px; position: absolute;"
                v-else-if="(['all'].includes(element.indicatorObject.country) ||
                appConfig.configuredMapPois.includes(
                  `${element.indicatorObject.aoiID}-${element.indicatorObject.indicator}`
                ) ||
                Array.isArray(element.indicatorObject.country)) && !element.includesIndicator"
                class="pt-0 fill-height"
                :hideCustomAreaControls="!enableEditing"
                :currentIndicator="element.indicatorObject"
                :centerProp="localCenter[element.poi]"
                :zoomProp="localZoom[element.poi]"
                @update:center="c => {localCenter[element.poi] = c}"
                @update:zoom="z => {localZoom[element.poi] = z}"
                @ready="onMapReady(element.poi)"
              />
              <indicator-data
                style="top: 0px; position: absolute;"
                v-else
                class="pa-5 chart"
                :currentIndicator="element.indicatorObject"
              />
            </div>
            <template
              v-if="$vuetify.breakpoint.xsOnly && features[index + 1] && features[index + 1].text"
            >
              <div
                class="mobilePaddingBottom"
                style="height: calc(var(--vh, 1vh) * 40)"
              >
              </div>
              <v-navigation-drawer
                v-model="showText"
                absolute
                bottom
                temporary
                style="z-index: 1; max-height: 100%;"
                v-touch="{
                  up: () => startFullScreenInteraction(`#textAreaContainer-${index}`),
                  down: () => endFullScreenInteraction(`#textAreaContainer-${index}`),
                }"
              >
                <div
                  :id="`textAreaContainer-${index}`"
                  class="textAreaContainer fill-height"
                  :style="!showText ? 'overflow-y: hidden' : ''"
                >
                  <v-btn
                    icon
                    dark
                    absolute
                    class="ma-2"
                    style="right: 0"
                    @click="showText = !showText"
                  >
                    <v-icon>{{  showText ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                  </v-btn>
                  <div
                    class="pa-5 textArea"
                    v-html="convertToMarkdown(features[index + 1].text)"
                  ></div>
                </div>
              </v-navigation-drawer>
            </template>
          </v-card>
          <template v-if="enableEditing">
            <div class="buttonContainer containerRight containerTop">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="my-2"
                    :style="`background: var(--v-background-base);
                            ${element.width > 1 ? '' : 'visibility: hidden'}`"
                    fab
                    outlined
                    x-small
                    color="primary"
                    v-on="on"
                    @click="performChange('resizeFeatureShrink', element)"
                  >
                    <v-icon dark>
                      mdi-arrow-collapse
                    </v-icon>
                  </v-btn>
                </template>
                <span>Shrink element</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="my-2"
                    :style="`background: var(--v-background-base);
                            ${element.width < 4 ? '' : 'visibility: hidden'}`"
                    fab
                    outlined
                    x-small
                    color="primary"
                    v-on="on"
                    @click="performChange('resizeFeatureExpand', element)"
                  >
                    <v-icon dark>
                      mdi-arrow-expand
                    </v-icon>
                  </v-btn>
                </template>
                <span>Expand element</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="my-2"
                    fab
                    dark
                    x-small
                    color="error"
                    v-on="on"
                    @click="performChange('removeFeature', element)"
                  >
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Delete element</span>
              </v-tooltip>
              <v-tooltip v-if="showTooltip(element) || element.text" left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="my-2"
                    fab
                    outlined
                    x-small
                    color="primary"
                    style="background: var(--v-background-base)"
                    @click="update(element)"
                  >
                    <v-icon v-if="element.mapInfo" dark>
                      mdi-map-outline
                    </v-icon>
                    <v-icon v-if="element.text" dark>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                <span v-if="element.mapInfo && showTooltip(element)">Save map position</span>
                <span v-if="element.text">Update text</span>
              </v-tooltip>
            </div>
            <div class="buttonContainer containerRight containerBottom">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :style="index > 0 ? '' : 'visibility: hidden'"
                    class="my-2"
                    fab
                    dark
                    x-small
                    color="primary"
                    v-on="on"
                    @click="performChange('moveFeatureUp', element)"
                  >
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                </template>
                <span>Move element left</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :style="index < features.length - 1 ? '' : 'visibility: hidden'"
                    class="my-2"
                    fab
                    dark
                    x-small
                    color="primary"
                    v-on="on"
                    @click="performChange('moveFeatureDown', element)"
                  >
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </template>
                <span>Move element right</span>
              </v-tooltip>
            </div>
          </template>
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <v-card>
              <v-card-title class="headline primary--text mb-5">
                Title for dashboard element
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="changeFeatureTitleFn(featurePOI, featureTitle)">
                  <v-text-field
                    placeholder="Title"
                    outlined
                    autofocus
                    v-model="featureTitle"
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="dialog = false"
                >
                  cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="changeFeatureTitleFn(featurePOI, featureTitle)"
                  :disabled="!featureTitle.length"
                >
                  change
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </template>
    <div
      v-if="$vuetify.breakpoint.xsOnly && navigationButtonVisible"
      class="white--text d-flex align-center pa-7"
      :style="`position: fixed; bottom: 0; left: 0; width: 100%; height: 60px; z-index: 6;
      background: ${
        getCurrentTheme ? getCurrentTheme.color : 'var(--v-secondary-base)'
      }`"
      v-touch="{
        left: () => goStep(1),
        right: () => goStep(-1),
      }"
    >
      <small style="width: 60%">
        {{ dashboardMeta.title }}
      </small>
    </div>
    <v-fab-transition
      v-if="storyMode"
    >
      <div
        v-if="navigationButtonVisible"
        class="d-flex align-center"
        :style="`position: fixed; border-radius: 30px; z-index: 7; ${
          $vuetify.breakpoint.smAndUp
            ? 'bottom: 67px; right: 25px;'
            : 'bottom: 6px; right: 9px;'
          }; background: ${themeColor ? themeColor : 'var(--v-secondary-base)'}`"
        v-touch="{
          left: () => goStep(1),
          right: () => goStep(-1),
        }"
      >
        <v-btn
          fab
          icon
          small
          :dark="$vuetify.theme.dark ? false : true"
          class="ma-1"
          @click="goStep(-1)"
        >
          <v-icon>{{ currentRow === 1 ? 'mdi-home' : 'mdi-arrow-left' }}</v-icon>
        </v-btn>
        <span class="white--text">{{ currentRow }} / {{ numberOfRows }}</span>
        <v-btn
          fab
          icon
          small
          :dark="$vuetify.theme.dark ? false : true"
          :disabled="currentRow === numberOfRows"
          class="ma-1"
          @click="goStep(+1)"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-fab-transition>
  </v-row>
</template>

<script>
import { DateTime } from 'luxon';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import { loadIndicatorData } from '@/utils';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  props: {
    enableEditing: Boolean,
    popupOpen: Boolean,
    storyMode: Boolean,
    localFeatures: Array,
    dashboardMeta: Object,
    themeColor: String,
  },
  components: {
    IndicatorData,
    IndicatorMap,
    LoadingAnimation,
  },
  data: () => ({
    features: [],
    dialog: false,
    featureTitle: '',
    featurePOI: null,
    localZoom: {},
    localCenter: {},
    serverZoom: {},
    serverCenter: {},
    enableCompare: {},
    savedPoi: null,
    offsetTop: 0,
    showText: false,
  }),
  computed: {
    ...mapGetters('dashboard', {
      vuexFeatures: 'features',
    }),
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapGetters('themes', [
      'getCurrentTheme',
    ]),
    showTooltip() {
      return (element) => {
        if (this.localCenter[element.poi] && this.serverCenter[element.poi]) {
          if (this.localCenter[element.poi].lat !== this.serverCenter[element.poi].lat) {
            return true;
          }
          if (this.localCenter[element.poi].lng !== this.serverCenter[element.poi].lng) {
            return true;
          }
          if (this.localZoom[element.poi] !== this.serverZoom[element.poi]) {
            return true;
          }
        }
        return false;
      };
    },
    navigationButtonVisible() {
      return this.offsetTop >= document.querySelector('#headerRow').clientHeight;
    },
    numberOfRows() {
      let noOfRows;
      if (this.navigationButtonVisible) {
        const container = document.querySelector('#elementsContainer').clientHeight;
        const row = document.querySelector('.elementCard').clientHeight;
        noOfRows = Math.round(container / row);
      }
      return noOfRows;
    },
    currentRow() {
      let currentRow;
      if (this.numberOfRows) {
        currentRow = Math.round((this.offsetTop - document.querySelector('#headerRow').clientHeight)
          / document.querySelector('.elementCard').clientHeight) + 1;
      }
      return currentRow;
    },
  },
  watch: {
    vuexFeatures: {
      immediate: true,
      deep: true,
      handler(features) {
        if (features) {
          this.parseFeatures(features);
        }
      },
    },
    localFeatures: {
      immediate: true,
      deep: true,
      handler(features) {
        if (features) {
          this.parseFeatures(features);
        }
      },
    },
  },
  methods: {
    ...mapActions('dashboard', [
      'removeFeature',
      'addMarketingInfo',
      'resizeFeatureShrink',
      'resizeFeatureExpand',
      'moveFeatureUp',
      'moveFeatureDown',
      'changeFeatureMapInfo',
      'changeFeatureTitle',
    ]),
    onMapReady(poi) {
      setTimeout(() => {
        this.localCenter[poi].lat = this.serverCenter[poi].lat;
        this.localCenter[poi].lng = this.serverCenter[poi].lng;
        this.localZoom[poi] = this.serverZoom[poi];
      }, 1000);
    },
    update(el) { // eslint-disable-line
      if (el.mapInfo) {
        this.savedPoi = el.poi;

        return this.performChange(
          'changeFeatureMapInfo',
          {
            poi: el.poi,
            zoom: this.localZoom[el.poi],
            center: this.localCenter[el.poi],
          },
        );
      }
      // TODO: Should we make sure something is returned here?
      if (el.text) this.$emit('updateTextFeature', el);
    },
    redirectToPoi(indicatorObject) {
      this.$router.push(`/?poi=${this.getLocationCode(indicatorObject)}`);
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
    },
    changeFeatureTitleFn(poi, newTitle) {
      this.dialog = false;
      this.performChange(
        'changeFeatureTitle',
        { poi, newTitle },
      );
    },
    convertToMarkdown(text) {
      return this.$marked(text);
    },
    async performChange(method, params) {
      this.$emit('change');
      const changed = await this[method](params);
      if (changed !== undefined) {
        this.$emit('save');
      }
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    goStep(direction) {
      let position;
      if (this.currentRow === 1 && direction === -1) {
        position = 0; // scroll back to story intro
      } else {
        const rowPadding = 50;
        const startingPoint = document.querySelector('#elementsContainer').offsetTop;
        const rowHeight = document.querySelector('.elementCard').clientHeight + rowPadding;
        const target = rowHeight * (this.currentRow - 1 + direction);
        position = startingPoint + target;
      }
      this.$emit('scrollTo', { target: position });
    },
    async parseFeatures(features) {
      // check if this.serverZoom is empty
      // (meaning it's the first call that must go through every time)
      let firstCall = false;
      if (Object.keys(this.serverZoom).length === 0) {
        firstCall = true;
      }
      this.features = await Promise.all(features.map(async (f) => {
        if (f.includesIndicator) {
          const convertedTimes = f.indicatorObject.time.map(
            (d) => (DateTime.isDateTime(d) ? d : DateTime.fromISO(d)),
          );
          return {
            ...f,
            indicatorObject: {
              ...f.indicatorObject,
              time: convertedTimes,
            },
          };
        }

        if (f.text) {
          return f;
        }

        const feature = this.$store.state.features.allFeatures
          .find((i) => this.getLocationCode(i.properties.indicatorObject) === f.poi);
        const indicatorObject = await loadIndicatorData(
          this.baseConfig,
          feature.properties.indicatorObject,
        );

        if (f.mapInfo && (firstCall || f.poi === this.savedPoi)) {
          this.$set(this.localZoom, f.poi, f.mapInfo.zoom);
          this.$set(this.localCenter, f.poi, f.mapInfo.center);
          this.$set(this.serverZoom, f.poi, f.mapInfo.zoom);
          this.$set(this.serverCenter, f.poi, f.mapInfo.center);
        }

        return {
          ...f,
          indicatorObject,
        };
      }));
    },
    startFullScreenInteraction(selector) {
      if (document.querySelector(selector).scrollTop === 0) {
        this.showText = true;
      }
    },
    endFullScreenInteraction(selector) {
      if (document.querySelector(selector).scrollTop === 0) {
        this.showText = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.containerRight {
  right: -3px;
}
.containerLeft {
  left: -3px;
}
.containerTop {
  top: 20%;
}
.containerBottom {
  bottom: 10%;
}
.chart {
  background: #fff;
}
::v-deep .textArea img, ::v-deep .textArea video, ::v-deep .textArea iframe {
  max-width: 100%;
}
.elementCard {
  overflow: hidden;
}
.textAreaContainer {
  overflow-y: auto;
  height: 100%;
}
::v-deep .v-navigation-drawer--open {
  transform: translateY(0%) !important;
}
::v-deep .v-navigation-drawer--close {
  visibility: visible;
  transform: translateY(60%) !important;
}
</style>
