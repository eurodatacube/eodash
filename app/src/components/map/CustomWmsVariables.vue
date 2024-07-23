<template>
  <v-container>
    <v-row align="center">
      <v-col cols="12" class="pa-0">
        <v-subheader v-if="wmsVariables.title" class="pa-0">
          <b>{{ compareEnabledDisplay ? 'Right side' : '' }} {{ wmsVariables.title }}</b>
        </v-subheader>
      </v-col>
      <v-row class="ma-0" cols="6" v-for="key in Object.keys(wmsVariables.variables)" :key="key">
        <v-col class="pa-0">
          <v-subheader class="pa-0">
            {{ wmsVariables.variables[key].description }}
            <info-dialog
              v-if="wmsVariables.variables[key].dataInfo"
              :infoSource="wmsVariables.variables[key].dataInfo"
            />
          </v-subheader>
        </v-col>
        <v-col class="pa-0">
          <v-select
            v-model="select[key]"
            :items="wmsVariables.variables[key].items"
            item-text="description"
            item-value="id"
            persistent-hint
            return-object
            @change="updateMapLayer"
          ></v-select>
        </v-col>
      </v-row>
    </v-row>
    <p
      class="compareEnable my-4"
      @click="toggleCompare"
    >
      <v-icon color="black">mdi-compare</v-icon>
      {{ compareEnabledDisplay ? 'Stop': 'Start' }} model comparison
    </p>
    <v-row align="center" v-if="compareEnabledDisplay">
      <v-col cols="12" class="pa-0">
        <v-subheader v-if="wmsVariables.title" class="pa-0">
          <b>Left side {{ wmsVariables.title }}</b>
        </v-subheader>
      </v-col>
      <v-row class="ma-0" cols="6"
      v-for="key in Object.keys(wmsVariablesCompare.variables)"
      :key="key">
        <v-col class="pa-0">
          <v-subheader class="pa-0">
            {{ wmsVariablesCompare.variables[key].description }}
          </v-subheader>
        </v-col>
        <v-col class="pa-0">
          <v-select
            v-model="selectCompare[key]"
            :items="wmsVariablesCompare.variables[key].items"
            item-text="description"
            item-value="id"
            label="Select"
            persistent-hint
            return-object
            single-line
            @change="updateMapLayerCompare"
          ></v-select>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>

import { getMapInstance } from '@/components/map/map';
import InfoDialog from '@/components/InfoDialog.vue';

export default {
  name: 'CustomWMSVariables',
  components: {
    InfoDialog,
  },
  props: {
    wmsVariables: Object,
    mergedConfigsData: Object,
  },
  data: () => ({
    select: {},
    selectCompare: {},
    enableCompare: false,
    wmsVariablesCompare: null,
  }),
  created() {
    this.wmsVariablesCompare = JSON.parse(JSON.stringify(this.wmsVariables));
    Object.keys(this.wmsVariables.variables).forEach((key) => {
      const value = this.wmsVariables.variables[key].items.find(
        (item) => item.id === this.wmsVariables.variables[key].selected,
      );
      // initialize both the compare and the initial the same
      this.select[key] = value;
      this.selectCompare[key] = value;
    });
    if (this.indicatorObject) {
      this.indicatorObject.display.wmsVariablesCompare = this.indicatorObject.display.wmsVariables;
    }
  },
  computed: {
    indicatorObject() {
      return this.$store.state.indicators.selectedIndicator;
    },
    compareEnabledDisplay() {
      return this.enableCompare && this.mergedConfigsData.disableTimeSelection;
    },
  },
  methods: {
    updateMapLayer(c) {
      const compare = c === true;
      const selectVar = compare ? this.selectCompare : this.select;
      const variablesConfigVar = compare
        ? this.indicatorObject.display.wmsVariablesCompare
        : this.indicatorObject.display.wmsVariables;
      const variablesLocalVar = compare ? this.wmsVariablesCompare : this.wmsVariables;
      const layerName = compare ? `${this.wmsVariables.sourceLayer}_compare` : this.wmsVariables.sourceLayer;
      // Update selected values
      Object.keys(selectVar).forEach((key) => {
        if (this.indicatorObject) {
          variablesConfigVar.variables[key].selected = selectVar[key].id;
        }
        variablesLocalVar.variables[key].selected = selectVar[key].id;
      });
      if (compare) {
        this.indicatorObject.display.wmsVariablesCompare = JSON.parse(
          JSON.stringify(variablesLocalVar),
        );
      } else {
        this.indicatorObject.display.wmsVariables = JSON.parse(JSON.stringify(variablesLocalVar));
      }
      const { map } = getMapInstance('centerMap');
      const wmsLayer = map.getAllLayers().find((l) => l.get('name') === layerName);
      if (compare) {
        window.postMessage({
          command: 'map:refreshCompareLayer',
        });
      }
      wmsLayer.changed();
    },
    updateMapLayerCompare() {
      this.updateMapLayer(true);
    },
    toggleCompare() {
      this.enableCompare = !this.enableCompare;
      window.postMessage({
        command: 'map:setCompare', compare: this.enableCompare,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.compareEnable {
  text-align: center;
}
.compareEnable:hover {
  cursor: pointer;
}
</style>
