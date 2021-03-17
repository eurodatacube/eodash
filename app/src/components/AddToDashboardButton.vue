<template>
  <v-btn
    color="primary"
    text
    small
    @click="addToDashboard"
  >
    <template v-if="!alreadyAdded">
      <v-icon left>mdi-view-dashboard</v-icon>
      add to custom dashboard
    </template>
    <template v-else>
      <v-icon left>mdi-check-bold</v-icon>
      added to custom dashboard
    </template>
  </v-btn>
</template>

<script>
import {
  mapMutations,
  mapActions,
  mapState
} from 'vuex';

export default {
  props: {
    indicatorObject: Object,
  },
  data: () => ({
    alreadyAdded: false,
  }),
  computed: {
    ...mapState('dashboard', ['dashboardConfig'])
  },
  watch: {
    dashboardConfig: {
      deep: true,
      immediate: true,
      async handler() {
        this.alreadyAdded = await this.exists({poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject) });
      }
    },
    indicatorObject: {
      deep: true,
      async handler() {
        if(this.indicatorObject)
        this.alreadyAdded = await this.exists({poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject) });
      }
    }
  },
  methods: {
    ...mapActions('dashboard', [
      'exists',
      'addFeature',
      'removeFeature'
    ]),
    async addToDashboard() {
      if (!this.alreadyAdded) {
        this.addFeature(
          {
            poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject),
            width: 4,
            includesIndicator: this.indicatorObject.includesIndicator,
            ...(this.indicatorObject.includesIndicator && { indicatorObject: this.indicatorObject })
          },
        );
      } else {
        this.removeFeature(
          {
            poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject),
            width: 4,
            includesIndicator: this.indicatorObject.includesIndicator,
            ...(this.indicatorObject.includesIndicator && { indicatorObject: this.indicatorObject })
          },
        );
      }
    },
  },
};
</script>
