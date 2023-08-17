<template>
  <eox-itemfilter class="pa-2">
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
    itemfilter: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    ...mapState('features', ['allFeatures']),
    ...mapGetters('features', [
      'getGroupedFeatures',
    ]),
    ...mapState('indicators', ['indicators', 'selectedIndicator']),
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
        this.itemfilter = document.querySelector('eox-itemfilter');
        const configs = {
          esa: {
            titleProperty: 'title',
            filterProperties: [
              {
                keys: ['title', 'countries', 'cities'],
                title: 'Search',
                type: 'text',
                expanded: true,
              },
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
            filterProperties: [
              { key: 'themes', title: 'Theme' },
            ],
            onSelect: (item) => {
              this.setSelectedIndicator(item);
            },
            // exclusiveFilters: true,
            aggregateResults: 'themes',
            fuseConfig: {
              keys: [
                'title', 'description', 'themes', 'region', 'tags', 'satellite', 'sensor',
                'countries', 'cities',
              ],
            },
          },
        };
        this.itemfilter.config = configs[this.appConfig.id];
        this.itemfilter.apply(this.searchItems);
      });
    },
  },
  watch: {
    indicators() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
    selectedIndicator() {
      // TODO: This is not working, maybe there is another approach, would only need to be set
      // once loading page
      // this.itemfilter.selectedResult = this.selectedIndicator;
    },
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
  },
};
</script>
