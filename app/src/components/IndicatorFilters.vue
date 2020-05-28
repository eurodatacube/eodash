<template>
  <div style="width: 100%">
    <v-tabs
      v-model="tab"
      :color="$vuetify.theme.themes.light.primary"
      grow
      activeClass="tabActive"
      icons-and-text
    >
      <v-tab
      >
        Countries
        <v-icon>mdi-flag-outline</v-icon>
      </v-tab>
      <v-tab
      >
        Indicators
        <v-icon>mdi-lightbulb-on-outline</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="tab"
      class="fill-height"
    >
      <v-tab-item class="fill-height">
        <v-list dense v-model="country">
          <v-list-item-group v-model="country" color="primary">
            <v-list-item
              @click="selectCountry()"
            >
              <v-list-item-icon class="d-flex align-center mr-2">
                <country-flag country="eu" size='normal' />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>All countries</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="country in countryItems.filter((c) => c.name === 'Regional')"
              :key="country.code"
              @click="selectCountry(country)"
            >
              <v-list-item-icon class="d-flex align-center mr-2">
                <country-flag :country="country.code === 'all'
                  ? 'eu' : country.code" size='normal' />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ country.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              v-for="country in countryItems.filter((c) => c.name !== 'Regional')"
              :key="country.code"
              @click="selectCountry(country)"
            >
              <v-list-item-icon class="d-flex align-center mr-2">
                <country-flag :country="country.code === 'all'
                  ? 'eu' : country.code" size='normal' />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ country.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-tab-item>
      <v-tab-item class="fill-height">
        <v-list dense>
          <v-list-item-group v-model="indicator" color="primary">
            <v-list-item
              @click="selectIndicator()"
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
                  uniqueClasses[classId].includes(i.code))"
                :key="indicator.code"
                @click="selectIndicator(indicator)"
              >
                <v-list-item-icon v-if="indicator.indicator !== ''" class="ml-3 mr-4">
                  <v-icon>{{
                  baseConfig.indicatorClassesIcons[classId] ?
                    baseConfig.indicatorClassesIcons[classId] :
                    'mdi-lightbulb-on-outline'
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="indicator.indicator"></v-list-item-title>
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
    country: 0,
    indicator: 0,
    indicators: {
      environment: 1,
      economy: 0,
      health: 0,
    },
    countrySelection: null,
    indicatorSelection: null,
    indicatorPanel: 0,
  }),
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
    ]),
    ...mapState('config', ['baseConfig']),
    countries() {
      return countries;
    },
    countryItems() {
      return this.getCountries.map((c) => {
        const item = countries.features
          .find((f) => f.properties.alpha2 === c);
        return {
          code: c,
          name: item ? item.properties.name : 'Regional',
        };
      })
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
  methods: {
    selectCountry(selection) {
      this.setFilter({ countries: typeof selection !== 'undefined' ? selection.code : [] });
    },
    selectIndicator(selection) {
      this.setFilter({
        indicators: selection ? [selection.code] : [],
      });
    },
    selectAllCountries() {
      this.countrySelection = null;
      this.setFilter(null);
    },
    setFilter(filter) {
      this.$store.commit('features/SET_FEATURE_FILTER', filter);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
}
.itemActive {
  background: red;
}
</style>
