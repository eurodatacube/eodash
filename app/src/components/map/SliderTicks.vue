<template>
  <div class="fill-width d-flex justify-center">
    <svg
      ref="svg"
      style="width: 560px; height: 10px;"
      :viewBox="`-1 0 ${svgWidth + 2} ${svgHeight}`"
    >
      <line
        v-for="(line, index) in lines"
        :key="index"
        :x1="line"
        :y1="svgHeight - 10"
        :x2="line"
        :y2="svgHeight"
        stroke="#777"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SvgComponent",
  props: {
    numLines: {
      type: Number,
      default: 280,
    },
  },
  data() {
    return {
      svgWidth: 560,
      svgHeight: 10,
    };
  },
  computed: {
    lines() {
      let spacing = this.svgWidth / (this.numLines - 1);
      return Array.from({ length: this.numLines }, (_, i) => i * spacing);
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.svgWidth = this.$refs.svg.clientWidth;
      this.svgHeight = this.$refs.svg.clientHeight;
    },
  },
  watch: {
    numLines() {
      this.handleResize();
    },
  },
};
</script>

<style scoped>
.fill-width {
  width: 100%;
  height: 100%;
}
</style>
