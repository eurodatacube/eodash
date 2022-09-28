<template>
  <v-col v-if="cogFilters"
    :cols="$vuetify.breakpoint.mdAndDown || !expanded ? 12 : 6"
    :style="`height: auto`"
  >
    <v-card v-for="(filter) in cogFilters"
      :key="filter.id"
    >
      <v-subheader>{{filter.label}}</v-subheader>
      <v-range-slider
            :max="filter.max"
            :min="filter.min"
      ></v-range-slider>
    </v-card>
  </v-col>
</template>

<script>

// imports

export default {
  name: 'FilterControls',
  components: {},
  props: {
    cogFilters: Object,
  },
  data: () => ({
  }),
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
