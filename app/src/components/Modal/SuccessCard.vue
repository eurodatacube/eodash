<template>
  <v-card
    style="overflow-y: auto; height: 100%; max-width: 100% !important;"
    class="success"
  >
    <v-progress-linear :value="progress" :size="48" color="white" background-color="transparent"></v-progress-linear>
    <div class="d-flex flex-column align-center justify-center py-16">
      <v-icon size="48" color="green lighten-4">mdi-email</v-icon>
      <h2 class="white--text my-4">You have successfully subscribed to our newsletter.</h2>
      
      <v-btn class="mt-4 green darken-3 white--text" @click="$emit('close')">Dismiss</v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    progress: 0.0,
  }),
  mounted () {
    this.progress = 0.0;
    window.setInterval(this.increaseProgress, 20);
  },
  props: {
    /**
     * The context in which this modal is used. One of 'dashboard' or 'newsletter'.
     * Changing this parameter changes this modal's title and subtitle as well as
     * the arrangement of its inputs.
     */
    mode: {
      type: String,
      default: 'newsletter',
    },
  },
  methods: {
    increaseProgress () {
      this.progress = this.progress + 0.6;

      if (this.progress >= 110.0) {
        this.progress = 0.0;
        this.$emit('close');
      }
    },
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

.mobile-modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.fullwidth {
  left: 0;
  top: 0;
}
</style>