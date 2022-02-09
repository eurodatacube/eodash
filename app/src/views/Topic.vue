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
          <span class="mr-3">{{ appConfig && appConfig.branding.appName }}</span>

          /

          <router-link class="ml-3 topic-button" :to="{name: topic.slug}">
            {{ topic.name }}
          </router-link>
        </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
      </v-app-bar>
      <v-row class="topic-page" justify="center">
        <div
          class="topic-header d-flex justify-center align-center"
          :style="{background: topic.color}"
        >
          <div class="backdrop">
          </div>
          <h2 class="text-h2 white--text">{{ topic.name }}</h2>
        </div>
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

  created() {
    const result = this.themes.find((theme) => (`/${theme.slug}`) === this.$route.path);

    if (result) {
      this.topic = result;
    } else {
      console.log(`Cannot find slug "${this.$route.params.slug}"`);
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
    ...mapState({ themes: (state) => state.themes.themes }),
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
  height: 30vh;
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
