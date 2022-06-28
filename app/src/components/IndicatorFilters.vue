<template>
  <div
    class="fill-height pa-5 no-pointer"
    :class="userInput ? 'dirty' : 'clean'"
    style="width: 420px"
  >
    <v-autocomplete
      ref="autocomplete"
      v-model="dropdownSelection"
      hide-details
      solo
      rounded
      :items="selectionItems"
      :prepend-inner-icon="dropdownSelection ? undefined : 'mdi-magnify'"
      clearable
      auto-select-first
      return-object
      item-text="name"
      label="Search here"
      :search-input.sync="userInput"
      attach="#list"
      autofocus
      open-on-clear
      @click:clear="autoCompleteClear"
      @change="autoCompleteChange"
      @keydown.esc="userInput = null"
    >
        <template v-slot:selection="{ item }">
          <v-row align="center">
            <template v-if="item.location || item.indicator">
              <v-icon class="pr-2">{{
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
    <div
      v-show="isDropdownEnabled"
      class="rounded-t-xl mt-3 pa-3 white"
    >
      <div id="list">
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
              <template
                  v-for="indicator in indicatorItems.filter(
                    (i) =>
                      uniqueClasses[classId].includes(i.code) &&
                      i.indicator !== ''
                  )"
              >
                <v-list-group
                  v-if="groupedIndicators && groupedIndicators[indicator.code]"
                  :key="indicator.code"
                >
                  <template v-slot:activator>
                    <v-list-item-icon class="ml-3 mr-4">
                      <v-icon>{{
                        baseConfig.indicatorClassesIcons[classId]
                          ? baseConfig.indicatorClassesIcons[classId]
                          : "mdi-lightbulb-on-outline"
                      }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ indicator.indicatorOverwrite || indicator.indicator }}
                    </v-list-item-title>
                  </template>
                  <v-list-item
                    v-for="(feature, i) in groupedIndicators[indicator.code].features"
                    :key="i"
                    :value="!!feature
                      ? getLocationCode(feature.properties.indicatorObject)
                      : indicator.code"
                    active-class="itemActive"
                    :class="indicator.archived ? 'archived-item' : ''"
                    :disabled="indicatorSelection === feature"
                  >
                    <v-list-item-icon class="ml-6 mr-3">
                      <v-icon small>{{
                        baseConfig.indicatorClassesIcons[classId]
                          ? baseConfig.indicatorClassesIcons[classId]
                          : "mdi-lightbulb-on-outline"
                      }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-title>
                      <small>
                        {{ Array.isArray(groupedIndicators[indicator.code].label)
                          ? groupedIndicators[indicator.code].label[i]
                          : (Array.isArray(feature.properties
                            .indicatorObject[groupedIndicators[indicator.code].label])
                          ? feature.properties
                            .indicatorObject[groupedIndicators[indicator.code].label][0]
                          : feature.properties
                            .indicatorObject[groupedIndicators[indicator.code].label])
                        }}
                      </small>
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>
                <v-list-item
                  v-else
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
            </template>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
    <v-sheet
      v-if="isDropdownEnabled"
      class="d-flex align-center justify-center rounded-b-xl"
      style="width: 100%; height: 40px">
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
  data() {
    return {
      // Disable the dropdown by default on smaller screens.
      isDropdownEnabled: !this.$vuetify.breakpoint.smAndDown,
      userInput: '',
      indicators: {
        environment: 1,
        economy: 0,
        health: 0,
      },
      countrySelection: 'all',
      indicatorSelection: 'all',
      dropdownSelection: null,
      groupedIndicators: null,
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
        const codeA = a.indicator;
        const codeB = b.indicator;
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
        // TODO currently causes infinite loop
        // if (mutation.payload.indicators) {
        //   if (Array.isArray(mutation.payload.indicators)) {
        //     if (mutation.payload.indicators.length === 0) {
        //       this.indicatorSelection = 'all';
        //     } else {
        //       [this.indicatorSelection] = mutation.payload.indicators;
        //     }
        //   } else {
        //     this.indicatorSelection = mutation.payload.indicators;
        //   }
        // }
      }
    });
    this.$watch(
      () => this.$refs.autocomplete.isMenuActive,
      (val) => {
        this.isDropdownEnabled = val;
      },
    );
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
    selectIndicator(selection, selectedFeature) {
      this.setFilter({
        indicators: selection === 'all' ? [] : [selection],
      }, selectedFeature);
    },
    setFilter(filter, selectedFeature) {
      this.$store.commit('features/SET_FEATURE_FILTER', filter);
      if (selectedFeature) {
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          selectedFeature.properties.indicatorObject,
        );
      } else {
        // filter out those POIs that are defined in featureGrouping, as they
        // already will appear in the sub-group and can thus be directly clicked
        const possibleValues = this.getGroupedFeatures.filter((f) => this.appConfig.featureGrouping && !this.appConfig.featureGrouping
          .find((g) => g.features
            .find((i) => i.includes(this.getLocationCode(f.properties.indicatorObject)))));
        const firstFeature = possibleValues[0];
        if (firstFeature) {
          this.$store.commit(
            'indicators/SET_SELECTED_INDICATOR',
            firstFeature.properties.indicatorObject,
          );
        }
      }
    },
    uniqueRegions(countryItems) {
      return countryItems
        .map((c) => c.region)
        .filter(
          (thing, index, self) => self.findIndex((t) => t === thing) === index,
        );
    },
    autoCompleteChange(input) {
      if (!input) return;

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
      this.userInput = null;
    },
  },
  watch: {
    countrySelection(val) {
      this.selectCountry(val);
    },
    indicatorSelection(val) {
      if (typeof val === 'string' && val.includes('-')) {
        // POI
        const feature = this.$store.state.features.allFeatures
          .find((f) => this.getLocationCode(f.properties.indicatorObject) === val);
        if (feature) {
          this.dropdownSelection = this.selectionItems.find((i) => i.code === val.split('-')[1]);
          this.selectIndicator(val.split('-')[1], feature);
        }
      } else {
        // indicator
        const found = this.selectionItems.find((i) => i.code === val);
        if (found) {
          this.dropdownSelection = found;
          this.selectIndicator(val);
        }
      }
    },
    getGroupedFeatures(features) {
      if (features && !this.groupedIndicators) {
        const grouped = {};
        features.forEach((f) => {
          const hasGrouping = this.appConfig.featureGrouping && this.appConfig.featureGrouping
            .find((g) => g.features
              .find((i) => i.includes(this.getLocationCode(f.properties.indicatorObject))));
          if (hasGrouping) {
            // includes features and labels
            grouped[f.properties.indicatorObject.indicator] = {};
            grouped[f.properties.indicatorObject.indicator].label = hasGrouping.label;
            grouped[f.properties.indicatorObject.indicator].features = hasGrouping.features
              .map((l) => this.$store.state.features.allFeatures
                .find((ft) => this.getLocationCode(ft.properties.indicatorObject) === l));
          }
        });
        this.groupedIndicators = grouped;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
.clean::v-deep .v-autocomplete__content {
  display: none;
}
.dirty .customList {
  display: none;
}

#list {
  height: auto;
  max-height: calc(var(--vh, 1vh) * 100 - 180px);
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

.list-container {
  box-shadow:
    1px 10px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  outline: 1px solid #ddd;
  overflow: hidden;
}

.no-pointer {
  pointer-events: none;
}

.no-pointer > div {
  pointer-events: all;
}


::v-deep .v-autocomplete__content.v-menu__content {
  box-shadow: none;
}
::v-deep .v-input--checkbox .v-label {
  font-size: small;
}
</style>
