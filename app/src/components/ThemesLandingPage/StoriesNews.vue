<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>
    <v-row>
      <v-col>
        <h3>
          2023-05-23: Space for Climate Protection awarded to EO Dashboard!
        </h3>
        <p>
          <a target="_blank" href="https://www.esa.int/Applications/Observing_the_Earth/ESA_receives_Space_for_Climate_Protection_Award">EO Dashboard receives the 'Space for Climate Protection' Special Award by the International Astronautical Federation during the 2023 Global Space Conference on Climate Change in Oslo, Norway</a>.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          2023-03-13: Three new stories published in Cryosphere.
        </h3>
        <p>
          Learn about the research of NASA, ESA and JAXA on glaciers
          and other ice formations in Antarctica and Greenland that
          have potential to affect our global climate system.
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
  },
};
</script>
