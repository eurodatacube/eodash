<template>
  <div class="scrollContainer">
    <v-container
      style="background: #fff">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <div class="dashboardTitle">
            <v-text-field
              v-if="dashboardEditingId"
              v-model="dashboardTitle"
              hint="Edit dashboard title"
              persistent-hint
              color="primary"
              class="display-2 font-weight-light primary--text mt-7 mb-5"
              :rules="[v => !!v || 'Title required']"
              @input="modified = true"
            ></v-text-field>
            <h1
              v-else
              class="display-2 font-weight-light primary--text mt-7 mb-5">
              {{ dashboardTitle }}</h1>
          </div>
          <div>
            <v-fade-transition mode="out-in">
              <v-btn
                v-if="modified"
                color="success"
                :loading="saveLoading"
                :disabled="saveLoading"
                @click="saveCurrentDashboardState"
              >
                <v-icon left>
                  {{ saveSuccess ? 'mdi-check' : 'mdi-content-save' }}
                </v-icon>
                {{ saveSuccess ? 'Saved!' : 'Save Changes' }}
              </v-btn>
            </v-fade-transition>
          </div>
        </v-col>
      </v-row>
      <custom-dashboard-grid
        v-if="dashboardFeatures"
        :dashboardFeatures="dashboardFeatures"
        :enableEditing="!!dashboardEditingId"
        @updateFeatures="updateFeatures"
      />
    </v-container>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';

import { loadIndicatorData } from '@/utils';
import axios from 'axios';

import CustomDashboardGrid from '@/components/CustomDashboardGrid.vue';

export default {
  components: {
    CustomDashboardGrid,
  },
  data: () => ({
    dashboardTitle: null,
    dashboardFeatures: null,
    dashboardViewingId: null,
    dashboardEditingId: null,
    modified: false,
    saveLoading: false,
    saveSuccess: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
  },
  mounted() {
    if (this.$route.params.viewingId) {
      this.dashboardViewingId = this.$route.params.viewingId;
    }
    if (this.$route.params.editingId) {
      this.dashboardEditingId = this.$route.params.editingId;
    }
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/ADD_NEW_FEATURES') {
        this.fetchDashboard();
      }
      // if (mutation.type === 'dashboard/SET_DASHBOARD_TITLE') {
      //   this.dashboardTitle = mutation.payload;
      // }
      if (mutation.type === 'dashboard/SET_DASHBOARD_FEATURES') {
        this.dashboardFeatures = mutation.payload;
      }
    });
  },
  methods: {
    ...mapMutations('dashboard', [
      'SET_DASHBOARD_FEATURES',
      'SET_DASHBOARD_TITLE',
    ]),
    async fetchDashboard() {
      try {
        const response = await axios.get(`${this.appConfig.customDashboardUrl}/${this.dashboardViewingId}`);
        this.dashboardTitle = response.data.title;
        this.SET_DASHBOARD_TITLE(response.data.title);
        this.loadFeatures(response.data.features, this);
      } catch (error) {
        console.log(error);
      }
    },
    async loadFeatures(features) {
      let dashboardFeatures = features;
      // Pre-load all indicators to populate items
      dashboardFeatures = await Promise.all(dashboardFeatures.map(async (f) => {
        const feature = this.$store.state.features.allFeatures
          .find((i) => this.getLocationCode(i.properties.indicatorObject) === f.poi);
        const indicatorObject = await loadIndicatorData(
          this.baseConfig,
          feature.properties.indicatorObject,
        );
        return {
          ...f,
          indicatorObject,
        };
      }));
      this.SET_DASHBOARD_FEATURES(dashboardFeatures);
    },
    updateFeatures(updated) {
      this.modified = true;
      this.dashboardFeatures = updated;
      this.SET_DASHBOARD_FEATURES(updated);
    },
    async saveCurrentDashboardState() {
      this.saveLoading = true;
      try {
        const response = await axios.post(`${this.appConfig.customDashboardUrl}/${this.dashboardViewingId}/${this.dashboardEditingId}`, {
          title: this.dashboardTitle,
          features: this.dashboardFeatures,
        });
        if (response.status === 200) {
          // show snackbar ?
          this.saveSuccess = true;
          setTimeout(() => {
            this.modified = false;
            this.saveSuccess = false;
          }, 3000);
          this.saveLoading = false;
        }
      } catch (error) {
        // show snackbar ?
        this.saveLoading = false;
        console.log(error);
      }
    },
  },
  watch: {
    dashboardTitle(newTitle) {
      this.SET_DASHBOARD_TITLE(newTitle);
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollContainer {
  overflow-y: scroll;
}
::v-deep .dashboardTitle .v-input input {
  max-height: fit-content;
  color: var(--v-primary-base);
}
</style>
