<template>
  <div
    class="no-pointer pa-2 overflow-hidden"
    :style="`width: 100%; height: calc(var(--vh, 1vh) * 100); z-index: 4; background: ${
        $vuetify.breakpoint.xsOnly && comboboxFocus
          ? $vuetify.theme.currentTheme.background
          : 'unset' }`"
  >
    <v-card
      class="rounded-lg"
      :style="`width: ${$vuetify.breakpoint.xsOnly
      ? '100%'
      : '360px'}`"
    >
      <div
        v-if="$vuetify.breakpoint.smAndUp && !currentTheme"
        class="pa-2"
      >
        <v-btn
          v-for="(theme, key) in $store.state.themes.themes"
          :key="key"
          class="mr-2 mb-2"
          :color="theme.color"
          dark
          rounded
          x-small
          @click="userInput = theme.name"
        >
          <v-icon small left>{{ baseConfig.indicatorClassesIcons[theme.slug] }}</v-icon>
          {{ theme.name }}
        </v-btn>
      </div>
      <v-divider></v-divider>
      <v-combobox
        ref="combobox"
        v-model="selectedListItem"
        :allow-overflow="false"
        attach="#combobox-menu"
        auto-select-first
        :autofocus="$vuetify.breakpoint.smAndUp"
        :filter="customComboboxFilter"
        flat
        hide-details
        hide-no-data
        :items="formattedSearchItems"
        placeholder="Search here"
        :prepend-inner-icon="$store.state.showHistoryBackButton ? 'mdi-arrow-left' : 'mdi-magnify'"
        :search-input.sync="userInput"
        solo
        class="rounded-lg"
        @click:prepend-inner="$store.state.showHistoryBackButton ? goBack() : () => {}"
        @keydown.esc="userInput = null"
      >
      </v-combobox>
      <div
        class="overflow-x-hidden overflow-y-auto"
        style="position: relative; max-height: 250px"
      >
        <div id="combobox-menu"></div>
      </div>
    </v-card>
    <div
      v-if="!($vuetify.breakpoint.xsOnly && comboboxFocus) && globalIndicators.length > 0"
      id="slideGroupWrapper"
      class="d-flex"
      style="position: absolute; bottom: 25px; left: 0; pointer-events: none;"
    >
      <v-slide-group
        v-model="selectedMapLayer"
        class="pa-2"
        dark
        center-active
        show-arrows="desktop"
      >
        <v-slide-item
          v-for="(item, key) in globalIndicators"
          :key="key"
          v-slot="{ active, toggle }"
        >
          <v-card
            :color="active ? 'primary' : 'white'"
            height="100"
            width="100"
            class="mx-4 my-1 overflow-hidden d-flex flex-column"
            style="pointer-events: all"
            @click="toggle"
          >
            <v-img
              height="50"
              class="flex-shrink-1"
              :src="`./data/${appConfig.id}/globalDataLayerImages/${getLocationCode(
                item.properties.indicatorObject)}.png`"
            >
            </v-img>
            <v-card-title
              class="flex-grow-1"
              :class="active ? 'white--text' : 'primary--text'"
              style="font-size: 12px; line-height: 14px; padding: 5px; word-break: break-word;"
            >
              {{ item.properties.indicatorObject.indicatorName }}
            </v-card-title>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import countries from '@/assets/countries.json';
import {
  GeoJSON,
} from 'ol/format';

import { getMapInstance } from '@/components/map/map';
import { calculatePadding } from '@/utils';

export default {
  data: () => ({
    searchItems: [],
    formattedSearchItems: [],
    userInput: null,
    selectedListItem: null,
    selectedMapLayer: null,
    mapLayersExpanded: false,
    comboboxFocus: null,
  }),
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('features', ['allFeatures']),
    ...mapState('indicators', ['selectedIndicator']),
    ...mapState('themes', ['currentTheme']),
    ...mapGetters('features', [
      'getCountries',
      'getFeatures',
      'getGroupedFeatures',
      'getIndicators',
    ]),
    globalIndicators() {
      return this.getGroupedFeatures && this.getGroupedFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject.siteName))
        .sort((a, b) => ((a.properties.indicatorObject.indicatorName
          > b.properties.indicatorObject.indicatorName)
          ? 1
          : -1));
    },
  },
  created() {
    if (this.allFeatures) {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    }
  },
  mounted() {
    // reset filters each time component is mounted
    // (e.g. also when navigating back from custom dashboard)
    this.sortSearchItems();
    this.setFilterDebounced();
    this.$watch(
      () => this.$refs.combobox.isMenuActive,
      (val) => {
        this.comboboxFocus = val;
      },
    );
  },
  methods: {
    ...mapMutations('features', {
      setFeatureFilter: 'SET_FEATURE_FILTER',
    }),
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    comboboxClear() {
      this.userInput = null;
      this.setFeatureFilter({
        countries: [],
        indicators: [],
      });
      this.selectedListItem = null;
      this.selectedMapLayer = null;
      this.setSelectedIndicator(null);
    },
    setFilterDebounced() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        if (this.userInput?.length) {
          const filtered = this.searchItems
            .filter((i) => i.properties?.indicatorObject)
            .filter((i) => i.filterPriority > 0);
          this.setFeatureFilter({
            custom: filtered,
          });
        } else {
          this.setFeatureFilter({
            custom: [],
          });
        }
      }, 50);
    },
    getSearchItems() {
      const itemArray = [
        ...countries.features
          .filter((f) => !this.getCountries.includes(f.properties.alpha2))
          .map((f) => ({
            code: f.properties.alpha2,
            name: f.properties.name,
            noPOIs: true,
          })),
        ...this.getCountries
          .filter((f) => countries.features.find((c) => c.properties.alpha2 === f))
          .map((f) => ({
            code: f,
            name: countries.features.find((c) => c.properties.alpha2 === f).properties.name,
          })),
        ...this.getIndicators
          .filter(
            (ind, index, self) => self.findIndex((t) => t.code === ind.code) === index,
          )
          .map((i) => ({
            ...i,
            name: i.indicator,
          })),
        ...this.getFeatures.map((f) => ({
          ...f,
          name: `${f.properties.indicatorObject.city}: ${this.getIndicator(f.properties.indicatorObject)}`,
        })),
      ];
      itemArray.sort((a, b) => (a.name.localeCompare(b.name)));
      itemArray.sort((a, b) => (b.filterPriority || 0) - (a.filterPriority || 0));
      this.searchItems = itemArray;
      this.formattedSearchItems = this.searchItems.filter((i) => !i.noPOIs).map((i) => i.name);
    },
    sortSearchItems() {
      if (!this.userInput) {
        this.searchItems.sort((a, b) => (a.name.localeCompare(b.name)));
        return;
      }
      const queryParts = this.userInput.toLocaleLowerCase().split(' ');
      // skip commonly used words in order to allow more semantic search
      const skip = ['in', 'at', 'and', 'index'];
      this.searchItems.forEach((searchItem, index, array) => {
        let matchPoints = 0;
        queryParts
          .filter((p) => p.length > 0)
          .forEach((p) => {
            if (p !== queryParts[0] ? !skip.includes(p) : true) {
              const countryName = countries.features
                .find((c) => c.properties.alpha2 === searchItem
                  .properties?.indicatorObject?.country)?.properties
                .name;
              if (searchItem.name.toLocaleLowerCase().indexOf(p) > -1) {
                // add a point if the query exists in itemText
                matchPoints++;
              }
              if (searchItem.name.toLocaleLowerCase() === p) {
                // add another point for exact matches
                matchPoints++;
              }
              if (countryName && countryName.toLocaleLowerCase().indexOf(p) > -1) {
                // add another point if the query exists in the country
                matchPoints++;
              }
              if (
                countries.features
                  .map((f) => f.properties.name).some((i) => i.toLocaleLowerCase().includes(p))
                && (searchItem.properties?.indicatorObject?.city === 'World'
                  || searchItem.properties?.indicatorObject?.city === 'Global')
              ) {
                matchPoints++;
              }
              if (
                this.baseConfig.indicatorsDefinition[
                  searchItem.properties?.indicatorObject?.indicator
                ]?.themes
                  .includes(p)
              ) {
                matchPoints++;
              }
              if (
                searchItem.noPOIs
              ) {
                matchPoints--;
              }
            }
          });
        array[index].filterPriority = matchPoints; // eslint-disable-line
      });
      this.searchItems.sort((a, b) => (a.name.localeCompare(b.name)));
      this.searchItems.sort((a, b) => (b.filterPriority || 0) - (a.filterPriority || 0));
      this.formattedSearchItems = this.searchItems
        .filter((i) => (this.userInput.length < 3 ? !i.noPOIs : true))
        .map((i) => i.name);
    },
    customComboboxFilter(item) {
      return this.searchItems.find((i) => i.name === item)?.filterPriority > 0;
    },
    getIndicator(indObj) {
      let ind = indObj.indicatorName || indObj.description;
      if (this.baseConfig.indicatorsDefinition[indObj.indicator]
        && this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite) {
        ind = this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite;
      }
      return ind;
    },
    goBack() {
      if (this.$store.state.initWithQuery) {
        this.comboboxClear();
        this.$store.commit('setInitWithQuery', false);
      } else {
        this.$router.back();
      }
    },
  },
  watch: {
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
      if (this.$route.query.search) {
        this.userInput = this.$route.query.search;
      }
    },
    selectedIndicator(indicatorObject) {
      if (!indicatorObject) {
        this.userInput = null;
        return;
      }
      const displayName = `${indicatorObject.city}: ${this.getIndicator(indicatorObject)}`;
      if (this.userInput !== displayName) {
        this.userInput = displayName;
      }
      this.selectedMapLayer = this.globalIndicators
        .findIndex((l) => this.getLocationCode(l.properties.indicatorObject)
          === this.getLocationCode(indicatorObject));
    },
    selectedListItem(input) {
      if (!input) {
        return;
      }
      if (this.$vuetify.breakpoint.xsOnly) {
        this.comboboxFocus = false;
        this.$refs.combobox.blur();
      }
      const parsedInput = this.searchItems.find((i) => i.name === input);
      if (!parsedInput) {
        // not found, probably a "theme"
        return;
      }
      if (parsedInput.indicator) {
        this.setSelectedIndicator(null);
        this.setFeatureFilter({
          indicators: parsedInput.code,
        });
      } else if (parsedInput.properties?.indicatorObject) {
        // this.selectIndicator(parsedInput.indicatorObject.indicator);
        this.setSelectedIndicator(
          parsedInput.properties.indicatorObject,
        );
      } else {
        const parsedCountries = new GeoJSON({
          featureProjection: 'EPSG:3857',
        }).readFeatures(countries);
        const country = parsedCountries.find((c) => c.get('alpha2') === parsedInput.code);
        const { map } = getMapInstance('centerMap');
        const padding = calculatePadding();
        map.getView().fit(country.getGeometry().getExtent(), {
          duration: 500, padding,
        });
      }
    },
    selectedMapLayer(index) {
      if (index >= 0) {
        this.setSelectedIndicator(
          this.globalIndicators[index]?.properties.indicatorObject,
        );
      }
    },
    userInput(newInput) {
      this.sortSearchItems();
      this.setFilterDebounced();
      const query = {
        ...this.$route.query,
        search: newInput?.length ? newInput : undefined,
      };
      this.$router.replace({ query }).catch(() => {});
      this.trackEvent('filters', 'search_input', newInput);
      // for some strange reason, focusing and activating menu only works half of
      // the time without timeout
      // TODO find out why and clean up
      setTimeout(() => {
        if (newInput && !this.$refs.combobox.isMenuActive
          && this.$store.state.themes.themes.map((t) => t.name).indexOf(newInput) >= 0) {
          this.$refs.combobox.focus();
          this.$refs.combobox.activateMenu();
        }
      }, 0);
    },
  },
};
</script>

<style scoped lang="scss">
.no-pointer {
  pointer-events: none;
}

.no-pointer > div {
  pointer-events: all;
}

::v-deep .v-autocomplete__content {
  position: relative;
  height: auto;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  max-height: unset !important;
  box-shadow: none !important;
  border-radius: 3px;
}

#slideGroupWrapper {
  width: calc(100% - 0px);
}

.panel-expanded #slideGroupWrapper {
  width: calc(100% - 685px);
}

::v-deep .v-slide-group__prev,
::v-deep .v-slide-group__next {
  pointer-events: all;
  background: var(--v-primary-base);
  opacity: .5;
  &:hover {
    opacity: 1;
  }
}
::v-deep .v-slide-group__prev {
  border-radius: 4px 0 0 4px;
}
::v-deep .v-slide-group__next {
  border-radius: 0 4px 4px 0;
}
::v-deep .v-slide-group__prev--disabled,
::v-deep .v-slide-group__next--disabled {
  pointer-events: none;
  opacity: .2;
}
</style>
