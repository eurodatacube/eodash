<!-- eslint-disable global-require -->
<template>
  <v-app id="inspire">
    <router-view />
  </v-app>
</template>

<script>
export default {
  metaInfo() {
    let metaData;
    if (this.$store.state.config.appConfig) {
      metaData = {
        meta: [
          { name: 'google-site-verification', content: this.$store.state.config.appConfig.pageMeta.googleSiteVerification },
          // Twitter Card
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: this.$store.state.config.appConfig.branding.appName },
          { name: 'twitter:description', content: this.$store.state.config.appConfig.pageMeta.shortDescription },
          // image must be an absolute path
          { name: 'twitter:image', content: `${this.$store.state.config.appConfig.pageMeta.rootPath}${this.$store.state.config.appConfig.pageMeta.twitterCardImagePath}` },
          // Facebook OpenGraph
          { property: 'og:title', content: this.$store.state.config.appConfig.branding.appName },
          { property: 'og:site_name', content: this.$store.state.config.appConfig.branding.appName },
          { property: 'og:type', content: 'website' },
          { property: 'og:image', content: `${this.$store.state.config.appConfig.pageMeta.rootPath}${this.$store.state.config.appConfig.pageMeta.twitterCardImagePath}` },
          { property: 'og:description', content: this.$store.state.config.appConfig.pageMeta.shortDescription },
        ],
      };
    }
    return metaData;
  },
};
</script>
