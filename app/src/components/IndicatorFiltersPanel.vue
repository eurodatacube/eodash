<template>
  <eox-itemfilter
    :style="`
      background: ${$vuetify.theme.currentTheme.background};
      z-index: 11;
      pointer-events: all;
    `"
  >
    Filter Indicators
  </eox-itemfilter>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex';
import '@eox/itemfilter';

export default {
  data: () => ({
    searchItems: [],
  }),
  computed: {
    ...mapState('features', ['allFeatures']),
    ...mapGetters('features', [
      'getIndicators',
    ]),
  },
  created() {
    if (this.allFeatures) {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    }
  },
  methods: {
    getSearchItems() {
      const itemArray = [
        ...this.getIndicators
          .filter((i) => !i.dummyFeature)
          .filter(
            (ind, index, self) => self.findIndex((t) => t.code === ind.code) === index,
          )
          .map((i) => ({
            ...i,
            name: i.indicator,
          })),
      ];
      itemArray.sort((a, b) => (a.name.localeCompare(b.name)));
      itemArray.sort((a, b) => (b.filterPriority || 0) - (a.filterPriority || 0));
      this.searchItems = itemArray;

      const EOxItemFilter = document.querySelector('eox-itemfilter');
      EOxItemFilter.filterProperties = ['themes'];
      EOxItemFilter.aggregateResults = 'themes';
      EOxItemFilter.apply(this.searchItems);
    },
  },
  watch: {
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
  },
};
</script>
