<template>
  <div
    class="pa-7 pb-0"
    :class="$vuetify.breakpoint.xsOnly && 'pb-10'"
  >
    <v-row class="d-flex">
      <v-col
        cols="12"
      >
        <div
          v-html="about"
          class="md-body"
          :options="{ markdownIt: { html: true } }"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  computed: {
    ...mapState('config', ['appConfig']),
    about() {
      return this.$marked(require(`../../public${this.appConfig.aboutText}.md`).default);
    },
  },
};
</script>
