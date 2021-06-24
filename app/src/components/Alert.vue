<template>
  <v-alert
    v-if="showAlert"
    class="alert"
    border="right"
    elevation="2"
    colored-border
    :type="$store.state.alert.type"
    prominent>
    <v-row align="center">
      <v-col class="grow">
        {{ $store.state.alert.message }}
      </v-col>
      <v-col class="shrink">
        <v-btn icon @click="clearAlert">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  computed: {
    showAlert() {
      return this.$store.state.alert.message !== '';
    },
  },
  methods: {
    clearAlert() {
      this.$store.commit('sendAlert', {
        message: '',
        type: '',
      });
    },
  },
};
</script>

<style>
.alert {
  position: fixed;
  z-index: 9999;
  right: 10px;
  top: 70px;
}
</style>
