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
            <h1 class="text-h1 mb-5 white--text">You and Earth Observation</h1>
            <h5 class="text-h5 mb-10 white--text">A Tri-Agency Dashboard by NASA, ESA, JAXA</h5>
            <p class="mb-10 white--text">
              International collaboration among space agencies is central to the success of satellite Earth observations and data analysis. These partnerships foster more comprehensive measurements, robust datasets, and cost-effective missions.
            </p>
            <v-btn
              elevation="2"
              color="white"
              class="black--text"
              x-large
            >Start Exploring</v-btn>
          </div>
        </div>
        <div>
          <h2 class="text-h2">More Content</h2>
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
    challenges() {
      return this.$marked(require(`../../public${this.appConfig.challengesText}.md`).default);
    },
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
</style>
