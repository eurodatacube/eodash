export default function getLocationCode(object) {
  // We either have only an indicator with an ID or a feature that has indicator and aoi IDs
  let locationCode;
  if ('aoiID' in object && 'indicator' in object) {
    locationCode = `${object.aoiID}-${object.indicator}`;
  } else if ('indicator' in object) {
    locationCode = `World-${object.indicator}`;
  }
  return locationCode;
}
