<template>
  <div>
    <Narratives v-if="gtif && !inToolsMode"/>
    <eox-layercontrol
     v-else
     for="#centerMap" layerTitle="name"
     class="pointerEvents">
    </eox-layercontrol>
  </div>
</template>
<script>
import Narratives from './Narratives.vue';

export default {
  props: {
    gtif: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inToolsMode() {
      return this.$store.state.gtif.toolsToggle;
    },
  },
  components: { Narratives },
};
</script>
<style scoped></style>
