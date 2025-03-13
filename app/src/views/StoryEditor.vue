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
        @init="initWidgets"
      ></eox-storytelling>
      <global-footer />
    </div>
  </div>
</template>

<script>
// import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import { PROJDICT } from '../utils';

export default {
  components: {
    // GlobalHeader,
    GlobalFooter,
  },
  methods: {
    initWidgets({ detail }) {
      const element = detail;
      if (element?.tagName === 'EOX-MAP') {
        element.registerProjection(
          'EPSG:3035',
          PROJDICT['EPSG:3035'].def,
          PROJDICT['EPSG:3035'].extent,
        );
        element.registerProjection(
          'ORTHO:680500',
          PROJDICT['ORTHO:680500'].def,
          PROJDICT['ORTHO:680500'].extent,
        );
        element.registerProjection(
          'EPSG:3031',
          PROJDICT['EPSG:3031'].def,
          PROJDICT['EPSG:3031'].extent,
        );
        element.registerProjection(
          'EPSG:3411',
          PROJDICT['EPSG:3411'].def,
          PROJDICT['EPSG:3411'].extent,
        );
      }
    },
  },
};
</script>
