<template>
  <div class="about">
    <div
      v-html="about"
      class="md-body my-5"
      :options="{ markdownIt: { html: true } }"
    />
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
