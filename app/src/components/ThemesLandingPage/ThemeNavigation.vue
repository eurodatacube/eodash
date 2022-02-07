<template>
  <v-container class="lighten-5" fluid>
    <div class="mobile-menu d-flex d-md-none">
      <v-btn class="extender justify-center align-center" @click="isExtended = !isExtended">
        Topics  v
      </v-btn>
      <v-row no-gutters class="button-row" style="z-index: 1000;" :class="{active: isExtended}">
        <template v-for="(theme, i) in themes">
          <v-col :key="theme.slug" class="px-1" cols="12" xs="12" sm="12" md="6" lg="2">
            <v-btn
              elevation="1"
              class="mb-2 mb-lg-0"
              :color="theme.color"
              style="min-width: 100%; max-width: 100%; color: rgba(0, 0, 0, 0.9);"
              large
              @click="$router.push('/themes/' + theme.slug)"
            >{{ theme.name }}</v-btn>
          </v-col>
        </template>
      </v-row>
    </div>
    <div class="normal-menu d-none d-md-flex">
      <v-row no-gutters class="button-row-2">
        <template v-for="(theme, i) in themes">
          <v-col :key="theme.slug" class="px-1" cols="12" xs="12" sm="12" md="6" lg="2">
            <v-btn
              elevation="1"
              class="mb-2 mb-lg-0"
              :color="theme.color"
              style="min-width: 100%; max-width: 100%; color: rgba(0, 0, 0, 0.9);"
              large
              @click="$router.push('/themes/' + theme.slug)"
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
  data () {
    return {
      isExtended: false,
    }
  },
  computed: {
    ...mapState({ themes: state => state.themes.themes }),
  }
};
</script>

<style lang="scss">
.extender {
  width: 100vw;
  height: 30px;
  background: #777;
}

.button-row {
  height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease;

  &.active {
    height: 10000px;
  }
}
</style>
