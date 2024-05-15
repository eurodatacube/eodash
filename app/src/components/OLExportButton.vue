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
          <span>Embed this map into a storytelling section</span>
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
        Embed this element into  a storytelling section
      </v-card-title>

      <v-card-text class="py-5">
        Copy and paste this code into the map section tool of the storytelling editor:
        <code class="pa-3">{{ iframeCode }}
        </code>
        <div class="d-flex align-center justify-end pt-3">
          <v-expand-transition>
            <div v-if="copySuccess" class="success--text mr-3">
            <v-icon
              color="success"
              left
            >mdi-clipboard-check-outline</v-icon>
              <small>copied!</small>
            </div>
          </v-expand-transition>
          <v-btn
            small
            text
            @click="copy(iframeCode)"
          >
            <v-icon left>mdi-content-copy</v-icon>
            copy to clipboard
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
    iframeCode() {
      const layerConfig = this.extractLayerConfig(
        this.$parent.$refs.mapContainer.map.getLayers().getArray(),
      );
      console.log(layerConfig);
      // remove internal layer group
      layerConfig.splice(-1);
      return JSON.stringify(layerConfig);
    },
  },
  methods: {
    extractLayerConfig(layerArray) {
      const layers = [];
      layerArray.map((l) => {
        if (l.constructor.name.includes('Group')) {
          layers.push({
            type: 'Group',
            properties: {
              id: l.get('id') ? l.get('id') : getUid(l),
            },
            layers: this.extractLayerConfig(l.getLayersArray()),
          });
        } else if (l.constructor.name.includes('STACLayer')) {
          layers.push(l.get('_jsonDefinition'));
        } else {
          const layerConfig = {
            type: l.constructor.name.replace('Layer', ''),
            properties: {
              id: l.get('id') ? l.get('id') : getUid(l),
            },
          };
          // Evaluate what other information we need to extract for different source types
          const olsource = l.getSource();
          // only export visible layers
          if (olsource && l.isVisible()) {
            // Extract source config
            const source = {
              type: l.getSource().constructor.name.replace('Source', ''),
            };
            if (['XYZ', 'TileWMS', 'WMS'].includes(olsource.constructor.name)) {
              if ('url' in olsource) {
                source.url = olsource.url;
              } else if ('urls' in olsource) {
                source.urls = olsource.urls;
              }
            } else if (olsource.constructor.name === 'VectorSource') {
              source.url = olsource.getUrl();
              source.format = olsource.getFormat()?.constructor.name;
            }
            // Extract possible other configuration options
            if (['TileWMS', 'WMS'].includes(olsource.constructor.name)) {
              source.params = olsource.getParams();
              source.serverType = olsource.serverType_;
            }
            if (olsource.constructor.name === 'VectorSource') {
              // TODO: the getStyle function does not return the applied style as described in OL docs
              layerConfig.style = ''; // l.getStyle();
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
