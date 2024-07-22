<template>
  <v-col>
    <v-row class="area-statistics justify-space-between align-center mx-2">
      <h2>Area Statistics</h2>

      <v-btn
        @click="fetchData"
        color="primary"
        :disabled="!selectedArea || !selectedIndicator"
        :loading="isLoading"
        small
      >Generate</v-btn>
    </v-row>
    
    <v-radio-group v-model="selectedIndex">
      <v-row>
        <v-col>
          <v-radio
            label="Scenarios"
            value="scenario"
          />
        </v-col>

        <v-col>
          <v-radio
            label="Storm surge"
            value="height"
          />
        </v-col>

        <v-col>
          <v-radio
            label="Years"
            value="time"
          />
        </v-col>

        <v-col>
          <v-radio
            label="Confidence"
            value="confidence"
          />
        </v-col>


      </v-row>
    </v-radio-group>
    <v-row class="charts">
      <canvas id="PopulationBarChart" />
      <canvas id="UrbanBarChart" />
      <canvas id="AgricultureBarChart" />
    </v-row>
  </v-col>
</template>

<script>
import {
  mapState,
} from 'vuex';

import Chart from 'chart.js';

export default {
  name: 'AreaStatistics',
  data () {
    return {
      ctx: {},
      data: {},
      aggregatedData: {},
      selectedIndex: 'scenario',
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      isLoading: false,
    }
  },
  computed: {
    ...mapState('features', [
      'selectedArea',
    ]),
    ...mapState('indicators', [
      'selectedIndicator',
    ]),

    labels() {
      let vars = this.selectedIndicator.display.wmsVariables.variables;

      switch (this.selectedIndex) {
        case 'scenario':
          return vars.scenario.items.map(item => `ssp${item.id}`);
        case 'height':
          return vars.height.items.map(item => `${item.id[0]}_${item.id[1]}`);
        case 'time':
          return vars.time.items.map(item => item.id);
        case 'confidence':
          return ['medium', 'high'];
        default:
          return [];
      };
    },

    selectedLabel() {
      let vars = this.selectedIndicator.display.wmsVariables.variables;

      switch (this.selectedIndex) {
        case 'scenario':
          return `ssp${vars.scenario.selected}`;
        case 'height':
          return `${vars.height.selected[0]}_${vars.height.selected[1]}`
        case 'time':
          return vars.time.selected;
        // TODO: Should there be a dropdown for confidence?
        case 'confidence':
          return 'high';
        default:
          return [];
      };
    },

    charts() {
      return [
        {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Population',
              data: this.aggregatedData.population,
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }]
          },
        },

        {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Urban',
              data: this.aggregatedData.urban,
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }]
          },
        },

        {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Agriculture',
              data: this.aggregatedData.agriculture,
              borderWidth: 0,
              borderColor: '#FFF0',
              backgroundColor: '#004170',
            }]
          },
        },
      ];
    },
  },
  methods: {
    async doRequests(labels) {
      const fetchPromises = labels.map(label => {
        let scenario = '119', confidence = 'low', height = '1', time = '2020'; // default values

        switch (this.selectedIndex) {
          case 'scenario':
            scenario = label.replace('ssp', '');
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
        }

        this.isLoading = true;

        return fetch('https://api.ideas.adamplatform.eu/', {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            geometry: this.selectedArea,
            ssp: `ssp${scenario}`,
            confidence,
            storm_surge: height,
            year: time,
          }),
        }).then(response => {
          this.isLoading = false;
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
          return response.json().then(data => ({ label, data }));
        });
      });

      return Promise.all(fetchPromises);
    },

    async fetchData() {
      try {
        const results = await this.doRequests(this.labels);
        results.forEach(result => {
          this.data[result.label] = result.data;
        });

        this.aggregatedData = labels.reduce((acc, label) => {
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
          new Chart(element, this.charts[index]);
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
