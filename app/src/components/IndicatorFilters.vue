<template>
  <div
    class="fill-height pa-5"
    :class="input && input.length > 0 ? 'dirty' : 'new'"
    style="position: absolute; top: 0; left: 0; width: 320px"
  >
    <v-autocomplete
      hide-details
      v-model="isDropdownEnabled"
      solo
      rounded
      :items="selectionItems"
      prepend-inner-icon="mdi-magnify"
      clearable
      auto-select-first
      return-object
      item-text="name"
      label="Search here"
      :search-input.sync="input"
      attach="#list"
      @click:clear="autoCompleteClear"
      @change="autoCompleteChange"
      @focus="autoCompleteFocus"
      @blur="autoCompleteBlur"
    >
        <template v-slot:selection="{ item }">
          <v-row align="center">
            <template v-if="item.location || item.indicator">
              <v-icon>{{
                baseConfig.indicatorClassesIcons[item.class]
                  ? baseConfig.indicatorClassesIcons[item.class]
                  : "mdi-lightbulb-on-outline"
              }}</v-icon>
            </template>

            <template v-else>
              <country-flag
                :country="item.code === 'all' ? 'eu' : item.code"
                size="normal"
              />
            </template>

            <span v-text="item.name"></span>
          </v-row>
        </template>
        <template v-slot:item="data">
          <template v-if="data.item.location">
            <v-list-item-icon class="ml-3 mr-4">
              <v-icon>{{
                baseConfig.indicatorClassesIcons[data.item.class]
                  ? baseConfig.indicatorClassesIcons[data.item.class]
                  : "mdi-lightbulb-on-outline"
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="data.item.name"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-else-if="data.item.indicator">
            <v-list-item-icon class="ml-3 mr-4">
              <v-icon>{{
                baseConfig.indicatorClassesIcons[data.item.class]
                  ? baseConfig.indicatorClassesIcons[data.item.class]
                  : "mdi-lightbulb-on-outline"
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-if="data.item.indicatorOverwrite"
                v-text="data.item.indicatorOverwrite"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
              <v-list-item-title v-else
                v-text="data.item.indicator"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-icon class="d-flex align-center mr-2">
              <country-flag
                :country="data.item.code === 'all' ? 'eu' : data.item.code"
                size="normal"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
    </v-autocomplete>
    <div class="rounded-xl mt-3 pa-3 white" style="outline: 1px solid #aaa" v-if="isDropdownEnabled">
      <div id="list" class="white">
        <!-- <v-list subheader class="customList fill-height">
          <v-subheader>Indicator (custom list!)</v-subheader>
          <v-list-item-group v-model="selected">
            <v-list-item v-for="(item, i) in values" :key="i">
              <v-list-item-content>
                {{item}}
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
  </div> -->
  <!-- <div class="fill-height" style="overflow-y: auto"> -->
    <v-list
      dense
      class="customList fill-height pt-0"
      :style="$vuetify.breakpoint.xsOnly && 'padding-bottom: 60px'"
    >
      <v-list-item-group v-model="indicatorSelection" color="primary">
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
              <v-list-item-title v-if="indicator.indicatorOverwrite"
                v-text="indicator.indicatorOverwrite"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
              <v-list-item-title v-else
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
  </div>
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
  data() {
    return {
      // Disable the dropdown by default on smaller screens.
      isDropdownEnabled: !this.$vuetify.breakpoint.smAndDown,
      input: '',
      indicators: {
        environment: 1,
        economy: 0,
        health: 0,
      },
      countrySelection: 'all',
      indicatorSelection: 'all',
    };
  },
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getCountryItems',
      'getGroupedFeatures',
    ]),
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('features', ['featureFilters']),
    countries() {
      return countries;
    },
    selectionItems() {
      return this.countryItems
        .concat(this.indicatorItems.map((i) => ({
          ...i,
          name: i.indicator,
        })))
        .concat(this.allFeatures);
    },
    allFeatures() {
      return this.getGroupedFeatures.map((f) => {
        const country = this.countryItems
          .find((c) => c.code === f.properties.indicatorObject.country)
          ? this.countryItems.find((c) => c.code === f.properties.indicatorObject.country).name
          : 'X';

        return {
        // country: country,
          class: this.indicatorItems
            .find((i) => i.code === f.properties.indicatorObject.indicator).class,
          location: f.properties.indicatorObject.city,
          name: `${f.properties.indicatorObject.city} (${country}): ${this.getIndicator(f.properties.indicatorObject)}`,
          // type: this.getClass(f),
          indicator: this.getIndicator(f.properties.indicatorObject),
          // code: f.properties.indicatorObject.indicator,
          // indicatorValue: this.getIndicatorLabel(f.properties.indicatorObject),
          // indicatorColor: this.getColor(f.properties.indicatorObject),
          indicatorObject: f.properties.indicatorObject,
        };
      });
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
          .filter((c) => c !== 'all' && c !== 'indicatorall')
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
    getIndicator(indObj) {
      let ind = indObj.description;
      if (this.baseConfig.indicatorsDefinition[indObj.indicator]
        && this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite) {
        ind = this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite;
      }
      return ind;
    },
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
    autoCompleteChange(input) {
      console.log(input);
      if (input.indicator) {
        if (input.indicatorObject) {
          this.selectIndicator(input.indicatorObject.indicator);
          this.$store.commit(
            'indicators/SET_SELECTED_INDICATOR',
            input.indicatorObject,
          );
        } else {
          this.selectIndicator(input.code);
        }
      } else {
        this.selectCountry(input.code);
      }
    },
    autoCompleteClear() {
      this.selectCountry('all');
      this.selectIndicator('all');
    },
    autoCompleteFocus() {
      if (!this.isDropdownEnabled) {
        console.log(`setting isDropdownEnabled to true`);
        this.isDropdownEnabled = true;
      }
    },
    autoCompleteBlur() {
      if (this.$vuetify.breakpoint.smAndDown) {
        console.log(`setting isDropdownEnabled to false`);
        this.isDropdownEnabled = false;
      }
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
// ::v-deep .v-expansion-panel-content__wrap {
//   padding-left: 0;
//   padding-right: 0;
// }
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

::v-deep .v-autocomplete__content {
  position: relative;
  height: auto;
  max-height: unset !important;
  top: 0 !important;
}
.new ::v-deep .v-autocomplete__content {
  display: none;
}
.dirty .customList {
  display: none;
}

#list {
  /*height: 200px;*/
  height: auto;
  /*min-height: 40px;*/
  max-height: calc(100vh - 250px);
  background: grey;
  /*overflow-y: auto;*/
  overflow-x: hidden;
  position: relative;
}
#list > .v-autocomplete__content {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  box-shadow: none !important;
  border-radius: 3px;
}
</style>
