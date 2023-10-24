<template>
  <div class="datePickerControls">
    <v-tooltip v-if="!show" left>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.currentTheme.background"
          class="pa-0 elevation-2 round datePickerBtn"
          style="min-width: 0"
          v-on="on"
          @click="show = true"
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <span>Choose date</span>
    </v-tooltip>
    <v-date-picker v-else elevation="2" v-model="selectedDate" />
  </div>
</template>

<script>
import { VDatePicker } from 'vuetify/lib';
import { getMapInstance } from '@/components/map/map';

export default {
  props: {
    mapId: String,
  },
  components: {
    VDatePicker,
  },
  data() {
    return {
      show: false,
      selectedDate: null,
    };
  },
  watch: {
    show(value) {
      if (value) {
        getMapInstance(this.mapId).map.once('click', () => {
          this.show = false;
        });
      }
    },
    selectedDate(date) {
      this.$store.commit('features/SET_SELECTED_DATE', date);
    },
  },
};
</script>

<style lang="scss" scoped>
.datePickerControls {
  .datePickerBtn {
    width: 36px;
    height: 36px !important;
    pointer-events: initial;
  }
}
</style>
