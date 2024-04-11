<template>
  <v-container fluid>
    <v-row align="center"
    v-for="(element, index) in queryParameters" :key="index">
      <v-col cols="4" class="pa-0">
        <v-subheader class="primary--text">
          {{element.title}}
        </v-subheader>
      </v-col>

      <v-col cols="8" class="pa-0">
        <v-select
          v-model="selects[index]"
          class="primary--text"
          :items="element.items"
          item-text="description"
          item-value="id"
          label="Select"
          persistent-hint
          return-object
          single-line
          @change="updateMap($event, index)"
        >
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';

export default {
  name: 'VectorStyleControl',
  props: {
    queryParameters: Array[Object],
  },
  data: () => ({
    selects: [],
  }),
  mounted() {
    const selects = [];
    this.queryParameters.forEach((config) => {
      const selectedItem = config.items.find((item) => item.id === config.selected);
      selects.push(selectedItem);
    });
    this.selects = selects;
  },
  methods: {
    updateMap(evt, index) {
      this.queryParameters[index].selected = evt.id;
      const { map } = getMapInstance('centerMap');
      const layer = map.getAllLayers().find((l) => l.get('id') === this.queryParameters[0].sourceLayer);
      if (layer) {
        layer.changed();
      }
      this.$emit('updatequeryparameter', true);
      if (this.$store.state.features.selectedFeatures?.length > 0) {
        window.dispatchEvent(new Event('fetch-custom-area-chart'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
