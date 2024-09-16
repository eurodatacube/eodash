<template>
  <v-card>
    <v-card-title class="pa-2">{{ featureQueryParamsData.title }}</v-card-title>
    <p class="pa-2 ma-0">
        Toggle any combination of OpenStreetMap features
        to check how different areas can be affected.
        <br>Note: Availability of OSM data for crops
        differs for different parts of the world.
      </p>
    <v-row class="ma-0 pa-2">
    <v-col class="ma-0 pa-0" cols="6"
        v-for="configItem in featureQueryParamsData.items"
        :key="getConfigItemLabel(configItem)">
        <v-checkbox class="ma-0 pa-0"
          v-bind:false-value="false"
          v-bind:true-value="true"
          v-model="configItem.selected"
          :label="getConfigItemLabel(configItem)"
          :value="configItem.value"
          @change="(evt) => updateMapBool(evt, configItem.key, configItem.value)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>

export default {
  name: 'FeatureQueryParams',
  components: {},
  props: {
    featureQueryParams: Object,
  },
  data: () => ({
    featureQueryParamsData: null,
  }),
  created() {
    this.featureQueryParamsData = this.featureQueryParams;
  },
  computed: {
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
  },
  methods: {
    getConfigItemLabel(configItem) {
      return `${configItem.key}: ${configItem.value}`;
    },
    updateMapBool(enabled, key, value) {
      const newParams = JSON.parse(JSON.stringify(this.featureQueryParamsData));
      newParams.items.forEach((item) => {
        if (item.key === key && item.value === value) {
          // eslint-disable-next-line no-param-reassign
          item.selected = enabled;
        }
      });
      this.featureQueryParamsData = newParams;
      this.indicatorObject.display.features.featureQueryParams = newParams;
      // trigger refresh at map
      window.postMessage({
        command: 'map:refreshFeatures',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
