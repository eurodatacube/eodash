<template>
  <div
    class="fill-height scrollContainer"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height pa-10 pt-5"
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
      <v-row class="d-flex">
        <v-col
          cols="12"
        >
          <div
            v-html="privacy"
            class="md-body"
            :options="{ markdownIt: { html: true } }"
          />
        </v-col>
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
    privacy() {
      return this.$marked(require(`../../public${this.appConfig.privacyText}.md`).default);
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}
</style>
