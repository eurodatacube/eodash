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

export default {
  components: {
    // GlobalHeader,
    GlobalFooter,
  },
  methods: {
    initWidgets(element) {
      // debugger;
      if (element?.tagName === 'EOX-MAP') {
        element.registerProjection(
          'ESRI:53009',
          '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 '
            + '+b=6371000 +units=m +no_defs',
        );
        const projection = element.getAttribute('projection');
        if (projection) {
          console.log('SETTING PROJECTION!!!!!');
          element.setAttribute('projection', projection);
        }
      }
    },
  },
};
</script>
