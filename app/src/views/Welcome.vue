<template>
  <div
    class="pa-7 pt-0"
    :style="{ background: $vuetify.theme.currentTheme.background }"
  >
    <v-card outlined>
      <news-carousel v-if="appConfig.showNewsCarousel" />
    </v-card>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import NewsCarousel from '@/components/NewsCarousel.vue';

export default {
  components: {
    NewsCarousel,
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>
