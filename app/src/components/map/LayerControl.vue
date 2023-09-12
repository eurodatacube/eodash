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
    const baseLayers = this.baseLayerConfigs.map((l) => {
      const createdLayer = createLayerFromConfig(l, map);
      createdLayer.set('layerControlExclusive', true);
      return createdLayer;
    });
    baseLayers.forEach((layer) => {
      const backgroundGroup = map.getLayers().getArray().find((l) => l.get('id') === 'backgroundGroup');
      backgroundGroup.getLayers().push(layer);
    });
    const overlayLayers = this.overlayConfigs.map((l) => createLayerFromConfig(l,
      map,
      {
        updateOpacityOnZoom: l.name === 'Overlay labels' || l.name === 'Country vectors',
      }));
    overlayLayers.forEach((layer) => {
      const overlayGroup = map.getLayers().getArray().find((l) => l.get('id') === 'overlayGroup');
      overlayGroup.getLayers().push(layer);
    });
    map.on('moveend', this.updateOverlayOpacity);
    map.dispatchEvent({ type: 'moveend' });
  },
  methods: {
    updateOverlayOpacity(e) {
      const map = e.target;
      const view = map.getView();
      const zoom = Math.floor(view.getZoom());
      const overlayGroup = map.getLayers().getArray().find((l) => l.get('id') === 'overlayGroup');

      this.overlayConfigs.forEach((c) => {
        const layer = overlayGroup.getLayers().getArray().find((l) => l.get('name') === c.name);
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
    const backgroundGroup = map.getLayers().getArray().find((l) => l.get('id') === 'backgroundGroup');
    this.baseLayerConfigs.forEach((config) => {
      const layer = backgroundGroup.getLayers().getArray().find((l) => l.get('name') === config.name);
      backgroundGroup.getLayers().remove(layer);
    });

    const overlayGroup = map.getLayers().getArray().find((l) => l.get('id') === 'overlayGroup');
    this.overlayConfigs.forEach((config) => {
      const layer = overlayGroup.getLayers().getArray().find((l) => l.get('name') === config.name);
      overlayGroup.getLayers().remove(layer);
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
