<template>
  <v-btn
    icon
    x-small
    color="primary"
    style="margin-bottom:8px;"
    @click="dialog = true"
  >
    <v-dialog width="auto " :fullscreen="$vuetify.breakpoint.xsOnly"
      v-model="dialog"
      activator="parent"
    >
      <v-card>
        <v-card-text class="p-8 pt-4">
          <div
            style="max-width: 600px;"
            v-html="story"
            class="md-body"
          ></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Close Info</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-icon>mdi-information-outline</v-icon>
  </v-btn>
</template>

<script>

export default {
  name: 'InfoDialog',
  components: {},
  props: {
    infoSource: String,
  },
  data: () => ({
    dialog: false,
  }),
  mounted() {},
  computed: {
    story() {
      let markdown;
      try {
        markdown = require(`../../public/data/gtif/markdown/dataInfo/${this.infoSource}.md`);
      } catch {
        markdown = { default: '' };
      }
      return this.$marked(markdown.default);
    },
  },
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
