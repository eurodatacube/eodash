<template>
  <eox-itemfilter class="pa-2" style="height: 650px;" >
    <h4 slot="filterstitle" style="margin-top: 8px">
      {{this.appConfig.id === "gtif" ? "Domains" : "Filter"}}
    </h4>
    <h4 slot="resultstitle" style="margin-top: 8px">
      {{this.appConfig.id === "gtif" ? "Tools" : "Indicators"}}
    </h4>
  </eox-itemfilter>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
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
    ...mapActions('gtif', {
      setDomain: 'setDomainFromFilter',
    }),
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    getSearchItems() {
      const itemArray = [
        ...this.getIndicators,
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
                keys: ['title', 'description', 'themes', 'region'],
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
              {
                key: 'themes', title: 'Theme', featured: true, type: 'select',
              },
            ],
            onSelect: (item) => {
              this.setSelectedIndicator(item);
            },
            onFilter: (items) => {
              this.setDomain(items);
            },
            // exclusiveFilters: true,
            aggregateResults: 'themes',
            styleOverride: `
            #filters input[type=radio],
            #results input[type=radio]{
              width:36px;
              height:36px;
              margin: 6px;
            }
              #filters input[type=radio]:after,
              #results input[type=radio]:after {
                content: "";
                background-size: cover;
                background-position: center center;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                margin: 0;
              }
              #filters input[type=radio][id="energy-transition"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/energy-transition-trimmy.png");
              }
              #filters input[type=radio][id="mobility-transition"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/mobility-transition-trimmy.png");
              }
              #filters input[type=radio][id="sustainable-cities"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/sustainable-transition-trimmy.png");
              }
              #filters input[type=radio][id="carbon-accounting"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/carbon-finance-trimmy.png");
              }
              #filters input[type=radio][id="eo-adaptation-services"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/eo-adaptation-trimmy.png");
              }
              #filter-reset {
                display: none;
              }
            `,
          },
        };
        this.itemfilter.config = configs[this.appConfig.id];
        this.itemfilter.apply(this.searchItems);
        let flags = `
          [data-filter=countries] .title {
            display: flex;
            align-items: center;
            position: relative;
            text-indent: -9999px;
          }
          [data-filter=countries] .title:before {
            content: "";
            width: 20px;
            height: 15px;
            margin-right: 4px;
          }
          [data-filter=countries] .title:after {
            text-indent: 0px;
          }
        `;
        // TODO currently hotlinking to assets on GitHub, replace
        countries.features.map((c) => c.properties).forEach((cP) => {
          flags += `
            [data-filter=countries] input[type=checkbox]#${cP.alpha2}+.title:before {
              background-image: url("https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${cP.alpha2?.toLowerCase()}.svg");
            }
            [data-filter=countries] input[type=checkbox]#${cP.alpha2}+.title:after {
              content: "${cP.name}";
            }
          `;
        });
        this.itemfilter.styleOverride = `
          ${flags}
          ${configs[this.appConfig.id].styleOverride}
        `;
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
