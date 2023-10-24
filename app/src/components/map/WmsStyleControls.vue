<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>
          Data properties
          <info-dialog
            v-if="wmsStyles.dataInfo"
            :infoSource="wmsStyles.dataInfo"
          />
        </v-subheader>
      </v-col>

      <v-col cols="6">
        <v-select
          v-model="select"
          :items="wmsStyles.items"
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
import InfoDialog from '@/components/InfoDialog.vue';

export default {
  name: 'FilterControls',
  components: {
    InfoDialog,
  },
  props: {
    wmsStyles: Object,
  },
  data: () => ({
    select: null,
  }),
  mounted() {
    [this.select] = this.wmsStyles.items;
  },
  watch: {
    select() {
      let markdown;
      try {
        markdown = require(`../../../public/data/gtif/markdown/${this.select.markdown}.md`);
      } catch {
        markdown = { default: '' };
      }
      // this.$store.commit('story/SET_STORY', markdown.default);
    },
  },
  methods: {
    updateMap(evt) {
      const { map } = getMapInstance('centerMap');
      const layer = map.getAllLayers().find((l) => l.get('name') === this.wmsStyles.sourceLayer);
      if (layer) {
        layer.getSource().updateParams({
          STYLES: evt.id,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
