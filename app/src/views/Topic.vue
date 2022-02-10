<template>
  <div
    class="fill-height scrollContainer"
    :class="$vuetify.breakpoint.smAndAbove
      ? ' pt-5'
      : ''"
    :style="`margin-top: ${$vuetify.application.top}px; overflow-x: hidden;
      height: calc(100% - ${$vuetify.application.top + $vuetify.application.footer}px);`"
  >
    <div
      class="px-3"
    >
      <v-app-bar
        app
        clipped-left
        clipped-right
        flat
        :color="topic.color"
        class="white--text"
        style="z-index: 10;"
      >
        <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title
          v-if="$vuetify.breakpoint.mdAndUp"
          class="text-uppercase mr-5"
        >
          <span class="mr-3">{{ appConfig && appConfig.branding.appName }}</span>

          /

          <router-link class="ml-3 topic-button" :to="{name: topic.slug}">
            {{ topic.name }}
          </router-link>
        </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <v-btn
          text
          dark
          small
          class="mr-3"
          @click="$router.push('/explore')"
        >
          Explore
        </v-btn>
        <img class="header__logo" height="32" :src="appConfig && appConfig.branding.headerLogo" />
      </v-app-bar>
      <v-row class="topic-page" justify="center">
        <div
          class="topic-header d-flex justify-center align-center"
          :style="{background: topic.color}"
        >
          <h2 class="text-h2 white--text text-center">{{ topic.name }}</h2>
        </div>

        <theme-navigation />

        <v-container
          class="ma-0 pb-16 d-flex flex-column"
          style="max-width: 1400px;"
        >
          <stories-grid :topic="$route.name" class="pt-16 pb-16" />
          <v-row no-gutters class="d-flex flex-row px-3 px-md-8 pt-16 pb-8">
            <template>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6"
                class="d-flex flex-column justify-center"
              >
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8">
                  <h3 class="text-h3 mb-10">Explore {{ topic.name }} Datasets</h3>

                  <p class="mb-10" style="font-size: 18px;">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                    eu fugiat nulla pariatur.
                  </p>

                  <v-btn
                    elevation="1"
                    class="py-2 white--text"
                    block
                    max-height="44"
                    :color="topic.color"
                    large
                  >Explore</v-btn>
                </div>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6"
                class="info-section d-flex flex-column justify-center"
              >
                <img
                  src="@/assets/datasets.jpg"
                  width="100%"
                  class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8"
                />
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-row>
      <global-footer :color="topic.color" />
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';

import GlobalFooter from '@/components/GlobalFooter.vue';
import StoriesGrid from '@/components/ThemesLandingPage/StoriesGrid.vue';
import ThemeNavigation from '@/components/ThemesLandingPage/ThemeNavigation.vue';

export default {
  data() {
    return {
    };
  },

  components: {
    GlobalFooter,
    StoriesGrid,
    ThemeNavigation,
  },

  created() {
    this.loadTheme(this.$route.name);
  },

  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
    ...mapGetters({
      topic: 'themes/getCurrentTheme',
    }),
  },
  methods: {
    ...mapActions('themes', ['loadTheme']),
  },
};
</script>

<style lang="scss" scoped>
.topic-page {
  width: 100vw;
  min-height: 100vh;
}
.topic-header {
  width: 100vw;
  height: 24vh;
  position: relative;
}

.topic-header .backdrop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

.topic-button {
  border-radius: 4px;
  background: #FFF4;
  text-transform: none;
  font-size: 90%;
  padding: 2px 5px;
  text-decoration: none;
  color: #FFF;
}

.section {
  min-height: 70vh;
  width: 100vw;
}
</style>
