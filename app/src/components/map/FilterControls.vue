<template>
  <v-col v-if="filters"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <v-card class="pa-2">
    <v-card-title class="pa-2">Filters</v-card-title>
      <v-btn
        v-if="filtersChanged"
        absolute x-small color="primary"
        style="top:6px; right:6px;font-size:8px;"
        @click="resetFilters()"
      >
        Reset constraints
      </v-btn>
      <div v-for="[index, key] in Object.keys(filters).entries()"
        :key="key"
      >
        <template v-if="filters[key].display">
          <span v-if="!(filters[key].type && filters[key].type=='boolfilter')">
            <v-row class="pl-2 pr-2 ml-14 mr-14" dense x-small>
              <v-col
                v-if="filters[key].header"
                cols="12"
                dense x-small
                style="font-size:16px; color: #7a7a7a;">
                <span>
                {{filters[key].label}}
                </span>
              </v-col>
              <v-col
                v-else
                cols="12"
                dense x-small
                style="color: #7a7a7a;">
                <span>
                {{filters[key].label}}
                <v-btn
                  v-if="!filters[key].header"
                  icon x-small color="primary"
                  @click="removeFilter(key)"
                  style="margin-bottom:4px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                </span>
              </v-col>
            </v-row>
          </span>
          <v-col class='d-flex justify-center pa-0'
            v-if="filters[key].type && filters[key].type=='boolfilter'"
          >
            <v-checkbox
              v-model="filters[key].value"
              :label="filters[key].label"
              dense
              @change="(evt) => updateMapBool(evt, filters[key].id, index)"
            ></v-checkbox>
            <v-btn
              v-if="!filters[key].header"
              icon
              x-small
              color="primary"
              @click="removeFilter(key)"
              style="margin-top: 10px; margin-left: 4px;"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
          <v-slider v-else-if="filters[key].type && filters[key].type=='slider'"
            v-model="filters[key].value"
            hide-details
            dense
            :min="filters[key].min"
            :max="filters[key].max"
            :step="filters[key].step || (filters[key].max-filters[key].min)/100"
            @input="(evt) => throttledUpdate(evt, filters[key].id, index)"
          >
            <template v-slot:prepend>
              <div class="pl-4" style="width:60px; overflow:hidden;"></div>
            </template>
            <template v-slot:append>
              <div class="pr-4" style="width:60px; overflow:hidden;">{{filters[key].value}}</div>
            </template>
          </v-slider>
          <v-select v-else-if="filters[key].type && filters[key].type=='select'"
            class="pl-2 pr-2 ml-14 mr-14"
            align="center"
            v-model="filters[key].value"
            :items="filters[key].entries"
            @input="(evt) => updateVisualizationBand(evt, filters[key].id)"
            dense
            persistent-hint
            single-line
            return-object
          ></v-select>
          <v-row
            v-else-if="filters[key].isCircular"
            class="mt-4 px-4"
            style="position: relative;"
            align="center"
          >
            <v-col cols="3" class="mb-7">
              <v-progress-circular
                class="compass ml-8"
                :rotate="-90 + filters[key].range[0]"
                :size="55"
                :width="6"
                :value="filters[key].range[1] / 360 * 100"
                color="#00ae9d"
              >
                <div style="
                  position: relative;
                  transform: translate(-5px, -10px)
                  font-weight: 700; font-size: 15px;"
                >
                  <div style="position: absolute; transform: translate(0, -40px)">N</div>
                  <div style="position: absolute; transform: translate(40px, 0)">E</div>
                  <div style="position: absolute; transform: translate(0, 40px)">S</div>
                  <div style="position: absolute; transform: translate(-40px, 0)">W</div>
                </div>
              </v-progress-circular>
            </v-col>

            <v-col
              class="degrees-range text-h6 d-flex mb-8"
              cols="2"
              justify="center"
              style="
                flex: 0 1 auto; font-weight: 400;
                flex-direction: column; font-family: 'NotesESA' !important;
                width: 105px; font-size: 17px !important;
                text-align: center;
              "
            >
              <template
                v-if="filters[key].range[0] + filters[key].range[1] > 360"
              >
                <span>
                  {{ filters[key].range[0] }}°
                </span>
                <v-icon class="fill-width">mdi-menu-down</v-icon>
                <span>
                  {{ filters[key].range[0] + filters[key].range[1] - 360 }}°
                </span>
              </template>
              <template v-else>
                <span>
                  {{ filters[key].range[0] }}°
                </span>
                <v-icon class="fill-width">mdi-menu-down</v-icon>
                <span>
                  {{ filters[key].range[0] + filters[key].range[1] }}°
                </span>
              </template>
            </v-col>

            <v-col cols="7">
              <v-slider
                label="Angle"
                max="360"
                min="0"
                v-model="filters[key].range[0]"
                @input="() => {
                  let from = filters[key].range[0];
                  let to = filters[key].range[0] + filters[key].range[1];

                  if (to > 360) {
                    throttledUpdate([from, 360, 0, to - 360], filters[key].id, index);
                  } else {
                    throttledUpdate([from, to, 0, 0], filters[key].id, index);
                  }
                }"
              >
                <template v-slot:append>
                  <div style="width:60px; overflow:hidden;">
                    {{filters[key].range[0]}}°
                  </div>
                </template>
              </v-slider>
              <v-slider
                label="Width"
                max="360"
                min="10"
                v-model="filters[key].range[1]"
                @input="() => {
                  let from = filters[key].range[0];
                  let to = filters[key].range[0] + filters[key].range[1];

                  if (to > 360) {
                    throttledUpdate([from, 360, 0, to - 360], filters[key].id, index);
                  } else {
                    throttledUpdate([from, to, 0, 0], filters[key].id, index);
                  }
                }"
              >
                <template v-slot:append>
                  <div style="width:60px; overflow:hidden;">
                    {{filters[key].range[1]}}°
                  </div>
                </template>
              </v-slider>
            </v-col>
          </v-row>
          <v-range-slider
            v-else
            v-model="filters[key].range"
            hide-details
            dense
            :min="filters[key].min"
            :max="filters[key].max"
            :step="filters[key].step || (filters[key].max-filters[key].min)/100"
            @input="(evt) => throttledUpdate(evt, filters[key].id, index)"
          >
            <template v-slot:prepend>
              <div class="pl-4" style="width:60px; overflow:hidden;">{{filters[key].range[0]}}</div>
            </template>
            <template v-slot:append>
              <div class="pr-4" style="width:60px; overflow:hidden;">{{filters[key].range[1]}}</div>
            </template>
          </v-range-slider>
        </template>
      </div>
      <div class="text-center" v-if="hiddenFilterKeys.length > 0">
        <v-menu offset-y dense>
          <template v-slot:activator="{ on, attrs }">
            <p class="justify-self-start px-2 py-0"
              style="color: #7a7a7a;"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon color="black">mdi-plus-circle-outline</v-icon>
              Add constraint
            </p>
          </template>
          <v-list>
            <v-list-item
              v-for="key in hiddenFilterKeys"
              :key="key"
              link
              @click="() => enableFilter(key)"
            >
              <v-list-item-title>{{ filters[key].label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import throttle from 'lodash.throttle';
import { getMapInstance } from '@/components/map/map';
import { saveAs } from 'file-saver';

export default {
  name: 'FilterControls',
  props: {
    cogFilters: Object,
    mergedConfigsData: Object,
    adminLayer: Object,
    adminFeature: Object,
    indicatorCode: String,
  },
  data() {
    return {
      filters: JSON.parse(JSON.stringify(this.cogFilters.filters)),
      select: null,
      variables: JSON.parse(JSON.stringify(this.mergedConfigsData?.style?.variables || {})),
      originalVariables: JSON.parse(JSON.stringify(this.mergedConfigsData?.style?.variables || {})),
      layerSourceDidRefresh: false,
    };
  },
  computed: {
    filtersChanged() {
      let fchanged = false;
      Object.keys(this.cogFilters.filters).forEach((key) => {
        if (JSON.stringify(this.cogFilters.filters[key]) !== JSON.stringify(this.filters[key])) {
          fchanged = true;
        }
      });
      return fchanged;
    },
    hiddenFilterKeys() {
      const keys = [];
      Object.keys(this.filters).forEach((key) => {
        if (!('display' in this.filters[key]) || this.filters[key].display !== true) {
          keys.push(key);
        }
      });
      return keys;
    },
  },
  created() {
    this.throttledUpdate = throttle((evt, filterId, index) => {
      this.updateMap(evt, filterId, index);
    }, 150);
    window.addEventListener(
      'fetch-data-report',
      this.handleFetchDataEvent,
    );
  },
  mounted() {
  },
  beforeUnmount() {
    this.throttledUpdate.cancel();
    window.removeEventListener(
      'fetch-data-report',
      this.handleFetchDataEvent,
    );
  },
  watch: {
  },
  methods: {
    hoverText() {
      let selection = false;
      if (this.$store.state && this.$store.state.features.selectedFeatures.length > 0) {
        selection = true;
      }
      let text = 'Please select Census Track (Zählsprengel) zone';
      if (selection) {
        text = 'Download';
      }
      return text;
    },
    handleFetchDataEvent(e) {
      this.fetchData(e.detail);
    },
    fetchData(process) {
      if (process === 'zones') {
        window.dispatchEvent(new CustomEvent('fetch-data-zones-loading', { detail: true }));
      } else {
        window.dispatchEvent(new CustomEvent('fetch-data-report-loading', { detail: true }));
      }
      const baseUrl = `https://gtif-backend.hub.eox.at/${process}?`;
      const keyRenaming = {
        powerDensity: 'wind_power',
        settlementDistance: 'distance',
        protectedZones: 'nature2000',
        ruggedness: 'roughness',
        energyGridDistance: 'dist_egrid',
      };
      const pars = Object.entries(this.filters).map(([key, item]) => {
        let p;
        let currentKey;
        currentKey = key;
        if (keyRenaming[key]) {
          currentKey = keyRenaming[key];
        }
        if (item.type && item.type === 'boolfilter') {
          p = `${currentKey}=${item.value ? 1 : 0}`;
        } else if (item.range && item.range.length === 2) {
          p = `${currentKey}_min=${item.range[0]}&${currentKey}_max=${item.range[1]}`;
        } else if (item.type && item.type === 'slider') {
          if (item.inverted) {
            p = `${currentKey}_min=${item.min}&${currentKey}_max=${item.value}`;
          } else {
            p = `${currentKey}_min=${item.value}&${currentKey}_max=${item.max}`;
          }
        }
        return p;
      });
      if (this.indicatorCode === 'REP1') {
        pars.push('height=200');
      } else if (this.indicatorCode === 'REP1_1') {
        pars.push('height=100');
      } else if (this.indicatorCode === 'REP1_2') {
        pars.push('height=50');
      }
      const id = this.$store.state.features.selectedFeatures[0].id_;
      const aoi = `aoi=${id}&`;
      const request = baseUrl + aoi + pars.join('&');
      let fileExtension = '.pdf';
      if (process === 'zones') {
        fileExtension = '.geojson';
      }
      fetch(request)
        .then((res) => res.blob())
        .then((blob) => {
          saveAs(blob, `GTIF_${process}_${id}${fileExtension}`);
          window.dispatchEvent(new CustomEvent('fetch-data-report-loading', { detail: false }));
          window.dispatchEvent(new CustomEvent('fetch-data-zones-loading', { detail: false }));
        })
        .catch((error) => {
          window.dispatchEvent(new CustomEvent('fetch-data-report-loading', { detail: false }));
          window.dispatchEvent(new CustomEvent('fetch-data-zones-loading', { detail: false }));
          console.log(error);
        });
    },
    resetFilters() {
      this.filters = JSON.parse(JSON.stringify(this.cogFilters.filters));
      this.resetMap();
    },
    resetMap() {
      this.variables = JSON.parse(JSON.stringify(this.originalVariables));
      this.updateLayerStyle();
    },
    updateLayerStyle(filterIndex = 0) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      if (gtl) {
        // due to an unknown bug that can not be reproduced outside of eodash
        // GeoTiff sources with index higher than 4 (start at 1) do behave as binary filter
        // on the first load of this panel, manual resetting of source solves the issue
        if (filterIndex > 4 && !this.layerSourceDidRefresh) {
          const s = gtl.getSource();
          gtl.setSource(null);
          gtl.setSource(s);
          // to refresh once per dataset is enough
          this.layerSourceDidRefresh = true;
        }
        gtl.updateStyleVariables(this.variables);
      }
    },
    updateMap(evt, filterId, filterIndex) {
      if (evt.length > 2) {
        [
          this.variables[`${filterId}Min`],
          this.variables[`${filterId}Max`],
          this.variables[`${filterId}Min2`],
          this.variables[`${filterId}Max2`],
        ] = evt;
      } else if (evt.length === 2) {
        [
          this.variables[`${filterId}Min`],
          this.variables[`${filterId}Max`],
        ] = evt;
      } else {
        this.variables[`${filterId}`] = evt;
      }
      this.updateLayerStyle(filterIndex);
    },
    updateMapBool(evt, filterId, filterIndex) {
      // converts to 0/1
      this.variables[filterId] = +evt;
      this.updateLayerStyle(filterIndex);
    },
    updateVisualizationBand(evt, filterId) {
      if (Object.keys(this.filters).includes('visualization')) {
        this.filters.visualization.range = evt.range;
        [this.filters.visualization.min, this.filters.visualization.max] = evt.range;
      }
      [this.variables.visualizationMin, this.variables.visualizationMax] = evt.range;
      this.variables[filterId] = evt.value;
      this.updateLayerStyle();
    },
    enableFilter(filterId) {
      this.filters[filterId].display = true;
    },
    removeFilter(filterId) {
      this.filters[filterId].display = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-select .v-input__control .v-input__slot .v-select__slot .v-select__selections {
  padding: 0 !important;
  min-height: 0 !important;
}

.v-select-list .v-list-item {
  min-height: 0 !important;
}

.v-select-list .v-list-item .v-list-item__content {
  padding: 4px 0 !important;
}
.v-text-field__details {
  position: absolute;
}
</style>
