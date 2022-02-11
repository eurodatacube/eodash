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
    <slot name="left"></slot>

    <v-toolbar-title
      v-if="$vuetify.breakpoint.mdAndUp"
      class="text-uppercase mr-5 breadcrumb logo"
      :class="{highlighted: $route.name === 'landing'}"
    >
      <router-link :to="{name: 'landing'}">
        {{ appConfig && appConfig.branding.appName }}
      </router-link>
 
      <span v-if="currentTheme">
        <span class="divider ml-3 mr-3">/</span>

        <span 
          class="breadcrumb" 
          :class="{highlighted: isThemePageActive}"
        >
          {{ currentTheme.name }}
        </span>
      </span>
    </v-toolbar-title>
    
    <slot name="right"></slot>

    <v-spacer></v-spacer>

    <span class="button-group mr-9">
      <v-btn
        text
        dark
        small
        class="mr-3"
        @click="$router.push({ name: 'explore' })"
        v-if="isThemePageActive"
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
    isFullScreen: {
      type: Boolean,
      default: false,
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
      }

      return false;
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
    font-size: 90%;
    text-decoration: none;
    font-weight: normal;
    color: #FFF;
    text-align: center;

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
      padding: 3px 5px;
    }
  }
}
</style>
