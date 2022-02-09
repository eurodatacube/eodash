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
          <div class="mt-16 d-flex flex-column justify-start align-center">
            <stories-grid />
          </div>
        </div>

        <v-container
          class="ma-0 pt-16 pb-16 d-flex flex-row"
          style="max-width: 1300px;"
        >
          <v-row no-gutters class="button-row" style="z-index: 1000;">
            <template>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <div class="d-flex flex-column pb-8 pb-md-0 pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8">
                  <h3 class="text-h3 mb-10">Explore Datasets</h3>

                  <p class="mb-10" style="font-size: 18px;">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>

                  <v-btn
                    elevation="1"
                    class="py-2 white--text"
                    block
                    color="primary"
                    large
                  >Explore</v-btn>
                </div>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <img src="@/assets/datasets.jpg" width="100%" class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8">
              </v-col>
            </template>
          </v-row>
        </v-container>
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
