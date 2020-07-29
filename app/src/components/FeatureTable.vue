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
              class="text-capitalize"
            >
              {{ item.indicatorValue.toLowerCase() }}
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
          text: 'Value',
          align: 'end',
          value: 'indicatorValue',
        },
      ];
    },
    allFeatures() {
      return this.getFeatures.map((f) => ({
        country: f.properties.indicatorObject.country,
        location: f.properties.indicatorObject.city,
        type: this.getClass(f),
        indicator: f.properties.indicatorObject.description,
        indicatorValue: this.getIndicatorLabel(f.properties.indicatorObject),
        indicatorColor: this.getIndicatorColor(f.properties.indicatorObject.lastColorCode),
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
            } else if (poi.indicator === 'E10a3') {
              text = 'multiple';
            } else {
              text = lastValue;
            }
          } else if (poi.indicator === 'E10a3') {
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
      if (!feature.indicatorObject.dummy) {
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
}
</style>
