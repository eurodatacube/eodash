<template>
  <div
    class="fill-height pa-10"
    style="padding-top: 85px !important;"
  >
   <v-app-bar
      app
      clipped-left
      clipped-right
      flat
      color="primary"
      class="white--text"
    >
      <router-link to="/" class="white--text" style="text-decoration: none">
      <v-toolbar-title
        v-if="$vuetify.breakpoint.mdAndUp"
        class="text-uppercase mr-5"
      >
        {{ appConfig && appConfig.branding.appName }}
      </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
    </v-app-bar>
    <v-row class="d-flex fill-height">
      <v-col
        cols="12"
        class="d-flex align-center justify-center fill-height"
      >
        <div class="text-center">
          <h1 class="display-3 font-weight-light mt-5 mb-5 primary--text">404</h1>
          <h1 class="display-1 font-weight-light mt-5 mb-5 primary--text">Page not found</h1>
          <p class="mt-5 mb-5">The page you requested was not found.</p>
          <p>Go back to the <router-link to="/" >Dashboard</router-link></p>
        </div>
      </v-col>
    </v-row>
    <global-footer />
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import GlobalFooter from '@/components/GlobalFooter.vue';

export default {
  components: {
    GlobalFooter,
  },
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}
</style>
