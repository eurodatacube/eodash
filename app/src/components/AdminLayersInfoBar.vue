<template>
  <v-sheet
  v-if="allowedAdminLevels"
  class="pa-2">
    <h3>
      Administrative Zones Time Series
    </h3>
      <v-row
          align="center"
        >
          <v-col cols="6" class="pb-0 pt-3">
            <h4>
            Administrative zones shown on the map:</h4>
          </v-col>
        <v-col cols="6" class="pa-0">
            <v-select
            class="pb-0 pt-3"
            label="Select admin zone"
            persistent-hint
            return-object
            single-line
            hide-details
            menu-props="auto"
            :items="administrativeConfigs"
            item-value="id"
            item-text="name"
            v-model="currentAdminLevelModel"
            @change="change"
            ></v-select>
        </v-col>
      </v-row>
    <v-row>
      <v-col cols="12"
      class="pb-0 pt-0">
      <p>Zoom map to the administrative zone level by selecting item from the list.
        Select administrative unit on the map to fetch
        time series for this area.
      </p>
      <p>
        This dataset supports selecting following administrative
        units:
        <span v-for="item in allowedAdminLevels" :key="item.id">
            <small>{{item.name}} </small>
        </span>
      </p>
      </v-col>
    </v-row>
    <v-row
    align="center">
      <v-col cols="6" class="pb-0 pt-0">
        <h4 class="pa-0">
          Currently selected administrative unit:
        </h4>
      </v-col>
      <v-col cols="6" class="pb-0 pt-0" v-if="selectedAdminFeature">
        <span>{{selectedAdminLayer}} / {{selectedAdminFeature}}</span>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
// Utilities
import { mapState } from 'vuex';
import { getMapInstance } from '@/components/map/map';

export default {
  props: {
    mergedConfigsData: Object,
  },
  data: () => ({
    currentAdminLevelModel: null,
    selectedAdminLayer: null,
    selectedAdminFeature: null,
  }),
  mounted() {
    const { map } = getMapInstance('centerMap');
    map.on('moveend', this.updateSelectedLayer);
    this.updateSelectedLayer();
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/SET_ADMIN_BORDER_LAYER_SELECTED') {
        const name = mutation.payload ? mutation.payload.get('name') : null;
        this.selectedAdminLayer = name;
      } else if (mutation.type === 'features/SET_ADMIN_BORDER_FEATURE_SELECTED') {
        let name = null;
        if (mutation.payload) {
          const allowedNameProps = ['NUTS_NAME', 'name', 'id'];
          const p = allowedNameProps.find((prop) => mutation.payload.get(prop));
          if (p) {
            name = mutation.payload.get(p);
          }
        }
        this.selectedAdminFeature = name;
      }
    });
  },
  computed: {
    ...mapState('config', ['baseConfig']),
    allowedAdminLevels() {
      if (this.mergedConfigsData.adminLayersCustomIndicator?.adminZoneIds) {
        const layers = this.administrativeConfigs
          .filter((l) => this.mergedConfigsData.adminLayersCustomIndicator?.adminZoneIds
            .includes(l.id));
        return layers;
      }
      return null;
    },
    administrativeConfigs() {
      return this.mergedConfigsData.administrativeLayers || [];
    },
  },
  methods: {
    updateSelectedLayer() {
      const { map } = getMapInstance('centerMap');
      const zoom = map.getView().getZoom();
      // taking the assumption of minZoom maxZoom logic to get currently displayed admin level
      const adminLayerCurrentlyShown = this.administrativeConfigs.find(
        (l) => l.minZoom <= zoom && zoom <= l.maxZoom,
      );
      this.currentAdminLevelModel = adminLayerCurrentlyShown;
    },
    change(evt) {
      const layer = this.administrativeConfigs.find((i) => i.id === evt.id);
      const { map } = getMapInstance('centerMap');
      map.getView().animate({
        duration: 500,
        zoom: (layer.minZoom + layer.maxZoom) / 2,
      });
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance('centerMap');
    map.un('moveend', this.updateSelectedLayer);
  },
};
</script>

<style lang="scss" scoped></style>
