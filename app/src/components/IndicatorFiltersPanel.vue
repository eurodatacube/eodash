<template>
  <eox-itemfilter class="pa-2" ref="itemFilterEl" style="height: max-content;">
    <h4 v-if="appConfig.id !== 'gtif'" slot="filterstitle">
      Filter
    </h4>
    <span v-else slot="filterstitle"></span>
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
    itemFilterStyleOverride() {
      let styleOverride = this.appConfig.id === 'gtif' ? `
        li[data-identifier="energy transition"] label input[type=radio]:after  {
          background-image: url("https://gtif.esa.int/img/gtif/icons/energy-transition-trimmy.png");
        }
        li[data-identifier="mobility transition"] label input[type=radio]:after  {
          background-image: url("https://gtif.esa.int/img/gtif/icons/mobility-transition-trimmy.png");
        }
        li[data-identifier="sustainable cities"] label input[type=radio]:after  {
          background-image: url("https://gtif.esa.int/img/gtif/icons/sustainable-transition-trimmy.png");
        }
        li[data-identifier="carbon accounting"] label input[type=radio]:after  {
          background-image: url("https://gtif.esa.int/img/gtif/icons/carbon-finance-trimmy.png");
        }
        li[data-identifier="EO adaptation services"] label input[type=radio]:after {
          background-image: url("https://gtif.esa.int/img/gtif/icons/eo-adaptation-trimmy.png");
        }
        #filter-reset {
          display: none;
        }
      ` : '';
      styleOverride += `
        #filters {
          margin-bottom: 0;
        }
        eox-selectionlist ul li, #filters li {
          padding: 0;
        }`;
      return styleOverride;
    },
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
    clone(items) {
      return items.map((item) => (Array.isArray(item) ? this.clone(item) : item));
    },
    getSearchItems() {
      const itemArray = [
        ...this.getIndicators,
      ];
      // If already set we do not need to set it again
      if (this.searchItems.length > 0) {
        return;
      }
      this.searchItems = this.clone(itemArray);
      const customOrderGTIF = {
        'energy transition': 0,
        'mobility transition': 1,
        'sustainable cities': 2,
        'carbon accounting': 3,
        'EO adaptation services': 4,
        // placeholder: 5,
      };
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
                sort: (a, b) => customOrderGTIF[a] - customOrderGTIF[b],
                // sort:(a,b)=>b.localeCompare(a),
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
          #container-results{
             overflow:hidden;
           }
           form#itemfilter{
             overflow: auto;
           }
           ${this.itemFilterStyleOverride}
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
