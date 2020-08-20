<template>
  <div style="width: 100%" class="fill-height">
    <v-tabs
      v-model="tab"
      :color="$vuetify.theme.themes.light.primary"
      grow
      activeClass="tabActive"
      icons-and-text
    >
      <v-tab
      >
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
      <v-tab
      >
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
      :style="`height: calc(100% - 72px); overflow-y: auto`"
    >
      <v-tab-item class="fill-height">
        <v-list dense>
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
                <country-flag country="eu" size='normal' />
              </v-list-item-icon>
              <v-list-item-icon v-else class="d-flex align-center ml-5 mr-6">
                <v-icon :color="countrySelection === 'all' ? 'white' : 'primary'">mdi-earth</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>All countries</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <template v-if="appConfig.id !== 'trilateral'">
              <v-list-item
                v-for="country in countryItems"
                :key="country.code"
                :value="country.code"
                :disabled="countrySelection === country.code"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag :country="country.code === 'all'
                    ? 'eu' : country.code" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ country.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>
              <v-subheader>NORTH AMERICA</v-subheader>
              <v-list-item
                value="US"
                :disabled="countrySelection === 'US'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="US" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>United States of America</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-subheader>EUROPE</v-subheader>
              <v-list-item
                value="BE"
                :disabled="countrySelection === 'BE'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="BE" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Belgium</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="HR"
                :disabled="countrySelection === 'HR'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="HR" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Croatia</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="FR"
                :disabled="countrySelection === 'FR'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="FR" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>France</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="DE"
                :disabled="countrySelection === 'DE'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="DE" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Germany</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="IT"
                :disabled="countrySelection === 'IT'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="IT" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Italy</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="SI"
                :disabled="countrySelection === 'SI'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="SI" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Slovenia</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="ES"
                :disabled="countrySelection === 'ES'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="ES" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Spain</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-subheader>ASIA</v-subheader>
              <v-list-item
                value="JP"
                :disabled="countrySelection === 'JP'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="JP" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Japan</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="CN"
                :disabled="countrySelection === 'CN'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="CN" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>China</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="SG"
                :disabled="countrySelection === 'SG'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="SG" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Singapore</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="BD"
                :disabled="countrySelection === 'BD'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="BD" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Bangladesh</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="IN"
                :disabled="countrySelection === 'IN'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="IN" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>India</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-subheader>SOUTH AMERICA</v-subheader>
              <v-list-item
                value="BR"
                :disabled="countrySelection === 'BR'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="BR" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Brazil</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="CL"
                :disabled="countrySelection === 'CL'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="CL" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chile</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                value="PE"
                :disabled="countrySelection === 'PE'"
                active-class="itemActive"
              >
                <v-list-item-icon class="d-flex align-center mr-2">
                  <country-flag country="PE" size='normal' />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Peru</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-tab-item>
      <v-tab-item class="fill-height">
        <v-list dense>
          <v-list-item-group
            v-model="indicatorSelection"
            color="primary"
          >
            <v-list-item
              :value="'all'"
              active-class="itemActive"
              :disabled="indicatorSelection === 'all'"
            >
              <v-list-item-icon class="ml-3 mr-4">
                <v-icon>mdi-lightbulb-on-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>All indicators</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <template v-for="classId in Object.keys(uniqueClasses)">
              <v-subheader class="ml-5"
                :key="classId" v-if="indicatorItems
                  .filter((i) => uniqueClasses[classId].includes(i.code)).length > 0">
                   {{ classId.toUpperCase() }}
              </v-subheader>
              <v-list-item
                v-for="indicator in indicatorItems.filter((i) =>
                  uniqueClasses[classId].includes(i.code) && i.indicator!=='')"
                :key="indicator.code"
                :value="indicator.code"
                active-class="itemActive"
                :disabled="indicatorSelection === indicator.code"
              >
                <v-list-item-icon class="ml-3 mr-4">
                  <v-icon>{{
                  baseConfig.indicatorClassesIcons[classId] ?
                    baseConfig.indicatorClassesIcons[classId] :
                    'mdi-lightbulb-on-outline'
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="indicator.indicator"
                    style="text-overflow: unset; overflow: unset; white-space: pre-wrap;"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// Utilities
import {
  mapGetters,
  mapState,
} from 'vuex';

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
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    countries() {
      return countries;
    },
    countryItems() {
      return this.getCountries
        .filter((c) => c !== 'all')
        .map((c) => {
          if (Array.isArray(c)) {
            return c.map((i) => {
              const item = countries.features
                .find((f) => f.properties.alpha2 === i);
              return {
                code: i,
                name: item.properties.name,
              };
            });
          } else { //eslint-disable-line
            const item = countries.features
              .find((f) => f.properties.alpha2 === c);
            return {
              code: c,
              name: item.properties.name,
            };
          }
        })
        // flatten the array
        .flat()
        // filter out duplicates
        .filter((thing, index, self) => self.findIndex((t) => t.code === thing.code) === index)
        .sort((a, b) => ((a.name > b.name) ? 1 : -1));
    },
    uniqueClasses() {
      const classes = {};
      const indDef = this.baseConfig.indicatorsDefinition;
      Object.keys(indDef).map((key) => {
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
        .filter((ind, index, self) => self.findIndex((t) => t.code === ind.code) === index);
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
      if (mutation.type === 'features/INIT_FEATURE_FILTER' || mutation.type === 'features/SET_FEATURE_FILTER') {
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
.itemActive {
  background: var(--v-primary-base);
  color: white !important;
  .v-list-item__icon .flag {
    border: 1px solid transparent;
  }
}
</style>
