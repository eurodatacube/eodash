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
import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css';

import about from '../../public/eodash-data/general/about.md';

export default {
  components: {
    MarkdownItVue,
  },
  computed: {
    about() {
      return about;
    },
  },
};
</script>
