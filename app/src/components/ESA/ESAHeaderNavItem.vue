<template>
  <v-col>
    <v-row
      class="navrow py-3 pl-4 fill-width"
      :style="styleObject"
      style="pointer-events: none;"
      align="center"
    >
      <div class="dot" />
      <div class="name">{{ domain.name }}</div>
    </v-row>

    <div class="submenu">
      <v-row
        @click="visitExploreTool"
        :style="styleObject"
        class="navrow py-3 mt-3 pl-8 fill-width"
        align="center"
      >
        <div class="dot blueish" />
        <div class="name">Explore Tools</div>
      </v-row>

      <v-row
        @click="go(domain.slug, narrative.routeName)"
        class="navrow py-3 pl-8 fill-width"
        :style="styleObject"
        align="center"
        v-for="narrative in domain.narratives"
        :key="narrative.routeName"
      >
        <div class="dot blueish" />
        <div class="name">{{ narrative.name }}</div>
      </v-row>
    </div>
  </v-col>
</template>

<script>
// Utilities
import {
  mapState,
  mapActions,
} from 'vuex';

export default {
  name: 'GtifHeaderNavItem',
  props: {
    domain: {
      type: Object,
      required: true,
    },
    isHoverable: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    ...mapActions('gtif', [
      'setCurrentDomain',
    ]),
    visitExploreTool() {
      this.setCurrentDomain(this.domain.slug);
      this.$router.push({ name: 'explore' });
    },
    go(domainSlug, routeName) {
      this.setCurrentDomain(domainSlug);
      this.$router.push({ name: routeName });
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    styleObject() {
      return {
        '--color-text': '#9fb0bb',
        '--color-icon': this.isSubItem ? '#00ae9d' : 'rgba(255, 255, 255, 0.267)',
        '--color-text-hover': this.isHoverable ? '#00ae9d' : '#9fb0bb',
        '--color-icon-hover': this.isHoverable ? '#00ae9d' : 'rgba(255, 255, 255, 0.28)',
        '--color-bg-hover': this.isHoverable ? 'rgba(255, 255, 255, 0.07)' : '#FFF0',
      };
    },
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
    margin-right: 16px;
    background: var(--color-icon);
    transition: background-color 0.1s linear;

    &.blueish { background: #00ae9d; }
  }

  .name {
    font-size: 18px;
    transition: color 0.1s linear;
    color: var(--color-text);
  }
}
</style>
