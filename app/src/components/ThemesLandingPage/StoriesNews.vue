<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>

    <v-row>
      <v-col>
        <h3>
          2023-02-10: Three new stories published in Cryosphere.
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
