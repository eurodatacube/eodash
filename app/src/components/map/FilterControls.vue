<template>
  <v-col v-if="filters"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
    <v-card class="pa-3"    >
      <div v-for="key in Object.keys(filters)"
        :key="key"
      >
        <v-subheader>{{filters[key].label}}</v-subheader>
        <v-range-slider
          v-model="filters[key].range"
          hide-details
          dense
          :min="filters[key].min"
          :max="filters[key].max"
          :step="(filters[key].max-filters[key].min)/100"
          @input="(evt) => updateMap(evt, filters[key].id)"
        >
          <template v-slot:prepend>
            <div class="pl-4" style="width:60px; overflow:hidden;">{{filters[key].range[0]}}</div>
          </template>
          <template v-slot:append>
            <div class="pr-4" style="width:60px; overflow:hidden;">{{filters[key].range[1]}}</div>
          </template>
        </v-range-slider>
      </div>
      <div style="text-align: center;">
        <v-btn small color="primary">Add filter</v-btn>
      </div>
      <div style="padding-left: 30%" class="align-center justify-center d-inline-flex">
        <v-checkbox
          class="align-center justify-center d-inline-flex"
          :label="'Exclude protected areas'"
        ></v-checkbox>
      </div>
    </v-card>
  </v-col>
</template>

<script>

import getMapInstance from '@/components/map/map';

export default {
  name: 'FilterControls',
  components: {},
  props: {
    cogFilters: Object,
  },
  data() {
    return {
      filters: this.cogFilters.filters,
    };
  },
  computed: {},
  watch: {
  },
  methods: {
    updateMap(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      const variables = {};
      [variables[`${filterId}Min`], variables[`${filterId}Max`]] = evt;
      gtl.updateStyleVariables(variables);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
