<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>
    <v-row>
      <v-col>
        <h3>
          2025-02-05: NASA, ESA, and JAXA sign joint declaration to continue their collaboration on EO Dashboard through September 2026
        </h3>
        <p>
          As the project evolves, the agencies are working closely with academic and industry partners to enhance its capabilities. Future plans involve integrating cutting-edge technologies, incorporating data from new science missions like EarthCARE and PACE, supporting new joint scientific research, and launching new outreach efforts (<a href="https://raw.githubusercontent.com/eurodatacube/eodash-assets/refs/heads/main/stories/news/2024Joint Declaration_draftA-MM-AA_NS_JAXA.pdf" target="_blank">link to declaration</a>).
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          2024-07-05: EO Dashboard at IGARSS 2024
        </h3>
        <p>
          The joint ESA, NASA and JAXA team will present the tutorial HD-12: Exploring Environmental Changes with EO: a hands-on journey from data analysis to scientific communication with ESA-NASA-JAXA EO Dashboard. <a href="https://www.2024.ieeeigarss.org/tutorials.php#tut10" target="_blank">https://www.2024.ieeeigarss.org/tutorials.php#tut10</a>
        </p>
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
    publicPath() {
      return process.env.BASE_URL;
    },
  },
};
</script>
