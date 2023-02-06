<template>
  <v-sheet>
    <v-col cols="6">
        <v-subheader>
         Administrative zone
        </v-subheader>
      </v-col>
    <v-col
    cols="6"
    class="pr-0"
    >
    <v-select
        ref="compareTimeSelect"
        outlined
        dense
        attach
        hide-details
        :prepend-inner-icon="(baseConfig.administrativeLayers
        .findIndex((i) => i.id === currentAdminLevel.id) > 0
            ? 'mdi-arrow-left-drop-circle'
            : 'mdi-asterisk')"
        :append-icon="(baseConfig.administrativeLayers
        .findIndex((i) => i.id === currentAdminLevel.id) < baseConfig.administrativeLayers.length - 1
            ? 'mdi-arrow-right-drop-circle'
            : 'mdi-asterisk')"
        menu-props="auto"
        :items="baseConfig.administrativeLayers"
        item-value="id"
        item-text="name"
        return-object
        v-model="currentAdminLevelModel"
        @focus="() => $emit('focusSelect', true)"
        @blur="() => $emit('focusSelect', false)"
        @click:prepend-inner="change('currentAdminLevelModel', -1)"
        @click:append="change('currentAdminLevelModel', +1)"
    ></v-select>
    </v-col>
  </v-sheet>
</template>

<script>
// Utilities
import { mapState } from 'vuex';
import { getMapInstance } from '@/components/map/map';

export default {
  data: () => ({
    currentAdminLevelModel: null,
  }),
  mounted() {
    const { map } = getMapInstance('centerMap');
    const adminLayerCurrentlyShown = baseConfig.administrativeLayers.find((l) => {
        // taking the assumption of minZoom maxZoom logic to get currently displayed admin level
        const mapZoom = map.getView().getZoom();
        return l.get('id') === this.vectorStyles.sourceLayer;
    });
    this.currentAdminLevelModel = this.vectorStyles.items;
  },
  computed: {
    ...mapState('config', ['baseConfig']),
  },
  methods: {
    change(modelName, adjust) {
        // todo
      const newIndex = baseConfig.administrativeLayers
        .findIndex((i) => i.id === this[modelName].value) + adjust;
      this[modelName] = baseConfig.administrativeLayers[newIndex];
      const { map } = getMapInstance('centerMap');
      map.getView().animate({
        duration: 500,
        zoom,
      });
    },
  }
};
</script>

<style lang='scss' scoped></style>
