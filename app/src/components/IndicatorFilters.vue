<template>
  <div
    class="no-pointer pa-2 overflow-hidden"
    style="width: 360px; height: calc((var(--vh), 1vh) * 100); z-index: 4"
  >
    <v-card class="rounded-lg">
      <div
        v-if="appConfig.id === 'esa'"
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
        autofocus
        clearable
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
        @click:clear="comboboxClear"
        @click:prepend-inner="$store.state.showHistoryBackButton ? $router.back() : () => {}"
        @keydown.esc="userInput = null"
      >
      </v-combobox>
      <div
        class="overflow-x-hidden overflow-y-auto"
        style="position: relative; max-height: 250px"
      >
        <div id="combobox-menu" ></div>
      </div>
    </v-card>
    <div
      id="slideGroupWrapper"
      class="d-flex"
      style="position: absolute; bottom: 10px; left: 0; pointer-events: none;"
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
            class="ma-4 overflow-hidden"
            style="pointer-events: all"
            @click="toggle"
          >
            <v-img
              height="50"
              :src="`./data/${appConfig.id}/globalDataLayerImages/${getLocationCode(item.properties.indicatorObject)}.png`"
            >
            </v-img>
            <v-card-title
              :class="active ? 'white--text' : 'primary--text'"
              style="font-size: small; line-height: unset; padding: 6px"
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

import getMapInstance from '@/components/map/map';

export default {
  data: () => ({
    searchItems: [],
    formattedSearchItems: [],
    userInput: null,
    selectedListItem: null,
    selectedMapLayer: null,
    mapLayersExpanded: false,
  }),
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('features', ['allFeatures']),
    ...mapState('indicators', ['selectedIndicator']),
    ...mapGetters('features', ['getFeatures', 'getGroupedFeatures', 'getIndicators']),
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
    if (this.$route.query.search) {
      this.userInput = this.$route.query.search;
    }
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
        ...countries.features.map((f) => ({
          code: f.properties.alpha2,
          name: f.properties.name,
        })),
        ...this.getIndicators
          .filter((i) => !i.dummyFeature)
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
      this.formattedSearchItems = this.searchItems.map((i) => i.name);
    },
    sortSearchItems() {
      if (!this.userInput) {
        this.searchItems.sort((a, b) => (a.name.localeCompare(b.name)));
        return;
      }
      const queryParts = this.userInput.toLocaleLowerCase().split(' ');
      // skip commonly used words in order to allow more semantic search
      const skip = ['in', 'at'];
      this.searchItems.forEach((searchItem, index, array) => {
        let matchPoints = 0;
        queryParts
          .filter((p) => p.length > 0)
          .forEach((p) => {
            if (p !== queryParts[0] ? !skip.includes(p) : true) {
              const countryName = countries.features
                .find((c) => c.properties.alpha2 === searchItem.properties?.indicatorObject?.country)?.properties
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
                this.baseConfig.indicatorsDefinition[searchItem.properties?.indicatorObject?.indicator]?.themes
                  .includes(p)
              ) {
                matchPoints++;
              }
            }
          });
        array[index].filterPriority = matchPoints;
      });
      this.searchItems.sort((a, b) => (a.name.localeCompare(b.name)));
      this.searchItems.sort((a, b) => (b.filterPriority || 0) - (a.filterPriority || 0));
      this.formattedSearchItems = this.searchItems.map((i) => i.name);
    },
    customComboboxFilter(item) {
      return this.searchItems.find((i) => i.name === item)?.filterPriority > 0;
    },
    getIndicator(indObj) {
      let ind = indObj.indicatorName;
      if (this.baseConfig.indicatorsDefinition[indObj.indicator]
        && this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite) {
        ind = this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite;
      }
      return ind;
    },
  },
  watch: {
    allFeatures() {
      if (!this.searchItem) {
        this.getSearchItems();
      }
    },
    selectedIndicator(indicatorObject) {
      if (!indicatorObject) {
        return;
      }
      const displayName = `${indicatorObject.city}: ${this.getIndicator(indicatorObject)}`;
      if (this.userInput !== displayName) {
        this.userInput = displayName;
      }
    },
    selectedListItem(input) {
      if (!input) {
        return;
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
        map.getView().fit(country.getGeometry().getExtent(), { duration: 500, padding: [50, 50, 50, 50] });
      }
    },
    selectedMapLayer(index) {
      this.setSelectedIndicator(
        this.globalIndicators[index]?.properties.indicatorObject,
      );
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
}
</style>
