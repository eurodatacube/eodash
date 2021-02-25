<template>
  <div
    class="fill-height scrollContainer"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height pa-10 pt-5"
    >
    <v-app-bar
        app
        clipped-left
        clipped-right
        flat
        color="primary"
        class="white--text"
      >
        <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title
          v-if="$vuetify.breakpoint.mdAndUp"
          class="text-uppercase mr-5"
        >
          {{ appConfig && appConfig.branding.appName }}
        </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
      </v-app-bar>
      <v-row class="d-flex">
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <div class="dashboardTitle">
            <v-text-field
              v-if="dashboardEditingId || newDashboard"
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
        :enableEditing="!!dashboardEditingId || newDashboard"
        @updateFeatures="updateFeatures"
      />
      <global-footer />
    </div>
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
    newDashboard: false,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('dashboard', [
      'dashboardConfig',
    ]),
  },
  mounted() {
    if (this.$route.params.viewingId) {
      this.dashboardViewingId = this.$route.params.viewingId;
      if (this.$route.params.editingId) {
        this.dashboardEditingId = this.$route.params.editingId;
      }
    } else {
      this.newDashboard = true;
      this.loadFeatures(this.dashboardConfig.features, this);
    }
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'features/ADD_NEW_FEATURES' && this.dashboardViewingId) {
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
      if (this.newDashboard) {
        console.log('new');
      } else {
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
.header__logo {
  height: 32px;
}
.scrollContainer {
  overflow-y: scroll;
}
::v-deep .dashboardTitle .v-input input {
  max-height: fit-content;
  color: var(--v-primary-base);
}
</style>
