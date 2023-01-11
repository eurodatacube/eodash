<template>
  <v-col v-if="filters"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
    <v-card class="pa-3">
      <div v-for="key in Object.keys(filters)"
        :key="key"
      >
        <template v-if="filters[key].display">
          <span v-if="!(filters[key].type && filters[key].type=='boolfilter')">
            <span
              v-if="filters[key].header"
              class="pl-8 ml-10"
              style="font-size:20px; color: #000000;">
              {{filters[key].label}}
            </span>
            <span v-else class="pl-8 ml-10" style="color: #7a7a7a;"> {{filters[key].label}} </span>
            <v-btn
              v-if="!filters[key].header"
              icon
              x-small
              color="primary"
              @click="removeFilter(key)"
              style="margin-bottom:4px;"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </span>
          <v-col class='d-flex justify-center'
            v-if="filters[key].type && filters[key].type=='boolfilter'"
          >
            <v-checkbox
              v-model="filters[key].value"
              :label="filters[key].label"
              dense
              @change="(evt) => updateMapBool(evt, filters[key].id)"
            ></v-checkbox>
            <v-btn
              v-if="!filters[key].header"
              icon
              x-small
              color="primary"
              @click="removeFilter(key)"
              style="padding-top: 20px; padding-left: 4px;"
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
            :step="(filters[key].max-filters[key].min)/100"
            @input="(evt) => updateMapSlider(evt, filters[key].id)"
          >
            <template v-slot:prepend>
              <div class="pl-4" style="width:60px; overflow:hidden;"></div>
            </template>
            <template v-slot:append>
              <div class="pr-4" style="width:60px; overflow:hidden;">{{filters[key].value}}</div>
            </template>
          </v-slider>
          <v-range-slider
            v-else
            v-model="filters[key].range"
            hide-details
            dense
            :min="filters[key].min"
            :max="filters[key].max"
            :step="(filters[key].max-filters[key].min)/100"
            @input="(evt) => updateMap(evt, filters[key].id)"
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
            <v-btn
              small
              class="mr-3"
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              Add filter
            </v-btn>
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
      <v-row class="pa-3 justify-center" style="margin-top:20px;">
        <v-btn small class="mr-3" color="primary">Export best zones</v-btn>
        <v-btn small class="ml-3" color="primary">Create report</v-btn>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>

import { getMapInstance } from '@/components/map/map';

export default {
  name: 'FilterControls',
  components: {},
  props: {
    cogFilters: Object,
  },
  data() {
    return {
      filters: this.cogFilters.filters,
    };
  },
  computed: {
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
  watch: {
  },
  methods: {
    updateMap(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      const variables = {};
      [variables[`${filterId}Min`], variables[`${filterId}Max`]] = evt;
      gtl.updateStyleVariables(variables);
    },
    updateMapSlider(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      const variables = {};
      variables[filterId] = evt;
      gtl.updateStyleVariables(variables);
    },
    updateMapBool(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      const variables = {};
      variables[filterId] = +evt;
      gtl.updateStyleVariables(variables);
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
</style>
