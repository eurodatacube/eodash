<template>
  <v-card class="eodash-newsletter-banner pa-6">
    <div class="close-button" @click="close">
      <v-icon>mdi-close</v-icon>
    </div>
    <v-row v-if="alwaysSm || $vuetify.breakpoint.smAndDown">
      <v-col>
        <h3 class="text-h5 font-weight-medium">{{ heading }}</h3>

        <p>{{ description }}</p>

        <v-form
          lazy-validation
          ref="form"
          class="mt-10"
        >
          <v-text-field
            v-model="name"
            label="Name"
            :rules="[rules.required]"
            outlined
            block
          />

          <v-text-field
            v-model="email"
            label="Email address"
            :rules="[rules.required, rules.email]"
            outlined
            block
          />

          <v-btn
            color="primary"
            class="mt-2"
            block
            :loading="isLoading"
            :disabled="isFinished"
            @click="submit"
          >
            <span>Submit</span>
          </v-btn>
        </v-form>
      </v-col>
    </v-row>

    <v-row justify="space-between" align-content="center" class="align-center" v-else>
      <v-col class="pr-16">
        <h3>{{ heading }}</h3>

        <p style="margin: 0">{{ description }}</p>
      </v-col>

      <v-text-field
        v-model="email"
        label="Email address"
        :rules="[rules.required, rules.email]"
        class="mr-8"
      />

      <v-btn
        color="primary"
        class="mr-16"
      >
        Subscribe
      </v-btn>
    </v-row>
  </v-card>
</template>

<script>
import {
  mapActions,
} from 'vuex';

export default {
  data: () => ({
    heading: 'Subscribe to our newsletter',
    description: 'Get our latest platform updates delivered straight to your inbox.',
    name: '',
    email: '',
    isLoading: false,
    isFinished: false,
    isNewsletterSubscribed: false,
    rules: {
      required: (value) => !!value || 'Required.',
      counter: (value) => value.length <= 20 || 'Max 20 characters',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
    },
  }),
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
  },
  props: {
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

    /**
     * Called
     * For use in embedded situations where a full size banner is inapproriate.
     */
    close() {
      this.$refs.form.resetValidation();
      this.$emit('close');
    },

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
        })
          .then(() => {
            console.log('successfully added to mailing list');
            this.isFinished = true;
            window.setTimeout(() => {
              this.isLoading = false;
              this.isNewsletterSubscribed = true;
              localStorage.setItem('hasNewsletterSubscription', 'true');
              this.$emit('submit');
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
</style>
