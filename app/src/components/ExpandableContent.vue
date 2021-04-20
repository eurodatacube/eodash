<template>
  <div style="position: relative">
    <v-expand-transition>
      <div
        v-if="needsExpand"
        :style="`overflow: hidden; height: ${(contentExpanded || disableExpand)
                                            ? 'auto'
                                            : `${minHeight}px`}`">
        <div ref="content">
          <slot></slot>
        </div>
      </div>
      <div
        v-else
      >
        <div ref="content">
          <slot></slot>
        </div>
      </div>
    </v-expand-transition>
    <div v-if="needsExpand && (!contentExpanded && !disableExpand)"
      :class="$vuetify.theme.dark ? 'fadeOut--dark' : 'fadeOut'"></div>
    <v-btn
      v-if="needsExpand && !disableExpand"
      small
      text
      block
      color="grey"
      @click="contentExpanded = !contentExpanded"
      ><v-icon left>{{ contentExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      show {{ contentExpanded ? 'less' : 'more' }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    minHeight: {
      default: 150,
    },
    disableExpand: {
      default: false,
    },
  },
  data: () => ({
    contentExpanded: false,
    needsExpand: false,
    observer: null,
  }),
  mounted() {
    this.needsExpand = this.$refs.content.clientHeight > this.minHeight;
    // Create the observer (and what to do on changes...)
    this.observer = new MutationObserver(function () { // eslint-disable-line
      this.needsExpand = this.$refs.content.clientHeight > this.minHeight;
    }.bind(this));

    // Setup the observer
    this.observer.observe(
      this.$refs.content,
      {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      },
    );
  },
  beforeDestroy() {
    // Clean up
    this.observer.disconnect();
  },
};
</script>

<style lang="scss" scoped>
.fadeOut {
  width: 100%;
  height: 45px;
  position: absolute;
  bottom: 27px;
  background: transparent;
  background: linear-gradient(0deg, white, #ffffff00);
}
.fadeOut--dark {
  width: 100%;
  height: 45px;
  position: absolute;
  bottom: 27px;
  background: transparent;
  background: linear-gradient(0deg, #363636, #36363600);
}
</style>
