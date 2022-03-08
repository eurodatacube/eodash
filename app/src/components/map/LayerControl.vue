<template>
  <v-card class="layerControl pa-1">
    <v-icon v-if="!show" @click="show = true" class="layerIcon"> mdi-layers </v-icon>
    <div v-else>
        <v-radio-group v-model="selectedBaseLayer" class="mt-0" hide-details>
          <v-radio v-for="l in baseLayers" :key="l.name" :label="l.name">
            <template v-slot:label>
            <span class="label">{{l.name}}</span>
            </template>
          </v-radio>
        </v-radio-group>
        <v-divider class="my-1" />
        <v-checkbox v-for="n in overlayConfigs" :key="n.name" :label="n.name"
          :value="n.visible" dense class="my-0 py-0" hide-details
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
  computed: {
    countriesStyle() {
      return {
        color: '#a2a2a2',
        weight: 1,
        fillColor: '#fff',
        opacity: this.opacityCountries[this.zoom],
        fillOpacity: this.opacityCountries[this.zoom],
      };
    },
  },
  mounted() {
    this.selectedBaseLayer = this.baseLayers.findIndex((l) => l.visible === true);
  },
  methods: {
    setVisible(value, layerConfig) {
      debugger;
      const olLayers = getMapInstance(this.mapId).map.getLayers().getArray();
      const layer = olLayers.find((l) => l.get('name') === layerConfig.name);
      layer.setVisible(value);
    },
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss" scoped>
  .layerControl {
    position: absolute;
    top: 110px;
    right: 10px;
    z-index: 2;
    border-radius: 3px;
    -webkit-box-shadow: 0px 0px 5px 2px rgba(255,255,255,0.63) !important;
    box-shadow: 0px 0px 5px 2px rgba(255,255,255,0.63) !important;
  }

  .label {
   font-size: 12px;
  }

  .v-input--selection-controls__ripple {
    margin: 2px !important;
  }
</style>
