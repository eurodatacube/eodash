<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>
          Data properties
          <info-dialog
            v-if="select && select.dataInfo && queryParameters.items.length === 1"
            :infoSource="select.dataInfo"
          />
          <info-dialog
            v-if="queryParameters.dataInfo"
            :infoSource="queryParameters.dataInfo"
          />
        </v-subheader>
      </v-col>

      <v-col cols="6">
        <v-select
          v-if="queryParameters.items.length > 1"
          v-model="select"
          :items="queryParameters.items"
          item-text="description"
          item-value="id"
          label="Select"
          persistent-hint
          return-object
          single-line
          @change="updateMap"
        >
          <template #append-outer v-if="select && select.dataInfo">
            <info-dialog :infoSource="select.dataInfo"/>
          </template>
        </v-select>
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
import InfoDialog from '@/components/InfoDialog.vue';

export default {
  name: 'FilterControls',
  components: {
    InfoDialog,
  },
  props: {
    queryParameters: Object,
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
      this.queryParameters.selected = evt.id;
      const { map } = getMapInstance('centerMap');
      const layer = map.getAllLayers().find((l) => l.get('id') === this.queryParameters.sourceLayer);
      layer.changed();
      this.$emit('updatequeryparameter', true);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
