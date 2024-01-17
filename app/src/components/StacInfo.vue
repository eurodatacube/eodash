<template>
  <v-container>
    <v-row class="align-center">
      <v-col>
        <eox-stacinfo ref="stacInfoEl"
          @loaded="onStacInfoLoad"
          :for="getLink"
          :allowHtml.prop="true"
          :styleOverride.prop="`#properties li > .value {
              font-weight: normal !important;
          }`"
          header="[]"
          subheader="[]"
          properties='["description"]'
          featured="[]"
          footer="[]"
          style="margin-left: -30px; margin-right: -30px;"
        ></eox-stacinfo>
      </v-col>
    </v-row>
    <div
      v-if="additionalGtifDataInfos.length > 0"
      v-html="additionalGtifDataInfoContent"
      class="md-body"
    ></div>
  </v-container>
</template>

<script>
import { createConfigFromIndicator } from '@/helpers/mapConfig';

export default {
  data: () => ({
    additionalGtifDataInfoContent: null,
  }),
  computed: {
    getLink() {
      return this.indicatorObject.link;
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    mergedConfigsData() {
      if (!this.indicatorObject) {
        return [];
      }
      return createConfigFromIndicator(
        this.indicatorObject,
        0,
      );
    },
    additionalGtifDataInfos() {
      const dataInfos = this.mergedConfigsData
        .filter((config) => config.dataInfo)
        .map((config) => config.dataInfo);
      return dataInfos;
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
  },
  watch: {
    additionalGtifDataInfos() {
      this.getAdditionalGTIFDataInfos();
    },
  },
  methods: {
    onStacInfoLoad() {
      this.$nextTick(() => {
        if (this.$vuetify.breakpoint.smAndUp && this.$refs.stacInfoEl?.shadowRoot.querySelector('main .description')?.children?.length < 1) {
          // first parent is VExpantionPanelContent, second is VExpantionPanel
          this.$parent.$parent.$el.style.display = 'none';
        } else {
          this.$parent.$parent.$el.style.display = '';
        }
      });
    },
    getAdditionalGTIFDataInfos() {
      this.additionalGtifDataInfoContent = '';
      for (let i = 0; i < this.additionalGtifDataInfos.length; i++) {
        try {
          const markdownUrl = `//raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/gtif-datainfo/${this.additionalGtifDataInfos[i]}.md`;
          fetch(markdownUrl)
            .then((response) => {
              if (!response.ok) {
                console.error('Fetching DataInfo failed');
              }
              return response.text();
            })
            .then((text) => {
              const markdown = { default: text };
              this.additionalGtifDataInfoContent += this.$marked(markdown.default);
            });
        } catch {
          this.additionalGtifDataInfoContent = '';
        }
      }
    },
  },
};
</script>

<style scoped>
/** */
</style>
