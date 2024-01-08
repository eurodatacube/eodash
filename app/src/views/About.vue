<template>
  <div
    class="pa-7 pb-0"
    :style="{ background: $vuetify.theme.currentTheme.background }"
    :class="$vuetify.breakpoint.xsOnly && 'pb-10'"
  >
    <v-row class="d-flex">
      <v-col
        cols="12"
      >
        <div
          v-html="about"
          class="md-body"
          :options="{ markdownIt: { html: true } }"
        />
      </v-col>
    </v-row>
    <v-row class="d-flex">
      <v-col
        cols="12"
      >
        <h1 class="display-1 primary--text">
          {{ currentTheme
            ? `${currentTheme.name} Datasets`
            : 'Global Changes Observed by Satellites'}}
        </h1>
      </v-col>
      <template
        v-if="baseConfig.indicatorClassesIcons"
      >
        <v-col
          v-for="category in Object.keys(baseConfig.indicatorClassesIcons)
            .filter(c => currentTheme ? c === currentTheme.slug : true)
            .filter(c => featureLength(c) > 0)"
          :key="category"
          :cols="$vuetify.breakpoint.smAndDown && '12'"
        >
          <v-card outlined class="px-4 py-2 text-center">
            <h2 class="display-2 primary--text d-flex align-center flex-column">
              <v-icon
                x-large
                color="primary"
              >{{ baseConfig.indicatorClassesIcons[category] }}</v-icon>
              {{ featureLength(category) }}
              </h2>
            <p class="mb-0"><small class="text-capitalize">{{category}}<br />Datasets</small></p>
          </v-card>
        </v-col>
      </template>
      <v-col v-if="currentTheme">
        <v-btn
          block
          x-large
          :color="currentTheme.color"
          dark
          :to="`/${currentTheme.slug}`"
        >
          <v-icon left>mdi-arrow-right</v-icon>
          {{ currentTheme.name }} stories
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex';

export default {
  data: () => ({
    panel: 0,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('features', [
      'allFeatures',
    ]),
    ...mapGetters({
      currentTheme: 'themes/getCurrentTheme',
    }),
    tutorials() {
      return this.appConfig.tutorialText
        && this.$marked(require(`../../public${this.appConfig.tutorialText}.md`).default);
    },
    about() {
      return this.$marked(require(`../../public${this.appConfig.aboutText}.md`).default);
    },
  },
  methods: {
    featureLength(type) {
      return this.allFeatures
        .filter((i) => this.baseConfig
          .indicatorsDefinition[i.properties.indicatorObject.indicator]
          .themes.includes(type)).length;
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
