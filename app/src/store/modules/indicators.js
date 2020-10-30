/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  selectedIndicator: null,
  customAreaIndicator: null,
};

const getters = {
  getIndicatorFilteredInputData: (state) => (selectedIndicator) => {
    const indicator = selectedIndicator || { ...state.selectedIndicator };
    // filter out rows which have empty "Input Data"
    const mask = indicator.inputData.map((item) => item !== '');
    // filtering only arrays with more than 1 element to not fail on Input Data:['value'] shortcut
    if (mask.length > 1) {
      for (let [key, value] of Object.entries(indicator)) { // eslint-disable-line
        if (Array.isArray(value) && value.length > 1) {
          indicator[key] = value.filter((item, i) => mask[i]);
        }
      }
    }
    return indicator;
  },
};

const mutations = {
  SET_SELECTED_INDICATOR() {
  },
  INDICATOR_LOAD_FINISHED(state, indicatorObject) {
    state.selectedIndicator = indicatorObject;
  },
  SET_CUSTOM_AREA_INDICATOR() {
  },
  CUSTOM_AREA_INDICATOR_LOAD_FINISHED(state, indicatorObject) {
    state.customAreaIndicator = indicatorObject;
  },
};

const actions = {
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
