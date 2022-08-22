<template>
  <v-row no-gutters class="d-flex flex-row align-start px-3 pt-16 px-md-8">
    <img
      src="data/gtif/images/Natural_energy_inputs_chart.jpeg"
      width="100%"
      class="pl-xs-0 pl-sm-0 pl-md-8 pl-lg-8 pl-xl-8"
    />
    <p>S: STATISTICS AUSTRIA, Physical Energy Flow Accounts. Compiled on 16 May 2022.</p>
    <iframe
      :src="`https://www.statistik.at/atlas/?mapid=them_energie_klimafonds&layeri`"
      width="100%"
      height="800px"
      frameborder="0" >
    </iframe>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
</style>
