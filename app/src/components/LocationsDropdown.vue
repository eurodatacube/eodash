<template>
  <v-card>
    <v-card-text>
      <v-select
        v-model="selectedItem"
        :items="options.locations"
        item-text="name"
        item-value="name"
        label="Select a Minesweep Location"
        return-object
        single-line
      ></v-select>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  props: {
    options: Object,
  },
  data() {
    return {
      selectedItem: null,
    };
  },
  computed: {
    selectedLocationIndex() {
      return this.options.selectedLocationIndex;
    },
  },
  watch: {
    selectedItem() {
      // has a side effect of changing index in original config object - that is as expected
      this.options.selectedLocationIndex = this.options.locations.findIndex(
        (item) => item.name === this.selectedItem.name,
      );
    },
  },
};
</script>
