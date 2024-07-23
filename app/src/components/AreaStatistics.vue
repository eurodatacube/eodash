<template>
  <v-col>
    <v-row class="pt-4 area-statistics justify-space-between align-center mx-2">
      <h2>Area Statistics</h2>

      <v-btn
        @click="fetchData"
        color="primary"
        :disabled="!selectedArea || !selectedIndicator"
        :loading="contentStatus === 'loading'"
        small
      >Generate</v-btn>
    </v-row>

    <div
      class="d-flex justify-space-around mt-3"
      :class="{'flex-column': $vuetify.breakpoint.mdAndUp}"
    >
      <v-radio-group v-model="selectedIndex">
        <v-col
          class="d-flex justify-space-between ml-1 mt-2"
          :class="{
            'flex-column': $vuetify.breakpoint.smAndDown,
            'align-end': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <v-row class="mb-1">
            <v-radio
              label="Scenarios"
              value="scenario"
            />
          </v-row>

          <v-row class="mb-1">
            <v-radio
              label="Storm surge"
              value="height"
            />
          </v-row>

          <v-row class="mb-1">
            <v-radio
              label="Years"
              value="time"
            />
          </v-row>

          <v-row class="mb-1">
            <v-radio
              label="Confidence"
              value="confidence"
            />
          </v-row>
        </v-col>
      </v-radio-group>
      <v-col
        class="py-3 mx-2 mt-1 px-10 rounded text-center"
        style="background: #00417033"
        justify="center"
      >
        <v-row v-if="areChartsVisible" class="charts">
          <canvas id="PopulationBarChart" />
          <canvas id="UrbanBarChart" />
          <canvas id="AgricultureBarChart" />
        </v-row>

        <span v-if="contentStatus === 'nocontent'">No data available for the selected area.</span>
        <span v-if="contentStatus === 'loading'">Loading...</span>
        <span v-if="contentStatus === 'idle'">
          Select an area on the map to generate area statistics.
        </span>
      </v-col>
    </div>
  </v-col>
</template>

<script>
import {
  mapState,
} from 'vuex';

import Chart from 'chart.js';

function getContentStatus(promises) {
  // Map the results to their status codes
  const statusCodes = promises.map((entry) => entry.value.status);

  // Check if all status codes are 204
  const noContent = statusCodes.every((status) => status >= 300);
  if (noContent) {
    return 'none';
  }

  // Check if all status codes are successful (200-299)
  const allSuccess = statusCodes.every((status) => status >= 200 && status < 300);
  if (allSuccess) {
    return 'success';
  }
  return 'partial';
}

