<template>
  <div class="layout-container" :style="`height: ${$vuetify.breakpoint.smAndUp ? '100%' : 'auto'};
                         ${$vuetify.breakpoint.smAndUp ? 'top : 0'
      : `bottom :${gtif ? $vuetify.application.footer : '0'}px`};`">
    <v-row class="d-flex justify-space-between fill-height"
     v-if="$vuetify.breakpoint.smAndUp">
      <v-col :cols="3" style="max-height: 100%" >
        <v-expansion-panels multiple>
          <slot name="left" :panels="panels.left" ></slot>
        </v-expansion-panels>
      </v-col>
      <v-col :cols="3" style="max-height: 100%" >
        <v-expansion-panels multiple>
          <slot name="right" :panels="panels.right" ></slot>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <div v-else class="d-flex align-end">
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
      left: [
        {
          id: 1,
          title: 'Filters',
          heightPercentage: 50,
        },
        {
          id: 2,
          title: 'Layers',
          heightPercentage: 50,
        },
      ],
      right: [
        {
          id: 4,
          title: 'Layers',
          heightPercentage: 33,
        },
        {
          id: 5,
          title: 'Filters',
          heightPercentage: 33,
        },
        {
          id: 6,
          title: 'Layers',
          heightPercentage: 33,
        },
      ],

    },
  }),
  watch: {
    inToolMode() {
      if (this.gtif && !this.inToolMode) {
        this.panels.left[1].title = 'Narratives';
      } else {
        this.panels.left[1].title = 'Layers';
      }
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

<style scoped>
.layout-container {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 8px;
  pointer-events: none;
}
</style>
