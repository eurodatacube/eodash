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
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import {
  mapState,
} from 'vuex';
import { getArea } from 'ol/extent';
import Text from 'ol/style/Text';
import { Polygon } from 'ol/geom';

const pointStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: 'rgba(50, 50, 50, 0.2)',
    }),
    stroke: new Stroke({
      color: 'black',
      width: 2,
    }),
  }),
});
const drawStyle = new Style({
  text: new Text({
    text: '',
    font: '18px sans-serif',
    fill: new Fill({
      color: 'red',
    }),
    stroke: new Stroke({
      width: 3,
      color: 'white',
    }),
    padding: [-100, -100, -100, -100],
  }),
  fill: new Fill({
    color: 'black',
  }),
  stroke: new Stroke({
    color: 'black',
    width: 2,
  }),
});

export default {
  data() {
    return {
      drawControls: {},
      drawnAreaSource: null,
      isDrawing: null,
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
        // enables chart generation
        && (this.mergedConfigsData?.customAreaIndicator
        // enables fetching of custom features
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
    pointStyle.getImage().getStroke().setColor(this.appConfig.branding.primaryColor);

    const { map } = getMapInstance(this.mapId);
    const drawnAreaSource = new VectorSource({ wrapX: false });
    this.drawnAreaSource = drawnAreaSource;
    const drawnAreaLayer = new VectorLayer({
      source: drawnAreaSource,
      zIndex: 3,
      style: this.drawStyleFunction,
      declutter: false,
    });
    this.drawnAreaLayer = drawnAreaLayer;
    map.addLayer(drawnAreaLayer);

    const boxFunc = createBox();
    this.drawControls = {
      polygon: new Draw({
        type: 'Polygon',
        stopClick: true,
        style: this.drawStyleFunction,
      }),
      bbox: new Draw({
        type: 'Circle',
        stopClick: true,
        geometryFunction(...args) {
          const box = boxFunc(...args);
          box.isBox = true;
          return box;
        },
        style: this.drawStyleFunction,
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
    map.removeLayer(this.drawnAreaLayer);
  },
  watch: {
    mergedConfigsData() {
      this.addDrawnAreaToMap();
    },
  },
  methods: {
    drawEnable(tool) {
      const { map } = getMapInstance(this.mapId);
      this.disableInteractions();
      if (this.drawControls?.[tool]) {
        map.addInteraction(this.drawControls[tool]);
      }
      this.isDrawing = true;
    },
    disableInteractions() {
      const { map } = getMapInstance(this.mapId);
      Object.keys(this.drawControls).forEach((k) => map.removeInteraction(this.drawControls[k]));
      this.isDrawing = false;
    },
    drawStyleFunction(feature) {
      if (feature.getGeometry() instanceof Polygon) {
        const areaTooLarge = this.isGeometryTooLarge(feature.getGeometry());
        drawStyle.getStroke().setColor(areaTooLarge ? 'red' : this.appConfig.branding.primaryColor);
        drawStyle.getFill().setColor(areaTooLarge ? 'rgba(255, 0, 0, 0.2)' : 'rgba(50, 50, 50, 0.2)');
        drawStyle.getText().setText(areaTooLarge ? 'Area too large' : '');
        return drawStyle;
      }
      return pointStyle;
    },
    /**
     * returns true if the passed geometry is too large for fetching data.
     * @param {*} geom OpenLayer geometry
     * @returns {Boolean}
     */
    isGeometryTooLarge(geom) {
      const extent = geom.getExtent();
      // to do: use more exact turf calculations?
      return extent && (getArea(extent) > 50000000000);
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
