<template>
  <div class="about">
    <markdown-it-vue
      :content="about"
      class="md-body my-5"
      :options="{ markdownIt: { html: true } }"
    />
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css';

export default {
  components: {
    MarkdownItVue,
  },
  computed: {
    ...mapState('config', ['appConfig']),
    about() {
      return require(`../../public${this.appConfig.aboutText}.md`).default;
    },
  },
};
</script>
