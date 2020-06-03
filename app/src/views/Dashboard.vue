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
      <v-spacer></v-spacer>
      <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerLeft"
      left
      app
      clipped
      style="overflow: hidden"
    >
      <selection-panel style="overflow:hidden" />
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
      <v-toolbar v-if="$store.state.indicators.selectedIndicator" flat>
        <v-btn v-if="dataPanelFullWidth" icon @click="setDataPanelWidth(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-else icon @click="setDataPanelWidth(true)">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$store.state.indicators.selectedIndicator">
          {{ $store.state.indicators.selectedIndicator['City'] }},
          {{ $store.state.indicators.selectedIndicator.Description }}
          <div v-if="
            $store.state.indicators.selectedIndicator.Description !==
            $store.state.indicators.selectedIndicator['Indicator Name']"
            class="subheading" style="font-size: 0.8em">
            {{ $store.state.indicators.selectedIndicator['Indicator Name'] }}
          </div>
        </v-toolbar-title>
      </v-toolbar>
      <data-panel
        v-if="$store.state.indicators.selectedIndicator"
        :expanded="dataPanelFullWidth" class="px-5" />
      <template v-else>
        <Welcome v-if="showText === 'welcome'" />
        <About v-else-if="showText === 'about'" />
        <Privacy v-else-if="showText === 'privacy'" />
      </template>
    </v-navigation-drawer>
    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="drawerRight"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      style="overflow:hidden"
    >
      <v-toolbar dark color="primary">
        <v-toolbar-title style="overflow: unset; white-space: pre-wrap;"
          v-if="$store.state.indicators.selectedIndicator"
        >{{ $store.state.indicators.selectedIndicator['City'] }},
          {{ $store.state.indicators.selectedIndicator.Description }}
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
      <div class="scrollContainer">

        <h4 v-if="
            ($store.state.indicators.selectedIndicator && (
              $store.state.indicators.selectedIndicator.Description !==
              $store.state.indicators.selectedIndicator['Indicator Name']))"
          class="px-4 py-2"
        >
          {{ $store.state.indicators.selectedIndicator['Indicator Name'] }}
        </h4>
        <data-panel
          v-if="$store.state.indicators.selectedIndicator"
          :expanded="dataPanelFullWidth" class="fill-height" />
        <template v-else>
          <Welcome v-if="showText === 'welcome'" style="padding-bottom: 135px !important" />
          <About v-else-if="showText === 'about'" style="padding-bottom: 100px !important" />
          <Privacy v-else-if="showText === 'privacy'" style="padding-bottom: 100px !important" />
        </template>
      </div>
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
    <v-footer
      app
      color="primary"
      class="d-flex justify-center align-center white--text text-center"
      style="z-index: 5"
      :height="$vuetify.breakpoint.xsOnly ? '60px' : '40px'"
    >
        <v-spacer></v-spacer>
        <small>
          <a href="https://eurodatacube.com" target="_blank" class="white--text mx-1">EDC</a>
          <span>service for</span>
          <a href="https://earth.esa.int" target="_blank" class="white--text mx-1">ESA</a>
          <span> | </span>
          <a href=" " target="_blank" class="white--text">Disclaimer</a>
          <span> | </span>
          <a href="https://eox.at/impressum/" target="_blank" class="white--text">Legal</a>
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
        <v-btn
          dark
          small
          color="secondary"
          class="ml-1"
          @click="showFeedbackDialog = true"
        >Feedback</v-btn>
    </v-footer>
    <v-dialog
      v-model="showFeedbackDialog"
      width="80%"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      :hide-overlay="$vuetify.breakpoint.xsOnly"
      transition="dialog-bottom-transition"
    >
      <v-toolbar v-if="$vuetify.breakpoint.xsOnly" dark color="primary">
        <v-toolbar-title>How can we improve eodash?
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="showFeedbackDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card :class="$vuetify.breakpoint.mdAndUp && 'pa-5'"
        style="overflow-y: auto; height: 100%;">
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
import Welcome from '@/views/Welcome.vue';
import About from '@/views/About.vue';
import Privacy from '@/views/Privacy.vue';
import Feedback from '@/views/Feedback.vue';
import SelectionPanel from '@/components/SelectionPanel.vue';
import CenterPanel from '@/components/CenterPanel.vue';
import DataPanel from '@/components/DataPanel.vue';

// import backButton from '@/mixins/backButton';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  components: {
    Welcome,
    About,
    Privacy,
    Feedback,
    SelectionPanel,
    CenterPanel,
    DataPanel,
  },
  props: {
    source: String,
  },
  // mixins: [
  //   backButton(['showFeedbackDialog', 'drawerRight']),
  // ],
  data: () => ({
    drawerLeft: true,
    drawerRight: false,
    showText: null,
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
    // push to router history so back button interception works
    // this.$router.push('/').catch(err => {}); // eslint-disable-line
  },
  mounted() {
    setTimeout(() => {
      // only show when no poi is selected
      if (!this.$route.query.poi) {
        this.showText = 'welcome';
        this.drawerRight = true;
      }
    }, 2000);
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
      this.showText = null;
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
    },
    displayShowText(text) {
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
      this.drawerRight = true;
      this.showText = text;
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
</style>
