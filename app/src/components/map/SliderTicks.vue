<template>
  <div class="fill-width d-flex justify-center">
    <svg
      ref="svg"
      :style="`width: ${width}px; height: 10px;`"
      :viewBox="`-1 0 ${width + 2} ${height}`"
    >
      <line
        v-for="(line, index) in lines"
        :key="index"
        :x1="line"
        :y1="height - 6"
        :x2="line"
        :y2="height"
        stroke="#7596A2"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SliderTicks',
  props: {
    numLines: {
      type: Number,
      default: 235,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      height: 6,
    };
  },
  computed: {
    lines() {
      const num = this.numLines > (this.width / 2)
        ? (this.width / 2)
        : this.numLines;

      const spacing = this.width / (num - 1);
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
      this.height = this.$refs.svg.clientHeight;
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
