<template>
  <div
class="gtif-breadcrumbs"
>
<div class="fill-width fill-height d-flex justify-between align-center pl-6">
 <v-row class="d-flex align-center">
  <v-col cols="10" class="align-center">
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

      <span v-if="secondBreadcrumb.length > 0 && $vuetify.breakpoint.SmAndUp">
        <span class="px-2 green-crumb">&gt;</span>
        <span class="green-crumb">{{ secondBreadcrumb }}</span>
      </span>
    </v-col>
    <v-col cols="2" class="flex-column align-center justify-center">
         <v-btn-toggle
          group background-color="#CDD7DA"
          borderless v-model="toggle_exclusive">
           <v-btn >
            <img
              src="../../../public/img/gtif/icons/menu-narrative.svg"
              class="mr-2" height="26"
            />
             <!-- <v-icon>mdi-format-align-left</v-icon> -->
           </v-btn>
           <v-btn>
            <img
            src="../../../public/img/gtif/icons/menu-explore.svg"
            class="mr-2" height="26"
            />
          </v-btn>
         </v-btn-toggle>
       </v-col>
     </v-row>
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
  /* TODO: this is mostly a quick fix, for the breadcrumbs in the custom dashboard panel
  there is most probably a better way of doing this */
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 64px;
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
