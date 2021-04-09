<template>
  <v-dialog
    v-model="dialog"
    width="500"
    v-if="!alreadyAdded"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        text
        small
        v-on="on"
      >
        <v-icon left>mdi-view-dashboard</v-icon>
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
          >
            add
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <v-btn
    color="primary"
    text
    small
    v-else
    @click="toggle"
  >
    <v-icon left>mdi-check-bold</v-icon>
    added to custom dashboard
  </v-btn>
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
  },
  data: () => ({
    alreadyAdded: false,
    dialog: false,
    title: '',
  }),
  computed: {
    ...mapState('dashboard', ['dashboardConfig']),
  },
  watch: {
    dashboardConfig: {
      deep: true,
      immediate: true,
      async handler() {
        this.alreadyAdded = await this.exists({ poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject) });
      },
    },
    indicatorObject: {
      deep: true,
      async handler() {
        if (this.indicatorObject) this.alreadyAdded = await this.exists({ poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject) });
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
      if (!this.alreadyAdded) {
        this.addFeature(
          {
            poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject),
            width: 4,
            includesIndicator: this.indicatorObject.includesIndicator,
            ...(this.indicatorObject.includesIndicator && { indicatorObject: this.indicatorObject }),
            title: this.title,
            ...(this.zoom && this.center && {
              mapInfo: {
                zoom: this.zoom,
                center: this.center,
              },
            }),
          },
        );
      } else {
        this.removeFeature(
          {
            poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject),
          },
        );
      }
      this.dialog = false;
    },
  },
};
</script>
