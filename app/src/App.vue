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
            <a href="/privacy" target="_blank">Learn more</a>.
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
  components: {
    CookieLaw,
  },
  data: () => ({
    showPrivacyDialog: false,
  }),
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
  mounted() {
    this.$nextTick(() => {
      // Read route query and set filters
      this.$store.commit('features/INIT_FEATURE_FILTER', {
        countries: this.$route.query.country ? this.$route.query.country : [],
        indicators: this.$route.query.indicator ? this.$route.query.indicator : [],
      });
    });
    // Listen for features added, and select if poi in query
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/ADD_NEW_FEATURES') {
        // Read route query and set selected poi
        const { poi } = this.$route.query;
        if (poi) {
          const aoiId = poi.split('-')[0];
          const indicatorCode = poi.split('-')[1];
          const selectedFeature = this.$store.state.features.allFeatures.find((f) => {
            const { indicatorObject } = f.properties;
            return indicatorObject.AOI_ID === aoiId
              && indicatorObject['Indicator code'] === indicatorCode;
          });
          this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature.properties.indicatorObject);
        }
      }

      // Url query replacement
      if (mutation.type === 'features/SET_FEATURE_FILTER') {
        if (Array.isArray(mutation.payload.countries) && mutation.payload.countries.length === 0) {
          // Global
          const query = Object.assign({}, this.$route.query); // eslint-disable-line
          delete query.country;
          this.$router.replace({ query }).catch(err => {}); // eslint-disable-line
          this.trackEvent('filters', 'select_country_filter', 'Global');
        } else if (mutation.payload.countries === 'regional') {
          // Regional
          this.$router.replace({ query: Object.assign({}, this.$route.query, { country: 'regional' }) }).catch(err => {}); // eslint-disable-line
          this.trackEvent('filters', 'select_country_filter', 'Regional');
        } else if (typeof mutation.payload.countries === 'string') {
          // Country
          this.$router.replace({ query: Object.assign({}, this.$route.query, { country: mutation.payload.countries }) }).catch(err => {}); // eslint-disable-line
          this.trackEvent('filters', 'select_country_filter', mutation.payload.countries);
        }
        if (Array.isArray(mutation.payload.indicators)) {
          if (mutation.payload.indicators.length === 0) {
            // Reset
            const query = Object.assign({}, this.$route.query); // eslint-disable-line
            delete query.indicator;
            this.$router.replace({ query }).catch(err => {}); // eslint-disable-line
            this.trackEvent('filters', 'select_indicator_filter', 'all');
          } else {
            // Single
            this.$router.replace({ query: Object.assign({}, this.$route.query, { indicator: mutation.payload.indicators[0] }) }).catch(err => {}); // eslint-disable-line
            this.trackEvent('filters', 'select_indicator_filter', mutation.payload.indicators[0]);
          }
        }
      }

      if (mutation.type === 'indicators/SET_SELECTED_INDICATOR') {
        if (mutation.payload) {
          this.$router.replace({ query: Object.assign({}, this.$route.query, { poi: `${mutation.payload.AOI_ID}-${mutation.payload['Indicator code']}` }) }).catch(err => {}); // eslint-disable-line
          this.trackEvent('indicators', 'select_indicator', `${mutation.payload.AOI_ID}-${mutation.payload['Indicator code']}`);
        } else {
          const query = Object.assign({}, this.$route.query); // eslint-disable-line
          delete query.poi;
          this.$router.replace({ query }).catch(err => {}); // eslint-disable-line
          this.trackEvent('indicators', 'deselect_indicator');
        }
      }
    });
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
