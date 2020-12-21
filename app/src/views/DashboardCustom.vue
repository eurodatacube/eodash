<template>
  <div class="dashboard fill-height">
    <v-app-bar
      app
      clipped-left
      clipped-right
      flat
      color="primary"
      class="white--text"
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
        <v-btn
          text
          dark
          small
          to="/dashboard"
        >
          Custom Dashboard
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
        <v-btn
          block
          text
          color="primary"
          to="/dashboard"
        >
          Custom Dashboard
        </v-btn>
        <v-divider></v-divider>
      </template>
    </v-navigation-drawer>

    <v-content style="height: 100vh; height: calc(var(--vh, 1vh) * 100); overflow:hidden"
    >
      <v-container
        class="fill-height pa-0"
        fluid
      >
        <v-row class="fill-height">
          <v-col
            cols="12"
            class="pt-0 fill-height scrollContainer"
          >
            <custom-dashboard-grid />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer
      app
      color="primary"
      class="d-flex justify-center align-center white--text text-center"
      style="z-index: 5"
      :height="$vuetify.breakpoint.xsOnly ? '60px' : '40px'"
    >
      <v-tooltip top v-if="$vuetify.breakpoint.smAndUp">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="white"
            small
            dark
            class="mr-2"
            v-bind="attrs"
            v-on="on"
            @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            {{
              $vuetify.theme.dark
                ? 'mdi-white-balance-sunny'
                : 'mdi-weather-night'
            }}
          </v-icon>
        </template>
        <span>Enable {{ $vuetify.theme.dark ? 'light' : 'dark' }} mode</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <small>
        <a href="https://eurodatacube.com" target="_blank" class="white--text mx-1">EDC</a>
        <span>service for</span>
        <a href="https://earth.esa.int" target="_blank" class="white--text mx-1">ESA</a>
        <span> | </span>
        <a href="terms_and_conditions" target="_blank" class="white--text">Legal</a>
        <span> | </span>
        <a href="/privacy" target="_blank" class="white--text">Privacy</a>
      </small>
      <v-spacer></v-spacer>
      <small class="justify-right">
        <a href="https://github.com/eurodatacube/eodash" target="_blank" class="white--text">eodash</a>
        <span> v{{ `${$store.getters.appVersion
          .split('.')[0]}.${$store.getters.appVersion
          .split('.')[1]}` }} by</span>
        <a href="https://eox.at" target="_blank" class="white--text mx-1">
          <img :src="require('@/assets/EOX_Logo_weiss.svg')" height="11px" class="my-0" />
        </a>
      </small>
      <feedback-button />
    </v-footer>
  </div>
</template>

<script>
import Welcome from '@/views/Welcome.vue';
import About from '@/views/About.vue';
import FeedbackButton from '@/components/FeedbackButton.vue';
import SelectionPanel from '@/components/SelectionPanel.vue';
import CustomDashboardGrid from '@/components/CustomDashboardGrid.vue';
import closeMixin from '@/mixins/close';
import dialogMixin from '@/mixins/dialogMixin';

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
    FeedbackButton,
    SelectionPanel,
    CustomDashboardGrid,
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
  background: white;
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

<style lang="scss" scoped>
  .scrollContainer {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }
</style>
