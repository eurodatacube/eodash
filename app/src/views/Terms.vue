<template>
  <div
    class="fill-height pa-10"
    style="background: white; padding-top: 85px !important;"
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
          v-html="terms"
          class="md-body"
          :options="{ markdownIt: { html: true } }"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
    terms() {
      return this.$marked(require(`../../public${this.appConfig.termsText}.md`).default);
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}
</style>
