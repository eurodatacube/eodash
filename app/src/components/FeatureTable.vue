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
          multi-sort
        >
          <template v-slot:item.type="{ item }">
            <span class="text-capitalize">
              {{ item.type }}
            </span>
          </template>
          <template v-slot:item.indicatorValue="{ item }">
            <v-chip
              :color="item.indicatorColor" dark
            >
              {{ item.indicatorValue }}
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
      return [
        {
          text: 'Country',
          align: 'start',
          sortable: true,
          value: 'country',
        },
        { text: 'Location', value: 'location' },
        { text: 'Type', value: 'type' },
        { text: 'Indicator', value: 'indicator' },
        {
          text: 'Latest Value',
          align: 'end',
          value: 'indicatorValue',
        },
      ];
    },
    allFeatures() {
      return this.getFeatures.map((f) => ({
        country: f.properties.indicatorObject.Country,
        location: f.properties.indicatorObject.City,
        type: this.getClass(f),
        indicator: this.indicator(this.flatten(f.properties.indicatorObject['Indicator code'])
          .join(', ')).indicator,
        indicatorValue: this.getLastValue(f.properties.indicatorObject).text,
        indicatorColor: this.getLastValue(f.properties.indicatorObject).color,
      }));
    },
  },
  methods: {
    flatten(array) {
      return [...new Set([array].flat(1))];
    },
    getClass(item) {
      return this.baseConfig.indicatorsDefinition[item
        .properties.indicatorObject['Indicator code']].class;
    },
    getLastValue(values) {
      const vLen = values['Indicator Value'].length;
      const lastValue = values['Indicator Value'][vLen - 1];
      let text = 'coming soon';
      if (lastValue) {
        if (values['Indicator code'] === 'E10a1') {
          if (lastValue !== '') {
            const percVal = Number((lastValue * 100).toPrecision(4));
            if (percVal > 0) {
              text = `+${percVal}%`;
            } else {
              text = `${percVal}%`;
            }
          }
        } else {
          text = lastValue;
        }
      }
      let lastColorCode = '';
      if (Object.prototype.hasOwnProperty.call(values, 'Color code')) {
        lastColorCode = values['Color code'][vLen - 1];
      }
      return {
        color: this.getIndicatorColor(lastColorCode),
        text,
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
