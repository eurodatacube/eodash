<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    flat
    :color="currentTheme ? currentTheme.color : 'primary'"
    class="white--text"
    :style="`z-index: 8; ${appConfig.id === 'esa'
      ? `box-shadow: 0px 4px var(--v-secondary-base) !important`
      : ''}`"
  >
    <v-app-bar-nav-icon
      @click.stop="switchMenu"
      v-if="$vuetify.breakpoint.smAndDown"
      dark
    />

    <!-- mobile menu -->

    <v-navigation-drawer
      v-model="drawerLeft"
      left
      app
      clipped
      style="overflow: hidden;"
      class="drawerLeft"
      hide-overlay
      width="70vw"
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <template>
        <v-list-item style="background: var(--v-primary-base)">
          <v-list-item-content>
            <h3 class="logo text-uppercase white--text">
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

        <theme-navigation
          class="mb-6"
          v-if="appConfig.enableStories"
        />

        <v-btn
          block
          text
          color="primary"
          to="/"
        >
          Home
        </v-btn>
        <v-btn
          v-if="$route.name === 'explore'"
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
          v-if="$route.name !== 'explore' && (appConfig && appConfig.enableStories)"
          text
          color="primary"
          block
          :to="{ name: 'explore' }"
        >
          Explore Datasets
      </v-btn>

        <v-badge
          v-if="$store.state.dashboard.dashboardConfig"
          bordered
          color="secondary"
          :content="$store.state.dashboard.dashboardConfig
            && $store.state.dashboard.dashboardConfig.features.length"
          :value="$store.state.dashboard.dashboardConfig
            && $store.state.dashboard.dashboardConfig.features.length"
          overlap
        >
          <v-btn
            block
            text
            color="primary"
            to="/dashboard"
          >
            Custom Dashboard
          </v-btn>
        </v-badge>

        <v-dialog
          v-model="showNewsletterModal"
          :width="$vuetify.breakpoint.xsOnly ? '100%' : '50%'"
          transition="dialog-bottom-transition"
          style="z-index: 9999;"
          v-if="appConfig && appConfig.showNewsletterButton"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="my-4 flex-grow-1 d-flex newsletter-button"
              color="secondary"
              dark
              tile
              block
              v-bind="attrs"
              v-on="on"
              @click="d => { showNewsletterModal = true }"
            >
              Get our newsletter
            </v-btn>
          </template>

          <modal
            title="Subscribe to our newsletter"
            @submit="d => { showNewsletterModal = false }"
            @close="d => { showNewsletterModal = false }"
          />
        </v-dialog>
      </template>

    </v-navigation-drawer>

    <!-- mobile menu end -->

    <v-toolbar-title
      v-if="$vuetify.breakpoint.mdAndUp"
    >
      <v-btn
        text
        dark
        class="logo"
        :class="{'no-highlight': !appConfig.enableStories}"
        to="/"
        exact
      >
        {{ appConfig && appConfig.branding.appName }}
      </v-btn>
    </v-toolbar-title>

    <template v-if="currentTheme">
      <v-icon dark class="mx-2">mdi-chevron-right</v-icon>

      <v-tooltip right close-delay="1000" nudge-left="20">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            dark
            small
            :class="{'no-highlight': !appConfig.enableStories}"
            v-bind="attrs"
            v-on="on"
            :to="{name: currentTheme.slug}"
          >
            {{ currentTheme.name }}
          </v-btn>
        </template>
        <v-btn
          v-if="$route.name === 'explore'"
          small
          text
          dark
          class="rounded closebutton"
          @click="loadTheme(null)"
        >
          <v-icon
            dark
            small
            left
            color="white"
          >
            mdi-close
          </v-icon>
          <small>clear</small>
        </v-btn>
      </v-tooltip>
    </template>

    <template v-if="$route.name === 'explore' && appConfig.storiesEnabled">
      <v-icon dark class="mx-2">mdi-chevron-right</v-icon>
      <v-btn
        text
        dark
        small
        :class="{'no-highlight': !appConfig.enableStories}"
        :to="{name: 'explore'}"
      >
        Datasets
      </v-btn>
    </template>

    <v-spacer v-if="appConfig && appConfig.enableStories"></v-spacer>

    <span v-if="$vuetify.breakpoint.mdAndUp">
      <v-btn
        v-if="$route.name === 'explore'"
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
    </span>

    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-btn
        v-if="$route.name != 'explore' && (appConfig && appConfig.enableStories)"
        text
        dark
        small
        :to="{ name: 'explore' }"
      >
        Explore Datasets
      </v-btn>

      <v-badge
        class="mr-6"
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
          text
          dark
          small
          to="/dashboard"
        >
          Custom Dashboard
        </v-btn>
      </v-badge>
    </template>

    <v-spacer v-if="!(appConfig && appConfig.enableStories)"></v-spacer>

    <v-dialog
      v-model="showNewsletterModal"
      :width="$vuetify.breakpoint.xsOnly ? '100%' : '50%'"
      transition="dialog-bottom-transition"
      style="z-index: 9999;"
      v-if="appConfig
              && appConfig.showNewsletterButton
              && $vuetify.breakpoint.mdAndUp"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mr-8"
          color="secondary"
          dark
          v-bind="attrs"
          v-on="on"
          @click="d => { showNewsletterModal = true }"
        >
          Get our newsletter
        </v-btn>
      </template>

      <modal
        title="Subscribe to our newsletter"
        @close="d => { showNewsletterModal = false }"
      />
    </v-dialog>

    <v-dialog
      v-model="showInfoDialog"
      class="info-dialog"
      width="90vw"
      max-width="1000"
    >
      <template>
        <div
          class="d-flex justify-between px-7 pt-4"
          width="100%"
          style="justify-content: space-between; align-items: center;"
          :style="{background: $vuetify.theme.currentTheme.background}"
        >
          <span class="font-medium text-h6 text-capitalize mb-2 mb-sm-0">
            {{ showText === 'welcome'
              ? `Welcome to ${appConfig.branding.shortName || appConfig.branding.appName}!`
              : showText }}
          </span>
          <v-btn
            v-if="$vuetify.breakpoint.smAndUp"
            color="secondary"
            @click="() => showInfoDialog = false"
          >
            <span>Explore the dashboard!</span>
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            v-else
            color="primary"
            icon
            @click="() => showInfoDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <Welcome v-if="showText === 'welcome'" class="pt-4" />
        <About v-else-if="showText === 'about'" />

        <div
          v-if="$vuetify.breakpoint.xsOnly"
          class="px-7 pb-4"
          :style="{background: $vuetify.theme.currentTheme.background}"
        >
          <v-btn
            block
            color="secondary"
            @click="() => showInfoDialog = false"
          >
            <span>Explore the dashboard!</span>
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </template>
    </v-dialog>

    <img height="32" :src="appConfig && appConfig.branding.headerLogo" />
  </v-app-bar>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';

import ThemeNavigation from './ThemesLandingPage/ThemeNavigation.vue';
import Modal from './Modal.vue';
import About from '@/views/About.vue';
import Welcome from '@/views/Welcome.vue';

/**
 * A global navbar component that adapts to different environments.
 * @displayName GlobalHeader
 */
export default {
  props: {
    /**
     * Another callback allowing us to switch the Dashboard drawer from this component.
     */
    switchDrawer: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    ThemeNavigation,
    Modal,
    About,
    Welcome,
  },
  data() {
    return {
      drawerLeft: false,
      hasNewsletterSubscription: false,
      showNewsletterModal: false,
      showInfoDialog: null,
      showText: 'welcome',
    };
  },
  methods: {
    ...mapActions({
      loadTheme: 'themes/loadTheme',
    }),

    switchMenu() {
      this.drawerLeft = !this.drawerLeft;
    },

    displayShowText(text) {
      this.showInfoDialog = true;
      this.showText = text;
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    ...mapGetters({
      currentTheme: 'themes/getCurrentTheme',
    }),

    isThemePageActive() {
      switch (this.$route.name) {
        case 'ocean':
        case 'biomass-and-landcover':
        case 'atmosphere':
        case 'water-quality':
        case 'agriculture':
        case 'cryosphere':
          return true;

        default:
          return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  font-size: 1.25rem;
  letter-spacing: initial;
  font-weight: initial;
}

.drawerLeft {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
}

.drawerLeft, .drawerLeft * {
  z-index: 13 !important;
}

// This CSS setting makes tooltips clickable within this component.
.v-tooltip__content {
  pointer-events: initial;
  background: transparent;

  .closebutton {
    background: rgba(255, 255, 255, 0.2);
  }
}

.no-highlight {
  padding: 0;

  &::before {
    background-color: transparent !important;
  }
}
</style>
