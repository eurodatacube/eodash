<template>
  <MapOverlay
    :mapId='mapId'
    :overlayId='mergedConfigs[0].name'
    :overlayHeaders='overlayHeaders'
    :overlayRows='overlayRows'
    :overlayCoordinate='overlayCoordinate'
  />
</template>

<script>
import { getMapInstance, getViewInstance } from '@/components/map/map';
import MapOverlay from '@/components/map/MapOverlay.vue';
import { createLayerFromConfig } from '@/components/map/layers';
import getProjectionOl from '@/helpers/projutils';
import VectorLayer from 'ol/layer/Vector';
import { getCenter } from 'ol/extent';
import store from '@/store';
import { toLonLat } from 'ol/proj';

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
  components: {
    MapOverlay,
  },
  props: {
    mapId: String,
    mergedConfigs: Array[Object],
    compare: Boolean,
    resetProjectionOnDestroy: Boolean,
    /**
     * @property {*} options.time
     * @property {boolean} options.indicator
     * @property {boolean} options.aoiID
     * @property {boolean} options.customArea
     */
    options: {
      type: Object,
      default: () => ({}),
      required: false,
    },
    // layer swipe position (x-pixel from left border)
    swipePixelX: Number,
  },
  data() {
    return {
      overlayHeaders: [],
      overlayRows: [],
      overlayCoordinate: null,
      pointerMoveHandlers: [],
      singleClickHandlers: [],
    };
  },
  mounted() {
    const { map } = getMapInstance(this.mapId);
    const options = { ...this.options };
    options.zIndex = 3;
    this.mergedConfigs.forEach((config) => {
      const layer = createLayerFromConfig(config, map, options);
      layer.set('name', this.compare ? `${config.name}_compare` : config.name);
      // find first feature layer
      const featureLayer = layer.getLayers().getArray()
        .find((l) => l instanceof VectorLayer && l.get('name')?.includes('_features'));
      if (featureLayer || config.tooltip) {
        // initiate hover over functionality optionally for both featureLayer
        // and 'selection' config (main layer)
        const candidateLayers = [];
        if (config.tooltip) {
          candidateLayers.push(layer.getLayers().getArray()[0]);
        }
        if (featureLayer) {
          candidateLayers.push(featureLayer);
        }
        const pointerMoveHandler = (e) => {
          const visibleCandidateLayers = candidateLayers.filter((l) => l.getVisible());
          const features = map.getFeaturesAtPixel(e.pixel, {
            layerFilter: (candidate) => visibleCandidateLayers.includes(candidate),
          });
          // when layer swiping is active, only check for features on this layers side
          const isCorrectSide = this.swipePixelX !== null
            ? (!this.compare && this.swipePixelX < e.pixel[0])
            || (this.compare && this.swipePixelX > e.pixel[0])
            : true;
          // consider layergroup
          if (isCorrectSide && features.length && (config.features || config.tooltip)) {
            const feature = features[0];
            // center coordinate of extent, passable approximation for small or regular features
            const geom = feature.getGeometry();
            let coordinate = null;
            if (geom.getType() === 'Polygon' && geom.getInteriorPoint) {
              coordinate = geom.getInteriorPoint().getCoordinates();
            } else {
              coordinate = getCenter(geom.getExtent());
            }
            if (config.selection) {
              this.overlayHeaders = [layer.getLayers().getArray()[0].get('name')];
            }
            this.overlayCoordinate = coordinate;
            let rows = [];
            if (config?.tooltip?.tooltipFormatFunction) {
              // has to return a list of rows
              rows = config?.tooltip?.tooltipFormatFunction(feature, config);
            } else {
              const props = feature.getProperties();
              // some indicators have 'allowedParameters', which define the keys to display
              const keys = config.features?.allowedParameters || config?.allowedParameters
                || Object.keys(props).filter((k) => k !== 'geometry');
              keys.forEach((key) => {
                if (props[key]) {
                  rows.push(`${key}: ${props[key]}`);
                }
              });
            }
            this.overlayRows = rows;
          } else {
            this.overlayHeaders = null;
            this.overlayCoordinate = null;
            this.overlayContent = null;
          }
        };
        if (config?.tooltip?.trigger === 'singleclick') {
          map.on('singleclick', pointerMoveHandler);
          this.singleClickHandlers.push(pointerMoveHandler);
        } else {
          map.on('pointermove', pointerMoveHandler);
          this.pointerMoveHandlers.push(pointerMoveHandler);
        }
      }
      if (config.selection || config?.features?.selection) {
        // initiate select interaction
        const usedLayers = [];
        if (config.selection) {
          // this could have potential side effects, but currently works
          usedLayers.push(layer.getLayers().getArray()[0]);
        }
        if (config?.features?.selection) {
          usedLayers.push(featureLayer);
        }
        const multiple = config.selection?.mode === 'multiple'
          || config.features?.selection?.mode === 'multiple';
        const selectHandler = (e) => {
          const isCorrectSide = this.swipePixelX !== null
            ? (!this.compare && this.swipePixelX < e.pixel[0])
            || (this.compare && this.swipePixelX > e.pixel[0])
            : true;
          // when layer swiping is active, only check for features on this layers side
          if (isCorrectSide) {
            const visibleCandidateLayers = usedLayers.filter((l) => l.getVisible());
            const finalFeatures = map.getFeaturesAtPixel(e.pixel, {
              layerFilter: ((candidate) => visibleCandidateLayers.includes(candidate)),
            });
            // crosscheck with store
            let { selectedFeatures } = this.$store.state.features;
            finalFeatures.every((f) => {
              const foundIndex = selectedFeatures.findIndex(
                (selectedFtr) => f.getId() === selectedFtr.getId(),
              );
              if (foundIndex !== -1) {
                // was in selection, remove from selection
                selectedFeatures = selectedFeatures.toSpliced(foundIndex, 1);
              } else if (multiple) {
                // add to selection
                selectedFeatures = selectedFeatures.concat([f]);
              } else {
                // it is just single selection, take the first found and break the loop
                selectedFeatures = [f];
                return false;
              }
              return true;
            });
            // only set store if something was clicked (not by clicking empty space intentionally)
            if (finalFeatures.length > 0) {
              this.$store.commit('features/SET_SELECTED_FEATURES', selectedFeatures);
            }
          }
        };
        this.$store.subscribe((mutation) => {
          if (mutation.type === 'features/SET_SELECTED_FEATURES') {
            // trigger change to refresh style on this layer
            // (but does not propagate to "compare" layer)
            usedLayers.forEach((l) => l.changed());
          }
        });
        map.on('singleclick', selectHandler);
        this.singleClickHandlers.push(selectHandler);
      }
      if (config.getTimeFromProperty) {
        const usedLayers = [layer.getLayers().getArray()[0]];
        const clickHandler = (e) => {
          const isCorrectSide = this.swipePixelX !== null
            ? (!this.compare && this.swipePixelX < e.pixel[0])
            || (this.compare && this.swipePixelX > e.pixel[0])
            : true;
          // when layer swiping is active, only check for features on this layers side
          if (isCorrectSide) {
            const visibleCandidateLayers = usedLayers.filter((l) => l.getVisible());
            const finalFeatures = map.getFeaturesAtPixel(e.pixel, {
              layerFilter: ((candidate) => visibleCandidateLayers.includes(candidate)),
            });
            if (finalFeatures.length > 0) {
              if (this.options.indicator === 'AQ1') {
                // // emit new event for map to update list of dates
                // const array = [];
                // const ll = 'aggregated_trajs_model_satellite_v1';
                // const adminZoneKey = 'object_id';
                // const adminId = finalFeatures[0].get(adminZoneKey);
                // const url = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_${ll}?${config.adminZoneKey}=eq.${adminId}&select=${config.timeKey}&order=${config.timeKey}`;
                // fetch(url)
                //   .then((resp) => resp.json())
                //   .then((json) => {
                //     json.forEach((entry) => {
                //       array.push(entry[config.timeKey]);
                //     });
                //   })
                //   .finally(() => {
                //     this.$emit('setTimeArray', array);
                //     this.$emit('setMapTime', array.at(-1));
                //   });
              } else {
                const time = finalFeatures[0].get(config.getTimeFromProperty);
                this.$emit('setMapTime', time);
              }
            }
          }
        };
        map.on('singleclick', clickHandler);
        this.singleClickHandlers.push(clickHandler);
      }
      map.addLayer(layer);
    });
    // update view if previous projection !== new projection
    const defaultProjection = store.state.config.baseConfig.defaultLayersDisplay.mapProjection;
    const projection = getProjectionOl(
      this.mergedConfigs[0]?.mapProjection || defaultProjection,
    );
    if (map.getView().getProjection().getCode() !== projection?.getCode()) {
      const view = getViewInstance(this.mapId, projection);
      view.on(['change:center', 'change:resolution'], (evt) => {
        const v = evt.target;
        this.reportUpdateView(v);
      });
      map.setView(view);
      this.reportUpdateView(view);
    }
  },
  methods: {
    reportUpdateView(view) {
      const center = toLonLat(view.getCenter(), view.getProjection());
      const currentCenter = { lng: center[0], lat: center[1] };
      const zoom = view.getZoom();
      // these events are emitted to save changed made in the dashboard via the
      // 'save map configuration' button
      this.$emit('updatecenter', currentCenter);
      this.$emit('updatezoom', zoom);
    },
  },
  beforeDestroy() {
    const { map } = getMapInstance(this.mapId);
    this.mergedConfigs.forEach((config) => {
      const layer = map.getLayers().getArray().find(
        (l) => l.get('name') === (this.compare ? `${config.name}_compare` : config.name),
      );
      map.removeLayer(layer);
    });
    this.pointerMoveHandlers.forEach((h) => {
      map.un('pointermove', h);
    });
    this.singleClickHandlers.forEach((h) => {
      map.un('singleclick', h);
    });
    if (this.resetProjectionOnDestroy) {
      // reset to default map projection if different from it
      const defaultProjection = store.state.config.baseConfig.defaultLayersDisplay.mapProjection;
      const projection = getProjectionOl(defaultProjection);
      if (map.getView().getProjection().getCode() !== projection?.getCode()) {
        const view = getViewInstance(this.mapId, projection);
        map.setView(view);
      }
    }
  },
};
</script>

<style lang='scss' scoped>
</style>
