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
          :item-class="f => f.indicatorObject.updateFrequency
            && f.indicatorObject.updateFrequency.toLowerCase() === 'archived' ? 'archived-row' : ''"
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
              v-if="item.indicatorValue"
              :color="item.indicatorColor" dark
              class="text-capitalize"
            >
              {{ item.indicatorValue.toLowerCase() }}
            </v-chip>
          </template>
          <template v-slot:item.country="{ item }">
            <div v-if="Array.isArray(item.country)" class="table-flag d-flex justify-center" >
              <span v-for="(country, i) in item.country" :key="i" class="table-flag">
                <v-icon v-if="country === 'all'" class="ml-1">mdi-earth</v-icon>
                <country-flag v-else :country="country" size="normal"></country-flag>
              </span>
            </div>
            <div v-else class="d-flex justify-center">
              <v-icon v-if="item.country === 'all'" class="ml-1">mdi-earth</v-icon>
              <country-flag v-else :country="item.country" size="normal"></country-flag>
            </div>
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

import CountryFlag from 'vue-country-flag';


export default {
  components: {
    CountryFlag,
  },
  computed: {
    ...mapGetters('features', ['getGroupedFeatures']),
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
          text: 'Value',
          align: 'end',
          value: 'indicatorValue',
        },
      ];
    },
    allFeatures() {
      return this.getGroupedFeatures.map((f) => ({
        country: f.properties.indicatorObject.country,
        location: f.properties.indicatorObject.city,
        type: this.getClass(f),
        indicator: this.getIndicator(f.properties.indicatorObject),
        indicatorValue: this.getIndicatorLabel(f.properties.indicatorObject),
        indicatorColor: this.getColor(f.properties.indicatorObject),
        indicatorObject: f.properties.indicatorObject,
      }));
    },
  },
  methods: {
    flatten(array) {
      return [...new Set([array].flat(1))];
    },
    getClass(item) {
      const code = item.properties.indicatorObject.indicator;
      const validClass = typeof this.baseConfig.indicatorsDefinition[code] !== 'undefined' ? this.baseConfig.indicatorsDefinition[code].class : this.baseConfig.indicatorsDefinition.d.class;
      return validClass;
    },
    getIndicator(indObj) {
      let ind = indObj.description;
      if (this.baseConfig.indicatorsDefinition[indObj.indicator]
        && this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite) {
        ind = this.baseConfig.indicatorsDefinition[indObj.indicator].indicatorOverwrite;
      }
      return ind;
    },
    getColor(indObj) {
      let color;
      if (indObj) {
        if (Object.prototype.hasOwnProperty.call(indObj, 'lastColorCode')
          && !['', '/'].includes(indObj.lastColorCode)) {
          color = this.getIndicatorColor(indObj.lastColorCode);
        }
        if (Object.prototype.hasOwnProperty.call(indObj, 'indicator')
          && ['N1', 'N1a', 'N1b', 'N3b', 'E12b', 'C1', 'C2', 'C3'].includes(indObj.indicator)) {
          color = this.getIndicatorColor('BLUE');
          if (indObj.aoi === null) {
            color = 'black';
          }
        }
      }
      return color;
    },
    getIndicatorLabel(poi) {
      let text = 'coming soon';
      if (poi) {
        if (Object.prototype.hasOwnProperty.call(poi, 'lastIndicatorValue')
          && poi.lastIndicatorValue !== '') {
          const lastValue = poi.lastIndicatorValue;
          if (['E10a1', 'E10a5', 'E10a8'].includes(poi.indicator)) {
            if (lastValue !== '') {
              const percVal = Number((lastValue * 100).toPrecision(4));
              if (percVal > 0) {
                text = `+${percVal}%`;
              } else {
                text = `${percVal}%`;
              }
            } else if (['E10a3', 'E10a8'].includes(poi.indicator)) {
              text = 'multiple';
            } else {
              text = lastValue;
            }
          } else if (['E10a3', 'E10a8', 'N4c', 'C1', 'C2', 'C3'].includes(poi.indicator)) {
            text = 'multiple';
          } else {
            text = lastValue;
          }
        } else if (Object.prototype.hasOwnProperty.call(poi, 'lastMeasurement')
          && poi.lastMeasurement !== '') {
          text = poi.lastMeasurement.toPrecision(4);
        }
      }
      return text;
    },
    indicator(code) {
      return this.baseConfig.indicatorsDefinition[code];
    },
    openFeature(feature) {
      if (!feature.indicatorObject.dummyFeature) {
        this.$store.commit(
          'indicators/SET_SELECTED_INDICATOR',
          feature.indicatorObject,
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

  ::v-deep .archived-row td {
    opacity: 0.65;
  }
}

.table-flag-list {
  .table-flag:not(:last-child) {
    margin-right: .3rem;
  }
}
</style>
