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
import Select from 'ol/interaction/Select';

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

    const administrativeLayers = this.administrativeConfigs.map((l) => createLayerFromConfig(l,
      {
        zIndex: 3,
      }));
    administrativeLayers.forEach((l) => {
      map.addLayer(l);
    });

    const inverseStyle = new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.6)',
      }),
      stroke: new Stroke({
        width: 2,
        color: 'rgba(0, 0, 0, 0.6)',
      }),
    });

    const inverseAdministrativeLayer = new VectorLayer({
      name: 'inverseAdministrativeLayer',
      zIndex: 2,
      source: new VectorSource({}),
      style: inverseStyle,
    });
    this.inverseAdministrativeLayer = inverseAdministrativeLayer;
    map.addLayer(inverseAdministrativeLayer);
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
          map.getView().fit(feature.getGeometry().getExtent());
          if (this.administrativeConfigs[layerIndex + 1] !== undefined) {
            const { minZoom } = this.administrativeConfigs[layerIndex + 1];
            if (minZoom !== undefined) {
              // 0.1 added to show the layer, if zoom is equal to l.minzoom, not shown
              map.getView().setZoom(minZoom + 0.1);
            }
          }
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
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const layers = map.getLayers().getArray();
    this.administrativeConfigs.forEach((config) => {
      const layer = layers.find((l) => l.get('name') === config.name);
      map.removeLayer(layer);
    });
    const inverseLayer = layers.find((l) => l.get('name') === 'inverseAdministrativeLayer');
    map.removeLayer(inverseLayer);
    map.removeInteraction(this.selectInteraction);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
