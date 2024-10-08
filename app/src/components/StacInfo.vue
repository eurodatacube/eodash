<template>
  <v-container>
    <v-row class="align-center">
      <v-col v-if="appConfig.id === 'gtif'">
        <eox-stacinfo ref="stacInfo"
          @loaded="onStacInfoLoad"
          :for="getLink"
          :allowHtml.prop="true"
          :styleOverride.prop="`
          .single-property {
            word-break: break-word
          }
          #properties li > .value {
              font-weight: normal !important;
          }
          #properties li {
              width: 100%;
          }
          main {
            padding: 0px 30px;
          }`"
          header="[]"
          subheader="[]"
          properties='["description"]'
          featured="[]"
          footer="[]"
          :style="`
            margin-left: -30px;
            margin-right: -30px;
            word-wrap: break-word;
            --color-primary: ${$vuetify.theme.currentTheme.main}`"
        ></eox-stacinfo>
      </v-col>
      <v-col v-else>
        <eox-stacinfo
          v-if="indicatorObject
            || $store.state.features.featureFilters.indicators.length > 0"
          ref="stacInfo"
          :for="getLink"
          @loaded="onStacInfoLoad"
          header='["title"]'
          tags='["themes"]'
          properties='["satellite","sensor","agency","extent"]'
          featured='["description","providers","assets","links"]'
          footer='["sci:citation"]'
          :allowHtml.prop="true"
          :style="`
            margin-left: -20px;
            margin-right: -20px;
            word-wrap: break-word;
            --color-primary: ${$vuetify.theme.currentTheme.main}!important;
            --color-primary-lighter: white;`"
          :styleOverride.prop="`
          .single-property {columns: 1!important;}
          h1 {margin:0px!important;font-size:16px!important;}
          header h1:after {
            content:' ';
            display:block;
            border:1px solid #d0d0d0;
          }
          h2 {font-size:15px}
          h3 {font-size:14px}
          summary {cursor: pointer;}
          #properties li > .value { font-weight: normal !important;}
          main {padding-bottom: 10px;}
          .footer-container {line-height:1;}
          .footer-container button {margin-top: -10px;}
          .footer-container small {font-size:10px;line-height:1;}
          `"
        >
          <div slot="themes"
          v-if="stacInfoLoaded">
            <ul>
              <v-chip
                v-for="theme in themesInStacInfo"
                :key="theme"
                :color="$store.state.themes.themes.find(t => t.slug === theme)?.color"
                style="height: 22px"
                text-color="white"
              >
              <v-avatar left>
                <v-icon style="font-size: 14px;">
                  {{ $store.state.config.baseConfig.indicatorClassesIcons[theme] }}
                </v-icon>
              </v-avatar>
                {{ theme }}
              </v-chip>
            </ul>
          </div>
          <div slot="featured-links"
          v-if="stacInfoLoaded">
            Additional links:
            <li
              v-for="link in linksInStacInfo"
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
    v-if="appConfig.id === 'gtif' && additionalGTIFDataInfos.length > 0"
    :key="refreshKey"
    >
    <h4>
      Dataset metadata
    </h4>
      <v-expansion-panel
        v-for="(item, index) in additionalGTIFDataInfos"
            :key="item.dataInfo">
        <v-expansion-panel-header>
          {{item.name || item.label}}
          <template v-slot:actions>
            <v-icon>
              mdi-information-outline
            </v-icon>
          </template>
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
import {
  mapState,
} from 'vuex';

export default {
  data: () => ({
    additionalGtifDataInfoContent: [],
    stacInfoLoaded: null,
    themesInStacInfo: [],
    linksInStacInfo: [],
    refreshKey: 0,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
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
      // send signal to map to move the controlContainer
    }
    window.postMessage({
      command: 'app:StacInfoMounted',
    });
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
        const themes = this.$refs.stacInfo?.stacProperties?.themes?.value || [];
        if (this.appConfig.id === 'trilateral') {
          const i = themes.findIndex((theme) => theme === 'air');
          if (i !== -1) {
            themes[i] = 'atmosphere';
          }
          const j = themes.findIndex((theme) => theme === 'water');
          if (j !== -1) {
            themes[j] = 'oceans';
          }
        }
        this.themesInStacInfo = themes;
        const links = this.$refs.stacInfo?.stacProperties?.links?.value || [];
        const linksFiltered = links.filter(
          (l) => l.rel === 'example',
        ).map((ll) => {
          if (ll.title.includes('VEDA Statistics')) {
            // only use the stac catalog URL for VEDA example
            ll.href = 'https://openveda.cloud/'; // eslint-disable-line
            ll.rel = 'openveda.cloud STAC Browser'; // eslint-disable-line
          }
          return ll;
        });
        this.linksInStacInfo = linksFiltered;
        this.stacInfoLoaded = true;
        // programatically open Analysis panel if exists and not open yet
        const uiPanelsRight = this.$parent.$parent.$parent.$parent.$children;
        if (!uiPanelsRight[1].$refs.header.$el.classList.contains('v-expansion-panel-header--active')) {
          uiPanelsRight[1].$refs.header.$emit('click', {
            currentTarget: uiPanelsRight[1].$refs.header.$el,
          });
        }
      });
    },
    async fetchDataInfo(dataInfoObject, i) {
      try {
        const markdownUrl = `//raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/gtif-datainfo/${dataInfoObject.dataInfo}.md`;
        await fetch(markdownUrl)
          .then((response) => {
            if (!response.ok) {
              console.error('Fetching DataInfo failed');
            }
            return response.text();
          })
          .then((text) => {
            const markdown = { default: text };
            this.additionalGtifDataInfoContent[i] = this.$marked(markdown.default);
          });
      } catch {
        // just an empty catch
      }
    },
    getAdditionalGTIFDataInfos() {
      this.additionalGtifDataInfoContent = Array(this.additionalGTIFDataInfos.length).fill('');
      Promise.all(this.additionalGTIFDataInfos.map((item, i) => this.fetchDataInfo(item, i)))
        .then(() => {
          this.refreshKey = Math.random();
        });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep th {
  text-align: left;
}
.col {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
<style>
eox-stacinfo::part(header) {
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
.v-expansion-panel-header{
  margin-bottom: 0px;
  min-height: 50px!important;
}

</style>
