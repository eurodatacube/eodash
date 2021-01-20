<template>
  <v-btn
    color="primary"
    text
    small
    @click="addToDashboard"
  >
    <v-icon left>mdi-view-dashboard</v-icon>
    add to custom dashboard
  </v-btn>
</template>

<script>
import {
  mapMutations,
} from 'vuex';

export default {
  props: {
    indicatorObject: Object,
  },
  methods: {
    ...mapMutations('dashboard', [
      'ADD_DASHBOARD_FEATURES',
    ]),
    addToDashboard() {
      this.ADD_DASHBOARD_FEATURES([
        {
          poi: this.getLocationCode(this.indicatorObject),
          width: 4,
        },
      ]);
    },
  },
};
</script>
