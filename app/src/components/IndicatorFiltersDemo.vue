<template>
  <div
    class="fill-height d-flex flex-column pa-3"
    style="height: calc(var(--vh, 1vh) * 100); z-index: 11; pointer-events: all"
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
          :src="`./data/${appConfig.id}/globalDataLayerImages/${getLocationCode(
            demoItem
          )}.png`"
        >
        </v-img>
        <v-card-title
          class="flex-grow-1"
          :class="getLocationCode(demoItem) === selectedItem
            ? 'white--text'
            : 'primary--text'"
          style="font-size: 12px; line-height: 14px; padding: 5px; word-break: break-word;"
        >
          {{ demoItem.title || demoItem.indicatorName }}
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
    <div
      v-if="highlightsModel"
      style="width: 230px; pointer-events: all; position:absolute; left: 230px;top: 75px;"
    >
      <v-list style="width: 100%; background-color: #00000000;">
        <v-list-item-group style="width: 100%">
          <v-list-item
            v-for="item in highlightsModel.highlights"
            :key="item.name"
            class="mb-2 dashboard-button v-btn v-btn--is-elevated v-btn--has-bg theme--light"
            style="width: 100%"
            @click="moveToHighlight(item.location)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';

import GeoJSON from 'ol/format/GeoJSON';
import { Wkt } from 'wicket';
import { getMapInstance } from '@/components/map/map';
import { calculatePadding } from '@/utils';
import getLocationCode from '../mixins/getLocationCode';

const wkt = new Wkt();

export default {
  data: () => ({
    selectedItem: null,
  }),
  computed: {
    ...mapState('indicators', ['indicators', 'selectedIndicator']),
    ...mapState('config', ['appConfig']),
    demoItems() {
      const items = this.appConfig.demoMode[this.$route.query.event];
      if (items?.length > 0 && this.indicators?.length > 0) {
        const matched = items.map((item) => ({
          ...this.indicators
          .find((f) => getLocationCode(f) === item.poi),
          ...item,
        }));
        return matched;
      }
      return null;
    },
    highlightsModel() {
      if (this.selectedItem) {
        const selectedItemModel = this.demoItems.find((item) => item.poi === this.selectedItem);
        if (selectedItemModel && selectedItemModel.highlights) {
          return selectedItemModel;
        }
      }
      return null;
    },
    centerMapVueComponent() {
      return this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$refs.centerPanel.$refs.map;
    },
  },
  methods: {
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    selectItem(item) {
      this.setSelectedIndicator(item);
      this.selectedItem = this.getLocationCode(item);
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
    moveToHighlight(location) {
      const { map } = getMapInstance('centerMap');
      const featureProjection = map.getView().getProjection();
      const geoJsonFormat = new GeoJSON({
        featureProjection,
      });
      const geom = geoJsonFormat.readGeometry(wkt.read(location).toJson());
      const padding = calculatePadding();
      map.getView().fit(geom.getExtent(), {
        duration: 0, padding,
      });
    },
    resetMapView() {
      // this is very fragile, we should use events or "iframe" commands
      this.centerMapVueComponent.resetView();
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
