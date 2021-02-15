<template>
  <div class="fill-height">
    <v-row class="fill-height mx-0 mt-0" style="width: 100%">
      <indicator-filters />
    </v-row>
  </div>
</template>

<script>
// Utilities
import { mapGetters } from 'vuex';

import IndicatorFilters from '@/components/IndicatorFilters.vue';

export default {
  components: {
    IndicatorFilters,
  },
  computed: {
    ...mapGetters('features', ['getCountries']),
    countryItems() {
      const countries = this.getCountries;
      return countries;
    },
  },
  methods: {
    setCountry(code) {
      console.log(code);
      this.$store.commit('features/SET_FEATURE_FILTER', { countries: code });
    },
  },
};
</script>

<style lang="scss" scoped>
.line {
  display: flex;
  align-items: center;
  .circle {
    width: 22px;
    height: 22px;
    background: var(--v-primary-base);
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
  }
}
.v-list-item__title.title {
  line-height: 2 !important;
}
</style>
