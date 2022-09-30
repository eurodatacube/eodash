<template>
  <router-link
    :to="{name: to}"
    class="gtif-dashboard-bubble d-flex justify-center align-center"
    :style="{
        'background': color,
        'outline-color': color,
    }"
>
    <b class="text-center">{{ title }}</b>
  </router-link>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'GTIFTile',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),
  },
};
</script>

<style lang="scss" scoped>
$bubble-size: 142px;

.gtif-dashboard-bubble {
    width: $bubble-size;
    height: $bubble-size;
    color: #FFF;
    border-radius: 50%;
    outline-width: 2px;
    outline-style: solid;
    outline-offset: 8px;
    cursor: pointer;
    user-select: none;
    margin: 20px;
    text-decoration: none;

    b {
        max-width: 85%;
    }
}
</style>
