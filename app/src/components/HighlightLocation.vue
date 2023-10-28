<template>
  <div
  class="my-1"
  style="pointer-events: all; position:absolute;top: 0px;"
  :style="{left: ($vuetify.breakpoint.smAndUp ? 24.5 : 2) +'%'}"
  v-show="indicatorObject && indicatorObject.highlights"
  >
      <v-list style="width: 100%; background-color: #00000000;">
        <v-list-item-group style="width: 100%"
            v-if="indicatorObject && indicatorObject.highlights"
          >
          <v-list-item
            v-for="item in indicatorObject.highlights"
            :key="item.name"
            class="mb-2 dashboard-button v-btn v-btn--is-elevated
            v-btn--has-bg theme--light v-btn--size-small"
            style="width: 100%;min-height: 0px;"
            @click="moveToHighlight(item.location)"
          >
            <v-list-item-content
              style="padding: 6px 0px;"
            >
              <v-list-item-title v-html="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
 </template>
<script>
import GeoJSON from 'ol/format/GeoJSON';
import { getMapInstance } from './map/map';
import { calculatePadding } from '../utils';

export default {
  props: {
    indicatorObject: Object,
  },
  methods: {
    moveToHighlight(location) {
      const { map } = getMapInstance('centerMap');
      const featureProjection = map.getView().getProjection();
      const geoJsonFormat = new GeoJSON({
        featureProjection,
      });
      const geom = geoJsonFormat.readGeometry(location);
      const padding = calculatePadding();
      map.getView().fit(geom.getExtent(), {
        duration: 0, padding,
      });
    },
  },
};
</script>
