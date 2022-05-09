<script>
import getMapInstance from '@/components/map/map';
import { createLayerFromConfig } from '@/components/map/layers';
import GeoJSON from 'ol/format/GeoJSON';

const geoJsonFormat = new GeoJSON({
  featureProjection: 'EPSG:3857',
});
/**
 * this component handles global indicators and will add and remove layers
 * and associated interactions on mount / destroy.
 * the view of the associated map will be updated if the given indicator
 * demands such behavior (e.g. if a preset view is set)
 */
export default {
  components: {},
  props: {
    mapId: String,
    indicator: Object,
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const layer = createLayerFromConfig(this.indicator.display, { zIndex: 2 });
    layer.set('name', this.indicator.indicatorName);
    const { presetView } = this.indicator.display;
    if (presetView?.features?.length) {
      const presetGeom = geoJsonFormat.readGeometry(presetView.features[0].geometry);
      map.getView().fit(presetGeom.getExtent());
    }

    map.addLayer(layer);
  },
  methods: {},
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const layer = map.getLayers().getArray().find((l) => l.get('name') === this.indicator.indicatorName);
    map.removeLayer(layer);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
