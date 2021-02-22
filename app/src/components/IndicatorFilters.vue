<template>
  <div style="width: 100%" class="fill-height">
    <v-tabs v-model="tab" grow activeClass="tabActive" icons-and-text>
      <v-tab>
        <v-badge
          v-if="countrySelection !== 'all'"
          color="primary"
          icon="mdi-filter"
          offset-x="-37"
          offset-y="-26"
        >
        </v-badge>
        Countries
        <v-icon class="mb-1">mdi-flag-outline</v-icon>
      </v-tab>
      <v-tab>
        <v-badge
          v-if="indicatorSelection !== 'all'"
          color="primary"
          icon="mdi-filter"
          offset-x="-37"
          offset-y="-26"
        >
        </v-badge>
        Indicators
        <v-icon class="mb-1">mdi-lightbulb-on-outline</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="tab"
      :style="`height: calc(100% - 112px); overflow-y: auto`"
    >
      <v-tab-item class="fill-height">
        <v-list
          dense
          :style="$vuetify.breakpoint.xsOnly && 'padding-bottom: 60px'"
        >
          <v-list-item-group v-model="countrySelection" color="primary">
            <v-list-item
              :value="'all'"
              :disabled="countrySelection === 'all'"
              active-class="itemActive"
            >
              <v-list-item-icon
                v-if="appConfig.id !== 'trilateral'"
                class="d-flex align-center mr-2"
              >
                <country-flag country="eu" size="normal" />
              </v-list-item-icon>
              <v-list-item-icon v-else class="d-flex align-center ml-5 mr-6">
                <v-icon
                  :color="countrySelection === 'all' ? 'white' : 'primary'"
                  >mdi-earth</v-icon
                >
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Available countries</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <template v-for="region in uniqueRegions(countryItems)">
              <v-subheader v-if="region" class="ml-5" :key="region">
                {{ region.toUpperCase() }}
              </v-subheader>
              <v-list-item
                v-for="country in countryItems.filter((cI) =>
                  cI.region ? cI.region === region : true
                )"
                :key="country.code"
                :value="country.code"
                :disabled="countrySelection === country.code"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag
                    :country="country.code === 'all' ? 'eu' : country.code"
                    size="normal"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ country.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-tab-item>
      <v-tab-item class="fill-height">
        <v-list
          dense
          :style="$vuetify.breakpoint.xsOnly && 'padding-bottom: 60px'"
        >
          <v-list-item-group v-model="indicatorSelection" color="primary">
            <v-list-item
              :value="'all'"
              active-class="itemActive"
              :disabled="indicatorSelection === 'all'"
            >
              <v-list-item-icon class="ml-3 mr-4">
                <v-icon>mdi-lightbulb-on-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Available indicators</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <template v-for="classId in Object.keys(uniqueClasses)">
              <v-subheader
                class="ml-5"
                :key="classId"
                v-if="
                  indicatorItems.filter((i) =>
                    uniqueClasses[classId].includes(i.code)
                  ).length > 0
                "
              >
                {{ classId.toUpperCase() }}
              </v-subheader>
              <v-list-item
                v-for="indicator in indicatorItems.filter(
                  (i) =>
                    uniqueClasses[classId].includes(i.code) &&
                    i.indicator !== ''
                )"
                :key="indicator.code"
                :value="indicator.code"
                active-class="itemActive"
                :class="indicator.archived ? 'archived-item' : ''"
                :disabled="indicatorSelection === indicator.code"
              >
                <v-list-item-icon class="ml-3 mr-4">
                  <v-icon>{{
                    baseConfig.indicatorClassesIcons[classId]
                      ? baseConfig.indicatorClassesIcons[classId]
                      : "mdi-lightbulb-on-outline"
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="indicator.indicator"
                    style="
                      text-overflow: unset;
                      overflow: unset;
                      white-space: pre-wrap;
                    "
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
    <v-sheet
      class="d-flex align-center justify-center"
      :style="`width: 100%; height: 40px; ${$vuetify.breakpoint.xsOnly
        ? 'position: absolute; bottom: 0;' : ''}`">
      <v-checkbox
        :value="featureFilters.includeArchived"
        label="Show archived indicators"
        color="primary"
        dense
        hide-details
        class="ma-0"
        @change="
          setFilter({ includeArchived: !featureFilters.includeArchived })
        "
      >
      </v-checkbox>
    </v-sheet>
  </div>
</template>

<script>
// Utilities
import { mapGetters, mapState } from 'vuex';

import CountryFlag from 'vue-country-flag';
import countries from '@/assets/countries.json';

export default {
  components: {
    CountryFlag,
  },
  data: () => ({
    tab: 0,
    indicators: {
      environment: 1,
      economy: 0,
      health: 0,
    },
    countrySelection: 'all',
    indicatorSelection: 'all',
    indicatorPanel: 0,
  }),
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getCountryItems',
    ]),
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('features', ['featureFilters']),
    countries() {
      return countries;
    },
    countryItems() {
      let countryItems;
      if (this.appConfig.customCountryList) {
        countryItems = this.appConfig.customCountryList
          .filter((c) => this.getCountries.includes(c.code))
          .map((c) => {
            const item = countries.features.find(
              (f) => f.properties.alpha2 === c.code,
            );
            return {
              code: c.code,
              name: item.properties.name,
              region: c.region,
            };
          });
      } else {
        countryItems = this.getCountries
          .filter((c) => c !== 'all')
          .map((c) => {
            if (Array.isArray(c)) {
              return c.map((i) => {
                const item = countries.features.find(
                  (f) => f.properties.alpha2 === i,
                );
                return {
                  code: i,
                  name: item.properties.name,
                  region: null,
                };
              });
            }
              //eslint-disable-line
            const item = countries.features.find(
              (f) => f.properties.alpha2 === c,
            );
            return {
              code: c,
              name: item.properties.name,
              region: null,
            };
          })
          // flatten the array
          .flat()
          // filter out duplicates
          .filter(
            (thing, index, self) => self.findIndex((t) => t.code === thing.code) === index,
          )
          .sort((a, b) => (a.name > b.name ? 1 : -1));
      }
      return countryItems;
    },
    uniqueClasses() {
      const classes = {};
      const indDef = this.baseConfig.indicatorsDefinition;
      Object.keys(indDef)
        .filter((key) => indDef[key].hideInFilters !== true)
        .map((key) => {
          if (typeof classes[indDef[key].class] === 'undefined') {
            classes[indDef[key].class] = [key];
          } else {
            classes[indDef[key].class].push(key);
          }
          return null;
        });
      return classes;
    },
    indicatorItems() {
      let indicators = this.getIndicators;
      indicators = indicators
        .filter((i) => !i.dummyFeature)
        .filter(
          (ind, index, self) => self.findIndex((t) => t.code === ind.code) === index,
        );
      indicators.sort((a, b) => {
        const codeA = a.code;
        const codeB = b.code;
        if (codeA < codeB) return -1;
        if (codeB > codeA) return 1;
        return 0;
      });
      return indicators;
    },
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if (
        mutation.type === 'features/INIT_FEATURE_FILTER'
        || mutation.type === 'features/SET_FEATURE_FILTER'
      ) {
        if (mutation.payload.countries) {
          if (Array.isArray(mutation.payload.countries)) {
            if (mutation.payload.countries.length === 0) {
              this.countrySelection = 'all';
            }
          } else {
            this.countrySelection = mutation.payload.countries;
          }
        }
        if (mutation.payload.indicators) {
          if (Array.isArray(mutation.payload.indicators)) {
            if (mutation.payload.indicators.length === 0) {
              this.indicatorSelection = 'all';
            } else {
              [this.indicatorSelection] = mutation.payload.indicators;
            }
          } else {
            this.indicatorSelection = mutation.payload.indicators;
          }
        }
      }
    });
  },
  methods: {
    selectCountry(selection) {
      if (selection === 'all') {
        this.setFilter({ countries: [] });
      } else {
        this.setFilter({ countries: selection });
      }
    },
    selectIndicator(selection) {
      this.setFilter({
        indicators: selection === 'all' ? [] : [selection],
      });
    },
    setFilter(filter) {
      this.$store.commit('features/SET_FEATURE_FILTER', filter);
    },
    uniqueRegions(countryItems) {
      return countryItems
        .map((c) => c.region)
        .filter(
          (thing, index, self) => self.findIndex((t) => t === thing) === index,
        );
    },
  },
  watch: {
    countrySelection(val) {
      this.selectCountry(val);
    },
    indicatorSelection(val) {
      this.selectIndicator(val);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
}
.v-list-item__icon .flag {
  border: 1px solid lightgray;
  background-position-x: -1px;
}
.v-application.theme--dark {
  .v-list-item__icon .flag {
    border: 1px solid transparent;
  }
}
.itemActive {
  background: var(--v-primary-base);
  color: white !important;
  .v-list-item__icon .flag {
    border: 1px solid transparent;
  }
}
::v-deep .archived-item {
  opacity: 0.65;
}
</style>
