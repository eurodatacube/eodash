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
      };
      this.$nextTick(() => {
        this.itemfilter = document.querySelector('eox-itemfilter');
        const themesPresetState = {};
        const anySelectedTheme = this.$store.state.themes.currentTheme;
        if (anySelectedTheme) {
          themesPresetState.state = {
            [anySelectedTheme.slug]: true,
          };
        }
        const configs = {
          esa: {
            titleProperty: 'name',
            filterProperties: [
              {
                keys: ['name', 'description', 'themes'],
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
              this.toggleSelectedItem(item);
            },
          },
          trilateral: {
            titleProperty: 'name',
            filterProperties: [
              {
                keys: ['name', 'description'],
                title: 'Search',
                type: 'text',
                expanded: true,
                featured: true,
              },
              { key: 'tags', title: 'Tag' },
              { key: 'satellite', title: 'Satellite' },
              { key: 'sensor', title: 'Sensor' },
              { key: 'countries', title: 'Country' },
              { key: 'cities', title: 'City' },
              { key: 'themes', title: 'Theme', ...themesPresetState },
            ],
            aggregateResults: 'themes',
            enableHighlighting: true,
            onSelect: (item) => {
              this.toggleSelectedItem(item);
            },
          },
          gtif: {
            titleProperty: 'name',
            filterProperties: [
              {
                key: 'themes',
                title: 'Theme',
                featured: true,
                sort: (a, b) => customOrderGTIF[a] - customOrderGTIF[b],
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
                this.toggleSelectedItem();
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
                    name: narrative.name,
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
        // TODO currently hotlinking to assets on GitHub, replace

        // ANOTHER TODO: currently the race and trilateral filters are in inline mode
        // which still creates the shadowRoot of the child ItemFilter components, so we can
        // not use styleOverride to reach them, commenting out this part of styleOverride now

        // YET ANOTHER TODO: harmonize countries (currently both the alpha2 eg. AT are used and the full country names eg. Austria), I think we can not expect geodb values to get harmonized, so we should try to remedy in the client by preprocessing the values
        // let flags = ``;
        //   [data-filter=countries] .title {
        //     display: flex;
        //     align-items: center;
        //     position: relative;
        //     text-indent: -9999px;
        //   }
        //   [data-filter=countries] .title:before {
        //     content: "";
        //     width: 20px;
        //     height: 15px;
        //     margin-right: 4px;
        //   }
        //   [data-filter=countries] .title:after {
        //     text-indent: 0px;
        //   }
        // `;
        // countries.features.map((c) => c.properties).forEach((cP) => {
        //   flags += `
        //     [data-filter=countries] [data-identifier=${cP.alpha2}] span.title:before {
        //       background-image: url("https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${cP.alpha2?.toLowerCase()}.svg");
        //     }
        //     [data-filter=countries] [data-identifier=${cP.alpha2}] span.title:after {
        //       content: "${cP.name}";
        //     }
        //   `;
        // });
        const flags = '';
        this.itemfilter.styleOverride = `
          ${this.itemFilterStyleOverride}
          ${flags}
          ${configs[this.appConfig.id].styleOverride}
          #container-results{
             overflow:hidden;
           }
           form#itemfilter{
             overflow: auto;
           }
           * {
            font-family: 'NotesESA' !important;
           }
        `;
      });
    },
    toggleSelectedItem(item) {
      if (this.selectedIndicator && item.indicator === this.selectedIndicator.indicator) {
        this.setSelectedIndicator(null);
        this.itemfilter.selectedResult = null;
        this.itemfilter.requestUpdate();
      } else {
        // do not directly set item from filter because item highlighting via search
        // field is adding html syntax to the "name" which we use elsewhere in the app
        // pick an indicator based on match of unique collection link instead
        const match = this.indicators.find((indicator) => item.link === indicator.link);
        this.setSelectedIndicator(match);
      }
    },
  },
  watch: {
    indicators() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
    selectedIndicator() {
      if (this.itemfilter) {
        this.itemfilter.selectedResult = this.selectedIndicator;
      }
    },
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      // programtically show the UIPanel as expanded
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
  },
};
</script>
