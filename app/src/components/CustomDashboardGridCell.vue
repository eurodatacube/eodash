<template>
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
      class="pa-0 elementCard"
      :style="`height: ${storyMode ? 'calc((var(--vh, 1vh) * 100) - 140px)' : '500px'}`"
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
          disableAutoFocus
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
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';

export default {
  props: {
    element: Object,
    index: Number,
    features: Array,
    enableEditing: Boolean,
    storyMode: Boolean,
    localZoom: Object,
    localCenter: Object,
    serverZoom: Object,
    serverCenter: Object,
  },
  components: {
    IndicatorData,
    IndicatorMap,
  },
  data: () => ({
    dialog: false,
    featureTitle: '',
    featurePOI: null,
    showText: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
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
    showTooltip(element) {
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
    },
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
  top: 10%;
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
