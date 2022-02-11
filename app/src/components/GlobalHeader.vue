<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    flat
    :color="currentTheme ? currentTheme.color : 'primary'"
    class="global-header white--text"
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
    </v-toolbar-title>
    
    <slot name="right"></slot>

    <v-spacer></v-spacer>
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
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    ...mapGetters({
      currentTheme: 'themes/getCurrentTheme',
    }),
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

    a {
      text-decoration: none;
    }

    &.logo {
      font-size: 110%;
    }

    &.highlighted {
      background: #FFF4;
      padding: 3px 7px;
    }
  }
}
</style>
