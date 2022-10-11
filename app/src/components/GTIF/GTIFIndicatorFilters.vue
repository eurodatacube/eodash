<template>
  <div
    :style="`height: calc(var(--vh, 1vh) * 100); background: ${$vuetify.theme.currentTheme.background}`"
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
        <v-list-item-group v-model="domainModel">
          <v-list-item
            v-for="theme in themes"
            :key="theme.slug"
            class="pa-2"
            :style="`width: ${iconSize}px; height: ${iconSize}px`"
          >
            <v-list-item-icon
              class="ma-0 d-flex flex-column align-center"
            >
              <v-img :src="theme.icon" :width="30" :height="30" />
              <span
                class="text-center text-uppercase mt-3"
                style="line-height: 1; font-size: 12px"
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
        style="width: 238px; pointer-events: all"
      >
        <v-list v-if="themes[domainModel]" style="width: 100%">
          <v-list-item-group style="width: 100%">
            <v-list-item
              v-for="item in globalIndicators.filter(gI => gI.theme === themes[domainModel].slug)"
              :key="getLocationCode(item.properties.indicatorObject)"
              class="mb-2"
              style="width: 100%"
              @click="setSelectedIndicator(item.properties.indicatorObject)"
            >
              <v-list-item-avatar>
                <v-img
                  :src="`./data/${appConfig.id}/globalDataLayerImages/${getLocationCode(item.properties.indicatorObject)}.png`"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.properties.indicatorObject.indicatorName }}</v-list-item-title>
                <v-list-item-subtitle>Placeholder for description</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </v-expand-x-transition>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';

export default {
  data: () => ({
    domainModel: undefined,
    iconSize: 88,
    showLayerMenu: false,
  }),
  computed: {
    ...mapState('config', ['appConfig', 'baseConfig']),
    ...mapState('themes', ['themes']),
    ...mapGetters('features', ['getGroupedFeatures']),
    globalIndicators() {
      return this.getGroupedFeatures && this.getGroupedFeatures
        .filter((f) => ['global'].includes(f.properties.indicatorObject.siteName))
        .sort((a, b) => ((a.properties.indicatorObject.indicatorName
          > b.properties.indicatorObject.indicatorName)
          ? 1
          : -1))
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
      return this.globalIndicators.filter((item) => {
        this.baseConfig.indicatorsDefinition[
          item.properties?.indicatorObject?.indicator
        ]?.themes.includes(theme.slug);
      });
    },
    onClickOutside() {
      this.showLayerMenu = false;
      this.domainModel = undefined;
    },
  },
  watch: {
    domainModel(newIndex) {
      this.showLayerMenu = !(newIndex === undefined);
    },
  },
};
</script>
