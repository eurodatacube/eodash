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
        src="./scrollytelling/index.html"
        frameborder="0"
        scrolling="no"
      ></iframe>
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
import storiesConfig from '../config/stories.json';
import dashboardToScrolly from '../helpers/dashboardToScrolly';

export default {
  components: {
    GlobalHeader,
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
      try {
        const css = await axios.get('./css/gtif-scrolly.css');

        const footer = await axios.get('./data/gtif/components/footer.json');
        const bottom = await axios.get('./data/gtif/components/bottom.json');
        const header = await axios.get('./data/gtif/components/header.json');

        this.footer = footer.data;
        this.bottomNav = bottom.data;
        this.header = header.data;

        const res = await axios
          .get(`./data/dashboards/${this.getDashboardID()}.json`, {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0',
            },
          });

        this.linkStyle(css.data);
        this.setScrollyStory(dashboardToScrolly(res.data.features));

        console.log(process.env.BASE_URL);

        // this.setComponentHook('beforeFooter', this.bottomNav, { routeName: this.$route.name });
        this.setComponentHook('footer', this.footer);
        this.setComponentHook('header', this.header, { routeName: this.$route.name });
      } catch (error) {
        console.error(`Error loading dashboard data: ${error}`);
      }
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
</style>
