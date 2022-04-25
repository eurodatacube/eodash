<script>
import getMapInstance from '@/components/map/map';
import { createLayerFromConfig } from '@/components/map/layers';

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
    const layer = createLayerFromConfig(this.indicator.display, 1);
    layer.set('name', this.indicator.indicatorName);
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
