<template>
  <div class="text-center pa-5">
    <h1 v-if="$vuetify.breakpoint.smAndUp" class="display-2 font-weight-light primary--text mb-10">
      How can we improve this dashboard?</h1>
    <v-row class="text-left">
      <v-col
        v-if="!showIssueForm || issueData"
        cols="12"
        md="4"
      >
        <v-card
          outlined
        >
          <v-card-title>
            <v-icon left color="primary">mdi-chart-line</v-icon>
            There's an issue with the displayed data
          </v-card-title>
          <v-responsive :aspect-ratio="4/1">
            <v-card-text :class="$vuetify.breakpoint.xsOnly && 'py-0'">
              <p>Is there missing or wrong data? Found a strange interpretation?
                Want to improve one of the provided descriptions or stories?</p>
            </v-card-text>
          </v-responsive>
          <v-btn
            color="primary"
            class="ml-3 mb-5"
            @click="showIssueForm = !showIssueForm; issueData = true;"
          >
            <v-icon left>mdi-pencil</v-icon>
            {{ showIssueForm ? 'close form' : 'fill out form' }}
          </v-btn>
        </v-card>
      </v-col>
      <v-col
        v-if="!showIssueForm || !issueData"
        cols="12"
        md="4"
      >
        <v-card
          outlined
        >
          <v-card-title>
            <v-icon left color="primary">mdi-bug</v-icon>
            The Dashboard does not work as expected
          </v-card-title>
          <v-responsive :aspect-ratio="4/1">
            <v-card-text :class="$vuetify.breakpoint.xsOnly && 'py-0'">
              <p>Something didn't work as expected while using the dashboard?<br />
              Good catch! Please report the bug:</p>
            </v-card-text>
          </v-responsive>
          <v-btn
            color="primary"
            class="ml-3 mb-5"
            @click="showIssueForm = !showIssueForm; issueData = false;"
          >
            <v-icon left>mdi-pencil</v-icon>
            {{ showIssueForm ? 'close form' : 'fill out form' }}
          </v-btn>
          <v-btn
            color="primary"
            outlined
            class="ml-3 mb-5"
            href="https://github.com/eurodatacube/eodash/issues"
            target="_blank"
          >
            <v-icon left>mdi-github</v-icon>
            eodash on Github
          </v-btn>
        </v-card>
      </v-col>
      <v-col
        v-if="!showIssueForm"
        cols="12"
        md="4"
      >
        <v-card
          outlined
        >
          <v-card-title>
            <v-icon left color="primary">mdi-head-question-outline</v-icon>
            Something else
          </v-card-title>
          <v-responsive :aspect-ratio="4/1">
            <v-card-text :class="$vuetify.breakpoint.xsOnly && 'py-0'">
              <p>Want to provide a different kind of feedback?<br />
              Let us know by getting in touch with us:</p>
            </v-card-text>
          </v-responsive>
          <v-btn
            v-for="handle in appConfig.feedbackTwitterHandles"
            :key="handle"
            color="#1DA1F2"
            dark
            small
            class="ml-3 mb-5"
            :href="`https://twitter.com/${handle}`"
            target="_blank"
          >
            <v-icon left>mdi-twitter</v-icon>
            {{ handle }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="showIssueForm">
      <v-col
        cols="12"
      >
        <v-card
          outlined
          class="text-left"
        >
          <v-form v-model="valid" ref="issueForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <h2>{{ issueData ? 'Data Issue' : 'Bug' }} report</h2>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="formData.title"
                    label="Issue Title"
                    outlined
                    required
                    :rules="[v => !!v || 'Required field']"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="!issueData"
                  cols="12"
                >
                  <v-text-field
                    v-model="operatingSystem"
                    label="Operating System"
                    outlined
                    required
                    :rules="[v => !!v || 'Required field']"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="!issueData"
                  cols="12"
                >
                  <v-text-field
                    v-model="affectedBrowser"
                    label="Affected Browser"
                    outlined
                    required
                    :rules="[v => !!v || 'Required field']"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="stepsToReproduce"
                    outlined
                    label="Steps to reproduce"
                    required
                    :auto-grow="true"
                    rows="3"
                    :messages="markdownMessage"
                    :rules="[v => !!v || 'Required field']"
                  >
                    <template v-slot:message="{ message }">
                      <span v-html="message"></span>
                    </template>
                  </v-textarea>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="expectedBehaviour"
                    outlined
                    :label="issueData ? 'Expected content' : 'Expected behaviour'"
                    required
                    :auto-grow="true"
                    rows="3"
                    :messages="markdownMessage"
                    :rules="[v => !!v || 'Required field']"
                  >
                    <template v-slot:message="{ message }">
                      <span v-html="message"></span>
                    </template>
                  </v-textarea>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="comments"
                    outlined
                    :label="`Contact information or additional comments (optional${!issueData
                      ? ', publicly visible'
                      : ''})`"
                    :auto-grow="true"
                    rows="3"
                    :messages="markdownMessage"
                  >
                    <template v-slot:message="{ message }">
                      <span v-html="message"></span>
                    </template>
                  </v-textarea>
                </v-col>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    @click="openPreview"
                  >
                    Preview report
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="showPreview"
      :width="$vuetify.breakpoint.xsOnly ? '90%' : '80%'"
    >
      <v-card
      >
        <v-card-title
          class="primary white--text"
          :style="$vuetify.breakpoint.xsOnly && 'position: fixed; width: 85%'"
        >{{ formData.title }}</v-card-title>
        <v-card-text
          :style="$vuetify.breakpoint.xsOnly && 'padding: 70px 0'"
        >
          <div
            v-html="formData.body"
            class="md-body pa-5"
          />
        </v-card-text>
        <v-card-actions
          :style="$vuetify.breakpoint.xsOnly && 'position: fixed; width: 85%; bottom: 5%'"
        >
          <v-spacer></v-spacer>
          <v-btn
            v-if="!message"
            link
            @click="showPreview = false"
            :disabled="disableButtons"
          >Cancel</v-btn>
          <v-btn
            v-if="!message"
            color="primary"
            @click="submitIssue"
            :disabled="disableButtons"
          >Submit</v-btn>
          <v-btn
            v-if="message"
            color="primary"
            @click="clearForm"
          >Submit another one</v-btn>
          <v-btn
            v-if="message"
            link
            @click="showPreview = false"
          >Close</v-btn>
        </v-card-actions>
        <div class="pa-5">
          <span v-if="message" class="success--text">{{ message }}</span>
          <span v-if="error" class="error--text">{{ error }}</span>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import axios from 'axios';

export default {
  data: () => ({
    issueUrl: 'https://issues-eodash.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/issues',
    issueDataUrl: 'https://issues-data.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/issues',
    issueData: false,
    showIssueForm: false,
    message: null,
    error: null,
    disableButtons: false,
    formData: {
      title: null,
      body: null,
    },
    valid: false,
    operatingSystem: null,
    affectedBrowser: null,
    stepsToReproduce: null,
    expectedBehaviour: null,
    comments: null,
    showPreview: false,
    markdownMessage: 'You can use <a href="https://guides.github.com/features/mastering-markdown/" rel="noopener" target="_blank" tabindex="-1">markdown</a>',
  }),
  computed: {
    ...mapState('config', ['appConfig']),
  },
  mounted() {
    this.detectSystem();
  },
  methods: {
    detectSystem() {
      let name = 'Not known';
      if (navigator.appVersion.indexOf('Win') !== -1) {
        name = 'Windows OS';
      }
      if (navigator.appVersion.indexOf('Mac') !== -1) {
        name = 'MacOS';
      }
      if (navigator.appVersion.indexOf('X11') !== -1) {
        name = 'UNIX OS';
      }
      if (navigator.appVersion.indexOf('Linux') !== -1) {
        name = 'Linux OS';
      }
      this.operatingSystem = name;
      this.affectedBrowser = `${this.$browserDetect.meta.name} ${this.$browserDetect.meta.version}`;
    },
    openPreview() {
      if (this.$refs.issueForm.validate()) {
        if (this.issueData) {
          this.formData.body = this.$marked(`### Environment
