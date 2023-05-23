<template>
  <eox-itemfilter>
    <div slot="filterstitle">
      <h4>Filter</h4>
      <hr class="my-2" style="opacity: 0.4" />
    </div>
    <div slot="resultstitle">
      <h4>Results</h4>
      <hr class="my-2" style="opacity: 0.4" />
    </div>
    </eox-itemfilter>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';

export default {
  data: () => ({
    searchItems: [],
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
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
    ...mapMutations('features', {
      setFeatureFilter: 'SET_FEATURE_FILTER',
    }),
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

      this.$nextTick(() => {
        const EOxItemFilter = document.querySelector('eox-itemfilter');
        const configs = {
          esa: {
            filterProperties: ['themes'],
            aggregateResults: 'themes',
            enableSearch: true,
            onSelect: (item) => {
              this.setFeatureFilter({
                indicators: item.code,
              });
            },
          },
          gtif: {
            filterProperties: ['themes'],
            onSelect: (item) => {
              this.setFeatureFilter({
                indicators: item.code,
              });
            },
            exclusiveFilters: true,
          },
        };
        EOxItemFilter.config = configs[this.appConfig.id];
        EOxItemFilter.apply(this.searchItems);
      });
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
