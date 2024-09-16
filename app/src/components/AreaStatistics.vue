<template>
<v-card>
  <v-card-title class="pa-2">Custom Area Statistics</v-card-title>
  <v-col>
    <v-row class="pt-4 area-statistics justify-space-between align-center mx-2">
      <v-btn
        @click="fetchData"
        color="primary"
        :disabled="!selectedArea || !selectedIndicator"
        :loading="contentStatus === 'loading'"
        small
      >Generate</v-btn>
    </v-row>
    <v-row>
      <div class="pa-2">
        Select storm surge, years, or scenarios and additional
        parameters from the drop-down menu to
        generate charts representing predictions
        on population, build-up areas and agriculture areas.
      </div>
    </v-row>
    <div
      class="d-flex justify-space-around"
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
              label="SSP Scenarios"
              value="scenario"
            />
          </v-row>

          <v-row class="mb-1">
            <v-radio
              label="Storm surge in m"
              value="height"
            />
          </v-row>

          <v-row class="mb-1">
            <v-radio
              label="Model years"
              value="time"
            />
          </v-row>

          <!-- <v-row class="mb-1">
            <v-radio
              label="Confidence"
              value="confidence"
            />
          </v-row> -->
        </v-col>
      </v-radio-group>
      <span v-if="contentStatus === 'nocontent'">No data available for the selected area.</span>
      <span v-if="contentStatus === 'loading'">Loading...</span>
      <span v-if="contentStatus === 'idle'">
            Draw an area on the map using rectangle/polygon buttons to generate area statistics.
      </span>
      <v-col
        class="py-3 mx-2 mt-1 px-10 rounded text-center"
        style="background: #00417033"
        justify="center"
        v-if="contentStatus !== 'idle'"
      >
        <v-row class="charts">
          <canvas id="PopulationBarChart" />
        </v-row>
        <v-row class="charts">
          <canvas id="UrbanBarChart" />
        </v-row>
        <v-row class="charts">
          <canvas id="AgricultureBarChart" />
        </v-row>
      </v-col>
    </div>
  </v-col>
</v-card>
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
            plugins: {
              datalabels: {
                display: false,
              },
            },
            legend: {
              labels: {
                // Disable colored boxes in legend
                boxWidth: 0,
              },
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'number of people',
                },
              }],
            },
          },
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Population affected',
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
            plugins: {
              datalabels: {
                display: false,
              },
            },
            legend: {
              labels: {
                // Disable colored boxes in legend
                boxWidth: 0,
              },
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'm²',
                },
              }],
            },
          },
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Urban area affected',
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
            plugins: {
              datalabels: {
                display: false,
              },
            },
            legend: {
              labels: {
                // Disable colored boxes in legend
                boxWidth: 0,
              },
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'ha',
                },
              }],
            },
          },
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Agricultural area affected',
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
      this.aggregatedData.population = [];
      this.aggregatedData.urban = [];
      this.aggregatedData.agriculture = [];
      if (this.chartInstances.population) {
        this.chartInstances.population.destroy();
      }
      if (this.chartInstances.urban) {
        this.chartInstances.urban.destroy();
      }
      if (this.chartInstances.agriculture) {
        this.chartInstances.agriculture.destroy();
      }
      this.contentStatus = 'loading';

      const fetchPromises = this.labels.map((label) => {
        const vars = this.selectedIndicator.display.wmsVariables.variables;

        let ssp = vars.ssp.selected;
        let height = vars.stormSurge.selected;
        let time = vars.time.selected;
        let confidence = 'medium';

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
              // NOTE: Sistema's API has problems with low confidence,
              // so this is is hardcoded for now.
              confidence,
              storm_surge: height,
              year: time,
            }),
          }),
        };
      });

      this.data = {};
      const promiseCollection = await Promise.allSettled(fetchPromises);

      // Wait for all child promises to resolve
      for (const item of promiseCollection) {  // eslint-disable-line
        await item.value.promise;  // eslint-disable-line
      }

      for (const entry of promiseCollection) {  // eslint-disable-line
        const response = await entry.value.promise;  // eslint-disable-line
        let sanitizedKey = entry.value.label;
        if (this.selectedIndex === 'height') {
          // special mapping for storm_surge labels, replacing '_' with ''
          sanitizedKey = (parseInt(sanitizedKey.replace('_', '').replace('00', '0').replace('05', '5'), 10) / 10).toFixed(1);
        }
        // We take here only fulfilled datasets
        if (response.status === 200) {
          this.data[sanitizedKey] = await response.json();  // eslint-disable-line
        }
      }

      this.contentStatus = getContentStatus(promiseCollection);

      // Check to see if there were rejected requests due to timeout
      const timeoutDetected = promiseCollection.find((entry) => entry.status === 'rejected' || entry.value.status >= 400);
      if (timeoutDetected) {
        this.$store.commit('sendAlert', {
          message: 'There were some issues retrieving the data, possibly only partial results are shown. Please try the request again.',
          type: 'warning',
        });
      }

      for (const [_, values] of Object.entries(this.data)) {  // eslint-disable-line
        this.aggregatedData.population.push(values.GHS_POP_E2020_GLOBE);
        this.aggregatedData.urban.push(values.GHS_BUILT_S_E2020_GLOBE);
        this.aggregatedData.agriculture.push(Math.round(values.cereals * 100) / 100);
      }

      this.updateCharts();

      return fetchPromises;
    },

    updateCharts() {
      this.contentStatus = 'success';

      this.charts.population.data.datasets[0].data = this.aggregatedData.population;
      this.charts.urban.data.datasets[0].data = this.aggregatedData.urban;
      this.charts.agriculture.data.datasets[0].data = this.aggregatedData.agriculture;

      this.charts.population.data.labels = Object.keys(this.data);
      this.charts.urban.data.labels = Object.keys(this.data);
      this.charts.agriculture.data.labels = Object.keys(this.data);

      this.chartInstances.population = new Chart(document.getElementById('PopulationBarChart'), this.charts.population);
      this.chartInstances.urban = new Chart(document.getElementById('UrbanBarChart'), this.charts.urban);
      this.chartInstances.agriculture = new Chart(document.getElementById('AgricultureBarChart'), this.charts.agriculture);
    },
  },
};
</script>

<style>
.charts canvas {
  max-width: 100%;
}
</style>
