<template>
  <v-col>
    <v-row class="justify-space-between align-center mx-2">
      <h2>Area Statistics</h2>

      <v-btn
        @click="fetchData"
        color="primary"
        :disabled="!selectedArea || !selectedIndicator"
        small
      >Generate</v-btn>
    </v-row>
    
    <v-radio-group v-model="selectedIndex">
      <v-row>
        <v-col>
          <v-radio
            label="Scenarios"
            value="scenarios"
          />
        </v-col>

        <v-col>
          <v-radio
            label="Storm surge"
            value="storm-surge"
          />
        </v-col>

        <v-col>
          <v-radio
            label="Years"
            value="years"
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
      selectedIndex: 'scenarios',
      scenarioLabels: ['ssp119', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
      chartKeys: {
        population: 'GHS_POP_E2020_GLOBE',
        urban: 'GHS_BUILT_S_E2020_GLOBE',
        agriculture: [
          'ESA_WORLD_CEREAL_SECOND_MAIZE_CLASSIFICATION',
          'ESA_WORLD_CEREAL_SPRINGCEREALS',
          'ESA_WORLD_CEREAL_WINTERCEREALS',
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  computed: {
    ...mapState('features', [
      'selectedArea',
    ]),
    ...mapState('indicators', [
      'selectedIndicator',
    ]),

    charts() {
      return [
        {
          type: 'bar',
          //id: 'population',
          data: {
            labels: this.scenarioLabels,
            datasets: [{
              label: 'Population',
              data: this.aggregatedData.population,
              borderWidth: 1,
            }]
          },
        },

        {
          type: 'bar',
          //id: 'urban',
          data: {
            labels: this.scenarioLabels,
            datasets: [{
              label: 'Urban',
              data: this.aggregatedData.urban,
              borderWidth: 1,
            }]
          },
        },

        {
          type: 'bar',
          //id: 'agriculture',
          data: {
            labels: this.scenarioLabels,
            datasets: [{
              label: 'Agriculture',
              data: this.aggregatedData.agriculture,
              borderWidth: 1,
            }]
          },
        },
      ];
    },
  },
  watch: {
    selectedIndex: function (val) {
      console.log(`new selected index: ${val}`);
    },
  },
  methods: {
    generateStatistics() {
      console.log('Generating statistics...');
    },

    async fetchData() {
      //const url = 'https://api.ideas.adamplatform.eu/areas';
      //const url = 'https%3A%2F%2Fapi.ideas.adamplatform.eu%2Fareas';

      console.log(this.selectedIndicator.display.wmsVariables);

      const response = await fetch('https://api.ideas.adamplatform.eu/areas', {
        //mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          geometry: this.selectedArea,
          ssp: 'ssp119',
          confidence: 'medium',
          storm_surge: '1_0',
          year: 2040
        }),
      });

      console.log(response.json);

      const fetchPromises = this.scenarioLabels.map(async (label) => {
        const response = await fetch(`./TEMP/${label}.json`);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        this.data[label] = await response.json();
      });

      // Wait for all fetch requests to complete
      await Promise.all(fetchPromises);

      const scenarios = Object.keys(this.data);

      const aggregatedData = scenarios.reduce((acc, scenario) => {
        const scenarioData = this.data[scenario];

        acc.population.push(scenarioData.GHS_POP_E2020_GLOBE);
        acc.urban.push(scenarioData.GHS_BUILT_S_E2020_GLOBE);
        acc.agriculture.push(
          ['ESA_WORLD_CEREAL_SECOND_MAIZE_CLASSIFICATION', 'ESA_WORLD_CEREAL_SPRINGCEREALS', 'ESA_WORLD_CEREAL_WINTERCEREALS']
            .map(key => scenarioData[key])
            .reduce((sum, value) => sum + value, 0)
        );

        return acc;
      }, { population: [], urban: [], agriculture: [] });

      this.aggregatedData = aggregatedData;
      console.log(this.aggregatedData);

      console.log(this.charts);

      console.log(document.getElementById('PopulationBarChart'));
      console.log(document.getElementById('UrbanBarChart'));
      console.log(document.getElementById('AgricultureBarChart'));

      if (this.charts.length !== 0) {
        new Chart(document.getElementById('PopulationBarChart'), this.charts[0]);
        new Chart(document.getElementById('UrbanBarChart'), this.charts[1]);
        new Chart(document.getElementById('AgricultureBarChart'), this.charts[2]);
      }
    },
  },
};
</script>

<style>
.charts canvas {
  max-width: 33%;
}
</style>
