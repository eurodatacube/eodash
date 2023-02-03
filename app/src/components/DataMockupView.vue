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
    <p>
    <img
      src="data/gtif/images/GR_70101420_chart.png"
      width="350px"
    />
    </p>
  </div>
  <div v-if="adminLayerName === 'Census Track (Zählsprengel)'
  && adminFeatureName === '70101030'
  && indicatorObject.indicator === 'SOL1'
">
    <p><b>mean land surface temperature (2021):</b> 42 degrees C</p>
    <p><b>Existing GR:</b> 9 Roofs</p>
    <p><b>Roofs suitable for GRl:</b> 65 Roofs</p>
    <p><b>Unused Potential Area for GR:</b> 8.5%</p>
    <p>
    <img
    src="data/gtif/images/GR_70101030_chart.png"
    width="350px"
    />
    </p>
  </div>
  </v-col>
</template>

<script>
import { DateTime } from 'luxon';
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
    adminFeature(feature) {
      const geodbEndpoint = 'https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_';
      if (this.adminLayerName === 'Municipality (Gemeinde)') {
        if (['AQA', 'AQB', 'AQC'].includes(this.indicatorObject.indicator)) {
          const adminId = feature.get('id');
          const par = this.indicatorObject.queryParameters.selected;
          const expUrl = `${geodbEndpoint}air_quality_new_id?id_3=eq.${adminId}&select=${par},time`;
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const retrievedData = {};
              json.sort((a, b) => (
                DateTime.fromISO(a.time).toMillis() - DateTime.fromISO(b.time).toMillis()
              ));
              json.forEach((entry) => {
                Object.keys(entry).forEach((key) => {
                  let value = entry[key];
                  if (key === 'time') {
                    value = DateTime.fromISO(value);
                  }
                  if (key in retrievedData) {
                    retrievedData[key].push(value);
                  } else {
                    retrievedData[key] = [value];
                  }
                });
              });
              const ind = {
                ...this.indicatorObject,
                time: retrievedData.time,
                measurement: retrievedData[par],
                // TODO: Add possible additional fields
              };
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
              window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
            });
        }
        if (this.indicatorObject.indicator === 'MOBI1') {
          const par = this.indicatorObject.queryParameters.selected;
          const adminId = feature.get('id');
          const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_mobility?adminzoneid=eq.${adminId}&select=${par},time`;
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const newData = {
                time: [],
                measurement: [],
                referenceValue: [],
                colorCode: [],
              };
              json.sort((a, b) => (
                DateTime.fromISO(a.time).toMillis() - DateTime.fromISO(b.time).toMillis()
              ));
              json.forEach((entry) => {
                newData.time.push(DateTime.fromISO(entry.time));
                newData.measurement.push(entry[par]);
              });
              const ind = {
                ...this.indicatorObject,
                ...newData,
                yAxis: par,
              };
              console.log(ind);
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
              window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
            });
        }
      } else if (this.adminLayerName === 'Census Track (Zählsprengel)') {
        if (['SOL1', 'SOL2'].includes(this.indicatorObject.indicator)) {
          let par = 'grimpscore';
          let description = 'Green roof potential area [m²]';
          if (this.indicatorObject.indicator === 'SOL2') {
            par = 'pveppmwhhp';
            description = 'PV Power potential [MWh]';
          }
          const adminId = feature.get('id');
          const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_AT_Rooftops_3857?zsp_id=eq.${adminId}&select=roof_area,${par}`;
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const newData = {
                time: [],
                measurement: [],
                referenceValue: [],
                colorCode: [],
              };
              json.sort((a, b) => (
                DateTime.fromISO(a.time).toMillis() - DateTime.fromISO(b.time).toMillis()
              ));
              json.forEach((entry) => {
                newData.time.push(DateTime.fromISO('20220601'));
                newData.measurement.push(entry[par]);
                newData.referenceValue.push(entry.roof_area);
              });
              const ind = {
                ...this.indicatorObject,
                ...newData,
                xAxis: 'Roof area [m²]',
              };
              ind.yAxis = description;
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
              window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
            });
        }
      }
    },
  },
  computed: {
    show() {
      return this.adminLayer && this.adminFeature && this.indicatorObject
      && [
        'SOL1', 'SOL2', 'SOL3', 'SOL4', 'SOL5', 'SOL6', 'SOL7',
      ].includes(this.indicatorObject.indicator);
      // for now we set manually where we want the mockup to appear
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
    },
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
