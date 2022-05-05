<template>
  <v-form
    ref="form"
    lazy-validation
    class="text-left"
    @submit.prevent="submit"
  >
    <v-card-text class="text-center">
      <h1
        class="display-2 font-weight-light primary--text mb-3"
      >Subscribe to our newsletter</h1>
      <h2
        class="font-weight-light primary--text mb-4"
      >Get our latest platform updates delivered straight to your inbox.</h2>

      <v-card outlined class="pa-3">
          <v-row>
            <v-col cols="12" class="pb-2 pt-0">
              <h2 class="my-3">Your interests</h2>
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
                :rules="form.rules.interests"
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
              <div class="red--text font-weight-bold">
                {{
                  error
                    ? `Could not add to mailing list: ${error}`
                    : ``
                }}
              </div>
            </v-col>
        </v-row>
      </v-card>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        @click="$emit('close')"
        x-large
      >Back</v-btn>
      <v-btn
        color="success"
        type="submit"
        x-large
        :loading="isLoading">Subscribe</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  data: () => ({
    error: null,
    form: {
      rules: {
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
        interests: '',
        name: '',
        email: '',
        privacyConsent: false,
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

    isLoading: false,
  }),
  mounted() {

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
  },
  methods: {
    ...mapActions('dashboard', [
      'addMarketingInfo',
    ]),

    async submit() {
      this.isLoading = true;

      if (this.$refs.form.validate()) {
        try {
          axios.post('https://listmonk.eox.at/add_to_mailing_list', {
            email: this.form.values.email,
            name: this.form.values.name,
            listId: this.$store.state.config.appConfig.mailingList[process.env.NODE_ENV],
            newsletterOptIn: true,
            interests: this.form.values.interests,
            dev: process.env.NODE_ENV !== 'production',
          }, {
            headers: {
              dashboardapikey: shConfig.listmonkApiKey,
            },
          })
            .then(() => {
              this.$emit('submit');
            })
            .catch((e) => {
              this.error = `${e}`;
            });
        } catch (e) {
          console.error(`could not add to mailing list: ${e}`);
        }
      }

      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss">
.v-dialog--fullscreen {
  overflow-x: hidden !important;
  overflow-y: scroll !important;
}
</style>
