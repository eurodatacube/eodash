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
      <v-btn text dark small @click="showAboutDialog = true">About</v-btn>
      <v-btn text dark small @click="showFeedbackDialog = true">Feedback</v-btn>
      <v-spacer></v-spacer>
      <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerLeft"
      left
      app
      clipped
    >
      <selection-panel />
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="drawerRight"
      right
      app
      clipped
      :temporary="dataPanelTemporary"
      :width="dataPanelFullWidth ? '100%' : '40%'"
    >
      <v-toolbar flat>
        <v-btn v-if="dataPanelFullWidth" icon @click="setDataPanelWidth(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-else icon @click="setDataPanelWidth(true)">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$store.state.indicators.selectedIndicator">
          {{ $store.state.indicators.selectedIndicator['City'] }},
          {{ $store.state.indicators.selectedIndicator.Description }}
        </v-toolbar-title>
      </v-toolbar>
      <data-panel :expanded="dataPanelFullWidth" class="px-5" />
    </v-navigation-drawer>
    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="drawerRight"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-toolbar dark color="primary">
        <v-toolbar-title v-if="$store.state.indicators.selectedIndicator">
          {{ $store.state.indicators.selectedIndicator['City'] }},
          {{ $store.state.indicators.selectedIndicator.Description }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="clickMobileClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <data-panel class="fill-height" />
    </v-dialog>
    <v-content style="height: 100vh; overflow:hidden;">
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
    <v-btn
      v-if="!showFeedbackDialog && $vuetify.breakpoint.smAndUp"
      fixed
      dark
      rounded
      bottom
      x-large
      right
      color="#ff8100"
      style="z-index:999; bottom: 50px"
      @click="showFeedbackDialog = true"
    >
      <v-icon left>mdi-tooltip-edit-outline</v-icon> Feedback
    </v-btn>
    <v-footer app color="primary" class="d-flex justify-center align-center white--text"
     style="z-index: 5">
        <v-spacer></v-spacer>
        <small>
          <a href="https://eurodatacube.com" target="_blank" class="white--text mx-1">EDC</a>
          <span>service for</span>
          <a href="https://earth.esa.int" target="_blank" class="white--text mx-1">ESA</a>
          <span> | </span>
          <a href=" " target="_blank" class="white--text">Disclaimer</a>
          <span> | </span>
          <a href="https://eox.at/impressum/" target="_blank" class="white--text">Legal Notice</a>
          <span> | </span>
          <a href="https://eox.at/privacy-notice" target="_blank" class="white--text">Privacy Notice</a>
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
    </v-footer>
    <v-dialog
      v-model="showAboutDialog"
      width="80%"
    >
      <v-card>
        <v-card-title>
          <span class="headline">About</span>
        </v-card-title>
        <v-card-text>
          <About />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showAboutDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showFeedbackDialog"
      width="80%"
    >
      <v-card class="pa-5">
        <v-card-text>
          <Feedback />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showFeedbackDialog = false">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import About from '@/views/About.vue';
import Feedback from '@/views/Feedback.vue';
import SelectionPanel from '@/components/SelectionPanel.vue';
import CenterPanel from '@/components/CenterPanel.vue';
import DataPanel from '@/components/DataPanel.vue';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  components: {
    About,
    Feedback,
    SelectionPanel,
    CenterPanel,
    DataPanel,
  },
  props: {
    source: String,
  },
  data: () => ({
    drawerLeft: true,
    drawerRight: false,
    showAboutDialog: false,
    showFeedbackDialog: false,
    dataPanelFullWidth: false,
    dataPanelTemporary: false,
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
    // this.$vuetify.theme.dark = true;
    this.drawerLeft = this.$vuetify.breakpoint.mdAndUp;
    this.drawerRight = this.$vuetify.breakpoint.mdAndUp;
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
      this.drawerRight = false;
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
    },
  },
  watch: {
    indicatorSelected(selected) {
      if (selected) {
        this.drawerRight = true;
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
</style>
