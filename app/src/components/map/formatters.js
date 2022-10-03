// eslint-disable-next-line import/prefer-default-export
// TODO remove as probably not needed any longer
export function formatLabel(indicatorObject, vm) {
  let label = '(coming soon)';
  if (Object.prototype.hasOwnProperty.call(indicatorObject, 'lastIndicatorValue') || Object.prototype.hasOwnProperty.call(indicatorObject, 'lastMeasurement')) {
    label = 'Latest value: ';
    const indVal = indicatorObject.lastIndicatorValue !== '' ? indicatorObject.lastIndicatorValue : indicatorObject.lastMeasurement;
    if (['E10a1', 'E10a5'].includes(indicatorObject.indicator)) {
      const percVal = Number((indVal * 100).toPrecision(4));
      if (percVal > 0) {
        label += `+${percVal}%`;
      } else {
        label += `${percVal}%`;
      }
    } else if (['E8'].includes(indicatorObject.indicator)) {
      label = indVal.toPrecision(3);
    } else if (['E10a3', 'E10a8', 'E10a9', 'N4c'].includes(indicatorObject.indicator)) {
      label += 'multiple';
    } else if (['E10a6', 'E10a7'].includes(indicatorObject.indicator)) {
      const newIndVal = Number(indicatorObject.lastMeasurement).toPrecision(4);
      label += `${newIndVal}%`;
    } else if (['N1', 'N3b', 'N1b', 'E12b', 'C1', 'C2', 'C3', 'E10a10'].includes(indicatorObject.indicator)) {
      label = '';
    } else if (indicatorObject.indicator === 'OX') {
      switch (indicatorObject.lastIndicatorValue) {
        case 'Red (Low)':
          label = 'Very low';
          break;
        case 'Orange (Low)':
          label = 'Low';
          break;
        case 'Green':
          label = 'Regular';
          break;
        case 'Orange (High)':
          label = 'High';
          break;
        case 'Red (High)':
          label = 'Very High';
          break;
        default:
          label = '';
      }
    } else if (indVal === null) {
      label = null;
    } else {
      label += indVal;
    }
  }

  // Overwrite label if archived
  if (indicatorObject.updateFrequency && indicatorObject.updateFrequency.toLowerCase() === 'archived') {
    label = 'Archived';
  }
  return {
    city: indicatorObject.city,
    indicator: vm.baseConfig.indicatorsDefinition[indicatorObject.indicator]
      .indicatorOverwrite || indicatorObject.indicatorName,
    label,
  };
}
