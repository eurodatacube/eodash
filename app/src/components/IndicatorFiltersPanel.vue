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
      'getGroupedFeatures',
    ]),
    ...mapState('indicators', ['indicators']),
    ...mapGetters('indicators', [
      'getIndicators',
    ]),
  },
  created() {
    if (this.indicators) {
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
        ...this.getIndicators,
        /*
        .filter((i) => !i.dummyFeature)
        .filter(
          (ind, index, self) => self.findIndex((t) => t.code === ind.code) === index,
        ),
        */
      ];
      // If already set we do not need to set it again
      if (this.searchItems.length > 0) {
        return;
      }
      this.searchItems = itemArray;

      this.$nextTick(() => {
        const EOxItemFilter = document.querySelector('eox-itemfilter');
        const configs = {
          esa: {
            titleProperty: 'title',
            filterProperties: [
              // { key: 'themes', title: 'Theme' },
              { key: 'tags', title: 'Tag' },
              { key: 'satellite', title: 'Satellite' },
              { key: 'sensor', title: 'Sensor' },
              { key: 'countries', title: 'Country' },
              { key: 'cities', title: 'City' },
            ],
            aggregateResults: 'themes',
            enableSearch: true,
            enableHighlighting: true,
            onSelect: (item) => {
              this.setSelectedIndicator(item);
            },
            fuseConfig: {
              keys: [
                'title', 'description', 'themes', 'region', 'tags', 'satellite', 'sensor',
                'countries', 'cities',
              ],
            },
          },
          trilateral: {
            titleProperty: 'title',
            filterProperties: [
              // { key: 'themes', title: 'Theme' },
              { key: 'tags', title: 'Tag' },
              { key: 'satellite', title: 'Satellite' },
              { key: 'sensor', title: 'Sensor' },
              { key: 'countries', title: 'Country' },
              { key: 'cities', title: 'City' },
            ],
            aggregateResults: 'themes',
            enableSearch: true,
            enableHighlighting: true,
            onSelect: (item) => {
              this.setSelectedIndicator(item);
            },
            fuseConfig: {
              keys: [
                'title', 'description', 'themes', 'region', 'tags', 'satellite', 'sensor',
                'countries', 'cities',
              ],
            },
          },
          gtif: {
            titleProperty: 'title',
            filterProperties: ['themes'],
            onSelect: (item) => {
              this.setSelectedIndicator(item);
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
    indicators() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
  },
};
</script>
