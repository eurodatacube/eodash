<template>
  <div
    class="pa-7 pt-0 pb-0"
    :class="$vuetify.breakpoint.xsOnly && 'pb-10'"
    style="overflow: auto; height: 100%;"
  >
    <v-row class="d-flex">
      <v-col
        cols="12"
      >
        <div
          v-html="privacy"
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
    privacy() {
      return marked(require(`../../public${this.appConfig.privacyText}.md`).default);
    },
  },
};
</script>
