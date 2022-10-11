import { DateTime } from 'luxon';
import store from '@/store';
import getLocationCode from '@/mixins/getLocationCode';

// let appConfig;
let baseConfig;

const generateUsedTimes = (indicator) => {
  const replaceMapTimes = baseConfig.replaceMapTimes
    && baseConfig.replaceMapTimes[getLocationCode(indicator)];
  const additionalMapTimes = baseConfig.additionalMapTimes
    && baseConfig.additionalMapTimes[getLocationCode(indicator)];
  const excludeMapTimes = baseConfig.excludeMapTimes
    && baseConfig.excludeMapTimes[getLocationCode(indicator)];

  let times = indicator.time;
  let eoSensor = Array.isArray(indicator.eoSensor) && indicator.eoSensor;
  let inputData = Array.isArray(indicator.inputData) && indicator.inputData;
  let colorCode = Array.isArray(indicator.colorCode) && indicator.colorCode;
  // completely replace given times or eoSensor
  if (replaceMapTimes && Array.isArray(replaceMapTimes.time)) {
    times = replaceMapTimes.time;
  }
  if (replaceMapTimes && Array.isArray(replaceMapTimes.eoSensor)) {
    eoSensor = replaceMapTimes.eoSensor; // just for display
  }
  if (replaceMapTimes && Array.isArray(replaceMapTimes.inputData)) {
    inputData = replaceMapTimes.inputData;
    // needs to be used unless indicator.display is used (that overrides it)
  }
  if (replaceMapTimes && Array.isArray(replaceMapTimes.colorCode)) {
    colorCode = replaceMapTimes.colorCode;
  }
  if (additionalMapTimes) {
    // add additional times and eoSensor to original arrays
    // sort time ascending and sort arrays based on time array via helper list combining all
    const dtObjects = additionalMapTimes.time.map((t) => DateTime.fromISO(t));
    const mergedTimes = times.concat(dtObjects);
    const mergedSensors = eoSensor.concat(additionalMapTimes.eoSensor);
    const mergedInputData = inputData.concat(additionalMapTimes.inputData);
    const mergedColorCode = colorCode.concat(additionalMapTimes.colorCode);
    // combine the arrays
    const list = [];
    for (let j = 0; j < mergedTimes.length; j++) {
      list.push({
        time: mergedTimes[j],
        eoSensor: mergedSensors[j],
        inputData: mergedInputData[j],
        colorCode: mergedColorCode[j],
      });
    }
    // sort mapping by time asc
    list.sort((a, b) => (a.time.toMillis() - b.time.toMillis()));
    // separate them back out
    for (let k = 0; k < list.length; k++) {
      mergedTimes[k] = list[k].time;
      mergedSensors[k] = list[k].eoSensor;
      mergedInputData[k] = list[k].inputData;
      mergedColorCode[k] = list[k].colorCode;
    }
    times = mergedTimes;
    eoSensor = mergedSensors;
    inputData = mergedInputData;
    colorCode = mergedColorCode;
  }
  if (excludeMapTimes && Array.isArray(excludeMapTimes)) {
    // exclude times and respective entries from other arrays
    const dtObjects = excludeMapTimes.map((t) => DateTime.fromISO(t));
    const indToDelete = times.reduce((a, e, i) => {
      // find if any time is in to be deleted
      const found = dtObjects.find((time) => time.toMillis() === e.toMillis());
      if (typeof found !== 'undefined') {
        // add its index to list
        a.push(i);
      }
      return a;
    }, []);
    // set items in all arrays to null
    indToDelete.forEach((i) => {
      times[i] = null;
      if (typeof eoSensor[i] !== 'undefined') {
        eoSensor[i] = null;
      }
      if (typeof inputData[i] !== 'undefined') {
        inputData[i] = null;
      }
      if (typeof colorCode[i] !== 'undefined') {
        colorCode[i] = null;
      }
    });
    // filter out nulls
    times = times.filter((e) => e !== null);
    eoSensor = eoSensor.filter((e) => e !== null);
    inputData = inputData.filter((e) => e !== null);
    colorCode = colorCode.filter((e) => e !== null);
  }
  return {
    time: times, eoSensor, inputData, colorCode,
  };
};

const configFromInputData = (usedTimes, index) => {
  // const i = this.getCurrentIndex(side);
  const inputData = usedTimes.inputData.length === 1
    ? usedTimes.inputData[0]
    : usedTimes.inputData[index];
  if (baseConfig.layerNameMapping.hasOwnProperty(inputData)) { // eslint-disable-line
    let config = baseConfig.layerNameMapping[inputData];
    if (!Array.isArray(config)) {
      // assure array is returned
      config = [config];
    }
    return config;
  }
  // empty config used later for merging
  return [];
};

