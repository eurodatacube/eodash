<template>
  <v-tooltip v-if="!show && !enableScrollyMode" left>
    <template v-slot:activator="{ on }">
      <v-btn
        :color="$vuetify.theme.currentTheme.background"
        small
        class="layerControl layerControlBtn mb-2"
        style="min-width: 0;"
        v-on="on"
        @click="show = true"
      >
        <v-icon>
          mdi-layers
        </v-icon>
      </v-btn>
    </template>
    <span>Map layers</span>
  </v-tooltip>
  <v-card
    v-else
    class="layerControl"
    :class="{'scrollable': appConfig.id === 'gtif' && $vuetify.breakpoint.smAndDown}"
  >
    <eox-layercontrol
      :for="'#' + mapId "
      layerTitle="name"
      class="pointerEvents">
    </eox-layercontrol>
  </v-card>
</template>

<script>
import 'ol/ol.css';
import { getMapInstance } from '@/components/map/map';
import { createLayerFromConfig } from '@/components/map/layers';
import { mapState } from 'vuex';

/**
 * a component that will handle base and overlay layers and displays
 * them in an interactive layer control
 */
export default {
  components: {},
  props: {
    mapId: String,
    baseLayerConfigs: Array,
    overlayConfigs: Array,
    dataLayerConfigLayerControls: [Array, null], // TODO not used atm
    isGlobalIndicator: Boolean,
    enableScrollyMode: Boolean,
  },
  data() {
    return {
      show: false,
      opacityOverlay: [0, 0, 0, 0, 0, 0, 0.4, 0.4, 0.8, 0.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      opacityCountries: [1, 1, 1, 1, 0.7, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  },
  watch: {
    show(value) {
      if (value) {
        getMapInstance(this.mapId).map.once('click', () => {
          this.show = false;
        });
      }
    },
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const baseLayers = this.baseLayerConfigs.map((l) => createLayerFromConfig(l,
      map,
      {
        zIndex: 0,
      }));
    baseLayers.forEach((l) => {
      map.addLayer(l);
    });
    const overlayLayers = this.overlayConfigs.map((l) => createLayerFromConfig(l,
      map,
      {
        // higher zIndex for labels
        zIndex: l.name === 'Overlay labels' ? 4 : (l.zIndex || 2),
        updateOpacityOnZoom: l.name === 'Overlay labels' || l.name === 'Country vectors',
      }));
    overlayLayers.forEach((l) => {
      map.addLayer(l);
    });
    map.on('moveend', this.updateOverlayOpacity);
    map.dispatchEvent({ type: 'moveend' });
  },
  methods: {
    setVisible(value, layerConfig) {
      // TODO: LUBO, what to do with this?
      // toggle original layer and possibly also compare
      const olLayers = getMapInstance(this.mapId).map.getLayers().getArray();
      const layers = olLayers.filter((l) => {
        const found = l.get('name') === layerConfig.name || l.get('name') === `${layerConfig.name}_compare`;
        return found;
      });
      layers.forEach((l) => l.setVisible(value));
    },
    updateOverlayOpacity(e) {
      const map = e.target;
      const view = map.getView();
      const zoom = Math.floor(view.getZoom());
      const layers = map.getLayers().getArray();
      this.overlayConfigs.forEach((c) => {
        const layer = layers.find((l) => l.get('name') === c.name);
        if (layer.get('updateOpacityOnZoom')) {
          if (layer.get('name') === 'Country vectors') {
            layer.setOpacity(this.opacityCountries[zoom]);
          } else {
            // show overlays on low zoom levels for global indicators
            const opacity = this.isGlobalIndicator ? 1 : this.opacityOverlay[zoom] || 0;
            layer.setOpacity(opacity);
          }
        }
      });
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const layers = map.getLayers().getArray();
    [
      ...this.baseLayerConfigs, ...this.overlayConfigs,
    ].forEach((config) => {
      const layer = layers.find((l) => l.get('name') === config.name);
      map.removeLayer(layer);
    });
    map.un('moveend', this.updateOverlayOpacity);
  },
};
</script>

<style lang="scss" scoped>
  .layerControl {
    z-index: 2;

    &.scrollable {
      overflow-y: scroll;
      min-height: 200px;
      max-height: 200px;
    }
  }
  .layerControlBtn {
    width: 36px;
    height: 36px !important;
    pointer-events: initial;
  }

  .label {
   font-size: 12px;
  }

  .v-input--selection-controls__ripple {
    margin: 2px !important;
  }
</style>
