<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <v-tooltip v-if="mapControl" left>
        <template v-slot:activator="{ on }">
          <v-btn
            :color="$vuetify.theme.currentTheme.background"
            small
            class="dashboard-button"
            style="min-width: 0;"
            v-on="on"
            @click="show = true"
          >
            <v-icon>
              mdi-view-dashboard
            </v-icon>
          </v-btn>
        </template>
        <span>Add map to custom dashboard</span>
      </v-tooltip>
      <v-btn
        v-else
        color="primary"
        text
        small
        v-on="on"
      >
        <v-icon
          left
          small
        >mdi-view-dashboard</v-icon>
        add to custom dashboard
      </v-btn>
    </template>

    <v-card>
      <v-form @submit.prevent="toggle">
        <v-card-title class="headline mb-5">
          Title for custom dashboard element
        </v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="Title"
            outlined
            v-model="title"
            autofocus
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!title.length"
            type="submit"
          >
            add
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex';

export default {
  props: {
    indicatorObject: Object,
    zoom: Number,
    center: Object,
    direction: Array,
    position: Array,
    right: Array,
    up: Array,
    datalayertime: String,
    comparelayertime: String,
    mapControl: Boolean,
  },
  data: () => ({
    dialog: false,
    title: '',
  }),
  computed: {
    ...mapState('dashboard', ['dashboardConfig']),
  },
  watch: {
    indicatorObject: {
      deep: true,
      async handler() {
        if (this.indicatorObject) {
          // Re-setting title to make sure latest selected indicator is shown
          this.title = `${this.indicatorObject.city.trim()}, ${this.indicatorObject.description.trim()}`;
        }
      },
    },
  },
  created() {
    if (this.indicatorObject) { this.title = `${this.indicatorObject.city.trim()}, ${this.indicatorObject.description.trim()}`; }
  },
  methods: {
    ...mapActions('dashboard', [
      'exists',
      'addFeature',
      'removeFeature',
    ]),
    async toggle() {
      const poiValue = `${this.getLocationCode(this.indicatorObject)}@${Date.now()}`;
      this.addFeature(
        {
          poi: this.indicatorObject.poi
            // Encode location code and current datetime object to create unique
            // dashboard entries
            || poiValue,
          width: 4,
          includesIndicator: this.indicatorObject.includesIndicator,
          ...(this.indicatorObject.includesIndicator
            && { indicatorObject: this.indicatorObject }),
          title: this.title,
          ...(this.indicatorObject.showGlobe && {
            mapInfo: {
              direction: this.direction,
              position: this.position,
              right: this.right,
              up: this.up,
              dataLayerTime: this.datalayertime,
              compareLayerTime: this.comparelayertime,
            },
          }),
          ...(this.zoom && this.center && {
            mapInfo: {
              zoom: this.zoom,
              center: this.center,
              dataLayerTime: this.datalayertime,
              compareLayerTime: this.comparelayertime,
            },
          }),
        },
      );
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
  .dashboard-button {
    width: 36px;
    height: 36px !important;
    z-index: 2;
    pointer-events: initial;
  }
</style>
