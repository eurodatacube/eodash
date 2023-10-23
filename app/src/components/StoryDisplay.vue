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
  mounted(){
    this.$parent.$parent.$parent.$refs.header.$emit('click',{detail:''})
  }
};
</script>

<style scoped>
/** */
</style>
