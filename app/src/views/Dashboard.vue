<template>
  <div class="dashboard fill-height">
    <global-header
      :isFullscreen="isFullScreen"
      :displayShowText="displayShowText"
    />
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.xsOnly"
      v-model="drawerLeft"
      left
      app
      clipped
      width="300px"
      style="overflow: hidden"
      class="drawerLeft"
      v-show="!isFullScreen"
    >
      <v-list-item style="background: var(--v-primary-base)">
        <v-list-item-content>
          <h3 class="text-uppercase white--text">
            {{ appConfig && appConfig.branding.appName }}
          </h3>
        </v-list-item-content>
        <v-list-item-action
          class="align-center"
        >
          <v-icon
            style="position: absolute;"
            color="white"
            small
            dark
            @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            {{
              $vuetify.theme.dark
                ? 'mdi-white-balance-sunny'
                : 'mdi-weather-night'
            }}
          </v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-divider></v-divider>

      <v-btn
        block
        text
        color="primary"
        to="/"
      >
        Start
      </v-btn>
      <v-btn
        block
        text
        color="primary"
        @click="displayShowText('welcome')"
      >
        Welcome
      </v-btn>
      <v-btn
        block
        text
        color="primary"
        @click="displayShowText('about')"
      >
        About
      </v-btn>
      <v-badge
        bordered
        color="info"
        :content="$store.state.dashboard.dashboardConfig
          && $store.state.dashboard.dashboardConfig.features.length"
        :value="$store.state.dashboard.dashboardConfig
          && $store.state.dashboard.dashboardConfig.features.length"
        overlap
      >
        <v-btn
          v-if="$store.state.dashboard.dashboardConfig"
          block
          text
          color="primary"
          to="/dashboard"
        >
          Custom Dashboard
        </v-btn>
      </v-badge>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="drawerRight"
      right
      stateless
      app
      clipped
      temporary
      hide-overlay
      :width="dataPanelFullWidth ? '100%' : '40%'"
      :style="`margin-top: ${$vuetify.application.top}px;
        height: calc(100% - ${$vuetify.application.top + $vuetify.application.footer}px;`"
      class="data-panel"
    >
      <banner v-if="currentNews" ref="newsBanner" />
      <v-toolbar v-if="$store.state.indicators.selectedIndicator" flat>
        <v-btn v-if="dataPanelFullWidth" icon @click="setDataPanelWidth(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-else icon @click="setDataPanelWidth(true)">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$store.state.indicators.selectedIndicator"
          :class="$store.state.indicators.selectedIndicator.description ===
            $store.state.indicators.selectedIndicator.indicatorName && 'preventEllipsis'"
        >
          {{ queryIndicatorObject && queryIndicatorObject.properties.indicatorObject.city }},
          {{ queryIndicatorObject && queryIndicatorObject.properties.indicatorObject.description }}
          <div v-if="
            $store.state.indicators.selectedIndicator.description !==
            $store.state.indicators.selectedIndicator.indicatorName
            && $store.state.indicators.customAreaIndicator === null"
            class="subheading" style="font-size: 0.8em">
            {{ queryIndicatorObject
              && queryIndicatorObject.properties.indicatorObject.indicatorName }}
          </div>
        </v-toolbar-title>
      </v-toolbar>

      <data-panel
        v-if="$store.state.indicators.selectedIndicator"
        :key="panelKey"
        :newsBanner="$refs.newsBanner"
        :expanded="dataPanelFullWidth" class="px-5" />
    </v-navigation-drawer>
    <div
      v-if="$vuetify.breakpoint.mdAndUp && !!this.$route.query.poi && indicatorSelected"
      class="reopen-right-drawer"
    >
        <v-btn
          icon
          style="background: #d8d8d8"
          @click="drawerRight = !drawerRight"
        >
          <v-icon :class="{open: drawerRight}">mdi-arrow-left</v-icon>
        </v-btn>
      </div>
    <v-dialog
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      style="overflow:hidden"
      v-show="!isFullScreen"
    >
      <v-toolbar dark color="primary">
        <v-toolbar-title style="overflow: unset; white-space: pre-wrap;"
          v-if="$store.state.indicators.selectedIndicator"
        >{{ $store.state.indicators.selectedIndicator.city }},
          {{ $store.state.indicators.selectedIndicator.description }}
        </v-toolbar-title>
        <v-toolbar-title v-else class="text-capitalize">
          {{ showText ? showText : '' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="showText === 'welcome'
            && $vuetify.breakpoint.smAndDown
            && !$store.state.indicators.selectedIndicator"
          @click="clickMobileClose"
          color="secondary"
        >
          <v-icon left>mdi-arrow-right</v-icon>
          Start exploring!
        </v-btn>
        <v-btn v-else icon dark @click="clickMobileClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div
        class="scrollContainer data-panel"
        :style="{background: $vuetify.theme.themes[theme].background}"
      >

        <banner v-if="currentNews" />

        <h4 v-if="
            ($store.state.indicators.selectedIndicator && (
              $store.state.indicators.selectedIndicator.description !==
              $store.state.indicators.selectedIndicator.indicatorName))"
          class="px-4 py-2"
        >
          {{ queryIndicatorObject
            && queryIndicatorObject.properties.indicatorObject.indicatorName }}
        </h4>
        <data-panel
          v-if="$store.state.indicators.selectedIndicator"
          :newsBanner="$refs.newsBanner"
          :expanded="dataPanelFullWidth" class="fill-height" />
      </div>
    </v-dialog>

    <div
      class="retractable"
      :class="{
        'retracted': isDialogRetracted,
        'hidden': !$store.state.indicators.selectedIndicator,
      }"
      v-else
    >
      <v-toolbar dark color="primary">
        <v-toolbar-title style="overflow: unset; white-space: pre-wrap;"
          v-if="$store.state.indicators.selectedIndicator"
        >{{ $store.state.indicators.selectedIndicator.city }},
          {{ $store.state.indicators.selectedIndicator.description }}
        </v-toolbar-title>
        <v-toolbar-title v-else class="text-capitalize">
          {{ showText ? showText : '' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="showText === 'welcome'
            && $vuetify.breakpoint.smAndDown
            && !$store.state.indicators.selectedIndicator"
          @click="clickMobileClose"
          color="secondary"
        >
          <v-icon left>mdi-arrow-right</v-icon>
          Start exploring!
        </v-btn>
        <template v-else>
          <v-btn icon dark @click="() => isDialogRetracted = !isDialogRetracted">
            <v-icon>mdi-chevron-{{isDialogRetracted ? 'up' : 'down'}}</v-icon>
          </v-btn>

          <v-btn icon dark @click="clickMobileClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <div
        class="scrollContainer data-panel"
        :style="{background: $vuetify.theme.themes[theme].background}"
      >

        <banner v-if="currentNews" />

        <h4 v-if="
            ($store.state.indicators.selectedIndicator && (
              $store.state.indicators.selectedIndicator.description !==
              $store.state.indicators.selectedIndicator.indicatorName))"
          class="px-4 py-2"
        >
          {{ queryIndicatorObject
            && queryIndicatorObject.properties.indicatorObject.indicatorName }}
        </h4>
        <data-panel
          v-if="$store.state.indicators.selectedIndicator"
          :newsBanner="$refs.newsBanner"
          :expanded="dataPanelFullWidth" class="fill-height" />
      </div>
    </div>

    <v-dialog
      v-model="showInfoDialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      class="info-dialog"
      width="80vw"
    >
      <template>
        <div
          class="d-flex justify-between px-7 py-4"
          width="100%"
          style="justify-content: space-between; align-items: center;"
          :style="{background: this.$vuetify.theme.dark ? 'var(--v-grey-darken4)' : '#CED9E0'}"
        >
          <span class="font-medium text-h6 text-capitalize">
            {{ showText }}
          </span>
          <v-btn
            color="secondary"
            @click="() => showInfoDialog = false"
          >
            <span v-if="!$vuetify.breakpoint.xsOnly">Start Exploring!</span>
            <v-icon :right="!$vuetify.breakpoint.xsOnly">mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <Welcome v-if="showText === 'welcome'" />
        <About v-else-if="showText === 'about'" />
      </template>
    </v-dialog>

    <v-content
      :style="`height: 100vh; height: calc((var(--vh, 1vh) * 100) + ${$vuetify.application.top
        + $vuetify.application.footer}px); overflow:hidden; ${$vuetify.breakpoint.mdAndUp
        && (this.drawerRight ? 'width: 60%;' : 'width: 100%;')}`"
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
            <center-panel />
            <div
              class="d-flex justify-start"
              style="position: absolute; top: 0; width: 100%; pointer-events: none"
            >
              <indicator-filters />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <global-footer
      v-if="!isFullScreen"
      :color="getCurrentTheme ? getCurrentTheme.color : 'primary'"
    />
  </div>
</template>

<script>
import Welcome from '@/views/Welcome.vue';
import About from '@/views/About.vue';
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
    Welcome,
    About,
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
    showText: null,
    dataPanelFullWidth: false,
    dataPanelTemporary: false,
    panelKey: 0,
    showInfoDialog: false,
    isDialogRetracted: true,
  }),
  computed: {
    appConfig() {
      return this.$store.state.config.appConfig;
    },
    indicatorSelected() {
      return this.$store.state.indicators.selectedIndicator;
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
    ...mapState(['isFullScreen']),
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

    if (!this.$vuetify.breakpoint.mdAndUp) {
      this.showInfoDialog = true;
    }
  },
  mounted() {
    setTimeout(() => {
      // only show when no poi is selected
      if (!this.$route.query.poi) {
        this.showText = 'welcome';
        this.showInfoDialog = true;
      }
    }, 2000);
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
      this.showText = null;
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
    },
    displayShowText(text) {
      this.showInfoDialog = true;
      this.showText = text;
    },
    close() {
      this.setDataPanelWidth(false);
    },
  },
  watch: {
    indicatorSelected(selected) {
      if (selected) {
        this.drawerRight = true;
        if (!this.$vuetify.breakpoint.mdAndUp) {
          this.dialog = true;
        }
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
  top: 77px;
  right: 60px;
  z-index: 9011;

  .v-icon {
    transition: transform 0.3s linear;
  }
}

.open {
  transform: rotate(180deg);
}

.retractable {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;

  &.retracted {
    transform: translateY(66vh);
  }

  &.hidden {
    transform: translateY(100vh);
  }
}
</style>
