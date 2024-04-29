<template>
  <div class="datePickerControls mb-2">
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
    <v-date-picker v-else class="mr-6" elevation="2" width="230" v-model="selectedDate" />
  </div>
</template>

<script>
import { VDatePicker } from 'vuetify/lib';
import { DateTime } from 'luxon';
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
      selectedDate: DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd'),
    };
  },
  mounted() {
    this.$emit('selectedDate', this.selectedDate);
    this.$store.commit('features/SET_SELECTED_DATE', this.selectedDate);
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
      this.$emit('selectedDate', date);
      this.$store.commit('features/SET_SELECTED_DATE', date);
    },
  },
};
</script>

<style lang="scss">
.datePickerControls {
  .datePickerBtn {
    width: 36px;
    height: 36px !important;
    pointer-events: initial;
  }
  .v-date-picker-title {
    flex-direction: row;

    .v-date-picker-title__date {
      font-size: 1rem;
    }
  }
}
</style>
