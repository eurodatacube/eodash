<template>
  <div
    v-if="$vuetify.breakpoint.smAndUp"
    class="ui-panel elevation-1 rounded ma-1"
    :style="`
      background: ${$vuetify.theme.currentTheme.background};
    `"
  >
      <v-expansion-panel v-if="hasPanel" @click="onExpansionPanelClick">
        <v-expansion-panel-header ref="header" :class="`${gtif ? 'gtif': ''}`">
          {{ titleLabel }}
        </v-expansion-panel-header>
        <v-expansion-panel-content ref="expantionContent" eager
        >
          <slot></slot>
        </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
  <div v-else class="flex-column">
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
    heightPercentageBothOpen: {
      type: Number,
      default: 50,
    },
    id: Number,
    activeID: {
      type: Number,
      default: null,
    },
  },
  methods: {
    onExpansionPanelClick(evt) {
      const totalOpenBeforeClick = this.$parent.$children.filter((el) => (
        el.$children[0].$el.classList.contains('v-expansion-panel--active')
      )).length;
      let modifier;
      if ('currentTarget' in evt) {
        if (evt.currentTarget.parentNode.classList.contains('v-expansion-panel--active')) {
          // panel is in the process of being close, so we remove from total
          modifier = -1;
        } else {
          // panel is in the process of being opened, so we add to the total
          modifier = 1;
        }
      }
      const openPanels = totalOpenBeforeClick + modifier;
      // re-calculate height of all panels within the group
      this.$parent.$children.forEach((element) => {
        const remHeight = this.$vuetify.application.top + this.$vuetify.application.footer + (
          this.gtif ? 8 : -40
        );
        console.log(element.heightPercentageBothOpen);
        console.log(element.heightPercentage);
        console.log(element.title);
        const totalHeight = remHeight + (48 * element.siblingsCount);
        let percentage = element.heightPercentage / 100;
        if (openPanels > 1) {
          percentage = element.heightPercentageBothOpen / 100;
        }
        const maxHeight = `calc(((var(--vh, 1vh) * 100) - ${totalHeight}px) * ${percentage})`;
        // eslint-disable-next-line no-param-reassign
        element.$children[0].$children[1].$el.style.maxHeight = maxHeight;
      });
    },
  },
  computed: {
    isSelected() {
      return this.id === this.activeID;
    },
    maxHeight() {
      const remHeight = this.$vuetify.application.top + this.$vuetify.application.footer + (
        this.gtif ? 8 : -40
      );
      const totalHeight = remHeight + (48 * this.siblingsCount);
      let percentage = this.heightPercentage / 100;
      if (this.openPanels > 1) {
        percentage = this.heightPercentageBothOpen / 100;
      }
      console.log(percentage);
      return `calc(((var(--vh, 1vh) * 100) - ${totalHeight}px) * ${percentage});`;
    },
    titleLabel() {
      return this.title;
    },
  },
  data: () => ({
    active: true,
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
.gtif.v-expansion-panel-header {
  background: #e8e8e4;
  color: #003247;
}
.gtif.v-expansion-panel-header--active{
  background: #8197a6;
  color: #ffffff;
}
</style>
