export default function getLocationCode(indicatorObject, featureObject) {
  const featureObjectProperties = featureObject
    ? featureObject.indicatorObject : null;
  return (featureObjectProperties?.aoiID && indicatorObject?.indicator)
    ? `${
      featureObjectProperties.aoiID
    }-${
      indicatorObject.indicator
    }`
    : undefined;
}
