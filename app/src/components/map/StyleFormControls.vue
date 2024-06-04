<template>
  <v-container fluid>
    <eox-jsonform ref="jsonform"></eox-jsonform>
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';
import { replaceAll, flattenObject } from '../../utils';

export default {
  name: 'StyleFormControls',
  components: {},
  props: {
    flatStyle: Object,
  },
  data: () => ({
    select: null,
  }),
  mounted() {
    this.$refs.jsonform.schema = this.flatStyle.jsonform;
    this.$refs.jsonform.addEventListener('change', () => {
      if (this.$refs.jsonform.value) {
        // We assume unique keys for nested values
        const values = flattenObject(this.$refs.jsonform.value);
        this.flatStyle.variables = values;
        this.updateMap();
        // save to store to be reusable by other parts of the app
        this.$store.state.features.selectedJsonformParameters = this.$refs.jsonform.value;
      }
    });
  },
  methods: {
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    },
    replaceAll(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    },
    updateMap() {
      const { map } = getMapInstance('centerMap');
      const vLayer = map.getAllLayers().find((l) => l.get('id') === this.flatStyle.layerId);
      if (vLayer) {
        if ('variables' in this.flatStyle) {
          let rawStyle = JSON.stringify(this.flatStyle);
          const { variables } = this.flatStyle;
          Object.keys(variables).forEach((key) => {
            if (typeof variables[key] === 'number') {
              rawStyle = replaceAll(rawStyle, `["var","${key}"]`, variables[key]);
            } else {
              rawStyle = replaceAll(rawStyle, `["var","${key}"]`, `"${variables[key]}"`);
            }
          });
          vLayer.setStyle(JSON.parse(rawStyle));
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
