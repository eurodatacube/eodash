<template>
  <v-col v-if="filters"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
    <v-card class="pa-3"    >
      <div v-for="key in Object.keys(filters)"
        :key="key"
      >
        <span
          v-if="filters[key].header"
          class="pl-8 ml-10"
          style="font-size:20px; color: #000000;">
          {{filters[key].label}}
        </span>
        <span v-else class="pl-8 ml-10" style="color: #7a7a7a;"> {{filters[key].label}} </span>
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
      <v-row class="pa-3 justify-center">
        <v-btn small class="mr-3" color="primary">Export best zones</v-btn>
        <v-btn small class="ml-3" color="primary">Create report</v-btn>
      </v-row>
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
