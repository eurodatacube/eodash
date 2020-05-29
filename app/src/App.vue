<!-- eslint-disable global-require -->
<template>
  <v-app id="inspire">
    <router-view />
    <cookie-law @accept="acceptCookies">
      <div slot-scope="props" style="width: 100%;">
        <div class="d-flex align-center justify-center mb-5">
          <small class="mb-0">
            We use cookies which are essential for you to access our website and/or
            to provide you with our services
            and allow us to measure and improve the
            performance of our website. <br v-if="$vuetify.breakpoint.xsOnly" />
            <a href="#" target="_blank">Learn more</a>.
          </small>
        </div>
        <div class="text-center">
          <v-btn
            color="primary"
            :block="$vuetify.breakpoint.xsOnly"
            :class="$vuetify.breakpoint.smAndUp ? 'mr-5' : 'mb-5'"
            @click="props.accept"
          >
            <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
            Accept all cookies
          </v-btn>
          <v-btn
            color="primary"
            outlined
            :block="$vuetify.breakpoint.xsOnly"
            @click="props.close"
          >
            <v-icon left>mdi-cancel</v-icon>
            Accept essential only
          </v-btn>
        </div>
      </div>
    </cookie-law>
  </v-app>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';
import CookieLaw from 'vue-cookie-law';

export default {
  components: { CookieLaw },
  metaInfo() {
    let metaData;
    if (this.appConfig) {
      metaData = {
        meta: [
          { name: 'google-site-verification', content: this.appConfig.pageMeta.googleSiteVerification },
          // Twitter Card
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: this.appConfig.branding.appName },
          { name: 'twitter:description', content: this.appConfig.pageMeta.shortDescription },
          // image must be an absolute path
          { name: 'twitter:image', content: `${this.appConfig.pageMeta.rootPath}${this.appConfig.pageMeta.twitterCardImagePath}` },
          // Facebook OpenGraph
          { property: 'og:title', content: this.appConfig.branding.appName },
          { property: 'og:site_name', content: this.appConfig.branding.appName },
          { property: 'og:type', content: 'website' },
          { property: 'og:image', content: `${this.appConfig.pageMeta.rootPath}${this.appConfig.pageMeta.twitterCardImagePath}` },
          { property: 'og:description', content: this.appConfig.pageMeta.shortDescription },
          // Colored status bar
          // Chrome, Firefox OS and Opera
          { property: 'theme-color', content: this.appConfig.branding.primaryColor },
          // Windows Phone
          { property: 'msapplication-navbutton-color', content: this.appConfig.branding.primaryColor },
          // iOS Safari
          { property: 'apple-mobile-web-app-status-bar-style', content: this.appConfig.branding.primaryColor },
        ],
      };
      const link = document.querySelector("[rel='icon']");
      link.setAttribute('href', this.appConfig.branding.faviconPath);
    }
    return metaData;
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  methods: {
    acceptCookies() {
      if (this.$matomo) {
        this.$matomo.rememberConsentGiven();
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@/scss/global.scss";
</style>
