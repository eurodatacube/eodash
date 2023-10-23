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
          :items="vectorStyles.items"
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
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';
import { applyStyle } from 'ol-mapbox-style';

export default {
  name: 'StyleControls',
  components: {},
  props: {
    vectorStyles: Object,
  },
  data: () => ({
    select: null,
  }),
  mounted() {
    [this.select] = this.vectorStyles.items;
  },
  watch: {
    select() {
      let markdown;
      try {
        markdown = require(`../../../public/data/gtif/markdown/${this.select.markdown}.md`);
      } catch {
        markdown = { default: '' };
      }
      this.$store.commit('story/SET_STORY', markdown.default);
    },
  },
  methods: {
    updateMap(evt) {
      const { map } = getMapInstance('centerMap');
      const vLayer = map.getAllLayers().find((l) => l.get('id') === this.vectorStyles.sourceLayer);
      if (vLayer) {
        applyStyle(
          vLayer,
          this.$store.state.indicators.selectedIndicator.display.styleFile,
          [evt.id],
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
