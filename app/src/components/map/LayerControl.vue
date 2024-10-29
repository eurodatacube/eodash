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
    class="layerControl"
    :class="{'scrollable': appConfig.id === 'gtif' && $vuetify.breakpoint.smAndDown}"
  >
    <v-card-actions class="pa-0">
      <v-col class="text-right pa-0">
        <v-btn style="width:16px;height:20px;min-width:unset;" @click="() => show = !show">x</v-btn>
      </v-col>
    </v-card-actions>
    <eox-layercontrol
      :for="'#' + mapId "
      :titleProperty.prop="'name'"
      :tools.prop="['info', 'config', 'opacity', 'sort']"
      class="pointerEvents">
    </eox-layercontrol>
  </v-card>
</template>

<script>
import 'ol/ol.css';
import { getMapInstance } from '@/components/map/map';
import { mapState } from 'vuex';

export default {
  components: {},
  props: {
    mapId: String,
  },
  data() {
    return {
      show: false,
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
