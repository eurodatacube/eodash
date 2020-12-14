<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{}">
      <v-btn
        color="primary"
        text
        small
        @click="dialog = true"
      >
        <template v-if="showMap">
          <v-icon left>mdi-map-search</v-icon>
          embed map
        </template>
        <template v-else>
          <v-icon left>mdi-poll-box</v-icon>
          embed chart
        </template>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Embed this chart into your website
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

export default {
  mixins: [dialogMixin],
  props: ['indicatorObject'],
  data: () => ({
    dialog: false,
    copySuccess: false,
  }),
  computed: {
    iframeCode() {
      return `<iframe class="item" src="${window.location.origin}/iframe?poi=${this.getLocationCode(this.indicatorObject)}${this.$route.query.sensor ? `&sensor=${this.$route.query.sensor}` : ''}" width="800px" height="500px" frameBorder="0" scroll="no" style="overflow:hidden"></iframe>`;
    },
    showMap() {
      return ['all'].includes(this.indicatorObject.country) || Array.isArray(this.indicatorObject.country);
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
