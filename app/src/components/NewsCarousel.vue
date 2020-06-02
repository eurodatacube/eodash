<template>
  <v-carousel
    :continuous="autoPlay"
    cycle
    :height="$vuetify.breakpoint.mdAndUp ? 400 : 200"
    hide-delimiter-background
    show-arrows-on-hover
  >
    <v-hover>
      <template v-slot:default="{ hover }">
        <div>
          <v-carousel-item
            v-for="(item, i) in items"
            :key="i"
            contain
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
      items: [
        {
          poi: 'NorthAdriatic-N3a2',
          src: '/eodash-data/general/Slide1.png',
        },
        {
          poi: 'PL1-E1a',
          src: '/eodash-data/general/Slide2.png',
        },
        {
          poi: 'World-N1',
          src: '/eodash-data/general/Slide3.png',
        },
      ],
    };
  },
  methods: {
    onClickItem(item) {
      const poi = item.poi;
      if (poi) {
        const aoiId = poi.split('-')[0];
        const indicatorCode = poi.split('-')[1];
        const selectedFeature = this.$store.state.features.allFeatures.find((f) => {
          const { indicatorObject } = f.properties;
          return indicatorObject.AOI_ID === aoiId
            && indicatorObject['Indicator code'] === indicatorCode;
        });
        this.$store.commit('indicators/SET_SELECTED_INDICATOR', selectedFeature.properties.indicatorObject);
      }
    },
  },
};
</script>
