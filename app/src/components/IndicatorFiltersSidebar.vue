<template>
  <div
    :style="
      `height: calc(var(--vh, 1vh) * 100); background: ${$vuetify.theme.currentTheme.background}`
    "
    v-click-outside="onClickOutside"
  >
    <v-navigation-drawer
      app
      clipped
      permanent
      mini-variant
      :mini-variant-width="iconSize"
    >
      <v-list class="py-0">
        <v-list-item-group v-model="domainModel" :mandatory="domainModel !== undefined">
          <v-list-item
            v-for="theme in themes"
            :key="theme.slug"
            class="pa-2"
            :style="`width: ${iconSize}px; height: ${iconSize}px`"
            @click="showLayerMenu = true"
          >
            <v-list-item-icon
              class="ma-0 d-flex flex-column align-center"
            >
              <v-img :src="theme.icon" :width="30" :height="30" />
              <span
                class="text-center text-uppercase mt-3"
                style="line-height: 1; font-size: 12px"
                :style="{'color': appConfig.branding.primaryColor}"
              >{{ theme.name }}</span>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-expand-x-transition
      mode="in"
      hide-on-leave="true"
    >
      <div
        v-show="showLayerMenu"
        class="fill-height"
        style="width: 250px; pointer-events: all"
      >
        <v-list v-if="themes[domainModel]" style="width: 100%">
          <v-list-item-group style="width: 100%">
            <v-list-item
              v-for="item in globalIndicators.filter(
                gI => gI.theme === themes[domainModel].slug
              ).reverse()"
              :key="getLocationCode(item.properties.indicatorObject)"
              class="mb-2"
              style="width: 100%"
              @click="() => {
                setSelectedIndicator(item.properties.indicatorObject); showLayerMenu = false
              }"
            >
              <v-list-item-avatar>
                <v-img
                  :src="`./data/${appConfig.id}/globalDataLayerImages/`+
                  `${getLocationCode(item.properties.indicatorObject)}.png`"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.properties.indicatorObject.indicatorName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.properties.indicatorObject.navigationDescription }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </v-expand-x-transition>
    <div
      v-show="indicatorObject && indicatorObject.highlights"
      class="fill-height"
      style="width: 130px; pointer-events: all; position:absolute; left:10px;"
    >
      <v-list style="width: 100%; background-color: #00000000;">
        <v-list-item-group style="width: 100%"
            v-if="indicatorObject && indicatorObject.highlights"
          >
          <v-list-item
            v-for="item in indicatorObject.highlights"
            :key="item.name"
            class="mb-2 dashboard-button v-btn v-btn--is-elevated v-btn--has-bg theme--light"
            style="width: 100%"
            @click="moveToHighlight(item.location)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';

import GeoJSON from 'ol/format/GeoJSON';
import { getMapInstance } from '@/components/map/map';
import { calculatePadding } from '@/utils';

export default {
  data: () => ({
    domainModel: undefined,
    iconSize: 88,
    showLayerMenu: false,
    customOrder: [
      'Austria-REP4',
      'Austria-REP3',
      'Austria-REP2',
      'Austria-REP1',
      'AT-AQ',
      'Innsbruck-SOL3',
      'Innsbruck-SOL2',
      'Innsbruck-SOL1',
    ],
  }),
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('themes', ['themes']),
    ...mapGetters('features', ['getGroupedFeatures']),
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    globalIndicators() {
      return this.getGroupedFeatures && this.getGroupedFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject.siteName))
        .sort((a, b) => ((a.properties.indicatorObject.indicatorName
          > b.properties.indicatorObject.indicatorName)
          ? 1
          : -1))
        .sort((a, b) => (
          this.customOrder.indexOf(this.getLocationCode(a.properties.indicatorObject))
          > this.customOrder.indexOf(this.getLocationCode(b.properties.indicatorObject))
            ? 1 : -1))
        .map((i) => ({
          ...i,
          theme: this.baseConfig.indicatorsDefinition[
            i.properties?.indicatorObject?.indicator
          ]?.themes[0],
        }));
    },
  },
  methods: {
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    globalIndicatorsForTheme(theme) {
      if (!theme) {
        return;
      }
      this.globalIndicators.filter((item) => (
        this.baseConfig.indicatorsDefinition[
          item.properties?.indicatorObject?.indicator
        ]?.themes.includes(theme.slug)
      ));
    },
    onClickOutside() {
      this.showLayerMenu = false;
    },
    moveToHighlight(location) {
      const DEFAULT_PROJECTION = 'EPSG:3857';
      const geoJsonFormat = new GeoJSON({
        featureProjection: DEFAULT_PROJECTION,
      });
      const geom = geoJsonFormat.readGeometry(location);
      const { map } = getMapInstance('centerMap');
      const padding = calculatePadding();
      map.getView().fit(geom.getExtent(), {
        duration: 0, padding,
      });
    },
  },
  watch: {
    globalIndicators() {
      if (this.$route.query.poi) {
        const foundPoi = this.globalIndicators
          .find((gI) => this.getLocationCode(gI.properties.indicatorObject)
            === this.$route.query.poi);
        if (foundPoi) {
          this.domainModel = this.themes.findIndex((t) => t.slug === foundPoi.theme);
        }
      }
    },
  },
};
</script>

<style scoped>
::v-deep .v-list-item__title,
::v-deep .v-list-item__subtitle {
  white-space: pre-wrap;
}
</style>
