<template>
  <v-footer
    app
    :color="color"
    class="d-flex justify-center align-center white--text text-center"
    style="z-index: 5"
    :height="$vuetify.breakpoint.xsOnly ? '60px' : '40px'"
  >
    <v-tooltip top v-if="$vuetify.breakpoint.smAndUp">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          color="white"
          small
          dark
          class="mr-2"
          v-bind="attrs"
          v-on="on"
          @click="$vuetify.theme.dark = !$vuetify.theme.dark"
        >
          {{
            $vuetify.theme.dark
              ? 'mdi-white-balance-sunny'
              : 'mdi-weather-night'
          }}
        </v-icon>
      </template>
      <span>Enable {{ $vuetify.theme.dark ? 'light' : 'dark' }} mode</span>
    </v-tooltip>
    <v-spacer></v-spacer>
    <small>
      <a href="https://eurodatacube.com" target="_blank" class="white--text mx-1">EDC</a>
      <span>service for</span>
      <a href="https://earth.esa.int" target="_blank" class="white--text mx-1">ESA</a>
      <span> | </span>
      <a href="terms_and_conditions" target="_blank" class="white--text">Legal</a>
      <span> | </span>
      <a href="/privacy" target="_blank" class="white--text">Privacy</a>
    </small>
    <v-spacer></v-spacer>
    <small class="justify-right">
      <a href="https://github.com/eurodatacube/eodash" target="_blank" class="white--text">eodash</a>
      <span> v{{ `${$store.getters.appVersion
        .split('.')[0]}.${$store.getters.appVersion
        .split('.')[1]}` }} by</span>
      <a href="https://eox.at" target="_blank" class="white--text mx-1">
        <img :src="require('@/assets/EOX_Logo_weiss.svg')" height="11px" class="my-0" />
      </a>
    </small>
    <feedback-button />
  </v-footer>
</template>

<script>
import FeedbackButton from '@/components/FeedbackButton.vue';

export default {
  props: {
    color: {
      type: String,
      default: 'primary',
    },
  },
  components: {
    FeedbackButton,
  },
  mounted() {
    this.fixFullHeight();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.fixFullHeight();
      }, 200);
    });
  },
  methods: {
    fixFullHeight() {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = (window.innerHeight
        - this.$vuetify.application.top
        - this.$vuetify.application.footer) * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
  },
};
</script>
