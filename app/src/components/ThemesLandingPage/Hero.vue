<template>
  <div class="hero">
    <div class="overlay d-flex flex-row">
      <!--<div class="hero-section d-flex flex-column justify-center align-center image">
        
      </div>-->
    </div>
    <div class="hero-section d-flex flex-column justify-center align-center">
      <h2 class="text-h2 mb-5 white--text">You and Earth Observation</h2>
      <!--<h5 class="text-h5 mb-10 white--text">A Tri-Agency Dashboard by NASA, ESA, JAXA</h5>-->
      <h5 class="text-h5 mb-5 white--text"><img src="/data/trilateral/Trilateral_Logo.svg" height="40" /></h5>
      <p class="mb-10 white--text">
        <!-- eslint-disable vue/no-v-html -->
        International collaboration among space agencies is central to the success of satellite Earth observations and data analysis. These partnerships foster more comprehensive measurements, robust datasets, and cost-effective missions.
        <!-- eslint-enable -->
      </p>
      <v-btn
        elevation="2"
        color="secondary"
        class="white--text"
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
    position: relative;
    height: 50vh;
    width: 100vw;
    margin-top: 76px;
    background: #00040f;

    .hero-section {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      text-align: center;

      p {
        max-width: 700px;
      }

      &.image {
        background-size: cover;
        background-image: url('https://github.com/eurodatacube/eodash/raw/staging/app/public/data/trilateral/Esa_Nasa_jaxa_covid19_cover_V3.jpg');
      }
    }

    .overlay {
      position: absolute;
      left: 0;
      top: 0;
      
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-image: url('../../assets/earth_bg.jpg');
      opacity: 0.3;
    }
  }
</style>
