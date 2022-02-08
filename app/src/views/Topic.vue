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
        :color="topic.color"
        class="white--text"
      >
        <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title
          v-if="$vuetify.breakpoint.mdAndUp"
          class="text-uppercase mr-5"
        >
          <span class="mr-3">{{ appConfig && appConfig.branding.appName }}</span>/<span class="ml-3" style="border-radius: 4px; text-transform: none; background: #FFF4; font-size: 90%; padding: 2px 5px;">{{ topic.name }}</span>
        </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
      </v-app-bar>
      <v-row class="topic-page" justify="center">

      </v-row>
      <global-footer :color="topic.color" />
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import GlobalFooter from '@/components/GlobalFooter.vue';

export default {
  data() {
    return {
      topic: '',
    };
  },

  components: {
    GlobalFooter,
  },

  created () {
    let result = this.themes.find(theme => ('/' + theme.slug) === this.$route.path);

    if (result) {
      this.topic = result;
    } else {
      console.log('Cannot find slug "' + this.$route.params.slug + '"');
      this.$router.push('/404');
    }
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
.topic-page {
  width: 100vw;
  height: 100vh;
}
.section {
  min-height: 70vh;
  min-width: 100vw;
}
</style>
