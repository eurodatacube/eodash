<template>
  <div class="gtif-dashboard-tile d-flex rounded-lg bg-primary">

  </div>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'GtifTile',
  props: {
    type: String,
    required: true,
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.gtif-dashboard-tile {

}
</style>
