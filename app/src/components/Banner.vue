<template>
  <v-banner v-if="appConfig && appConfig.newsBanner" two-line>
    <v-avatar
      slot="icon"
      :color="appConfig.newsBanner.color"
      size="40"
    >
      <v-icon
        icon="mdi-lock"
        color="white"
      >
        mdi-{{appConfig.newsBanner.icon}}
      </v-icon>
    </v-avatar>
    <span v-html="appConfig.newsBanner.text" />
  </v-banner>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
// .v-banner {
//   position: absolute;
//   top: 0;
//   z-index: 999;
// }
</style>
