<template>
  <div
    v-if="$vuetify.breakpoint.smAndUp"
    class="ui-panel elevation-1 rounded ma-1"
    :style="`
      background: ${$vuetify.theme.currentTheme.background};
    `"
  >
      <v-expansion-panel v-if="hasPanel">
        <v-expansion-panel-header ref="header"
        :style="`background: ${gtif ? '#e9e9e9' : 'white'}`">
          {{ titleLabel }}
        </v-expansion-panel-header>
        <v-expansion-panel-content ref="expantionContent" eager
        :style="`max-height:${getMaxHeight}`">
          <slot></slot>
        </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
  <div v-else class="flex-column align-strech">
    <span
      v-if="hasPanel"
      class="elevation-1 pa-2 d-flex justify-center
       align-center fill-height"
      :style="`
        background: ${isSelected ? $vuetify.theme.currentTheme.primary
          : $vuetify.theme.currentTheme.background};
          color:${isSelected ? 'white': 'black'}
      `"
      @click="$emit('panel-selected',id)"
    >
      {{ titleLabel }}
  </span>
    <div
      v-show="isSelected"
      class="overlay"
      :style="`
        background: ${$vuetify.theme.currentTheme.background};
        height: calc(100% - ${ gtif ? ($store.state.gtif.toolsToggle ? 184 : 160) : 176.5}px);
      `">
      <!-- close btn -->
      <v-btn icon @click="$emit('panel-selected',0)" class="close-btn" >&#x2715;</v-btn>
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
    id: Number,
    activeID: {
      type: Number,
      default: null,
    },
  },
  computed: {
    isSelected() {
      return this.id === this.activeID;
    },
    getMaxHeight() {
      return `calc(((var(--vh, 1vh) * 100) - ${(this.$vuetify.application.top
         + this.$vuetify.application.footer + (this.gtif
        ? 8 : -40) + (48 * this.siblingsCount))}px) * ${(this.heightPercentage / 100)});`;
    },
    titleLabel() {
      return this.title?.toUpperCase();
    },
  },
  data: () => ({
    siblingsCount: 1,
    gtif: false,
    hasPanel: true,
  }),
  beforeUpdate() {
    this.hasPanel = this.$slots.default?.length > 0 ?? false;
    this.siblingsCount = this.$parent.$children.length;
  },
  mounted() {
    // first parent is vExpantionPanels, second parent is UiPanelsLayout
    if (this.$vuetify.breakpoint.smAndUp) {
      this.gtif = this.$parent.$parent.$props.gtif;
    } else {
      // first parent is the UiPanelsLayout
      this.gtif = this.$parent.$props.gtif;
    }
  },
};
</script>

<style scoped lang="scss">
div {
  width: 100%;
  overflow-y: auto;
  pointer-events: all;
  overflow-x: hidden;
}
.overlay {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 4;
  display: flex;
  flex-direction: column;
}
.close-btn{
  align-self: end;
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
