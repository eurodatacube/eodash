<script>
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
  props: {
    mapId: String,
    administrativeConfigs: Array,
  },
  watch: {
  },
  computed: {
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    // initiate select interaction for admin borders
    this.selectInteraction = new Select({
      style: null,
    });
    map.addInteraction(this.selectInteraction);
    this.selectInteraction.on('select', this.adminBorderClick);
    map.on('pointermove', this.adminBorderHover);

    const administrativeLayers = this.administrativeConfigs.map((l) => createLayerFromConfig(l,
      {
        zIndex: 3,
      }));
    // setup listener on featuresloadend on first layer in array or the one with smallest maxZoom
    const layer = administrativeLayers[0];
    const toBeSelectedConfig = this.administrativeConfigs[0];
    let foundLayer = null;
    if (layer instanceof Group) {
      foundLayer = layer.getLayers().getArray().find((l) => l.get('name') === toBeSelectedConfig.name);
    } else {
      foundLayer = layer;
    }
    foundLayer.getSource().once('featuresloadend', this.setInitialDefaultSelectedArea);
    foundLayer.setMaxZoom(28);
    administrativeLayers.forEach((l) => {
      map.addLayer(l);
    });

    const highlightStyle = new Style({
      fill: new Fill({
        color: '#00676244',
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
    adminBorderClick(e) {
      const ftrs = e.target.getFeatures();
      if (ftrs.getLength() > 0) {
        const feature = ftrs.getArray()[0];
        const clickLayer = this.selectInteraction.getLayer(feature);
        const layerIndex = this.administrativeConfigs.findIndex((l) => l.name === clickLayer.get('name'));
        if (layerIndex > -1) {
          // admin border touched, fit map to it, set inverse polygon
          // and update zoom to nearest minzoom or maxzoom of next layer
          this.zoomToFeatureAdminLayerIndex(feature, layerIndex + 1);
          this.setupInverseFeatureLayer(feature);
        } else {
          this.setDefaultSelectedArea(true);
        }
      } else {
        this.setDefaultSelectedArea(true);
      }
    },
    zoomToFeatureAdminLayerIndex(feature, layerIndex) {
      let minZoom;
      let maxZoom;
      if (this.administrativeConfigs[layerIndex] !== undefined) {
        minZoom = this.administrativeConfigs[layerIndex].minZoom;
        if (minZoom === undefined) {
          maxZoom = this.administrativeConfigs[layerIndex].maxZoom;
        }
      }
      // if the layer was never fetched before (feature is null)
      // set zoomFromResolution to 0 and center to current center
      let zoomFromResolution = 0;
      const { map } = getMapInstance(this.mapId);
      let center = map.getView().getCenter();
      if (feature) {
        const extent = feature.getGeometry().getExtent();
        center = getCenter(extent);
        const resolution = map.getView().getResolutionForExtent(extent);
        zoomFromResolution = map.getView().getZoomForResolution(resolution);
      }
      // 0.1 added or subtracted to show the layer, if zoom is equal to l.minzoom, not shown
      let zoom = zoomFromResolution;
      if (minZoom !== undefined) {
        zoom = minZoom + 0.1;
      } else if (maxZoom !== undefined) {
        zoom = maxZoom - 0.1;
      } else if (this.administrativeConfigs[layerIndex - 1] !== undefined) {
        // do not let zoom to be lower than current layer minZoom
        if (this.administrativeConfigs[layerIndex - 1].minZoom !== undefined) {
          if (zoomFromResolution < this.administrativeConfigs[layerIndex - 1].minZoom) {
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
      this.$store.commit(
        'features/SET_ADMIN_BORDER_SELECTED', feature,
      );
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
      const { map } = getMapInstance(this.mapId);
      const layers = map.getLayers().getArray();
      const toBeSelectedConfig = this.administrativeConfigs[0];
      const layer = layers.find((l) => l.get('name') === toBeSelectedConfig.name);
      let foundLayer = null;
      if (layer instanceof Group) {
        foundLayer = layer.getLayers().getArray().find((l) => l.get('name') === toBeSelectedConfig.name);
      } else {
        foundLayer = layer;
      }
      if (toBeSelectedConfig.maxZoom !== undefined) {
        foundLayer.setMaxZoom(toBeSelectedConfig.maxZoom);
      }
      this.setDefaultSelectedArea(false);
    },
    setDefaultSelectedArea(zoomTo) {
      const preferedLayerIndex = 0;
      // find the corresponding layer
      const { map } = getMapInstance(this.mapId);
      const layers = map.getLayers().getArray();
      const toBeSelectedConfig = this.administrativeConfigs[preferedLayerIndex];
      const layer = layers.find((l) => l.get('name') === toBeSelectedConfig.name);
      let foundLayer = null;
      if (layer instanceof Group) {
        foundLayer = layer.getLayers().getArray().find((l) => l.get('name') === toBeSelectedConfig.name);
      } else {
        foundLayer = layer;
      }
      // get features and setup the inverse
      const feature = foundLayer.getSource().getFeatures()[0];
      this.setupInverseFeatureLayer(feature);
      if (zoomTo) {
        this.zoomToFeatureAdminLayerIndex(feature, preferedLayerIndex);
      }
    },
    clearHighlightedFeature() {
      const MapCursor = getMapCursor(this.mapId, { mapId: this.mapId });
      MapCursor.reserveCursor('adminBorders', null);
      this.highlightLayer.getSource().clear();
      this.highlightedFeature = null;
    },
    adminBorderHover(e) {
      if (e.dragging) {
        this.clearHighlightedFeature();
        return;
      }
      const { map } = getMapInstance(this.mapId);
      const pixel = map.getEventPixel(e.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (ftr) => ftr);
      if (feature) {
        let anyAdminLayerHasFeature = null;
        const layers = map.getLayers().getArray();
        this.administrativeConfigs.forEach((config) => {
          const layer = layers.find((l) => l.get('name') === config.name);
          let foundLayer = null;
          if (layer instanceof Group) {
            foundLayer = layer.getLayers().getArray().find((l) => l.get('name') === config.name);
          } else {
            foundLayer = layer;
          }
          if (foundLayer.getSource().hasFeature(feature)) {
            anyAdminLayerHasFeature = true;
          }
        });
        if (anyAdminLayerHasFeature) {
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
    const layers = map.getLayers().getArray();
    this.administrativeConfigs.forEach((config, i) => {
      const layer = layers.find((l) => l.get('name') === config.name);
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
