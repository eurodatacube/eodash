<template>
  <loading-animation v-if="features.length === 0" style="height: 400px" />
  <v-row
    v-else
    id="elementsContainer"
    v-scroll:#scroll-target="onScroll"
  >
    <custom-dashboard-grid-cell
      v-for="(element, index) in features"
      :key="element.poi"
      :element="element"
      :index="index"
      :features="features"
      :enable-editing="enableEditing"
      :story-mode="storyMode"
      :local-zoom="localZoom"
      :local-center="localCenter"
      :server-zoom="serverZoom"
      :server-center="serverCenter"
      @change="() => $emit('change')"
      @save="() => $emit('save')"
      @updateTextFeature="(el) => $emit('updateTextFeature', el)"
    />
    <div
      v-if="$vuetify.breakpoint.xsOnly && navigationButtonVisible"
      class="secondary white--text d-flex align-center pa-7"
      style="position: fixed; bottom: 0; left: 0; width: 100%; height: 60px; z-index: 6"
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
        class="secondary d-flex align-center"
        :style="`position: fixed; border-radius: 30px; z-index: 7; ${
          $vuetify.breakpoint.smAndUp
            ? 'bottom: 67px; right: 25px;'
            : 'bottom: 6px; right: 9px;'
          }`"
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
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import CustomDashboardGridCell from '@/components/CustomDashboardGridCell.vue';
import { loadIndicatorData } from '@/utils';
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    enableEditing: Boolean,
    popupOpen: Boolean,
    storyMode: Boolean,
    localFeatures: Array,
    dashboardMeta: Object,
  },
  components: {
    LoadingAnimation,
    CustomDashboardGridCell,
  },
  data: () => ({
    features: [],
    localZoom: {},
    localCenter: {},
    serverZoom: {},
    serverCenter: {},
    savedPoi: null,
    offsetTop: 0,
  }),
  computed: {
    ...mapGetters('dashboard', {
      vuexFeatures: 'features',
    }),
    ...mapState('config', [
      'baseConfig',
    ]),
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
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    goStep(direction) {
      let position;
      if (this.currentRow === 1 && direction === -1) {
        position = 0; // scroll back to story intro
      } else {
        const rowPadding = 26;
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
  },
};
</script>
