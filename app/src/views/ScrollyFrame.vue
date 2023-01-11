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
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  async mounted() {
    this.setBreadcrumbsEnabled();

    const footerRes = await axios.get('./scrollytelling/bottom.json');
    this.footer = footerRes.data;


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
        const id = this.getDashboardID();

        const response = await axios
          .get(`https://${process.env.NODE_ENV !== 'production'
            ? 'dev-'
            : ''}eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id=${
            id || '9dd9f2b6743c9746' // fallback default TODO remove
            // /dashboard?id=9dd9f2b6743c9746&editKey=0017ee8a3e16f9b8
          }`);

        const { features } = response.data;
        let data = [];
        var i = 0;

        while (i < features.length) {
          let current = features[i];
          let next = features[i + 1];

          if (current.width === 4) {
            if (current.text.includes('<--SCRUB-->')) {
              data.push(this.buildVideoScrub(current));
            } else if (current.text.includes('<--VID-->')) {
              data.push(this.buildVideoPlayer(current));
            } else {
              data.push([current]);
            }

            i += 1;
            continue;
          } else if (current.width === 1 && next) {
            data.push(this.buildStickyRight(current, next, i));
            i += 2;
          } else if (current.width === 3 && next) {
            data.push(this.buildStickyLeft(current, next, i));
            i += 2;
          } else {
            i += 1;
          }
        }

        let link = document.createElement('link');

        /*
        TODO: find a way to use SCSS for dedicated iframe styles
          const gtifScss = require(`../../public/css/gtif.scss`);
          console.log(gtifScss);
        */
        link.href = '../css/gtif-scrolly.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.getElementById('resizableIframe').contentDocument.head.appendChild(link);

        // --------------------------------
        // IMPORTANT, DO NOT REMOVE!
        // Cache Invalidation Call
        const justForSideEffects = await axios.get('./scrollytelling/index.html');
        // ---------------------------------------------------^

        console.log(justForSideEffects.data);

        const iframe = document.querySelector('iframe');

        iframe.contentWindow.postMessage(
          {
            type: 'items',
            data,
          },
          '*'
        );
        iframe.contentWindow.postMessage({
          type: 'footer',
          data: this.footer,
        }, '*');
      } catch (error) {
        console.error(`Error loading dashboard data: ${error}`);
      }
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
    getDashboardID() {
      switch (this.$route.name) {
        case 'landing':
          return '7828358850802a35';

        case 'gtif-energy-transition':
          return 'd2087a2c9256ff3a';

        case 'gtif-mobility-transition':
          return '784f3e1ba71aef26';

        case 'gtif-social-mobility':
          return 'ac7d1b288e92217a';

        case 'gtif-sustainable-transition':
          return '000c2eb018897d82';

        case 'gtif-carbon-finance':
          return 'a5a6e77d28a4f541';

        case 'gtif-eo-adaptation':
          return '844374958b90378b';

        // Fallback value
        default:
          return '50826821d453dfd5';
      }
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

    buildStickyRight (current, next) {
      if (next.text && next.text.includes('<--IMG-->')) {
        next.image = next.text.replaceAll('<--IMG-->', '');
      } else if (next.text && next.text.includes('<--SCRUB-->')) {
        next.scrub = next.text.replaceAll('<--SCRUB-->', '');
      } else if (next.text && next.text.includes('<--VID-->')) {
        next.video = next.text.replaceAll('<--VID-->', '');
      }

      return [current, next];
    },

    buildStickyLeft (current, next) {
      if (current.text && current.text.includes('<--IMG-->')) {
        current.image = current.text.replaceAll('<--IMG-->', '');
      } else if (current.text && current.text.includes('<--SCRUB-->')) {
        current.scrub = current.text.replaceAll('<--SCRUB-->', '');
      } else if (current.text && current.text.includes('<--VID-->')) {
        current.video = current.text.replaceAll('<--VID-->', '');
      }

      return [current, next];
    },

    buildVideoScrub (current) {
      if (current.text && current.text.includes('<--SCRUB-->')) {
        current.scrub = current.text.replaceAll('<--SCRUB-->', '');
      }

      return [current];
    },

    buildVideoPlayer (current) {
      if (current.text && current.text.includes('<--VID-->')) {
        current.video = current.text.replaceAll('<--VID-->', '');
      }

      return [current];
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
