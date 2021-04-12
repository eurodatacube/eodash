<template>
  <div
    class="fill-height scrollContainer pa-10 pt-5"
    :style="`margin-top: ${$vuetify.application.top}px !important;
      height: calc(100% - ${$vuetify.application.top}px)`"
  >
    <v-app-bar
        app
        clipped-left
        clipped-right
        flat
        color="primary"
        class="white--text"
      >
        <a
          @click="$store.state.dashboard.featureAdded
            ? $router.go(-1)
            : $router.push({ path: '/' })"
          class="white--text" style="text-decoration: none">
          <v-toolbar-title
            class="text-uppercase mr-5 d-flex align-center"
          >
            <v-icon dark left>mdi-arrow-left</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">
              {{ appConfig && appConfig.branding.appName }}
            </span>
          </v-toolbar-title>
        </a>
        <v-spacer></v-spacer>
        <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
      </v-app-bar>
      <v-row class="d-flex">
        <v-col cols="12" md="6">
          <div class="dashboardTitle">
            <v-text-field
              v-if="newDashboard || hasEditingPrivilege"
              @keydown.enter="editTitle"
              @input="dashboardTitleChanged = false"
              v-model="dashboardTitle"
              :hint="dashboardTitleChanged
                ? 'Title saved'
                : 'Press Enter to save title'"
              label="Dashboard title"
              color="primary"
              class="display-2 font-weight-light primary--text mt-7 mb-5"
              :rules="[v => !!v || 'Title required']"
            ></v-text-field>
            <h1
              v-else
              class="display-2 font-weight-light primary--text mt-7 mb-5">
              {{ dashboardTitle }}</h1>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-flex align-center"
        >
          <div
            :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'"
            style="width: 100%"
          >
            <v-btn
              v-if="hasEditingPrivilege || !(dashboardConfig && dashboardConfig.id)"
              @click="disconnect"
              :color="!(dashboardConfig && dashboardConfig.id) ? 'red' : 'grey'"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : 'mr-4'"
              :block="$vuetify.breakpoint.xsOnly"
              style="color: white"
            >
              <template v-if="!(dashboardConfig && dashboardConfig.id)">
                <v-icon left color="white">mdi-delete</v-icon>
                discard dashboard
              </template>
              <template v-else>
                <v-icon left color="white">mdi-connection</v-icon>
                disconnect
              </template>
            </v-btn>
            <v-btn
              color="info"
              v-if="!newDashboard"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : ''"
              :block="$vuetify.breakpoint.xsOnly"
              @click="viewLinksFn"
            >
              <v-icon left>mdi-link</v-icon>
              share
            </v-btn>
            <v-dialog
              v-model="popupOpen"
              width="50%"
              :fullscreen="$vuetify.breakpoint.xsOnly"
              :hide-overlay="$vuetify.breakpoint.xsOnly"
              transition="dialog-bottom-transition"
            >

              <template v-slot:activator="{}">
                <v-btn
                  color="success"
                  v-if="newDashboard"
                  :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : ''"
                  :block="$vuetify.breakpoint.xsOnly"
                  @click="saveCurrentDashboardState"
                >
                  <v-icon left> mdi-content-save </v-icon>
                    Publish Dashboard
                </v-btn>
              </template>
              <v-card :class="$vuetify.breakpoint.mdAndUp && 'px-10 py-4'"
                style="overflow-y: auto; height: 100%;">
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  class="text-left"
                  @submit.prevent="submitMarketingData"
                >
                  <v-card-text class="text-center" v-if="!success && !viewLinks">
                    <h1
                      class="display-2 font-weight-light primary--text mb-3"
                    >Save this Dashboard</h1>
                    <h2
                      class="font-weight-light primary--text mb-8"
                    >Create a permanent link to your Dashboard configuration</h2>
                    <v-card outlined class="pa-5">
                        <v-row>
                          <v-col cols="12">
                            <h2 class="mb-3">Dashboard Title</h2>
                              <v-text-field
                                v-model="popupTitle"
                                hint="You will be able to change this later"
                                persistent-hint
                                :rules="titleRules"
                                placeholder="Title"
                                required
                                outlined
                                validate-on-blur
                              ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <h2 class="mb-3">Your interests</h2>
                            <v-combobox
                              v-model="interests"
                              :items="interestOptions"
                              placeholder="Your interests"
                              outlined
                              multiple
                              small-chips
                              hint="This helps us provide better, personalized content to you"
                              persistent-hint
                              required
                              :rules="interestsRules"
                              validate-on-blur
                            ></v-combobox>
                          </v-col>
                          <v-col cols="12">
                            <h2 class="mb-3">Your email address</h2>
                              <v-text-field
                                hint="You will receive your dashboard links to this address"
                                persistent-hint
                                v-model="email"
                                :rules="emailRules"
                                placeholder="E-mail"
                                required
                                outlined></v-text-field>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h2 class="mb-3">Newsletter</h2>
                              <v-switch
                              hide-details
                              v-model="consent"
                              :label="consent
                                ? 'Receive updates about new features and data'
                                : 'Do not receive updates about new features and data'"
                            ></v-switch>
                          </v-col>
                      </v-row>
                    </v-card>
                  </v-card-text>
                  <v-card-text class="text-center" v-else>
                    <h2
                      class="display-2 font-weight-light primary--text mb-3"
                    > {{ dashboardConfig.title }}</h2>
                    <h2
                      v-if="!viewLinks"
                      class="font-weight-light primary--text mb-8 success--text"
                    >Dashboard saved!</h2>
                    <v-card outlined class="pa-5 text-left">
                      <v-row>
                        <v-col cols="12">
                          <h2 class="mb-3">Viewing link:</h2>
                          <v-text-field
                            ref="viewingLink"
                            @click:append="copyViewingLink"
                            readonly
                            outlined
                            append-icon="mdi-content-copy"
                            persistent-hint
                            hint="Read-only link to your Dashboard"
                            :value="viewingLink"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          v-if="viewLinks
                            ? $store.state.dashboard.dashboardConfig
                              && $store.state.dashboard.dashboardConfig.editKey
                            : true">
                          <h2 class="mb-3">Editing link:</h2>
                          <v-text-field
                            ref="editingLink"
                            @click:append="copyEditingLink"
                            readonly
                            outlined
                            append-icon="mdi-content-copy"
                            persistent-hint
                            hint="Use this link to make changes to your dashboard"
                            :value="editingLink"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-card-text>
                  <v-card-actions v-if="!success && !viewLinks">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="popupOpen = false" x-large>Back</v-btn>
                    <v-btn
                      color="success"
                      type="submit"
                      x-large
                      :loading="saving">Submit</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <div
              class="mt-3"
              :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'"
              v-if="newDashboard || hasEditingPrivilege"
            >
              <small
                v-if="newDashboard"
              >Changes to the dashboard are saved locally until published</small>
              <template v-if="hasEditingPrivilege">
                <v-icon
                  small
                  left
                >{{ displaySavingChanges ? 'mdi-cached' : 'mdi-cloud-check-outline' }}</v-icon>
                <small>
                  {{ displaySavingChanges ? 'saving changes...' : 'changes saved to cloud' }}
                </small>
              </template>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider v-if="$vuetify.breakpoint.smAndDown" class="my-10"></v-divider>
      <custom-dashboard-grid
        :enableEditing="!!(newDashboard || hasEditingPrivilege)"
        :popupOpen="popupOpen || newTextFeatureDialog"
        @updateTextFeature="openTextFeatureUpdate"
        @change="savingChanges = true"
        @save="savingChanges = false"
      />
      <v-dialog
        v-model="newTextFeatureDialog"
        width="500"
      >
        <template v-slot:activator="{ on }">
          <v-row class="my-5">
            <v-col cols="12" class="text-center">
              <v-btn
                  color="primary"
                  x-large
                  v-on="on"
                  v-if="newDashboard || hasEditingPrivilege"
                  :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : 'mr-4'"
                  :block="$vuetify.breakpoint.xsOnly"
                >
                  <v-icon left> mdi-text-box-plus </v-icon>
                  <span>Add text block</span>
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <v-card>
          <v-card-title class="headline primary--text mb-5">
            {{ !textFeatureUpdate ? 'Add text block' : 'Update text block' }}
          </v-card-title>

          <v-card-text>
            <v-form
              ref="textForm"
              v-model="textValid"
              lazy-validation
              class="text-left"
              @submit.prevent="!textFeatureUpdate
                ? createTextFeature
                : updateTextFeature"
              >
              <v-text-field
                outlined
                label="Title"
                :autofocus="!textFeatureUpdate ? true : false"
                v-model="newTextFeatureTitle"
                :rules="requiredRule"
                validate-on-blur
                v-if="!textFeatureUpdate"
              ></v-text-field>

              <v-textarea
                outlined
                label="Text"
                :auto-grow="true"
                :autofocus="textFeatureUpdate"
                :messages="markdownMessage"
                v-model="newTextFeatureText"
                :rules="requiredRule"
                validate-on-blur
                class="mt-5"
              >
                <template v-slot:message="{ message }">
                  <span v-html="message"></span>
                </template>
              </v-textarea>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => (newTextFeatureDialog = false, textFeatureUpdate = '')"
            >
              cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="createTextFeature"
              v-if="!textFeatureUpdate"
            >
              add
            </v-btn>
            <v-btn
              color="primary"
              @click="updateTextFeature"
              v-else
            >
              update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <global-footer />
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';

import GlobalFooter from '@/components/GlobalFooter.vue';
import CustomDashboardGrid from '@/components/CustomDashboardGrid.vue';

export default {
  components: {
    CustomDashboardGrid,
    GlobalFooter,
  },
  data: () => ({
    newTextFeatureDialog: false,
    newTextFeatureTitle: '',
    newTextFeatureText: '',
    textFeatureUpdate: '',

    popupOpen: false,

    success: false,
    viewLinks: false,
    saving: false,
    popupTitle: '',
    dashboardTitle: '',
    dashboardTitleChanged: false,
    savingChanges: null,
    displaySavingChanges: null,
    savingTimeout: null,

    textValid: true,
    valid: true,
    consent: false,

    requiredRule: [
      (v) => !!v || 'Required',
    ],
    titleRules: [
      (v) => !!v || 'Required',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'Required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    interestsRules: [
      (v) => !!(v instanceof Array && v.length > 0) || 'Required',
    ],

    interestOptions: ['Health', 'Technology', 'Cooking'],
    interests: [],

    reconnecting: false,
    markdownMessage: 'You can use <a href="https://guides.github.com/features/mastering-markdown/" rel="noopener" target="_blank" tabindex="-1">markdown</a>',
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('dashboard', [
      'dashboardConfig',
    ]),
    newDashboard() {
      return !this.$store.state.dashboard?.dashboardConfig?.marketingInfo;
    },
    hasEditingPrivilege() {
      return this.$store.state.dashboard?.dashboardConfig?.editKey;
    },
    viewingLink() {
      return (this.$store.state.dashboard.dashboardConfig
        && this.$store.state.dashboard.dashboardConfig.id)
        ? `${window.location.origin}/dashboard?id=${this.$store.state.dashboard.dashboardConfig.id}`
        : 'Loading...';
    },
    editingLink() {
      return (this.$store.state.dashboard.dashboardConfig
        && this.$store.state.dashboard.dashboardConfig.id)
        ? `${window.location.origin}/dashboard?id=${this.$store.state.dashboard.dashboardConfig.id}&editKey=${this.$store.state.dashboard.dashboardConfig.editKey}`
        : 'Loading...';
    },
  },
  async created() {
    let id = null;
    let editKey = null;
    if (this.$route.query.id) {
      id = this.$route.query.id;
      if (this.$route.query.editKey) {
        editKey = this.$route.query.editKey;
      }
    }

    if (id) {
      this.reconnecting = true;
      this.disconnect();
      await this.listen({ id, editKey });
      this.reconnecting = false;
    }

    if (this.dashboardConfig && this.dashboardConfig.title) {
      this.dashboardTitle = this.dashboardConfig.title;
    }

    if (!this.dashboardConfig) {
      this.$router.push('/');
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
    }

    if (editKey) {
      this.$router.replace({
        query: {
          id,
        },
      });
    }
  },
  beforeDestroy() {
    if (!this.hasEditingPrivilege && !this.newDashboard) {
      this.reconnecting = true;
      this.disconnect();
      this.reconnecting = false;
    }
    clearTimeout(this.savingTimeout);
  },
  watch: {
    dashboardConfig: {
      deep: true,
      handler(v) {
        if (!v && !this.reconnecting) {
          this.$router.push('/');
          this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
        } else {
          this.dashboardTitle = v.title;
        }
      },
    },
    savingChanges(saving) {
      if (saving) {
        this.displaySavingChanges = true;
        clearTimeout(this.savingTimeout);
        this.savingTimeout = setTimeout(
          () => this.displaySavingChanges = false, // eslint-disable-line
          3000,
        );
      }
    },
  },
  methods: {
    ...mapActions('dashboard', [
      'changeTitle',
      'addMarketingInfo',
      'disconnect',
      'listen',
      'addFeature',
      'changeFeatureText',
    ]),
    async editTitle() {
      if (this.hasEditingPrivilege || this.newDashboard) {
        this.performChange('changeTitle', this.dashboardTitle);
        this.dashboardTitleChanged = true;
      }
    },
    async saveCurrentDashboardState() {
      if (this.newDashboard) {
        this.popupTitle = this.dashboardTitle;
        this.popupOpen = true;
      }
    },
    async submitMarketingData() {
      this.loading = true;
      this.performChange('changeTitle', this.popupTitle);
      if (this.$refs.form.validate()) {
        this.performChange('changeTitle', this.popupTitle);
        const success = await this.addMarketingInfo({
          email: this.email,
          consent: this.consent,
          interests: this.interests,
        });
        this.$router.replace({
          path: 'dashboard',
          query: {
            id: this.$store.state.dashboard.dashboardConfig.id,
            editKey: this.$store.state.dashboard.dashboardConfig.editKey,
          },
        });
        this.success = true;
      }
      this.loading = false;
    },
    createTextFeature() {
      if (this.$refs.textForm.validate()) {
        this.performChange(
          'addFeature',
          {
            poi: `${this.newTextFeatureTitle}-${Date.now()}`,
            title: this.newTextFeatureTitle,
            text: this.newTextFeatureText,
            width: 4,
          },
        );
        this.newTextFeatureDialog = false;
        this.newTextFeatureTitle = '';
        this.newTextFeatureText = '';
        this.textFeatureUpdate = '';
      }
    },
    updateTextFeature() {
      if (this.$refs.textForm.validate()) {
        this.performChange(
          'changeFeatureText',
          {
            poi: this.textFeatureUpdate,
            text: this.newTextFeatureText,
          },
        );
      }
      this.newTextFeatureDialog = false;
      this.newTextFeatureTitle = '';
      this.newTextFeatureText = '';
      this.textFeatureUpdate = '';
    },
    openTextFeatureUpdate(el) {
      this.newTextFeatureText = el.text;
      this.newTextFeatureDialog = true;
      this.textFeatureUpdate = el.poi;
    },
    copyViewingLink() {
      this.$refs.viewingLink.$el.querySelector('input').select();
      this.$refs.viewingLink.$el.querySelector('input').setSelectionRange(0, 99999);
      document.execCommand('copy');
    },
    copyEditingLink() {
      this.$refs.editingLink.$el.querySelector('input').select();
      this.$refs.editingLink.$el.querySelector('input').setSelectionRange(0, 99999);
      document.execCommand('copy');
    },
    viewLinksFn() {
      this.viewLinks = true;
      this.popupOpen = true;
    },
    async performChange(method, params) {
      this.savingChanges = true;
      const changed = await this[method](params);
      if (changed !== undefined) {
        this.savingChanges = false;
      }
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
::v-deep .dashboardTitle .v-input {
  input {
    max-height: fit-content;
    color: var(--v-primary-base);
  }
  label:not(.v-label--active) {
    font-size: inherit;
    height: 48px;
    line-height: 48px;
  }
}
</style>
