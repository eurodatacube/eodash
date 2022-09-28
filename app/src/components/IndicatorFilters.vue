<template>
  <div
    class="no-pointer pa-2 overflow-hidden"
    style="width: 360px; height: calc((var(--vh), 1vh) * 100); z-index: 4"
  >
    <v-card class="rounded-xl">
      <div class="pa-2">
        <v-btn
          v-for="(theme, key) in $store.state.themes.themes"
          :key="key"
          class="mr-2 mb-2"
          :color="theme.color"
          dark
          rounded
          small
          @click="setThemeAsInput(theme.name)"
        >
          <v-icon left>{{ baseConfig.indicatorClassesIcons[theme.slug] }}</v-icon>
          {{ theme.name }}
        </v-btn>
      </div>
      <v-autocomplete
        ref="autocomplete"
        v-model="selectedListItem"
        :allow-overflow="false"
        attach="#autocomplete-menu"
        auto-select-first
        autofocus
        clearable
        :filter="customAutocompleteFilter"
        flat
        hide-details
        hide-no-data
        :items="formattedSearchItems"
        placeholder="Search here"
        :prepend-inner-icon="$store.state.showHistoryBackButton ? 'mdi-arrow-left' : 'mdi-magnify'"
        :search-input.sync="userInput"
        solo
        class="rounded-xl"
        @click:clear="autoCompleteClear"
        @click:prepend-inner="$store.state.showHistoryBackButton ? $router.back() : () => {}"
        @keydown.esc="userInput = null"
      >
      </v-autocomplete>
      <div
        class="overflow-x-hidden overflow-y-auto"
        style="position: relative; max-height: 250px"
      >
        <!-- <div class="overflow-y-auto"> -->
          <div id="autocomplete-menu" ></div>
        <!-- </div> -->
      </div>
    </v-card>
    <!-- <div
      class="pa-2"
      style="position: absolute; top: 0; left: 365px;"
    >
      <div
        class="d-flex align-center"
        style="height: 48px"
      >
        <v-btn
          v-for="(theme, key) in $store.state.themes.themes"
          :key="key"
          class="mr-2"
          :color="theme.color"
          dark
          rounded
          small
          @click="setThemeAsInput(theme.name)"
        >
          <v-icon left>{{ baseConfig.indicatorClassesIcons[theme.slug] }}</v-icon>
          {{ theme.name }}
        </v-btn>
      </div>
    </div> -->
    <!-- <v-card
      class="rounded-xl mt-5 pa-5"
    >
      <v-subheader class="px-2">THEME</v-subheader>
      <v-btn
        v-for="(theme, key) in $store.state.themes.themes"
        :key="key"
        class="mr-5 mb-3"
        :color="theme.color"
        dark
        rounded
        x-small
        @click="setThemeAsInput(theme.name)"
      >
      {{ theme.name }}
      </v-btn>
    </v-card> -->
    <!-- <v-img
      v-if="globalIndicators.length > 0 && !mapLayersExpanded"
      max-height="100"
      src="@/assets/mapLayers.png"
      class="rounded mt-5 elevation-2"
      style="cursor: pointer; display: none"
      @click="mapLayersExpanded = true"
    >
      <div class="pa-5 fill-height d-flex align-center">
        <p class="mb-0">
          <v-icon left>mdi-layers</v-icon> DATA LAYERS
        </p>
      </div>
    </v-img>
    <v-card
      v-else-if="globalIndicators.length > 0 && mapLayersExpanded"
      class="rounded mt-3"
      style="height: 300px; overflow-y: auto"
    >
      <v-list
        dense>
        <v-subheader class="px-2">GLOBAL DATA LAYERS</v-subheader>
        <v-list-item-group
          v-model="selectedMapLayer"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in globalIndicators"
            :key="i"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.properties.indicatorObject.indicatorName"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card> -->
    <div
      class="d-flex"
      style="position: absolute; bottom: 0; left: 0;"
      :style="`width: ${slideGroupWidth}`"
    >
      <v-slide-group
        v-model="selectedMapLayer"
        class="pa-2"
        show-arrows
        center-active
      >
        <v-slide-item
          v-for="(item, key) in globalIndicators"
          :key="key"
          v-slot="{ active, toggle }"
        >
          <v-card
            :color="active ? 'primary' : 'grey lighten-1'"
            class="ma-4"
            height="100"
            width="100"
            @click="toggle"
          >
            <v-img
              height="50"
              :src="`./img/datalayerImages/${getLocationCode(item.properties.indicatorObject)}.png`"
            >
            </v-img>
            <v-card-title
              style="font-size: small; line-height: unset; padding: 6px"
            >
              {{ item.properties.indicatorObject.indicatorName }}
              Top western road trips
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
    ...mapGetters('features', ['getGroupedFeatures', 'getIndicators']),
    globalIndicators() {
      return this.getGroupedFeatures && this.getGroupedFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject.siteName))
        .sort((a, b) => ((a.properties.indicatorObject.indicatorName
          > b.properties.indicatorObject.indicatorName)
          ? 1
          : -1));
    },
    slideGroupWidth() {
      const sidePanelWidth = document.querySelector('.pane-expanded') ? document.querySelector('.pane-expanded').clientWidth : 0
      return `calc(100% - ${sidePanelWidth}px)`
    }
  },
  methods: {
    ...mapMutations('features', {
      setFeatureFilter: 'SET_FEATURE_FILTER',
    }),
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    autoCompleteClear() {
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
        const filtered = this.searchItems
          .filter((i) => i.properties?.indicatorObject)
          .filter((i) => this.$refs.autocomplete.filteredItems.includes(i.name));
        this.setFeatureFilter({
          custom: filtered,
        });
        // this.sortSearchItems();
      }, 500);
    },
    setThemeAsInput(themeName) {
      this.$refs.autocomplete.blur();
      setTimeout(() => {
        this.userInput = themeName;
        setTimeout(() => {
          this.$refs.autocomplete.focus();
          this.$refs.autocomplete.activateMenu();
        }, 0);
      }, 0);
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
        ...this.allFeatures.map((f) => ({
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
    customAutocompleteFilter(item, queryText, itemText) {
      return this.searchItems.find((i) => i.name === item)?.filterPriority > 0;
    },
    getIndicator(indObj) {
      let ind = indObj.description;
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
    selectedListItem(input) {
      if (!input) {
        return;
      }
      const parsedInput = this.searchItems.find((i) => i.name === input);
      if (parsedInput.indicator) {
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
        this.globalIndicators[index].properties.indicatorObject,
      );
    },
    userInput() {
      setTimeout(() => {
        this.sortSearchItems();
      }, 50);
      this.setFilterDebounced();
    },
  },
};
</script>

<style scoped>
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
</style>
