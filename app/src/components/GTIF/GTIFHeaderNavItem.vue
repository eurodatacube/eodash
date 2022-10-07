<template>
  <v-row
    @click="$router.push(to)"
    class="navrow py-5 fill-width"
    :class="[isSubItem ? 'px-10' : 'px-7']"
    :style="styleObject"
    align="center"
    >
    <div class="w-12">
      <div
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
    styleObject: function() {
      return {
        '--color-text': '#9fb0bb',
        '--color-icon': this.isSubItem ? '#00ae9d' : 'rgba(255, 255, 255, 0.267)',
        '--color-text-hover': this.isHoverable ? '#00ae9d' : '#9fb0bb',
        '--color-icon-hover': this.isHoverable ? '#00ae9d' : 'rgba(255, 255, 255, 0.28)',
        '--color-bg-hover':   this.isHoverable ? 'rgba(255, 255, 255, 0.07)' : '#FFF0',
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.navrow {
  user-select: none;
  cursor: pointer;
  transition: background-color 0.1s linear, color 0.1s linear;

  &:hover {
    background: var(--color-bg-hover) !important;

    .home-icon {
      color: var(--color-icon-hover);
    }

    .dot {
      background: var(--color-icon-hover);
    }

    .name {
      color: var(--color-text-hover);
    }
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background: var(--color-icon);
    transition: background-color 0.1s linear;
  }

  .name {
    font-size: 18px;
    transition: color 0.1s linear;
    color: var(--color-text);
  }
}
</style>
