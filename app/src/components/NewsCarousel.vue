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
            <v-fade-transition>
              <v-overlay
                v-if="hover && !autoPlayIframe"
                absolute
                :color="$vuetify.theme.themes.light.primary"
              >
                <v-btn
                  v-if="!item.iframe"
                  @click="onClickItem(item)"
                  color="primary"
                >View indicator</v-btn>
              </v-overlay>
            </v-fade-transition>
          </v-carousel-item>
        </div>
      </template>
    </v-hover>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0,
      autoPlayIframe: false,
      items: this.$store.state.config.appConfig.newsCarouselitems,
    };
  },
  methods: {
    onClickItem(item) {
      const { poi } = item;
      if (poi) {
        const aoiId = poi.split('-')[0];
        const indicatorCode = poi.split('-')[1];
        const selectedFeature = this.$store.state.features.allFeatures.find((f) => {
          const { indicatorObject } = f.properties;
          return indicatorObject.aoiID === aoiId
            && indicatorObject.indicator === indicatorCode;
        });
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature.properties.indicatorObject);
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
