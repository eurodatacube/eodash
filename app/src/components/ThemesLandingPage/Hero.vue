<template>
  <div class="hero">
    <div class="overlay d-flex flex-row">
      <!--<div class="hero-section d-flex flex-column justify-center align-center image">

      </div>-->
    </div>
    <div class="hero-section d-flex flex-column justify-center align-center px-3">
      <h2 class="mb-5 white--text" :class="$vuetify.breakpoint.xsOnly ? 'text-h4' : 'text-h2'" >
        Earth Observing Dashboard
      </h2>
      <!--<h5 class="text-h5 mb-10 white--text">A Tri-Agency Dashboard by NASA, ESA, JAXA</h5>-->
      <h5 class="text-h5 mb-5 white--text">
        <img
          :src="appConfig && appConfig.branding.headerLogo"
          height="40"
          style="pointer-events: none;"
        />
      </h5>
      <p class="white--text pa-0" style="font-size: 18px;">
        Global change observed by NASA, ESA, and JAXA
      </p>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  props: {},
  computed: {
    ...mapState('config', ['appConfig']),
  },
};
</script>

<style lang="scss">
  .hero {
    position: relative;
    height: 50vh;
    width: 100vw;
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
