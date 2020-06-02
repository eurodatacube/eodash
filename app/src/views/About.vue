<template>
  <div
    class="pa-7 pt-0 pb-0"
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

import marked from 'marked';

export default {
  computed: {
    ...mapState('config', ['appConfig']),
    about() {
      return marked(require(`../../public${this.appConfig.aboutText}.md`).default);
    },
  },
};
</script>
