<template>
  <div class="hero">
    <div class="overlay d-flex flex-column justify-center align-center">
      <h2 class="text-h2 mb-5 white--text">You and Earth Observation</h2>
      <h5 class="text-h5 mb-10 white--text">A Tri-Agency Dashboard by NASA, ESA, JAXA</h5>
      <p class="mb-10 white--text">
        <!-- eslint-disable vue/no-v-html -->
        International collaboration among space agencies is central to the success of satellite Earth observations and data analysis. These partnerships foster more comprehensive measurements, robust datasets, and cost-effective missions.
        <!-- eslint-enable -->
      </p>
      <v-btn
        elevation="2"
        color="white"
        class="black--text"
        x-large
      >Start Exploring</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
};
</script>

<style lang="scss">
  .hero {
    background-image: url('../../assets/landing-page-bg.jpg');
    background-color: #000;
    height: calc(100vh - 104px);
    width: 100vw;
    margin-top: 76px;

    .overlay {
      background: #000B;
      width: 100%;
      height: 100%;
      text-align: center;

      p {
        max-width: 700px;
      }
    }
  }
</style>
