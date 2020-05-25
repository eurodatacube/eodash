<template>
  <div class="text-center pa-5">
    <h1 class="display-2 font-weight-light primary--text mb-10">
      How can we improve this dashboard?</h1>
    <v-row class="text-left">
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          outlined
        >
          <v-card-title>
            <v-icon left color="primary">mdi-bug</v-icon>
            Something does not work as expected
          </v-card-title>
          <v-responsive :aspect-ratio="4/1">
            <v-card-text>
              <p>Something didn't work as expected while using the dashboard?<br />
              Good catch! Please report the bug::</p>
            </v-card-text>
          </v-responsive>
          <v-btn
            color="primary"
            class="ml-3 mb-5"
            @click="showIssueForm = !showIssueForm"
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
            <v-icon left color="primary">mdi-chart-line</v-icon>
            There's something wrong with the data
          </v-card-title>
          <v-responsive :aspect-ratio="4/1">
            <v-card-text>
              <p>Is there missing or wrong data? Found a strange interpretation?
                Want to improve one of the provided descriptions or stories?<br />
              Please let us know:</p>
            </v-card-text>
          </v-responsive>
          <v-btn
            color="primary"
            class="ml-3 mb-5"
            href="mailto:anca.anghelea@esa.int"
            target="_blank"
          >
            <v-icon left>mdi-email-outline</v-icon>
            Send email
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
            <v-card-text>
              <p>Want to provide a different kind of feedback?<br />
              Let us know by getting in touch with us:</p>
            </v-card-text>
          </v-responsive>
          <v-btn
            color="primary"
            class="ml-3 mb-5"
            href="mailto:eodash@eox.at"
            target="_blank"
          >
            <v-icon left>mdi-email-outline</v-icon>
            Send email
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
                  <h2>Bug report</h2>
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
                    label="Expected behaviour"
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
                    v-model="actualBehaviour"
                    outlined
                    label="Actual behaviour"
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
                    label="Contact information or additional comments (optional)"
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
    >
      <v-card class="pa-10">
        <v-card-title class="primary white--text">Bug report: {{ formData.title }}</v-card-title>
        <v-card-text>
          <markdown-it-vue
            :content="formData.body"
            class="pa-5"
          />
        </v-card-text>
        <v-card-actions>
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
        <span v-if="message" class="success--text">{{ message }}</span>
        <span v-if="error" class="error--text">{{ error }}</span>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import MarkdownItVue from 'markdown-it-vue';

import 'markdown-it-vue/dist/markdown-it-vue.css';

export default {
  components: {
    MarkdownItVue,
  },
  data: () => ({
    showIssueForm: false,
    message: null,
    error: null,
    disableButtons: false,
    formData: {
      title: null,
      body: null,
    },
    operatingSystem: null,
    affectedBrowser: null,
    stepsToReproduce: null,
    expectedBehaviour: null,
    actualBehaviour: null,
    comments: null,
    showPreview: false,
    markdownMessage: 'You can use <a href="https://guides.github.com/features/mastering-markdown/" rel="noopener" target="_blank" tabindex="-1">markdown</a>',
  }),
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
        this.formData.body = `### Environment
**App version:** ${this.$store.getters.appVersion}

**Operating system:** ${this.operatingSystem}

**Affected browser:** ${this.affectedBrowser}

### Steps to reproduce:
${this.stepsToReproduce}

### Expected Behaviour:
${this.expectedBehaviour}

### Actual Behaviour:
${this.actualBehaviour}

### Comments:
${this.comments || 'No comments'}
`;
        this.showPreview = true;
      }
    },
    async submitIssue() {
      this.disableButtons = true;
      this.message = null;
      this.error = null;
      try {
        const response = await axios.post('https://eodash-issues.0c0a0ef4-8d0d-4e70-b002-033c7cbb41fd.hub.eox.at/issues',
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
};
</script>
