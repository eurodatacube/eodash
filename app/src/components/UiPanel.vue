<template>
  <div
    v-if="$vuetify.breakpoint.smAndUp"
    class="elevation-1 rounded ma-1"
    :style="`
      background: ${$vuetify.theme.currentTheme.background};
    `"
  >
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content
        :style="`height: calc((var(--vh, 1vh) * 100) - ${$vuetify.application.top
        + $vuetify.application.footer +(48 * siblingsCount)}px )`" >
          <slot></slot>
        </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
  <div v-else>
    <div
      class="elevation-1 rounded pa-5 ma-1 d-flex justify-center align-center"
      :style="`
        background: ${$vuetify.theme.currentTheme.background};
      `"
      @click="showOverlay = !showOverlay"
    >
      {{ title }}
    </div>
    <div
      v-show="showOverlay"
      class="overlay"
      :style="`
        background: ${$vuetify.theme.currentTheme.background};
      `"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    heightPercentage: {
      type: Number,
      default: 50,
    },
  },
  data: () => ({
    showOverlay: false,
    siblingsCount: 1,
  }),
  mounted() {
    this.siblingsCount = this.$parent.$children.length;
  },
};
</script>

<style scoped>
div {
  width: 100%;
  overflow: scroll;
  pointer-events: all;
}
.overlay {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100% - 200px);
  z-index: 4;
}
</style>
