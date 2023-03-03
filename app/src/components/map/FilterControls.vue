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
            @input="(evt) => updateMapDebounced(evt, filters[key].id)"
          >
            <template v-slot:prepend>
              <div class="pl-4" style="width:60px; overflow:hidden;"></div>
            </template>
            <template v-slot:append>
              <div class="pr-4" style="width:60px; overflow:hidden;">{{filters[key].value}}</div>
            </template>
          </v-slider>
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
                    updateMapDebounced([from, 360, 0, to - 360], filters[key].id);
                  } else {
                    updateMapDebounced([from, to, 0, 0], filters[key].id);
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
                    updateMapDebounced([from, 360, 0, to - 360], filters[key].id);
                  } else {
                    updateMapDebounced([from, to, 0, 0], filters[key].id);
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
            :step="(filters[key].max-filters[key].min)/100"
            @input="(evt) => updateMapDebounced(evt, filters[key].id)"
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
        <v-btn
          small
          color="primary"
          class="mr-3"
          @click="exportBestZones"
        >
          Export best zones
        </v-btn>
        <a ref="imageDownload"></a>
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
import { transformExtent } from 'ol/proj';

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
      if (gtl) {
        gtl.updateStyleVariables(this.variables);
      }
    },
    updateMapBool(evt, filterId) {
      const { map } = getMapInstance('centerMap');
      const gtl = map.getAllLayers().find((l) => l.get('id') === this.cogFilters.sourceLayer);
      // converts to 0/1
      this.variables[filterId] = +evt;
      if (gtl) {
        gtl.updateStyleVariables(this.variables);
      }
    },
    enableFilter(filterId) {
      this.filters[filterId].display = true;
    },
    removeFilter(filterId) {
      this.filters[filterId].display = false;
    },
    exportBestZones() {
      const { map } = getMapInstance('centerMap');

      // See https://openlayers.org/en/latest/examples/export-map.html
      const mapCanvas = document.createElement('canvas');
      const size = map.getSize();
      [mapCanvas.width, mapCanvas.height] = size;
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
        (canvas) => {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            let matrix;
            const { transform } = canvas.style;
            if (transform) {
              // Get the transform parameters from the style's transform matrix
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1] // eslint-disable-line
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0,
              ];
            }
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix,
            );
            const { backgroundColor } = canvas.parentNode.style;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            mapContext.drawImage(canvas, 0, 0);
          }
        },
      );
      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      // Crop the canvas taking the UI sidebar into consideration
      const croppedCanvas = document.createElement('canvas');
      const croppedContext = croppedCanvas.getContext('2d');

      const sidePanelWidth = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--data-panel-width').replace('px', ''), 10);
      croppedCanvas.width = mapCanvas.width - sidePanelWidth;
      croppedCanvas.height = mapCanvas.height;

      croppedContext.drawImage(mapCanvas, 0, 0);
      //

      // Calculate lonLat extent by taking cropping into consideration
      const mapExtent = map.getView().calculateExtent(map.getSize());
      const croppedX = map.getCoordinateFromPixel([croppedCanvas.width, 0])[0];
      const lonLatExtent = transformExtent([
        mapExtent[0],
        mapExtent[1],
        croppedX,
        mapExtent[3],
      ], 'EPSG:3857', 'EPSG:4326');
      //

      const link = this.$refs.imageDownload;
      link.download = `gtif_best_zones_${
        this.$route.query.poi
      }_${
        lonLatExtent.map((c) => c.toFixed(3)).join('-')
      }.png`;
      link.href = croppedCanvas.toDataURL();
      link.click();
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
