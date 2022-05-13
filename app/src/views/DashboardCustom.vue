<template>
  <div
    v-if="!initialLoading"
    class="fill-height scrollContainer"
    :class="$vuetify.breakpoint.smAndAbove
      ? 'pa-10 pt-5'
      : (storyModeEnabled ? 'pa-0' : 'pa-5')"
      :style="`margin-top: ${$vuetify.application.top}px;
        height: calc((var(--vh, 1vh) * 100);
        overflow-y: ${storyModeEnabled ? 'hidden' : 'auto'}; overflow-x: hidden`"
    id="scroll-target"
  >
    <global-header />
    <template
      v-if="dashboardError"
    >
    <v-row class="d-flex fill-height">
      <v-col
        cols="12"
        class="d-flex align-center justify-center fill-height"
      >
        <div class="text-center">
          <h1 class="display-3 font-weight-light mt-5 mb-5 primary--text">404</h1>
          <h1
            class="display-1 font-weight-light mt-5 mb-5 primary--text"
          >{{ storyModeEnabled ? 'Story' : 'Dashboard' }} not found</h1>
          <p class="mt-5 mb-5">Error: {{ dashboardError }}.</p>
          <p>Go back to the <router-link to="/" >Dashboard</router-link></p>
        </div>
      </v-col>
    </v-row>
    </template>
    <template v-else>
      <v-row
        class="d-flex my-0"
        id="headerRow"
        :class="storyModeEnabled ? 'pa-5' : ''"
        :style="`position: relative; ${storyModeEnabled
          ? `height: calc(var(--vh, 1vh) * 100)`
            : ''}`"
      >
        <v-img
          v-if="officialDashboard"
          :src="dashboardHeaderImage"
          :lazy-src="dashboardHeaderImagePlaceholder"
          style="position: absolute; width: calc(100% + 56px); max-width: unset;
          height: 100%; margin: 0 -28px 0 -28px; top: 0">
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
          <div
            style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;
            box-shadow: 0 -400px 150px -130px inset #0005"
          ></div>
        </v-img>
        <v-col
          cols="12"
          :md="storyModeEnabled ? 12 : 6"
          :xl="storyModeEnabled ? 12 : 8"
          class="d-flex align-end"
          :class="`${officialDashboard
            ? 'py-4 py-md-16'
            : ''}`"
          style="z-index: 1"
        >
          <div class="dashboardTitle" :style="`${officialDashboard
            ? 'text-shadow: 0 0 20px #000e'
            : ''}`">
            <div class="d-flex">
              <h1
                class="display-1 display-md-2 font-weight-light my-0 mt-md-7 mb-md-5"
                :class="officialDashboard ? 'white--text' : ''"
                :style="`${$vuetify.breakpoint.xsOnly ? 'font-size: 4vh !important': ''}`"
              >
                {{ dashboardTitle }}</h1>
              <div class="d-flex align-center ml-2">
                <v-tooltip right>
                  <template v-slot:activator="{ on }" v-if="hasEditingPrivilege || newDashboard">
                    <v-btn
                      icon
                      large
                      v-on="on"
                      @click="newDashboardTitle = dashboardTitle; titleDialog = true"
                    >
                      <v-icon
                      >mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit dashboard title</span>
                </v-tooltip>
              </div>
              <v-dialog
                v-if="newDashboard || hasEditingPrivilege"
                v-model="titleDialog"
                width="500"
              >
                <v-card>
                  <v-card-title class="headline primary--text mb-5">
                    Title for your Dashboard
                  </v-card-title>

                  <v-card-text>
                    <v-form
                      @submit.prevent="dashboardTitle = newDashboardTitle;
                      editTitle();
                      titleDialog = false">
                      <v-text-field
                        placeholder="Title"
                        outlined
                        autofocus
                        v-model="newDashboardTitle"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="titleDialog = false"
                    >
                      cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="dashboardTitle = newDashboardTitle;
                      editTitle(); titleDialog = false"
                      :disabled="!newDashboardTitle.length"
                      :rules="[v => !!v || 'Title required']"
                    >
                      change
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <template v-if="officialDashboard">
              <p v-html="dashboardSubTitle" class="white--text"></p>
              <img class="header__logo" :src="appConfig && appConfig.branding.headerLogo" />
            </template>
            <template v-else>
              <p v-if="newDashboard || hasEditingPrivilege">
                Disclaimer: By editing, saving and sharing this custom dashboard, you agree to the
                <a
                  href="/terms_and_conditions"
                  target="_blank"
                >Terms and Conditions of this website</a>. Any violation of this agreement will
                result in the deletion of this custom dashboard without warning.
              </p>
              <p v-else>
                <em>
                  This Custom Dashboard was user-generated and is not an official product of the
                  {{ appConfig && appConfig.branding.appName }} project. Some of the content
                  on this page originates from the
                  {{ appConfig && appConfig.branding.appName }},
                  <a :href="rootLink" target="_blank">{{ rootLink }}</a>.
                  <a href="/terms_and_conditions" target="_blank">Terms and Conditions</a> apply.
                </em>
              </p>
            </template>
            <div
              v-if="storyModeEnabled"
            >
              <v-btn
                x-large
                :color="getCurrentTheme ? getCurrentTheme.color : 'primary'"
                class="my-5 mr-3"
                dark
                @click="scrollToStart"
                :block="$vuetify.breakpoint.xsOnly"
              >
                <v-icon left>mdi-arrow-right</v-icon>
                Start
              </v-btn>
              <v-btn
                v-if="!newDashboard"
                color="white"
                outlined
                x-large
                :block="$vuetify.breakpoint.xsOnly"
                @click="viewLinksFn"
              >
                <v-icon left>mdi-share-variant</v-icon>
                share
              </v-btn>
            </div>
            <v-dialog
              v-model="popupOpen"
              :width="$vuetify.breakpoint.xsOnly ? '100%' : '50%'"
              transition="dialog-bottom-transition"
              style="z-index: 9999;"
            >
              <modal
                mode="dashboard"
                @submit="d => { popupOpen = false }"
                @close="d => { popupOpen = false }"
                :storyModeEnabled="storyModeEnabled"
                :localDashboardObject="localDashboardId
                  ? { id: localDashboardId, title: dashboardTitle }
                  : null"
              />
            </v-dialog>
          </div>
        </v-col>
        <v-col
          v-if="!storyModeEnabled"
          cols="12"
          md="6"
          xl="4"
          class="d-flex align-center"
          style="z-index: 1"
        >
          <div
            :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'"
            style="width: 100%"
          >
            <v-btn
              v-if="!newDashboard"
              color="info"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : 'mr-4'"
              :block="$vuetify.breakpoint.xsOnly"
              @click="viewLinksFn"
            >
              <v-icon left>mdi-share-variant</v-icon>
              share
            </v-btn>
            <v-btn
              v-if="!localDashboardFeatures &&
                (hasEditingPrivilege || !(dashboardConfig && dashboardConfig.id))"
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
                <v-icon left color="white">mdi-exit-to-app</v-icon>
                exit edit mode
              </template>
            </v-btn>
            <v-btn
              color="success"
              v-if="newDashboard"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : ''"
              :block="$vuetify.breakpoint.xsOnly"
              @click="saveCurrentDashboardState"
            >
              <v-icon left> mdi-content-save </v-icon>
                Save Dashboard
            </v-btn>
            <div
              v-if="!localDashboardFeatures && (newDashboard || hasEditingPrivilege)"
              class="mt-3"
              :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'"
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
      <v-divider
        v-if="$vuetify.breakpoint.smAndDown && !storyModeEnabled"
        class="my-10"
      ></v-divider>
      <custom-dashboard-grid
        ref="customDashboardGrid"
        v-if="$store.state.features.allFeatures.length > 0"
        :enableEditing="!!(newDashboard || hasEditingPrivilege)"
        :popupOpen="popupOpen || !!newFeatureDialog"
        :storyMode="storyModeEnabled"
        :localFeatures="localDashboardFeatures"
        :dashboardMeta="{ title: dashboardTitle }"
        :themeColor="getCurrentTheme ? getCurrentTheme.color : undefined"
        :image-flag="imageFlag"
        @updateTextFeature="openTextFeatureUpdate"
        @change="savingChanges = true"
        @save="savingChanges = false"
        @scrollTo="pageScroll"
      />
      <v-row class="my-5">
        <v-col cols="12" class="text-center">
          <v-btn
              color="primary"
              x-large
              v-if="newDashboard || hasEditingPrivilege"
              @click="newFeatureDialog = 'text'"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : 'mr-4'"
              :block="$vuetify.breakpoint.xsOnly"
            >
              <v-icon left> mdi-text-box-plus </v-icon>
              Add text block
          </v-btn>
          <v-btn
              color="primary"
              x-large
              v-if="newDashboard || hasEditingPrivilege"
              @click="newFeatureDialog = 'image'"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : 'mr-4'"
              :block="$vuetify.breakpoint.xsOnly"
            >
              <v-icon left>mdi-image-plus </v-icon>
              Add image block
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog
        :value="newFeatureDialog"
        width="500"
      >
        <v-card>
          <v-card-title class="headline primary--text mb-5">
            {{ !textFeatureUpdate
              ? `Add ${newFeatureDialog} block`
              : `Update ${newFeatureDialog} block` }}
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
                :autofocus="!!textFeatureUpdate"
                v-model="newTextFeatureTitle"
                :rules="requiredRule"
                validate-on-blur
                v-if="!textFeatureUpdate"
              ></v-text-field>
              <v-text-field
                v-if="newFeatureDialog === 'image'"
                outlined
                label="Image URL"
                :autofocus="!!textFeatureUpdate"
                v-model="newTextFeatureImageUrl"
                :rules="requiredRule"
                validate-on-blur
              ></v-text-field>

              <v-textarea
                outlined
                :label="newFeatureDialog === 'text' ? 'Text' : 'Image description'"
                :auto-grow="true"
                :autofocus="!!textFeatureUpdate"
                :messages="markdownMessage"
                v-model="newTextFeatureText"
                :rules="newFeatureDialog === 'text' ? requiredRule : []"
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
              @click="() => (newFeatureDialog = false, textFeatureUpdate = '')"
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
    </template>
    <v-overlay
      v-if="storyModeEnabled"
      :value="scrollOverlay"
      z-index="4"
      opacity="1"
      :color="$vuetify.theme.dark ? '#212121' : '#fff'"
    ></v-overlay>
    <global-footer
      :color="getCurrentTheme ? getCurrentTheme.color : 'primary'"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';

import axios from 'axios';

import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import CustomDashboardGrid from '@/components/CustomDashboardGrid.vue';
import Modal from '@/components/Modal.vue';

export default {
  components: {
    CustomDashboardGrid,
    GlobalHeader,
    GlobalFooter,
    Modal,
  },
  data: () => ({
    newFeatureDialog: false,
    newTextFeatureTitle: '',
    newTextFeatureImageUrl: '',
    newTextFeatureText: '',
    textFeatureUpdate: '',

    newDashboardTitle: '',
    titleDialog: false,

    popupOpen: false,

    success: false,
    viewLinks: false,
    saving: false,
    popupTitle: '',
    dashboardTitle: '',
    dashboardSubTitle: null,
    dashboardHeaderImage: null,
    dashboardHeaderImagePlaceholder: null,
    dashboardTitleChanged: false,
    savingChanges: null,
    displaySavingChanges: null,
    savingTimeout: null,

    textValid: true,
    valid: true,
    newsletterOptIn: false,

    initialLoading: true,

    requiredRule: [
      (v) => !!v || 'Required',
    ],
    titleRules: [
      (v) => !!v || 'Required',
      (v) => /^[\w\-\s]+$/.test(v) || 'Invalid title',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'Required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    interestsRules: [
      (v) => !!(v instanceof Array && v.length > 0) || 'Required',
    ],

    interestOptions: [
      'Environmental monitoring',
      'Climate',
      'Health',
      'Economy',
      'Earth science',
      'EO Platforms & Technology',
      'Education',
    ],
    interests: [],

    name: '',
    nameRules: [
      (v) => !!v || 'Required',
    ],
    privacyConsent: false,
    privacyRules: [
      (v) => !!v || 'Required',
    ],
    reconnecting: false,
    markdownMessage: 'You can use <a href="https://guides.github.com/features/mastering-markdown/" rel="noopener" target="_blank" tabindex="-1">markdown</a>',
    officialDashboard: false,
    storyModeEnabled: false,
    dashboardError: null,
    localDashboardFeatures: null,
    localDashboardId: null,
    scrollOverlay: false,
    imageFlag: '<--IMG-->',
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    ...mapState('dashboard', [
      'dashboardConfig',
    ]),
    ...mapGetters('themes', [
      'getCurrentTheme',
    ]),
    newDashboard() {
      return this.$store.state.dashboard.dashboardConfig
        && !this.$store.state.dashboard?.dashboardConfig?.marketingInfo
        && !this.officialDashboard;
    },
    hasEditingPrivilege() {
      return this.$store.state.dashboard?.dashboardConfig?.editKey
        && !this.officialDashboard;
    },
    rootLink() {
      return document.location.origin;
    },
  },
  async created() {
    if (this.$route.path === '/story') {
      this.storyModeEnabled = true;
      document.onkeydown = this.onKeyPress;
    }

    let id = null;
    let editKey = null;
    if (this.$route.query.id) {
      id = this.$route.query.id;
      if (this.$route.query.editKey) {
        editKey = this.$route.query.editKey;
      }
    }

    if (this.newDashboard) {
      this.dashboardTitle = 'My Dashboard';
    }

    if (id) {
      const storiesConfig = require('../config/stories.json');
      const existingConfiguration = this.getDeepProperty(storiesConfig[this.appConfig.id], id);
      if (this.storyModeEnabled && !this.getCurrentTheme) {
        if (existingConfiguration) {
          const currentTheme = Object.entries(storiesConfig[this.appConfig.id])
            .find((stories) => Object.values(stories[1]).includes(existingConfiguration))[0];
          this.loadTheme(currentTheme);
        }
      }
      if (
        !editKey
        && existingConfiguration
      ) {
        // replace with local custom dashboard
        const localDashboard = await axios
          .get(`./data/dashboards/${existingConfiguration.originalDashboardId}.json`, {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0',
            },
          });
        const localDashboardContent = localDashboard.data;
        this.officialDashboard = true;
        this.localDashboardId = id;
        this.dashboardTitle = existingConfiguration.title;
        this.dashboardSubTitle = existingConfiguration.subtitle;
        this.dashboardHeaderImage = existingConfiguration.image;
        this.dashboardHeaderImagePlaceholder = existingConfiguration.imagePlaceholder;
        const localFeatures = localDashboardContent.features.map((f) => {
          const newF = { ...f };
          delete newF.id;
          newF.poi = f.id;
          return newF;
        });
        this.localDashboardFeatures = localFeatures;
      } else {
        this.reconnecting = true;
        this.disconnect();
        try {
          await this.listen({ id, editKey });
        } catch (error) {
          this.dashboardError = error.message;
        }
        this.reconnecting = false;
      }
    }

    if (this.dashboardConfig && !this.officialDashboard) {
      if (this.dashboardConfig.title) {
        this.dashboardTitle = this.dashboardConfig.title;
      }
      if (this.dashboardConfig.id && !id) {
        this.$router.replace({
          path: 'dashboard',
          query: {
            id: this.dashboardConfig.id,
            ...this.dashboardConfig.editKey && { editKey: this.dashboardConfig.editKey },
          },
        });
      }
    }
    if (this.officialDashboard && this.storyModeEnabled) {
      if (!this.getCurrentTheme) {
        if (existingConfiguration) {
          const currentTheme = Object.entries(storiesConfig[this.appConfig.id])
            .find((stories) => Object.values(stories[1]).includes(existingConfiguration))[0];
          this.loadTheme(currentTheme);
        }
      }
    } else {
      this.loadTheme(null);
    }

    if (!this.dashboardConfig) {
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', null);
    }
    this.editTitle();
    this.initialLoading = false;
  },
  beforeDestroy() {
    if (!this.hasEditingPrivilege && !this.newDashboard && !this.officialDashboard) {
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
          this.dashboardTitle = v ? v.title : null;
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
      'addToMailingList',
      'disconnect',
      'listen',
      'addFeature',
      'changeFeatureText',
    ]),
    ...mapActions('themes', ['loadTheme']),
    async editTitle() {
      if (this.hasEditingPrivilege || this.newDashboard) {
        this.performChange('changeTitle', this.dashboardTitle);
      }
    },
    async saveCurrentDashboardState() {
      if (this.newDashboard) {
        this.popupTitle = this.dashboardTitle;
        this.popupOpen = true;
      }
    },
    createTextFeature() {
      if (this.$refs.textForm.validate()) {
        this.performChange(
          'addFeature',
          {
            poi: `${this.newTextFeatureTitle}-${Date.now()}`,
            title: this.newTextFeatureTitle,
            text: `${this.newFeatureDialog === 'image'
              ? `${this.imageFlag}${this.newTextFeatureImageUrl}${this.imageFlag}`
              : ''}${this.newTextFeatureText}`,
            width: 4,
          },
        );

        this.resetTextFeature();
      }
    },
    updateTextFeature() {
      if (this.$refs.textForm.validate()) {
        this.performChange(
          'changeFeatureText',
          {
            poi: this.textFeatureUpdate,
            text: `${this.newFeatureDialog === 'image'
              ? `${this.imageFlag}${this.newTextFeatureImageUrl}${this.imageFlag}`
              : ''}${this.newTextFeatureText}`,
          },
        );
      }

      this.resetTextFeature();
    },
    resetTextFeature() {
      this.newFeatureDialog = false;
      this.newTextFeatureTitle = '';
      this.newTextFeatureImageUrl = '';
      this.newTextFeatureText = '';
      this.textFeatureUpdate = '';
      this.$refs.textForm.resetValidation();
    },
    openTextFeatureUpdate(el) {
      this.newTextFeatureText = el.text;
      if (el.text.includes(this.imageFlag)) {
        this.newFeatureDialog = 'image';
        this.newTextFeatureImageUrl = el.text.substring(
          el.text.indexOf(this.imageFlag) + this.imageFlag.length,
          el.text.lastIndexOf(this.imageFlag),
        );
        this.newTextFeatureText = el.text.substring(
          el.text.lastIndexOf(this.imageFlag) + +this.imageFlag.length,
        );
      } else {
        this.newFeatureDialog = 'text';
        this.newTextFeatureText = el.text;
      }
      this.textFeatureUpdate = el.poi;
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
    onPencilClick() {
      this.editingTitle = true;
      this.$refs.titleInput.focus();
    },
    scrollToStart() {
      this.pageScroll({
        target: this.$refs.customDashboardGrid,
        offset: -1 * this.$vuetify.application.top,
      });
    },
    pageScroll({ target, offset = 0 }) {
      this.scrollOverlay = true;
      setTimeout(async () => {
        await this.$vuetify.goTo(
          target,
          {
            container: document.querySelector('.scrollContainer'),
            offset,
            duration: 0,
          },
        );
        setTimeout(() => {
          this.scrollOverlay = false;
        }, 200);
      }, 200);
    },
    onKeyPress(event) {
      const e = event || window.event;
      if (e.keyCode === 38) { // up
        e.preventDefault();
      } else if (e.keyCode === 40) { // down
        e.preventDefault();
      } else if (e.keyCode === 37) { // left
        e.preventDefault();
        this.$refs.customDashboardGrid.goStep(-1);
      } else if (e.keyCode === 39) { // right
        e.preventDefault();
        if (!this.$refs.customDashboardGrid.currentRow) {
          this.scrollToStart();
        } else if (this.$refs.customDashboardGrid.currentRow
          !== this.$refs.customDashboardGrid.numberOfRows) {
          this.$refs.customDashboardGrid.goStep(1);
        }
      }
    },
    getDeepProperty(obj, prop) {
      // https://stackoverflow.com/a/33445021
      /* eslint-disable */
      if (typeof obj === 'object' && obj !== null) {
        if (obj.hasOwnProperty(prop)) {
          return obj[prop];
        }
        for (var p in obj) {
          if (obj.hasOwnProperty(p) &&
              this.getDeepProperty(obj[p], prop)) { 
            return obj[p][prop];
          }
        }
      }
      return false;
      /* eslint-enable */
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
  height: 32px;
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
// edit icon next to title
::v-deep .display-2 {
  .v-input__icon.v-input__icon--append .v-icon {
    font-size: 40px;
  }
}
::v-deep .display-2 ::v-deep .v-input__append-inner {
  align-self: center !important;
}
.theme-button {
  border-radius: 4px;
  background: #FFF4;
  text-transform: none;
  font-size: 90%;
  padding: 2px 5px;
  text-decoration: none;
  color: #FFF;
}
</style>

<style> /* specific style to fix spacing in v-checkbox */
.v-input--selection-controls .v-input__slot > .v-label {
  display: inline !important;
}
</style>
