<template>
    <v-overlay
        absolute
        opacity="0.9"
        z-index="7"
        :value="true"
      >
      <div
        style="width: 100%; position: absolute; z-index: 2;
        box-shadow: inset 0 30px 25px -20px #0008;"
      >
        <v-btn
          text
          class="ma-3"
          @click="dismiss"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          {{ appConfig && appConfig.branding.appName}}
        </v-btn>
      </div>
        <div class="fill-height px-5 pt-16 d-flex justify-center" style="overflow-y: auto">
          <div class="flex-grow-1" style="width: 100%; max-width: 1200px">
            <section class="carousel mb-3">
              <v-carousel
                cycle
                v-model="carouselModel"
              >
                <v-carousel-item
                  v-for="(story, i) in carouselEntries"
                  :key="i"
                  @click="selectStory(story)"
                  style="cursor: pointer"
                  eager
                >
                  <v-hover
                    v-slot="{ hover }"
                  >
                    <v-img
                      :src="story[1].image"
                      :lazy-src="story[1].imagePlaceholder"
                      height="100%"
                      class="white--text align-end"
                      eager
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                      <v-fade-transition>
                        <div
                          v-if="hover"
                          style="position: absolute; top: 0; left: 0; width: 100%;
                          height: 100%; background: #0008; z-index: -1"></div>
                      </v-fade-transition>
                      <v-list-item-title
                        :class="!$vuetify.breakpoint.mobile
                        ? 'text-h5 mb-1 ml-8'
                        : 'text-h5 mb-1 ml-5'"
                      >
                        {{ story[1].title }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        :class="!$vuetify.breakpoint.mobile
                          ? 'ml-8 mb-15'
                          : 'ml-5 mb-15'"
                      >
                        {{ story[1].subtitle }}
                      </v-list-item-subtitle>
                    </v-img>
                  </v-hover>
                </v-carousel-item>
              </v-carousel>
            </section>
            <section class="tabs">
              <v-tabs
                background-color="primary"
                center-active
                centered
                dark
                v-model="tab"
              >
                <v-tab
                  v-for="(theme, index) in themes"
                  :key="index"
                  v-html="theme"
                ></v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="(theme, index) in themes"
                  :key="index"
                >
                  <v-container
                    class="pa-0 ma-0"
                    style="max-width: 100%"
                  >
                    <v-row
                      no-gutters
                    >
                      <v-col
                        v-for="(story, index) in storyEntries(theme)"
                        :key="story[0]"
                        :cols="$vuetify.breakpoint.xsOnly
                          ? 12
                          : (((index + 1) % 4 === 1 || (index + 1) % 4 === 0) ? 8 : 4)"
                      >
                        <v-hover
                          v-slot="{ hover }"
                        >
                          <v-card
                            flat
                            tile
                            @click="selectStory(story)"
                          >
                            <v-img
                              class="white--text align-end"
                              :aspect-ratio="((index + 1) % 4 === 1 || (index + 1) % 4 === 0)
                                ? 2/1
                                : 1/1"
                              :src="story[1].image"
                              :lazy-src="story[1].imagePlaceholder"
                            >
                              <template v-slot:placeholder>
                                <v-row
                                  class="fill-height ma-0"
                                  align="center"
                                  justify="center"
                                >
                                  <v-progress-circular
                                    indeterminate
                                    color="grey lighten-5"
                                  ></v-progress-circular>
                                </v-row>
                              </template>
                              <v-fade-transition>
                                <div
                                  v-if="hover"
                                  style="position: absolute; top: 0; left: 0; width: 100%;
                                  height: 100%; background: #0008; z-index: -1"></div>
                              </v-fade-transition>
                              <v-list-item-title
                                :class="!$vuetify.breakpoint.mobile
                                  ? 'text-h5 mb-1 ml-5'
                                  : 'ma-2 mr-3 line-clamp'"
                              >
                                {{ story[1].title }}
                              </v-list-item-title>
                              <v-list-item-subtitle
                                v-if="!$vuetify.breakpoint.mobile"
                                class="ml-5 mb-5"
                              >
                                {{ story[1].subtitle }}
                              </v-list-item-subtitle>
                            </v-img>
                          </v-card>
                        </v-hover>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-tab-item>
              </v-tabs-items>
            </section>
          </div>
        </div>
    </v-overlay>
</template>

<script>
import {
  mapState,
} from 'vuex';

import storiesConfig from '../config/stories.json';

export default {
  data: () => ({
    carouselModel: 0,
    themes: null,
    tab: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    carouselEntries() {
      // temporary for demo purposes
      return Object.entries(storiesConfig[this.appConfig.id].Water)
        .concat(Object.entries(storiesConfig[this.appConfig.id].Land))
        .sort((a, b) => a[0].length - b[0].length)
        .splice(0, 5);
    },
  },
  created() {
    this.themes = Object.keys(storiesConfig[this.appConfig.id]);
  },
  methods: {
    dismiss() {
      this.$emit('dismiss');
    },
    storyEntries(theme) {
      return Object.entries(storiesConfig[this.appConfig.id][theme]);
    },
    selectStory(story) {
      this.$router.push(`/story?id=${story[0]}`);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-overlay {
  padding: 360px 5%;
}
::v-deep .v-overlay__content {
  width: 100%;
  height: 100%;
  transition: opacity .5s;
}
::v-deep .v-image__image {
  box-shadow: inset 0 -90px 50px -20px #000a;
}
::v-deep .v-list-item__title, .v-list-item__subtitle {
  white-space: unset;
}
.line-clamp {
  // fallback
  @supports not (display: -webkit-box) {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // might not work on all browsers
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
