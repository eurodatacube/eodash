<template>
  <v-container
    class="ma-0"
    style="max-width: 1300px;"
  >
    <h3 class="text-h3 mb-10">Stories</h3>

    <v-row
      no-gutters
    >
      <v-col
        v-for="(story, index) in stories"
        :key="story.slug"
        :cols="$vuetify.breakpoint.xsOnly
          ? 12
          : (((index + 1) % 4 === 1 || (index + 1) % 4 === 0) ? 8 : 4)"
      >
        <v-hover
          v-slot="{ hover }"
          style="cursor: pointer;"
        >
          <v-card
            flat
            tile
            style="position: relative;"
            v-if="findTheme(story.theme)"
          >

            <v-btn 
              class="theme-tag white--text" 
              style="z-index: 5;" 
              :color="findTheme(story.theme).color"
              @click="$router.push({name: findTheme(story.theme).slug})"
              small>

              {{ findTheme(story.theme).name }}
            </v-btn>

            <v-img
              class="white--text align-end"
              :aspect-ratio="((index + 1) % 4 === 1 || (index + 1) % 4 === 0)
                ? 2/1
                : 1/1"
              :src="story.image"
              :lazy-src="story.imagePlaceholder"
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
                {{ story.title }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="!$vuetify.breakpoint.mobile"
                class="ml-5 mb-5"
              >
                {{ story.subtitle }}
              </v-list-item-subtitle>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex';

import storiesConfig from '../../config/stories.json';
import storiesRaw from '../../config/stories2.json';

export default {
  data: () => ({
    carouselModel: 0,
    //themes: null,
    tab: null,
  }),
  components: {
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),

    ...mapGetters({
      themes: 'themes/getThemes',
    }),

    stories() {
      return storiesRaw;
    },

    carouselEntries() {
      // temporary for demo purposes
      return Object.entries(storiesConfig[this.appConfig.id].Water)
        .concat(Object.entries(storiesConfig[this.appConfig.id].Land))
        .sort((a, b) => a[0].length - b[0].length)
        .splice(0, 5);
    },
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
    findTheme(slug) {
      return this.themes.find(theme => theme.slug === slug)
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

.theme-tag {
  position: absolute;
  left: 16px;
  top: 16px;
  border-radius: 6px;
}
</style>
