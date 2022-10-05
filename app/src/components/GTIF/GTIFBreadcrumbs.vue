<template>
  <v-row
    justify="between"
    align="center"
  >
  </v-row>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'GtifHeaderNavItem',
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.gtif-breadcrumbs {
  background: #77F;
}
</style>
