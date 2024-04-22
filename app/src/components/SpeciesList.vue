<template>
  <dl>
    <div v-for="s in species" :key="s.species" style="margin-bottom: 20px;">
      <dt><b>{{ s.species }}</b></dt>
      <dd v-if="s.common_name !== 'Unknown'">({{ s.common_name }})</dd>
    </div>
  </dl>
</template>
  
<script>
  export default {
    props: {
      species: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>
  
<style lang="scss" scoped>
</style>
