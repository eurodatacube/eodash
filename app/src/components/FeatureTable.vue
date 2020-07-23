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
        country: f.properties.indicatorObject.Country,
        location: f.properties.indicatorObject.City,
        type: this.getClass(f),
        indicator: f.properties.indicatorObject.Description,
        indicatorValue: this.getLastValue(f.properties.indicatorObject).text,
        indicatorColor: this.getLastValue(f.properties.indicatorObject).color,
        indicatorObject: f.properties.indicatorObject,
      }));
    },
  },
  methods: {
    flatten(array) {
      return [...new Set([array].flat(1))];
    },
    getClass(item) {
      const code = item.properties.indicatorObject['Indicator code'];
      const validClass = typeof this.baseConfig.indicatorsDefinition[code] !== 'undefined' ? this.baseConfig.indicatorsDefinition[code].class : this.baseConfig.indicatorsDefinition.d.class;
      return validClass;
    },

    getLastValue(values) {
      let text = 'coming soon';
      let color;
      if (values) {
        if (Object.prototype.hasOwnProperty.call(values, 'Indicator Value')
          && values['Indicator Value'] !== '') {
          let validValues = values['Indicator Value'].filter((item) => item !== '');
          if (validValues.length > 0) {
            const lastValue = validValues[validValues.length - 1];
            if (['E10a1', 'E10a5'].includes(values['Indicator code'])) {
              if (lastValue !== '') {
                const percVal = Number((lastValue * 100).toPrecision(4));
                if (percVal > 0) {
                  text = `+${percVal}%`;
                } else {
                  text = `${percVal}%`;
                }
              }
            } else if (['E10a3', 'E10a8'].includes(values['Indicator code'])) {
              text = 'multiple';
            } else {
              text = lastValue;
            }
          } else if (Object.prototype.hasOwnProperty.call(values, 'Measurement Value')
            && values['Measurement Value'] !== '') {
            validValues = values['Measurement Value'].filter((item) => (
              item !== '' && item !== Number.NaN && item !== null && !Number.isNaN(item)
            ));
            text = validValues[validValues.length - 1].toPrecision(4);
          }
        }
        if (values) {
          if (Object.prototype.hasOwnProperty.call(values, 'Color code')
            && values['Color code'] !== '') {
            const validValues = values['Color code'].filter((item) => item !== '');
            if (validValues.length > 0) {
              color = this.getIndicatorColor(validValues[validValues.length - 1]);
            }
          }
          if (Object.prototype.hasOwnProperty.call(values, 'Indicator code')
            && ['N1', 'N3b'].includes(values['Indicator code'])) {
            color = this.getIndicatorColor('BLUE');
            if (values.AOI === null) {
              color = 'black';
            }
          }
        }
      }
      // Check for coming soon values
      if (typeof color === 'undefined') {
        color = this.getIndicatorColor();
      }
      return { color, text };
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
