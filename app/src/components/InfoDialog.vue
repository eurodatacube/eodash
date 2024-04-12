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
            style="max-width: 900px;"
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
    story: null,
  }),
  created() {
    this.getDataInfo();
  },
  mounted() {},
  computed: {
  },
  watch: {},
  methods: {
    getDataInfo() {
      let markdown;
      try {
        const markdownUrl = `//raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/gtif-datainfo/${this.infoSource}.md`;
        fetch(markdownUrl)
          .then((response) => {
            if (!response.ok) {
              console.error('Fetching DataInfo failed');
            }
            return response.text();
          })
          .then((text) => {
            markdown = { default: text };
            this.story = this.$marked(markdown.default);
          });
      } catch {
        this.story = this.$marked({ default: '' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
