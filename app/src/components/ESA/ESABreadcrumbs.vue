<template>
  <div
    class="gtif-breadcrumbs"
    :style="{'margin-left': $route.name === 'explore' ? '88px' : '0'}"
  >
    <div class="fill-width fill-height d-flex justify-between align-center pl-6">
      <span class="bold">GTIF</span>
      <span class="px-2">|</span>
      <span>Green Transition Information Factory</span>
      <span v-if="currentDomain.length > 0">
        <span class="px-2">&gt;</span>
        <span class="">{{ currentBreadcrumb(currentDomain) }}</span>
      </span>
      <span v-if="areBreadcrumbsEnabled" class="px-2 green-crumb">&gt;</span>
      <span v-if="areBreadcrumbsEnabled" class="green-crumb">{{ currentBreadcrumb($route.name) }}</span>
    </div>
  </div>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'ESABreadcrumbs',
  props: {
    areBreadcrumbsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    ...mapState('gtif', [
      'currentDomain',
    ]),
  },
  methods: {
    currentBreadcrumb(name) {
      switch (name) {
        case 'gtif-energy-transition':
          return 'Energy Transition';

        case 'gtif-mobility-transition':
          return 'Mobility Transition';

        case 'gtif-sustainable-cities':
          return 'Sustainable Cities';

        case 'gtif-social-mobility':
          return 'Social Mobility';

        case 'gtif-carbon-accounting':
          return 'Carbon Accounting';

        case 'gtif-eo-adaptation-services':
          return 'EO Adaptation Services';

        case 'explore':
          return 'Explore Tool';

        default:
          return '';
      }
    },
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

  .green-crumb {
    color: #00ae9d;
  }
}
</style>
