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
        Global environmental changes observed by NASA, ESA, and JAXA
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
        background-image: url('/data/story-images/EO_Dashboard_kv_no logos.png');
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
      background-image: url('/data/story-images/EO_Dashboard_kv_no logos.png');
      opacity: 0.7;
    }
  }
</style>
