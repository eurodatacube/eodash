<template>
  <v-col v-if="show"
    :cols="$vuetify.breakpoint.mdAndDown"
    :style="`height: auto`"
  >
  <v-card v-if="GRStatistics || SRStatistics">
    <v-card-title class="pa-2">Aggregated statistics</v-card-title>
  <div class="py-2" v-if="GRStatistics">
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
                  <td> {{ v.lst30mme }} degrees C </td>
                </tr>
                <tr>
                  <td> Area of roofs where greening exists (computed on roof yes/no level, not on fraction level)</td>
                  <td> {{ v.existingGRRoofArea }} m² </td>
                </tr>
                <tr>
                  <td> Potential Green Roof area with a slope &lt; 5 degree</td>
                  <td> {{ v.grpotare5 }} m² </td>
                </tr>
                <tr>
                  <td> Potential Green Roof area with a slope ≥ 5 and &lt; 20 degree</td>
                  <td> {{ v.grpotare20 }} m² </td>
                </tr>
                <tr>
                  <td> Potential Green Roof area with a slope ≥ 20 and &lt; 45 degree</td>
                  <td> {{ v.grpotare45 }} m² </td>
                </tr>
                <tr>
                  <td> Potential CO2 reduction due to saved energy
                    from green roof installation with a slope &lt; 5 degree</td>
                  <td> {{ v.co2red05 }} tons/year</td>
                </tr>
                <tr>
                  <td> Potential CO2 reduction due to saved energy
                    from green roof installation with a slope ≥ 5 and &lt; 20 degree</td>
                  <td> {{ v.co2red20 }} tons/year</td>
                </tr>
                <tr>
                  <td> Potential CO2 reduction due to saved energy
                    from green roof installation with a slope ≥ 20 and &lt; 45 degree</td>
                  <td> {{ v.co2red45 }} tons/year</td>
                </tr>
              </tbody>
            </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs>
  </div>
  <div class="py-2" v-if="SRStatistics">
    <v-tabs
      v-model="tab"
      align-tabs="center"
    >
      <v-tab v-for="(v, k, i) in SRStatistics" :key="i" :value="k">{{k}}</v-tab>
      <v-tab-item v-for="(v, k) in SRStatistics" :key="k">
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
                  <td> Potentially usable solar roof area </td>
                  <td> {{ v.potentialSRRoofArea }} m² </td>
                </tr>
                <tr>
                  <td> Area of roofs where solar power exists (computed on roof yes/no level, not on fraction level)</td>
                  <td> {{ v.existingSRRoofArea }} m² </td>
                </tr>
                <tr>
                  <td> Total electric power production potential - High Performance</td>
                  <td> {{ v.pveppmwhhp }} MWh</td>
                </tr>
                <tr>
                  <td> Total electric power production potential - Medium Performance</td>
                  <td> {{ v.pveppmwhrp }} MWh</td>
                </tr>
                <tr>
                  <td> Total electric power production potential - Low Performance</td>
                  <td> {{ v.pveppmwhlp }} MWh</td>
                </tr>
              </tbody>
            </template>
        </v-simple-table>
      </v-tab-item>
  </v-tabs>
  </div>
  </v-card>
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
      return this.selectedFeatures?.length && this.indicatorObject
      && ['SOL1', 'SOL1_1', 'SOL1_2', 'SOL1_3', 'SOL1_4', 'SOL1_5', 'SOL1_6', 'SOL1_7',
        'SOL2', 'SOL2_1', 'SOL2_2', 'SOL2_3', 'HAUC2',
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
        if (['AQA', 'AQB', 'AQC', 'MOBI1', 'MOBI1_1', 'ADO', 'ADO_1', 'ADO_2', 'ADO_3'].includes(this.indicatorObject.indicator)) {
          const { adminZoneKey } = this.indicatorObject.display;
          const adminIds = [];
          features.forEach((ftr) => {
            let id = ftr.getId();
            if (['ADO', 'ADO_1', 'ADO_2', 'ADO_3'].includes(this.indicatorObject.indicator)) {
              id = ftr.get(adminZoneKey);
            }
            adminIds.push(id);
          });
          const { selected, sourceLayer } = this.indicatorObject.queryParameters;
          let { timeKey } = this.indicatorObject.display;
          if (!timeKey) {
            timeKey = 'time';
          }

          let additionalQuery = '';
          if (['ADO', 'ADO_1', 'ADO_2', 'ADO_3'].includes(this.indicatorObject.indicator)) {
            additionalQuery = '&time=gt.2018-06-01';
          }

          const expUrl = `${geodbEndpoint}${sourceLayer}?${adminZoneKey}=in.(${adminIds.join(',')})&select=${selected},${timeKey},${adminZoneKey}${additionalQuery}`;
          window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: true }));
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
              };
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
            })
            .finally(() => window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false })));
        }
        const solarRoofIndicator = ['SOL2', 'SOL2_1', 'SOL2_2', 'SOL2_3'].includes(this.indicatorObject.indicator);
        const greenRoofIndicator = ['SOL1', 'SOL1_1', 'SOL1_2', 'SOL1_3', 'SOL1_4', 'SOL1_5', 'SOL1_6', 'SOL1_7'].includes(this.indicatorObject.indicator);
        if (solarRoofIndicator || greenRoofIndicator) {
          const { selected } = this.indicatorObject.queryParameters;
          const zspStrings = [];
          const originalZsps = [];
          const gemIds = [];
          // gemeinde used as prefix for ZSP 35100 -> 31510000 - 31510999
          const { adminZoneKey } = this.indicatorObject.display[0];
          features.forEach((ftr) => {
            const gemIdStr = Math.floor(ftr.getId() / 1000).toString();
            const zspIds = [parseInt(`${gemIdStr}000`, 10), parseInt(`${gemIdStr}999`, 10)];
            // zsp between min and max available
            const zspIdsMerged = `and(${adminZoneKey}.gte.${zspIds[0]},${adminZoneKey}.lte.${zspIds[1]})`;
            zspStrings.push(zspIdsMerged);
            originalZsps.push(ftr);
            gemIds.push(gemIdStr);
          });
          const sourceLayer = this.indicatorObject.display.find((item) => item?.selection?.layer);
          const urlGem = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_AT_Gemeinden_3857?id=in.(${gemIds.join(',')})&select=name,id`;
          const ind = {
            ...this.indicatorObject,
            fetchedData: {},
            xAxis: `${solarRoofIndicator ? 'Solar' : 'Green'} roof potential [km²]`,
            yAxis: `Total roofs where ${solarRoofIndicator ? 'solar power' : 'greening'} exists [km²]`,
            originalZsps,
            gemIds: {},
            name: `Potential area / Total roofs where ${solarRoofIndicator ? 'solar' : 'green'} exist`,
          };
          window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: true }));
          fetch(urlGem)
            .then((resp) => resp.json())
            .then((gemIdResponse) => {
              gemIdResponse.forEach((item) => {
                const gemName = item.name;
                const gemId = item.id;
                ind.gemIds[gemId] = gemName;
              });
            })
            .then(() => {
              const expUrl = `https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/${sourceLayer.selection.layer}?or=(${zspStrings.join(',')})&select=${selected},${adminZoneKey}`;
              fetch(expUrl)
                .then((resp) => resp.json())
                .then((json) => {
                  const groupedBySelection = {};
                  json.forEach((entry) => {
                    if (!Object.prototype.hasOwnProperty.call(
                      groupedBySelection, entry[adminZoneKey],
                    )) {
                      if (greenRoofIndicator) {
                        groupedBySelection[entry[adminZoneKey]] = {
                          grpotare5: 0,
                          grpotare20: 0,
                          grpotare45: 0,
                          co2red05: 0,
                          co2red20: 0,
                          co2red45: 0,
                          lst30mme: 0,
                          count: 0,
                          existingGRRoofArea: 0,
                        };
                      } else if (solarRoofIndicator) {
                        groupedBySelection[entry[adminZoneKey]] = {
                          potentialSRRoofArea: 0,
                          pveppmwhhp: 0,
                          pveppmwhrp: 0,
                          pveppmwhlp: 0,
                          existingSRRoofArea: 0,
                        };
                      }
                    }
                    if (solarRoofIndicator) {
                      if (entry.pvexisting === 1) {
                        groupedBySelection[entry[adminZoneKey]].existingSRRoofArea += entry.pvusearea / 1000000;
                      }
                      if (entry.pvpotentl === 1) {
                        groupedBySelection[entry[adminZoneKey]].potentialSRRoofArea += entry.pvusearea / 1000000;
                      }
                      groupedBySelection[entry[adminZoneKey]].pveppmwhhp += entry.pveppmwhhp;
                      groupedBySelection[entry[adminZoneKey]].pveppmwhrp += entry.pveppmwhrp;
                      groupedBySelection[entry[adminZoneKey]].pveppmwhlp += entry.pveppmwhlp;
                    } else if (greenRoofIndicator) {
                      // compute statistics
                      if (entry.grexisting === 1) {
                        groupedBySelection[entry[adminZoneKey]].existingGRRoofArea += (entry.grpotare5 + entry.grpotare20 + entry.grpotare45) / 1000000;
                      }
                      groupedBySelection[entry[adminZoneKey]].lst30mme += entry.lst30mme;
                      groupedBySelection[entry[adminZoneKey]].grpotare5 += entry.grpotare5 / 1000000;
                      groupedBySelection[entry[adminZoneKey]].grpotare20 += entry.grpotare20 / 1000000;
                      groupedBySelection[entry[adminZoneKey]].grpotare45 += entry.grpotare45 / 1000000;
                      groupedBySelection[entry[adminZoneKey]].co2red05 += entry.co2red_05;
                      groupedBySelection[entry[adminZoneKey]].co2red20 += entry.co2red_20;
                      groupedBySelection[entry[adminZoneKey]].co2red45 += entry.co2red_45;
                      groupedBySelection[entry[adminZoneKey]].count += 1;
                    }
                  });
                  const statistics = {};
                  Object.keys(groupedBySelection).forEach((key) => {
                    const gemId = Math.floor(parseInt(key, 10) / 1000);
                    if (!Object.prototype.hasOwnProperty.call(ind.fetchedData, gemId)) {
                      ind.fetchedData[gemId] = {};
                    }
                    const {
                      grpotare5, grpotare20, grpotare45, co2red05, co2red20, co2red45, existingGRRoofArea,
                      pveppmwhhp, pveppmwhrp, pveppmwhlp, existingSRRoofArea, potentialSRRoofArea,
                    } = groupedBySelection[key];
                    if (originalZsps.map((ftr) => ftr.getId()).includes(parseInt(key, 10))) {
                      if (greenRoofIndicator) {
                        // for statistics consider only originally clicked ZSPs
                        groupedBySelection[key].lst30mme /= groupedBySelection[key].count;
                        const { lst30mme } = groupedBySelection[key];
                        statistics[key] = {
                          lst30mme: lst30mme.toFixed(1),
                          existingGRRoofArea: (existingGRRoofArea * 1000000).toFixed(0),
                          grpotare5: (grpotare5 * 1000000).toFixed(0),
                          grpotare20: (grpotare20 * 1000000).toFixed(0),
                          grpotare45: (grpotare45 * 1000000).toFixed(0),
                          co2red05: co2red05.toFixed(0),
                          co2red20: co2red20.toFixed(0),
                          co2red45: co2red45.toFixed(0),
                        };
                      } else if (solarRoofIndicator) {
                        statistics[key] = {
                          pveppmwhhp: pveppmwhhp.toFixed(0),
                          pveppmwhrp: pveppmwhrp.toFixed(0),
                          pveppmwhlp: pveppmwhlp.toFixed(0),
                          existingSRRoofArea: (existingSRRoofArea * 1000000).toFixed(0),
                          potentialSRRoofArea: (potentialSRRoofArea * 1000000).toFixed(0),
                        };
                      }
                    }
                    if (greenRoofIndicator) {
                      ind.fetchedData[gemId][key] = {
                        potential: [grpotare5 + grpotare20 + grpotare45],
                        totalroof: [existingGRRoofArea],
                      };
                    } else if (solarRoofIndicator) {
                      ind.fetchedData[gemId][key] = {
                        potential: [potentialSRRoofArea],
                        totalroof: [existingSRRoofArea],
                      };
                    }
                  });
                  if (solarRoofIndicator) {
                    this.SRStatistics = statistics;
                  } else if (greenRoofIndicator) {
                    this.GRStatistics = statistics;
                  }

                  this.$store.commit(
                    'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
                  );
                })
                .finally(() => {
                  window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
                });
            });
        }
        if (['HAUC2'].includes(this.indicatorObject.indicator)) {
          const adminIds = [];
          features.forEach((ftr) => {
            adminIds.push(ftr.getId());
          });
          const expUrl = 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/2024_stats.json';
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              // fetch other stats
              const statsUrl = 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/HeatAdapt/update/admin_area_stats.json';
              fetch(statsUrl)
                .then((respstats) => respstats.json())
                .then((jsonstats) => {
                  // Load only selected gemeinde
                  const dataArray = [];
                  adminIds.forEach((key) => {
                    if (key in json) {
                      dataArray.push({
                        data: json[key],
                        stats: jsonstats[key],
                      });
                    }
                  });
                  const ind = {
                    ...this.indicatorObject,
                    fetchedData: dataArray,
                    xAxis: 'Soil sealing percentage [%]',
                    yAxis: 'Average temperature [°]',
                    stats: jsonstats,
                  };
                  this.$store.commit(
                    'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
                  );
                  window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
                });
            });
        }
        if (['AQ1',
          // 'AQ1_1',
          'AQ1_2', 'AQ1_3', 'AQ1_4', 'AQ1_5', 'AQ1_6'].includes(this.indicatorObject.indicator)) {
          const adminIds = [];
          features.forEach((ftr) => {
            adminIds.push(Number(ftr.get('object_id')));
          });
          const { selected, sourceLayer } = this.indicatorObject.queryParameters;
          // ideally, we would iterate over all items from display if an array
          const { adminZoneKey } = this.indicatorObject.display;
          const expUrl = `${geodbEndpoint}${sourceLayer}?${adminZoneKey}=in.(${adminIds.join(',')})&select=satellite_values,${selected},${adminZoneKey}`;
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const groupedBySelection = {};
              json.forEach((entry) => {
                if (!Object.prototype.hasOwnProperty.call(
                  groupedBySelection, entry[adminZoneKey],
                )) {
                  groupedBySelection[entry[adminZoneKey]] = {
                    time: [],
                    measurement: [],
                    referenceValue: [],
                  };
                }
                if (entry[selected] !== null && entry.satellite_values !== null) {
                  groupedBySelection[entry[adminZoneKey]].measurement.push(entry[selected]);
                  groupedBySelection[entry[adminZoneKey]].referenceValue.push(entry.satellite_values);
                }
              });
              const ind = {
                ...this.indicatorObject,
                fetchedData: groupedBySelection,
                xAxis: 'Sentinel5-p NO2 [µmol/m²]',
              };
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
              window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false }));
            });
        }
        if (['REP1', 'REP1_1', 'REP1_2'].includes(this.indicatorObject.indicator)) {
          const { selected, sourceLayer } = this.indicatorObject.queryParameters;
          const adminZoneKey = 'zsp_id';
          const adminIds = [];
          features.forEach((ftr) => {
            const id = ftr.getId();
            adminIds.push(id);
          });

          const expUrl = `${geodbEndpoint}${sourceLayer}?${adminZoneKey}=in.(${adminIds.join(',')})&select=${selected}`;
          window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: true }));
          fetch(expUrl)
            .then((resp) => resp.json())
            .then((json) => {
              const newData = {
                time: [],
                measurement: [],
              };
              Object.keys(json[0]).forEach((month) => {
                newData.time.push(DateTime.utc(2000, parseInt(month, 10)));
                newData.measurement.push(parseFloat(json[0][month]).toFixed(2));
              });
              const ind = {
                ...this.indicatorObject,
                time: newData.time,
                measurement: newData.measurement,
                yAxis: 'Wind speed m/s',
              };
              this.$store.commit(
                'indicators/CUSTOM_AREA_INDICATOR_LOAD_FINISHED', ind,
              );
            })
            .finally(() => window.dispatchEvent(new CustomEvent('set-custom-area-indicator-loading', { detail: false })));
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
