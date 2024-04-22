<template>
  <dl>
    <div v-for="s in species" :key="s.species" style="margin-bottom: 20px;">
      <dt><b>{{ s.species }}</b></dt>
      <dd v-if="s.common_name !== 'Unknown'">({{ s.common_name }})</dd>
    </div>
  </dl>
</template>

<script>
function isWithinBounds(point, bbox) {
  const [minX, minY, maxX, maxY] = bbox;
  return point[0] >= minX && point[0] <= maxX && point[1] >= minY && point[1] <= maxY;
}

export default {
  props: {
    bbox: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      species: [],
    };
  },
  async mounted() {
    if (this.bbox.length !== 4) {
      console.error('Bounding box must be in format [minLong, minLat, maxLong, maxLat]!');
      return;
    }
    // Get wildlife species index
    const r1 = await fetch('./data/ideas/species_index.json');
    const speciesIndex = await r1.json();

    // Get locations of species
    const r2 = await fetch('https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/Europe_characteristic_species.geojson');
    const speciesLocations = await r2.json();

    this.species = speciesLocations.features
      .filter((point) => isWithinBounds(point.geometry.coordinates, this.bbox))
      .flatMap((point) => point.properties.species_indices)
      .map((index) => speciesIndex.find((species) => species.index === index))
      .filter((species) => species != null); // Filter out any undefined or null values
  },
};
</script>

<style lang="scss" scoped>
</style>
