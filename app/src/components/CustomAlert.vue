<template>
  <v-dialog
    v-model="dialog"
    width="50%">
    <v-card>
      <v-card-title>
        Error
      </v-card-title>
      <v-card-text>
        {{ dialogText }}
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapState,
} from 'vuex';
import dialogMixin from '@/mixins/dialogMixin';

export default {
  mixins: [dialogMixin],
  data: () => ({
    dialog: false,
    dialogText: '',
  }),
  computed: {
    ...mapState('config', ['appConfig']),
  },
  methods: {
    setCustomAlertMessage(event) {
      this.dialog = true;
      this.dialogText = event.detail;
    },
  },
  created() {
    window.addEventListener('custom-alert-message', this.setCustomAlertMessage);
  },
  beforeDestroy() {
    window.removeEventListener('custom-alert-message', this.setCustomAlertMessage);
  },
};
</script>