export default {
  name: 'AreaStatistics',
  data() {
    return {
      data: {},
      aggregatedData: {},
      selectedIndex: 'scenario',
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      chartElements: [],
      isLoading: false,
      hasAggregatedBefore: false,
      // One of 'idle', 'loading', 'nocontent', 'partial', 'success'
      contentStatus: 'idle',
    };
  },
  computed: {
    ...mapState('features', [
      'selectedArea',
    ]),
    ...mapState('indicators', [
      'selectedIndicator',
    ]),

    areChartsVisible() {
      return this.contentStatus === 'success'
        || this.contentStatus === 'partial';
    },

    labels() {
      const vars = this.selectedIndicator.display.wmsVariables.variables;

      switch (this.selectedIndex) {
        case 'scenario':
          return vars.ssp.items.map((item) => item.id);
        case 'height':
          return vars.stormSurge.items.map((item) => item.id);
        case 'time':
          return vars.time.items.map((item) => item.id);
        case 'confidence':
          return vars.confidence.items.map((item) => item.id);
        default:
          return [];
      }
    },

    selectedLabel() {
      const vars = this.selectedIndicator.display.wmsVariables.variables;

      switch (this.selectedIndex) {
        case 'scenario':
          return `ssp${vars.ssp.selected}`;
        case 'height':
          return vars.stormSurge.selected;
        case 'time':
          return vars.time.selected;
        case 'confidence':
          return vars.confidence.selected;
        default:
          return [];
      }
    },

    charts() {
      return [
        {
          type: 'bar',
          options: {
            legend: {
              labels: {
                // Disable colored boxes in legend
                boxWidth: 0,
              },
            },
          },
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Population',
              data: this.aggregatedData.population,
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }],
          },
        },

        {
          type: 'bar',
          options: {
            legend: {
              labels: {
                // Disable colored boxes in legend
                boxWidth: 0,
              },
            },
          },
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Urban',
              data: this.aggregatedData.urban,
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }],
          },
        },

        {
          type: 'bar',
          options: {
            legend: {
              labels: {
                // Disable colored boxes in legend
                boxWidth: 0,
              },
            },
          },
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Agriculture',
              data: this.aggregatedData.agriculture,
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }],
          },
        },
      ];
    },
  },
  methods: {
    async fetchData() {
      this.contentStatus = 'loading';
      if (!this.hasAggregatedBefore) {
        this.hasAggregatedBefore = true;
      }
      const fetchPromises = this.labels.map((label) => {
        let ssp = 'ssp119'; let confidence = 'low'; let height = '1_0'; let
          time = '2020'; // default values

        switch (this.selectedIndex) {
          case 'scenario':
            ssp = label;
            break;
          case 'height':
            height = label;
            break;
          case 'time':
            time = label;
            break;
          case 'confidence':
            confidence = label;
            break;
          default:
            break;
        }

        this.isLoading = true;

        return fetch('https://api.ideas.adamplatform.eu/', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            geometry: this.selectedArea,
            ssp,
            confidence,
            storm_surge: height,
            year: time,
          }),
        });
      });

      console.log(fetchPromises);

      await Promise.allSettled(fetchPromises)
        .then((promiseCollection) => {
          // Merge them together, for parsing
          // TODO: Add check to see if partial result was returned as status
          const status = 'OK';
          const data = promiseCollection.map((entry) => {
            let d = [];
            // We take here fulfilled datasets, rejected status is probably from timeout
            if (entry.status === 'fulfilled') {
              if (entry.value.status >= 400) {
                entry.status = 'rejected';
              }
              d = entry.value.data;
            }
            return d;
          }).flat();

          this.contentStatus = getContentStatus(promiseCollection);

          // Check to see if there were rejected requests due to timeout
          const timeoutDetected = promiseCollection.find((entry) => entry.status === 'rejected' || entry.value.status >= 400);
          if (timeoutDetected) {
            this.$store.commit('sendAlert', {
              message: 'There were some issues retrieving the data, possibly only partial results are shown. Please try the request again.',
              type: 'warning',
            });
          }
          const mergedData = {
            status,
            data,
          };

          return this.aggregate(mergedData);
        });

      return fetchPromises;
    },

    aggregate(mergedData) {
      console.log(mergedData);
      try {
        mergedData.data
          .forEach((m) => {
            console.log(m);
            console.log(m.data);
            this.data[m.label] = m.data;
          });

        this.aggregatedData = this.labels.reduce((acc, label) => {
          const scenarioData = this.data[label];
          acc.population.push(scenarioData.GHS_POP_E2020_GLOBE);
          acc.urban.push(scenarioData.GHS_BUILT_S_E2020_GLOBE);
          acc.agriculture.push(scenarioData.cereals);
          return acc;
        }, { population: [], urban: [], agriculture: [] });

        this.updateCharts();
      } catch (error) {
        console.error(error);
      }

      this.updateCharts();
    },

    updateCharts() {
      const chartElements = [
        document.getElementById('PopulationBarChart'),
        document.getElementById('UrbanBarChart'),
        document.getElementById('AgricultureBarChart'),
      ];

      chartElements.forEach((element, index) => {
        if (element) {
          this.chartElements.push(new Chart(element, this.charts[index]));
        }
      });
    },
  },
};
</script>

<style>
.charts canvas {
  max-width: 33%;
}
</style>
