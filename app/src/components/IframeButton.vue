<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{}">
      <template v-if="mapControl">
        <v-tooltip left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :color="$vuetify.theme.currentTheme.background"
              small
              class="dashboard-button"
              style="min-width: 0;"
              v-on="{ ...tooltip, ...dialog }"
              @click="dialog = true"
            >
              <v-icon>
                mdi-code-tags
              </v-icon>
            </v-btn>
          </template>
          <span>Embed this map into your website</span>
        </v-tooltip>
      </template>
      <v-btn
        v-else
        color="primary"
        text
        small
        @click="dialog = true"
      >
        <template v-if="!showMap">
          <v-icon left>mdi-code-tags</v-icon>
          embed chart
        </template>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Embed this element into your website
      </v-card-title>

      <v-card-text class="py-5">
        Copy and paste this code into your HTML file:
        <code class="pa-3">{{ iframeCode }}
        </code>
        <div class="d-flex align-center justify-end pt-3">
          <v-expand-transition>
            <div v-if="copySuccess" class="success--text mr-3">
            <v-icon
              color="success"
              left
            >mdi-clipboard-check-outline</v-icon>
              <small>copied!</small>
            </div>
          </v-expand-transition>
          <v-btn
            small
            text
            @click="copy(iframeCode)"
          >
            <v-icon left>mdi-content-copy</v-icon>
            copy to clipboard
          </v-btn>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin';
import {
  mapState,
} from 'vuex';

export default {
  mixins: [dialogMixin],
  props: {
    indicatorObject: Object,
    mapControl: Boolean,
    embedMap: {
      type: Boolean,
      default: false,
    },
    center: Object,
    zoom: Number,
  },
  data: () => ({
    dialog: false,
    copySuccess: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    iframeCode() {
      let queryParams = `poi=${this.getLocationCode(this.indicatorObject)}`;
      if (this.embedMap) {
        queryParams += `&embedMap=${this.embedMap}`;
        if (this.zoom !== null) {
          queryParams += `&z=${this.zoom}`;
        }
        if (this.center?.lat) {
          queryParams += `&lat=${this.center?.lat}`;
          queryParams += `&lng=${this.center?.lng}`;
        }
      }
      return `<iframe class="item" src="${window.location.origin}/iframe?${queryParams}" width="800px" height="500px" frameBorder="0" scroll="no" style="overflow:hidden"></iframe>`;
    },
    showMap() {
      return ['all'].includes(this.indicatorObject.country) || this.appConfig.configuredMapPois.includes(`${this.indicatorObject.aoiID}-${this.indicatorObject.indicator}`) || Array.isArray(this.indicatorObject.country);
    },
  },
  methods: {
    async copy(s) {
      await navigator.clipboard.writeText(s);
      this.copySuccess = true;
    },
  },
};
</script>

<style scoped>
  .dashboard-button {
    width: 36px;
    height: 36px !important;
    z-index: 2;
    pointer-events: initial;
  }
</style>
