<!-- eslint-disable global-require -->
<template>
  <v-app id="inspire" :class="`fill-height brand-${appConfig.id}`">
    <div v-if="comingSoon"
      class="fill-height d-flex justify-center align-center"
      :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <countdown v-if="countDownTime" :time="countDownTime" @end="comingSoon = false">
        <template slot-scope="props">
          <div class="text-center">
            <img src="../public/data/trilateral/Countdown.png"
              style="width: 70%; max-width: 100vw" class="mb-5" />
            <h1 class="display-2 primary--text">
              <span v-if="props.days > 0">{{ props.days }} days, </span>{{ props.hours }} hours,
              <br v-if="$vuetify.breakpoint.xsOnly" />{{ props.minutes }} minutes,
              <br v-if="$vuetify.breakpoint.xsOnly" />{{ props.seconds }} seconds
            </h1>
          </div>
        </template>
      </countdown>
    </div>
    <template v-else>
      <router-view />
      <cookie-law
        v-if="showCookieNotice" @accept="acceptCookies"
        :theme="$vuetify.theme.dark ? 'blood-orange' : 'base'"
      >
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
      <alert />
    </template>
  </v-app>
</template>

<script>
// Utilities
import {
  mapState,
  mapGetters,
} from 'vuex';
import CookieLaw from 'vue-cookie-law';
import { loadIndicatorData } from '@/utils';

import axios from 'axios';
import { Wkt } from 'wicket';

import Alert from './components/Alert.vue';

const wkt = new Wkt();

export default {
  components: {
    CookieLaw,
    Alert,
  },
  data: () => ({
    showPrivacyDialog: false,
    comingSoon: null,
    countDownTime: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapGetters('features', [
      'getIndicators',
      'getCountryItems',
    ]),
    showCookieNotice() {
      return this.$route.path !== '/iframe';
    },
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light';
    },
  },
  created() {
    if (Object.prototype.hasOwnProperty.call(this.appConfig, 'countDownTimer')
      && this.appConfig.countDownMatch.includes(document.domain)) {
      this.comingSoon = true;
      this.checkComingSoon();
    } else {
      this.comingSoon = false;
    }
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
            return indicatorObject.aoiID === aoiId
              && indicatorObject.indicator === indicatorCode;
          });
        }
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature ? selectedFeature.properties.indicatorObject : null);
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature ? selectedFeature.properties.indicatorObject : null);

        // Read route query and validate country and indicator if in query
        const { country } = this.$route.query;
        const { indicator } = this.$route.query;
        // validate query for country - need to be among available
        const selectedCountry = this.getCountryItems
          .map((item) => item.code).flat().find((f) => f === country);
        let selectedIndicator = this.getIndicators
          .map((item) => item.code).find((f) => f === indicator);
        // If selectedIndicator is undefined and indicator has been provided
        // it could be an archived indicator so we activate
        if (typeof indicator !== 'undefined' && typeof selectedIndicator === 'undefined') {
          this.$store.commit('features/SET_FEATURE_FILTER', { includeArchived: true });
          selectedIndicator = this.getIndicators
            .map((item) => item.code).find((f) => f === indicator);
        }
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

      if (mutation.type === 'features/SET_SELECTED_AREA') {
        if (mutation.payload) {
          const area = wkt.read(JSON.stringify(mutation.payload)).write();
          this.$router.replace({ query: Object.assign({}, this.$route.query, { area, }) }).catch(err => {}); // eslint-disable-line
        } else {
          const query = Object.assign({}, this.$route.query); // eslint-disable-line
          delete query.area;
          this.$router.replace({ query }).catch(err => {}); // eslint-disable-line
        }
      }

      if (['indicators/SET_SELECTED_INDICATOR'].includes(mutation.type)) {
        if (mutation.payload && !( // If dummy feature selected ignore
          Object.prototype.hasOwnProperty.call(mutation.payload, 'dummyFeature')
          && mutation.payload.dummyFeature)) {
          this.loadIndicatorData(mutation.payload);
          this.$router.replace({ query: Object.assign({}, this.$route.query, { poi: this.getLocationCode(mutation.payload) }) }).catch(err => {}); // eslint-disable-line
          this.trackEvent('indicators', 'select_indicator', this.getLocationCode(mutation.payload));
          this.$store.commit('indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null);
        } else {
          const query = Object.assign({}, this.$route.query); // eslint-disable-line
          delete query.poi;
          this.$router.replace({ query }).catch(err => {}); // eslint-disable-line
          this.$store.commit('indicators/INDICATOR_LOAD_FINISHED', null);
          this.$store.commit('indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', null);
          this.trackEvent('indicators', 'deselect_indicator');
        }
      }
    });
    this.setAreaFromQuery();
  },
  methods: {
    async checkComingSoon() {
      const currentTime = await this.getCurrentTime();
      this.countDownTime = new Date(this.appConfig.countDownTimer) - currentTime;
      this.comingSoon = this.countDownTime > 0;
    },
    async getCurrentTime() {
      const response = await axios.get('/');
      return new Date(response.headers.date);
    },
    async loadIndicatorData(payload) {
      const indicatorObject = await loadIndicatorData(this.baseConfig, payload);
      if (indicatorObject) {
        this.$store.commit('indicators/INDICATOR_LOAD_FINISHED', indicatorObject);
      }
    },
    acceptCookies() {
      if (this.$matomo) {
        this.$matomo.rememberConsentGiven();
      }
    },
    setAreaFromQuery() {
      const { area } = this.$route.query;
      // simply validate format of area from query
      if (typeof area === 'string') {
        const validArea = wkt.read(area);
        if (validArea) {
          // save as JSON
          this.$store.commit('features/SET_SELECTED_AREA', validArea.toJson());
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@/scss/global.scss";
</style>
