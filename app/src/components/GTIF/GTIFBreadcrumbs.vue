<template>
  <div class="gtif-breadcrumbs">
    <div class="fill-width fill-height d-flex justify-between align-center">

    </div>
  </div>
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
  width: 100%;
  height: 48px;
  position: fixed;
  top: 64px;
}
</style>
