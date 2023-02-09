<template>
  <div>
    <v-app-bar flat app clipped-left >
      <nav class="esa-header-wrapper">
        <section id="esa-header" class="esa-header monitoring-safeguarding">
          <div class="esa-header__left">
            <button
              @click="switchNav"
              id="esa-menu"
              style="margin-right: 18px;"
              class="grow-on-hover esa-header__toggle menu-toggle"
            >
              <img class="esa-header__icon" src="img/gtif/icons/ESA_Menu.svg" alt="ESA menu toggle">
            </button>
            <button
              @click="switchSearch"
              id="esa-search"
              class="grow-on-hover esa-header__toggle search-toggle"
            >
              <img
                class="esa-header__icon"
                src="img/gtif/icons/ESA_Search.svg"
                alt="ESA search toggle"
              >
            </button>
            <router-link to="/">
              <img
                v-if="$vuetify.breakpoint.mdAndUp"
                class="esa-header__title"
                src="img/gtif/icons/ESA_Title.svg"
                alt="ESA title"
              />
            </router-link>
          </div>
          <div class="esa-header__right">
            <a class="esa-header__link" href="/">
              <img class="esa-header__logo" src="img/gtif/icons/ESA_Logo.svg" alt="ESA logo">
            </a>
          </div>
        </section>

        <div
          v-show="isSearchEnabled"
          class="search"
          :style="{width: $vuetify.breakpoint.mdAndUp ? '320px' : '100vw'}"
        >
          <div
            class="d-flex fill-width fill-height"
            @keyup.enter.stop="$router.push('/explore?search=' + searchInput)"
          >
            <input
              v-model="searchInput"
              type="text"
              class="pl-4 white--text"
              placeholder="Search GTIF"
            />

            <router-link
              :to="'/explore?search=' + searchInput"
              class="go d-flex justify-center align-center"
            >
              <i class="mdi mdi-arrow-right white--text"></i>
            </router-link>
          </div>
        </div>

        <Transition name="fade">
          <div
            v-show="isNavigationEnabled"
            :style="{width: $vuetify.breakpoint.mdAndUp ? '320px' : '100vw', 'overflow-y': 'scroll'}"
            class="esa-menu pb-8"
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
              ><path
                fill="currentColor"
                d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34
                0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58
                0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58
                0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4
                256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03
                25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72
                107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23
                6.23-16.34 0-22.58L207.6 256z"></path>
              </svg>
              <v-col class="pt-12 pa-0">
                <v-row
                  @click="goHome"
                  class="navrow py-3 px-7 mb-3 fill-width" align="center"
                  :class="{ selected: $route.name === 'landing' }"
                >
                  <div class="d-flex justify-start align-center w-12">
                    <svg
                    class="mr-4 home-icon svg-inline--fa fa-home-lg-alt fa-w-18"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="home-lg-alt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    data-fa-i2svg=""
                  ><path
                    fill="currentColor"
                    d="M288 115L69.47 307.71c-1.62 1.46-3.69 2.14-5.47
                    3.35V496a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V368a16
                    16 0 0 1 16-16h96a16 16 0 0 1 16 16v128a16 16 0 0 0 16
                    16h128a16 16 0 0 0 16-16V311.1c-1.7-1.16-3.72-1.82-5.26-3.2zm282.69
                    121.28l-255.94-226a39.85 39.85 0 0 0-53.45 0l-256
                    226a16 16 0 0 0-1.21 22.6L25.5 282.7a16 16 0 0 0
                    22.6 1.21L277.42 81.63a16 16 0 0 1 21.17 0L527.91
                    283.9a16 16 0 0 0 22.6-1.21l21.4-23.82a16 16
                    0 0 0-1.22-22.59z"></path></svg>
                  </div>

                  <div class="name text-uppercase">Home</div>
                </v-row>

                <div v-for="domain in domains" :key="domain.slug">
                  <ESAHeaderNavItem color="hsl(320 80% 60%)" :domain="domain" />
                </div>

              </v-col>
            </v-col>
          </div>
        </Transition>
      </nav>
    <v-dialog
      v-if="$route.name === 'explore'"
      v-model="dialog"
      :width="$vuetify.breakpoint.xsOnly ? '100%' : '30%'"
      transition="dialog-bottom-transition"
      style="z-index: 9999;">
      <div
        class="pa-7 pb-0"
        :style="{ background: $vuetify.theme.currentTheme.background }"
        :class="$vuetify.breakpoint.xsOnly && 'pb-10'"
      >
        <div v-html="welcomeText"/>
        <div class="text-center pb-4">
          <v-btn
            @click="dialog=false"
            color="primary"
            x-large
          >
            Explore!
          </v-btn>
        </div>
      </div>
    </v-dialog>
    </v-app-bar>
    <ESABreadcrumbs :domains="domains" />
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';

