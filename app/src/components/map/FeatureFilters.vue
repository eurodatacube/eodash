<template>
  <v-col v-if="filters"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <v-card class="pa-2">
    <v-card-title class="pa-2">Filters</v-card-title>
      <template>
        <v-select
          v-model="selectedFilters"
          :items="filters"
          item-text="description"
          item-value="id"
          label="Select"
          multiple
          return-object
          :hint="featureFilters.hint ? featureFilters.hint: 'Select filter'"
          persistent-hint
          @change="updateMap"
        ></v-select>
      </template>
    </v-card>
  </v-col>
</template>

<script>
import { getMapInstance } from '@/components/map/map';

export default {
  name: 'FilterControls',
  props: {
    featureFilters: Object,
  },
  data() {
    return {
      selectedFilters: [],
      filters: this.featureFilters.filters,
    };
  },
  methods: {
    updateMap() {
      let resultFilters = [];
      let style;
      if (this.selectedFilters.length > 1) {
        resultFilters.push('all');
        this.selectedFilters.forEach((f) => {
          resultFilters.push(['==', ['get', f.id], 1]);
        });
      } else if (this.selectedFilters.length === 1) {
        resultFilters = ['==', ['get', this.selectedFilters[0].id], 1];
      }
      if (this.selectedFilters.length === 0) {
        style = this.featureFilters.baseStyle;
      } else {
        style = [{
          filter: resultFilters,
          style: this.featureFilters.baseStyle,
        }];
      }
      const { map } = getMapInstance('centerMap');
      const vectorLayer = map.getAllLayers().find(
        (l) => l.get('id') === this.featureFilters.sourceLayer,
      );
      vectorLayer.setStyle(style);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
