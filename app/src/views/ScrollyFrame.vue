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
  methods: {
    async onLoaded() {
      try {
        const response = await axios
          .get(`https://${process.env.NODE_ENV !== 'production'
            ? 'dev-'
            : ''}eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id=${
            this.$route.query.id || '9dd9f2b6743c9746' // fallback default TODO remove
            // /dashboard?id=9dd9f2b6743c9746&editKey=0017ee8a3e16f9b8
          }`);
        const { features } = response.data;

        // Calculate the positions of the full-width blocks in the array
        const indexes = [];
        for (let i = 0; i < features.length; i++) {
          if (features[i].width === 4) {
            indexes.push(i);
          }
        }

        // Slice and push the full-width blocks, and the blocks between them into separate arrays
        // If there are no full-width blocks, just push the whole features array
        let data = [];
        let nextIndex = 0;
        if (indexes.length) {
          for (let i = 0; i < indexes.length; i++) {
            data.push(features.slice(nextIndex, indexes[i] + 1));
            data.push(features.slice(indexes[i] + 1, indexes[i + 1]));
            nextIndex = indexes[i + 1];
          }

          // Remove possible empty arrays
          data = data.filter((e) => e.length);
        } else {
          data.push(features);
        }

        document.querySelector('iframe').contentWindow.postMessage(data);
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
