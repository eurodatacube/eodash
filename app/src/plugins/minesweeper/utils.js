// Function to calculate the xx th percentile
export default function getPercentile(arr, percentile) {
  // Create a copy of the array and sort the copy
  const sortedArr = [...arr].sort((a, b) => a - b);
  // Calculate the index for the given percentile
  const index = (percentile / 100) * (sortedArr.length - 1);
  // If the index is an integer, return the value at that index
  return sortedArr[Math.round(index)];
}
