import { DateTime } from 'luxon';
import store from '@/store';
import getLocationCode from '@/mixins/getLocationCode';

// let appConfig;
let baseConfig;

const generateUsedTimes = (indicator) => {
  baseConfig = store.state.config.baseConfig;
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
  if (!usedTimes.inputData) {
    return [];
  }
  const inputData = usedTimes.inputData.length === 1
    ? usedTimes.inputData[0]
    : usedTimes.inputData.at(index);
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

const mergedConfigs = (usedTimes, inputDataConfig, indicatorObject) => {
  // first check if special compare layer configured
  let displayTmp = indicatorObject.display;
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
  }
  const finalConfigs = [];
  let usedConfigForMerge = [];
  let { name } = indicatorObject;

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

    const indDefinition = baseConfig.indicatorsDefinition[
      indicatorObject.indicator
    ];
    // get if features is defined in the merged object
    const mergedObject = {
      ...baseConfig.defaultLayersDisplay,
      ...indDefinition,
      ...item,
      indicator: indicatorObject.indicator,
      aoiID: indicatorObject.aoiID,
      name,
      usedTimes,
    };
    if (Object.keys(mergedObject).indexOf('features') !== -1) {
      // destructure the features property as a new layer config to keep
      // backwards compatibility but remove need for layer groups on bottom-most level
      const { features: _, ...itemWithoutFeatureConfig } = mergedObject;
      if (mergedObject.features.name) {
        mergedObject.name = mergedObject.features.name;
      }
      finalConfigs.push(itemWithoutFeatureConfig);
    }
    finalConfigs.push(mergedObject);
  });
  return finalConfigs;
};

const createConfigFromIndicator = (indicatorObject, index) => {
  baseConfig = store.state.config.baseConfig;
  const usedTimes = generateUsedTimes(indicatorObject);
  const inputDataConfig = configFromInputData(usedTimes, index);
  return mergedConfigs(usedTimes, inputDataConfig, indicatorObject);
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
