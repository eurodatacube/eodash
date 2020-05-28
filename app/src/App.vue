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
import CookieLaw from 'vue-cookie-law';

export default {
  components: { CookieLaw },
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
  methods: {
    acceptCookies() {
      this.loadMatomo();
    },
    loadMatomo() {
      const _paq = _paq || []; //eslint-disable-line
      _paq.push(['setDoNotTrack', true]);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (() => {
        const u = 'https://nix.eox.at/piwik/';
        _paq.push(['setTrackerUrl', `${u}piwik.php`]);
        _paq.push(['setSiteId', '11']);
        const d = document;
        const g = d.createElement('script');
        const s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.defer = true;
        g.src = `${u}piwik.js`;
        s.parentNode.insertBefore(g, s);
      })();
    },
  },
};
</script>
