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
  featureProjection: 'EPSG:3857',
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
  },
  data: () => ({
    constrainingExtent: undefined,
    drag: false,
  }),
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
    ...mapState('config', ['appConfig', 'baseConfig']),
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
                coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
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
    layerNameMapping() {
      return this.baseConfig.layerNameMapping;
    },
    isInverse() {
      return !!(this.indicator.country === 'all'
        || this.appConfig.configuredMapPois.includes(`${this.indicator.aoiID}-${this.indicator.indicator}`)
        || ((Array.isArray(this.indicator.inputData)
        && this.indicatorHasMapData(this.indicator)
        )));
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
    if (this.isInverse && this.subAoi && !this.isGlobal) {
      // subaoi-geometry has a hole, use extent of that hole to constrain the view
      const insidePolygon = JSON.parse(JSON.stringify(this.subAoi));
      // eslint-disable-next-line prefer-destructuring
      insidePolygon.geometry.coordinates = [insidePolygon.geometry.coordinates[1]];
      const insidePolygonFeature = geoJsonFormat.readFeature(insidePolygon);
      this.constrainingExtent = insidePolygonFeature.getGeometry().getExtent();
      map.on('pointerdrag', this.pointerdragHandler);
      map.on('movestart', this.movestartHandler);
      map.on('moveend', this.moveendHandler);
    }
    map.addLayer(subAoiLayer);
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
    const layer = map.getLayers().getArray().find((l) => l.get('name') === 'subAoi');
    map.removeLayer(layer);
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
