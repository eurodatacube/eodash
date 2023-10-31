<template>
  <div class="layout-container" :style="`height: ${$vuetify.breakpoint.smAndUp ? '100%' : 'auto'};
                         ${$vuetify.breakpoint.smAndUp ? 'top : 0'
      : `bottom :${gtif ? $vuetify.application.footer-12 : '-8'}px`};`">
    <v-row class="d-flex justify-space-between fill-height"
     v-if="$vuetify.breakpoint.smAndUp">
      <v-col :cols="3" style="max-height: 100%" >
        <v-expansion-panels>
          <slot name="left" :panels="panels.left" ></slot>
        </v-expansion-panels>
      </v-col>
      <v-col :cols="3" style="max-height: 100%" >
        <v-expansion-panels>
          <slot name="right" :panels="panels.right" ></slot>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <div v-else class="d-flex justify-center align-strech">
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
              title: 'Filters',
              heightPercentage: 100,
            },
          ];
          this.panels.right = [];
        } else {
          this.panels.left = [
            {
              id: 1,
              title: 'Domains & Tools',
              heightPercentage: 100,
            },
            {
              id: 2,
              title: 'Layers',
              heightPercentage: 100,
            },
          ];
          this.panels.right = [
            {
              id: 3,
              title: 'Information',
              heightPercentage: 100,
            },
            {
              id: 4,
              title: 'Analysis',
              heightPercentage: 100,
            },
          ];
        }
      },
    },
  },
  computed: {
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
  width: 97.2%;
  padding: 8px;
  pointer-events: none;
  @media only screen and (min-width: 2040px) {
   width: 98.2%;
  }

  @media only screen and (max-width: 1380px) {
   width: 95.7%;
  }

  @media only screen and (max-width: 900px) {
   width: 93.7%;
  }

  @media only screen and (max-width: 600px) {
   width: 100%;
   padding: 0%;
   margin: 0%;
   z-index: 10;
  }
}
</style>
