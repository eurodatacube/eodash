<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
      >
        <v-data-table
          :headers="headers"
          :items="allFeatures"
          :items-per-page="10"
          class="featureTable elevation-1"
          @click:row="openFeature"
        >
          <template v-slot:item.type="{ item }">
            <span class="text-capitalize">
              {{ baseConfig.indicatorsDefinition[item.properties
                .indicatorObject['Indicator code']].class }}
            </span>
          </template>
          <template v-slot:item.indicator="{ item }">
            {{ indicator(flatten(item.properties.indicatorObject['Indicator code'])
              .join(', ')).indicator }}
          </template>
          <template v-slot:item.indicatorValue="{ item }">
            <v-chip
              :color="getLastValue(item.properties.indicatorObject).color" dark
            >
              {{ getLastValue(item.properties.indicatorObject).text }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Utilities
import {
  mapGetters,
  mapState,
} from 'vuex';

export default {
  computed: {
    ...mapGetters('features', ['getFeatures']),
    ...mapState('config', ['baseConfig']),
    headers() {
      const indicatorObject = 'properties.indicatorObject';
      return [
        {
          text: 'Country',
          align: 'start',
          sortable: true,
          value: `${indicatorObject}.Country`,
        },
        { text: 'Location', value: `${indicatorObject}.City` },
        { text: 'Type', value: 'type' },
        { text: 'Indicator', value: `${indicatorObject}.Description` },
        {
          text: 'Latest Value',
          align: 'end',
          value: 'indicatorValue',
        },
      ];
    },
    allFeatures() {
      return this.getFeatures;
    },
  },
  methods: {
    flatten(array) {
      return [...new Set([array].flat(1))];
    },
    getLastValue(values) {
      const vLen = values['Indicator Value'].length;
      const lastValue = values['Indicator Value'][vLen - 1];
      let lastColorCode = '';
      if (Object.prototype.hasOwnProperty.call(values, 'Color code')) {
        lastColorCode = values['Color code'][vLen - 1];
      }
      return {
        color: this.getIndicatorColor(lastColorCode),
        text: lastValue ? lastValue.toLowerCase() : 'coming soon',
      };
    },
    indicator(code) {
      return this.baseConfig.indicatorsDefinition[code];
    },
    openFeature(feature) {
      if (feature.properties.indicatorObject['Indicator code'] !== 'd') {
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          feature.properties.indicatorObject,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.featureTable {
  ::v-deep tr {
    cursor: pointer;
  }
}
</style>
