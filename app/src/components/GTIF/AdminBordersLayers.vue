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
    administrativeLayers.forEach((l) => {
      map.addLayer(l);
    });

    const highlightStyle = new Style({
      fill: new Fill({
        color: '#00676200',
      }),
    });

    const hightlightLayer = new VectorLayer({
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
    this.hightlightLayer = hightlightLayer;
    map.addLayer(inverseAdministrativeLayer);
    map.addLayer(hightlightLayer);
  },
  methods: {
    adminBorderClick(e) {
      e.target.getFeatures().forEach((feature) => {
        const { map } = getMapInstance(this.mapId);
        const clickLayer = this.selectInteraction.getLayer(feature);
        const layerIndex = this.administrativeConfigs.findIndex((l) => l.name === clickLayer.get('name'));
        if (layerIndex > -1) {
          // admin border touched, fit map to it, set inverse polygon
          // and update zoom to nearest minzoom of next layer
          let minZoom;
          if (this.administrativeConfigs[layerIndex + 1] !== undefined) {
            minZoom = this.administrativeConfigs[layerIndex + 1].minZoom;
          }
          const extent = feature.getGeometry().getExtent();
          const center = getCenter(extent);
          map.getView().animate({
            center,
            duration: 500,
          });
          const resolution = map.getView().getResolutionForExtent(extent);
          const zoom = map.getView().getZoomForResolution(resolution);
          // 0.1 added to show the layer, if zoom is equal to l.minzoom, not shown
          map.getView().animate({
            zoom: minZoom !== undefined ? minZoom + 0.1 : zoom,
            duration: 500,
          });
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
        } else {
          // cleanup selected area
          this.$store.commit(
            'features/SET_ADMIN_BORDER_SELECTED', null,
          );
          this.inverseAdministrativeLayer.getSource().clear();
        }
      });
    },
    clearHighlightedFeature() {
      const MapCursor = getMapCursor(this.mapId, { mapId: this.mapId });
      MapCursor.reserveCursor('adminBorders', null);
      this.hightlightLayer.getSource().clear();
      this.highlightedFeature = null;
    },
    adminBorderHover(e) {
      if (e.dragging) {
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
            foundLayer = layer.getLayers().array_.find((l) => l.get('name') === config.name);
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
            this.hightlightLayer.getSource().clear();
            this.hightlightLayer.getSource().addFeature(feature);
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
    this.administrativeConfigs.forEach((config) => {
      const layer = layers.find((l) => l.get('name') === config.name);
      map.removeLayer(layer);
    });
    this.clearHighlightedFeature();
    map.removeLayer(this.inverseAdministrativeLayer);
    map.removeLayer(this.hightlightLayer);
    map.removeInteraction(this.selectInteraction);
    map.un('pointermove', this.adminBorderHover);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
