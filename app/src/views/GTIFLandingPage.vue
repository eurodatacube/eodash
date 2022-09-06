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
      class="px-0"
    >
      <global-header :isFullScreen="false" />
      <v-row class="landing-page text-center" justify="center">
        <v-container class="section gtif-grid" style="background: #D2E3E0; padding: 0;">
          <section style="background: #AED6CF;" class="text-center d-flex flex-column pt-10 align-center justify-center fill-width">
            <h3 class="text-h3">Green Transition Information Factory</h3>

            <p class="pt-8 pb-8" style="max-width: 800px">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>

            <router-link to="/explore">
              <v-btn
                color="primary"
                elevation="3"
                x-large
              >Explore Green Transition Datasets</v-btn>
            </router-link>
          </section>

          <section
            class="ellipse py-10 fill-width"
            style="background: #AED6CF;"
          />

          <!--<v-row class="gtif-dashboard-row fill-width bg-primary rounded-lg overflow-hidden" elevation="3">
            <v-col
              cols="12"
              md="6"
              class="gtif-dashboard-col" style="position: relative; background-image: url('/data/gtif/images/GTIF_Key_visual.png'); background-size: cover; background-position: center;"
            >
              <img
                src="data/gtif/images/GTIF_Key_visual.png"
                width="100%"
                class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
              class="gtif-dashboard-col"
              style="position: relative"
            >
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
            </v-col>
          </v-row>-->
          <div class="mt-16 mb-16 d-flex flex-column justify-start align-center">
            <v-row class="gtif-dashboard-row fill-width bg-primary rounded-lg overflow-hidden align-center justify-center" elevation="3">
              <gtif-bubble
                title="Energy Production"
                color="#ffab02"
                to="energy"
              />

              <gtif-bubble
                title="Transport &amp; Emissions"
                color="#ec5f65"
                to="transport-emission"
              />

              <gtif-bubble
                title="Green Finance"
                color="#0097d7"
                to="green-finance"
              />

              <gtif-bubble
                title="Food Production &amp; Ecosystems"
                color="#00599b"
                to="food-ecosystems-biodiversity"
              />
              <!--<button
                class="button"
                style="background-color:#ffab02; outline-color:#ffab02"
                @click="$router.push({ name: 'energy' })">
                  Energy Production
              </button>
              <button
                class="button"
                style="background-color:#ec5f65; outline-color:#ec5f65"
                @click="$router.push({ name: 'transport-emission' })">
                  Transport &amp; Emissions
              </button>
              <button
                class="button"
                style="background-color:#0097d7; outline-color:#0097d7"
                @click="$router.push({ name: 'green-finance' })">
                  Green Finance
              </button>
              <button
                class="button"
                style="background-color:#00599b; outline-color:#00599b"
                @click="$router.push({ name: 'food-ecosystems-biodiversity' })">
                  Food Production &amp; Ecosystems
              </button>
              -->
            </v-row>
          </div>

          <img class="rounded-xl" src="https://user-images.githubusercontent.com/4036819/188458655-673c2b59-cba8-44b0-903a-1482e0e53f60.png" />
          <!--<v-row class="gtif-dashboard-row fill-width bg-primary rounded-lg overflow-hidden" elevation="3">
            <gtif-tile />

            <v-col
              cols="12"
              md="6"
              class="gtif-dashboard-col"
              style="background: transparent;"
            >
              <div style="background: #FFF; height: 100%;">
                <iframe class="item" src="https://eodash.eox.at/iframe?poi=100058-OX" width="100%" height="100%" frameBorder="0" scroll="no" style="overflow:hidden"></iframe>
              </div>
            </v-col>
          </v-row>-->

        </v-container>

        <!--<div class="section pb-16">
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
        </v-container>-->
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
import GtifTile from '@/components/GTIF/GTIFTile.vue';
import GtifBubble from '@/components/GTIF/GTIFBubble.vue';

export default {
  components: {
    GlobalFooter,
    GlobalHeader,
    Hero,
    GtifNavigation,
    GtifTile,
    GtifBubble,
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
        // console.log(this.glData);
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
  height: 464px;
  padding: 0 !important;
}
.button {
  font-weight: bold;
  border: none;
  color: white;
  width: 180px;
  height: 180px;
  padding: 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px 20px;
  border-radius:50%;
  outline-width: 2px;
  outline-style: solid;
  outline-offset: 8px;
}

.ellipse {
  border-bottom-left-radius: 100% 80%;
  border-bottom-right-radius: 100% 80%;
  border-top-left-radius: 0% 0%;
  border-top-right-radius: 0% 0%;
}
</style>
