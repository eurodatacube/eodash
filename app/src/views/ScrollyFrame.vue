<template>
  <div
    class="fill-height"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height"
    >
      <global-header />

      <v-container>
        <iframe
          id="resizableIframe"
          @load="onLoaded"
          width="100%"
          style="
            height: calc(100vh - 112px) !important;
            position: fixed; left: 0; bottom: 0; top: 112px;
          "
          src="http://localhost:5173/"
          frameborder="0"
          scrolling="no"
        >
        </iframe>

        <feedback-button />
      </v-container>
      <!--<global-footer />-->
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';

import axios from 'axios';
import GlobalHeader from '@/components/GlobalHeader.vue';
import FeedbackButton from '@/components/FeedbackButton.vue';

import dashboardToScrolly from '../helpers/dashboardToScrolly';
import storiesConfig from '../config/stories.json';

export default {
  components: {
    GlobalHeader,
    FeedbackButton,
  },
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  data() {
    return {
      footer: null,
      bottomNav: null,
      header: null,
      data: [],
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  async mounted() {
    window.onmessage = (e) => {
      // Check if we got a navigation request from the iframe.
      if (e.data.type === 'nav') {
        this.$router.push({ name: e.data.dest });
      }
      if (e.data.type === 'explore') {
        this.setCurrentDomain(e.data.domain);
        this.$router.push({ name: 'explore' });
      }
    };

    switch (this.$route.name) {
      case 'gtif-energy-transition':
      case 'gtif-mobility-transition':
      case 'gtif-sustainable-cities':
      case 'gtif-carbon-accounting':
      case 'gtif-eo-adaptation-services':
      case 'landing':
        this.setCurrentDomain(this.$route.name);
        return '';

      default:
        return '';
    }
  },
  methods: {
    ...mapActions('gtif', [
      'setCurrentDomain',
    ]),
    async onLoaded() {
      const css = await axios.get('./css/gtif-scrolly.css');

      const footer = await axios.get('./data/gtif/components/footer.json');
      const bottom = await axios.get('./data/gtif/components/bottom.json');
      const header = await axios.get('./data/gtif/components/header.json');

      this.footer = footer.data;
      this.bottomNav = bottom.data;
      this.header = header.data;

      let items;

      try {
        const res = await axios
          .get(`./data/dashboards/${this.getDashboardID()}.json`, {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0',
            },
          });

        items = dashboardToScrolly(res.data.features);
      } catch (_e) {
        items = [
          [
            {
              width: 1,
              text: `<p>Graz is a beautiful city located in the southeastern region of Austria. Although the city boasts of clean air and picturesque landscapes, the air quality in Graz is generally mediocre. <br /><br /> According to recent data, Graz ranks as one of the most polluted cities in Austria. The air pollution is a result of various factors such as traffic, industrial activities, and residential heating.</p><p>During the winter months, the air quality in Graz worsens due to increased emissions from residential heating. As the temperatures drop, people rely more on heating to keep their homes warm, which leads to higher emissions of pollutants. The increased emissions, coupled with the weather conditions during winter, create a smoggy environment that is harmful to human health.</p>`,
              id: 'ABC1234567890',
            },
            {
              width: 3,
              mapInfo: {
                poi: 'AT-AQ5',
                timeline: [
                  {
                    center: {
                      lng: 15.421371,
                      lat: 46.876668,
                    },
                    zoom: 6.0,
                    duration: 0.0,
                    layers: {
                      enable: ['EOxCloudless 2021'],
                      disable: ['Terrain light'],
                    },
                  },
                  {
                    center: {
                      lng: 15.421371,
                      lat: 47.076668,
                    },
                    time: "2023-01-14",
                    zoom: 11.5,
                    duration: 0.25,
                    layers: {
                      enable: ['EOxCloudless 2021'],
                      disable: ['Terrain light', 'Averaged NO2'],
                    },
                  },
                  {
                    center: {
                      lng: 15.421371,
                      lat: 47.076668,
                    },
                    zoom: 11.6,
                    times: [
                      "2022-09-08",
                      "2022-10-08",
                      "2022-11-08",
                      "2022-12-08",
                    ],
                    duration: 0.25,
                    layers: {
                      enable: ['Averaged NO2'],
                      disable: [],
                    },
                  },
                  {
                    center: {
                      lng: 15.421371,
                      lat: 47.076668,
                    },
                    zoom: 11.7,
                    duration: 0.25,
                  },
                  {
                    center: {
                      lng: 15.421371,
                      lat: 47.076668,
                    },
                    zoom: 11.7,
                    duration: 0.25,
                  },
                ],
              },
              id: 'CBA0987654321',
            },
          ],
        ];
      }

      this.linkStyle(css.data);
      this.setScrollyStory(items);

      console.log(process.env.BASE_URL);

      if (this.$route.name === 'landing') {
        this.setComponentHook('beforeFooter', this.bottomNav, { routeName: this.$route.name });
      }
      this.setComponentHook('footer', this.footer);
      this.setComponentHook('header', this.header, { routeName: this.$route.name });
    },
    /**
     * Add the CSS styles from a given path to the iframe.
     *
     * @param {string} path - The path of the style to be applied.
     */
    linkStyle(css) {
      /*
        TODO: find a way to use SCSS for dedicated iframe styles
        const gtifScss = require(`../../public/css/gtif.scss`);
        console.log(gtifScss);
      */
      document.querySelector('#resizableIframe').contentWindow.postMessage(
        {
          type: 'css',
          css,
        },
        '*',
      );
    },
    /**
     * Send an `items` message to the iframe, which sets the content of the scrolly story.
     *
     * @param {string} items - The array of entries in scrollytelling format.
     */
    setScrollyStory(items) {
      document.querySelector('#resizableIframe').contentWindow.postMessage(
        {
          type: 'items',
          data: items,
        },
        '*',
      );
    },
    /**
     * Send a `hook:...` message, injecting a JSON component into a specific location.
     *
     * @param {string} path - The path of the style to be applied.
     */
    setComponentHook(hookName, jsonComponent, props) {
      document.querySelector('#resizableIframe').contentWindow.postMessage({
        type: `hook:${hookName}`,
        data: jsonComponent,
        props,
      }, '*');
    },

    getDashboardID() {
      const brand = this.appConfig.id;
      const name = this.$route.name.replace('gtif-', '');

      return storiesConfig[brand][name][name]
        .originalDashboardId;
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}

#content {
  width: 1px;
  min-width: 100%;
  height: 100%;
  border: none;
}

::v-deep .feedback-button {
  position: fixed;
  right: 32px;
  bottom: 16px;
}
</style>
