<template>
  <v-card class="eodash-newsletter-banner pa-6" style="width: 100%; max-width: 1400px;">
    <v-row justify="space-between">
      <v-col justify="center">
        <h5 class="text-h5">Get our newsletter</h5>
        <p style="margin-bottom: 0px !important;">
          Get our latest platform updates delivered straight to your inbox.
        </p>
      </v-col>

      <v-row justify="end" align="center">
        <v-dialog
          v-model="showNewsletterModal"
          width="50%"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          :hide-overlay="$vuetify.breakpoint.xsOnly"
          transition="dialog-bottom-transition"
          style="z-index: 9999;"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-6 d-flex newsletter-button"
              color="secondary"
              dark
              large
              v-bind="attrs"
              v-on="on"
              @click="d => { showNewsletterModal = true }"
            >
              Get our newsletter
            </v-btn>
          </template>

          <modal
            title="Subscribe to our newsletter"
            @submit="d => { showNewsletterModal = false }"
            @close="d => { showNewsletterModal = false }"
          />
        </v-dialog>
      </v-row>
    </v-row>
  </v-card>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
  data: () => ({
    showNewsletterModal: false,
  }),
  components: {
    Modal,
  },
  computed: {
    paddingClasses() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return ['pa-4'];
        case 'sm': return ['pa-4'];
        case 'md': return ['pa-12'];
        case 'lg': return ['pa-12'];
        case 'xl': default: return ['pa-12'];
      }
    },
  },
  props: {
    /**
     * Designates if the banner should always use the small layout.
     * For use in embedded situations where a full size banner is inapproriate.
     */
    alwaysSm: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.eodash-newsletter-banner {
  position: relative;

  .close-button {
    position: absolute;
    right: 18px;
    top: 18px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}
</style>
