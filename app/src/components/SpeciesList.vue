<template>
  <dl>
    <div v-for="s in aggregatedSpecies" :key="s.species" style="margin-bottom: 20px;">
      <dt><b>{{ s.species }}</b><span v-if="s.count > 1" class="count">{{ s.count }}</span></dt>
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
      /// Processed species with duplicates removed
      aggregatedSpecies: [],
    };
  },
  async mounted() {
    if (this.bbox.length !== 4) {
      console.error('Bounding box must be in format [minLong, minLat, maxLong, maxLat]!');
      return;
    }
    // Get wildlife species index
    const r1 = await fetch('https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/species_index.json');
    const speciesIndex = await r1.json();

    // Get locations of species
    const r2 = await fetch('https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/Europe_characteristic_species.geojson');
    const speciesLocations = await r2.json();

    this.species = speciesLocations.features
      .filter((point) => isWithinBounds(point.geometry.coordinates, this.bbox))
      .flatMap((point) => point.properties.species_indices)
      .map((index) => speciesIndex.find((species) => species.index === index))
      .filter((species) => species != null)
      .reduce((accumulator, species) => {
        // Check if the species with this index already exists in the accumulator
        if (accumulator[species.index]) {
          // If it exists, increment the count
          //
          // We have no choice but to mutate the function argument. (no-param-reassign)
          // eslint-disable-next-line
          accumulator[species.index].count++;
        } else {
          // If it does not exist, create a new entry with count initialized to 1
          //
          // eslint-disable-next-line
          accumulator[species.index] = { ...species, count: 1 };
        }
        return accumulator;
      }, {});

    this.aggregatedSpecies = Object.values(this.species);
    console.log(this.aggregatedSpecies);
  },
};
</script>

<style lang="scss" scoped>
.count {
  height:22px;
  padding: 0 9px;
  border-radius: 11px;
  margin-left: 9px;
  background: #00417044;
  color: #004170;
}
</style>
