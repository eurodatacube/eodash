<template>
  <div
    class="fill-height scrollContainer"
  >
    <div
      class="px-3"
    >
      <v-app-bar
        app
        clipped-left
        clipped-right
        flat
        color="primary"
        class="white--text appbar"
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
      <v-row class="landing-page" justify="center">
        <hero />
        <div class="section pb-16">
          <theme-navigation />
          <div class="mx-lg-16 px-lg-16 mt-16 d-flex flex-column justify-start align-center">
            <stories-grid />
          </div>
        </div>
      </v-row>
      <global-footer />
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import GlobalFooter from '@/components/GlobalFooter.vue';

import Hero from '@/components/ThemesLandingPage/Hero.vue';
import ThemeNavigation from '@/components/ThemesLandingPage/ThemeNavigation.vue';
import StoriesGrid from '@/components/ThemesLandingPage/StoriesGrid.vue';

export default {
  components: {
    GlobalFooter,
    Hero,
    ThemeNavigation,
    StoriesGrid,
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
.landing-page {
  width: 100vw;
}
.section {
  min-height: 70vh;
  min-width: 100vw;

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
}

.appbar {
  z-index: 30;
}
</style>
