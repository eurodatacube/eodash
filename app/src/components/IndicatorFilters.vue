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
            <v-subheader class="ml-5">ENVIRONMENT</v-subheader>
            <v-list-item
              v-for="indicator in indicatorItems.filter((i) => i.code[0] === 'N')"
              :key="indicator.code"
              @click="selectIndicator(indicator)"
            >
              <v-list-item-icon class="ml-3 mr-4">
                <v-icon>mdi-earth</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="indicator.indicator"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-subheader class="ml-5">ECONOMY</v-subheader>
            <v-list-item
              v-for="indicator in indicatorItems.filter((i) => i.code[0] === 'E')"
              :key="indicator.code"
              @click="selectIndicator(indicator)"
            >
              <v-list-item-icon class="ml-3 mr-4">
                <v-icon>mdi-currency-eur</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="indicator.indicator"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-subheader class="ml-5"
              v-if="indicatorItems
                .filter((i) => i.code[0] === 'H').length > 0">HEALTH</v-subheader>
            <v-list-item
              v-for="indicator in indicatorItems.filter((i) => i.code[0] === 'H')"
              :key="indicator.code"
              @click="selectIndicator(indicator)"
            >
              <v-list-item-icon class="ml-3 mr-4">
                <v-icon>mdi-hospital-box-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="indicator.indicator"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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
