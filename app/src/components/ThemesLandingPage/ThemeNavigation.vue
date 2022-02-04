<template>
  <v-container class="lighten-5" fluid>
    <v-row no-gutters>
      <template v-for="(theme, i) in themes">
        <v-col :key="theme.slug" class="px-1" cols="12" xs="12" sm="12" md="6" lg="2">
          <v-btn
            elevation="1"
            :color="theme.color"
            style="min-width: 100%; max-width: 100%; color: rgba(0, 0, 0, 0.9);"
            large
          >{{ theme.name }}</v-btn>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
  import {
  mapState,
} from 'vuex';

export default {
  props: {},
  computed: {
    ...mapState({ themes: state => state.themes.themes }),
  }
};
</script>

<style lang="scss">

</style>
