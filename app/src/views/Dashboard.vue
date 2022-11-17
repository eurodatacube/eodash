<template>
  <div
    class="dashboard fill-height"
    :class="{ 'panel-expanded': drawerRight && $vuetify.breakpoint.smAndUp }"
  >
    <global-header
      ref="globalHeader"
    />
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="drawerRight"
      right
      stateless
      app
      clipped
      temporary
      hide-overlay
      :width="dataPanelFullWidth ? '100%' : `${dataPanelWidth}px`"
      :style="`margin-top: ${$vuetify.application.top}px;
        height: calc(100% - ${$vuetify.application.top + $vuetify.application.footer}px;`"
      class="data-panel"
    >
      <banner v-if="currentNews" ref="newsBanner" />
      <v-toolbar flat>
        <v-toolbar-title v-if="$store.state.indicators.selectedIndicator"
          :class="$store.state.indicators.selectedIndicator.description ===
            $store.state.indicators.selectedIndicator.indicatorName && 'preventEllipsis'"
        >
          {{ queryIndicatorObject && queryIndicatorObject.properties.indicatorObject.city }}:
          {{
            queryIndicatorObject && (queryIndicatorObject.properties.indicatorObject.indicatorName
            || queryIndicatorObject.properties.indicatorObject.description)
          }}
          <div v-if="
            $store.state.indicators.selectedIndicator.description !==
            $store.state.indicators.selectedIndicator.indicatorName
            && $store.state.indicators.customAreaIndicator === null"
            class="subheading" style="font-size: 0.8em">
            {{ queryIndicatorObject
              && queryIndicatorObject.properties.indicatorObject.description }}
          </div>
        </v-toolbar-title>
        <v-toolbar-title
          v-else-if="$store.state.features.featureFilters.indicators[0] && firstIndicatorObject"
        >
          {{ firstIndicatorObject
            .description }}
          <div v-if="
            firstIndicatorObject.description !==
            firstIndicatorObject.indicatorName"
            class="subheading" style="font-size: 0.8em">
            {{ firstIndicatorObject.indicatorName || firstIndicatorObject.description }}
          </div>
        </v-toolbar-title>
        <v-tooltip
          v-if="$store.state.indicators.selectedIndicator"
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              class="elevation-1 rounded-lg"
              style="position: absolute; right: 30px; width: 36px; height: 36px;"
              @click="dataPanelFullWidth
                ? setDataPanelWidth(false)
                : setDataPanelWidth(true)"
            >
              <v-icon>{{ dataPanelFullWidth ? 'mdi-close' : 'mdi-fullscreen' }}</v-icon>
            </v-btn>
          </template>
          <span>{{ dataPanelFullWidth ? 'Close' : 'Open' }} full screen</span>
        </v-tooltip>
      </v-toolbar>

      <data-panel
        v-if="$store.state.indicators.selectedIndicator
          || $store.state.features.featureFilters.indicators.length > 0"
        :key="panelKey"
        :newsBanner="$refs.newsBanner"
        :expanded="dataPanelFullWidth" class="px-5" />
    </v-navigation-drawer>
    <v-tooltip
      v-if="$vuetify.breakpoint.mdAndUp && indicatorSelected"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          icon
          small
          class="reopen-right-drawer move-with-panel rounded-lg rounded-r-0 py-7 elevation-2"
          :style="`background: ${$vuetify.theme.currentTheme.background}`"
          v-on="on"
          @click="drawerRight = !drawerRight"
        >
          <v-icon :class="{open: drawerRight}">mdi-menu-left</v-icon>
        </v-btn>
      </template>
      <span>{{ drawerRight ? 'Collapse' : 'Expand' }} side panel</span>
    </v-tooltip>

    <div
      class="retractable"
      :class="{
        'retracted': isDialogRetracted,
        'hidden': !$store.state.indicators.selectedIndicator
          && $store.state.features.featureFilters.indicators.length === 0,
      }"
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <v-toolbar dark color="primary">
        <v-toolbar-title style="overflow: unset; white-space: pre-wrap;"
          v-if="$store.state.indicators.selectedIndicator"
        >{{ $store.state.indicators.selectedIndicator.city }},
          {{ $store.state.indicators.selectedIndicator.description }}
        </v-toolbar-title>
        <v-toolbar-title
          v-else-if="$store.state.features.featureFilters.indicators[0] && firstIndicatorObject"
        >
          {{ firstIndicatorObject
            .description }}
          <div v-if="
            firstIndicatorObject.description !==
            firstIndicatorObject.indicatorName"
            class="subheading" style="font-size: 0.8em">
            {{ firstIndicatorObject.indicatorName || firstIndicatorObject.description }}
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="() => isDialogRetracted = !isDialogRetracted">
          <v-icon>mdi-chevron-{{isDialogRetracted ? 'up' : 'down'}}</v-icon>
        </v-btn>

        <v-btn icon dark @click="clickMobileClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container
        class="data-panel scrollContainer"
        :style="{
          background: $vuetify.theme.themes[theme].background,
          height: 'calc(var(--vh, 1vh) * 100)'
        }"
      >

        <banner v-if="currentNews" />

        <v-row>
          <v-col>
            <h4 v-if="
                ($store.state.indicators.selectedIndicator && (
                  $store.state.indicators.selectedIndicator.description !==
                  $store.state.indicators.selectedIndicator.indicatorName))"
              class="py-2"
            >
              {{ queryIndicatorObject
                && (queryIndicatorObject.properties.indicatorObject.indicatorName
                || queryIndicatorObject.properties.indicatorObject.description) }}
            </h4>
            <data-panel
              v-if="$store.state.indicators.selectedIndicator
                || $store.state.features.featureFilters.indicators.length > 0"
              :newsBanner="$refs.newsBanner"
              :expanded="dataPanelFullWidth"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>

    

    <v-content
      :style="`height: 100vh; height: calc((var(--vh, 1vh) * 100) + ${$vuetify.application.top
        + $vuetify.application.footer}px); overflow:hidden; width: 100%`"
    >
      <v-container
        class="fill-height pa-0"
        fluid
      >
        <v-row class="fill-height">
          <v-col
            cols="12"
            class="py-0 fill-height"
          >
            <center-panel :panelActive="drawerRight" />
            <div
              class="d-flex justify-start"
              style="position: absolute; top: 0; width: 100%; pointer-events: none"
            >
              <indicator-filters ref="indicatorFilters" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <global-footer
      :color="getCurrentTheme ? getCurrentTheme.color : 'primary'"
    />
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import CenterPanel from '@/components/CenterPanel.vue';
import DataPanel from '@/components/DataPanel.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import IndicatorFilters from '@/components/IndicatorFilters.vue';
import closeMixin from '@/mixins/close';
import dialogMixin from '@/mixins/dialogMixin';
import { mapState, mapGetters } from 'vuex';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
      link: [
        { rel: 'apple-touch-icon', href: `${appConfig.pageMeta.imagePath}/apple-touch-icon-192x192.png` },
      ],
    };
  },
  components: {
    Banner,
    CenterPanel,
    DataPanel,
    GlobalHeader,
    GlobalFooter,
    IndicatorFilters,
  },
  props: {
    source: String,
  },
  mixins: [closeMixin, dialogMixin],
  data: () => ({
    drawerLeft: false,
    drawerRight: false,
    dialog: false,
    dataPanelFullWidth: false,
    dataPanelTemporary: false,
    panelKey: 0,
    isDialogRetracted: true,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    showMap() {
      const indicatorObject = this.$store.state.indicators.selectedIndicator;
      // if returns true, we are showing map, if false we show chart
      return ['all'].includes(indicatorObject.country)
        || this.appConfig.configuredMapPois.includes(`${indicatorObject.aoiID}-${indicatorObject.indicator}`)
        || Array.isArray(indicatorObject.country);
    },
    dataPanelWidth() {
      return this.$vuetify.breakpoint.lgAndUp ? 600 : 400;
    },
    indicatorSelected() {
      return this.$store.state.indicators.selectedIndicator
        || this.$store.state.features.featureFilters.indicators.length > 0;
    },
    firstIndicatorObject() {
      const indicator = Array.isArray(this.$store.state.features.featureFilters.indicators)
        ? this.$store.state.features.featureFilters.indicators[0]
        : this.$store.state.features.featureFilters.indicators;
      const firstFeature = this.$store.state.features.allFeatures
        .find((f) => f.properties.indicatorObject.indicator
          === indicator);
      return firstFeature
        ? firstFeature.properties.indicatorObject
        : undefined;
    },
    currentNews() {
      let currentNews;
      if (this.appConfig && this.appConfig.newsBanner) {
        const currentDate = new Date().getTime();
        const startDate = new Date(this.appConfig.newsBanner.startDate).getTime();
        // set end date + 1 to include last day
        let endDate = new Date(this.appConfig.newsBanner.endDate);
        endDate.setDate(endDate.getDate() + 1);
        endDate = endDate.getTime();
        if (startDate < currentDate
          && currentDate < endDate) {
          currentNews = this.appConfig.newsBanner;
        }
      }
      return currentNews;
    },
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light';
    },
    queryIndicatorObject() {
      return this.$store.state.features.allFeatures.find(
        (f) => this.getLocationCode(f && f.properties.indicatorObject) === this.$route.query.poi,
      );
    },

    ...mapGetters({
      getCurrentTheme: 'themes/getCurrentTheme',
    }),
  },
  created() {
    this.drawerLeft = this.$vuetify.breakpoint.mdAndUp;
  },
  mounted() {
    document.documentElement.style.setProperty('--data-panel-width', `${this.dataPanelWidth}px`);
    // only show when nothing is selected
    const { poi, indicator, search } = this.$route.query;
    if (!poi && !indicator && !search) {
      this.$refs.globalHeader.showText = 'welcome';
      this.$refs.globalHeader.showInfoDialog = true;
    }
  },
  beforeDestroy() {
    this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
  },
  methods: {
    setDataPanelWidth(enable) {
      if (enable) {
        this.dataPanelTemporary = true;
        this.dataPanelFullWidth = true;
      } else {
        this.dataPanelFullWidth = false;
        // TO-DO find more reliable way of checking
        setTimeout(() => { this.dataPanelTemporary = false; }, 500);
      }
    },
    clickMobileClose() {
      this.isDialogRetracted = true;
      this.drawerRight = false;
      this.dialog = false;
      this.$refs.globalHeader.showText = null;
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
      this.$refs.indicatorFilters.comboboxClear();
    },
    close() {
      this.setDataPanelWidth(false);
    },
  },
  watch: {
    dataPanelWidth(val) {
      document.documentElement.style.setProperty('--data-panel-width', `${val}px`);
    },
    indicatorSelected(selected) {
      if (selected) {
        this.drawerRight = true;
        if (!this.$vuetify.breakpoint.mdAndUp) {
          this.dialog = true;
        }
        if (this.$refs.globalHeader.showInfoDialog) {
          this.$refs.globalHeader.showInfoDialog = false;
          this.$refs.globalHeader.showText = null;
        }
      } else {
        this.drawerRight = false;
        this.dialog = false;
      }
      this.$store.commit('indicators/SET_CUSTOM_AREA_INDICATOR', null);
      this.panelKey = Math.random();
    },
    dialog(someIndicatorSelected) {
      if (this.$vuetify.breakpoint.smAndDown) {
        if (!someIndicatorSelected) {
          this.clickMobileClose();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}
::v-deep .theme--light.v-card.v-card--outlined {
  border: 1px solid var(--v-primary-base);
}
::v-deep .v-dialog--fullscreen {
  header,
  header .v-toolbar__content {
    height: auto !important;
  }
  header {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
.preventEllipsis:after {
  content: "\0000a0";
  display: inline-block;
  width: 0;
}
::v-deep .v-navigation-drawer--temporary:not(.v-navigation-drawer--close) {
  box-shadow: none;
}
::v-deep .v-navigation-drawer--temporary {
  z-index: 8;
}
::v-deep .v-navigation-drawer {
  .v-badge {
    min-width: 100% !important;
  }
  .v-badge__badge {
    transform: translateX(-45px);
  }
}

.reopen-right-drawer {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 5;

  .v-icon {
    transition: transform 0.3s linear;
  }
  .open {
    transform: rotate(180deg);
  }
}

::v-deep .retractable {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8;
  width: 100%;

  &.retracted {
    transform: translateY(66vh);
  }

  &.hidden {
    transform: translateY(100vh);
  }

  .v-toolbar__title {
    font-size: 1rem;
    line-height: 1;
  }
}
</style>

<style>
.move-with-panel {
  transform: translateX(0);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.panel-expanded .move-with-panel {
  transform: translateX(calc(-1 * var(--data-panel-width)));
}
</style>
