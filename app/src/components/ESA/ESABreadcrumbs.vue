<template>
  <div
    class="gtif-breadcrumbs"
  >
    <div class="fill-width fill-height d-flex justify-between align-center pl-6">
      <router-link :to="{name: 'landing'}">
        <span class="bold">GTIF</span>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <span class="px-2">|</span>
          <span>Green Transition Information Factory</span>
        </template>
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
    domains: {
      type: Array,
      required: true,
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
      const foundDomain = this.domains.find((d) => d.slug === this.currentDomain);
      if (!foundDomain) {
        return '';
      }
      return foundDomain.name;
    },
    secondBreadcrumb() {
      if (!this.firstBreadcrumb) {
        return '';
      }
      const foundRoute = this.domains
        .find((d) => d.name === this.firstBreadcrumb).narratives
        .find((n) => n.routeName === this.$route.name);
      return foundRoute ? foundRoute.name : '';
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
