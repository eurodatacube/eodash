<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    flat
    :color="currentTheme ? currentTheme.color : 'primary'"
    class="global-header white--text"
    v-show="!isFullScreen"
  >
    <v-app-bar-nav-icon
      @click.stop="switchMenu"
      v-if="isMenuButtonActive"
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
      v-show="!isFullScreen"
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

        <v-btn
          block
          text
          color="primary"
          :to="{name: 'landing'}"
        >
          Home
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
        <v-divider></v-divider>
      </template>

    </v-navigation-drawer>

    <!-- mobile menu end -->

    <v-toolbar-title
      v-if="$vuetify.breakpoint.mdAndUp"
      class="text-uppercase mr-5 breadcrumb logo"
      :class="{highlighted: $route.name === 'landing'}"
    >
      <router-link :to="{name: 'landing'}">
        {{ appConfig && appConfig.branding.appName }}
      </router-link>

      <span v-if="currentTheme" class="currentTheme">
        <span class="divider ml-4 mr-5">/</span>

        <router-link :to="{name: currentTheme.slug}"
          class="breadcrumb"
          :class="{highlighted: isThemePageActive}"
        >
          <span>{{ currentTheme.name }}</span>
        </router-link>
      </span>

      <span v-if="$route.name === 'explore'">
        <span class="divider ml-4 mr-5">/</span>

        <router-link :to="{name: 'explore'}"
          class="breadcrumb highlighted"
        >
          <span>Explore</span>
        </router-link>
      </span>
    </v-toolbar-title>

    <slot name="right"></slot>

    <v-spacer></v-spacer>

    <span class="button-group mr-6">
      <v-btn
        text
        dark
        small
        @click="$router.push({ name: 'explore' })"
      >
        Explore
      </v-btn>
    </span>

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

    <img class="header__logo" height="32" :src="appConfig && appConfig.branding.headerLogo" />
  </v-app-bar>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex';

/**
 * A global navbar component that adapts to different environments.
 * @displayName GlobalHeader
 */
export default {
  props: {
    /**
     * Determines whether the header should be hidden.
     * @values true, false
     */
    isFullScreen: {
      type: Boolean,
      default: false,
    },

    /**
     * A callback function when the header needs to do something beyond its scope.
     * @values true, false
     */
    displayShowText: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      drawerLeft: false,
    };
  },
  methods: {
    switchMenu() {
      this.drawerLeft = !this.drawerLeft;
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
        case 'biomass':
        case 'atmospheric-composition':
        case 'water-quality':
        case 'agriculture':
        case 'cryosphere':
          return true;

        default:
          return false;
      }
    },

    isMenuButtonActive() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return true;
        case 'sm': return true;
        case 'md': return false;
        case 'lg': return false;
        case 'xl': return false;

        default: return 'text-h2';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.global-header {
  .breadcrumb {
    border-radius: 4px;
    background: transparent;
    text-transform: none;
    padding: 0;
    font-size: 93%;
    text-decoration: none;
    font-weight: normal;
    color: #FFF;

    span {
      width: 100%;
      text-align: center;
    }

    a {
      text-decoration: none;
      color: #FFF !important;
    }

    &.logo {
      font-size: 110%;
      padding: 3px 7px;
    }

    &.highlighted {
      background: #FFF4;
      padding: 3px 6px;
    }
  }
}

.logo {
  font-size: 1.25rem;
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
</style>
