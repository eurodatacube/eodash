<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{}">
      <template v-if="mapControl">
        <v-tooltip left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :color="$vuetify.theme.currentTheme.background"
              small
              class="dashboard-button"
              style="min-width: 0;"
              v-on="{ ...tooltip, ...dialog }"
              @click="dialog = true"
            >
              <v-icon>
                mdi-map-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Embed this map into a story</span>
        </v-tooltip>
      </template>
      <v-btn
        v-else
        color="primary"
        text
        small
        @click="dialog = true"
      >
        <template>
          <v-icon left>mdi-map-plus</v-icon>
          embed chart
        </template>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Storytelling map configuration
      </v-card-title>

      <v-card-text class="py-5">
        <div>
          Copy and paste this code into the map <b>layers</b> field of the storytelling editor:
        </div>
        <div
          class="pa-3"
          style="background-color: #ddd;font-family: monospace;font-size: 11px;max-height: 300px; overflow-y: auto;">
            {{ layersConfig }}
        </div>
        <div style="position: absolute; bottom: 15px;">
          <v-expand-transition>
            <div v-if="copySuccess" class="success--text mr-3">
            <v-icon
              color="success"
              left
            >mdi-clipboard-check-outline</v-icon>
              <small>copied!</small>
            </div>
          </v-expand-transition>
        </div>
        <div class="d-flex align-center justify-end pt-3">
          <v-btn
            small
            text
            @click="copy(layersConfig)"
          >
            <v-icon left>mdi-content-copy</v-icon>
            copy as layers config
          </v-btn>
        </div>
        <div class="d-flex align-center justify-end pt-3">
          <v-btn
            small
            text
            @click="copy(mapEntryCode)"
          >
            <v-icon left>mdi-content-copy</v-icon>
            copy as simple map
          </v-btn>
        </div>
        <div class="d-flex align-center justify-end pt-3">
          <v-btn
            small
            text
            @click="copy(mapStepCode)"
          >
            <v-icon left>mdi-content-copy</v-icon>
            copy as map tour section
          </v-btn>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin';
