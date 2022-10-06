<template>
  <div class="gtif-breadcrumbs">
    <div class="fill-width fill-height d-flex justify-between align-center pl-6">
      <span class="bold">GTIF</span>
      <span class="px-2">|</span>
      <span>Green Transition Information Factory</span>
      <span class="px-2">&gt;</span>
    </div>
  </div>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'GtifBreadcrumbs',
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.gtif-breadcrumbs {
  background: #1E4B5F;
  width: 100%;
  height: 48px;
  position: fixed;
  top: 64px;
  font-size: 18px;
  color: #CDD7DA;

  .bold {
    font-family: 'NotesESABold';
  }
}
</style>