const mergedConfigs = (usedTimes, side = 'data', inputDataConfig, indicatorObject) => {
  // first check if special compare layer configured
  let displayTmp = side === 'compare'
    && indicatorObject.compareDisplay
    ? indicatorObject.compareDisplay
    : indicatorObject.display;
  // following configuration merging is done:
  // defaultLayersDisplay (to avoid having to configure it before)
  // indDefinition - indicator code specific configuration
  // display - coming from js configuration - esa.js OR
  // configFromInputData - coming from input data reference from csvs
  if (displayTmp) {
    // from layer configuration
    if (!Array.isArray(displayTmp)) {
      // always make an Array of layer configurations
      displayTmp = [displayTmp];
    }
    if (side === 'data') {
      displayTmp[0].searchid = displayTmp[0].dataSearchId;
    } else {
      displayTmp[0].searchid = displayTmp[0].compareSearchId;
    }
    if (typeof displayTmp[0].searchid === 'undefined') {
      displayTmp[0].searchid = '';
    }
  }
  const finalConfigs = [];
  let usedConfigForMerge = {};
  let name = indicatorObject.description;

  if (!displayTmp && inputDataConfig.length === 0) {
    // no additional config specified, use defaults
    usedConfigForMerge = [{ name }];
  } else if (!displayTmp) {
    // use configFromInputData
    usedConfigForMerge = inputDataConfig;
  } else {
    // use displayTmp even if configFromInputData set too
    usedConfigForMerge = displayTmp;
  }
  usedConfigForMerge.forEach((item) => {
    // merge configs for each layer
    name = item.name || name;
    // Check to see if we have grouped layers, if we do we need to add
    // the default to them too
    const extendedItem = item;

    const indDefinition = baseConfig.indicatorsDefinition[
      indicatorObject.indicator
    ];
    if (Object.keys(item).indexOf('combinedLayers') !== -1) {
      for (let i = 0; i < item.combinedLayers.length; i += 1) {
        extendedItem.combinedLayers[i] = {
          ...baseConfig.defaultLayersDisplay,
          ...indDefinition,
          ...item.combinedLayers[i],
        };
      }
    }
    finalConfigs.push({
      ...baseConfig.defaultLayersDisplay,
      ...indDefinition,
      ...extendedItem,
      name,
      usedTimes,
    });
  });
  return finalConfigs;
};

const createConfigFromIndicator = (indicatorObject, side, index) => {
  // appConfig = store.state.config.appConfig;
  baseConfig = store.state.config.baseConfig;
  const usedTimes = generateUsedTimes(indicatorObject);
  const inputDataConfig = configFromInputData(usedTimes, index);
  return mergedConfigs(usedTimes, side, inputDataConfig, indicatorObject);
};

const getTimeLabel = (time, config) => {
  // Check if custom function was configured
  if (config[0].labelFormatFunction) {
    return config[0].labelFormatFunction(time);
  }
  // If not try default approach
  if (Array.isArray(time) && time.length === 2) {
    // show start - end
    if (config[0].mapTimeLabelExtended) {
      return time.map((d) => DateTime.fromISO(d).toISO({ suppressMilliseconds: true })).join(' - ');
    }
    return time.map((d) => DateTime.fromISO(d).toISODate()).join(' - ');
  } else if (time instanceof DateTime) { // eslint-disable-line no-else-return
    if (config[0].mapTimeLabelExtended) {
      return time.toISO({ suppressMilliseconds: true });
    }
    return time.toISODate();
  }
  if (config[0].mapTimeLabelExtended) {
    return DateTime.fromISO(time).toISO({ suppressMilliseconds: true });
  }
  return DateTime.fromISO(time).toISODate();
};

const createAvailableTimeEntries = (indicatorObject, config) => {
  const usedTimes = generateUsedTimes(indicatorObject);
  const selectionOptions = [];
  for (let i = 0; i < usedTimes.time.length; i += 1) {
    let label = getTimeLabel(usedTimes.time[i], config);
    if (usedTimes.eoSensor) {
      const eoSensor = usedTimes.eoSensor.length === 1
        ? usedTimes.eoSensor[0]
        : usedTimes.eoSensor[i];
      label += ` - ${eoSensor}`;
    }
    selectionOptions.push({
      value: usedTimes.time[i],
      name: label,
    });
  }
  return selectionOptions;
};

const indicatorHasMapData = (indicatorObject) => {
  baseConfig = store.state.config.baseConfig;
  let hasMapData = false;
  if (indicatorObject) {
    let matchingInputDataAgainstConfig = [];
    // Check to see if we have EO Data indicator
    const { inputData } = generateUsedTimes(indicatorObject);
    if (inputData) {
      matchingInputDataAgainstConfig = inputData
        .filter((item) => Object.prototype.hasOwnProperty.call(baseConfig.layerNameMapping, item));
      hasMapData = matchingInputDataAgainstConfig.length > 0;
    }
    // Check to see if we have global data indicator
    if (indicatorObject && indicatorObject.country) {
      if (indicatorObject.country === 'all' || Array.isArray(indicatorObject.country)) {
        hasMapData = true;
      }
    }
  }
  return hasMapData;
};

export {
  createConfigFromIndicator,
  createAvailableTimeEntries,
  indicatorHasMapData,
  generateUsedTimes,
};
