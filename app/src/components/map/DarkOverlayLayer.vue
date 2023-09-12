<script>
import { getMapInstance } from '@/components/map/map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import turfDifference from '@turf/difference';
import { createLayerFromConfig } from '@/components/map/layers';
import {
  mapState,
} from 'vuex';

const geoJsonFormat = new GeoJSON({});

/**
 */
export default {
  props: {
    mapId: String,
    configs: Array,
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const darkOverlayLayers = this.configs.map((l) => createLayerFromConfig(l,
      map));
    this.darkOverlayLayers = darkOverlayLayers;
    // setup listener on featuresloadend on first layer
    const layer = this.darkOverlayLayers[0];
    const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
    darkOverlayLayers.forEach((l) => {
      internalGroup.getLayers().push(l);
    });

    const inverseStyle = new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.5)',
      }),
      stroke: new Stroke({
        width: 2,
        color: this.appConfig.branding.primaryColor,
      }),
    });

    const inverseDarkOverlayLayer = new VectorLayer({
      name: 'Inverse Dark Overlay Layer',
      source: new VectorSource({}),
      layerControlHide: true,
      style: inverseStyle,
    });
    this.inverseDarkOverlayLayer = inverseDarkOverlayLayer;
    internalGroup.getLayers().push(inverseDarkOverlayLayer);
    layer.getSource().once('featuresloadend', this.setInitialInverseArea);
  },
  methods: {
    setInitialInverseArea() {
      const layer = this.darkOverlayLayers[0];
      // get features and setup the inverse
      const feature = layer.getSource().getFeatures()[0];
      this.setupInverseFeatureLayer(feature);
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
      const { map } = getMapInstance(this.mapId);
      const featureGeomClone = feature.getGeometry().clone().transform(map.getView().getProjection(), 'EPSG:4326');
      const diff = turfDifference(
        globalBox, geoJsonFormat.writeGeometryObject(featureGeomClone),
      );
      const clone = feature.clone();
      const transformedGeom = geoJsonFormat.readGeometry(diff.geometry, {
        dataProjection: 'EPSG:4326',
      }).transform('EPSG:4326', map.getView().getProjection());
      clone.setGeometry(transformedGeom);
      this.inverseDarkOverlayLayer.getSource().clear();
      this.inverseDarkOverlayLayer.getSource().addFeature(clone);
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
    this.darkOverlayLayers.forEach((layer) => {
      internalGroup.getLayers().remove(layer);
    });
    internalGroup.getLayers().remove(this.inverseDarkOverlayLayer);
  },
  render: () => null,
};
</script>
