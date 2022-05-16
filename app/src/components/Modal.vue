<template>
  <div>
    <transition name="fadey">
      <v-card :class="{'green': isFinished}">
        <!--$vuetify.breakpoint.mdAndUp && 'px-10 py-4'-->
        <success
          v-if="isFinished"
          @close="close"
        />

        <save-dashboard-form
          v-else-if="mode == 'dashboard'"
          :storyModeEnabled="storyModeEnabled"
          :localDashboardObject="localDashboardObject"
          @submit="submit"
          @close="close"
        />

        <newsletter-form
          v-else
          @submit="submit"
          @close="close"
        />
      </v-card>
    </transition>
  </div>
</template>

<script>
import {
  mapActions,
} from 'vuex';

import Success from '@/components/Modal/ModalSuccess.vue';
import NewsletterForm from '@/components/Modal/NewsletterForm.vue';
import SaveDashboardForm from '@/components/Modal/SaveDashboardForm.vue';

export default {
  components: {
    Success,
    NewsletterForm,
    SaveDashboardForm,
  },
  data: () => ({
    isFinished: false,
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

    storyModeEnabled: {
      type: Boolean,
      default: false,
    },

    localDashboardObject: {
      type: Object,
      default: () => undefined,
    },
  },
  methods: {
    ...mapActions('dashboard', [
      'addToMailingList',
    ]),

    /**
     * Reset Vuetify form validation and signal our surroundings that we want to be closed.
     */
    close() {
      // this.$refs.form.resetValidation();
      this.$emit('close');
    },

    /**
     * Validate form contents and send our data to the server.
     */
    async submit() {
      this.isFinished = true;
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

.fadey-enter-active,
.fadey-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.fadey-enter-from,
.fadey-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
