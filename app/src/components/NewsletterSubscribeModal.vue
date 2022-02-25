<template>
    <v-dialog
        v-model="isEnabled"
        width="50%"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        :hide-overlay="$vuetify.breakpoint.xsOnly"
        transition="dialog-bottom-transition"
        style="z-index: 9999;"
    >
        <v-card :class="$vuetify.breakpoint.mdAndUp && 'px-10 py-4'"
        style="overflow-y: auto; height: 100%;">
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            class="text-left"
            @submit.prevent="submitMarketingData"
        >
            <v-card-text class="text-center">
            <h1
                class="display-2 font-weight-light primary--text mb-3"
            >Subscribe to our Newsletter</h1>
            <h2
                class="font-weight-light primary--text mb-4"
            >Create a permanent link to your Dashboard configuration</h2>
            <v-card outlined class="pa-3">
                <v-row>
                    <v-col cols="12" class="pb-2 pt-4">
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
                    <v-col cols="12" class="pb-2 pt-0">
                    <h2 class="mb-3">Your interests</h2>
                    <v-combobox
                        v-model="interests"
                        :items="interestOptions"
                        type="button"
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
                    <v-col cols="12" class="pb-2 pt-0">
                    <h2 class="mb-3">Your name</h2>
                        <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        placeholder="Name"
                        required
                        outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-2 pt-0">
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
                    <v-col cols="12" class="pb-0 pt-0">
                    <v-checkbox
                        v-model="privacyConsent"
                        :rules="privacyRules"
                        required>
                        <template v-slot:label>
                        I have read and acepted the
                        <a @click.stop href='/privacy' target="_blank">
                            Privacy Notice and Consent Form
                        </a>
                        </template>
                    </v-checkbox>
                    </v-col>
                    <v-col cols="12" class="pb-2 pt-0">
                    <v-checkbox
                        v-model="newsletterOptIn">
                        <template v-slot:label>
                        I want to stay up-to-date about {{ appConfig
                            && appConfig.branding.appName }} via newsletter
                        </template>
                    </v-checkbox>
                    </v-col>
                </v-row>
            </v-card>
            </v-card-text>
            <v-card-text class="text-center" v-else>
            <h2
                class="display-2 font-weight-light primary--text mb-3"
            > {{ dashboardConfig && dashboardConfig.title }}</h2>
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
                        ? 'Read-only link to your Dashboard'
                        : 'Read-only link to this Dashboard'"
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
            <v-card-actions v-else>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="popupOpen = false" x-large>Close</v-btn>
            </v-card-actions>
        </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data: () => ({
    isEnabled: true,
  }),
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),

  },
  methods: {

  },
};
</script>
