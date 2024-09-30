<template>
  <div class="species-list mt-3">
    <p>
      These are the species found in biodiversity hotspots for the chosen area.
      <br>
      Click on the images to enlarge them and learn more about each species.
    </p>
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
          <dd>({{ s.common_name }})</dd>
        </a>
        <div class="d-flex row align-center" style="max-width: 80px">
          <div
            :title="s.conservation_status"
            :class="`iucn ${s.conservation_status}`"
            :style="{
              background: getIucnBackgroundColor(s.conservation_status),
              color: getIucnTextColor(s.conservation_status),
          }">
            {{ getIucnShorthand(s.conservation_status) }}
          </div>
          <span v-if="s.count > 1" class="count">
            {{ s.count }}
          </span>
        </div>
      </div>
    </dl>
    <p>The conservation status indicates how endangered each species is.</p>
    <img
      style="max-width: 60%; margin: 0 20%;"
      src="iucn_status.svg"
      alt="IUCN Endangered Species Index legend"
    />
  </div>
</template>

<script>
export default {
  props: {
    species: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getIucnBackgroundColor(conservationStatus) {
      switch (conservationStatus) {
        case 'least concern':
          return '#006666';
        case 'near threatened':
          return '#006666';
        case 'vulnerable':
          return '#CC9900';
        case 'endangered':
          return '#CC6633';
        case 'critically endangered':
          return '#CC3333';
        case 'extinct in the wild':
          return '#000';
        case 'extinct':
          return '#000';
        default:
          return '#777';
      }
    },

    getIucnShorthand(conservationStatus) {
      switch (conservationStatus) {
        case 'least concern':
          return 'LC';
        case 'near threatened':
          return 'NT';
        case 'vulnerable':
          return 'VU';
        case 'endangered':
          return 'EN';
        case 'critically endangered':
          return 'CR';
        case 'extinct in the wild':
          return 'EW';
        case 'extinct':
          return 'EX';
        default:
          return 'LC';
      }
    },

    getIucnTextColor(conservationStatus) {
      switch (conservationStatus) {
        case 'least concern':
          return '#fff';
        case 'near threatened':
          return '#fffb';
        case 'vulnerable':
          return '#fffb';
        case 'endangered':
          return '#fffb';
        case 'critically endangered':
          return '#fffb';
        case 'extinct in the wild':
          return '#fff';
        case 'extinct':
          return '#CC3333';
        default:
          return '#777';
      }
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

.iucn {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: 600;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
</style>
