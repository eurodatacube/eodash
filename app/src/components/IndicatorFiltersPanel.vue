<template>
  <eox-itemfilter class="pa-2" ref="itemFilterEl" style="height: max-content;">
    <h4 slot="filterstitle">
      {{this.appConfig.id === "gtif" ? "Domains" : "Filter"}}
    </h4>
    <h4 slot="resultstitle">
      {{this.appConfig.id === "gtif" ? (toolsToggle ? "Tools" : "Narratives") : "Indicators"}}
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
      'getFeatures',
    ]),
    ...mapState('indicators', ['indicators', 'selectedIndicator']),
    ...mapGetters('indicators', [
      'getIndicators',
    ]),
    ...mapState('gtif', [
      'currentDomain',
      'toolsToggle',
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
    ...mapActions('gtif', [
      'setCurrentDomain',
    ]),
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
                key: 'themes',
                title: 'Theme',
                featured: true,
                type: 'select',
                ...(this.currentDomain && this.currentDomain !== 'landing' ? {
                  state: {
                    [this.currentDomain.replace('gtif-', '')
                      .replaceAll('-', ' ')
                      .replaceAll(/\beo\b/g, 'EO')]: true,
                  },
                } : {}),
              },
            ],
            onFilter: (items, filters) => {
              const domains = Object.keys(filters.themes.state)
                .filter((k) => filters.themes.state[k])
                .map((k) => k.replaceAll(' ', '-').toLowerCase());
              if (domains.length > 0) {
                this.setCurrentDomain(`gtif-${domains[0]}`);
              }
            },
            onSelect: (item) => {
              if (this.toolsToggle) {
                this.setSelectedIndicator(item);
              } else {
                this.$router.push({ name: item.id });
              }
            },
            // exclusiveFilters: true,
            aggregateResults: 'tags',
            expandResults: false,
            styleOverride: `
            #filters input[type=radio]{
              width:36px;
              height:36px;
              margin: 6px;
            }
              #filters input[type=radio]:after {
                content: "";
                background-size: cover;
                background-position: center center;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                margin: 0;
              }
              #filters input[type=radio][id="energy transition"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/energy-transition-trimmy.png");
              }
              #filters input[type=radio][id="mobility transition"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/mobility-transition-trimmy.png");
              }
              #filters input[type=radio][id="sustainable cities"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/sustainable-transition-trimmy.png");
              }
              #filters input[type=radio][id="carbon accounting"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/carbon-finance-trimmy.png");
              }
              #filters input[type=radio][id="EO adaptation services"]:after {
                background-image: url("https://gtif.esa.int/img/gtif/icons/eo-adaptation-trimmy.png");
              }
              #results input[type=radio][id="gtif-carbon-accounting"]:after,
              #results input[type=radio][id="gtif-energy-transition"]:after,
              #results input[type=radio][id="gtif-eo-adaptation-services"]:after,
              #results input[type=radio][id="gtif-eo-adaptation-services-snow"]:after,
              #results input[type=radio][id="gtif-mobility-transition"]:after,
              #results input[type=radio][id="gtif-sustainable-cities"]:after {
                content: "";
                background-repeat: no-repeat;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Epage-next-outline%3C/title%3E%3Cpath d='M22,3H5A2,2 0 0,0 3,5V9H5V5H22V19H5V15H3V19A2,2 0 0,0 5,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M7,15V13H0V11H7V9L11,12L7,15M20,13H13V11H20V13M20,9H13V7H20V9M17,17H13V15H17V17Z' /%3E%3C/svg%3E");
              }
              #filter-reset {
                display: none;
              }
              #container-results{
                overflow:hidden;
              }
              form#itemfilter{
                overflow: auto;
              }
            `,
          },
        };
        this.itemfilter.config = configs[this.appConfig.id];
        if (this.appConfig.id === 'gtif') {
          this.$watch('toolsToggle', (inToolsMode) => {
            if (inToolsMode) {
              this.itemfilter.classList.remove('narratives');
              this.itemfilter.config.aggregateResults = configs[this.appConfig.id].aggregateResults;
              this.itemfilter.apply(this.searchItems.map((item) => ({
                ...item,
                // Temporary hack to properly display titles, ideally should be looked up
                themes: item.themes.map((theme) => theme.replaceAll('-', ' ').replaceAll(/\beo\b/g, 'EO')),
              })));
            } else {
              this.itemfilter.classList.add('narratives');
              this.itemfilter.config.aggregateResults = false;
              this.itemfilter.apply(this.$store.state.gtif.domains.reduce((acc, curr) => {
                curr.narratives.forEach((narrative) => {
                  acc.push({
                    title: narrative.name,
                    id: narrative.routeName,
                    // Temporary hack to properly display titles, ideally should be looked up
                    themes: [curr.name.toLowerCase().replaceAll('-', ' ').replaceAll(/\beo\b/g, 'EO')],
                  });
                });
                return acc;
              }, []));
            }
          }, {
            immediate: true,
          });
        } else {
          this.itemfilter.apply(this.searchItems);
        }
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
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
  },
};
</script>