import ESABreadcrumbs from '@/components/ESA/ESABreadcrumbs.vue';
import ESAHeaderNavItem from './ESAHeaderNavItem.vue';

export default {
  components: {
    ESAHeaderNavItem,
    ESABreadcrumbs,
  },
  data() {
    return {
      isNavigationEnabled: false,
      isSearchEnabled: false,
      searchInput: '',
      dialog: true,
      domains: [
        {
          name: 'Energy Transition',
          slug: 'gtif-energy-transition',
          narratives: [
            {
              name: 'Energy present and future in EU and Austria',
              routeName: 'gtif-energy-transition',
            },
          ],
        },
        {
          name: 'Mobility Transition',
          slug: 'gtif-mobility-transition',
          narratives: [
            {
              name: 'From NOx emissions to tropospheric NO2 columns',
              routeName: 'gtif-mobility-transition',
            },
            {
              name: 'Daily mobility in Austria',
              routeName: 'gtif-social-mobility',
            },
          ],
        },
        {
          name: 'Sustainable Cities',
          slug: 'gtif-sustainable-cities',
          narratives: [
            {
              name: 'Cities\' role in climate neutrality',
              routeName: 'gtif-sustainable-cities',
            },
          ],
        },
        {
          name: 'Carbon Accounting',
          slug: 'gtif-carbon-accounting',
          narratives: [
            {
              name: 'The role of forests in the GHG emissions balance',
              routeName: 'gtif-carbon-accounting',
            },
          ],
        },
        {
          name: 'EO Adaptation Services',
          slug: 'gtif-eo-adaptation-services',
          narratives: [
            {
              name: 'Adapting forest management practices in a changing climate',
              routeName: 'gtif-eo-adaptation-services',
            },
          ],
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      loadTheme: 'themes/loadTheme',
    }),
    ...mapActions('gtif', [
      'setCurrentDomain',
    ]),
    switchNav() {
      this.isNavigationEnabled = !this.isNavigationEnabled;
    },

    switchSearch() {
      this.isSearchEnabled = !this.isSearchEnabled;
    },

    goHome() {
      this.setCurrentDomain('');
      this.$router.push({ name: 'landing' });
    },
  },
  created() {
    this.$vuetify.theme.dark = false;
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
    ...mapGetters({
      currentTheme: 'themes/getCurrentTheme',
    }),
    welcomeText() {
      return this.$marked(require(`../../../public${this.appConfig.aboutText}.md`).default);
    },
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

.search {
  position: fixed;
  top: 64px;
  left: 0;
  height: 56px;
  border: none;
  background: #052837;

  input {
    height: 56px;
    width: calc(100% - 56px);
    height: 100%;

    &::placeholder {
      color: #FFF;
      opacity: 0.6;
    }
  }

  .go {
    height: 56px;
    width: 56px;
    font-size: 20px;
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

    .name {
      font-size: 18px;
      transition: color 0.1s linear;
      color: lighten(#8197A6, 10%);
    }
  }
  ::v-deep .selected {
    background: #00ae9d;
    svg, i, .name{
      color: #fff !important;
    }
  }
}
</style>
