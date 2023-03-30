<template>
  <div
    v-if="demoItems.length > 0"
    class="fill-height d-flex flex-column pa-3"
    id="demoItemsList"
    style="height: calc(var(--vh, 1vh) * 100); z-index: 11; pointer-events: all"
  >
    <!-- <v-btn>Reset</v-btn> -->
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
        :key="getLocationCode(demoItem.properties.indicatorObject)"
        :color="getLocationCode(demoItem.properties.indicatorObject) === selectedItem
          ? 'primary'
          : 'white'"
        height="200"
        width="200"
        class="my-3 overflow-hidden d-flex flex-column pa-1"
        style="pointer-events: all"
        @click="selectItem(demoItem)"
      >
        <v-img
          height="100"
          class="flex-shrink-1"
          :src="`./data/${appConfig.id}/globalDataLayerImages/${getLocationCode(
            demoItem.properties.indicatorObject
          )}.png`"
        >
        </v-img>
        <v-card-title
          class="flex-grow-1"
          :class="getLocationCode(demoItem.properties.indicatorObject) === selectedItem
            ? 'white--text'
            : 'primary--text'"
          style="font-size: 12px; line-height: 14px; padding: 5px; word-break: break-word;"
        >
          {{ demoItem.title || demoItem.properties.indicatorObject.indicatorName }}
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
      v-if="!initialMapView"
      style="position: absolute; left: 200px; top: 0;"
      @click="resetMapView()"
    >Recenter map</v-btn>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';
import getLocationCode from '../mixins/getLocationCode';

export default {
  data: () => ({
    selectedItem: null,
  }),
  computed: {
    ...mapState('config', ['appConfig']),
    ...mapState('features', ['allFeatures']),
    demoItems() {
      return this.allFeatures.length && this.appConfig.demoMode[this.$route.query.event]
        .map((item) => ({
          ...item,
          ...this.allFeatures
            .find((f) => getLocationCode(f.properties.indicatorObject) === item.poi),
        }))
        .filter((item) => !!item.properties);
    },
    initialMapView() {
      return this.$parent.$parent.$refs.centerPanel.$refs.map.initialView;
    },
  },
  methods: {
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    selectItem(item) {
      this.setSelectedIndicator(item.properties.indicatorObject);
      this.selectedItem = this.getLocationCode(item.properties.indicatorObject);
      if (item.dataLayerTime) {
        setTimeout(() => {
          this.$parent.$parent.$refs.centerPanel.$refs.map.dataLayerTime = {
            value: item.dataLayerTime,
          };
        }, 0);
      }
      if (item.compareLayerTime) {
        setTimeout(() => {
          this.$parent.$parent.$refs.centerPanel.$refs.map.compareLayerTime = {
            value: item.compareLayerTime,
          };
          this.$parent.$parent.$refs.centerPanel.$refs.map.enableCompare = true;
        }, 0);
      }
    },
    resetMapView() {
      this.$parent.$parent.$refs.centerPanel.$refs.map.resetView();
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
  watch: {
    demoItems(items) {
      if (items.length > 0 && !this.selectedItem) {
        this.selectItem(items[0]);
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
