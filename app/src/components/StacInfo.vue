<template>
  <v-container>
    <v-row class="align-center">
      <v-col>
        <eox-stacinfo
          v-if="indicatorObject
            || $store.state.features.featureFilters.indicators.length > 0"
          ref="stacInfo"
          :for="getLink"
          @loaded="onStacInfoLoad"
          header='["title"]'
          subheader='["keywords"]'
          properties='["themes", "satellite", "sensor", "agency", "links"]'
          featured='["description", "providers", "extent", "sci:publications", "assets"]'
          footer='["sci:citation"]'
          :allowHtml.prop="true"
          style="margin-left: -30px; margin-right: -30px;"
          :styleOverride.prop="'#properties li > .value { font-weight: normal !important;}'"
        >
          <div slot="themes"
          v-if="stacInfoLoaded">
            <ul>
              <v-chip
                v-for="theme in $refs.stacInfo.stacProperties.themes.value"
                :key="theme"
                :color="$store.state.themes.themes.find(t => t.slug === theme)?.color"
                text-color="white"
              >
              <v-avatar left>
                <v-icon>{{ $store.state.config.baseConfig.indicatorClassesIcons[theme] }}</v-icon>
              </v-avatar>
                {{ theme }}
              </v-chip>
            </ul>
          </div>
          <div slot="links"
          v-if="stacInfoLoaded">
            Code examples:
            <li
              v-for="link in $refs.stacInfo.stacProperties.links.value.filter(
                (l) => l.rel === 'example' || l.rel === 'license'
              )"
              :key="link.rel"
            >
              <v-btn color="primary" :href="link.href">{{ link.rel }}</v-btn>
            </li>
          </div>
          <span slot="featured-links-summary">Data Access & Methods</span>
        </eox-stacinfo>
      </v-col>
    </v-row>
    <v-expansion-panels
    style="justify-content: left;"
    v-if="additionalGTIFDataInfos.length > 0"
    >
    <h4>
      Dataset metadata
    </h4>
      <v-expansion-panel
        v-for="(item, index) in additionalGTIFDataInfos"
            :key="item.dataInfo">
        <v-expansion-panel-header>
          {{item.name || item.label}} <v-icon>mdi-information-outline</v-icon>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            style="display: inline-block;
            overflow-x: scroll;
            width: 100%;"
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
    stacInfoLoaded: null,
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
    additionalGTIFDataInfos() {
      const dataInfosFromDisplay = this.mergedConfigsData
        .filter((config) => config.dataInfo);
      const filters = this.indicatorObject?.cogFilters?.filters;
      let dataInfosFromCogFilters = [];
      if (typeof filters === 'object' && filters !== null) {
        dataInfosFromCogFilters = Object.keys(filters)
          .filter((filterKey) => filters[filterKey].dataInfo)
          .map((item) => filters[item]);
      }
      return [
        ...dataInfosFromDisplay,
        ...dataInfosFromCogFilters,
      ];
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$parent.$parent.$parent.$refs.header.$emit('click', { detail: '' });
    }
    this.getAdditionalGTIFDataInfos();
  },
  watch: {
    additionalGTIFDataInfos() {
      this.getAdditionalGTIFDataInfos();
    },
  },
  methods: {
    onStacInfoLoad() {
      this.$nextTick(() => {
        if (this.$vuetify.breakpoint.smAndUp && this.$refs.stacInfo?.shadowRoot.querySelector('main .description')?.children?.length < 1) {
          // first parent is VExpantionPanelContent, second is VExpantionPanel
          this.$parent.$parent.$el.style.display = 'none';
        } else {
          this.$parent.$parent.$el.style.display = '';
        }
        this.stacInfoLoaded = true;
      });
    },
    getAdditionalGTIFDataInfos() {
      this.additionalGtifDataInfoContent = [];
      for (let i = 0; i < this.additionalGTIFDataInfos.length; i++) {
        try {
          const markdownUrl = `//raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/gtif-datainfo/${this.additionalGTIFDataInfos[i].dataInfo}.md`;
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
<style>
eox-stacinfo::part(header) {
  position: sticky;
  top: 0;
  z-index: 1;
}
eox-stacinfo::part(footer) {
  position: sticky;
  bottom: 0;
}
[slot="themes"] {
  width: 100%;
}
[slot="themes"] ul {
  padding: 0;
  list-style: none;
  display: flex;
}
[slot="themes"] ul li {
  background: lightgrey;
  border-radius: 15px;
  min-width: 20px;
  text-align: center;
  padding: 2px 10px;
  margin-right: 4px;
}
</style>
