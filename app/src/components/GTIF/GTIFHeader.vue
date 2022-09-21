<template>
  <nav class="esa-header-wrapper">
    <section id="esa-header" class="esa-header monitoring-safeguarding">
      <div class="esa-header__left">
        <button @click="switchNav" id="esa-menu" style="margin-right: 18px;" class="esa-header__toggle menu-toggle">
          <img class="esa-header__icon" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Menu.svg" alt="ESA menu toggle">
        </button>
        <button id="esa-search" class="esa-header__toggle search-toggle">
          <img class="esa-header__icon" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Search.svg" alt="ESA search toggle">
        </button>
        <img class="esa-header__title" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Title.svg" alt="ESA title">
      </div>
      <div class="esa-header__right">
        <a class="esa-header__link" href="/">
          <img class="esa-header__logo" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Logo.svg" alt="ESA logo">
        </a>
      </div>
    </section>

    <div class="esa-menu" v-show="isNavigationEnabled">
      <v-col>
        <svg @click="switchNav" class="close-icon ml-3 mt-3 svg-inline--fa fa-times fa-w-11" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" data-fa-i2svg=""><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
        <v-col class="pt-12">
          <v-row class="navrow py-5" v-for="i in [0, 1, 2, 3, 4]" :key="i" align="center">
            <div class="w-3 h-3 rounded-full dot mr-4 ml-4"></div>
            <div class="name">Destination {{ i }}</div>
          </v-row>
        </v-col>
      </v-col>
    </div>
  </nav>
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
      isNavigationEnabled: false,
    };
  },
  methods: {
    ...mapActions({
      loadTheme: 'themes/loadTheme',
    }),

    switchNav() {
      this.isNavigationEnabled = !this.isNavigationEnabled;
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

.esa-header-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 64px;
}

.esa-header {
  width: 100%;
  height: 100%;
  background: #003247;
  height: 64px;
  padding: 0 24px;
  border-bottom: 4px solid #00ae9d;
  justify-content: space-between;
}

.esa-header > * {
  height: 64px;
}

.esa-header, .esa-header * {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.esa-header__toggle:last-of-type {
  margin-right: 24px;
}

.esa-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: #003247;

  .close-icon {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.6);
  }

  .navrow {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .dot {
      background: #FFF4;
      width: 12px;
      height: 12px;
      border-radius: 6px;
    }

    .name {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85)
    }
  }
}
</style>
