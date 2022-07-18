<template>
  <loading-animation v-if="features.length === 0" style="height: 400px" />
  <v-row
    v-else
    id="elementsContainer"
    v-scroll:#scroll-target="onScroll"
    :class="storyMode ? 'ma-0' : ''"
  >
    <template v-for="(element, index) in features">
      <v-col v-if="!element.indicatorObject && !element.text" :key="index" cols="12">
        Error: {{ element }}
      </v-col>
      <v-col
        v-else
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        :style="`position: relative;
          z-index: ${element.text && `#textAreaContainer-${index}` === showTextCurrent ? 2 : 1}`"
        :class="storyMode ? 'px-0 py-0' : ''"
      >
        <div
          class="d-flex flex-column"
          :style="`height: ${storyMode
            ? `calc(var(--vh, 1vh) * ${$vuetify.breakpoint.smAndDown
              ? getElementHeight(element.width)
              : 100})`
            : '500px'}`"
        >
          <div
            v-if="!storyMode"
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
            :class="element.text && storyMode
              && `#textAreaContainer-${index}` === showTextCurrent ? 'hasOverflow' : 'noOverflow'"
            :style="$vuetify.breakpoint.smAndUp
              ? 'overflow: auto !important' : ''"
            :outlined="!storyMode"
            tile
          >
            <div
              class="fill-height"
            >
              <template
                v-if="element.text"
              >
                <v-sheet
                  v-if="$vuetify.breakpoint.smAndDown && storyMode
                    && !element.text.includes(imageFlag)"
                  class="fill-height textSlider"
                  :id="`#textAreaContainer-${index}` === showTextCurrent
                    ? 'showTextCurrent'
                    : undefined"
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
                      :dark="$vuetify.theme.dark ? true : false"
                      absolute
                      class="ma-2"
                      style="right: 0"
                      @click="showText
                        ? endFullScreenInteraction(`#textAreaContainer-${index}`, true)
                        : startFullScreenInteraction(`#textAreaContainer-${index}`)"
                    >
                      <v-icon>
                        {{  showText
                          ? 'mdi-unfold-less-horizontal'
                          : 'mdi-unfold-more-horizontal' }}
                      </v-icon>
                    </v-btn>
                    <div
                      class="pa-5 textArea"
                      v-html="convertToMarkdown(element.text)"
                    ></div>
                    <div
                      v-if="`#textAreaContainer-${index}` !== showTextCurrent"
                      :style="`position: absolute; bottom: 0; width: 100%; height: 100%;
                      box-shadow: ${$vuetify.theme.dark
                        ? '#1e1e1e'
                        : 'white'} 0px -80px 30px -35px inset; pointer-events: none`"
                    ></div>
                  </div>
                </v-sheet>
                <div
                  v-else
                  class="textAreaContainer"
                >
                  <div
                    :class="element.text.includes(imageFlag)
                      ? 'imageArea fill-height'
                      : 'pa-5 textArea'"
                    v-html="convertToMarkdown(element.text)"
                  ></div>
                </div>
              </template>
              <indicator-globe
                v-else-if="element.indicatorObject.showGlobe"
                class="pt-0 fill-height"
                style="top: 0px; position: absolute;"
                :currentIndicator="element.indicatorObject"
                :directionProp="localDirection[element.poi]"
                :positionProp="localPosition[element.poi]"
                :rightProp="localRight[element.poi]"
                :upProp="localUp[element.poi]"
                :dataLayerTimeProp="localDataLayerTime[element.poi]"
                :compareLayerTimeProp="localCompareLayerTime[element.poi]"
                disableAutoFocus
                @update:direction="d => {localDirection[element.poi] = d}"
                @update:position="p => {localPosition[element.poi] = p}"
                @update:right="r => {localRight[element.poi] = r}"
                @update:up="u => {localUp[element.poi] = u}"
                @update:datalayertime="d => {localDataLayerTime[element.poi] = d}"
                @update:comparelayertime="d => {localCompareLayerTime[element.poi] = d}"
                @ready="onMapReady(element.poi)"
              />
              <!-- TO DO: give unique map id instead of element.title-->
              <CenterMap
                v-else-if="(['all'].includes(element.indicatorObject.country) ||
                appConfig.configuredMapPois.includes(
                  `${element.indicatorObject.aoiID}-${element.indicatorObject.indicator}`
                ) ||
                Array.isArray(element.indicatorObject.country)) && !element.includesIndicator"
                :mapId="element.title"
                :currentIndicator="element.indicatorObject"
                :directionProp="localDirection[element.poi]"
                :positionProp="localPosition[element.poi]"
                :rightProp="localRight[element.poi]"
                :upProp="localUp[element.poi]"
                :dataLayerTimeProp="localDataLayerTime[element.poi]"
                :compareLayerTimeProp="localCompareLayerTime[element.poi]"
                disableAutoFocus
                @update:direction="d => {localDirection[element.poi] = d}"
                @update:position="p => {localPosition[element.poi] = p}"
                @update:right="r => {localRight[element.poi] = r}"
                @update:up="u => {localUp[element.poi] = u}"
                @update:datalayertime="d => {localDataLayerTime[element.poi] = d}"
                @update:comparelayertime="d => {localCompareLayerTime[element.poi] = d}"
                @ready="onMapReady(element.poi)"
              />
              <!--<indicator-map
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
                disableAutoFocus
                :centerProp="localCenter[element.poi]"
                :zoomProp="localZoom[element.poi]"
                :dataLayerTimeProp="localDataLayerTime[element.poi]"
                :compareLayerTimeProp="localCompareLayerTime[element.poi]"
                @update:center="c => {localCenter[element.poi] = c}"
                @update:zoom="z => {localZoom[element.poi] = z}"
                @update:datalayertime="d => {localDataLayerTime[element.poi] = d}"
                @update:comparelayertime="d => {localCompareLayerTime[element.poi] = d}"
                @compareEnabled="tooltipTrigger = !tooltipTrigger"
                @ready="onMapReady(element.poi)"
              />-->
              <indicator-data
                v-else
                disableAutoFocus
                :currentIndicator="element.indicatorObject"
                class="pa-5 chart"
                style="top: 0px; position: absolute;"
              />
            </div>
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
                <span v-if="element.mapInfo && showTooltip(element)">Save map configuration</span>
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
import mediumZoom from 'medium-zoom';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';
import IndicatorGlobe from '@/components/IndicatorGlobe.vue';
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import { loadIndicatorData } from '@/utils';
import CenterMap from '@/components/map/CenterMap.vue';
import { mapGetters, mapState, mapActions } from 'vuex';

const zoom = mediumZoom();

export default {
  props: {
    enableEditing: Boolean,
    popupOpen: Boolean,
    storyMode: Boolean,
    localFeatures: Array,
    dashboardMeta: Object,
    themeColor: String,
    imageFlag: String,
  },
  components: {
    IndicatorData,
    IndicatorMap,
    IndicatorGlobe,
    LoadingAnimation,
    CenterMap,
  },
  data: () => ({
    isMounted: false,
    features: [],
    dialog: false,
    featureTitle: '',
    featurePOI: null,
    localZoom: {},
    localCenter: {},
    localDirection: {},
    localPosition: {},
    localRight: {},
    localUp: {},
    localDataLayerTime: {},
    localCompareLayerTime: {},
    serverZoom: {},
    serverCenter: {},
    serverDirection: {},
    serverPosition: {},
    serverRight: {},
    serverUp: {},
    serverDataLayerTime: {},
    serverCompareLayerTime: {},
    enableCompare: {},
    savedPoi: null,
    offsetTop: 0,
    showText: false,
    showTextCurrent: null,
    tooltipTrigger: false,
    firstCall: true,
    numberOfRows: null,
    ro: null,
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
        if (this.localDirection[element.poi] && this.serverDirection[element.poi]) {
          if (this.localDirection[element.poi] !== this.serverDirection[element.poi]) {
            return true;
          }
          if (this.localPosition[element.poi] !== this.serverPosition[element.poi]) {
            return true;
          }
          if (this.localRight[element.poi] !== this.serverRight[element.poi]) {
            return true;
          }
          if (this.localUp[element.poi] !== this.serverUp[element.poi]) {
            return true;
          }
        }
        if (this.localDataLayerTime[element.poi]) {
          if (this.localDataLayerTime[element.poi] !== this.serverDataLayerTime[element.poi]) {
            return true;
          }
        }
        if (this.localCompareLayerTime[element.poi]
              !== this.serverCompareLayerTime[element.poi]) {
          return true;
        }
        if (this.tooltipTrigger) {
          return true;
        }
        return false;
      };
    },
    navigationButtonVisible() {
      let visible;
      if (this.isMounted) {
        // adding 5 pixels here just to make sure it triggers
        // apparently there are very slight differences between browsers
        // in offsetTop calculation when the window is zoomed in or out
        visible = this.offsetTop + 5 >= document.querySelector('#headerRow').clientHeight;
      }
      return visible;
    },
    currentRow() {
      let currentRow;
      if (this.numberOfRows) {
        currentRow = Math.round((this.offsetTop - document.querySelector('#headerRow').clientHeight)
          / (window.innerHeight
            - this.$vuetify.application.top
            - this.$vuetify.application.footer)) + 1;
      }
      return currentRow;
    },
  },
  watch: {
    vuexFeatures: {
      immediate: true,
      deep: true,
      async handler(features) {
        if (features && !this.localFeatures) {
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

            let poiString;

            if (f.poi.includes('@')) {
              // eslint-disable-next-line
              const [poi, _time] = f.poi.split('@');
              poiString = poi;
            } else {
              poiString = f.poi;
            }

            const feature = this.$store.state.features.allFeatures
              .find((i) => this.getLocationCode(i.properties.indicatorObject) === poiString);
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
    showText(on) {
      if (on) {
        document.documentElement.style.setProperty('--showTextOffset', `${this.getTopOffset(this.showTextCurrent)}px`);
      }
    },
    navigationButtonVisible(on) {
      if (on && !this.numberOfRows) {
        this.getNumberOfRows();
      }
    },
    currentRow(newRow) {
      const query = { ...this.$route.query };
      if (newRow === 0) {
        delete query.page;
      } else {
        query.page = newRow;
      }
      this.$router.replace({ query }).catch(() => {});
    },
  },
  mounted() {
    this.isMounted = true;
    setTimeout(() => {
      if (this.$route.query.page) {
        this.goStep(Number(this.$route.query.page));
      }
    }, 50);

    this.ro = new ResizeObserver(() => {
      setTimeout(() => {
        if (document.querySelector('.scrollContainer').scrollTop > 0) {
          this.goStep(0);
        }
      });
    })
      .observe(document.querySelector('.scrollContainer'));
  },
  beforeDestroy() {
    delete this.ro;
    zoom.close();
  },
  methods: {
    ...mapActions('dashboard', [
      'removeFeature',
      'addMarketingInfo',
      'resizeFeatureShrink',
      'resizeFeatureExpand',
      'moveFeatureUp',
      'moveFeatureDown',
      'changeFeatureTitle',
      'changeFeatureMapInfo',
    ]),
    onMapReady(poi) {
      setTimeout(() => {
        this.localCenter[poi].lat = this.serverCenter[poi].lat;
        this.localCenter[poi].lng = this.serverCenter[poi].lng;
        this.localZoom[poi] = this.serverZoom[poi];
        this.localDirection[poi] = this.serverDirection[poi];
        this.localPosition[poi] = this.serverPosition[poi];
        this.localRight[poi] = this.serverRight[poi];
        this.localUp[poi] = this.serverUp[poi];
        this.localDataLayerTime[poi] = this.serverDataLayerTime[poi];
        this.localCompareLayerTime[poi] = this.serverCompareLayerTime[poi];
      }, 1000);
    },
    update(el) { // eslint-disable-line
      if (el.mapInfo) {
        this.savedPoi = el.poi;
        this.tooltipTrigger = false;

        return this.performChange(
          'changeFeatureMapInfo',
          {
            poi: el.poi,
            zoom: this.localZoom[el.poi],
            center: this.localCenter[el.poi],
            direction: this.localDirection[el.poi],
            position: this.localPosition[el.poi],
            right: this.localRight[el.poi],
            up: this.localUp[el.poi],
            dataLayerTime: this.localDataLayerTime[el.poi],
            compareLayerTime: this.localCompareLayerTime[el.poi]
              ? this.localCompareLayerTime[el.poi]
              : undefined,
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
      // each time markdown is rendered, register its images for the zoom feature
      this.registerImageZoom();
      return this.$marked(text
        .replace(this.imageFlag, '<img class="featuredImage" src="')
        .replace(this.imageFlag, `" title="${text.includes(this.imageFlag)
          ? text.split(this.imageFlag)[2].replace(/\n/g, ' ')
          : 'Image'}"/>`));
    },
    registerImageZoom() {
      this.$nextTick(() => {
        // detach all previously attached images
        zoom.detach();
        // attach all images in .textAreas
        zoom.attach(document.querySelectorAll('.textAreaContainer img'));
      });
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
        const container = document.querySelector('#elementsContainer');
        if (!container) {
          return;
        }
        const startingPoint = document.querySelector('#elementsContainer').offsetTop;
        const rowHeight = window.innerHeight
          - this.$vuetify.application.top
          - this.$vuetify.application.footer;
        const target = rowHeight * ((this.currentRow || 0) - 1 + direction);
        position = startingPoint + target;
      }
      this.$emit('scrollTo', { target: position });
    },
    async parseFeatures(features) {
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

        let poiString;

        if (f.poi.includes('@')) {
          // eslint-disable-next-line
          const [poi, _time] = f.poi.split('@');
          poiString = poi;
        } else {
          poiString = f.poi;
        }

        const feature = this.$store.state.features.allFeatures
          .find((i) => this.getLocationCode(i.properties.indicatorObject) === poiString);

        const indicatorObject = await loadIndicatorData(
          this.baseConfig,
          feature.properties.indicatorObject,
        );

        if (f.mapInfo && (this.firstCall || poiString === this.savedPoi)) {
          this.$set(this.localZoom, f.poi, f.mapInfo.zoom);
          this.$set(this.localCenter, f.poi, f.mapInfo.center);
          this.$set(this.localDirection, f.poi, f.mapInfo.direction);
          this.$set(this.localPosition, f.poi, f.mapInfo.position);
          this.$set(this.localRight, f.poi, f.mapInfo.right);
          this.$set(this.localUp, f.poi, f.mapInfo.up);
          this.$set(this.localDataLayerTime, f.poi, f.mapInfo.dataLayerTime);

          this.$set(this.serverZoom, f.poi, f.mapInfo.zoom);
          this.$set(this.serverCenter, f.poi, f.mapInfo.center);
          this.$set(this.serverDirection, f.poi, f.mapInfo.direction);
          this.$set(this.serverPosition, f.poi, f.mapInfo.position);
          this.$set(this.serverRight, f.poi, f.mapInfo.right);
          this.$set(this.serverUp, f.poi, f.mapInfo.up);
          this.$set(this.serverDataLayerTime, f.poi, f.mapInfo.dataLayerTime);

          if (f.mapInfo.dataLayerTime) {
            this.$set(this.localCompareLayerTime, f.poi, f.mapInfo.compareLayerTime);
            this.$set(this.serverCompareLayerTime, f.poi, f.mapInfo.compareLayerTime);
          }
        }

        this.firstCall = false;

        return {
          ...f,
          indicatorObject,
        };
      }));
    },
    startFullScreenInteraction(selector) {
      if (document.querySelector(selector).scrollTop === 0) {
        this.showTextCurrent = selector;
        this.showText = true;
      }
    },
    endFullScreenInteraction(selector, force) {
      if (document.querySelector(selector).scrollTop === 0 || force) {
        this.showText = false;
        this.showTextCurrent = null;
      }
    },
    getElementHeight(size) {
      let percent;
      switch (size) {
        case 1: {
          percent = 33.5;
          break;
        }
        case 2: {
          percent = 50;
          break;
        }
        case 3: {
          percent = 66.5;
          break;
        }
        case 4: {
          percent = 100;
          break;
        }
        default: {
          percent = 100;
        }
      }
      return percent;
    },
    getTopOffset(selector) {
      let offset = 0;
      const element = document.querySelector(selector);
      if (element && selector === this.showTextCurrent) {
        offset = (element
          .getBoundingClientRect().top - this.$vuetify.application.top) * -1;
      }
      return offset;
    },
    getNumberOfRows() {
      let noOfRows;
      if (this.navigationButtonVisible) {
        const container = document.querySelector('#elementsContainer').clientHeight;
        const row = window.innerHeight
          - this.$vuetify.application.top
          - this.$vuetify.application.footer;
        noOfRows = Math.round(container / row);
      }
      this.numberOfRows = noOfRows;
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
.textAreaContainer {
  overflow-y: auto;
}
.textAreaContainer,
.textArea {
  height: 100%;
}
::v-deep .textArea img,
::v-deep .textArea video,
::v-deep .textArea iframe {
  max-width: 100%;
}

::v-deep > .imageArea {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: small;
  padding: 10px;

  p {
    width: fit-content;
    height: fit-content;
    max-height: 100%;
    display: contents;
    text-align: center;
  }

  img {
    max-width: 100%;
    max-height: calc(100% - 40px);
    margin-bottom: 10px;
  }
}
// .imageCaption {
//   position: absolute;
//   z-index: 2;
//   display: flex;
//   justify-content: center;
//   width: 100%;
// }
.textSlider {
  max-height: 100% !important;
  transform: translateY(0) !important;
  height: 100% !important;
  transition-property: transform, visibility, width, height;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}
#showTextCurrent.textSlider {
  max-height: unset !important;
  transform: translateY(var(--showTextOffset)) !important;
  height: calc(var(--vh) * 100) !important;
  // transform: translateY(-50%) !important;
}
.hasOverflow {
  overflow: visible;
}
.noOverflow {
  overflow: hidden;
  /* persist overflow value from animation */
  animation: .5s delay-overflow;
}
@keyframes delay-overflow {
  from { overflow: visible; }
}
</style>

<style lang="scss">
.medium-zoom-overlay {
  z-index: 1;
  opacity: .8 !important;
  background: var(--v-background-base) !important;
}
.medium-zoom-image--opened {
  z-index: 2;
}
.imageArea :not(img):not(p) {
  display: contents;
}
</style>