**App version:** ${this.$store.getters.appVersion}

**Current URL:** ${window.location}

### Steps to reproduce:
${this.stepsToReproduce}

### Expected Content:
${this.expectedBehaviour}

### Comments:
${this.comments || 'No comments'}
`);
        } else {
          this.formData.body = this.$marked(`### Environment
**App version:** ${this.$store.getters.appVersion}

**Current URL:** ${window.location}

**Operating system:** ${this.operatingSystem}

**Affected browser:** ${this.affectedBrowser}

### Steps to reproduce:
${this.stepsToReproduce}

### Expected Behaviour:
${this.expectedBehaviour}

### Contact information or additional comments (optional${!this.issueData ? ', publicly visible' : ''}):
${this.comments || 'No comments'}
`);
        }
        this.showPreview = true;
      }
    },
    async submitIssue() {
      this.disableButtons = true;
      this.message = null;
      this.error = null;
      try {
        const postUrl = this.issueData ? this.issueDataUrl : this.issueUrl;
        const response = await axios.post(postUrl,
          this.formData);
        if (response) {
          this.message = 'Success! Thanks for reporting!';
        }
      } catch (error) {
        console.log(error);
        this.error = error.message;
        this.disableButtons = false;
      }
    },
    clearForm() {
      this.showPreview = false;
      this.message = null;
      this.error = null;
      this.disableButtons = false;
      this.formData = {
        title: null,
        body: null,
      };
      this.operatingSystem = null;
      this.affectedBrowser = null;
      this.stepsToReproduce = null;
      this.expectedBehaviour = null;
      this.actualBehaviour = null;
      this.comments = null;
      this.detectSystem();
    },
  },
  watch: {
    showIssueForm(val) {
      if (!val) {
        this.clearForm();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: break-word;
}
</style>
