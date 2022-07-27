<template>
  <div>
    <v-btn class="controlButton">+</v-btn>
    <v-btn class="controlButton">-</v-btn>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    mapId: String,
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
  beforeDestroy() {

  },
};
</script>

<style lang="scss" scoped>
  .controlButton {
    width: 36px;
    min-width: 0px !important;
    height: 36px !important;
    z-index: 2;
    pointer-events: initial;
  }
</style>
