<template>
  <v-col v-if="show"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <v-subheader>Area Specific content</v-subheader>
  <div v-if="adminLayerName">
    Administrative level: {{ adminLayerName }}
  </div>
  <div v-if="adminFeatureName">
    Selected: {{ adminFeatureName }}
  </div>
  <div v-if="indicatorObject.indicator">
    Indicator: {{ indicatorObject.indicator }}
  </div>
  <div v-if="isNutsLevel && indicatorObject.indicator === 'AQ'">
    This is visible only for NUTS L0-L3 admin levels for Air Quality Indicator
  </div>
  <div v-if="adminLayerName === 'District (Bezirk)'
    && adminFeatureName === 'Innsbruck-Land'
    && indicatorObject.indicator === 'REP2'
  ">
    This can be seen only for Innsbruck-Land bezirk and REP2 indicator
  </div>
  </v-col>
</template>

  <script>
  /**
   */
  export default {
    components: {
    },
    props: {
      indicatorObject: Object,
      adminFeature: Object,
      adminLayer: Object,
    },
    watch: {
    },
    computed: {
      show() {
        return this.adminLayer && this.adminFeature && this.indicatorObject;
      },
      adminFeatureName() {
        const props = this.adminFeature.getProperties();
        const key = Object.keys(props).find(
            (k) => ['name', 'nuts_name'].includes(k.toLowerCase()),
          );
        if (props[key]) {
          return props[key];
        }
        return null;
      },
      adminLayerName() {
        return this.adminLayer.get('name');
      },
      isNutsLevel() {
        return this.adminLayerName?.toLowerCase().includes('nuts');
      }
    },
    data() {
      return {
        overlayRows: [],
      };
    },
    mounted() {
    },
    methods: {
    },
    beforeDestroy() {
    },
    render: () => null,
  };
  </script>
  
  <style lang="scss" scoped>
  </style>
  