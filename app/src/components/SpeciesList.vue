<template>
  <dl>
    <div v-for="s in species" :key="s.species" style="margin-bottom: 16px;">
      <dt><b>{{ s.species }}</b><span v-if="s.count > 1" class="count">{{ s.count }}</span></dt>
      <dd v-if="s.common_name !== 'Unknown'">({{ s.common_name }})</dd>
    </div>
  </dl>
</template>

<script>
export default {
  props: {
    species: {
      type: Array,
      required: true,
    },
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
