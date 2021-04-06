<template>
  <l-map
    ref="map"
    style="height: 100%; width: 100%; background: #cad2d3; z-index: 1"
    :options="defaultMapOptions"
    :zoom="zoom"
    :center="center"
    :maxZoom="maxMapZoom"
    :minMapZoom="minMapZoom"
    @update:zoom="zoomUpdated"
    @update:center="centerUpdated"
    @update:bounds="boundsUpdated"
  >
    <l-control-attribution position="bottomright" prefix=''></l-control-attribution>
    <l-control-layers position="topright"></l-control-layers>
    <l-control-zoom position="topright"></l-control-zoom>
    <LTileLayer
      v-for="layer in baseLayers.filter(b => b.protocol === 'xyz')"
      :key="layer.name"
      v-bind="layer"
      layer-type="base"
      :opacity="opacityTerrain[zoom]"
      :options="layerOptions(null, layer)"
    >
    </LTileLayer>
    <LWMSTileLayer
      v-for="layer in baseLayers.filter(b => b.protocol === 'WMS')"
      :key="layer.name"
      v-bind="layer"
      :options="layerOptions(null, layer)"
      layer-type="base"
    >
    </LWMSTileLayer>
    <l-geo-json
    :geojson="countriesJson"
    :optionsStyle="countriesStyle"
    name="Country vectors"
    layer-type="overlay"
    >
    </l-geo-json>
    <l-geo-json
    ref="subaoiLayer"
    :geojson="subAoi"
    :optionsStyle="subAoiStyle">
    </l-geo-json>
    <LTileLayer
      v-for="layer in overlayLayers.filter(b => b.protocol === 'xyz')"
      :key="layer.name"
      v-bind="layer"
      layer-type="overlay"
      :opacity="opacityOverlay[zoom]"
      :options="layerOptions(null, layer)"
    >
    </LTileLayer>
    <LWMSTileLayer
      v-for="layer in overlayLayers.filter(b => b.protocol === 'WMS')"
      v-bind="layer"
      :key="layer.name"
      :options="layerOptions(null, layer)"
      :opacity="opacityOverlay[zoom]"
      layer-type="overlay"
    >
    </LWMSTileLayer>
    <l-marker-cluster ref="clusterLayer" :options="clusterOptions">
      <l-marker v-for="(feature) in getGroupedFeatures.filter((f) => f.latlng)"
        :key="feature.id"
        ref="markers"
        :lat-lng="feature.latlng"
        :name='`${getLocationCode(feature.properties.indicatorObject)}`'
        @click="selectIndicator(feature)"
      >
        <l-icon
          :icon-anchor="currentSelected === getLocationCode(feature.properties.indicatorObject)
            ? [18, 18]
            : [14, 14]"
          style="outline: none;"
        >
          <div
            :style="`display: flex; align-items: center;
              justify-content: center;
              border-radius: 50%;
              border: 2px ${currentSelected ===
                getLocationCode(feature.properties.indicatorObject)
                  ? 'dashed var(--v-primary-base)'
                  : 'solid white'};
              width: ${currentSelected ===
                getLocationCode(feature.properties.indicatorObject) ? '36px' : '28px'};
              height: ${currentSelected ===
                getLocationCode(feature.properties.indicatorObject) ? '36px' : '28px'};
              background-color: ${getColor(feature.properties.indicatorObject)}`"
          >
              <v-icon
                color="white"
                class="pa-1"
                icon-url="/test"
                :small="currentSelected !== getLocationCode(feature.properties.indicatorObject)"
              >
                {{ baseConfig.indicatorClassesIcons[baseConfig
                    .indicatorsDefinition[feature.properties.indicatorObject.indicator].class]
                    ? baseConfig.indicatorClassesIcons[baseConfig
                      .indicatorsDefinition[feature.properties.indicatorObject.indicator].class]
                    : 'mdi-lightbulb-on-outline'}}
              </v-icon>
          </div>
        </l-icon>
        <l-tooltip class="tooltip text-center" :options="{ direction: 'top' }">
          <p class="ma-0">
            <strong>{{ feature.properties.indicatorObject.city }}</strong>
          </p>
            <p class="ma-0">
              <strong>{{ feature.properties.indicatorObject.description }}</strong>
            </p>
            <p
              class="ma-0"
            >
              {{ formatLabel(feature) }}
            </p>
        </l-tooltip>
      </l-marker>
    </l-marker-cluster>
  </l-map>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';

import {
  geoJson, Point, DivIcon, featureGroup,
} from 'leaflet';
import {
  LMap, LTileLayer, LWMSTileLayer, LGeoJson, LMarker, LIcon, LTooltip,
  LControlLayers, LControlAttribution, LControlZoom,
} from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'leaflet-mouse-position';

import countries from '@/assets/countries.json';

export default {
  components: {
    LMap,
    LTileLayer,
    LWMSTileLayer,
    LGeoJson,
    LMarker,
    LIcon,
    LTooltip,
    LControlLayers,
    LControlAttribution,
    LControlZoom,
    'l-marker-cluster': Vue2LeafletMarkerCluster,
  },
  data() {
    return {
      map: null,
      minMapZoom: 3,
      zoom: 3,
      maxMapZoom: 14,
      center: [55, 10],
      bounds: null,
      currentSelected: null,
      currentSelectedIndex: null,
      subAoi: null,
      defaultMapOptions: {
        attributionControl: false,
        zoomControl: false,
      },
      opacityTerrain: [1],
      opacityOverlay: [0, 0, 0, 0, 0, 0, 0.4, 0.4, 0.8, 0.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      opacityCountries: [1, 1, 1, 1, 0.7, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  },
  computed: {
    ...mapGetters('features', ['getGroupedFeatures']),
    ...mapState('config', ['appConfig', 'baseConfig']),
    baseLayers() {
      return this.baseConfig.baseLayersLeftMap;
    },
    overlayLayers() {
      return this.baseConfig.overlayLayersLeftMap;
    },
    countriesJson() {
      return countries;
    },
    clusterOptions() {
      return {
        maxClusterRadius: 40,
        animate: false,
        // zoomToBoundsOnClick: false,
        iconCreateFunction: function (cluster) { // eslint-disable-line func-names
          // left as default
          let selCluster = null;
          if (this.currentSelected !== null && this.$refs.clusterLayer) {
            const selectedMarker = this.$refs.markers.find(
              (item) => item.name === this.currentSelected,
            );
            if (selectedMarker) {
              selCluster = this.$refs.clusterLayer.mapObject.getVisibleParent(
                selectedMarker.mapObject,
              );
            }
          }
          // modified selected cluster style
          const sel = selCluster !== null ? cluster._leaflet_id === selCluster._leaflet_id : false;
          const selectedClass = sel ? ' marker-cluster-selected' : '';
          let iconSize = null;
          if (sel) {
            iconSize = new Point(48, 48);
          } else {
            iconSize = new Point(40, 40);
          }
          const childCount = cluster.getChildCount();
          return new DivIcon({
            html: `<div class="${selectedClass}"><span>${childCount}</span></div>`,
            className: `marker-cluster ${selectedClass}`,
            iconSize,
          });
        }.bind(this),
        polygonOptions: {
          fillColor: this.$vuetify.theme.themes.light.primary,
          color: this.$vuetify.theme.themes.light.primary,
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.3,
          dashArray: 4,
        },
      };
    },
    indicatorsDefinition: () => this.baseConfig.indicatorsDefinition,
    countriesStyle() {
      return {
        color: '#a2a2a2',
        weight: 1,
        fillColor: '#fff',
        opacity: this.opacityCountries[this.zoom],
        fillOpacity: this.opacityCountries[this.zoom],
      };
    },
    subAoiStyle() {
      let currentIndicator;
      let fillColor;
      if (this.$store.state.indicators.selectedIndicator) {
        currentIndicator = this.$store.state.indicators.selectedIndicator;
        fillColor = this.getColor(currentIndicator);
      } else {
        fillColor = this.getIndicatorColor('');
      }
      return {
        color: '#fff',
        weight: 1,
        fillColor,
        opacity: 1,
        fillOpacity: 0.5,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      const layerButton = document.querySelector('.leaflet-control-layers-toggle');
      layerButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${this.appConfig.branding.primaryColor}" width="32px" height="32px"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>`;

      this.map = this.$refs.map.mapObject;

      this.$refs.subaoiLayer.mapObject.bindTooltip('Reference area', {
        direction: 'top',
      });

      // update leaflet controls
      L.control.mousePosition({ // eslint-disable-line no-undef
        emptyString: '',
        formatter: (lon, lat) => `${lon.toFixed(3)}, ${lat.toFixed(3)}`,
        position: 'bottomright',
      }).addTo(this.map);
      // hide attribution under icon
      this.map.attributionControl._update = function () { // eslint-disable-line
        const attribs = [];
        const kk = Object.keys(this._attributions);
        for (let i = 0; i < kk.length; i += 1) {
          if (this._attributions[kk[i]]) {
            attribs.push(kk[i]);
          }
        }
        const prefixAndAttribs = [];
        if (this.options.prefix) {
          prefixAndAttribs.push(this.options.prefix);
        }
        if (attribs.length) {
          prefixAndAttribs.push(attribs.join(', '));
        }
        this._container.innerHTML = `<div class='attribution-body'>${prefixAndAttribs.join(' | ')}</div><div class='attribution-icon'>ℹ</div>`;
      };
      this.map.attributionControl._update();
      this.onResize();
    });
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'indicators/INDICATOR_LOAD_FINISHED') {
        if (mutation.payload !== null && mutation.payload.aoi !== null) {
          this.currentSelected = this.getLocationCode(mutation.payload);
          if (mutation.payload.subAoi) {
            this.subAoi = mutation.payload.subAoi;
          }
        } else {
          this.currentSelected = null;
          this.subAoi = {
            type: 'FeatureCollection',
            features: [],
          };
        }
        this.resetClusterLayer();
      } else if (mutation.type === 'features/SET_FEATURE_FILTER') {
        if (Object.keys(mutation.payload).includes('includeArchived') && Object.keys(mutation.payload).length === 1) {
          return;
        }

        const features = this.getGroupedFeatures;
        const featuresOnMap = features.filter((f) => f.latlng);
        if (featuresOnMap.length > 0) {
          const maxZoomFit = 8;
          if (featuresOnMap.length === 1 && featuresOnMap[0].properties.indicatorObject.subAoi
          && featuresOnMap[0].properties.indicatorObject.subAoi.features.length > 0) {
            this.$nextTick(() => {
              const bounds = geoJson(
                featuresOnMap[0].properties.indicatorObject.subAoi,
              ).getBounds();
              this.map.fitBounds(bounds, {
                padding: [25, 25],
              });
            });
          } else {
            this.$nextTick(() => {
              const markers = this.$refs.markers.map((component) => component.mapObject);
              const dummyFtrGroup = featureGroup(markers);
              this.map.fitBounds(dummyFtrGroup.getBounds(), {
                padding: [25, 25],
                maxZoom: maxZoomFit,
              });
            });
          }
        }
      }
    });
  },
  methods: {
    selectIndicator(feature) {
      const { indicatorObject } = feature.properties;
      if (!indicatorObject.dummyFeature) {
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
        const query = { ...this.$route.query };
        delete query.sensor;
        this.$router.replace({ query }).catch(() => {});
      }
    },
    getColor(indObj) {
      let colorCode;
      if (indObj) {
        if (indObj.updateFrequency && indObj.updateFrequency.toLowerCase() === 'archived') {
          colorCode = 'grey';
        } else if (Object.prototype.hasOwnProperty.call(indObj, 'lastColorCode')
          && !['', '/'].includes(indObj.lastColorCode)) {
          colorCode = indObj.lastColorCode;
        } else if (Object.prototype.hasOwnProperty.call(indObj, 'indicator')
          && ['N1', 'N1a', 'N1b', 'N3b', 'E10a3', 'E10a8', 'E10a9', 'E12b'].includes(indObj.indicator)) {
          colorCode = 'BLUE';
        }
      }
      return this.getIndicatorColor(colorCode);
    },
    formatLabel(feature) {
      let label = '(coming soon)';
      if (feature) {
        const { indicatorObject } = feature.properties;
        if (Object.prototype.hasOwnProperty.call(indicatorObject, 'lastIndicatorValue')) {
          label = 'Latest value: ';
          const indVal = indicatorObject.lastIndicatorValue;
          if (['E10a1', 'E10a5'].includes(indicatorObject.indicator)) {
            const percVal = Number((indVal * 100).toPrecision(4));
            if (percVal > 0) {
              label += `+${percVal}%`;
            } else {
              label += `${percVal}%`;
            }
          } else if (['E10a3', 'E10a8', 'E10a9', 'N4c'].includes(indicatorObject.indicator)) {
            label += 'multiple';
          } else if (['E10a6', 'E10a7'].includes(indicatorObject.indicator)) {
            const newIndVal = Number(indicatorObject.lastMeasurement).toPrecision(4);
            label += `${newIndVal}%`;
          } else if (['N1', 'N3b', 'N1b', 'E12b'].includes(indicatorObject.indicator)) {
            label = '';
          } else if (indVal === null) {
            label = null;
          } else {
            label += indVal;
          }
        }

        // Overwrite label if archived
        if (indicatorObject.updateFrequency && indicatorObject.updateFrequency.toLowerCase() === 'archived') {
          label = 'Archived';
        }
      }

      return label;
    },
    resetClusterLayer() {
      if (this.$refs.clusterLayer) {
        this.$refs.clusterLayer.mapObject.refreshClusters();
      }
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
      this.onResize();
      this.$nextTick(() => {
        this.resetClusterLayer();
      });
    },
    centerUpdated(center) {
      this.center = center;
      this.onResize();
      this.$nextTick(() => {
        this.resetClusterLayer();
      });
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
      this.onResize();
    },
    onResize() {
      // to fix panel size for reference image window
      if (this.map) {
        this.map._onResize();
      }
    },
    layerOptions(time, sourceOptionsObj) {
      const additionalSettings = {
        minZoom: sourceOptionsObj.minZoom,
        maxZoom: sourceOptionsObj.maxZoom,
        minNativeZoom: sourceOptionsObj.minNativeZoom,
        maxNativeZoom: sourceOptionsObj.maxNativeZoom,
      };
      if (time !== null) {
        // time as is gets automatically injected to WMS query OR xyz url {time} template
        additionalSettings.time = sourceOptionsObj.dateFormatFunction
          ? sourceOptionsObj.dateFormatFunction(time)
          : time;
      }
      return additionalSettings;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .leaflet-tooltip-top {
  background: #00000099;
  border-radius: 3px;
  color: #fff;
  pointer-events: none;
  white-space: nowrap;
  border: none;
  &:before {
    border-top-color: #00000099;
  }
}
::v-deep .marker-cluster {
  // TO-DO find a way how to get the primary color into this
  // background-color: rgba(var(--primary-less));
  background-color: rgba(#003247, 0.5);
  div {
    background-color: var(--v-primary-base);
    span {
      color: white;
    }
    &.marker-cluster-selected {
      margin-left: 3px;
      margin-top: 3px;
      width: 38px;
      height: 38px;
      border-radius: 19px;
      & span {
        line-height: 38px;
        font-size: 14px;
      }
    }
  }
  &.marker-cluster-selected {
    border: 2px var(--v-primary-base) dashed;
  }
}
::v-deep .leaflet-control-attribution:active :not(.attribution-icon),
::v-deep .leaflet-control-attribution:hover :not(.attribution-icon),
::v-deep .leaflet-control-attribution .attribution-icon {
  display: inline-block;
}
::v-deep .leaflet-control-attribution :not(.attribution-icon),
::v-deep .leaflet-control-attribution:active .attribution-icon,
::v-deep .leaflet-control-attribution:hover .attribution-icon {
  display: none;
}
::v-deep .attribution-icon {
  font-size: 1.2em;
  margin: 1px;
}
::v-deep .leaflet-control-mouseposition {
  background-color: rgba(255, 255, 255, 0.8);
  transform: translate3d(-8px, 32px, 0);
  padding: 2px 4px;
}
::v-deep .leaflet-bar a, ::v-deep .leaflet-control-attribution {
  color: var(--v-primary-base) !important;
}
::v-deep .leaflet-control-layers-toggle {
  background-image: none;
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
