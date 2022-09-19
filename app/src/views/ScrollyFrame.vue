<template>
  <div
    class="fill-height scrollContainer"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height"
    >
      <v-app-bar
        app
        clipped-left
        clipped-right
        flat
        color="primary"
        class="white--text"
      >
        <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title
          v-if="$vuetify.breakpoint.mdAndUp"
          class="text-uppercase mr-5"
        >
          {{ appConfig && appConfig.branding.appName }}
        </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
      </v-app-bar>
      <iframe
        id="resizableIframe"
        @load="onLoaded"
        v-resize="onResize"
        width="100%"
        style="height: calc((var(--vh), 1vh) * 100) !important;"
        src="/scrolly.html"
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

export default {
  components: {
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
