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
      <v-row class="landing-page" justify="center">
        <div class="hero">
          <div class="overlay d-flex flex-column justify-center align-center">
            <h2 class="text-h2 mb-5 white--text">You and Earth Observation</h2>
            <h5 class="text-h5 mb-10 white--text">A Tri-Agency Dashboard by NASA, ESA, JAXA</h5>
            <p class="mb-10 white--text">
              <!-- eslint-disable vue/no-v-html -->
              International collaboration among space agencies is central to the success of satellite Earth observations and data analysis. These partnerships foster more comprehensive measurements, robust datasets, and cost-effective missions.
              <!-- eslint-enable -->
            </p>
            <v-btn
              elevation="2"
              color="white"
              class="black--text"
              x-large
            >Start Exploring</v-btn>
          </div>
        </div>
        <div class="section">
          <v-container class="lighten-5" fluid>
            <v-row no-gutters>
              <template v-for="(theme, i) in themes">
                <v-col :key="theme.slug" class="px-1" cols="12" xs="12" sm="12" md="6" lg="2">
                  <v-btn
                    elevation="1"
                    :color="theme.color"
                    style="min-width: 100%; max-width: 100%;"
                    class="black--text"
                    large
                  >{{ theme.name }}</v-btn>
                </v-col>
              </template>
            </v-row>
          </v-container>
        </div>
      </v-row>
      <global-footer />
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
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
    ...mapState({ themes: state => state.themes.themes }),
  },
};
</script>

<style lang="scss" scoped>
.landing-page, .hero {
  width: 100vw;
}
.hero {
  background-image: url('../assets/landing-page-bg.jpg');
  background-color: #000;
  height: calc(100vh - 104px);
  margin-top: 76px;

  .overlay {
    background: #000B;
    width: 100%;
    height: 100%;
    text-align: center;

    p {
      max-width: 700px;
    }
  }
}

.section {
  min-height: 70vh;
  min-width: 100vw;

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
}
</style>
