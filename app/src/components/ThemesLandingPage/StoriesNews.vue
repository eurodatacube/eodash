<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>
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
    <v-row>
      <v-col>
        <h3>
          2024-05-10: 3rd Earth System Science Challenge on EO data analysis and storytelling
        </h3>
        <p>
          ESA’s Science Hub hosts the 3rd edition of the Earth System Science Challenges from 13-17 May 2024 in ESRIN, Frascati, Italy. PhD students from University of Edinburgh and University of Leeds will solve EO data science challenges to address impactful topics. <br>Their stories will be featured on EO Dashboard.
        </p>
        <p>Read more here: <a href="https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/" target="_blank" >https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge</a>
        </p>
        <div style="width: 100%; text-align: center;">
          <a href="https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge" target="_blank">
            <img
              :src="`${publicPath}data/trilateral/Science-Hub_Challenge2_240502.png`"
              style="max-width: 100%; max-height: 500px;"
            />
          </a>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          2024-04-12: New biomass story published!
        </h3>
        <p><b>Forests on the Brink: Satellite Imagery unveiling Loss and Shifting Forest Landscapes</b></p>
        <p>
          Explore the interactive story <a href="./story?id=forests-on-the-brink">here</a>!
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
