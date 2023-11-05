<template>
  <div
    class="customDrawTools elevation-2
    d-flex flex-column mb-2 mr-1">
    <v-tooltip
      v-if="drawToolsVisible"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="pa-0 rounded-b-0 elevation-0"
          v-on="on"
          @click="drawEnable('polygon')"
        >
          <v-icon>mdi-vector-polygon</v-icon>
        </v-btn>
      </template>
      <span>Draw polygon</span>
    </v-tooltip>
    <v-tooltip
      v-if="drawToolsVisible"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="pa-0 elevation-0"
          :class="deleteButtonVisible || isDrawing
            ? 'rounded-0'
            : 'rounded-t-0'"
          v-on="on"
          @click="drawEnable('bbox')"
        >
          <v-icon>mdi-vector-rectangle</v-icon>
        </v-btn>
      </template>
      <span>Draw rectangle</span>
    </v-tooltip>
    <v-tooltip
      v-if="deleteButtonVisible"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="error"
          class="pa-0 rounded-t-0 elevation-0"
          v-on="on"
          @click="clearCustomAreaFilter"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <span>Clear selection</span>
    </v-tooltip>
    <v-tooltip
      v-if="isDrawing"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="error"
          class="pa-0 rounded-t-0 elevation-0"
          v-on="on"
          @click="disableInteractions"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <span>Cancel drawing</span>
    </v-tooltip>
  </div>
</template>

<script>
import { getMapInstance } from '@/components/map/map';
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
// import { getArea } from 'ol/extent';
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
    mergedConfigsData: Array[Object],
    drawnArea: {
      area: null,
    },
  },
  computed: {
    ...mapState('config', ['appConfig']),
    hasSelectionEnabled() {
      return this.mergedConfigsData.length
        && this.mergedConfigsData.find((layer) => layer?.selection || layer?.features?.selection);
    },
    drawToolsVisible() {
      return !this.hasSelectionEnabled
        // enables chart generation
        && (this.drawnLayerVisible);
    },
    deleteButtonVisible() {
      return this.drawnArea.area && this.drawToolsVisible;
    },
    drawnLayerVisible() {
      return this.mergedConfigsData.length && (this.mergedConfigsData[0]?.customAreaIndicator
        || this.mergedConfigsData[0]?.customAreaFeatures);
    },
  },
  mounted() {
    pointStyle.getImage().getStroke().setColor(this.appConfig.branding.primaryColor);

    const { map } = getMapInstance(this.mapId);
    const drawnAreaSource = new VectorSource({ wrapX: false });
    this.drawnAreaSource = drawnAreaSource;
    const drawnAreaLayer = new VectorLayer({
      name: 'Draw Area Layer',
      layerControlHide: true,
      source: drawnAreaSource,
      style: this.drawStyleFunction,
      declutter: false,
    });
    drawnAreaLayer.set('displayInLayerSwitcher', false);
    this.drawnAreaLayer = drawnAreaLayer;
    const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
    internalGroup.getLayers().push(drawnAreaLayer);

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
    const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
    internalGroup.getLayers().remove(this.drawnAreaLayer);
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
        this.drawControls[tool].once('drawstart', () => {
          this.drawnAreaSource.clear();
        });
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
    isGeometryTooLarge(geom) { // eslint-disable-line
      // for now commenting out previous logic
      return false;
      // const extent = geom.getExtent();
      // to do: use more exact turf calculations?
      // return extent && (getArea(extent) > 50000000000);
    },
    onDrawFinished(event) {
      const { map } = getMapInstance(this.mapId);
      const projection = map.getView().getProjection();
      const geoJSONFormat = new GeoJSON({
        featureProjection: projection,
      });
      const geoJsonObj = geoJSONFormat.writeGeometryObject(
        event.feature.getGeometry(),
      );
      if (this.isGeometryTooLarge(event.feature.getGeometry())) {
        return;
      }
      this.clearCustomAreaFilter();
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
          featureProjection: map.getView().getProjection(),
        });
        const feature = new Feature({
          geometry: geoJSONFormat.readGeometry(this.drawnArea.area),
          name: 'Drawn Area',
        });
        this.drawnAreaSource.clear();
        this.drawnAreaSource.addFeature(feature);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .customDrawTools {
    z-index: 2;
  }
  .mdi-spin:before {
    animation-duration: 0.5s;
  }
  button {
    min-width: 0 !important;
    width: 36px !important;
    height: 36px !important;
  }
</style>
