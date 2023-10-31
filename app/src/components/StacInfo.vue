<template>
  <v-container>
    <v-row class="align-center">
      <v-col>
        <eox-stacinfo ref="stacInfoEl"
          @loaded="onStacInfoLoad"
          :for="getLink"
          header="[]"
          subheader="[]"
          properties='["description"]'
          featured="[]"
          footer="[]"
          style="margin-left: -30px; margin-right: -30px;"
        ></eox-stacinfo>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    getLink() {
      return this.$store.state.indicators.selectedIndicator.link;
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
  },
  methods: {
    onStacInfoLoad() {
      this.$nextTick(() => {
        if (this.$vuetify.breakpoint.smAndUp && this.$refs.stacInfoEl?.shadowRoot.querySelector('main .description').children.length < 1) {
          // first parent is VExpantionPanelContent, second is VExpantionPanel
          this.$parent.$parent.$el.style.display = 'none';
        } else {
          this.$parent.$parent.$el.style.display = '';
        }
      });
    },
  },
};
</script>

<style scoped>
/** */
</style>
