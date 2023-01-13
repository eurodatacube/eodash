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
        v-resize="onResize"
        width="100%"
        style="
          height: calc(100vh - 112px) !important;
          position: fixed; left: 0; bottom: 0; top: 112px;
        "
        src="./scrollytelling/index.html"
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
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import GlobalHeader from '@/components/GlobalHeader.vue';
import ESABreadcrumbs from '@/components/ESA/ESABreadcrumbs.vue';

import dashboardToScrolly from '@/helpers/dashboardToScrolly.js';

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
      data: [],
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  async mounted() {
    this.setBreadcrumbsEnabled();

    let bottom = await axios.get('./scrollytelling/bottom.json');
    this.bottomNav = bottom.data;

    let footer = await axios.get('./scrollytelling/footer.json');
    this.footer = footer.data;

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
        let res = await axios.get(`./data/gtif/scrollies/${this.$route.name}.json`);

        // --------------------------------
        // IMPORTANT, DO NOT REMOVE!
        // Cache Invalidation Call
        const justForSideEffects = await axios.get('./scrollytelling/index.html');
        // ---------------------------------------------------^

        const iframe = document.querySelector('iframe');
        this.linkStyle('../css/gtif-scrolly.css');

        iframe.contentWindow.postMessage(
          {
            type: 'items',
            data: res.data,
          },
          '*'
        );
        iframe.contentWindow.postMessage({
          type: 'hook:beforeFooter',
          data: this.bottomNav,
        }, '*');
        iframe.contentWindow.postMessage({
          type: 'hook:footer',
          data: this.footer,
        }, '*');
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
      let link = document.createElement('link');
      link.href = path;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      document.getElementById('resizableIframe').contentDocument.head.appendChild(link);
    },
    onResize() {
      iFrameResize({
        // log: true,
        checkOrigin: false,
        inPageLinks: false,
        sizeHeight: false,
        scrolling: false,
        // minHeight: this.minHeight
        //   || window.innerHeight
        //       - 64
        //       - 48,
      }, '#resizableIframe');
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
