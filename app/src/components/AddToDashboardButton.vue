<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on: dialog }">
      <template v-if="mapControl">
        <v-tooltip left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :color="$vuetify.theme.currentTheme.background"
              small
              class="dashboard-button"
              style="min-width: 0;"
              v-on="{ ...tooltip, ...dialog }"
              @click="show = true"
            >
              <v-icon>
                mdi-view-dashboard
              </v-icon>
            </v-btn>
          </template>
          <span>Add map to custom dashboard</span>
        </v-tooltip>
      </template>
      <v-btn
        v-else
        color="primary"
        text
        small
        v-on="{ ...dialog }"
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
    featureObject: Object,
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
      async handler() {
        this.title = this.getItemTitle();
      },
    },
    featureObject: {
      async handler() {
        this.title = this.getItemTitle();
      },
    },
  },
  created() {
    this.title = this.getItemTitle();
  },
  methods: {
    ...mapActions('dashboard', [
      'exists',
      'addFeature',
      'removeFeature',
    ]),
    getItemTitle() {
      let title = '';
      if (this.indicatorObject) {
        let indObj = this.indicatorObject;
        if (this.featureObject) {
          // Merge with parent indicator object to have all necessary information
          indObj = { ...indObj, ...this.featureObject };
        }
        // features
        if (indObj?.city) {
          title = `${indObj?.city?.trim()}: `;
        } else if (indObj?.country) {
          title = `${indObj?.country?.trim()}: `;
        }
        // global indicator has neither city nor country
        title += `${indObj?.description?.trim()}`;
      }
      return title;
    },
    async toggle() {
      let indObj = this.indicatorObject;
      if (this.featureObject) {
        // Merge with parent indicator object to have all necessary information
        indObj = { ...indObj, ...this.featureObject };
      }
      const poiValue = `${this.getLocationCode(indObj)}@${Date.now()}`;
      const feature = {
        poi: this.indicatorObject.poi
          // Encode location code and current datetime object to create unique
          // dashboard entries
          || poiValue,
        width: 4,
        ...{ indicatorObject: this.indicatorObject },
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
      };
      this.addFeature(feature);
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
