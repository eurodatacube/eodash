<template>
  <v-carousel
    v-model="currentSlide"
    continuous
    :cycle="!autoPlayIframe"
    height="auto"
    hide-delimiter-background
    :hide-delimiters="autoPlayIframe"
    show-arrows-on-hover
    :style="`background: ${$vuetify.theme.themes.light.primary}`"
  >
    <v-hover>
      <template v-slot:default="{ hover }">
        <div>
          <v-carousel-item
            v-for="(item, i) in items"
            :key="i"
            :aspect-ratio="16/9"
            :src="item.src && item.src"
          >
            <iframe
              v-if="item.iframe"
              :src="iframeSrc(item.iframe)"
              width="100%"
              height="100%"
              allowfullscreen
              frameborder="0"
              @click="autoPlayIframe = true"
              :class="!autoPlayIframe && 'untouchable'"
            ></iframe>
            <v-btn
              v-if="item.iframe && !autoPlayIframe"
              fab x-large
              @click="onClickIframe(item)"
              color="primary"
              class="playButton"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-fade-transition v-if="item.poi || item.href">
              <v-overlay
                v-if="hover && !autoPlayIframe"
                absolute
                :color="$vuetify.theme.themes.light.primary"
              >
                <v-btn
                  v-if="!item.iframe"
                  @click="onClickItem(item)"
                  color="primary"
                >
                <span v-if="item.poi">View indicator</span>
                <span v-else>Go to link</span>
              </v-btn>
              </v-overlay>
            </v-fade-transition>
          </v-carousel-item>
        </div>
      </template>
    </v-hover>
  </v-carousel>
</template>

<script>
import { isExternalUrl, loadIndicatorData } from '@/utils';
import {
  mapState,
  mapMutations,
} from 'vuex';

export default {
  computed: {
    ...mapState('indicators', ['indicators']),
    ...mapState('config', ['baseConfig']),
  },
  data() {
    return {
      currentSlide: 0,
      autoPlayIframe: false,
      items: this.$store.state.config.appConfig.newsCarouselitems,
    };
  },
  methods: {
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
      loadIndicatorFinished: 'INDICATOR_LOAD_FINISHED',
    }),
    ...mapMutations('features', {
      setSelectedFeature: 'SET_SELECTED_FEATURE',
    }),
    async onClickItem(item) {
      const { poi, href } = item;
      if (poi) {
        const aoiID = poi.split('-')[0];
        const indicatorCode = poi.split('-')[1];
        const ind = this.indicators.find((f) => f.indicator === indicatorCode) || {};
        if (aoiID !== 'World') {
          // eslint-disable-next-line no-param-reassign
          const objectM = {
            ...ind,
            aoiID,
            disableExtraLoadingData: true,
          };
          // fetching the indicator here outside of App.vue watcher in order to
          // get the features and select the matching one which was clicked in in the Panel
          this.setSelectedIndicator(objectM);
          const indicatorObject = await loadIndicatorData(
            this.baseConfig,
            objectM,
          );
          const currentFeatureObject = indicatorObject.features.find(
            (feat) => feat.id === aoiID,
          );
          // should match if the appConfig is done correctly
          if (currentFeatureObject) {
            const test = {
              indicatorObject: {
                ...indicatorObject,
                geoDBID: currentFeatureObject.properties.indicatorObject.geoDBID,
              },
            };
            this.loadIndicatorFinished(indicatorObject);
            // manually select the feature
            this.setSelectedFeature(test);
          }
        } else {
          this.setSelectedIndicator(ind);
        }
      } else if (href) {
        if (isExternalUrl(href)) {
          window.open(href);
        } else {
          window.open(href, '_self');
        }
      }
    },
    onClickIframe() {
      this.autoPlayIframe = true;
    },
    iframeSrc(src) {
      let newSrc;
      if (this.autoPlayIframe) {
        newSrc = `${src}?autoplay=1`;
      } else {
        newSrc = src;
      }
      return newSrc;
    },
  },
  watch: {
    currentSlide() {
      if (this.autoPlayIframe) {
        this.autoPlayIframe = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-responsive__content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.playButton {
  position: absolute;
  z-index: 999;
}
</style>
