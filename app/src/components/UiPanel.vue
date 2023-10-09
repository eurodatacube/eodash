<template>
  <div
    v-if="$vuetify.breakpoint.smAndUp"
    class="elevation-1 rounded ma-1"
    :style="`
      background: ${$vuetify.theme.currentTheme.background};
      max-height:50%
    `"
  >
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content >
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
  }),
};
</script>

<style scoped>
div {
  width: 100%;
  overflow: hidden;
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
