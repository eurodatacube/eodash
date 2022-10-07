<template>
  <MapOverlay
   :mapId="mapId"
   :overlayId="'adminBordersOverlay'"
   :overlayHeaders="overlayHeaders"
   :overlayRows="overlayRows"
   :overlayCoordinate="overlayCoordinate"
  />
</template>

<script>
import MapOverlay from '@/components/map/MapOverlay.vue';
import getMapInstance from '@/components/map/map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import turfDifference from '@turf/difference';
import { createLayerFromConfig } from '@/components/map/layers';
import getMapCursor from '@/components/map/MapCursor';
import Select from 'ol/interaction/Select';
import Group from 'ol/layer/Group';
import { getCenter } from 'ol/extent';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});

/**
 */
export default {
  components: {
    MapOverlay,
  },
  props: {
    mapId: String,
    administrativeConfigs: Array,
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
      overlayRows: [],
      overlayCoordinate: null,
      overlayHeaders: [],
    };
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    // initiate select interaction for admin borders
    this.selectInteraction = new Select({
      style: null,
    });
    map.addInteraction(this.selectInteraction);
    this.selectInteraction.on('select', this.adminBorderClick);
    // initiate hover over admin interaction
    map.on('pointermove', this.adminBorderHover);

    const adminLayerGroups = this.administrativeConfigs.map((l) => createLayerFromConfig(l,
      {
        zIndex: 3,
      }));
    this.adminLayerGroups = adminLayerGroups;
    // setup listener on featuresloadend on first layer and set maxZoom to high number to
    // trigger fetching data, original layer.maxZoom is reset in event handler
    const layer = this.getLayerFromGroup(
      this.adminLayerGroups[0], this.administrativeConfigs[0],
    );
    layer.getSource().once('featuresloadend', this.setInitialDefaultSelectedArea);
    layer.setMaxZoom(28);
    adminLayerGroups.forEach((l) => {
      map.addLayer(l);
    });

    const highlightStyle = new Style({
      fill: new Fill({
        color: '#00676200',
      }),
    });

    const highlightLayer = new VectorLayer({
      name: 'highlightAdminLayer',
      zIndex: 2,
      source: new VectorSource({}),
      style: highlightStyle,
    });

    const inverseStyle = new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.5)',
      }),
      stroke: new Stroke({
        width: 2,
        color: 'rgba(0, 0, 0, 0.5)',
      }),
    });

    const inverseAdministrativeLayer = new VectorLayer({
      name: 'inverseAdministrativeLayer',
      zIndex: 2,
      source: new VectorSource({}),
      style: inverseStyle,
    });
    this.inverseAdministrativeLayer = inverseAdministrativeLayer;
    this.highlightLayer = highlightLayer;
    map.addLayer(inverseAdministrativeLayer);
    map.addLayer(highlightLayer);
  },
  methods: {
    getLayerFromGroup(layer, config) {
      let foundLayer = null;
      if (layer instanceof Group) {
        foundLayer = layer.getLayers().getArray().find((l) => l.get('name') === config.name);
      } else {
        foundLayer = layer;
      }
      return foundLayer;
    },
    adminBorderClick(e) {
      // handles all clicks from select interaction
      const ftrs = e.target.getFeatures();
      if (ftrs.getLength() > 0) {
        // click contains features, check if was admin layer
        const feature = ftrs.getArray()[0];
        const clickLayer = this.selectInteraction.getLayer(feature);
        const layerIndex = this.administrativeConfigs.findIndex((l) => l.name === clickLayer.get('name'));
        if (layerIndex > -1) {
          // admin layer clicked, fit map to it, set inverse polygon
          // and update zoom to nearest minzoom or maxzoom of next layer
          this.zoomToFeatureAdminLayerIndex(feature, layerIndex + 1);
          this.$store.commit(
            'features/SET_ADMIN_BORDER_SELECTED', feature,
          );
          this.setupInverseFeatureLayer(feature);
        } else if (clickLayer.get('name') === 'inverseAdministrativeLayer') {
        // inverse layer clicked, reset to default layer
          this.setDefaultSelectedArea(true);
        }
        // if some other vector layer was clicked, do not care and do not handle the action
        // no else block
      } else {
        // click did not hit any other layer, set first admin layer as selected
        this.setDefaultSelectedArea(true);
      }
    },
    zoomToFeatureAdminLayerIndex(feature, layerIndex) {
      // performs pan and zoom to feature
      // but additionally taking in account:
      // configured minZoom of admin layer on given layerIndex - fits to it
      // or configured maxZoom of layer on given layerIndex, fits to it
      let minZoom;
      let maxZoom;
      if (this.administrativeConfigs[layerIndex] !== undefined) {
        minZoom = this.administrativeConfigs[layerIndex].minZoom;
        maxZoom = this.administrativeConfigs[layerIndex].maxZoom;
      }
      const { map } = getMapInstance(this.mapId);
      const extent = feature.getGeometry().getExtent();
      const center = getCenter(extent);
      const resolution = map.getView().getResolutionForExtent(extent);
      const zoomFromResolution = map.getView().getZoomForResolution(resolution);
      // 0.1 added or subtracted to show the layer, if zoom is equal to l.minzoom, not shown
      let zoom = zoomFromResolution;
      if (minZoom !== undefined) {
        zoom = minZoom + 0.1;
      } else if (maxZoom !== undefined) {
        zoom = maxZoom - 0.1;
      } else if (this.administrativeConfigs[layerIndex - 1] !== undefined) {
        // do not let zoom to be lower than layerIndex -1 .minZoom
        if (this.administrativeConfigs[layerIndex - 1].minZoom !== undefined) {
          if (zoom < this.administrativeConfigs[layerIndex - 1].minZoom) {
            zoom = this.administrativeConfigs[layerIndex - 1].minZoom + 0.1;
          }
        }
      }
      map.getView().animate({
        center,
        duration: 500,
        zoom,
      });
    },
    setupInverseFeatureLayer(feature) {
      // create inverse polygon geometry and add it to inverse layer
      const globalBox = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[-1800, -90], [1800, -90], [1800, 90], [-1800, 90], [-1800, -90]]],
        },
      };
      const diff = turfDifference(
        globalBox, geoJsonFormat.writeGeometryObject(feature.getGeometry(), {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326',
        }),
      );
      const clone = feature.clone();
      clone.setGeometry(geoJsonFormat.readGeometry(diff.geometry));
      this.inverseAdministrativeLayer.getSource().clear();
      this.inverseAdministrativeLayer.getSource().addFeature(clone);
    },
    setInitialDefaultSelectedArea() {
      // reset maxZoom from admin layer on index 0 and setDefaultSelectedArea
      if (this.administrativeConfigs[0].maxZoom !== undefined) {
        const layer = this.getLayerFromGroup(this.adminLayerGroups[0], this.administrativeConfigs[0]);
        layer.setMaxZoom(this.administrativeConfigs[0].maxZoom);
      }
      // set default area without zooming in to honor URL search parameters x,y,z
      this.setDefaultSelectedArea(false);
    },
    setDefaultSelectedArea(performZoomTo) {
      // select first layer from admin layers to store and create inverse polygon accordingly
      const layer = this.getLayerFromGroup(
        this.adminLayerGroups[0], this.administrativeConfigs[0],
      );
      // get features and setup the inverse
      const feature = layer.getSource().getFeatures()[0];
      this.$store.commit(
        'features/SET_ADMIN_BORDER_SELECTED', feature,
      );
      this.setupInverseFeatureLayer(feature);
      if (performZoomTo) {
        this.zoomToFeatureAdminLayerIndex(feature, 0);
      }
    },
    clearHighlightedFeature() {
      const MapCursor = getMapCursor(this.mapId, { mapId: this.mapId });
      MapCursor.reserveCursor('adminBorders', null);
      this.highlightLayer.getSource().clear();
      this.highlightedFeature = null;
      this.overlayCoordinate = null;
      this.overlayContent = null;
      this.overlayHeaders = [];
    },
    adminBorderHover(e) {
      if (e.dragging) {
        // should handle random touchscreen mishaps with highlight being stuck there
        this.clearHighlightedFeature();
        return;
      }

      const { map } = getMapInstance(this.mapId);
      const pixel = map.getEventPixel(e.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (ftr) => ftr);
      if (feature) {
        // add feature to highlight layer if feature is part of admin layer and set pointer cursor
        let anyAdminLayerHasFeature = null;
        let foundLayer = null;
        this.adminLayerGroups.forEach((l, i) => {
          const layer = this.getLayerFromGroup(
            l, this.administrativeConfigs[i],
          );
          if (layer.getSource().hasFeature(feature)) {
            anyAdminLayerHasFeature = true;
            foundLayer = layer;
          }
        });
        if (anyAdminLayerHasFeature) {
          // center coordinate of extent, passable approximation for small or regular features
          const coordinate = getCenter(feature.getGeometry().getExtent());
          // show overlay on center of polygon
          this.overlayHeaders = [foundLayer.get('name')];
          this.overlayCoordinate = coordinate;
          const props = feature.getProperties();
          const key = Object.keys(props).find(
            (k) => ['name', 'nuts_name'].includes(k.toLowerCase())
          );
          if (props[key]) {
            this.overlayRows = [props[key]];
          } else {
            this.overlayRows = [];
          }

          const MapCursor = getMapCursor(this.mapId, { mapId: this.mapId });
          MapCursor.reserveCursor('adminBorders', 'pointer');

          if (feature !== this.highlightedFeature) {
            this.highlightLayer.getSource().clear();
            this.highlightLayer.getSource().addFeature(feature);
            this.highlightedFeature = feature;
          }
        } else {
          this.clearHighlightedFeature();
        }
      } else {
        this.clearHighlightedFeature();
      }
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    this.adminLayerGroups.forEach((layer) => {
      map.removeLayer(layer);
    });
    this.clearHighlightedFeature();
    map.removeLayer(this.inverseAdministrativeLayer);
    map.removeLayer(this.highlightLayer);
    map.removeInteraction(this.selectInteraction);
    map.un('pointermove', this.adminBorderHover);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
