<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>
          Model configuration
        </v-subheader>
      </v-col>
      <v-row cols="6" v-for="key in Object.keys(wmsVariables.variables)" :key="key">
        <v-col>
          <v-subheader>
            {{ wmsVariables.variables[key].description }}
          </v-subheader>
        </v-col>
        <v-col>
          <v-select
            v-model="select[key]"
            :items="wmsVariables.variables[key].items"
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
    </v-row>
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';

export default {
  name: 'CustomWMSVariables',
  components: {},
  props: {
    wmsVariables: Object,
  },
  data: () => ({
    select: {},
  }),
  mounted() {
    Object.keys(this.wmsVariables.variables).forEach((key) => {
      this.select[key] = this.wmsVariables.variables[key].items.find(
        (item) => item.id === this.wmsVariables.variables[key].selected,
      );
    });
  },
  computed: {
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
  },
  watch: {
  },
  methods: {
    updateMap() {
      // Update selected values
      Object.keys(this.select).forEach((key) => {
        if (this.indicatorObject) {
          this.indicatorObject.display.wmsVariables.variables[key].selected = this.select[key].id;
        }
        this.wmsVariables.variables[key].selected = this.select[key].id;
      });
      if (this.indicatorObject) {
        this.indicatorObject.display.wmsVariables = JSON.parse(JSON.stringify(this.wmsVariables));
      }
      const { map } = getMapInstance('centerMap');
      const wmsLayer = map.getAllLayers().find((l) => l.get('name') === this.wmsVariables.sourceLayer);
      wmsLayer.changed();

    },
  },
};
</script>

<style lang="scss" scoped>
</style>
