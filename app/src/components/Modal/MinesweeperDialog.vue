<template>
  <div class="modal-success">
    <div class="d-flex flex-column align-center justify-center py-16">
      <v-icon size="64" color="green lighten-4">💣</v-icon>
      <h2 class="white--text my-4">Welcome to Minesweeper</h2>

      <p>
        Try to uncover all fields while carefully avoiding mines and learn about 
        Earth Observation data along the way.
      </p>

      <v-btn class="mt-4 green darken-3 white--text" @click="$emit('close')">Dismiss</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * The context in which this modal is used. One of 'dashboard' or 'newsletter'.
     * Changing this parameter changes this modal's title and subtitle as well as
     * the arrangement of its inputs.
     */
    mode: {
      type: String,
      default: 'start',
    },
  },
  methods: {
    close() {
      this.$emit('close');
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
