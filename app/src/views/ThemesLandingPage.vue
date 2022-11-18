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

          <div class="mt-16 mb-16 d-flex flex-column justify-start align-center">
            <stories-news />
            <stories-grid :items="oneOfEachTheme" />
            <newsletter-banner v-if="appConfig && appConfig.showNewsletterButton" />
          </div>
        </div>

        <v-container
          class="ma-0 pt-16 pb-16 d-flex flex-column"
          style="max-width: 1400px;"
        >
          <v-row no-gutters class="d-flex flex-row px-3 pb-16 px-md-8">
            <template>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8">
                  <h3 class="text-h3 mb-10">Earth Observation Datasets</h3>

                  <p class="mb-10" style="font-size: 18px;">
                    Here you can browse the Earth Observation datasets and use the interactive
                    features, including maps that compute simple analytics by drawing an area
                    of interest. Other datasets are tabular data, presented as charts. All charts
                    can be downloaded as CSV. The open data and project source code can be
                    accessed in Github:
                    <v-btn
                      href="https://github.com/eurodatacube/eodash"
                      target="_blank"
                      text
                      small
                    >
                      <v-icon left>mdi-github</v-icon>
                      eurodatacube/eodash
                      <v-icon right>mdi-open-in-new</v-icon>
                    </v-btn>
                  </p>

                  <v-btn
                    elevation="1"
                    class="py-2 white--text"
                    block
                    max-height="44"
                    color="primary"
                    large
                    @click="$router.push({ name: 'explore' })"
                  >Explore Datasets</v-btn>
                </div>
              </v-col>

              <v-col
                cols="12" xs="12" sm="12" md="6" lg="6"
                class="info-section d-flex flex-column justify-center"
              >
                <img
                  src="/data/story-images/Datasets-landing.jpg"
                  width="100%"
                  class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8"
                />
              </v-col>
            </template>
          </v-row>

          <v-row no-gutters class="d-flex flex-row align-start px-3 pt-16 px-md-8">
            <template>
              <v-col
                cols="12" xs="12" sm="12" md="6" lg="6"
                class="info-section d-flex flex-column justify-center"
              >
                <img
                  src="/data/story-images/EO_Dashboard_kv_placeholder.jpeg"
                  width="100%"
                  class="pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8"
                />
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8">
                  <h3 class="text-h3">A Tri-Agency Dashboard by NASA, ESA, JAXA</h3>

                  <p class="mt-10">
                   International collaboration among space agencies is central to the success of
                   satellite Earth observations and data analysis, aiming at providing an accurate
                   and timely information to decision-makers, main stakeholders and public.
                   These partnerships foster more comprehensive measurements, robust datasets,
                   and cost-effective missions.
                  </p>

                  <p>
                    The <b>European Space Agency (ESA), Japan Aerospace Exploration Agency (JAXA),
                    and National Aeronautics and Space Administration (NASA)</b> have combined
                    their resources, technical knowledge, and expertise to produce this Earth
                    Observing Dashboard, which strengthens our understanding of global
                    environmental changes and other societal challenges impacting our planet.
                  </p>

                  <p>
                    The dashboard provides an easy-to-use resource for all kinds of public from the
                    scientist to the decision-maker, including people not familiar with satellites.
                    Based on accurate remote sensing observations, it showcases examples of global
                    environmental changes on 7 themes: Atmosphere, Oceans, Biomass, Cryosphere,
                    Agriculture, Covid-19 and Economy. The dashboard offers a precise, objective
                    and factual view without any artifacts of our planet. You can explore countries
                    and regions around the world to see how the indicators in specific locations
                    changed over time.
                  </p>

                  <p>
                    ESA, JAXA, and NASA will continue to enhance this dashboard as new data
                    becomes available.
                  </p>
                </div>
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
import NewsletterBanner from '@/components/ThemesLandingPage/NewsletterBanner.vue';
import StoriesNews from '@/components/ThemesLandingPage/StoriesNews.vue';

export default {
  components: {
    GlobalFooter,
    GlobalHeader,
    Hero,
    ThemeNavigation,
    StoriesGrid,
    NewsletterBanner,
    StoriesNews,
  },
  metaInfo() {
    return {
      title: this.appConfig ? this.appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
    ...mapGetters('themes', [
      'getStories',
      'getThemes',
    ]),

    oneOfEachTheme() {
      return this.getThemes
        .map((theme) => this.getStories(theme.slug)[
          Math.floor(Math.random() * this.getStories(theme.slug).length)
        ])
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
  min-height: 40vh;
}

.theme-button {
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
