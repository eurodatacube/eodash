<template>
  <v-card class="customDrawTools primary--text">
    <v-card
      v-if="isDrawing"
      class="cancelDrawButton"
      @click="disableInteractions"
      >
      <v-card-text
      class="pa-1"
      :style="`color: ${appConfig.branding.primaryColor};`">
        Cancel drawing
      </v-card-text>
    </v-card>
    <v-card class="drawPolygonButton"
    v-if="drawToolsVisible">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block">
            <v-btn
              fab
              class="pa-0"
              :style="`${
                $vuetify.breakpoint.mdAndDown
                  ? 'width: 36px; height: 36px;'
                  : 'width: 30px; height: 30px;'
              } border-radius: 4px`"
              @click="drawEnable('polygon')"
            >
              <v-icon>mdi-vector-polygon</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Draw Polygon</span>
      </v-tooltip>
    </v-card>
    <v-card
    v-if="drawToolsVisible">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block">
            <v-btn
              fab
              class="pa-0"
              :style="`${
                $vuetify.breakpoint.mdAndDown
                  ? 'width: 36px; height: 36px;'
                  : 'width: 30px; height: 30px;'
              } border-radius: 4px`"
              @click="drawEnable('bbox')"
            >
              <v-icon>mdi-vector-rectangle</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Draw Rectangle</span>
      </v-tooltip>
    </v-card>
    <v-card
    v-if="deleteButtonVisible">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block">
            <v-btn
              color="error"
              fab
              class="pa-0"
              :style="`${
                $vuetify.breakpoint.mdAndDown
                  ? 'width: 36px; height: 36px;'
                  : 'width: 30px; height: 30px;'
              } border-radius: 4px`"
              @click="clearCustomAreaFilter"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Clear selection</span>
      </v-tooltip>
    </v-card>
    <v-card
    v-if="customChartButtonVisible">
        <v-tooltip left>
            <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
                <v-btn
                color="white"
                fab
                class="pa-0"
                :style="`${$vuetify.breakpoint.mdAndDown
                    ? 'width: 36px; height: 36px;'
                    : 'width: 30px; height: 30px;'}
                    border-radius: 4px;
                    color: ${appConfig.branding.primaryColor};`"
                @click="fetchCustomAreaIndicator"
                >
                <v-icon>mdi-poll</v-icon>
                </v-btn>
            </div>
            </template>
            <span>Draw chart from sub-area</span>
        </v-tooltip>
    </v-card>
    <v-card
    v-if="loading">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block">
              <v-btn
              color="white"
              fab
              class="pa-0"
              :style="`${$vuetify.breakpoint.mdAndDown
                  ? 'width: 36px; height: 36px;'
                  : 'width: 30px; height: 30px;'}
                  border-radius: 4px;
                  color: ${appConfig.branding.primaryColor};`"
              >
              <v-icon>mdi-loading mdi-spin</v-icon>
              </v-btn>
          </div>
          </template>
          <span>Custom data are loading</span>
        </v-tooltip>
    </v-card>
  </v-card>
</template>


<script>
import getMapInstance from '@/components/map/map';
import Draw, { createBox } from 'ol/interaction/Draw';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      drawControls: {},
      drawSource: null,
      drawnAreaSource: null,
      isDrawing: null,
      drawVectorLayer: null,
      drawnAreaLayer: null,
    };
  },
  props: {
    mapId: String,
    hideCustomAreaControls: {
      required: false,
    },
    mergedConfigsData: Object,
    drawnArea: {
      area: null,
    },
    loading: Boolean,
  },
  computed: {
    ...mapState('config', ['appConfig']),
    drawToolsVisible() {
      return !this.hideCustomAreaControls
      && (this.mergedConfigsData?.customAreaIndicator
        || this.mergedConfigsData?.customAreaFeatures
      );
    },
    customChartButtonVisible() {
      return this.drawnArea.area
        && this.drawToolsVisible && this.mergedConfigsData?.customAreaIndicator;
    },
    deleteButtonVisible() {
      return this.drawnArea.area && this.drawToolsVisible;
    },
    drawnLayerVisible() {
      return this.mergedConfigsData?.customAreaIndicator
        || this.mergedConfigsData?.customAreaFeatures;
    },
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const drawSource = new VectorSource({ wrapX: false });
    const drawVectorLayer = new VectorLayer({
      source: drawSource,
      zIndex: 3,
    });
    this.drawSource = drawSource;
    this.drawVectorLayer = drawVectorLayer;
    map.addLayer(drawVectorLayer);

    const drawnAreaSource = new VectorSource({ wrapX: false });
    this.drawnAreaSource = drawnAreaSource;
    const drawnAreaLayer = new VectorLayer({
      source: drawnAreaSource,
      zIndex: 3,
      style: new Style({
        fill: new Fill({
          color: 'rgba(50, 50, 50, 0.2)',
        }),
        stroke: new Stroke({
          color: this.appConfig.branding.primaryColor,
          width: 2,
        }),
      }),
    });
    this.drawnAreaLayer = drawnAreaLayer;
    map.addLayer(drawnAreaLayer);

    const boxFunc = createBox();
    this.drawControls = {
      polygon: new Draw({
        type: 'Polygon',
        stopClick: true,
      }),
      bbox: new Draw({
        type: 'Circle',
        stopClick: true,
        geometryFunction(...args) {
          const box = boxFunc(...args);
          box.isBox = true;
          return box;
        },
      }),
    };
    Object.keys(this.drawControls).forEach((k) => {
      const control = this.drawControls[k];
      control.on('drawend', (event) => {
        this.onDrawFinished(event);
      });
    });
    this.addDrawnAreaToMap();
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    map.removeLayer(this.drawVectorLayer);
    map.removeLayer(this.drawnAreaLayer);
  },
  watch: {
    mergedConfigsData() {
      this.addDrawnAreaToMap();
    }
  },
  methods: {
    drawEnable(tool) {
      const { map } = getMapInstance(this.mapId);
      this.disableInteractions();
      if (this.drawControls?.[tool]) {
        map.addInteraction(this.drawControls[tool]);
      }
      this.drawSource.clear();
      this.isDrawing = true;
    },
    disableInteractions() {
      const { map } = getMapInstance(this.mapId);
      Object.keys(this.drawControls).forEach((k) => map.removeInteraction(this.drawControls[k]));
      this.isDrawing = false;
    },
    onDrawFinished(event) {
      const { map } = getMapInstance(this.mapId);
      const projectionCode = map.getView().getProjection().getCode();
      const geoJSONFormat = new GeoJSON({
        featureProjection: projectionCode,
      });
      const geoJsonObj = geoJSONFormat.writeGeometryObject(
        event.feature.getGeometry(),
      );
      this.drawnAreaSource.clear();
      this.drawnAreaSource.addFeature(event.feature);
      this.drawnArea.area = geoJsonObj;
      this.disableInteractions();
      this.isDrawing = false;
      // TODO: set in store (to update URL) only if not in custom dashboard instead of always
      this.$store.commit('features/SET_SELECTED_AREA', geoJsonObj);
    },
    clearCustomAreaFilter() {
      // TODO: clear in store (to update URL) only if not in custom dashboard instead of always
      this.$store.commit('features/SET_SELECTED_AREA', null);
      this.drawnArea.area = null;
      this.drawnAreaSource.clear();
    },
    addDrawnAreaToMap() {
      // preset drawn area from prop
      if (this.drawnLayerVisible && this.drawnArea.area) {
        const { map } = getMapInstance(this.mapId);
        const geoJSONFormat = new GeoJSON({
          featureProjection: map.getView().getProjection().getCode(),
        });
        const feature = new Feature({
          geometry: geoJSONFormat.readGeometry(this.drawnArea.area),
          name: 'Drawn Area',
        });
        this.drawnAreaSource.clear();
        this.drawnAreaSource.addFeature(feature);
      }
    },
    fetchCustomAreaIndicator() {
      this.$emit('fetchCustomAreaIndicator');
    },
  },
};
</script>

<style lang="scss" scoped>
.customDrawTools {
  position: absolute;
  top: 150px;
  right: 10px;
  z-index: 2;
}
.cancelDrawButton {
  position: absolute;
  right: 40px;
  z-index: 2;
  min-width: fit-content;
  border-radius: "4px";
}
.mdi-spin:before {
  animation-duration: 0.5s;
}
</style>
