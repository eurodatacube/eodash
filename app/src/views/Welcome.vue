<template>
  <div
    class="pa-7 pb-0"
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
      <template v-if="baseConfig.indicatorClassesIcons">
        <v-col
          v-for="category in Object.keys(baseConfig.indicatorClassesIcons)
            .filter(c => featureLength(c) > 0)"
          :key="category"
          :cols="$vuetify.breakpoint.smAndDown && '12'"
        >
          <v-card outlined class="px-4 py-2 text-center">
            <h2 class="primary--text display-3">
              <v-icon
                x-large
                color="primary"
              >{{ baseConfig.indicatorClassesIcons[category] }}</v-icon>
              {{ featureLength(category) }}
              </h2>
            <p class="mb-0"><small class="text-capitalize">{{category}}<br />Indicators</small></p>
          </v-card>
        </v-col>
      </template>
      <v-col
        cols="12"
      >
      <v-expansion-panels
        v-if="tutorials"
        flat
        :multiple="false"
        v-model="panel"
      >
        <v-expansion-panel
          key="welcome"
          class="panel-outlined"
        >
          <v-expansion-panel-header>
            <h3 v-html="welcome.split('</h3>')[0]"></h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div
              v-html="welcome.split('</h3>')[1]"
              class="md-body"
            ></div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel
          v-if="tutorials"
          key="tutorials"
          class="panel-outlined"
        >
          <v-expansion-panel-header>
            <h3 v-html="tutorials.split('</h3>')[0]"></h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div
              v-html="tutorials.split('</h3>')[1]"
              class="md-body"
            ></div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card v-else outlined class="pa-5">
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

import NewsCarousel from '@/components/NewsCarousel.vue';

export default {
  components: {
    NewsCarousel,
  },
  data: () => ({
    panel: 0,
  }),
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
      return this.$marked(require(`../../public${this.appConfig.welcomeText}.md`).default);
    },
    tutorials() {
      return this.appConfig.tutorialText
        && this.$marked(require(`../../public${this.appConfig.tutorialText}.md`).default);
    },
  },
  methods: {
    featureLength(type) {
      return this.allFeatures
        .filter((i) => !i.properties.indicatorObject.dummyFeature && this.baseConfig
          .indicatorsDefinition[i.properties.indicatorObject.indicator]
          .class === type).length;
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-outlined {
  border: 1px solid var(--v-primary-base);
  border-radius: 4px;
}
.v-expansion-panel:not(:first-child) {
  margin-top: 16px;
}
</style>
