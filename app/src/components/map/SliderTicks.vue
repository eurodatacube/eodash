<template>
  <div class="fill-width d-flex justify-center">
    <svg
      ref="svg"
      :style="`width: ${width}px; height: 30px;`"
      :viewBox="`-1 0 ${width + 2} ${height}`"
    >
      <line
        v-for="(line, index) in displayedLines"
        :key="index"
        :x1="line"
        :y1="0"
        :x2="line"
        :y2="isYearLine(line) ? 12 : 6"
        :stroke="isYearLine(line) ? `#333` : `#7596A2`"
        :stroke-width="isYearLine(line) ? 1 : 1"
      />

      <text
        v-for="(year, index) in yearMarks"
        :key="`y${index}`"
        :x="year.position - 1"
        :y="height - 1"
        fill="#555"
        font-size="13"
        font-weight="500"
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
    times: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      height: 6,
      width: null,
    };
  },
  computed: {
    lines() {
      const spacing = this.width / (this.numLines - 1);
      return Array.from({ length: this.numLines }, (_, i) => i * spacing);
    },

    /** Lines with limited tick frequency for display purposes only */
    displayedLines () {
      const num = this.numLines > (this.width / 2)
        ? (this.width / 2)
        : this.numLines;

      const spacing = this.width / (num - 1);
      return Array.from({ length: this.numLines }, (_, i) => i * spacing);
    },

    numLines() {
      return this.times.length;
    },

    yearMarks() {
      const yearMarks = [];
      let previousYear = null;

      this.lines.forEach((line, index) => {
        const currentTime = DateTime.fromISO(this.times[index].value);
        console.log(currentTime);
        const currentYear = currentTime.year;

        console.log(`Current year: ${currentYear} | Previous year: ${previousYear}`);

        // If it's the first tick or if the year has changed, add a year mark
        if (index === 0 || currentYear !== previousYear) {
          yearMarks.push({
            label: currentYear,
            position: line // Assuming 'line' is the position of the tick
          });
        }

        // Update previousYear for the next iteration
        previousYear = currentYear;
      });

      return yearMarks;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.width = this.$el.clientWidth - 105;
    });
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.width = this.$el.clientWidth - 100;
      this.height = this.$refs.svg.clientHeight;
    },

    isYearLine(line) {
      // Check if this line's position is approximately equal to any year mark position
      const isYearMark = this.yearMarks
        .some((yearMark) => Math.abs(yearMark.position - line) < 1.0);

      return isYearMark;
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
