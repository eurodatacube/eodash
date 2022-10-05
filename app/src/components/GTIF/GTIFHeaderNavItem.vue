<template>
  <v-row
    @click="$router.push(to)"
    class="navrow py-5 fill-width"
    :class="[isSubItem ? 'px-10' : 'px-7']"
    align="center"
    >
    <div class="w-12">
      <div
        :style="{'background': color}"
        class="w-3 h-3 rounded-full dot mr-4"
      ></div>
    </div>
    <div class="name">{{ title }}</div>
  </v-row>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'GtifHeaderNavItem',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#FFF4',
    },
    to: {
      type: [String, Object],
      required: true,
    },
    isSubItem: {
      type: Boolean,
      default: false,
    },
    isHoverable: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.navrow {
  user-select: none;
  cursor: pointer;
  transition: background-color 0.1s linear, color 0.1s linear;

  &:hover {
    background: rgba(255, 255, 255, 0.07);

    .name, .home-icon {
      color: lighten(#8197A6, 90%);
    }
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
  }

  .name {
    font-size: 18px;
    transition: color 0.1s linear;
    color: lighten(#8197A6, 10%);
  }
}
</style>
