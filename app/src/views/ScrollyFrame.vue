<template>
  <div
    class="fill-height scrollContainer"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height"
    >
      <global-header />

      <iframe
        id="resizableIframe"
        @load="onLoaded"
        v-resize="onResize"
        width="100%"
        style="height: calc((var(--vh), 1vh) * 100) !important;"
        src="./scrolly.html"
        frameborder="0"
      ></iframe>
      <global-footer />
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import axios from 'axios';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import GlobalFooter from '@/components/GlobalFooter.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';

export default {
  components: {
    GlobalHeader,
    GlobalFooter,
  },
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  mounted() {
    window.onmessage = (e) => {
      // Check if we got a navigation request from the iframe.
      if (e.data.type == 'nav') {
          this.$router.push({name: e.data.dest});
      }
    };
  },
  methods: {
    async onLoaded() {
      try {
        let id = this.getDashboardID();

        const response = await axios
          .get(`https://${process.env.NODE_ENV !== 'production'
            ? 'dev-'
            : ''}eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id=${id}`);
            // /dashboard?id=9dd9f2b6743c9746&editKey=0017ee8a3e16f9b8

        document.querySelector('iframe').contentWindow.postMessage(response.data);
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
        scrolling: true,
        minHeight: this.minHeight || 700,
      }, '#resizableIframe');
    },
    getDashboardID() {
      switch (this.$route.name) {
        case 'landing':
          return '7828358850802a35';

        case 'gtif-energy-transition':
          return '0f2e9b3e9ac1bc35';

        case 'gtif-mobility-transition':
          return '2b5489be6f959f1e';

        case 'gtif-sustainable-transition':
          return '000c2eb018897d82';

        case 'gtif-carbon-finance':
          return 'a5a6e77d28a4f541';

        case 'gtif-eo-adaptation':
          return '844374958b90378b';

        // Fallback value
        default:
          return '9dd9f2b6743c9746';
      }
    }
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
