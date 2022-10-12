<template>
  <v-col v-if="show"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <div class="py-2">
    <div v-if="adminLayerName">
      <b>Administrative level:</b> {{ adminLayerName }}
    </div>
    <div v-if="adminFeatureName">
      <b>Selected:</b> {{ adminFeatureName }}
    </div>
  </div>
  <div v-if="adminLayerName === 'Census Track (Zählsprengel)'
    && adminFeatureName === '70101420'
    && indicatorObject.indicator === 'SOL1'
  ">
    <h4 class="py-2">Specific data for administrative unit</h4>
    <h3> Green Roof:</h3>
    <p><b>mean land surface temperature (2021):</b> 39 degrees C</p>
    <p><b>Existing GR:</b> 20 Roofs</p>
    <p><b>Roofs suitable for GRl:</b> 81 Roofs</p>
    <p><b>Unused Potential Area for GR:</b> 49.3%</p>
  </div>
  <div v-if="adminLayerName === 'Census Track (Zählsprengel)'
  && adminFeatureName === '70101030'
  && indicatorObject.indicator === 'SOL1'
">
  <h4 class="py-2">Specific data for administrative unit</h4>
    <h3> Green Roof</h3>
    <p><b>mean land surface temperature (2021):</b> 42 degrees C</p>
    <p><b>Existing GR:</b> 9 Roofs</p>
    <p><b>Roofs suitable for GRl:</b> 65 Roofs</p>
    <p><b>Unused Potential Area for GR:</b> 8.5%</p>
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
  