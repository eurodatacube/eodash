<template>
  <div
    class="fill-height scrollContainer"
    :class="$vuetify.breakpoint.smAndAbove
      ? ' pt-5'
      : ''"
    :style="`margin-top: ${$vuetify.application.top}px; overflow-x: hidden;
      height: calc(100% - ${$vuetify.application.top + $vuetify.application.footer}px);`"
  >
    <div
      class="px-3"
    >
      <global-header :isFullScreen="false" />
      <v-row class="landing-page" justify="center">
        <div style="background: #000; width: 100%; height: 80vh; position: relative;">
          <VueDeckgl
              :layers="layers"
              :effects="[lightingEffect]"
              :viewState="viewState"
              :controller="{
                doubleClickZoom: false,
                scrollZoom:      false,
                //type: MapController,
              }"
              @click="handleClick"
              @view-state-change="handleViewStateChange"
          >
          </VueDeckgl>
        </div>
        <hero />

        <v-container class="section gtif-grid pa-16" style="background: #D2E3E0">
          <v-row class="gtif-dashboard-row fill-width bg-primary rounded-lg overflow-hidden">
            <v-col
              class="gtif-dashboard-col white"
            >
              <v-row class="fill-width pa-4">
                <div class="color-primary rounded-md" style="border-radius: 50%; height: 36px; width: 36px; background: #f99;"></div>
                <v-col class="ml-3" style="transform: translateY(-3px)">
                  <v-row class="text-subtitle-2 font-weight-regular text-blue-grey lighten-1">Annual CO2 Emissions</v-row>
                  <v-row class="text-h5">31.5 GT/a</v-row>
                </v-col>
              </v-row>
              <v-row></v-row>
            </v-col>

            <v-col
              class="gtif-dashboard-col"
              style="background: #9f9"
            ></v-col>

            <v-col
              class="gtif-dashboard-col"
              style="background: #99f"
            ></v-col>
          </v-row>
        </v-container>

        <div class="section pb-16">
          <gtif-navigation />

          <div class="mt-16 mb-16 d-flex flex-column justify-start align-center">
            <stories-news v-if="appConfig && appConfig.id != 'gtif'"/>
            <LandingPageInfographic v-if="appConfig && appConfig.id === 'gtif'"/>
            <stories-grid :items="oneOfEachTheme" />
            <newsletter-banner v-if="appConfig && appConfig.showNewsletterButton" />
          </div>
        </div>

        <v-container
          class="ma-0 pt-16 pb-16 d-flex flex-column"
          style="max-width: 1400px;"
        >
          <v-row no-gutters class="d-flex flex-row px-3 pb-16 px-md-8">
            <template>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8">
                  <h3 class="text-h3 mb-10">Earth Observation Datasets</h3>

                  <p class="mb-10" style="font-size: 18px;">
                    Here you can browse the Earth Observation datasets and use the interactive
                    features, including maps that compute simple analytics by drawing an area
                    of interest. Other datasets are tabular data, presented as charts. All charts
                    can be downloaded as CSV. The open data and project source code can be
                    accessed in Github:
                    <v-btn
                      href="https://github.com/eurodatacube/eodash"
                      target="_blank"
                      text
                      small
                    >
                      <v-icon left>mdi-github</v-icon>
                      eurodatacube/eodash
                      <v-icon right>mdi-open-in-new</v-icon>
                    </v-btn>
                  </p>

                  <v-btn
                    elevation="1"
                    class="py-2 white--text"
                    block
                    max-height="44"
                    color="primary"
                    large
                    @click="$router.push({ name: 'explore' })"
                  >Explore Datasets</v-btn>
                </div>
              </v-col>

              <v-col
                cols="12" xs="12" sm="12" md="6" lg="6"
                class="info-section d-flex flex-column justify-center"
              >
                <img
                  src="/data/story-images/Datasets-landing.jpg"
                  width="100%"
                  class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8"
                />
              </v-col>
            </template>
          </v-row>

          <v-row no-gutters class="d-flex flex-row align-start px-3 pt-16 px-md-8"
            v-if="appConfig.id === 'trilateral'"
          >
            <template>
              <v-col
                cols="12" xs="12" sm="12" md="6" lg="6"
                class="info-section d-flex flex-column justify-center"
              >
                <img
                  src="/data/story-images/EO_Dashboard_kv_placeholder.jpeg"
                  width="100%"
                  class="pr-xs-0 pr-sm-0 pr-md-8 pr-lg-8 pr-xl-8"
                />
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <div class="info-section d-flex flex-column justify-center
                pb-8 pb-md-0 pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8">
                  <h3 class="text-h3">A Tri-Agency Dashboard by NASA, ESA, JAXA</h3>

                  <p class="mt-10">
                   International collaboration among space agencies is central to the success of
                   satellite Earth observations and data analysis, aiming at providing an accurate
                   and timely information to decision-makers, main stakeholders and public.
                   These partnerships foster more comprehensive measurements, robust datasets,
                   and cost-effective missions.
                  </p>

                  <p>
                    The <b>European Space Agency (ESA), Japan Aerospace Exploration Agency (JAXA),
                    and National Aeronautics and Space Administration (NASA)</b> have combined
                    their resources, technical knowledge, and expertise to produce this Earth
                    Observing Dashboard, which strengthens our understanding of global
                    environmental changes and other societal challenges impacting our planet.
                  </p>

                  <p>
                    The dashboard provides an easy-to-use resource for all kinds of public from the
                    scientist to the decision-maker, including people not familiar with satellites.
                    Based on accurate remote sensing observations, it showcases examples of global
                    environmental changes on 7 themes: Atmosphere, Oceans, Biomass, Cryosphere,
                    Agriculture, Covid-19 and Economy. The dashboard offers a precise, objective
                    and factual view without any artifacts of our planet. You can explore countries
                    and regions around the world to see how the indicators in specific locations
                    changed over time.
                  </p>

                  <p>
                    ESA, JAXA, and NASA will continue to enhance this dashboard as new data
                    becomes available.
                  </p>
                </div>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-row>
      <global-footer />
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';
import VueDeckgl from 'vue-deck.gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import {
  AmbientLight,
  PointLight,
  LightingEffect,
  MapController,
} from '@deck.gl/core';

import GlobalFooter from '@/components/GlobalFooter.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';

import Hero from '@/components/ThemesLandingPage/Hero.vue';
import StoriesGrid from '@/components/ThemesLandingPage/StoriesGrid.vue';
import NewsletterBanner from '@/components/ThemesLandingPage/NewsletterBanner.vue';
import StoriesNews from '@/components/ThemesLandingPage/StoriesNews.vue';

import LandingPageInfographic from '@/components/GTIF/LandingPageInfographic.vue';
import GtifNavigation from '@/components/GTIF/GTIFNavigation.vue';

export default {
  components: {
    GlobalFooter,
    GlobalHeader,
    Hero,
    GtifNavigation,
    StoriesGrid,
    NewsletterBanner,
    StoriesNews,
    LandingPageInfographic,
    VueDeckgl,
  },
  data() {
    return {
      // Contains the data for the 3D bar chart in the hero
      glData: null,
      lightingEffect: null,
      viewState: {
        latitude: 51.509865,
        longitude: -0.118092,
        zoom: 7,
        bearing: 0,
        pitch: 30,
      },
    };
  },
  metaInfo() {
    return {
      title: this.appConfig ? this.appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
    ...mapGetters('themes', [
      'getStories',
      'getThemes',
    ]),

    oneOfEachTheme() {
      return this.getThemes
        .map((theme) => this.getStories(theme.slug)[
          Math.floor(Math.random() * this.getStories(theme.slug).length)
        ])
        .filter((story) => !!story);
    },

    layers() {
      const colorRange = [
        [1, 152, 189],
        [73, 227, 206],
        [216, 254, 181],
        [254, 237, 177],
        [254, 173, 84],
        [209, 55, 78],
      ];

      const ambientLight = new AmbientLight({
        color: [255, 255, 255],
        intensity: 1.0,
      });

      const pointLight1 = new PointLight({
        color: [255, 255, 255],
        intensity: 0.8,
        position: [-0.144528, 49.739968, 80000],
      });

      const pointLight2 = new PointLight({
        color: [255, 255, 255],
        intensity: 0.8,
        position: [-3.807751, 54.104682, 8000],
      });

      this.lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 });

      const material = {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51],
      };

      const tileLayer = new TileLayer({
        // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
        data: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',

        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,

        renderSubLayers: (props) => {
          const {
            bbox: {
              west, south, east, north,
            },
          } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
          });
        },
      });

      const hexagonLayer = new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage: 1,
        data: this.glData,
        elevationRange: [0, 3000],
        elevationScale: this.glData && this.glData.length ? 50 : 0,
        extruded: true,
        getPosition: (d) => d,
        pickable: true,
        radius: 1000,
        upperPercentile: 100,
        material,

        transitions: {
          elevationScale: 3000,
        },
      });
      return [tileLayer, hexagonLayer];
    },
  },
  created() {
    this.loadTheme(null);

    if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
      this.$router.replace({
        name: 'explore',
        query: this.$route.query,
      });
    }
  },
  async mounted() {
    require('d3-request').csv('https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv', (error, response) => {
      if (!error) {
        this.glData = response.map((d) => [Number(d.lng), Number(d.lat)]);
        console.log(this.glData);
      }
    });
  },
  methods: {
    ...mapActions('themes', ['loadTheme']),
    handleClick({ event, info }) {
      // handle clicks on the deck instance
    },
    handleViewStateChange(updatedViewState) {
      // update the state object
      this.viewState = {
        ...updatedViewState,
      };
    },
    csvToArray(str, delimiter = ',') {
      // slice from start of text to the first \n index
      // use split to create an array from string by delimiter
      const headers = str.slice(0, str.indexOf('\n')).split(delimiter);

      // slice from \n index + 1 to the end of the text
      // use split to create an array of each csv value row
      const rows = str.slice(str.indexOf('\n') + 1).split('\n');

      // Map the rows
      // split values from each row into an array
      // use headers.reduce to create an object
      // object properties derived from headers:values
      // the object passed as an element of the array
      const arr = rows.map((row) => {
        const values = row.split(delimiter);
        const el = headers.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return el;
      });

      // return the array
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.landing-page {
  width: 100vw;
}
.section {
  min-height: 70vh;
  min-width: 100vw;

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
}

.appbar {
  z-index: 30;
}

.info-section {
  min-height: 40vh;
}

.theme-button {
  border-radius: 4px;
  background: #FFF4;
  text-transform: none;
  font-size: 105%;
  padding: 3px 7px;
  text-decoration: none;
  font-weight: normal;
  color: #FFF;

  &.disabled {
    background: transparent;
  }
}

.gtif-dashboard-row {

}
.gtif-dashboard-col {
  height: 125px;
}
</style>
