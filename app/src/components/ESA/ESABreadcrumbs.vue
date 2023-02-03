<template>
  <div
    class="gtif-breadcrumbs"
    :style="{'margin-left': $route.name === 'explore' ? '88px' : '0'}"
  >
    <div class="fill-width fill-height d-flex justify-between align-center pl-6">
      <router-link :to="{name: 'landing'}">
        <span class="bold">GTIF</span>
        <span class="px-2">|</span>
        <span>Green Transition Information Factory</span>
      </router-link>

      <span v-if="firstBreadcrumb.length > 0">
        <span class="px-2">&gt;</span>
        <span class="">{{ firstBreadcrumb }}</span>
      </span>

      <span v-if="secondBreadcrumb.length > 0">
        <span class="px-2 green-crumb">&gt;</span>
        <span class="green-crumb">{{ secondBreadcrumb }}</span>
      </span>
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
    firstBreadcrumb() {
      switch (this.currentDomain) {
        case 'gtif-energy-transition':
          return 'Energy Transition';

        case 'gtif-mobility-transition':
        case 'gtif-social-mobility':
          return 'Mobility Transition';

        case 'gtif-sustainable-cities':
          return 'Sustainable Cities';

        case 'gtif-carbon-accounting':
          return 'Carbon Accounting';

        case 'gtif-eo-adaptation-services':
          return 'EO Adaptation Services';

        case 'landing':
          return '';

        default:
          return '';
      }
    },
    secondBreadcrumb() {
      switch (this.$route.name) {
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

        case 'landing':
          return '';

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
  z-index: 4;
  color: #CDD7DA;

  a {
    color: #CDD7DA;
    text-decoration: none;
  }

  .bold {
    font-family: 'NotesESABold';
  }

  .green-crumb {
    color: #00ae9d;
  }
}
</style>
