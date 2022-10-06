<template>
  <v-col v-if="cogFilters"
    :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
    :style="`height: auto`"
  >
    <v-card v-for="(filter) in cogFilters.filters"
      :key="filter.id"
    >
      <v-subheader>{{filter.label}}</v-subheader>
      <v-range-slider
            :min="filter.min"
            :max="filter.max"
            :step="(filter.max-filter.min)/100"
            :value="[filter.min, filter.max]"
            @input="(evt) => updateMap(evt, filter.id)"
      ></v-range-slider>
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
  data: () => ({
  }),
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
