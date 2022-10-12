<template>
  <v-tooltip v-if="!show" left>
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
    class="layerControl pa-2"
  >
    <v-radio-group v-model="selectedBaseLayer" class="mt-0" hide-details mandatory>
      <v-radio v-for="(c, index) in baseLayerConfigs"
        :key="index" :label="c.name" :value="index">
        <template v-slot:label>
        <span class="label">{{c.name}}</span>
        </template>
      </v-radio>
    </v-radio-group>
    <v-divider class="my-1" />
    <v-checkbox v-for="n in overlayConfigs" :key="n.name" :label="n.name"
      :input-value="n.visible" dense class="my-0 py-0" hide-details
      @change="setVisible($event, n)">
        <template v-slot:label>
          <span class="label">{{n.name}}</span>
        </template>
    </v-checkbox>
    <div v-if="administrativeConfigGroup">
      <v-checkbox v-for="n in administrativeConfigGroup" :key="n.name" :label="n.name"
      v-model="n.visible" dense class="my-0 py-0" hide-details
      @change="setVisibleAdminGroup($event, n)">
        <template v-slot:label>
          <span class="label">{{n.name}}</span>
        </template>
      </v-checkbox>
    </div>
  </v-card>
</template>

<script>
import 'ol/ol.css';
import getMapInstance from '@/components/map/map';
import { createLayerFromConfig } from '@/components/map/layers';

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
    administrativeConfigs: Array,
    isGlobalIndicator: Boolean,
  },
  data() {
    return {
      show: false,
      selectedBaseLayer: null,
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
    selectedBaseLayer(selectedIndex) {
      const olLayers = getMapInstance(this.mapId).map.getLayers().getArray();
      this.baseLayerConfigs.forEach((l, i) => {
        const layer = olLayers.find((olLayer) => olLayer.get('name') === l.name);
        if (i === selectedIndex) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      });
    },
  },
  computed: {
    administrativeConfigGroup() {
      let groups = null;
      if (this.administrativeConfigs.length > 0) {
        groups = [{
          name: "Administrative Layers",
          visible: true,
          configs: this.administrativeConfigs,
        }];
      }
      return groups;
    }
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const baseLayers = this.baseLayerConfigs.map((l) => createLayerFromConfig(l, { zIndex: 0 }));
    baseLayers.forEach((l) => {
      map.addLayer(l);
    });
    const overlayLayers = this.overlayConfigs.map((l) => createLayerFromConfig(l,
      {
        // higher zIndex for labels
        zIndex: l.name === 'Overlay labels' ? 4 : 2,
        updateOpacityOnZoom: l.name === 'Overlay labels' || l.name === 'Country vectors',
      }));
    overlayLayers.forEach((l) => {
      map.addLayer(l);
    });
    map.on('moveend', this.updateOverlayOpacity);
    map.dispatchEvent({ type: 'moveend' });
    this.selectedBaseLayer = this.baseLayerConfigs.findIndex((l) => l.visible === true) || 0;
  },
  methods: {
    setVisible(value, layerConfig) {
      const olLayers = getMapInstance(this.mapId).map.getLayers().getArray();
      const layer = olLayers.find((l) => l.get('name') === layerConfig.name);
      layer.setVisible(value);
    },
    setVisibleAdminGroup(value, layerConfigsGroup) {
      const olLayers = getMapInstance(this.mapId).map.getLayers().getArray();
      layerConfigsGroup.configs.forEach((config) => {
        const layer = olLayers.find((l) => l.get('name') === config.name);
        layer.setVisible(value);
      })
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
