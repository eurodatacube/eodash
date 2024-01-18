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
          }
          main {
            padding: 0px 30px;
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
    <v-expansion-panels
    v-if="additionalGtifDataInfos.length > 0"
    >
      <v-expansion-panel
        v-for="(item, index) in additionalGtifDataInfos"
            :key="item.dataInfo">
        <v-expansion-panel-header>
          {{item.name}}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-html="additionalGtifDataInfoContent[index]">
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { createConfigFromIndicator } from '@/helpers/mapConfig';

export default {
  data: () => ({
    additionalGtifDataInfoContent: [],
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
        .filter((config) => config.dataInfo);
      return dataInfos;
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
    this.getAdditionalGTIFDataInfos();
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
      this.additionalGtifDataInfoContent = [];
      for (let i = 0; i < this.additionalGtifDataInfos.length; i++) {
        try {
          const markdownUrl = `//raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/gtif-datainfo/${this.additionalGtifDataInfos[i].dataInfo}.md`;
          fetch(markdownUrl)
            .then((response) => {
              if (!response.ok) {
                console.error('Fetching DataInfo failed');
              }
              return response.text();
            })
            .then((text) => {
              const markdown = { default: text };
              this.additionalGtifDataInfoContent.push(this.$marked(markdown.default));
            });
        } catch {
          // just an empty catch to "fill in empty content"
          this.additionalGtifDataInfoContent.push('');
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep th {
    text-align: left;
  }
</style>
