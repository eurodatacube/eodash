<template>
  <v-carousel
    cycle
    height="400"
    hide-delimiter-background
    show-arrows-on-hover
  >
    <v-carousel-item
      v-for="(item, i) in items"
      :key="i"
      :src="item.src"
    >
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: '/eodash-data/general/Slide1.png',
        },
        {
          src: '/eodash-data/general/Slide2.png',
        },
        {
          src: '/eodash-data/general/Slide3.png',
        },
      ],
    };
  },
};
</script>
