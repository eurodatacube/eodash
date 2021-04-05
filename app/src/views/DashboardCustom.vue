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
              v-if="newDashboard || hasEditingPrivilege"
              @keydown.enter="editTitle"
              v-model="dashboardTitle"
              hint="Edit dashboard title - Press Enter to save"
              persistent-hint
              color="primary"
              class="display-2 font-weight-light primary--text mt-7 mb-5"
              :rules="[v => !!v || 'Title required']"
            ></v-text-field>
            <h1
              v-else
              class="display-2 font-weight-light primary--text mt-7 mb-5">
              {{ dashboardTitle }}</h1>
            <v-dialog
              v-model="newTextFeatureDialog"
              width="500"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                    v-on="on"
                    v-if="hasEditingPrivilege"
                    small
                    class="my-4"
                  >
                    <v-icon left> mdi-text-box-plus </v-icon>
                    <span>Create text indicator</span>
                </v-btn>
              </template>

              <v-card>
                <v-card-title v-if="!textFeatureUpdate" class="headline grey lighten-2">
                  Create text indicator
                </v-card-title>
                <v-card-title v-else class="headline grey lighten-2">
                  Update text indicator
                </v-card-title>

                <v-card-text>
                  <v-form ref="textForm" v-model="textValid" lazy-validation class="text-left">
                    <v-text-field
                      placeholder="Title"
                      filled
                      dense
                      v-model="newTextFeatureTitle"
                      :rules="requiredRule"
                      validate-on-blur
                      class="mt-10"
                      v-if="!textFeatureUpdate"
                    ></v-text-field>

                    <v-textarea
                      placeholder="Text (Markdown supported!)"
                      filled
                      dense
                      v-model="newTextFeatureText"
                      :rules="requiredRule"
                      validate-on-blur
                      class="mt-5"
                    ></v-textarea>
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
                    color="success"
                    @click="createTextFeature"
                    v-if="!textFeatureUpdate"
                  >
                    create
                  </v-btn>
                  <v-btn
                    color="success"
                    @click="updateTextFeature"
                    v-else
                  >
                    update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <div>
            <div class="d-flex justify-"></div>
              <v-btn v-if="hasEditingPrivilege || !(dashboardConfig && dashboardConfig.id)" @click="disconnect" color="red" class="mr-4" style="color: white">
                <template v-if="!(dashboardConfig && dashboardConfig.id)">
                  <v-icon left color="white">mdi-delete</v-icon>
                  discard
                </template>
                <template v-else>
                  <v-icon left color="white">mdi-connection</v-icon>
                  disconnect
                </template>
              </v-btn>
              <v-btn
                color="suvverss"
                v-if="!newDashboard"
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
                    @click="saveCurrentDashboardState"
                  >
                    <v-icon left> mdi-content-save </v-icon>
                      Publish Dashboard
                  </v-btn>
                </template>
                <v-card :class="$vuetify.breakpoint.mdAndUp && 'px-10 py-4'"
                  style="overflow-y: auto; height: 100%;">
                  <v-card-text class="text-center" v-if="!success && !viewLinks">
                    <h1 class="display-2 font-weight-light primary--text mb-3">Save this Dashboard</h1>
                    <h2 class="font-weight-light primary--text mb-8">Create a permanent link to your Dashboard configuration</h2>
                    <v-card outlined class="pa-5">
                      <v-form ref="form" v-model="valid" lazy-validation class="text-left">
                        <v-row>
                          <v-col cols="12">
                            <h2 class="mb-3">Dashboard Title</h2>
                              <v-text-field v-model="popupTitle" hint="You will be able to change this later" persistent-hint :rules="titleRules" placeholder="Title" required outlined validate-on-blur></v-text-field>
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
                              <v-text-field hint="You will receive your dashboard links to this address" persistent-hint v-model="email" :rules="emailRules" placeholder="E-mail" required outlined></v-text-field>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h2 class="mb-3">Newsletter</h2>
                              <v-switch class="no-margin-bottom" v-model="consent" :label="consent ? 'Receive updates about new features and data' : 'Do not receive updates about new features and data'"></v-switch>
                          </v-col>
                        </v-row>
                    </v-form>
                    </v-card>
                  </v-card-text>
                  <v-card-text class="text-center" v-else>
                    <h2 class="display-2 font-weight-light primary--text mb-3"> {{ dashboardConfig.title }}</h2>
                    <h2 v-if="!viewLinks" class="font-weight-light primary--text mb-8 success--text">Dashboard saved!</h2>
                    <v-card outlined class="pa-5 text-left">
                      <v-row>
                        <v-col cols="12">
                          <h2 class="mb-3">Viewing link:</h2>
                          <v-text-field ref="viewingLink" @click:append="copyViewingLink" readonly outlined append-icon="mdi-content-copy" persistent-hint hint="Read-only link to your Dashboard" :value="viewingLink"/>
                        </v-col>
                        <v-col cols="12" v-if="viewLinks ? $store.state.dashboard.dashboardConfig && $store.state.dashboard.dashboardConfig.editKey : true">
                          <h2 class="mb-3">Editing link:</h2>
                          <v-text-field ref="editingLink" @click:append="copyEditingLink" readonly outlined append-icon="mdi-content-copy" persistent-hint hint="Use this link to make changes to your dashboard" :value="editingLink"/>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-card-text>
                  <v-card-actions v-if="!success && !viewLinks">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="popupOpen = false" x-large>Back</v-btn>
                    <v-btn color="success" @click="submitMarketingData" x-large :loading="saving">Submit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            <div class="text-right" v-if="hasEditingPrivilege"><small>Changes to the dashboard are saved automatically</small></div>
          </div>
        </v-col>
      </v-row>
      <custom-dashboard-grid
        :enableEditing="!!(newDashboard || hasEditingPrivilege)"
        :popupOpen="popupOpen || newTextFeatureDialog"
        @updateTextFeature="openTextFeatureUpdate"
      />
      <global-footer />
    </div>
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
      return this.$store.state.dashboard.dashboardConfig && this.$store.state.dashboard.dashboardConfig.id ? `${window.location.origin}/dashboard?id=${this.$store.state.dashboard.dashboardConfig.id}` : 'Loading...';
    },
    editingLink() {
      return this.$store.state.dashboard.dashboardConfig && this.$store.state.dashboard.dashboardConfig.id ? `${window.location.origin}/dashboard?id=${this.$store.state.dashboard.dashboardConfig.id}&editKey=${this.$store.state.dashboard.dashboardConfig.editKey}` : 'Loading...';
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

    if (this.dashboardConfig && this.dashboardConfig.title) this.dashboardTitle = this.dashboardConfig.title;

    if (!this.dashboardConfig) {
      this.$router.push('/');
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
  },
  watch: {
    dashboardConfig: {
      deep: true,
      handler(v) {
        if (!v && !this.reconnecting) {
          this.$router.push('/');
        } else {
          this.dashboardTitle = v.title;
        }
      },
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
    editTitle() {
      if (this.hasEditingPrivilege || this.newDashboard) {
        this.changeTitle(this.dashboardTitle);
      }
    },
    async saveCurrentDashboardState() {
      if (this.newDashboard) {
        this.popupTitle = this.dashboardTitle;
        this.popupOpen = true;
      }
    },
    submitMarketingData() {
      this.loading = true;
      this.changeTitle(this.popupTitle);
      if (this.$refs.form.validate()) {
        this.changeTitle(this.popupTitle);
        this.addMarketingInfo({
          email: this.email,
          consent: this.consent,
          interests: this.interests,
        });
        this.success = true;
      }
      this.loading = false;
    },
    createTextFeature() {
      if (this.$refs.textForm.validate()) {
        this.addFeature({
          poi: `${this.newTextFeatureTitle}-${Date.now()}`,
          title: this.newTextFeatureTitle,
          text: this.newTextFeatureText,
        });
      }
      this.newTextFeatureDialog = false;
      this.newTextFeatureTitle = '';
      this.newTextFeatureText = '';
      this.textFeatureUpdate = '';
    },
    updateTextFeature() {
      if (this.$refs.textForm.validate()) {
        this.changeFeatureText({
          poi: this.textFeatureUpdate,
          text: this.newTextFeatureText,
        });
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

<style lang="scss">
.no-margin-bottom .v-input__slot {
  margin-bottom: 0;
}
</style>
