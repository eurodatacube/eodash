<template>
  <div
    class="fill-height"
  >
    <div
      class="fill-height"
    >
      <!-- <global-header /> -->
      <eox-storytelling
        show-editor="open"
        markdown="## Welcome to the story editor "
        style="overflow-y: auto; height: calc(var(--vh, 2vh) * 100);"
      ></eox-storytelling>
      <global-footer />
    </div>
  </div>
</template>

<script>
// import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';

export default {
  components: {
    // GlobalHeader,
    GlobalFooter,
  },
};
</script>
