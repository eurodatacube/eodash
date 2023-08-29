<template>
  <v-sheet
  v-if="selectableLayerConfigs"
  class="pa-2">
    <div class="text-h7 font-weight-bold">
      <v-row align="center"
      class="pa-3">
        <span>Map Selection</span>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-icon color="primary" class="pl-2">
                mdi-information-outline
              </v-icon>
            </div>
        </template>
        <p>
          Click on "Zoom to" entry to show selectable zones.
        </p>
        <p>
          Click on features on the map to allow further interaction with data.
        </p>
        <p>
          Deselect features by clicking on it again or by using delete icon in the list.
        </p>
        </v-tooltip>
      </v-row>
    </div>
    <v-row v-if="anyLayerZoomConstraint"
      align="center"
      class="pl-3 pr-3">
      <v-col cols="12" class="pa-0">
      <v-list dense class="pa-0">
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
              class=""
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
    <v-row
      align="center"
      class="pl-2 pr-2">
      <v-col cols="12" class="pa-0">
        <v-list dense class="pa-0">
          <v-subheader class="text-body-1 font-weight-bold">Selected Features</v-subheader>
          <v-list-item-group
          v-if="selectedFeatures.length"
          >
            <v-list-item
              v-for="(item, i) in selectedFeatures"
              :key="i"
              class="pa-0"
            >
              <v-list-item-content>
                <v-list-item-title class="text-body-0">
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
      return `Zoom to ${item.name} level`;
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
