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
        <v-row class="charts">
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
      charts: {
        population: {
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
              data: [],
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }],
          },
        },

        urban: {
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
              data: [],
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }],
          },
        },

        agriculture: {
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
              data: [],
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }],
          },
        },
      },
      data: {},
      aggregatedData: {
        population: [],
        urban: [],
        agriculture: [],
      },
      selectedIndex: 'scenario',
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      chartElements: [],
      chartInstances: {},
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
  },
  methods: {
    async fetchData() {
      this.contentStatus = 'loading';

      if (!this.hasAggregatedBefore) {
        this.hasAggregatedBefore = true;
      }

      const fetchPromises = this.labels.map((label) => {
        var vars = this.selectedIndicator.display.wmsVariables.variables;

        var ssp = vars.ssp.selected;
        var height = vars.stormSurge.selected;
        var time = vars.time.selected;
        var confidence = 'medium';

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

        return {
          label,
          promise: fetch('https://api.ideas.adamplatform.eu/', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              geometry: this.selectedArea,
              ssp,
              // NOTE: Sistema's API has problems with low confidence, so this is is hardcoded for now. 
              confidence,
              storm_surge: height,
              year: time,
            }),
          }),
        };
      });

      console.log(fetchPromises);

      this.data = {};
      const promiseCollection = await Promise.allSettled(fetchPromises);

      // Wait for all child promises to resolve
      for (const item of promiseCollection) {
        await item.value.promise;
      }
      //await Promise.allSettled(promiseCollection.map(item => item.value.promise));

      var data = {};

      for (const entry of promiseCollection) {
        console.log(entry);

        let response = await entry.value.promise;

        // We take here only fulfilled datasets
        if (response.status == 200) {
          this.data[entry.value.label] = await response.json();
        }
      }

      console.log(this.data);

      this.contentStatus = getContentStatus(promiseCollection);

      // Check to see if there were rejected requests due to timeout
      const timeoutDetected = promiseCollection.find((entry) => entry.status === 'rejected' || entry.value.status >= 400);
      if (timeoutDetected) {
        this.$store.commit('sendAlert', {
          message: 'There were some issues retrieving the data, possibly only partial results are shown. Please try the request again.',
          type: 'warning',
        });
      }

      for (const [label, values] of Object.entries(this.data)) {
        this.aggregatedData.population.push(values.GHS_POP_E2020_GLOBE);
        this.aggregatedData.urban.push(values.GHS_BUILT_S_E2020_GLOBE);
        this.aggregatedData.agriculture.push(values.cereals);
      }
/*
      this.aggregatedData = this.labels.reduce((acc, label) => {
        const scenarioData = this.data[label];
        acc.population.push(scenarioData.GHS_POP_E2020_GLOBE);
        acc.urban.push(scenarioData.GHS_BUILT_S_E2020_GLOBE);
        acc.agriculture.push(scenarioData.cereals);
        return acc;
      }, { population: [], urban: [], agriculture: [] });
*/

      this.updateCharts();

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

        const scenarioData = this.data[label];
        this.aggregatedData.population.push(scenarioData.GHS_POP_E2020_GLOBE);
        this.aggregatedData.urban.push(scenarioData.GHS_BUILT_S_E2020_GLOBE);
        this.aggregatedData.agriculture.push(scenarioData.cereals);
      } catch (error) {
        console.error(error);
      }

      this.updateCharts();
    },

    updateCharts() {
      this.contentStatus = 'success';
      console.log('Updating charts');
      console.log(this.aggregatedData);

      this.charts.population.data.datasets[0].data  = this.aggregatedData.population;
      this.charts.urban.data.datasets[0].data       = this.aggregatedData.urban;
      this.charts.agriculture.data.datasets[0].data = this.aggregatedData.agriculture;

      this.charts.population.data.labels  = Object.keys(this.data);
      this.charts.urban.data.labels  = Object.keys(this.data);
      this.charts.agriculture.data.labels  = Object.keys(this.data);

      this.chartInstances.population  = new Chart(document.getElementById('PopulationBarChart'),  this.charts.population);
      this.chartInstances.urban       = new Chart(document.getElementById('UrbanBarChart'),       this.charts.urban);
      this.chartInstances.agriculture = new Chart(document.getElementById('AgricultureBarChart'), this.charts.agriculture);
    },
  },
};
</script>

<style>
.charts canvas {
  max-width: 33%;
}
</style>
