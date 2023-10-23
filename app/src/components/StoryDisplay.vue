<template>
  <v-container>
    <v-row class="align-center">
      <v-col>
        <div
        style="width: 100%"
        v-html="activeStory"
        class="md-body"
        ></div>
      </v-col>
     </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    activeStory() {
      return this.$marked(this.$store.state.story.markdown);
    },
  },
};
</script>

<style scoped>
/** */
</style>
