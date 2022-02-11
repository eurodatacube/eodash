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
      <global-header />
      <v-row class="landing-page" justify="center">
        <hero />

        <div class="section pb-16">
          <theme-navigation />
          <div class="mt-16 d-flex flex-column justify-start align-center">
            <stories-grid :items="oneOfEachTopic" />
          </div>
        </div>

        <v-container
          class="ma-0 pt-16 pb-16 d-flex flex-row"
          style="max-width: 1400px;"
        >
          <v-row no-gutters class="d-flex flex-row px-3 px-md-8">
            <template>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8">
                  <h3 class="text-h3 mb-10">Explore Datasets</h3>

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
                    color="primary"
                    large
                  >Explore</v-btn>
                </div>
              </v-col>

              <v-col
                cols="12" xs="12" sm="12" md="6" lg="6"
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
      <global-footer />
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
import GlobalHeader from '@/components/GlobalHeader.vue';

import Hero from '@/components/ThemesLandingPage/Hero.vue';
import ThemeNavigation from '@/components/ThemesLandingPage/ThemeNavigation.vue';
import StoriesGrid from '@/components/ThemesLandingPage/StoriesGrid.vue';

export default {
  components: {
    GlobalFooter,
    GlobalHeader,
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
    ...mapGetters({
      themes: 'themes/getThemes',
      stories: 'themes/getStories',
      currentTheme: 'themes/getCurrentTheme',
    }),

    oneOfEachTopic() {
      return this.themes
        // For each theme, select one of the matching stories randomly.
        .map((theme) => {
          const filtered = this.stories.filter((story) => story.theme === theme.slug);
          return filtered[Math.floor(Math.random() * filtered.length)];
        })
        // Remove undefined entries if there is no story for a given topic.
        .filter((story) => !!story);
    },
  },
  created() {
    this.loadTheme(null);

    if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
      this.$router.replace({
        name: 'explore',
        query: this.$route.query,
      });
    }
  },
  methods: {
    ...mapActions('themes', ['loadTheme']),
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

.info-section {
  height: 40vh;
}

.topic-button {
  border-radius: 4px;
  background: #FFF4;
  text-transform: none;
  font-size: 105%;
  padding: 3px 7px;
  text-decoration: none;
  font-weight: normal;
  color: #FFF;

  &.disabled {
    background: transparent;
  }
}
</style>
