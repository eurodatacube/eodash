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
      <v-row class="theme-page" justify="center">
        <div
          class="theme-header d-flex flex-column justify-center align-center"
          :style="{background: getCurrentTheme.color, height: '30vh'}"
        >
          <h2 class="white--text text-center" :class="[headingClass]">
            {{ getCurrentTheme.description }}
          </h2>

          <p
            class="mt-10 text-center white--text"
            style="max-width: 700px"
          >
            {{ getCurrentTheme.longDescription }}
          </p>
        </div>

        <theme-navigation />

        <v-container
          class="ma-0 pb-16 d-flex flex-column"
          style="max-width: 1400px;"
        >
          <component v-bind:is="customComponent" v-if="customComponent"></component>

          <stories-grid :items="getStories(getCurrentTheme.slug)" class="pt-16 pb-16" />
          <v-row no-gutters class="d-flex flex-row px-3 px-md-8 pt-16 pb-8">
            <template>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6"
                class="d-flex flex-column justify-center"
              >
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8">
                  <h3 class="mb-10" :class="[headingClass]">
                    {{ getCurrentTheme.name }} Datasets
                  </h3>

                  <p class="mb-10" style="font-size: 18px;">
                    Here you can browse all the {{ getCurrentTheme.name }} datasets available on
                    the Earth Observing Dashboard and make use of the interactive features.
                    Datasets are presented as maps, some of them with the possibility to compute
                    simple analytics by drawing an area of interest. Other datasets are tabular
                    data, presented as charts. All charts can be downloaded as CSV.
                    The open data and project source code can be accessed in Github:
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
                    :color="getCurrentTheme.color"
                    large
                    @click="$router.push({name: 'explore'})"
                  >Explore Datasets</v-btn>
                </div>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6"
                class="info-section d-flex flex-column justify-center"
              >
                <img
                  :src="getCurrentTheme.datasetsImage || 'data/story-images/Datasets-landing.jpg'"
                  width="100%"
                  class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8"
                />
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-row>
      <global-footer :color="getCurrentTheme.color" />
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';

import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import StoriesGrid from '@/components/ThemesLandingPage/StoriesGrid.vue';
import EnergyThemeComponent from '@/components/ThemesLandingPage/EnergyThemeComponent.vue';
import ThemeNavigation from '@/components/ThemesLandingPage/ThemeNavigation.vue';

export default {
  data() {
    return {
    };
  },

  components: {
    GlobalHeader,
    GlobalFooter,
    StoriesGrid,
    ThemeNavigation,
    EnergyThemeComponent,
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
    ...mapGetters('themes', [
      'getStories',
      'getCurrentTheme',
    ]),

    headingClass() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'text-h4';
        case 'sm': return 'text-h3';
        case 'md': return 'text-h3';
        case 'lg': return 'text-h2';
        case 'xl': return 'text-h2';

        default: return 'text-h2';
      }
    },
    customComponent() {
      return this.getCurrentTheme.customComponent;
    },
  },
  methods: {
    ...mapActions('themes', ['loadTheme']),
  },
};
</script>

<style lang="scss" scoped>
.theme-page {
  width: 100vw;
  min-height: 100vh;
}
.theme-header {
  width: 100vw;
  height: 24vh;
  position: relative;
}

.theme-header .backdrop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

.theme-button {
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
