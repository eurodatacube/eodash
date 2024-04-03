<template>
  <div
    class="fill-height"
  >
    <div
      class="fill-height"
    >
      <!-- <global-header /> -->
      <eox-storytelling
        show-editor
        markdown-url="./data/storytelling-md/new-storytelling-demo.md"
        style="overflow-y: auto; height: calc(var(--vh, 1vh) * 100);"
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
