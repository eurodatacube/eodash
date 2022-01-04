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
                  v-for="(color, i) in colors"
                  :key="color"
                >
                  <v-sheet
                    :color="color"
                    height="100%"
                    tile
                  >
                    <v-row
                      class="fill-height"
                      align="center"
                      justify="center"
                    >
                      <div class="text-h2">
                        Slide {{ i + 1 }}
                      </div>
                    </v-row>
                  </v-sheet>
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
                        v-for="i in 9"
                        :key="i"
                        :cols="(i % 4 === 1 || i % 4 === 0) ? 8 : 4"
                      >
                        <v-hover
                          v-slot="{ hover }"
                        >
                          <v-card
                            flat
                            tile
                            @click="selectStory"
                          >
                            <v-img
                              class="white--text align-end"
                              :aspect-ratio="(i % 4 === 1 || i % 4 === 0) ? 2/1 : 1/1"
                              :src="`https://picsum.photos/100${i}/80${i}`"
                            >
                              <v-fade-transition>
                                <div
                                  v-if="hover"
                                  style="position: absolute; top: 0; left: 0; width: 100%;
                                  height: 100%; background: #0008; z-index: -1"></div>
                              </v-fade-transition>
                              <v-list-item-title
                                class="text-h5 mb-1 ml-5"
                              >
                                {{ themes[tab] }} story nr. {{ i }}
                              </v-list-item-title>
                              <v-list-item-subtitle class="ml-5 mb-5">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
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

export default {
  data: () => ({
    carouselModel: 0,
    themes: [
      'Water',
      'Land',
      'Atmosphere',
      'Biomass',
      'Polar',
      'COVID-19',
    ],
    colors: [
      'primary',
      'secondary',
      'yellow darken-2',
      'red',
      'orange',
    ],
    tab: null,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
  methods: {
    dismiss() {
      this.$emit('dismiss');
    },
    selectStory() {
      //
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
  box-shadow: inset 0 -90px 50px -20px #0006;
}
</style>
