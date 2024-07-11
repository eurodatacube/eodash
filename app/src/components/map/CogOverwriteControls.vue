<template>
  <v-container fluid>
    <v-row align="center"
    v-for="(element, index) in cogOverwrite.queryParameters" :key="index">
      <v-col cols="4" class="pa-0">
        <v-subheader class="primary--text">
          {{element.label}}
        </v-subheader>
      </v-col>

      <v-col cols="8" class="pa-0">
        <v-select
          v-model="selects[index]"
          class="primary--text"
          :items="element.items"
          item-text="label"
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
import GeoTIFF from 'ol/source/GeoTIFF';

export default {
  name: 'VectorStyleControl',
  props: {
    cogOverwrite: Object,
  },
  data: () => ({
    selects: [],
  }),
  mounted() {
    const selects = [];
    this.cogOverwrite.queryParameters.forEach((config) => {
      const selectedItem = config.items.find((item) => item.id === config.selected);
      selects.push(selectedItem);
    });
    this.selects = selects;
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/SET_SELECTED_FEATURE') {
        setTimeout(() => {
          this.updateMap();
        }, 500);
      }
    });
  },
  methods: {
    updateMap() {
      const { map } = getMapInstance('centerMap');
      const layer = map.getAllLayers().find((l) => l.get('id') === this.cogOverwrite.sourceLayer);
      let ts = this.cogOverwrite.templateUrl;
      if (layer) {
        for (let idx = 0; idx < this.selects.length; idx++) {
          const selected = this.selects[idx].id;
          const label = this.cogOverwrite.queryParameters[idx].id;
          ts = ts.replace(`{${label}}`, selected);
        }
        // TODO: this is not really stable, but we can get the location from the selected feature
        // This expects the name to match exactly
        const city = this.$store.state.features.selectedFeature.indicatorObject.aoiID;
        // Additional special mapping
        const extraMapping = {
          Graz: '33TWN',
          Innsbruck: '32TPT',
          Klagenfurt: '33TVM',
          Salzburg: '33TUN',
          Linz: '33UVP',
        };
        if (city) {
          ts = ts.replace('{City}', city);
          ts = ts.replace('{city}', `${city.toLowerCase()}_${extraMapping[city]}`);
        }
        const updatedSources = [
          { url: ts },
        ];
        this.$store.state.indicators.selectedIndicator.display[0].sources = [{ url: ts }];
        layer.setSource(new GeoTIFF({
          sources: updatedSources,
          normalize: false,
          interpolate: false,
        }));
      }
      // this.$emit('updatequeryparameter', true);
      if (this.$store.state.features.selectedFeatures?.length > 0) {
        window.dispatchEvent(new Event('fetch-custom-area-chart'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
