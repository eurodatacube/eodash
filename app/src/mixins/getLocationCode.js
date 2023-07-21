export default function getLocationCode(indicatorObject, featureObject) {
  const featureObjectProperties = featureObject
    ? featureObject.getProperties().properties.indicatorObject : null;
  return (featureObjectProperties?.aoiID && indicatorObject?.indicator)
    ? `${
      featureObjectProperties.aoiID
    }-${
      indicatorObject.indicator
    }`
    : undefined;
}
