<template>
  <div class="dashboard fill-height">
    <v-app-bar
      app
      clipped-left
      clipped-right
      flat
      color="primary"
      class="white--text"
      v-show="!isFullScreen"
    >
      <v-app-bar-nav-icon @click.stop="drawerLeft = !drawerLeft" dark />
      <v-toolbar-title
        v-if="$vuetify.breakpoint.mdAndUp"
        class="text-uppercase mr-5"
      >
        {{ appConfig && appConfig.branding.appName }}
      </v-toolbar-title>
      <template v-if="!$vuetify.breakpoint.xsOnly">
        <v-btn
          text
          dark
          small
          @click="displayShowText('welcome')"
        >
          Welcome
        </v-btn>
        <v-btn
          text
          dark
          small
          @click="displayShowText('about')"
        >
          About
        </v-btn>
      </template>
      <v-spacer></v-spacer>
      <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerLeft"
      left
      app
      clipped
      style="overflow: hidden"
      class="drawerLeft"
      v-show="!isFullScreen"
    >
      <template v-if="$vuetify.breakpoint.xsOnly">
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
        <v-divider></v-divider>
      </template>
      <selection-panel style="overflow:hidden" />
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
        height: calc(100% - ${$vuetify.application.top + $vuetify.application.footer}px`"
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
          {{ $store.state.features.allFeatures
              .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
              .properties.indicatorObject.city }},
          {{ $store.state.features.allFeatures
              .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
              .properties.indicatorObject.description }}
          <div v-if="
            $store.state.indicators.selectedIndicator.description !==
            $store.state.indicators.selectedIndicator.indicatorName
            && $store.state.indicators.customAreaIndicator === null"
            class="subheading" style="font-size: 0.8em">
            {{ $store.state.features.allFeatures
              .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
              .properties.indicatorObject.indicatorName }}
          </div>
        </v-toolbar-title>
      </v-toolbar>
      <data-panel
        v-if="$store.state.indicators.selectedIndicator"
        :key="panelKey"
        :newsBanner="$refs.newsBanner"
        :expanded="dataPanelFullWidth" class="px-5" />
      <template v-else>
        <Welcome v-if="showText === 'welcome'" />
        <About v-else-if="showText === 'about'" />
      </template>
    </v-navigation-drawer>
    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown"
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
          {{ showText }}
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
          {{ $store.state.features.allFeatures
              .find(f => getLocationCode(f.properties.indicatorObject) === $route.query.poi)
              .properties.indicatorObject.indicatorName }}
        </h4>
        <data-panel
          v-if="$store.state.indicators.selectedIndicator"
          :newsBanner="$refs.newsBanner"
          :expanded="dataPanelFullWidth" class="fill-height" />
        <template v-else>
          <Welcome v-if="showText === 'welcome'" style="padding-bottom: 135px !important" />
          <About v-else-if="showText === 'about'" style="padding-bottom: 100px !important" />
        </template>
      </div>
    </v-dialog>
    <v-content style="height: 100vh; height: calc(var(--vh, 1vh) * 100); overflow:hidden"
      :style="$vuetify.breakpoint.mdAndUp && 'width: 60%;'"
    >
      <v-container
        class="fill-height pa-0"
        fluid
      >
        <v-row class="fill-height">
          <v-col
            cols="12"
            class="pt-0 fill-height"
          >
            <center-panel />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <global-footer v-if="!isFullScreen"/>
  </div>
</template>

<script>
import Welcome from '@/views/Welcome.vue';
import About from '@/views/About.vue';
import Banner from '@/components/Banner.vue';
import SelectionPanel from '@/components/SelectionPanel.vue';
import CenterPanel from '@/components/CenterPanel.vue';
import DataPanel from '@/components/DataPanel.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import closeMixin from '@/mixins/close';
import dialogMixin from '@/mixins/dialogMixin';
import { mapState } from 'vuex';

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
    SelectionPanel,
    CenterPanel,
    DataPanel,
    GlobalFooter,
  },
  props: {
    source: String,
  },
  mixins: [closeMixin, dialogMixin],
  data: () => ({
    drawerLeft: true,
    drawerRight: false,
    dialog: false,
    showText: null,
    dataPanelFullWidth: false,
    dataPanelTemporary: false,
    panelKey: 0,
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
  },
  created() {
    this.drawerLeft = this.$vuetify.breakpoint.mdAndUp;
    this.drawerRight = this.$vuetify.breakpoint.mdAndUp;
    if (!this.$vuetify.breakpoint.mdAndUp) {
      this.dialog = true;
    }
  },
  mounted() {
    this.fixFullHeight();
    window.addEventListener('resize', () => {
      this.fixFullHeight();
    });
    setTimeout(() => {
      // only show when no poi is selected
      if (!this.$route.query.poi) {
        this.showText = 'welcome';
        this.drawerRight = true;
      }
    }, 2000);
  },
  methods: {
    fixFullHeight() {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
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
      this.drawerRight = false;
      this.dialog = false;
      this.showText = null;
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
    },
    displayShowText(text) {
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
      this.drawerRight = true;
      if (!this.$vuetify.breakpoint.mdAndUp) {
        this.dialog = true;
      }
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
</style>
