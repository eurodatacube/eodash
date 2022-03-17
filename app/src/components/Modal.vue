<template>
  <div>
    <success-card
      v-if="isFinished"
      @close="close"
    />
    <v-card
      style="overflow-y: auto; height: 100%; max-width: 100% !important;"
      v-else
    >
      <!--$vuetify.breakpoint.mdAndUp && 'px-10 py-4'-->
      <v-form
        ref="form"
        lazy-validation
        class="text-left"
        @submit.prevent="submit"
      >
        <v-card-text class="text-center">
          <template v-if="!alwaysSm">
            <h1
              class="display-2 font-weight-light primary--text mb-3"
            >{{ titles[mode] }}</h1>
            <h2
              class="font-weight-light primary--text mb-4"
            >{{ subtitles[mode] }}</h2>
          </template>

          <template v-else>
            <h2
              class="display-1 font-weight-light primary--text mb-3"
            >{{ titles[mode] }}</h2>
            <h3
              class="font-weight-light primary--text mb-4"
            >{{ subtitles[mode] }}</h3>
          </template>

          <v-card outlined class="pa-3">
              <v-row>
                <v-col cols="12" class="pb-2 pt-4" v-if="mode === 'dashboard'">
                  <h2 class="mb-3">Dashboard Title</h2>
                    <v-text-field
                      v-model="popupTitle"
                      hint="You will be able to change this later"
                      persistent-hint
                      :rules="form.title.rules"
                      placeholder="Title"
                      required
                      outlined
                      validate-on-blur
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-2 pt-0">
                  <h2 class="my-3">Your interests</h2>
                  <v-combobox
                    v-model="form.interests.value"
                    :items="form.interests.options"
                    type="button"
                    placeholder="Your interests"
                    outlined
                    multiple
                    small-chips
                    hint="This helps us provide better, personalized content to you"
                    persistent-hint
                    required
                    :rules="form.interests.rules"
                    validate-on-blur
                  ></v-combobox>
                </v-col>
                <v-col cols="12" class="pb-2 pt-0">
                  <h2 class="mb-3">Your name</h2>
                    <v-text-field
                      v-model="form.name.value"
                      :rules="form.name.rules"
                      placeholder="Name"
                      required
                      outlined></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-2 pt-0">
                  <h2 class="mb-3">Your email address</h2>
                    <v-text-field
                      :hint="mode === 'newsletter'
                        ? ''
                        : 'You will receive your dashboard links to this address'
                      "
                      persistent-hint
                      v-model="form.email.value"
                      :rules="form.email.rules"
                      placeholder="E-mail"
                      required
                      outlined></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0 pt-0">
                  <v-checkbox
                    v-model="form.privacyConsent.value"
                    :rules="form.privacyConsent.rules"
                    required>
                    <template v-slot:label>
                      I have read and accepted the
                      <a @click.stop href='/privacy' target="_blank">
                        Privacy Notice and Consent Form
                      </a>
                    </template>
                  </v-checkbox>
                </v-col>
                <!--<v-col cols="12" class="pb-2 pt-0" v-if="mode === 'dashboard'">
                  <v-checkbox
                    v-model="newsletterOptIn">
                    <template v-slot:label>
                      I want to stay up-to-date about {{ appConfig
                        && appConfig.branding.appName }} via newsletter
                    </template>
                  </v-checkbox>
                </v-col>-->
            </v-row>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close"
            x-large
          >Back</v-btn>
          <v-btn
            color="success"
            type="submit"
            x-large
            :loading="isLoading">Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {
  mapActions,
} from 'vuex';

import SuccessCard from '@/components/Modal/SuccessCard.vue';

export default {
  components: {
    SuccessCard,
  },
  data: () => ({
    isFinished: false,
    isLoading: false,
    isValid: false,
    progress: 0.0,
    
    form: {
      interests: {
        value: '',
        rules: [
          (v) => !!(v instanceof Array && v.length > 0) || 'Required',
        ],
        options: [
          'Environmental monitoring',
          'Climate',
          'Health',
          'Economy',
          'Earth science',
          'EO Platforms & Technology',
          'Education',
        ],
      },

      dashboardTitle: {
        value: '',
      },

      name: {
        value: '',
        rules: [
          (v) => !!v || 'Required',
        ],
      },

      email: {
        value: '',
        rules: [
          (v) => !!v || 'Required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
      },

      privacyConsent: {
        value: false,
        rules: [
          (v) => !!v || 'Required',
        ],
      },
    },
    rules: {
      required: (value) => !!value || 'Required.',
      counter: (value) => value.length <= 20 || 'Max 20 characters',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
    },
  }),
  mounted () {
    this.progress = 0.0;
    //this.isFinished = false;
  },
  computed: {
    paddingClasses() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return ['pa-4'];
        case 'sm': return ['pa-4'];
        case 'md': return ['pa-12'];
        case 'lg': return ['pa-12'];
        case 'xl': default: return ['pa-12'];
      }
    },

    width() {
      const smallWidth = this.alwaysSm ? '400px' : 'auto';

      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '100vw';
        case 'sm': return '100vw';
        case 'md': return smallWidth;
        case 'lg': return smallWidth;
        case 'xl': default: return smallWidth;
      }
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
    /**
     * Designates if the banner should always use the small layout.
     * For use in embedded situations where a full size banner is inapproriate.
     */
    alwaysSm: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions('dashboard', [
      'addToMailingList',
    ]),

    increaseProgress () {
      this.progress = this.progress + 0.6;

      if (this.progress >= 110.0) {
        this.$emit('close');
      }
    },

    /**
     * Reset Vuetify form validation and signal our surroundings that we want to be closed.
     */
    close() {
      //this.$refs.form.resetValidation();
      this.$emit('close');
    },

    /**
     * Validate form contents and send our data to the server.
     */
    async submit() {
      console.log('submitting');

      const isValid = this.$refs.form.validate();

      if (isValid) {
        // Since the form is valid, and we're now initiating the request,
        // it's time to let the user know something is happening.
        this.isLoading = true;

        // Do the API call.
        this.addToMailingList({
          email: this.email,
          name: this.name,
          listId: this.$store.state.config.appConfig.mailingList[process.env.NODE_ENV],
          newsletterOptIn: true,
          interests: this.interests,
        })
          .then(() => {
            console.log('successfully added to mailing list');

            window.setTimeout(() => {
              this.isLoading = false;
              this.isNewsletterSubscribed = true;

              this.isFinished = true;
            }, 200);
          })
          .catch((e) => console.log(`could not add to mailing list: ${e}`));

        this.isLoading = false;
      }
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
