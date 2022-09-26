<template>
  <v-app-bar flat app>
    <nav class="esa-header-wrapper">
      <section id="esa-header" class="esa-header monitoring-safeguarding">
        <div class="esa-header__left">
          <button @click="switchNav" id="esa-menu" style="margin-right: 18px;" class="grow-on-hover esa-header__toggle menu-toggle">
            <img class="esa-header__icon" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Menu.svg" alt="ESA menu toggle">
          </button>
          <button
            @click="switchSearch"
            id="esa-search"
            class="grow-on-hover esa-header__toggle search-toggle"
          >
            <img class="esa-header__icon" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Search.svg" alt="ESA search toggle">
          </button>
          <img
            v-if="$vuetify.breakpoint.mdAndUp"
            class="esa-header__title"
            src="https://esa.int/extension/pillars/design/pillars/images/ESA_Title.svg"
            alt="ESA title"
          />
        </div>
        <div class="esa-header__right">
          <a class="esa-header__link" href="/">
            <img class="esa-header__logo" src="https://esa.int/extension/pillars/design/pillars/images/ESA_Logo.svg" alt="ESA logo">
          </a>
        </div>
      </section>

      <input
        v-show="isSearchEnabled"
        :style="{width: $vuetify.breakpoint.mdAndUp ? '300px' : '100vw'}"
        class="search"
        type="text"
        placeholder="Search GTIF"
      />

      <Transition name="fade">
        <div
          v-show="isNavigationEnabled"
          :style="{width: $vuetify.breakpoint.mdAndUp ? '300px' : '100vw'}" 
          class="esa-menu"
        >
          <v-col>
            <svg
              @click="switchNav"
              class="close-icon mx-4 my-5 svg-inline--fa fa-times fa-w-10"
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="times"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              data-fa-i2svg=""
            ><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path>
            </svg>
            <v-col class="pt-12 pa-0">
              <v-row class="navrow py-5 px-7 fill-width" align="center">
                <div class="d-flex justify-start align-center w-12">
                  <svg class="mr-4 home-icon svg-inline--fa fa-home-lg-alt fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="home-lg-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M288 115L69.47 307.71c-1.62 1.46-3.69 2.14-5.47 3.35V496a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V368a16 16 0 0 1 16-16h96a16 16 0 0 1 16 16v128a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V311.1c-1.7-1.16-3.72-1.82-5.26-3.2zm282.69 121.28l-255.94-226a39.85 39.85 0 0 0-53.45 0l-256 226a16 16 0 0 0-1.21 22.6L25.5 282.7a16 16 0 0 0 22.6 1.21L277.42 81.63a16 16 0 0 1 21.17 0L527.91 283.9a16 16 0 0 0 22.6-1.21l21.4-23.82a16 16 0 0 0-1.22-22.59z"></path></svg>
                </div>

                <div class="name">GTIF Home</div>
              </v-row>

              <v-row class="navrow py-5 px-7 fill-width" v-for="i in [0, 1, 2, 3, 4]" :key="i" align="center">
                <div class="w-12">
                  <div class="w-3 h-3 rounded-full dot mr-4"></div>            
                </div>
                <div class="name">Destination {{ i }}</div>
              </v-row>
            </v-col>
          </v-col>
        </div>
      </Transition>
    </nav>
  </v-app-bar>
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
      isSearchEnabled: false,
    };
  },
  methods: {
    ...mapActions({
      loadTheme: 'themes/loadTheme',
    }),

    switchNav() {
      this.isNavigationEnabled = !this.isNavigationEnabled;
    },

    switchSearch() {
      this.isSearchEnabled = !this.isSearchEnabled;
    },
  },
  created() {
    $this.vuetify.theme.dark = false;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.grow-on-hover {
  transition: transform 0.25s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
}

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

input.search {
  position: fixed;
  top: 64px;
  left: 0;
  padding: 1rem;
  background: #052837;
  border: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.9);
  }
}

.esa-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: #0F2733;

  .close-icon {
    width: 22px;
    height: 22px;
    color: rgba(255, 255, 255, 0.6);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      transform: rotate(90deg) scale(1.2);
    }
  }

  .home-icon {
    width: 18px;
    height: 18px;
    color: rgba(255, 255, 255, 0.6);
    transition: color 0.1s linear;
  }

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
      background: #FFF4;
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
}
</style>
