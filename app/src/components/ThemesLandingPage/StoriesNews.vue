<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>
    <v-row>
      <v-col>
        <h3>
          2023-11-29: Several new datasets added to theme BIOMASS
        </h3>
        <ul>
          <li>Datasets contributed by ESA CCI RECCAPP-2 project
            <a href="explore?search=Biomass">
            View Datasets
          </a></li>
          <li>EO Dashboard participates to the United Nations Climate Change Conference COP28
            <a href="//www.cop28.com/">
            COP28 UAE - United Nations Climate Change Conference
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
