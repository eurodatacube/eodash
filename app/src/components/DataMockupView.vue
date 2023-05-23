<template>
  <v-col v-if="show"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <div class="py-2" v-if="GRStatistics">
    <h4>Aggregated statistics</h4>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Variable
            </th>
            <th class="text-left">
              Aggregated value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> Maximum Annual Land Surface Temperature (2021)</td>
            <td> {{ GRStatistics.lst2021 }} degrees C </td>
          </tr>
          <tr>
            <td> Total Roof area</td>
            <td> {{ GRStatistics.roofArea }} m² </td>
          </tr>
          <tr>
            <td> Existing Green Roof area with a slope &lt; 9 degree</td>
            <td> {{ GRStatistics.grpotare9 }} m² </td>
          </tr>
          <tr>
            <td> Existing Green Roof area with a slope ≥ 9 and &lt; 15 degree</td>
            <td> {{ GRStatistics.grpotare15 }} m² </td>
          </tr>
          <tr>
            <td> Existing Green Roof area with a slope ≥ 15 and &lt; 20 degree</td>
            <td> {{ GRStatistics.grpotare20 }} m² </td>
          </tr>
          <tr>
            <td>Unused Potential Area for Green Roof</td>
            <td> {{ GRStatistics.unused }} % </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
    selectedFeatures: Array[Object],
    updateQueryParametersTrigger: Number,
  },
  watch: {
    selectedFeatures(features) {
      this.fetchCustomChartForFeatures(features);
    },
    updateQueryParametersTrigger() {
      // if selected feature, fetch custom chart
      // (triggered by component for vector style)
      const features = this.$store.state.features.selectedFeatures;
      if (features) {
        this.fetchCustomChartForFeatures(features);
      }
    },
  },
  computed: {
    show() {
      return this.selectedFeatures.length && this.indicatorObject
      && ['SOL1',
        // 'SOL2', 'SOL3', 'SOL4', 'SOL5', 'SOL6', 'SOL7',
      ].includes(this.indicatorObject.indicator);
      // for now we set manually where we want the mockup to appear
    },
  },
  data() {
    return {
      GRStatistics: null,
      SRStatistics: null,
    };
  },
  mounted() {
  },
  methods: {
    fetchCustomChartForFeatures(features) {
      this.GRStatistics = null;
      this.SRStatistics = null;
      const geodbEndpoint = 'https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_';
      if (features.length > 0) {
        if (['AQA', 'AQB', 'AQC', 'AQ1', 'MOBI1'].includes(this.indicatorObject.indicator)) {
          const feature = features[0];
          const adminId = feature.getId();
          const { selected, sourceLayer } = this.indicatorObject.queryParameters;
          const { adminZoneKey, timeKey } = this.indicatorObject.display;
          const expUrl = `${geodbEndpoint}${sourceLayer}?${adminZoneKey}=eq.${adminId}&select=${selected},${timeKey}`;
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const retrievedData = {};
              json.sort((a, b) => (
                DateTime.fromISO(a[timeKey]).toMillis() - DateTime.fromISO(b[timeKey]).toMillis()
              ));
              json.forEach((entry) => {
                Object.keys(entry).forEach((key) => {
                  let value = entry[key];
                  if (key === timeKey) {
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
                time: retrievedData[timeKey],
                measurement: retrievedData[selected],
                yAxis: selected,
              };
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
              window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
            });
        }
        if (['SOL1'].includes(this.indicatorObject.indicator)) {
          const description = 'Green roof potential area [m²]';
          const feature = features[0];
          const adminId = feature.getId();
          const { sourceLayer } = this.indicatorObject.wmsStyles;
          const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/${sourceLayer}?zsp_id=eq.${adminId}&select=roof_area,grimpscore,lst2021,grpotare9,grpotare15,grpotare20`;
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
              let roofArea = 0;
              let grpotare9 = 0;
              let grpotare15 = 0;
              let grpotare20 = 0;
              let lst2021 = 0;
              json.forEach((entry) => {
                newData.time.push(DateTime.fromISO('20220601'));
                newData.measurement.push(entry.grimpscore);
                newData.referenceValue.push(entry.roof_area);
                // compute statistics
                lst2021 += entry.lst2021;
                roofArea += entry.roof_area;
                grpotare9 += entry.grpotare9;
                grpotare15 += entry.grpotare15;
                grpotare20 += entry.grpotare20;
              });
              lst2021 /= json.length;
              const unused = (1 - (grpotare9 + grpotare15 + grpotare20) / roofArea) * 100;
              this.GRStatistics = {
                lst2021: lst2021.toFixed(1),
                roofArea: roofArea.toFixed(0),
                grpotare9: grpotare9.toFixed(0),
                grpotare15: grpotare15.toFixed(0),
                grpotare20: grpotare20.toFixed(0),
                unused: unused.toFixed(2),
              };
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
        if (['SOL2'].includes(this.indicatorObject.indicator)) {
          const description = 'PV Power potential [MWh]';
          const feature = features[0];
          const adminId = feature.getId();
          const { sourceLayer } = this.indicatorObject.wmsStyles;
          const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/${sourceLayer}?zsp_id=eq.${adminId}&select=roof_area,pveppmwhhp`;
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
                newData.measurement.push(entry.pveppmwhhp);
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
  beforeDestroy() {
  },
  render: () => null,
};
</script>

<style lang="scss" scoped>
</style>
