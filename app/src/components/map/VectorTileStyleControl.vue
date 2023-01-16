<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>
          Data properties
        </v-subheader>
      </v-col>

      <v-col cols="6">
        <v-select
          v-model="select"
          :items="queryParameters.items"
          item-text="description"
          item-value="id"
          label="Select"
          persistent-hint
          return-object
          single-line
          @change="updateMap"
        ></v-select>
      </v-col>
    </v-row>
     <v-row align="center">
        <div
          v-html="story"
          class="md-body"
        ></div>
     </v-row>
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';

export default {
  name: 'FilterControls',
  components: {},
  props: {
    queryParameters: Object,
    display: Object,
  },
  data: () => ({
    select: null,
  }),
  mounted() {
    [this.select] = this.queryParameters.items;
  },
  computed: {
    story() {
      let markdown;
      try {
        markdown = require(`../../../public/data/gtif/markdown/${this.select.markdown}.md`);
      } catch {
        markdown = { default: '' };
      }
      return this.$marked(markdown.default);
    },
  },
  watch: {
  },
  methods: {
    updateMap(evt) {
      this.display.selectedQueryItem = evt.id;
      this.display.min = evt.min;
      this.display.max = evt.max;
      this.display.colormapUsed = evt.colormapUsed;
      const { map } = getMapInstance('centerMap');
      const layer = map.getAllLayers().find((l) => l.get('id') === this.queryParameters.sourceLayer);
      layer.changed();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
