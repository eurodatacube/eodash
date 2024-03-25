<template>
  <div
    class="fill-height"
  >
    <div
      class="fill-height"
    >
      <GlobalHeader />

      <v-container>
        <eox-storytelling :markdown-url="markdownUrl"></eox-storytelling>
      </v-container>
      <GlobalFooter />
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';

import storiesConfig from '../config/stories.json';

export default {
  components: {
    GlobalHeader,
    GlobalFooter,
  },
  computed: {
    ...mapState('config', ['appConfig']),
    markdownUrl() {
      const brand = this.appConfig.id;
      const { id } = this.$route.query;
      console.log(storiesConfig[brand]);
      console.log(storiesConfig[brand][id]);
      return storiesConfig[brand][id]
        .storyMarkdown;
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 112px;
}
</style>
