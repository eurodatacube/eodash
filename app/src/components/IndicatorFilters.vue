<template>
  <div
    class="fill-height no-pointer"
    :class="{
      dirty: userInput,
      clean: !userInput,
      'pa-2': $vuetify.breakpoint.xsOnly && isDropdownEnabled,
      'pa-5': !isDropdownEnabled || $vuetify.breakpoint.smAndUp,
    }"
    :style="`width: ${ $vuetify.breakpoint.xsOnly && isDropdownEnabled ? '100%' : '360px'};
      transition: all 0.2s linear;
      background: ${ $vuetify.breakpoint.xsOnly && isDropdownEnabled ? '#0007' : 'none'};
      z-index: 4`"
  >
    <v-autocomplete
      ref="autocomplete"
      v-model="dropdownSelection"
      hide-details
      solo
      rounded
      :items="selectionItems.map(i => i.name)"
      :prepend-inner-icon="dropdownSelection ? 'mdi-arrow-left' : 'mdi-magnify'"
      :append-icon="$vuetify.breakpoint.smAndUp ? '' : undefined"
      clearable
      auto-select-first
      label="Search here"
      :search-input.sync="userInput"
      attach="#list"
      autofocus
      open-on-clear
      :filter="customAutocompleteFilter"
      @focus="isDropdownEnabled = true"
      @click:clear="autoCompleteClear"
      @click:prepend-inner="goBack"
      @change="autoCompleteChange"
      @keydown.esc="userInput = null"
    >
        <!-- <template v-slot:selection="{ item }">
          <v-row align="center" class="flex-nowrap">
            <template v-if="item.location || item.indicator">
              <v-icon class="pr-2 ml-1">{{
                baseConfig.indicatorClassesIcons[item.class]
                  ? baseConfig.indicatorClassesIcons[item.class]
                  : "mdi-lightbulb-on-outline"
              }}</v-icon>
            </template>

            <template v-else>
              <div
                class="pb-2 pr-2 ml-1"
              >
                <country-flag
                  :country="item.code === 'all' ? 'eu' : item.code"
                  size="normal"
                />
              </div>
            </template>

            <span v-text="item.name"></span>
          </v-row>
        </template> -->
        <template v-slot:item="data">
          <template v-if="selectionItems.find((i) => i.name === data.item).location">
            <v-list-item-icon class="mr-4">
              <v-icon>{{
                baseConfig.indicatorClassesIcons[selectionItems
                  .find((i) => i.name === data.item).class]
                  ? baseConfig.indicatorClassesIcons[selectionItems
                    .find((i) => i.name === data.item).class]
                  : "mdi-lightbulb-on-outline"
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="selectionItems.find((i) => i.name === data.item).name"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-else-if="selectionItems
            .find((i) => i.name === data.item).indicator">
            <v-list-item-icon class="mr-4">
              <v-icon>{{
                baseConfig.indicatorClassesIcons[selectionItems
                  .find((i) => i.name === data.item).class]
                  ? baseConfig.indicatorClassesIcons[selectionItems
                    .find((i) => i.name === data.item).class]
                  : "mdi-lightbulb-on-outline"
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-if="selectionItems
                .find((i) => i.name === data.item).indicatorOverwrite"
                v-text="selectionItems.find((i) => i.name === data.item).indicatorOverwrite"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
              <v-list-item-title v-else
                v-text="selectionItems.find((i) => i.name === data.item).indicator"
                style="
                  text-overflow: unset;
                  overflow: unset;
                  white-space: pre-wrap;
                "
              ></v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-icon class="d-flex align-center mr-4 pb-2">
              <country-flag
                :country="selectionItems.find((i) => i.name === data.item).code === 'all'
                  ? 'eu'
                  : selectionItems.find((i) => i.name === data.item).code"
                size="normal"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ selectionItems
                .find((i) => i.name === data.item).name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
    </v-autocomplete>
    <div
      v-show="isDropdownEnabled"
      class="rounded-t-xl mt-3 pa-3 elevation-2"
      style="background: var(--v-background-base)"
    >
      <div
        id="list"
        class="v-list--dense"
        :style="`max-height: calc(var(--vh, 1vh) * 100 - ${
          $vuetify.breakpoint.xsOnly ? $vuetify.application.footer + 75 : 300
        }px)`"
      >
        <v-list
          dense
          class="customList fill-height pt-0"
          :style="$vuetify.breakpoint.xsOnly && 'padding-bottom: 60px'"
        >
          <v-list-item-group v-model="indicatorSelection" color="primary">
            <template v-for="classId in Object.keys(uniqueClasses)">
              <v-subheader
                class="ml-2"
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
                    <v-list-item-icon class="mr-4">
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
                    :value="getLocationCode(groupedIndicators[indicator.code]
                      .features[i].properties.indicatorObject)"
                    active-class="itemActive"
                    :class="indicator.archived ? 'archived-item' : ''"
                    :disabled="indicatorSelection === feature"
                  >
                    <v-list-item-icon class="ml-5 mr-3">
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
                            .indicatorObject[groupedIndicators[indicator.code].label][1]
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
                  <v-list-item-icon class="mr-4">
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
      class="d-flex align-center justify-center rounded-b-xl elevation-2"
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
import getMapInstance from '@/components/map/map';

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
      inputUsed: null,
      selectionItems: [],
    };
  },
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getGroupedFeatures',
    ]),
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('features', ['featureFilters']),
    countries() {
      return countries;
    },
    allFeatures() {
      return this.$store.state.features.allFeatures
        .map((f) => ({
          class: this.indicatorItems
            .find((i) => i.code === f.properties.indicatorObject.indicator)?.class,
          location: f.properties.indicatorObject.city,
          name: `${f.properties.indicatorObject.city}: ${this.getIndicator(f.properties.indicatorObject)}`,
          indicator: this.getIndicator(f.properties.indicatorObject),
          indicatorObject: f.properties.indicatorObject,
        }));
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
    globalIndicators() {
      return this.getGroupedFeatures && this.getGroupedFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject.siteName))
        .sort((a, b) => ((a.properties.indicatorObject.indicatorName
          > b.properties.indicatorObject.indicatorName)
          ? 1
          : -1));
    },
  },
  mounted() {
    this.$refs.autocomplete.isMenuActive = true;
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
        /*
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
        */
      }
      if (mutation.type === 'indicators/SET_SELECTED_INDICATOR') {
        if (mutation.payload) {
          // TODO: This is not working properly, probably should use indicator loaded
          // but then it is called twice, there should be a better way for this
          this.indicatorSelection = mutation.payload.indicator;
        }
      }
    });
    this.$watch(
      () => this.$refs.autocomplete.isMenuActive,
      (val) => {
        if (!val && typeof this.indicatorSelection === 'number') {
          // list group clicked; keep the dropdown open
          this.$refs.autocomplete.isMenuActive = true;
          return;
        }
        this.isDropdownEnabled = val;
      },
    );
  },
  methods: {
    updateSelectionItems() {
      const itemArray = [
        ...this.countryItems,
        ...this.indicatorItems.map((i) => ({
          ...i,
          name: i.indicator,
        })),
        ...this.allFeatures,
      ];
      itemArray.sort((a, b) => (a.name.localeCompare(b.name)));
      itemArray.sort((a, b) => (b.filterPriority || 0) - (a.filterPriority || 0));
      this.selectionItems = itemArray;
    },
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
      if (filter.countries?.length === 0 && filter.indicators?.length === 0) {
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          null,
        );

        return;
      }
      if (selectedFeature) {
        // direct selection of a POI from the list
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          selectedFeature.properties.indicatorObject,
        );
      } else if (this.globalIndicators.length === 1) {
        console.log(this.globalIndicators);
        // selection of a global indicator with exactly one global POI
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          this.globalIndicators[0].properties.indicatorObject,
        );
      } else if (this.globalIndicators.length > 1) {
        // selection of a global indicator with multiple global POIs
        console.log(this.globalIndicators);
      } else {
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          null,
        );
      }
    },
    uniqueRegions(countryItems) {
      return countryItems
        .map((c) => c.region)
        .filter(
          (thing, index, self) => self.findIndex((t) => t === thing) === index,
        );
    },
    customAutocompleteFilter(item, queryText, itemText) {
      const itemObject = this.selectionItems.find((i) => i.name === item);
      const queryParts = queryText.toLocaleLowerCase().split(' ');
      let matchPoints = 0;
      // skip commonly used words in order to allow more semantic search
      const skip = ['in', 'at'];
      queryParts
        .filter((p) => p.length > 0)
        .forEach((p) => {
          if (p !== queryParts[0] ? !skip.includes(p) : true) {
            const countryName = countries.features
              .find((c) => c.properties.alpha2 === itemObject.indicatorObject?.country)?.properties
              .name;
            if (itemText.toLocaleLowerCase().indexOf(p) > -1) {
              // add a point if the query exists in itemText
              matchPoints++;
            }
            if (countryName && countryName.toLocaleLowerCase().indexOf(p) > -1) {
              // add another point if the query exists in the country
              matchPoints++;
            }
            if (itemText.toLocaleLowerCase() === p) {
              // add another point for exact matches
              matchPoints++;
            }
          }
        });
      itemObject.filterPriority = matchPoints;
      return matchPoints > 0;
    },
    autoCompleteChange(input) {
      if (!input) {
        this.inputUsed = false;
        return;
      }
      this.inputUsed = true;
      const parsedInput = this.selectionItems.find((i) => i.name === input);
      if (parsedInput.indicator) {
        if (parsedInput.indicatorObject) {
          this.selectIndicator(parsedInput.indicatorObject.indicator);
          this.$store.commit(
            'indicators/SET_SELECTED_INDICATOR',
            parsedInput.indicatorObject,
          );
        } else {
          this.selectIndicator(parsedInput.code);
        }
      } else {
        this.selectCountry(parsedInput.code);
      }
    },
    autoCompleteClear() {
      this.inputUsed = false;
      this.userInput = null;
      this.setFilter({
        countries: [],
        indicators: [],
      });
    },
    goBack() {
      this.$router.back();
      const currentQuery = this.$router.currentRoute.query;
      const {
        x, y, z,
      } = currentQuery;
      if (x && y && z && !Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
        getMapInstance('centerMap').map.getView().animate({
          center: [x, y],
          zoom: z,
          duration: 300,
        });
      }
    },
  },
  watch: {
    countryItems() {
      this.updateSelectionItems();
    },
    indicatorItems() {
      this.updateSelectionItems();
    },
    allFeatures() {
      this.updateSelectionItems();
    },
    userInput() {
      this.updateSelectionItems();
    },
    countrySelection(val) {
      this.selectCountry(val);
    },
    indicatorSelection(val) {
      if (!val) return;

      this.inputUsed = true;
      if (typeof val === 'string' && val.includes('-')) {
        // POI
        const feature = this.$store.state.features.allFeatures
          .find((f) => this.getLocationCode(f.properties.indicatorObject) === val);
        if (feature) {
          this.dropdownSelection = feature.properties.indicatorObject.indicatorName;
          this.selectIndicator(val.split('-')[1], feature);
        }
      } else {
        // indicator
        const found = this.selectionItems.find((i) => i.code === val);
        if (found) {
          this.dropdownSelection = found.indicator;
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
          if (
            hasGrouping
            && ['global'].includes(f.properties.indicatorObject.siteName)
            // only add global layers to the list grouping;
            // the local ones are still using the tab feature)
          ) {
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

::v-deep .v-input {
  font-size: 15px;
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