import {
  mapState,
} from 'vuex';
import { getUid } from 'ol/util';
import { toLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import { TileWMS, WMTS, XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON, MVT, WKB } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';

export default {
  mixins: [dialogMixin],
  props: {
    indicatorObject: Object,
    featureObject: Object,
    mapControl: Boolean,
    center: Object,
    zoom: Number,
  },
  data: () => ({
    dialog: false,
    copySuccess: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    layersConfig() {
      const layerConfig = this.extractLayerConfig(
        this.$parent.$refs.mapContainer.map.getLayers().getArray(),
      );
      // remove internal layer group
      layerConfig.splice(-1);
      // We want also to inverse the layers within the analysis group
      // else they will be reversed in the config
      // Check to make sure we have the expected overlay, baselayer and analysis groups
      if (layerConfig.length === 3) {
        layerConfig[1].reverse();
      }
      // reverse to use same order as eox-map config
      layerConfig.reverse();
      return JSON.stringify(layerConfig.flat());
    },
    mapStepCode() {
      const mapView = this.$parent.$refs.mapContainer.map.getView();
      const origCoords = mapView.get('center');
      const lonlat = toLonLat(origCoords, mapView.getProjection());
      const preTag = '### <!--{ layers=';
      const endTag = `zoom="${mapView.get('zoom')}" center=[${[lonlat]}] animationOptions={duration:500}}-->
#### Tour step title
Text describing the current step of the tour and why it is interesting what the map shows currently
`;
      return `${preTag}'${this.layersConfig}' ${endTag}`;
    },
    mapEntryCode() {
      const mapView = this.$parent.$refs.mapContainer.map.getView();
      const origCoords = mapView.get('center');
      const lonlat = toLonLat(origCoords, mapView.getProjection());
      const preTag = '## Map Example <!--{as="eox-map" style="width: 100%; height: 500px;" layers=';
      const endTag = `zoom="${mapView.get('zoom')}" center=[${[lonlat]}] }-->`;
      return `${preTag}'${this.layersConfig}' ${endTag}`;
    },
  },
  methods: {
    extractLayerConfig(layerArray) {
      // Extract completely flat layers array without groups
      const layers = [];
      layerArray.map((l) => {
        if (l instanceof LayerGroup) {
          layers.push(this.extractLayerConfig(l.getLayersArray()));
        } else if (l instanceof TileLayer || l instanceof VectorLayer) {
          const layerConfig = {
            type: 'Tile',
            properties: {
              id: l.get('configId') ? l.get('configId') : getUid(l),
            },
          };
          if (l instanceof VectorLayer) {
            layerConfig.type = 'Vector';
          }
          // Evaluate what other information we need to extract for different source types
          const olsource = l.getSource();
          // only export visible layers
          if (olsource && l.isVisible()) {
            // Find correct type
            let foundType;
            if (olsource instanceof XYZ) {
              foundType = 'XYZ';
            }
            if (olsource instanceof TileWMS) {
              foundType = 'TileWMS';
            }
            if (olsource instanceof VectorSource) {
              foundType = 'Vector';
            }
            if (olsource instanceof WMTS) {
              foundType = 'WMTS';
            }
            // Extract source config
            const source = {
              type: foundType,
            };
            if (['XYZ', 'TileWMS', 'WMTS'].includes(foundType)) {
              if ('url' in olsource) {
                source.url = olsource.url;
              } else if ('urls' in olsource) {
                source.urls = olsource.urls;
              }
            } else if (foundType === 'Vector') {
              source.url = olsource.getUrl();
              if (typeof source.url === 'undefined') {
                // features were loaded directly so it is a custom area indicator
                // we want to export the features with the configuration
                const format = new GeoJSON();
                const features = olsource.getFeatures();
                if (features && features.length > 0) {
                  const geoJsonStr = format.writeFeatures(features, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
                  source.url = `data:application/json;,${encodeURI(geoJsonStr)}`;
                  source.format = 'GeoJSON';
                  layerConfig.style = {
                    'stroke-color': 'red',
                    'stroke-width': 2,
                    'circle-radius': 4,
                    'circle-stroke-color': 'red',
                    'circle-stroke-width': 3,
                  };
                }
              }
              let vsf;
              const olformat = olsource.getFormat();
              if (olformat instanceof GeoJSON) {
                vsf = {
                  type: 'GeoJSON',
                };
                const pcode = olformat.dataProjection.getCode();
                if (pcode) {
                  vsf.dataProjection = pcode;
                }
              }
              if (olformat instanceof MVT) {
                vsf = 'MVT';
              }
              if (olformat instanceof WKB) {
                vsf = 'WKB';
              }
              if (vsf) {
                source.format = vsf;
              }
            }
            // Extract possible other configuration options
            if (['TileWMS'].includes(foundType)) {
              source.params = olsource.getParams();
              source.serverType = olsource.serverType_;
            }
            if (['WMTS'].includes(foundType)) {
              source.layer = olsource.getLayer();
              source.format = olsource.getFormat();
              source.matrixSet = olsource.getMatrixSet();
              const tileGrid = olsource.getTileGrid();
              source.tileGrid = {
                resolutions: tileGrid.getResolutions(),
                projection: olsource.getProjection().getCode(),
                matrixIds: tileGrid.getMatrixIds(),
                origin: tileGrid.getOrigin(0),
              };
            }
            if (foundType === 'Vector') {
              // We can't export a function style function
              // only flat styles, for now we ignore this case
              if (typeof l.getStyle !== 'function') {
                layerConfig.style = l.getStyle();
              }
            }
            if (l.getOpacity() !== 1) {
              layerConfig.opacity = l.getOpacity();
            }
            layerConfig.source = source;
            layers.push(layerConfig);
          }
        }
        return true;
      });
      return layers;
    },
    async copy(s) {
      await navigator.clipboard.writeText(s);
      this.copySuccess = true;
    },
  },
};
</script>

<style scoped>
  .dashboard-button {
    width: 36px;
    height: 36px !important;
    z-index: 2;
    pointer-events: initial;
  }
</style>
