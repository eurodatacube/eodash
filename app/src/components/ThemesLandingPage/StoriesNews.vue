<template>
  <v-container
    class="ma-0  px-4 px-md-8"
    style="max-width: 1400px;"
  >
    <h3 class="mb-10" :class="[headingClass]">News</h3>
    <v-row>
      <v-col>
        <h3>
          New story editor!
        </h3>
        <p>
          Currently only for testing, your feedback is welcome,
          more documentation and information comming soon!
        </p>
        <p>
          You can have a first glance <a href="./story-editor">here</a>!
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          2024-02-08: Challenge announcement!!
        </h3>
        <h4>
          Unveil the secrets of Earth’s Dynamic Systems: Join the Open Challenge!
        </h4>
        <p>
          Only 20 spots available! Register before 15 February! Go to <a href="https://eo4society.esa.int/event/sciencehubchallengefeb2024/" target="_blank" >
            https://eo4society.esa.int/event/sciencehubchallengefeb2024/
          </a> for more information.
        </p>
        <div style="width: 100%; text-align: center;">
          <a href="https://eo4society.esa.int/event/sciencehubchallengefeb2024/" target="_blank">
            <img
              :src="`${publicPath}data/trilateral/Science-Hub_Challenge-240202_v2.jpg`"
              style="max-width: 100%; max-height: 500px;"
            />
          </a>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          2023-11-29: Several new datasets added to theme BIOMASS
        </h3>
        <ul>
          <li>Datasets contributed by ESA CCI RECCAP-2 project
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
    publicPath() {
      return process.env.BASE_URL;
    },
  },
};
</script>
