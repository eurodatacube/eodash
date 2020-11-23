// based on https://github.com/barryong/vue-dialog-mixin

import Vue from 'vue';
import store from '@/store';

// dialogStore module
const dialogStore = {
  namespaced: true,
  state: () => ({ dialogs: {} }),
  mutations: {
    SHOW_DIALOG(state, dialog) {
      Vue.set(state.dialogs, dialog, true);
    },
    HIDE_DIALOG(state, dialog) {
      if (state.dialogs[dialog]) Vue.set(state.dialogs, dialog, false);
    },
    DELETE_DIALOG(state, dialog) {
      Vue.delete(state.dialogs, dialog);
    },
  },
};
if (!store.hasModule('dialog')) store.registerModule('dialog', dialogStore);

// window.onpopstate
const onpopstate = (e) => {
  if (e.state && e.state.hasDialog) {
    store.commit('dialog/HIDE_DIALOG', e.state.dialog);
  }
};
if (window.onpopstate !== onpopstate) window.onpopstate = onpopstate;

export default {
  data() {
    return {
      dialogName: `_${Math.random().toString(36).substr(2, 9)}`,
      dialog: false,
    };
  },
  methods: {
    showDialog() {
      this.$store.commit('dialog/SHOW_DIALOG', this.dialogName);
    },
    closeDialog() {
      this.$store.commit('dialog/HIDE_DIALOG', this.dialogName);
    },
  },
  computed: {
    dialogState() {
      return this.$store.state.dialog.dialogs[this.dialogName];
    },
  },
  watch: {
    dialogState(newValue) {
      this.dialog = !!newValue;
    },
    dialog(newValue) {
      if (newValue === true) {
        const hs = window.history.state ? window.history.state : {};
        hs.hasDialog = true;
        hs.dialog = this.dialogName;
        window.history.replaceState(hs, '');
        window.history.pushState(null, '');
        this.showDialog();
      } else if (newValue === false) {
        this.$store.commit('dialog/DELETE_DIALOG', this.dialogName);
        setTimeout(() => {
          this.$emit('close');
          const hs = window.history.state ? window.history.state : {};
          if (!('hasDialog' in hs && hs.dialog === this.dialogName)) window.history.go(-1);
          hs.hasDialog = false;
          hs.dialog = '';
          window.history.replaceState(hs, '');
        }, 300); // 20200814 - Fix animation not working when the modal is closed
      }
    },
  },
};
