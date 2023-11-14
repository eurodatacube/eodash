<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>
    <v-row>
      <v-col>
        <h3>
          2023-11-03: New data, notebooks, and tutorials
        </h3>
        <ul>
          <li>New dataset added: Global Human Settlement
            <a href="explore?poi=World-GHSBUILT">
            View Dataset JRC GHS-BUILT-S R2023A
          </a></li>
          <li>ESA, NASA, JAXA present an
            <a href="//bigdatafromspace2023.org/satellite-events">
            EO Dashboard tutorial at Big Data From Space 2023
          </a></li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    headingClass() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'text-h4';
        case 'sm': return 'text-h3';
        case 'md': return 'text-h3';
        case 'lg': return 'text-h2';
        case 'xl': return 'text-h2';

        default: return 'text-h2';
      }
    },
  },
};
</script>
