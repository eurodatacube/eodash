<template>
  <v-sheet
  v-if="allowedAdminLevels">
      <v-header>
        Administrative Zones Time Series
      </v-header>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-row
          align="center"
          v-bind="attrs"
          v-on="on"
        >
          <v-col cols="6">
            <v-subheader>
            Administrative zones shown on the map</v-subheader>
          </v-col>
        <v-col cols="5">
            <v-select
            label="Select admin zone"
            persistent-hint
            return-object
            single-line
            hide-details
            menu-props="auto"
            :items="baseConfig.administrativeLayers"
            item-value="id"
            item-text="name"
            v-model="currentAdminLevelModel"
            @change="change"
            ></v-select>
        </v-col>
      </v-row>
    </template>
    <span>
        Zoom map to the administrative zone level by selecting item from the list.
    </span>
  </v-tooltip>
    <v-row>
      <v-col cols="12">
      <p>
        <v-icon>
            mdi-exclamation
        </v-icon>
        Click on administrative unit on the map to fetch
        a custom chart with time series for this area.
      </p>
      <p>
        This dataset supports following administrative
        units for this functionality:
      </p>
      <v-list>
        <v-list-item
          v-for="item in allowedAdminLevels"
          :key="item.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
  }),
  mounted() {
    const { map } = getMapInstance('centerMap');
    map.on('moveend', this.updateSelectedLayer);
    this.updateSelectedLayer();
  },
  computed: {
    ...mapState('config', ['baseConfig']),
    allowedAdminLevels() {
      if (this.mergedConfigsData.adminLayersCustomIndicator?.adminZoneIds) {
        const layers = this.baseConfig.administrativeLayers
          .filter((l) => this.mergedConfigsData.adminLayersCustomIndicator?.adminZoneIds
            .includes(l.id));
        return layers;
      }
      return null;
    },
  },
  methods: {
    updateSelectedLayer() {
      const { map } = getMapInstance('centerMap');
      const zoom = map.getView().getZoom();
      // taking the assumption of minZoom maxZoom logic to get currently displayed admin level
      const adminLayerCurrentlyShown = this.baseConfig.administrativeLayers.find(
        (l) => l.minZoom <= zoom && zoom <= l.maxZoom,
      );
      this.currentAdminLevelModel = adminLayerCurrentlyShown;
    },
    change(evt) {
      const layer = this.baseConfig.administrativeLayers.find((i) => i.id === evt.id);
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
