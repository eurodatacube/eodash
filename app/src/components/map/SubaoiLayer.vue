<script>
import getMapInstance from '@/components/map/map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import turfDifference from '@turf/difference';
import { mapState } from 'vuex';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});

/**
 * this component handles global indicators and will add and remove layers
 * and associated interactions on mount / destroy.
 * the view of the associated map will be updated if the given indicator
 * demands such behavior (e.g. if a preset view is set)
 *
 * as this layer is meant for global POIs, this will not show up in the layer
 * control by design
 */
export default {
  props: {
    mapId: String,
    indicator: Object,
  },
  watch: {
    subAoi: {
      deep: true,
      immediate: true,
      handler(value) {
        const { map } = getMapInstance(this.mapId);
        const aoiLayer = map.getLayers().getArray().find((l) => l.get('name') === 'subAoi');
        if (aoiLayer) {
          const aoiSource = aoiLayer.getSource();
          aoiSource.clear();
          if (value) {
            // const feature = geoJsonFormat.readFeature(value);
            aoiSource.addFeature(geoJsonFormat.readFeature(value));
          }
        }
      },
    },
  },
  computed: {
    ...mapState('config', ['appConfig']),
    subAoi() {
      // create an inverse of subaoi, using difference of whole world and subaoi
      if (this.indicator?.subAoi?.features?.length) {
        const subaoiInv = JSON.parse(JSON.stringify(this.indicator.subAoi.features[0]));
        // both Object.assign({}, this.subAoi) and { ...this.subAoi } create shallow copy
        if (subaoiInv) {
          if (this.isInverse) {
            const globalBox = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [[[-1800, -90], [1800, -90], [1800, 90], [-1800, 90], [-1800, -90]]],
              },
            };
            const diff = turfDifference(globalBox, subaoiInv.geometry);
            subaoiInv.geometry = diff.geometry;
          }
        }
        return subaoiInv;
      }
      return null;
    },
    isInverse() {
      return this.indicator.country === 'all'
        || this.appConfig.configuredMapPois.includes(`${this.indicator.aoiID}-${this.indicator.indicator}`)
        || Array.isArray(this.indicator.country);
    },
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);

    const subAoiStyle = new Style({
      fill: new Fill({
        color: 'rgba(100, 160, 255, 0.4)',
      }),
      stroke: new Stroke({
        width: 2,
        color: 'rgba(0, 0, 0, 0.5)',
      }),
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

    const subAoiLayer = new VectorLayer({
      name: 'subAoi',
      zIndex: 5,
      source: new VectorSource({}),
      style: () => (this.isInverse ? inverseStyle : subAoiStyle),
    });
    if (this.subAoi) {
      const feature = geoJsonFormat.readFeature(this.subAoi);
      subAoiLayer.getSource().addFeature(feature);
    }
    map.addLayer(subAoiLayer);
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const layer = map.getLayers().getArray().find((l) => l.get('name') === 'subAoi');
    map.removeLayer(layer);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
