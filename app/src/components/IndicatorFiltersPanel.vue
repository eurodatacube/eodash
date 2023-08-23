<template>
  <eox-itemfilter class="pa-2"></eox-itemfilter>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';

import countries from '@/assets/countries.json';

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
                keys: ['title', 'countries', 'cities', 'themes'],
                title: 'Search',
                type: 'text',
                expanded: true,
                featured: true,
              },
              // { key: 'themes', title: 'Theme' },
              { key: 'tags', title: 'Tag' },
              { key: 'satellite', title: 'Satellite' },
              { key: 'sensor', title: 'Sensor' },
              { key: 'countries', title: 'Country' },
              { key: 'cities', title: 'City' },
            ],
            aggregateResults: 'themes',
            enableHighlighting: true,
            onSelect: (item) => {
              this.setSelectedIndicator(item);
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
            enableHighlighting: true,
            onSelect: (item) => {
              this.setSelectedIndicator(item);
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
          },
        };
        this.itemfilter.config = configs[this.appConfig.id];
        this.itemfilter.apply(this.searchItems);
        let flags = `
          [data-filter=countries] .title {
            display: flex;
            align-items: center;
            position: relative;
          }
          [data-filter=countries] .title:before {
            content: "";
            width: 20px;
            height: 15px;
            margin-right: 4px;
          }
        `;
        // TODO currently hotlinking to assets on GitHub, replace
        countries.features.map((c) => c.properties.alpha2).forEach((c) => {
          flags += `
          [data-filter=countries] input[type=checkbox]#${c}+.title:before {
              background-image: url("https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${c?.toLowerCase()}.svg");
            }
          `;
        });
        this.itemfilter.styleOverride = `${flags}`;
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
      this.itemfilter.selectedResult = this.selectedIndicator;
    },
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
  },
};
</script>
