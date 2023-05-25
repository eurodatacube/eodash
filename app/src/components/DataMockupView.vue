<template>
  <v-col v-if="show"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <div class="py-2" v-if="GRStatistics">
    <h4>Aggregated statistics</h4>
    <v-tabs
      v-model="tab"
      align-tabs="center"
    >
      <v-tab v-for="(v, k, i) in GRStatistics" :key="i" :value="k">{{k}}</v-tab>
      <v-tab-item v-for="(v, k) in GRStatistics" :key="k">
        <v-simple-table
          v-model="tab">
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
                  <td> Maximum Annual Land Surface Temperature</td>
                  <td> {{ v.LST30mME }} degrees C </td>
                </tr>
                <tr>
                  <td> Total Roof area</td>
                  <td> {{ v.Roof_Area }} m² </td>
                </tr>
                <tr>
                  <td> Existing Green Roof area with a slope &lt; 5 degree</td>
                  <td> {{ v.GRPotAre5 }} m² </td>
                </tr>
                <tr>
                  <td> Existing Green Roof area with a slope ≥ 5 and &lt; 20 degree</td>
                  <td> {{ v.GRPotAre20 }} m² </td>
                </tr>
                <tr>
                  <td> Existing Green Roof area with a slope ≥ 20 and &lt; 45 degree</td>
                  <td> {{ v.GRPotAre45 }} m² </td>
                </tr>
                <tr>
                  <td>Unused Potential Area for Green Roof</td>
                  <td> {{ v.unused }} % </td>
                </tr>
              </tbody>
            </template>
        </v-simple-table>
      </v-tab-item>
  </v-tabs>
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
      tab: null,
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
          const adminIds = [];
          features.forEach((ftr) => {
            adminIds.push(ftr.getId());
          });
          const { selected, sourceLayer } = this.indicatorObject.queryParameters;
          const { adminZoneKey } = this.indicatorObject.display;
          let { timeKey } = this.indicatorObject.display;
          if (!timeKey) {
            timeKey = 'time';
          }

          const expUrl = `${geodbEndpoint}${sourceLayer}?${adminZoneKey}=in.(${adminIds.join(',')})&select=${selected},${timeKey},${adminZoneKey}`;
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
          const adminIds = [];
          features.forEach((ftr) => {
            adminIds.push(ftr.getId());
          });
          const { sourceLayer } = this.indicatorObject.wmsStyles;
          // ideally, we would iterate over all items from display if an array
          const { adminZoneKey } = this.indicatorObject.display[0];
          const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/${sourceLayer}?${adminZoneKey}=in.(${adminIds.join(',')})&select=Roof_Area,LST30mME,GRPotAre5,GRPotAre20,GRPotAre45,${adminZoneKey}`;
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const groupedBySelection = {};
              json.forEach((entry) => {
                if (!Object.prototype.hasOwnProperty.call(
                  groupedBySelection, entry[adminZoneKey],
                )) {
                  groupedBySelection[entry[adminZoneKey]] = {
                    Roof_Area: 0,
                    GRPotAre5: 0,
                    GRPotAre20: 0,
                    GRPotAre45: 0,
                    LST30mME: 0,
                    count: 0,
                  };
                }
                // compute statistics
                groupedBySelection[entry[adminZoneKey]].LST30mME += entry.LST30mME;
                groupedBySelection[entry[adminZoneKey]].Roof_Area += entry.Roof_Area;
                groupedBySelection[entry[adminZoneKey]].GRPotAre5 += entry.GRPotAre5;
                groupedBySelection[entry[adminZoneKey]].GRPotAre20 += entry.GRPotAre20;
                groupedBySelection[entry[adminZoneKey]].GRPotAre45 += entry.GRPotAre45;
                groupedBySelection[entry[adminZoneKey]].count += 1;
              });
              const statistics = {};
              const ind = {
                ...this.indicatorObject,
                fetchedData: {},
                time: [DateTime.fromISO('20220601')],
                xAxis: 'Green roof existing [m²]',
                yAxis: 'Green roof potential [m²]',
              };
              Object.keys(groupedBySelection).forEach((key) => {
                const {
                  GRPotAre5, GRPotAre20, GRPotAre45, Roof_Area,
                } = groupedBySelection[key];
                groupedBySelection[key].LST30mME /= groupedBySelection[key].count;
                const { LST30mME } = groupedBySelection[key];
                const unused = (1 - (GRPotAre5 + GRPotAre20 + GRPotAre45) / Roof_Area) * 100;
                statistics[key] = {
                  LST30mME: LST30mME.toFixed(1),
                  Roof_Area: Roof_Area.toFixed(0),
                  GRPotAre5: GRPotAre5.toFixed(0),
                  GRPotAre20: GRPotAre20.toFixed(0),
                  GRPotAre45: GRPotAre45.toFixed(0),
                  unused: unused.toFixed(2),
                };
                ind.fetchedData[key] = {
                  measurement: [GRPotAre5 + GRPotAre20 + GRPotAre45],
                  referenceValue: [Roof_Area],
                };
              });
              this.GRStatistics = statistics;
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
              window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
            });
        }
        if (['SOL2'].includes(this.indicatorObject.indicator)) {
          const description = 'PV Power potential [MWh]';
          const adminIds = [];
          features.forEach((ftr) => {
            adminIds.push(ftr.getId());
          });
          const { sourceLayer } = this.indicatorObject.wmsStyles;
          const { adminZoneKey } = this.indicatorObject.display[0];
          const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/${sourceLayer}?${adminZoneKey}=in.(${adminIds.join(',')})&select=roof_area,pveppmwhhp,${adminZoneKey}`;
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
