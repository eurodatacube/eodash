<template>
<v-col
  :style="`height: auto`"
  v-if="selectableLayerConfigs"
>
  <v-card
  class="pa-2">
    <v-card-title class="pa-2">Geographic Selection</v-card-title>
    <v-row v-if="anyLayerZoomConstraint"
      align="center"
      class="pl-3 pr-3">
      <v-col cols="12" class="pa-2">
      <v-list dense class="pa-0">
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in [selectableLayerConfigs[0]]"
            :key="i"
            class="pa-0"
            :disabled="getLayerBtn(item).disabled"
            style="pointer-events: none;"
          >
            <v-list-item-content>
              <v-list-item-title
              class=""
              >
              <v-icon :color="getLayerBtn(item).disabled ? 'grey':'black' ">{{ getLayerBtn(item).icon }}</v-icon>
              <span>
                {{ getLayerBtn(item).text }}
              </span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      </v-col>
    </v-row>
    <v-row
      align="center"
      class="pl-2 pr-2">
      <v-col cols="12" class="pa-2">
        <v-list dense class="py-0 px-2">
          <v-subheader style="color: black;" class="pa-0 text-body-1 font-weight-bold">Selected Units</v-subheader>
          <v-list-item-group
          v-if="selectedFeatures.length"
          >
            <v-list-item
              v-for="(item, i) in selectedFeatures"
              :key="i"
              class="pa-0"
            >
              <v-list-item-content>
                <v-list-item-title class="text-body-0" :style="getFeatureNameStyle(i)">
                  {{getFeatureName(item, i)}}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon color="primary" @click="removeFromSelection(item)">mdi-delete</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <div class="pl-2 text-body-0" v-else>No features in the selection</div>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</v-col>
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
    ...mapState('config', ['appConfig', 'baseConfig']),
    anyLayerZoomConstraint() {
      return this.selectableLayerConfigs.find(
        (l) => (l.minZoom !== undefined),
      );
    },
  },
  methods: {
    getFeatureNameStyle(index) {
      const { refColors } = this.appConfig;
      return `color: ${refColors[index]};`;
    },
    getLayerBtn(item) {
      const layer = this.selectableLayerConfigs.find((i) => i.id === item.id);
      const { map } = getMapInstance('centerMap');
      let text = 'Zoom in to visualize administrative units';
      let disabled = true;
      let icon = 'mdi-magnify-plus';
      if (map.getView().getZoom() > layer.minZoom) {
        text = 'Select an administrative unit in order to start analysis';
        disabled = false;
        icon = 'mdi-cursor-default-click';
      }
      return { text, disabled, icon };
    },
    getFeatureName(item, i) {
      const props = item.getProperties();
      const key = Object.keys(props).find(
        (k) => ['name', 'nuts_name', 'id', 'object_id'].includes(k.toLowerCase()),
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
