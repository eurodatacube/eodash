<template>
  <div
    class="dashboard fill-height"
  >
    <global-header
      ref="globalHeader"
    />
    <v-main
      :style="`height: 100vh; height: calc((var(--vh, 1vh) * 100) + ${$vuetify.application.top
        + $vuetify.application.footer}px); overflow:hidden; width: 100%;${
          appConfig.enableESALayout ? 'margin-top: 48px;' : ''
        }`"
    >
      <v-container
        class="fill-height pa-0"
        fluid
      >
        <v-row class="fill-height">
          <v-col
            cols="12"
            class="py-0 fill-height"
          >
            <center-panel ref="centerPanel" />
            <div
              v-if="$route.name === 'demo'"
              class="d-flex justify-start"
              style="position: absolute; top: 0; width: 100%; pointer-events: none"
            >
              <IndicatorFiltersDemo
                :expanded="dataPanelFullWidth" />
            </div>

            <UiPanelsLayout class="fill-height" :gtif="appConfig.id === 'gtif'"
            v-else
            >
              <template #left="{panels,handleSelection, activePanel}">
                 <UiPanel v-for="panel in panels " :key="panel.id"
                 :height-percentage="panel.heightPercentage" :id="panel.id"
                 @panel-selected="function(id){ handleSelection(id) }"
                 :activeID="activePanel" :title="panel.title"
                 >
                   <IndicatorFiltersPanel v-if="['Domains & Tools','Filters'].includes(panel.title)" />
                   <eox-layercontrol
                    v-if="panel.title == 'Layers'"
                    for="#centerMap"
                    :titleProperty.prop="'name'"
                    class="pointerEvents">
                   </eox-layercontrol>

                 </UiPanel>
              </template>
              <template #right="{panels,handleSelection, activePanel}">
                 <UiPanel v-for="panel in panels " :key="panel.id"
                 :height-percentage="panel.heightPercentage" :id="panel.id"
                 @panel-selected="function(id){ handleSelection(id) }"
                 :activeID="activePanel" :title="panel.title"
                 >
                 <StacInfo  v-if="panel.title == 'Information' && indicatorSelected"/>
                   <DataPanel
                    v-if="panel.title === 'Analysis' && indicatorObject
                    || $store.state.features.featureFilters.indicators.length > 0"
                    :key="panelKey" />
                 </UiPanel>
              </template>
            </UiPanelsLayout>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <global-footer
      :color="getCurrentTheme ? getCurrentTheme.color : 'primary'"
    />
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import CenterPanel from '@/components/CenterPanel.vue';
import DataPanel from '@/components/DataPanel.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import IndicatorFiltersPanel from '@/components/IndicatorFiltersPanel.vue';
// import IndicatorFilters from '@/components/IndicatorFilters.vue';
// import IndicatorFiltersSidebar from '@/components/IndicatorFiltersSidebar.vue';
import IndicatorFiltersDemo from '@/components/IndicatorFiltersDemo.vue';
// import ESABreadcrumbs from '@/components/ESA/ESABreadcrumbs.vue';
import UiPanelsLayout from '@/components/UiPanelsLayout.vue';
import UiPanel from '@/components/UiPanel.vue';
import { getMapInstance } from '@/components/map/map';
import closeMixin from '@/mixins/close';
import dialogMixin from '@/mixins/dialogMixin';
import { mapState, mapGetters } from 'vuex';
import StacInfo from '../components/StacInfo.vue';

export default {
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
      link: [
        { rel: 'apple-touch-icon', href: `${appConfig.pageMeta.imagePath}/apple-touch-icon-192x192.png` },
      ],
    };
  },
  components: {
    Banner,
    CenterPanel,
    DataPanel,
    GlobalHeader,
    GlobalFooter,
    IndicatorFiltersPanel,
    // IndicatorFilters,
    // IndicatorFiltersSidebar,
    IndicatorFiltersDemo,
    // ESABreadcrumbs,
    UiPanel,
    UiPanelsLayout,
    StacInfo,
  },
  props: {
    source: String,
  },
  mixins: [closeMixin, dialogMixin],
  data: () => ({
    drawerLeft: false,
    dialog: false,
    dataPanelFullWidth: false,
    dataPanelTemporary: false,
    panelKey: 0,
    isDialogRetracted: true,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    // dataPanelWidth() {
    //   return this.$vuetify.breakpoint.lgAndUp ? 600 : 400;
    // },
    indicatorSelected() {
      return this.indicatorObject
        || this.$store.state.features.featureFilters.indicators.length > 0;
    },
    currentNews() {
      let currentNews;
      if (this.appConfig && this.appConfig.newsBanner) {
        const currentDate = new Date().getTime();
        const startDate = new Date(this.appConfig.newsBanner.startDate).getTime();
        // set end date + 1 to include last day
        let endDate = new Date(this.appConfig.newsBanner.endDate);
        endDate.setDate(endDate.getDate() + 1);
        endDate = endDate.getTime();
        if (startDate < currentDate
          && currentDate < endDate) {
          currentNews = this.appConfig.newsBanner;
        }
      }
      return currentNews;
    },
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light';
    },
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    selectedFeature() {
      return this.$store.state.features.selectedFeature;
    },
    featureCity() {
      // Using empty ascii to make sure subheading height is kept if no poi selection is active
      let city = '&#8194';
      if (this.selectedFeature) {
        city = this.selectedFeature.indicatorObject.city;
      }
      return city;
    },
    ...mapGetters({
      getCurrentTheme: 'themes/getCurrentTheme',
    }),
  },
  created() {
    this.drawerLeft = this.$vuetify.breakpoint.mdAndUp;
  },
  mounted() {
    // only show when nothing is selected
    const { poi, indicator, search } = this.$route.query;
    if (!poi && !indicator && !search && !this.$route.name === 'demo') {
      this.$refs.globalHeader.showText = 'welcome';
      this.$refs.globalHeader.showInfoDialog = true;
    }
    if (this.$route.name !== 'demo') {
      const { map } = getMapInstance('centerMap');
      const mapElement = document.querySelector('eox-layerswitcher');
      if (mapElement) {
        document.querySelector('eox-layerswitcher').attachTo(map);
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
  },
  methods: {
    // setDataPanelWidth(enable) {
    //   if (enable) {
    //     this.dataPanelTemporary = true;
    //     this.dataPanelFullWidth = true;
    //   } else {
    //     this.dataPanelFullWidth = false;
    //     // TO-DO find more reliable way of checking
    //     setTimeout(() => { this.dataPanelTemporary = false; }, 500);
    //   }
    // },
    clickMobileClose() {
      this.isDialogRetracted = true;
      this.dialog = false;
      this.$refs.globalHeader.showText = null;
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
      if (this.$refs.indicatorFilters) {
        this.$refs.indicatorFilters.comboboxClear();
      }
    },
    // close() {
    //   this.setDataPanelWidth(false);
    // },
  },
  watch: {
    indicatorSelected(selected) {
      if (selected) {
        if (!this.$vuetify.breakpoint.mdAndUp) {
          this.dialog = true;
        }
        if (this.$refs.globalHeader.showInfoDialog) {
          this.$refs.globalHeader.showInfoDialog = false;
          this.$refs.globalHeader.showText = null;
        }
      } else {
        this.dialog = false;
      }
      this.$store.commit('indicators/SET_CUSTOM_AREA_INDICATOR', null);
      this.panelKey = Math.random();
    },
    dialog(someIndicatorSelected) {
      if (this.$vuetify.breakpoint.smAndDown) {
        if (!someIndicatorSelected) {
          this.clickMobileClose();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}
::v-deep .theme--light.v-card.v-card--outlined {
  border: 1px solid var(--v-primary-base);
}
::v-deep .v-dialog--fullscreen {
  header,
  header .v-toolbar__content {
    height: auto !important;
  }
  header {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
.preventEllipsis:after {
  content: "\0000a0";
  display: inline-block;
  width: 0;
}
::v-deep .v-navigation-drawer--temporary:not(.v-navigation-drawer--close) {
  box-shadow: none;
}
::v-deep .v-navigation-drawer--temporary {
  z-index: 8;
}
::v-deep .v-navigation-drawer {
  .v-badge {
    min-width: 100% !important;
  }
  .v-badge__badge {
    transform: translateX(-45px);
  }
}

.reopen-right-drawer {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 5;

  .v-icon {
    transition: transform 0.3s linear;
  }
  .open {
    transform: rotate(180deg);
  }
}

::v-deep .retractable {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8;
  width: 100%;

  &.retracted {
    transform: translateY(66vh);
    padding-bottom: 66vh;
  }

  &.hidden {
    transform: translateY(100vh);
  }

  .v-toolbar__title {
    font-size: 1rem;
    line-height: 1;
  }
}
</style>
