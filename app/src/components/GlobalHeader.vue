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
      v-if="$route.name === 'explore'" 
      @click.stop="onMenuPressed" 
      dark 
    />

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

        <span 
          class="breadcrumb highlighted" 
        >
          <span>Explore</span>
        </span>
      </span>
    </v-toolbar-title>
    
    <slot name="right"></slot>

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
        text
        dark
        small
        to="/dashboard"
      >
        Custom Dashboard
      </v-btn>
    </v-badge>

    <v-spacer></v-spacer>

    <span class="button-group mr-9">
      <v-btn
        text
        dark
        small
        class="mr-3"
        @click="$router.push({ name: 'explore' })"
        v-if="isThemePageActive || $route.name === 'landing'"
      >
        Explore
      </v-btn>
    </span>

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
     * A callback function that is executed when the user presses the menu button.
     */
    onMenuPressed: {
      type: Function,
      default: () => {},
    }
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
          return false
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
</style>
