<template>
  <v-col>
    <v-row class="justify-space-between align-center mx-2">
      <h2>Area Statistics</h2>

      <v-btn
        @click="fetchData"
        color="primary"
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
  </v-col>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  name: 'AreaStatistics',
  data () {
    return {
      selectedIndex: 'scenarios',
    }
  },
  computed: {
    ...mapState('features', [
      'selectedArea',
    ]),
    ...mapState('indicators', [
      'selectedIndicator',
    ]),
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
      const url = 'https://api.ideas.adamplatform.eu/areas';

      console.log(this.selectedIndicator.display.wmsVariables);

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            geometry: [[[-79.6884731,0.9742484],[-79.6887841,0.9132887],[-79.5805495,0.9139107],[-79.5836597,0.9739374],[-79.6884731,0.9742484]]],
            ssp: 'ssp119',
            confidence: 'medium',
            storm_surge: '1_0',
            year: 2040
          }),
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.error(error.message);
      }
    },
  },
};
</script>

<style>

</style>
