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
      <v-card-title class="headline grey lighten-2">
        Choose title for custom indicator
      </v-card-title>

      <v-card-text>
        <v-text-field
          placeholder="Title"
          filled
          dense
          v-model="title"
          class="mt-10"
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
          color="success"
          @click="toggle"
          :disabled="!title.length"
        >
          add
        </v-btn>
      </v-card-actions>
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
  mapState
} from 'vuex';

export default {
  props: {
    indicatorObject: Object,
  },
  data: () => ({
    alreadyAdded: false,
    dialog: false,
    title: '',
  }),
  computed: {
    ...mapState('dashboard', ['dashboardConfig'])
  },
  watch: {
    dashboardConfig: {
      deep: true,
      immediate: true,
      async handler() {
        this.alreadyAdded = await this.exists({poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject) });
      }
    },
    indicatorObject: {
      deep: true,
      async handler() {
        if(this.indicatorObject)
        this.alreadyAdded = await this.exists({poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject) });
      }
    }
  },
  created() {
    if(this.indicatorObject) 
      this.title = this.indicatorObject.city.trim() + ', ' +this.indicatorObject.description.trim()
  },
  methods: {
    ...mapActions('dashboard', [
      'exists',
      'addFeature',
      'removeFeature'
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
          },
        );
      } else {
        this.removeFeature(
          {
            poi: this.indicatorObject.poi || this.getLocationCode(this.indicatorObject),
            width: 4,
            includesIndicator: this.indicatorObject.includesIndicator,
            ...(this.indicatorObject.includesIndicator && { indicatorObject: this.indicatorObject }),
            title: this.title,
          },
        );
      }
      this.dialog = false;
    },
  },
};
</script>
