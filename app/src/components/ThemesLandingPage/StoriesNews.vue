<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>

    <v-row>
      <v-col>
        <p>
          NASA, ESA, and JAXA will continue through June 2024 to advance their joint work to
          communicate tri-agency scientific findings with societal impact, further developing this
          Dashboard, enhancing the data and stories, collaborating with global experts and
          communities, and promoting Open Science. Click here to read the full <a
          href="./eodash-data/general/Joint Declaration_with_signature_JAXA_ESA.pdf"
          target="_blank">Joint Declaration on
          trilateral collaboration by NASA, ESA and JAXA</a>.
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
