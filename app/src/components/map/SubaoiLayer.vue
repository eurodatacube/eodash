<script>
import { getMapInstance } from '@/components/map/map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import turfDifference from '@turf/difference';
import { mapState } from 'vuex';
import { containsCoordinate } from 'ol/extent';
import { clamp } from 'ol/math';
import { calculatePadding } from '@/utils';
import {
  indicatorHasMapData,
} from '@/helpers/mapConfig';

const geoJsonFormat = new GeoJSON({
});

/**
 * this component handles global indicators and will add and remove layers
 * and associated interactions on mount / destroy.
 * the view of the associated map will be updated if the given indicator
 * demands such behavior (e.g. if a preset view is set)
 * Map movement like panning will get restricted if the indicator has an inverse subaoi
 *
 * as this layer is meant for global POIs, this will not show up in the layer
 * control by design
 */
export default {
  props: {
    mapId: String,
    indicator: Object,
    isGlobal: Boolean,
    mergedConfigsData: Object,
  },
  data: () => ({
    constrainingExtent: undefined,
    drag: false,
    layer: null,
  }),
  watch: {
    subAoi: {
      deep: true,
      immediate: true,
      handler(value) {
        const { map } = getMapInstance(this.mapId);
        const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
        const aoiLayer = internalGroup.getLayers().getArray().find((l) => l.get('name') === 'subAoi');
        if (aoiLayer) {
          const aoiSource = aoiLayer.getSource();
          aoiSource.clear();
          if (value) {
            const feature = geoJsonFormat.readFeature(value, {
              dataProjection: 'EPSG:4326',
              featureProjection: map.getView().getProjection(),
            });
            aoiSource.addFeature(feature);
          }
        }
      },
    },
  },
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    featureData() {
      return this.$store.state.features.featureData;
    },
    subAoi() {
      // create an inverse of subaoi, using difference of whole world and subaoi
      let subAoiObject;
      if (this.indicator?.subAoi?.features?.length) {
        subAoiObject = this.indicator.subAoi;
      }
      if (this.featureData?.subAoi?.features?.length) {
        subAoiObject = this.featureData.subAoi;
      }
      if (this.layer && subAoiObject) {
        const subaoiInv = JSON.parse(JSON.stringify(subAoiObject.features[0]));
        // both Object.assign({}, this.subAoi) and { ...this.subAoi } create shallow copy
        if (subaoiInv) {
          const globalBox = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
            },
          };
          return turfDifference(globalBox, subaoiInv);
        }
        return subaoiInv;
      }
      return null;
    },
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const { subAoiTransparent } = this.mergedConfigsData;
    const fillTransparency = subAoiTransparent ? 0 : 0.5;

    const inverseStyle = new Style({
      fill: new Fill({
        color: `rgba(0, 0, 0, ${fillTransparency})`,
      }),
      stroke: new Stroke({
        width: 2,
        color: 'rgba(0, 0, 0, 0.5)',
      }),
    });

    const layer = new VectorLayer({
      name: 'subAoi',
      layerControlHide: true,
      source: new VectorSource({}),
      style: () => inverseStyle,
    });
    this.layer = layer;
    if (this.subAoi) {
      const feature = geoJsonFormat.readFeature(this.subAoi, {
        dataProjection: 'EPSG:4326',
        featureProjection: map.getView().getProjection(),
      });
      layer.getSource().addFeature(feature);
    }
    if (this.subAoi && !this.isGlobal) {
      // subaoi-geometry has a hole, use extent of that hole to constrain the view
      const insidePolygon = JSON.parse(JSON.stringify(this.subAoi));
      // eslint-disable-next-line prefer-destructuring
      insidePolygon.geometry.coordinates = [insidePolygon.geometry.coordinates[1]];
      const insidePolygonFeature = geoJsonFormat.readFeature(insidePolygon, {
        featureProjection: map.getView().getProjection(),
      });
      this.constrainingExtent = insidePolygonFeature.getGeometry().getExtent();
      map.on('pointerdrag', this.pointerdragHandler);
      map.on('movestart', this.movestartHandler);
      map.on('moveend', this.moveendHandler);
    }
    const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
    internalGroup.getLayers().push(layer);
  },
  methods: {
    /**
     * returns true if indicator has real map data (layers or features)
     */
    indicatorHasMapData(indicatorObject) {
      return indicatorHasMapData(indicatorObject);
    },
    pointerdragHandler() {
      this.drag = true;
    },
    movestartHandler() {
      this.drag = false;
    },
    moveendHandler(e) {
      if (!this.drag) {
        return; // only animate if the move caused by a real user-drag
      }
      const map = e.target;
      const view = map.getView();
      const center = view.getCenter();
      // the map padding is only set here, only for inverse AOIs
      // TO DO: there should be a better place to do this
      const currentPadding = calculatePadding();
      map.getView().padding = currentPadding;
      if (!containsCoordinate(this.constrainingExtent, center)) {
        const newCenter = [
          clamp(center[0], this.constrainingExtent[0], this.constrainingExtent[2]),
          clamp(center[1], this.constrainingExtent[1], this.constrainingExtent[3]),
        ];
        view.animate({ center: newCenter, duration: 150 });
      }
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    const internalGroup = map.getLayers().getArray().find((l) => l.get('id') === 'internalGroup');
    internalGroup.getLayers().remove(this.layer);
    map.getView().padding = [0, 0, 0, 0]; // TO DO: handle padding somewhere else?
    map.un('pointerdrag', this.pointerdragHandler);
    map.un('movestart', this.movestartHandler);
    map.un('moveend', this.moveendHandler);
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
