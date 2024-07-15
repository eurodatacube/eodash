<template>
  <dl>
    <div
      class="species v-row"
      v-for="s in species"
      :key="s.species"
      style="margin-bottom: 16px;"
    >
      <img
        v-if="s.image_url && /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(s.image_url)"
        :src="s.image_url"
      />

      <div
        v-else
        class="placeholder"
      >?</div>

      <a :href="s.image_url" class="names" target="_blank">
        <dt><b>{{ s.species.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()) }}</b></dt>
        <dd v-if="s.common_name !== 'Unknown'">({{ s.common_name }})</dd>
      </a>

      <span v-if="s.count > 1" class="count">{{ s.count }}</span>
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
.species {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  min-width: 280px;

  img, .placeholder {
    height: 64px;
    width: 64px;
    border-radius: 4px;
    margin-right: 12px;
    border: 2px solid #99a;
  }

  .placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    background: #00417011;
  }

  .names {
    width: 200px;
    font-size: 15px;
  }
}

.count {
  height:22px;
  padding: 0 9px;
  border-radius: 11px;
  margin-left: 9px;
  background: #00417044;
  color: #004170;
}
</style>
