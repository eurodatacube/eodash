<template>
  <v-card class="layerControl">
    <v-icon v-if="!show" @click="show = true" color="primary" class="layerIcon ma-1">
      mdi-layers
    </v-icon>
    <div v-else class="pa-2">
        <v-radio-group v-model="selectedBaseLayer" class="mt-0" hide-details mandatory>
          <v-radio v-for="(l, index) in baseLayers" :key="index" :label="l.name" :value="index">
            <template v-slot:label>
            <span class="label">{{l.name}}</span>
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
    </div>
  </v-card>
</template>

<script>
import 'ol/ol.css';
import getMapInstance from '@/components/map/map';

export default {
  components: {},
  props: {
    mapId: String,
    baseLayers: Array,
    overlayConfigs: Array,
  },
  data() {
    return {
      show: false,
      selectedBaseLayer: null,
      selectedOverlayerLayers: null,
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
      this.baseLayers.forEach((l, i) => {
        const layer = olLayers.find((olLayer) => olLayer.get('name') === l.name);
        if (i === selectedIndex) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      });
    },
  },
  computed: {},
  mounted() {
    this.selectedBaseLayer = this.baseLayers.findIndex((l) => l.visible === true) || 0;
  },
  methods: {
    setVisible(value, layerConfig) {
      const olLayers = getMapInstance(this.mapId).map.getLayers().getArray();
      const layer = olLayers.find((l) => l.get('name') === layerConfig.name);
      layer.setVisible(value);
    },
  },
};
</script>

<style lang="scss" scoped>
  .layerControl {
    position: absolute;
    top: 105px;
    right: 10px;
    z-index: 2;
  }

  .label {
   font-size: 12px;
  }

  .v-input--selection-controls__ripple {
    margin: 2px !important;
  }
</style>
