<template>
  <div
    class="fill-height d-flex flex-column pa-0"
    style="z-index: 11; pointer-events: all"
  >
    <v-btn
      color="primary"
      @click="scroll('up')"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
    <div
      ref="scrollContainer"
      class="scrollContainer"
      style="overflow: auto">
      <v-card
        v-for="demoItem in demoItems"
        :key="getLocationCode(demoItem)"
        :color="getLocationCode(demoItem) === selectedItem
          ? 'primary'
          : 'white'"
        height="200"
        width="800"
        class="my-3 overflow-hidden d-flex flex-column pa-1"
        style="pointer-events: all"
        @click="selectItem(demoItem)"
      >
        <v-img
          height="100"
          class="flex-shrink-1"
          :src="getThumbnailImage(demoItem)"
        >
        </v-img>
        <v-card-title
          class="flex-grow-1"
          :class="getLocationCode(demoItem) === selectedItem
            ? 'white--text'
            : 'primary--text'"
          style="font-size: 12px; line-height: 14px; padding: 5px; word-break: break-word;"
        >
          {{ demoItem.name }}
        </v-card-title>
      </v-card>
    </div>
    <v-btn
      color="primary"
      @click="scroll('down')"
    >
      <v-icon>mdi-chevron-down</v-icon>
    </v-btn>
    <v-btn
      color="primary"
      class="ma-3 ml-6"
      large
      style="position: absolute; left: 200px; top: 0;"
      @click="resetMapView()"
    >
      <v-icon left>mdi-image-filter-center-focus</v-icon>
      Recenter map
    </v-btn>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';

import { loadIndicatorData } from '@/utils';

export default {
  data: () => ({
    selectedItem: null,
  }),
  computed: {
    ...mapState('indicators', ['indicators', 'selectedIndicator']),
    ...mapState('config', ['appConfig', 'baseConfig']),
    demoItems() {
      const items = this.appConfig.demoMode[this.$route.query.event];
      if (items?.length > 0 && this.indicators?.length > 0) {
        // for each item, try to get location code, if starts with World
        // then do getLocationCode
        const matched = [];
        for (let i = 0; i < items.length; i++) {
          const val = items[i].poi;
          const [poi, indicatorCode] = val.split('-');
          // and load relevant data
          const ind = this.indicators.find((f) => f.indicator === indicatorCode);
          const objectM = {
            ...ind,
            ...items[i],
          };
          if (poi !== 'World') {
            // passing the aoiID into the merged object for POI indicator
            objectM.aoiID = poi;
          }
          matched.push(objectM);
        }
        return matched;
      }
      return null;
    },
    centerMapVueComponent() {
      return this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$refs.centerPanel.$refs.map;
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      // programtically show the UIPanel as expanded
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
  },
  methods: {
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
      loadIndicatorFinished: 'INDICATOR_LOAD_FINISHED',
    }),
    ...mapMutations('features', {
      setSelectedFeature: 'SET_SELECTED_FEATURE',
    }),
    async selectItem(item) {
      this.selectedItem = this.getLocationCode(item);
      const val = item.poi;
      const [poi] = val.split('-');
      if (poi !== 'World') {
        // just to update URL query
        // eslint-disable-next-line no-param-reassign
        item.disableExtraLoadingData = true;
        // fetching the indicator here outside of App.vue watcher in order to
        // get the features and select the matching one which was clicked in in the Panel
        this.setSelectedIndicator(item);
        const indicatorObject = await loadIndicatorData(
          this.baseConfig,
          item,
        );
        const currentFeatureObject = indicatorObject.features.find(
          (feat) => feat.id === item.aoiID,
        );
        // should match if the appConfig is done correctly
        if (currentFeatureObject) {
          const test = {
            indicatorObject,
          };
          this.loadIndicatorFinished(indicatorObject);
          // manually select the feature
          this.setSelectedFeature(test);
        }
      } else {
        this.setSelectedIndicator(item);
      }
      if (item.dataLayerTime) {
        setTimeout(() => {
          this.centerMapVueComponent.dataLayerTime = {
            value: item.dataLayerTime,
          };
        }, 0);
      }
      if (item.compareLayerTime) {
        setTimeout(() => {
          this.centerMapVueComponent.compareLayerTime = {
            value: item.compareLayerTime,
          };
          this.centerMapVueComponent.enableCompare = true;
        }, 0);
      }
    },
    resetMapView() {
      // this is very fragile, we should use events or "iframe" commands
      this.centerMapVueComponent.resetView();
    },
    getThumbnailImage(demoItem) {
      // try out the thumbnail from STAC link
      
      // fallback 
      let url = `./data/${appConfig.id}/globalDataLayerImages/${getLocationCode(demoItem)}.png`;
      return url;
    },
    scroll(direction) {
      const scrollElement = this.$refs.scrollContainer;
      switch (direction) {
        case 'up':
          scrollElement.scrollTo({ top: scrollElement.scrollTop - 200, behavior: 'smooth' });
          break;
        case 'down':
          scrollElement.scrollTo({ top: scrollElement.scrollTop + 200, behavior: 'smooth' });
          break;
        default:
          //
      }
    },
  },
};
</script>

<style scoped>
.scrollContainer {
  scrollbar-width: none;  /* Firefox */
}
.scrollContainer::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>
