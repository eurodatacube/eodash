<template>
  <v-sheet
  v-if="selectableLayerConfigs"
  class="pa-2">
    <div class="text-h6 pa-1">
      Map Selection Time Series
    </div>
    <v-row v-if="anyLayerZoomConstraint"
      align="center"
      class="pa-2">
      <v-col cols="12" class="pa-0">
      <div v-if="anyLayerZoomConstraint" class="text-body-1 ma-0">
        Zoom map to a selection layer by selecting an item from the list.
      </div>
      <v-list dense>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in selectableLayerConfigs"
            :key="i"
            class="pa-0"
          >
            <v-list-item-content>
              <v-list-item-title
              class="text-body-1"
              @click="layerSelectClick(item)">
              <span>
                {{ getLayerText(item)}}
              </span>
              <v-icon color="primary">mdi-crosshairs-gps</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      </v-col>
    </v-row>
    <v-row align="center"
      class="pa-2">
      <v-col cols="12" class="pa-0">
        <div class="text-body-1 ma-0">
          Click on polygons on the map to get time series for the selected area.
        </div>
        <div class="text-body-1 ma-0">
          Deselect area by clicking on it again or by using delete icon in the list.
        </div>
      </v-col>
    </v-row>
    <v-row
      align="center"
      class="pa-2">
      <v-col cols="12" class="pa-0">
        <v-list dense class="pa-0">
          <v-subheader class="text-h6" color="black">Selected Features</v-subheader>
          <v-list-item-group
          v-if="selectedFeatures.length"
          >
            <v-list-item
              v-for="(item, i) in selectedFeatures"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title class="text-body-1">{{getFeatureName(item, i)}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon color="primary" @click="removeFromSelection(item)">mdi-delete</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <div class="text-body-1" v-else>No features in the selection</div>
        </v-list>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
// Utilities
import { mapState } from 'vuex';
import { getMapInstance } from '@/components/map/map';

export default {
  props: {
    selectableLayerConfigs: Array[Object],
  },
  data: () => ({
    selectedFeatures: [],
  }),
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/SET_SELECTED_FEATURES') {
        this.selectedFeatures = mutation.payload;
      }
    });
  },
  computed: {
    ...mapState('config', ['baseConfig']),
    anyLayerZoomConstraint() {
      return this.selectableLayerConfigs.find(
        (l) => (l.minZoom !== undefined),
      );
    },
  },
  methods: {
    getLayerText(item) {
      return `${item.name}${item.minZoom ? ` - from map zoom ${item.minZoom}` : ''}`;
    },
    getFeatureName(item, i) {
      const props = item.getProperties();
      const key = Object.keys(props).find(
        (k) => ['name', 'nuts_name', 'id'].includes(k.toLowerCase()),
      );
      if (props[key]) {
        return props[key];
      }
      return `Unnamed feature ${i + 1}`;
    },
    layerSelectClick(item) {
      const layer = this.selectableLayerConfigs.find((i) => i.id === item.id);
      const { map } = getMapInstance('centerMap');
      if (layer.minZoom) {
        map.getView().animate({
          duration: 500,
          zoom: layer.minZoom + 0.1,
        });
      }
    },
    removeFromSelection(item) {
      let { selectedFeatures } = this.$store.state.features;
      const foundIndex = selectedFeatures.findIndex(
        (selectedFtr) => item.getId() === selectedFtr.getId(),
      );
      selectedFeatures = selectedFeatures.toSpliced(foundIndex, 1);
      this.$store.commit('features/SET_SELECTED_FEATURES', selectedFeatures);
    },
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss" scoped></style>
