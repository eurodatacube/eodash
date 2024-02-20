<template>
  <v-col v-if="filters"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <v-card class="pa-2">
    <v-card-title class="pa-2">Filters</v-card-title>
      <v-btn
        v-if="filtersChanged"
        absolute x-small color="primary"
        style="top:6px; right:6px;font-size:8px;"
        @click="resetFilters()"
      >
        Reset constraints
      </v-btn>
      <template>
        <v-select
          v-model="selectedFilters"
          :items="filters"
          item-text="description"
          item-value="id"
          label="Select"
          multiple
          return-object
          hint="Pick"
          persistent-hint
          @change="updateMap"
        ></v-select>
      </template>
    </v-card>
  </v-col>
</template>

<script>
import throttle from 'lodash.throttle';
import { getMapInstance } from '@/components/map/map';
import { saveAs } from 'file-saver';

export default {
  name: 'FilterControls',
  props: {
    featureFilters: Object,
    mergedConfigsData: Object,
    adminLayer: Object,
    adminFeature: Object,
    indicatorCode: String,
  },
  data() {
    return {
      selectedFilters: [],
      filters: this.featureFilters.filters,
    };
  },
  computed: {
  },
  created() {
    this.throttledUpdate = throttle((evt, filterId, index) => {
      this.updateMap(evt, filterId, index);
    }, 150);
  },
  mounted() {
  },
  beforeUnmount() {
    this.throttledUpdate.cancel();
  },
  watch: {
  },
  methods: {
    filtersChanged() {
      return false;
    },
    resetFilters() {
      this.filters = JSON.parse(JSON.stringify(this.cogFilters.filters));
      this.resetMap();
    },
    resetMap() {
      this.variables = JSON.parse(JSON.stringify(this.originalVariables));
      this.updateLayerStyle();
    },
    updateMap() {
      let resultFilters = [];
      if (this.selectedFilters.length > 1) {
        resultFilters.push('all');
        this.selectedFilters.forEach((f) => {
          resultFilters.push(['==', ['get', f.id], 1]);
        });
      } else if (this.selectedFilters.length === 1) {
        resultFilters = ['==', ['get', this.selectedFilters[0].id], 1];
      }
      const { map } = getMapInstance('centerMap');
      const vectorLayer = map.getAllLayers().find((l) => l.get('id') === this.featureFilters.sourceLayer);
      const style = {
        filter: resultFilters,
        style: this.featureFilters.baseStyle,
      };
      vectorLayer.setStyle([style]);
    },
    updateLayerStyle() {
      // const { map } = getMapInstance('centerMap');
      // const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      // if (gtl) {
      //   // due to an unknown bug that can not be reproduced outside of eodash
      //   // GeoTiff sources with index higher than 4 (start at 1) do behave as binary filter
      //   // on the first load of this panel, manual resetting of source solves the issue
      //   if (filterIndex > 4 && !this.layerSourceDidRefresh) {
      //     const s = gtl.getSource();
      //     gtl.setSource(null);
      //     gtl.setSource(s);
      //     // to refresh once per dataset is enough
      //     this.layerSourceDidRefresh = true;
      //   }
      //   gtl.updateStyleVariables(this.variables);
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
