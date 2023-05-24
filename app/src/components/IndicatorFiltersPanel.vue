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
      'getGroupedFeatures',
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
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    getSearchItems() {
      const itemArray = [
        ...this.getIndicators
          .filter((i) => !i.dummyFeature)
          .filter(
            (ind, index, self) => self.findIndex((t) => t.code === ind.code) === index,
          ),
      ];
      this.searchItems = itemArray;

      this.$nextTick(() => {
        const EOxItemFilter = document.querySelector('eox-itemfilter');
        const configs = {
          esa: {
            titleProperty: 'title',
            filterProperties: ['themes', 'region'],
            aggregateResults: 'themes',
            enableSearch: true,
            enableHighlighting: true,
            onSelect: (item) => {
              console.log(this.getGroupedFeatures[0].properties.indicatorObject);
              this.setFeatureFilter({
                indicators: item.code,
              });
              if (this.getGroupedFeatures[0].properties.indicatorObject.siteName === 'global') {
                this.setSelectedIndicator(
                  this.getGroupedFeatures[0].properties.indicatorObject,
                );
              } else {
                this.setSelectedIndicator(null);
              }
            },
            fuseConfig: {
              keys: ['title', 'description', 'themes', 'region'],
            },
          },
          gtif: {
            titleProperty: 'title',
            filterProperties: ['themes'],
            onSelect: (item) => {
              this.setFeatureFilter({
                indicators: item.code,
              });
              if (this.getGroupedFeatures[0].properties.indicatorObject.siteName === 'global') {
                this.setSelectedIndicator(
                  this.getGroupedFeatures[0].properties.indicatorObject,
                );
              } else {
                this.setSelectedIndicator(null);
              }
            },
            exclusiveFilters: true,
            fuseConfig: {
              keys: ['title'],
            },
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
