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
  mapGetters,
} from 'vuex';
import CookieLaw from 'vue-cookie-law';

export default {
  components: {
    CookieLaw,
  },
  data: () => ({
    showPrivacyDialog: false,
  }),
  computed: {
    ...mapState('config', ['appConfig']),
    ...mapGetters('features', [
      'getIndicators',
      'getCountryItems',
    ]),
  },
  mounted() {
    // Listen for features added, and select if poi in query
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/ADD_NEW_FEATURES') {
        // Read route query and set selected poi
        const { poi } = this.$route.query;
        let selectedFeature = null;
        if (poi && poi.includes('-')) {
          const aoiId = poi.split('-')[0];
          const indicatorCode = poi.split('-')[1];
          selectedFeature = this.$store.state.features.allFeatures.find((f) => {
            const { indicatorObject } = f.properties;
            return indicatorObject.AOI_ID === aoiId
              && indicatorObject['Indicator code'] === indicatorCode;
          });
        }
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature ? selectedFeature.properties.indicatorObject : null);

        // Read route query and validate country and indicator if in query
        const { country } = this.$route.query;
        const { indicator } = this.$route.query;
        // validate query for country - need to be among available
        const selectedCountry = this.getCountryItems
          .map((item) => item.code).find((f) => f === country);
        const selectedIndicator = this.getIndicators
          .map((item) => item.code).find((f) => f === indicator);
        this.$store.commit('features/INIT_FEATURE_FILTER', {
          countries: selectedCountry,
          indicators: selectedIndicator,
        });
      }

      // Url query replacement
      if (mutation.type === 'features/SET_FEATURE_FILTER') {
        if (Array.isArray(mutation.payload.countries) && mutation.payload.countries.length === 0) {
          // Global
          const query = Object.assign({}, this.$route.query); // eslint-disable-line
          delete query.country;
          this.$router.replace({ query }).catch(err => {}); // eslint-disable-line
          this.trackEvent('filters', 'select_country_filter', 'Global');
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
