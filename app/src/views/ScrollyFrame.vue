<template>
  <div
    class="fill-height"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height"
    >
      <global-header />

      <ESABreadcrumbs
        :are-breadcrumbs-enabled="areBreadcrumbsEnabled"
      />

      <v-container>
        <iframe
        id="resizableIframe"
        @load="onLoaded"
        width="100%"
        style="
          height: calc(100vh - 112px) !important;
          position: fixed; left: 0; bottom: 0; top: 112px;
        "
        src="http://localhost:5173"
        frameborder="0"
      ></iframe>
      </v-container>
      <!--<global-footer />-->
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import axios from 'axios';
import GlobalHeader from '@/components/GlobalHeader.vue';
import ESABreadcrumbs from '@/components/ESA/ESABreadcrumbs.vue';

export default {
  components: {
    GlobalHeader,
    ESABreadcrumbs,
  },
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  data() {
    return {
      areBreadcrumbsEnabled: false,
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
    this.setBreadcrumbsEnabled();

    const footer = await axios.get('./data/gtif/components/footer.json');
    const bottom = await axios.get('./data/gtif/components/bottom.json');
    const header = await axios.get('./data/gtif/components/header.json');

    this.footer = footer.data;
    this.bottomNav = bottom.data;
    this.header = header.data;

    window.onmessage = (e) => {
      // Check if we got a navigation request from the iframe.
      if (e.data.type === 'nav') {
        this.$router.push({ name: e.data.dest });
        this.setBreadcrumbsEnabled();
      }
    };
  },
  methods: {
    async onLoaded() {
      try {
        const res = await axios.get(`./data/gtif/scrollies/${this.$route.name}.json`);

        // --------------------------------
        // IMPORTANT, DO NOT REMOVE!
        // Cache Invalidation Call
        const justForSideEffects = await axios.get('./data/gtif/components/bottom.json');
        const justForSideEffect = await axios.get('./data/gtif/scrollies/gtif-energy-transition.json');
        // ---------------------------------------------------^

        this.linkStyle('http://gtif.eox.world:8812/css/gtif-scrolly.css');
        this.setScrollyStory(res.data);

        this.setComponentHook('beforeFooter', this.bottomNav, { routeName: this.$route.name });
        this.setComponentHook('footer', this.footer);
        this.setComponentHook('header', this.header,          { routeName: this.$route.name });
      } catch (error) {
        console.error(`Error loading dashboard data: ${error}`);
      }
    },
    /**
     * Add the CSS styles from a given path to the iframe.
     *
     * @param {string} path - The path of the style to be applied.
     */
    linkStyle(path) {
      /*
        TODO: find a way to use SCSS for dedicated iframe styles
        const gtifScss = require(`../../public/css/gtif.scss`);
        console.log(gtifScss);
      */
      document.querySelector('#resizableIframe').contentWindow.postMessage(
        {
          type: 'css',
          path,
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
        props: props,
      }, '*');
    },
    setBreadcrumbsEnabled() {
      switch (this.$route.name) {
        case 'gtif-energy-transition':
        case 'gtif-mobility-transition':
        case 'gtif-sustainable-transition':
        case 'gtif-carbon-finance':
        case 'gtif-eo-adaptation':
        case 'gtif-social-mobility':
          this.areBreadcrumbsEnabled = true;
          break;

        default:
          this.areBreadcrumbsEnabled = false;
      }
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
