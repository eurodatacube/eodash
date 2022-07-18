<template>
  <v-container class="theme-nav lighten-5 pa-0" fluid>
    <div class="mobile-menu d-flex d-md-none">
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            Thematic Areas
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters class="button-row" style="z-index: 1000;">
              <template v-for="theme in themes">
                <v-col :key="theme.slug" cols="12" xs="12" sm="12" md="6"
                  :style="$vuetify.breakpoint.lgAndUp
                    ? `flex: 0 0 ${100 / themes.length}%; max-width: initial`
                    : ''"
                >
                  <v-btn
                    class="elevation-0 py-2 white--text"
                    :color="theme.color"
                    style="min-width: 100%; max-width: 100%;"
                    large
                    tile
                    @click="navigate(theme.slug)"
                  >{{ theme.name }}</v-btn>
                </v-col>
              </template>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div class="normal-menu d-none d-md-flex">
      <v-row no-gutters class="button-row-2 pa-0" style="flex-wrap: nowrap">
        <template v-for="theme in themes">
          <v-col no-gutters :key="theme.slug" class="" cols="12" xs="12" sm="12" md="6"
            :style="`flex: 0 0 ${100 / themes.length}%; max-width: initial`"
          >
            <v-btn
              class="elevation-0 py-2 white--text"
              :color="theme.color"
              style="min-width: 100%; max-width: 100%;"
              large
              tile
              @click="navigate(theme.slug)"
            >{{ theme.name }}</v-btn>
          </v-col>
        </template>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  props: {},
  data() {
    return {
      isExtended: false,
    };
  },
  methods: {
    navigate(slug) {
      if (this.$route.name !== slug) this.$router.push({ name: slug });
    },
  },
  computed: {
    ...mapState({ themes: (state) => state.themes.themes }),
  },
};
</script>

<style lang="scss" scoped>
.theme-nav {
  position: sticky;
  top: -1px;
  z-index: 3;
}

.mobile-menu ::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
