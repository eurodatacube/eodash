<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    class="text-left"
    @submit.prevent="submitMarketingData"
  >
    <v-card-text
      v-if="!storyModeEnabled && !localDashboardObject && !success && !viewLinks"
      class="text-center"
    >
      <h1
        class="display-2 font-weight-light primary--text mb-3"
      >Save this Dashboard</h1>
      <h2
        class="font-weight-light primary--text mb-4"
      >Create a permanent link to your Dashboard configuration</h2>
      <v-card outlined class="pa-3">
          <v-row>
            <v-col cols="12" class="pb-2 pt-4">
              <h2 class="mb-3">Dashboard Title</h2>
                <v-text-field
                  v-model="form.values.title"
                  hint="You will be able to change this later"
                  persistent-hint
                  :rules="form.rules.required"
                  placeholder="Title"
                  required
                  outlined
                  validate-on-blur
                ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-2 pt-0">
              <h2 class="mb-3">Your interests</h2>
              <v-combobox
                v-model="form.values.interests"
                :items="form.options.interests"
                type="button"
                placeholder="Your interests"
                outlined
                multiple
                small-chips
                hint="This helps us provide better, personalized content to you"
                persistent-hint
                required
                :rules="form.rules.required"
                validate-on-blur
              ></v-combobox>
            </v-col>
            <v-col cols="12" class="pb-2 pt-0">
              <h2 class="mb-3">Your name</h2>
                <v-text-field
                  v-model="form.values.name"
                  :rules="form.rules.name"
                  placeholder="Name"
                  required
                  outlined></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-2 pt-0">
              <h2 class="mb-3">Your email address</h2>
                <v-text-field
                  hint="You will receive your dashboard links to this address"
                  persistent-hint
                  v-model="form.values.email"
                  :rules="form.rules.email"
                  placeholder="E-mail"
                  required
                  outlined></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0 pt-0">
              <v-checkbox
                v-model="form.values.privacyConsent"
                :rules="form.rules.privacyConsent"
                required>
                <template v-slot:label>
                  I have read and accepted the
                  <a @click.stop href='/privacy' target="_blank">
                    Privacy Notice and Consent Form
                  </a>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="12" class="pb-2 pt-0">
              <v-checkbox
                v-model="form.values.newsletterOptIn">
                <template v-slot:label>
                  I want to stay up-to-date about {{ appConfig
                    && appConfig.branding.appName }} via newsletter
                </template>
              </v-checkbox>
            </v-col>
        </v-row>
      </v-card>
    </v-card-text>
    <template v-else-if="storyModeEnabled && localDashboardObject">
      <v-card-title>Story: {{ localDashboardObject.title }}</v-card-title>
      <v-card-text>
        <v-text-field
          ref="viewingLink"
          @click:append="copyViewingLink"
          readonly
          outlined
          append-icon="mdi-content-copy"
          persistent-hint
          hint="Share the story using this link!"
          :value="viewingLink"
        />
      </v-card-text>
    </template>
    <v-card-text class="text-center" v-else>
      <h2
        class="display-2 font-weight-light primary--text mb-3"
      > <!--{{ dashboardConfig && dashboardConfig.title }}-->{{ form.values.title }}</h2>
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
              :hint="$store.state.dashboard.dashboardConfig
                && $store.state.dashboard.dashboardConfig.editKey
                  ? `Read-only link to your ${storyModeEnabled
                    ? 'Story'
                    : 'Dashboard'}`
                  : `Read-only link to this ${storyModeEnabled
                    ? 'Story'
                    : 'Dashboard'}`"
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
    <v-card-actions v-if="!storyModeEnabled && !success && !viewLinks">
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('close')" x-large>Back</v-btn>
      <v-btn
        color="success"
        type="submit"
        x-large
        :loading="saving">Submit</v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('close')" x-large>Close</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';

