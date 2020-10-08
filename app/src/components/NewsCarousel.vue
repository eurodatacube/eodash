<template>
  <v-carousel
    :continuous="autoPlay"
    cycle
    height="auto"
    hide-delimiter-background
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
            :src="item.src"
          >
            <v-fade-transition>
              <v-overlay
                v-if="hover"
                absolute
                :color="$vuetify.theme.themes.light.primary"
              >
                <v-btn
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
      autoPlay: true,
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
  },
};
</script>
