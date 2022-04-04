export default function getLocationCode(indicatorObject) {
  return `${
    indicatorObject.aoiID
  }-${
    indicatorObject.indicator
  }`;
}
