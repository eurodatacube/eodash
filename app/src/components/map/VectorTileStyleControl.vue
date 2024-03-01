<template>
  <v-container fluid>
    <v-row align="center"
    v-if="queryParameters.items.length > 1">
      <v-col cols="6">
        <v-subheader>
          Data properties
        </v-subheader>
      </v-col>

      <v-col cols="6">
        <v-select
          v-model="select"
          :items="queryParameters.items"
          item-text="id"
          item-value="id"
          label="Select"
          persistent-hint
          return-object
          single-line
          @change="updateMap"
        >
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';

export default {
  name: 'FilterControls',
  props: {
    queryParameters: Object,
  },
  data: () => ({
    select: null,
  }),
  mounted() {
    const selected = this.queryParameters?.selected;
    if (this.queryParameters?.selected && this.queryParameters?.items?.length > 1) {
      this.select = this.queryParameters?.items.find((item) => item.id === selected);
    } else {
      [this.select] = this.queryParameters?.items;
    }
  },
  watch: {
  },
  methods: {
    updateMap(evt) {
      this.queryParameters.selected = evt.id;
      const { map } = getMapInstance('centerMap');
      const layer = map.getAllLayers().find((l) => l.get('id') === this.queryParameters.sourceLayer);
      if (layer) {
        layer.changed();
      }
      this.$emit('updatequeryparameter', true);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
