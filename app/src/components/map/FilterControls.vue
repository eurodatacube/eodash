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
            <v-row class="pl-2 pr-2 ml-14 mr-14" dense x-small>
              <v-col
                v-if="filters[key].header"
                cols="7"
                dense x-small
                style="font-size:16px; color: #000000;">
                <span>
                {{filters[key].label}}
                <info-dialog :infoSource="filters[key].dataInfo"/>
                </span>
              </v-col>
              <v-col
                v-else
                cols="12"
                dense x-small
                style="color: #7a7a7a;">
                <span>
                {{filters[key].label}}
                <info-dialog :infoSource="filters[key].dataInfo"/>
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
              <v-col
                v-if="filters[key].changeablaDataset"
                cols="5"
                dense
                x-small
                >
                <v-select
                  v-model="select"
                  style="margin-top:-5px;"
                  :items="filters[key].changeablaDataset.items"
                  item-text="description"
                  item-value="url"
                  dense
                  persistent-hint
                  return-object
                  single-line
                  @change="changeSources"
                ></v-select>
              </v-col>
            </v-row>
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
            <info-dialog
              style="margin-top:10px; margin-left:5px;"
              :infoSource="filters[key].dataInfo"
            />
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
          <center v-else-if="filters[key].isCircular" class="py-6" style="position: relative;">

            <v-progress-circular
              class="compass"
              :rotate="-90 + filters[key].range[0]"
              :size="100"
              :width="8"
              :value="filters[key].range[1] / 360 * 100"
              color="#00ae9d"
            >
              <div style="position: relative; transform: translate(-5px, -10px)">
                <div style="position: absolute; transform: translate(0, -25px)">N</div>
                <div style="position: absolute; transform: translate(25px, 0)">E</div>
                <div style="position: absolute; transform: translate(0, 25px)">S</div>
                <div style="position: absolute; transform: translate(-25px, 0)">W</div>
              </div>
            </v-progress-circular>

            <v-slider
              label="Angle"
              max="360"
              min="0"
              v-model="filters[key].range[0]"
              @input="() => {
                updateMapDebounced([
                  filters[key].range[0],
                  filters[key].range[0] + filters[key].range[1],
                ], filters[key].id);
              }"
            ></v-slider>
            <v-slider
              label="Width"
              max="360"
              min="10"
              v-model="filters[key].range[1]"
              @input="() => {
                updateMapDebounced([
                  filters[key].range[0],
                  filters[key].range[0] + filters[key].range[1],
                ], filters[key].id);
              }"
            ></v-slider>
          </center>
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
      <v-row class="pa-3 justify-center" style="margin-top:10px;">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                small
                disabled
                color="primary"
                class="mr-3"
              >
                Export best zones
              </v-btn>
            </div>
            </template>
            <span>Coming soon.</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                small
                disabled
                color="primary"
                class="mr-3"
              >
                Create report
              </v-btn>
            </div>
            </template>
            <span>Coming soon.</span>
        </v-tooltip>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import debounce from 'lodash.debounce';
import { getMapInstance } from '@/components/map/map';
import GeoTIFF from 'ol/source/GeoTIFF';
import InfoDialog from '@/components/InfoDialog.vue';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import Collection from 'ol/Collection';

export default {
  name: 'FilterControls',
  components: {
    InfoDialog,
  },
  props: {
    cogFilters: Object,
    mergedConfigsData: Object,
  },
  data() {
    return {
      filters: this.cogFilters.filters,
      select: null,
      variables: JSON.parse(JSON.stringify(this.mergedConfigsData?.style?.variables || {})),
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
  created() {
    this.updateMapDebounced = debounce((evt, filterId) => {
      this.updateMap(evt, filterId);
    }, 150);
  },
  mounted() {
    Object.keys(this.filters).forEach((key) => {
      if ('changeablaDataset' in this.filters[key]) {
        // [this.dataSourceSelect[key]] = this.filters[key].changeablaDataset.items;
        // TODO: select only working if one is configured, currently no additional are planned
        [this.select] = this.filters[key].changeablaDataset.items;
      }
    });
  },
  beforeUnmount() {
    this.updateMapDebounced.cancel();
  },
  watch: {
  },
  methods: {
    changeSources(evt) {
      // TODO: I am taking quite a number of shortcuts here, this should be reviewed and better
      // approaches for getting selected indicator and setting the sources should be considered
      const { map } = getMapInstance('centerMap');
      const layers = map.getLayers().getArray();
      // get layerGroup and recreate it, otherwise the webglcontext has visual glitches, if we
      // would just replace the source of a layer
      const layerGroup = layers.find((l) => l.get('name') === this.mergedConfigsData.name);
      map.removeLayer(layerGroup);
      // TODO hardcoded first item in array, we should match by ID or so
      const { sources, style } = this.mergedConfigsData;
      sources[0].url = evt.url;
      const wgTileLayer = new WebGLTileLayer({
        source: new GeoTIFF({
          sources,
          normalize: false,
          interpolate: false,
        }),
        style,
      });
      wgTileLayer.set('id', this.cogFilters.sourceLayer);
      wgTileLayer.updateStyleVariables(this.variables);
      layerGroup.setLayers(new Collection([wgTileLayer]));
      // forces fixing of webgl context, simply updating layers of layergroup does not work
      map.addLayer(layerGroup);
    },
    updateMap(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      [this.variables[`${filterId}Min`], this.variables[`${filterId}Max`]] = evt;
      gtl.updateStyleVariables(this.variables);
    },
    updateMapSlider(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      this.variables[filterId] = evt;
      gtl.updateStyleVariables(this.variables);
    },
    updateMapBool(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      this.variables[filterId] = +evt;
      gtl.updateStyleVariables(this.variables);
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

::v-deep .compass .v-progress-circular__overlay {
  transition: none !important;
}
</style>
