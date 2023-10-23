<template>
  <div class="pa-2 ma-1" style="overflow: hidden;">
    <Narratives v-if="gtif && !inToolsMode"/>
    <eox-layercontrol
     v-else
     for="#centerMap"
     :titleProperty.prop="'name'"
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
