<template>
  <v-dialog
    v-model="dialog"
    width="85%"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :hide-overlay="$vuetify.breakpoint.xsOnly"
    transition="dialog-bottom-transition"
  >

    <template v-slot:activator="{}">
      <v-btn
        dark
        small
        color="secondary"
        class="ml-1"
        @click="dialog = true"
      >
        <v-icon :left="!$vuetify.breakpoint.xsOnly" small>mdi-account-voice</v-icon>
        <span v-if="!$vuetify.breakpoint.xsOnly">Feedback</span>
      </v-btn>
    </template>

    <v-toolbar v-if="$vuetify.breakpoint.xsOnly" dark color="primary">
      <v-toolbar-title>How can we improve eodash?
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="dialog = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card :class="$vuetify.breakpoint.mdAndUp && 'pa-5'"
      style="overflow-y: auto; height: 100%;">
      <v-card-text>
        <Feedback />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Back</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin';
import Feedback from '@/views/Feedback.vue';

export default {
  mixins: [dialogMixin],
  components: {
    Feedback,
  },
  data: () => ({
    dialog: false,
  }),
};
</script>
