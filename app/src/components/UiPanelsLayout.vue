<template>
  <div class="layout-container" :style="`height: ${$vuetify.breakpoint.smAndUp ? '100%' : 'auto'};
                         ${$vuetify.breakpoint.smAndUp ? 'top : 0'
      : `bottom :${gtif ? $vuetify.application.footer-12 : '-8'}px`};`">
    <v-row class="d-flex justify-space-between fill-height"
     v-if="$vuetify.breakpoint.smAndUp">
      <v-col :cols="3" style="max-height: 100%;max-width: min(25%, 500px);" >
        <v-expansion-panels multiple>
          <slot name="left" :panels="panels.left" ></slot>
        </v-expansion-panels>
      </v-col>
      <v-col :cols="3" style="max-height: 100%;max-width: min(25%, 500px);" >
        <v-expansion-panels multiple>
          <slot name="right" :panels="panels.right" ></slot>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <div v-else class="d-flex justify-center">
      <slot name="left" :panels="panels.left"
      :handleSelection="handleSelection"
      :activePanel="activePanel"></slot>
      <slot name="right" :panels="panels.right"
      :handleSelection="handleSelection"
      :activePanel="activePanel"></slot>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  props: {
    gtif: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    activePanel: 0,
    panels: {
      left: [],
      right: [],
    },
  }),
  watch: {
    inToolMode: {
      immediate: true,
      handler(newVal) {
        if (this.gtif && !newVal) {
          this.panels.left = [
            {
              id: 1,
              title: this.indicatorPanelheader,
              heightPercentage: 100,
            },
          ];
          this.panels.right = [];
        } else {
          const leftPanels = [
            {
              id: 1,
              title: this.indicatorPanelheader,
              heightPercentage: 100,
              heightPercentageBothOpen: 75,
            },
          ];
          const layersTool = {
            id: 2,
            title: 'Layers',
            heightPercentage: 99,
            heightPercentageBothOpen: 25,
          };
          const rightPanels = [
            {
              id: 3,
              title: 'Information',
              heightPercentage: 100,
              heightPercentageBothOpen: 50,
            },
            {
              id: 4,
              title: 'Analysis',
              heightPercentage: 100,
              heightPercentageBothOpen: 50,
            },
          ];
          if (this.$route.name === 'demo') {
            rightPanels.push(layersTool);
          } else {
            leftPanels.push(layersTool);
          }
          this.panels.left = leftPanels;
          this.panels.right = rightPanels;
        }
      },
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    indicatorPanelheader() {
      if ('indicatorPanelheader' in this.appConfig.uiText) {
        return this.appConfig.uiText.indicatorPanelheader;
      }
      return 'Domains & Tools';
    },
    inToolMode() {
      return this.$store.state.gtif.toolsToggle;
    },
  },
  methods: {
    handleSelection(id) {
      if (this.activePanel === id) {
        this.activePanel = 0;
      } else {
        this.activePanel = id;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.layout-container {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 8px;
  pointer-events: none;
  @media only screen and (max-width: 600px) {
   padding: 0%;
   margin: 0%;
   z-index: 10;
  }
}
</style>
