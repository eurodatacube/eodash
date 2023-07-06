<template>
  <div class="fill-width d-flex justify-center">
    <svg
      ref="svg"
      :style="`width: ${width}px; height: 20px;`"
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

      <text
        v-for="(year, index) in yearMarks"
        :key="`y${index}`"
        :x="year.position"
        :y="height - 10"
        fill="#333"
        font-size="12"
        weight="600"
      >
        {{ year.label }}
      </text>
    </svg>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'SliderTicks',
  props: {
    width: {
      type: Number,
      required: true,
    },
    times: {
      type: Array,
      required: true,
    }
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

    numLines () {
      return this.times.length;
    },

    yearMarks() {
      const yearIndices = [];
      let lastYear = null;

      // Calculate first and last dates as fractions of a year
      const firstTime = DateTime.fromISO(this.times[0].value);
      const firstYear = firstTime.year + (firstTime.ordinal / 365);
      const lastTime = DateTime.fromISO(this.times[this.times.length - 1].value);
      const lastTimeYear = lastTime.year + (lastTime.ordinal / 365);

      // Calculate the total range in fractions of a year
      const totalYears = lastTimeYear - firstYear;

      this.times.forEach((time, i) => {
        const currentTime = DateTime.fromISO(time.value);
        const currentTimeYear = currentTime.year + (currentTime.ordinal / 365);

        if (Math.floor(currentTimeYear) !== lastYear) {
          yearIndices.push({
            label: Math.floor(currentTimeYear),
            position: ((currentTimeYear - firstYear) / totalYears) * this.width
          });
          lastYear = Math.floor(currentTimeYear);
        }
      });

      return yearIndices;
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
