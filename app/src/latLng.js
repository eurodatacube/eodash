export default function latLng(latLonArray) {
  return Object.freeze({
    lat: latLonArray[0],
    lon: latLonArray[1],
  });
}
