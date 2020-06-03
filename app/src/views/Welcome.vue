<template>
  <div
    class="pa-7 pt-0 pb-0"
    :class="$vuetify.breakpoint.xsOnly && 'pb-10'"
  >
    <v-row class="d-flex">
      <v-col
        cols="12"
      >
        <h1 class="display-1 primary--text">COVID-19 Impact seen by Satellite</h1>
      </v-col>
      <v-col
        cols="12"
      >
        <v-card outlined>
          <news-carousel v-if="appConfig.showNewsCarousel" />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <v-card outlined class="pa-5 text-center">
          <h2 class="primary--text display-3">
            <v-icon
              x-large
              color="primary"
            >{{ baseConfig.indicatorClassesIcons.economic }}</v-icon>
            {{ allFeatures
              .filter((i) => i.properties.indicatorObject['Indicator code'] !== 'd' && baseConfig
                .indicatorsDefinition[i.properties.indicatorObject['Indicator code']]
                  .class === 'economic'
              ).length }}
          </h2>
          <p class="mb-0"><small>Economic Indicators</small></p>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <v-card outlined class="pa-5 text-center">
          <h2 class="primary--text display-3">
            <v-icon
              x-large
              color="primary"
            >{{ baseConfig.indicatorClassesIcons.agriculture }}</v-icon>
            {{ allFeatures
              .filter((i) => i.properties.indicatorObject['Indicator code'] !== 'd' && baseConfig
                .indicatorsDefinition[i.properties.indicatorObject['Indicator code']]
                  .class === 'agriculture'
              ).length }}
          </h2>
          <p class="mb-0"><small>Agriculture Indicators</small></p>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <v-card outlined class="pa-5 text-center">
          <h2 class="primary--text display-3">
            <v-icon
              x-large
              color="primary"
            >{{ baseConfig.indicatorClassesIcons.environment }}</v-icon>
            {{ allFeatures
              .filter((i) => i.properties.indicatorObject['Indicator code'] !== 'd' && baseConfig
                .indicatorsDefinition[i.properties.indicatorObject['Indicator code']]
                  .class === 'environment'
              ).length }}
            </h2>
          <p class="mb-0"><small>Environment Indicators</small></p>
        </v-card>
      </v-col>
      <!-- <v-col
        cols="12"
      >
        <small>Latest measurement: {{ getLatestUpdate }}</small>
      </v-col> -->
      <v-col
        cols="12"
      >
        <v-card outlined class="pa-5">
          <div
            v-html="welcome"
            class="md-body"
          ></div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex';

import marked from 'marked';
import NewsCarousel from '@/components/NewsCarousel.vue';

export default {
  components: {
    NewsCarousel,
  },
  computed: {
    ...mapGetters('features', [
      'getCountries',
      'getIndicators',
      'getLatestUpdate',
    ]),
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('features', [
      'allFeatures',
    ]),
    welcome() {
      return marked(require('../../public/eodash-data/general/How to use the RACE Dashboard.md').default);
    },
  },
};
</script>
