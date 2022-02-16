
// eslint-disable-next-line import/prefer-default-export
export function getColor(indObj, vm) {
  let color;
  if (indObj) {
    if (Object.prototype.hasOwnProperty.call(indObj, 'lastColorCode')
      && !['', '/'].includes(indObj.lastColorCode)) {
      color = vm.getIndicatorColor(indObj.lastColorCode);
    }
    if (Object.prototype.hasOwnProperty.call(indObj, 'indicator')
      && ['N1', 'N1a', 'N1b', 'N3b', 'E8', 'E12b', 'C1', 'C2', 'C3'].includes(indObj.indicator)) {
      color = vm.getIndicatorColor('BLUE');
      if (indObj.aoi === null) {
        color = 'black';
      }
    }
  }
  return color;
}
