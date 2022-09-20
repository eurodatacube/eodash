<template>
  <section id="esa-header" class="esa-header monitoring-safeguarding">
    <div class="esa-header__left">
      <button id="esa-menu" class="esa-header__toggle menu-toggle">
        <img class="esa-header__icon" src="/extension/pillars/design/pillars/images/ESA_Menu.svg" alt="ESA menu toggle">
      </button>
      <button id="esa-search" class="esa-header__toggle search-toggle">
        <img class="esa-header__icon" src="/extension/pillars/design/pillars/images/ESA_Search.svg" alt="ESA search toggle">
      </button>
      <img class="esa-header__title" src="/extension/pillars/design/pillars/images/ESA_Title.svg" alt="ESA title">
    </div>
    <div class="esa-header__right">
      <a class="esa-header__link" href="/">
        <img class="esa-header__logo" src="/extension/pillars/design/pillars/images/ESA_Logo.svg" alt="ESA logo">
      </a>
    </div>
  </section>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';

export default {
  data() {
    return {

    };
  },
  methods: {
    ...mapActions({
      loadTheme: 'themes/loadTheme',
    }),

    switchMenu() {
      this.drawerLeft = !this.drawerLeft;
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    ...mapGetters({
      currentTheme: 'themes/getCurrentTheme',
    }),
  },
};
</script>

<style lang="scss" scoped>
.esa-header {
  background: #003247;
  height: 56px;
  padding: 0 24px;
  border-bottom: 4px solid #00ae9d;
}
</style>