export default {
  data: () => ({
    saving: false,
    success: false,
    viewLinks: false,
    valid: true,
    form: {
      rules: {
        required: [
          (v) => !!v || 'Required',
        ],

        interests: [
          (v) => !!(v instanceof Array && v.length > 0) || 'Required',
        ],

        name: [
          (v) => !!v || 'Required',
        ],

        email: [
          (v) => !!v || 'Required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],

        privacyConsent: [
          (v) => !!v || 'Required',
        ],
      },
      values: {
        title: '',
        interests: '',
        name: '',
        email: '',
        privacyConsent: false,
        newsletterOptIn: false,
      },
      options: {
        interests: [
          'Environmental monitoring',
          'Climate',
          'Health',
          'Economy',
          'Earth science',
          'EO Platforms & Technology',
          'Education',
        ],
      },
    },
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),

    ...mapState('dashboard', [
      'dashboardConfig',
    ]),

    viewingLink() {
      let link = 'Loading...';
      if (this.localDashboardObject && this.localDashboardObject.id) {
        if (this.storyModeEnabled) {
          link = `${window.location.origin}/story?id=${this.localDashboardObject.id}`;
        } else {
          link = `${window.location.origin}/dashboard?id=${this.localDashboardObject.id}`;
        }
      } else if (this.$store.state.dashboard.dashboardConfig
        && this.$store.state.dashboard.dashboardConfig.id) {
        if (this.storyModeEnabled) {
          link = `${window.location.origin}/story?id=${this.$store.state.dashboard
            .dashboardConfig.id}`;
        } else {
          link = `${window.location.origin}/dashboard?id=${this.$store.state.dashboard
            .dashboardConfig.id}`;
        }
      }
      return link;
    },

    editingLink() {
      return (this.$store.state.dashboard.dashboardConfig
        && this.$store.state.dashboard.dashboardConfig.id)
        ? `${window.location.origin}/${this.storyModeEnabled
          ? 'story'
          : 'dashboard'}?id=${this.$store.state.dashboard
          .dashboardConfig.id}&editKey=${this.$store.state.dashboard.dashboardConfig.editKey}`
        : 'Loading...';
    },
  },
  props: {
    /**
     * The context in which this modal is used. One of 'dashboard' or 'newsletter'.
     * Changing this parameter changes this modal's title and subtitle as well as
     * the arrangement of its inputs.
     */
    mode: {
      type: String,
      default: 'newsletter',
    },

    storyModeEnabled: {
      type: Boolean,
      required: true,
    },

    localDashboardObject: {
      type: Object,
      requred: false,
    },
  },
  created() {
    if (this.$route.query.id) {
      this.viewLinks = true;
    }
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

    increaseProgress() {
      this.progress += 0.6;

      if (this.progress >= 110.0) {
        this.progress = 0.0;
        this.$emit('close');
      }
    },

    async performChange(method, params) {
      this.savingChanges = true;
      const changed = await this[method](params);
      if (changed !== undefined) {
        this.savingChanges = false;
      }
    },

    async submitMarketingData() {
      this.saving = true;
      this.performChange('changeTitle', this.form.values.title);
      if (this.$refs.form.validate()) {
        this.performChange('changeTitle', this.form.values.title);
        await this.addMarketingInfo({
          interests: this.form.values.interests,
        });

        try {
          await this.addToMailingList({
            email: this.form.values.email,
            name: this.form.values.name,
            listId: this.$store.state.config.appConfig.mailingList[process.env.NODE_ENV],
            newsletterOptIn: this.form.values.newsletterOptIn,
            dashboardId: this.$store.state.dashboard.dashboardConfig.id,
            dashboardURLView: this.viewingLink,
            dashboardURLEdit: this.editingLink,
            dashboardTitle: this.form.values.title,
            interests: this.form.values.interests,
          });
        } catch (e) {
          console.error(`could not add to mailing list: ${e}`);
        }

        this.$router.replace({
          path: 'dashboard',
          query: {
            id: this.$store.state.dashboard.dashboardConfig.id,
            editKey: this.$store.state.dashboard.dashboardConfig.editKey,
          },
        });
        this.success = true;
      }
      this.saving = false;
    },

    submit() {
      this.$emit('submit');
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
  },
};
</script>

<style lang="scss" scoped>
.eodash-newsletter-banner {
  position: relative;

  .close-button {
    position: absolute;
    right: 18px;
    top: 18px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}

.mobile-modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.fullwidth {
  left: 0;
  top: 0;
}
</style>
