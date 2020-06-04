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
    <l-control-layers position="topright" ></l-control-layers>
    <l-control-zoom position="topright"  ></l-control-zoom>
    <LTileLayer
      v-for="layer in baseLayers"
      :key="layer.name"
      v-bind="layer"
      layer-type="base"
      :opacity="opacityTerrain[zoom]"
      :options="layerOptions(null, layer)"
    >
    </LTileLayer>
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
      v-for="layer in overlayLayers"
      :key="layer.name"
      v-bind="layer"
      layer-type="overlay"
      :opacity="opacityOverlay[zoom]"
      :options="layerOptions(null, layer)"
    >
    </LTileLayer>

    <l-marker-cluster ref="clusterLayer" :options="clusterOptions" @clusterclick="onClusterClick">
      <l-circle-marker v-for="(feature) in getFeatures.filter((f) => f.latlng)"
        :key="feature.id"
        ref="markers"
        :lat-lng="feature.latlng"
        :radius="currentSelected === feature.id ? 16 : 12"
        :name='`${feature.id}`'
        :color="currentSelected === feature.id ? $vuetify.theme.themes.light.primary : 'white'"
        :weight="2"
        :dashArray="currentSelected === feature.id ? '5' : '0'"
        :fill="true"
        :fillColor="getLastValue(feature.properties.indicatorObject).color"
        :fillOpacity="1"
        @click="selectIndicator(feature)"
      >
        <l-tooltip class="tooltip text-center" :options="{ direction: 'top' }">
          <p class="ma-0">
            <strong>{{ feature.properties.indicatorObject.City }}</strong>
          </p>
            <p class="ma-0">
              <strong>{{ feature.properties.indicatorObject.Description }}</strong>
            </p>
            <p
              v-if="feature.properties
                .indicatorObject['Indicator Value'][feature.properties
                  .indicatorObject['Indicator Value'].length - 1]"
              class="ma-0"
            >
              Latest value: {{ formatLabel(feature) }}
            </p>
            <p v-else class="mb-0"><small>(coming soon)</small></p>
        </l-tooltip>
      </l-circle-marker>
    </l-marker-cluster>
  </l-map>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';

import { geoJson, Point, DivIcon } from 'leaflet';
import {
  LMap, LTileLayer, LGeoJson, LCircleMarker, LTooltip,
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
    LGeoJson,
    LCircleMarker,
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
    ...mapGetters('features', ['getFeatures']),
    ...mapState('config', ['baseConfig']),
    baseLayers() {
      return this.baseConfig.baseLayers;
    },
    overlayLayers() {
      return this.baseConfig.overlayLayers;
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
              (item) => parseInt(item.name, 10) === this.currentSelected,
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
      const currentIndicator = this.$store.state.indicators.selectedIndicator;
      const lastValue = currentIndicator && currentIndicator['Color code']
        && currentIndicator['Color code'][currentIndicator['Color code'].length - 1];
      return {
        color: '#fff',
        weight: 1,
        fillColor: lastValue
          ? this.getIndicatorColor(lastValue)
          : this.$vuetify.theme.themes.light.primary,
        opacity: 1,
        fillOpacity: 0.5,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
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
      if (mutation.type === 'features/SET_FEATURE_FILTER' && !['all', 'regional'].includes(mutation.payload.countries)) {
        if (typeof mutation.payload.countries === 'string') {
          const countryFeature = countries.features
            .find((c) => c.properties.alpha2 === mutation.payload.countries);
          this.map.flyToBounds(geoJson(countryFeature).getBounds());
        } else if (mutation.payload.countries) {
          this.$nextTick(() => {
            this.map.fitBounds(this.$refs.clusterLayer.mapObject._featureGroup.getBounds());
          });
        }
      }
    });
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'indicators/SET_SELECTED_INDICATOR') {
        if (mutation.payload !== null && mutation.payload.AOI !== null) {
          this.currentSelected = mutation.payload.id;
        } else {
          this.currentSelected = null;
        }
        this.resetClusterLayer();
      }
    });
  },
  methods: {
    selectIndicator(feature) {
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
      const { indicatorObject } = feature.properties;
      if (indicatorObject['Indicator code'] !== 'd') {
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
        this.currentSelected = feature.id;
        this.subAoi = indicatorObject['Sub-AOI'];
      }
    },
    formatLabel(feature) {
      let label = '';
      if (feature) {
        const { indicatorObject } = feature.properties;
        const indVal = indicatorObject['Indicator Value'][
          indicatorObject['Indicator Value'].length - 1
        ];
        if (indicatorObject['Indicator code'] === 'E10a1') {
          if (indVal !== '') {
            const percVal = Number((indVal * 100).toPrecision(4));
            if (percVal > 0) {
              label = `+${percVal}%`;
            } else {
              label = `${percVal}%`;
            }
          }
        } else {
          label = indVal;
        }
      }
      return label;
    },
    resetClusterLayer() {
      if (this.$refs.clusterLayer) {
        this.$refs.clusterLayer.mapObject.refreshClusters();
      }
    },
    getLastValue(values) {
      const vLen = values['Indicator Value'].length;
      const lastValue = values['Indicator Value'][vLen - 1];
      let lastColorCode = '';
      if (Object.prototype.hasOwnProperty.call(values, 'Color code')) {
        lastColorCode = values['Color code'][vLen - 1];
      }
      return {
        color: this.getIndicatorColor(lastColorCode),
        text: lastValue ? lastValue.toLowerCase() : 'coming soon',
      };
    },
    onClusterClick(event) {
      // if (event.layer._childClusters.length !== 1) {
      //   this.map.setView(event.latlng, this.zoom + 1);
      // }
      console.log(event);
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
  watch: {
    getFeatures(features) {
      if (features.filter((f) => f.latlng).length > 0) {
        this.$nextTick(() => {
          this.map.fitBounds(this.$refs.clusterLayer.mapObject._featureGroup.getBounds());
        });
      }
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
  cursor: pointer;
}
::v-deep .attribution-icon {
  font-size: 1.2em;
  margin: 1px;
}
::v-deep .leaflet-control-mouseposition {
  background-color: rgba(255, 255, 255, 0.5);
  transform: translate3d(-8px, 32px, 0);
  padding: 2px 4px;
}
</style>
