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
    displayedLines() {
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
        let timeEntry = this.times[index].value;
        if (Array.isArray(timeEntry)) {
          [timeEntry] = timeEntry;
        }
        const currentTime = DateTime.fromISO(timeEntry);
        const currentYear = currentTime.year;

        // If it's the first tick or if the year has changed, add a year mark
        if (index === 0 || currentYear !== previousYear) {
          yearMarks.push({
            label: currentYear,
            position: line,
          });
        }

        // Update previousYear for the next iteration
        previousYear = currentYear;
      });

      // Filter out year marks that are too close together, in favor of the second one.
      return yearMarks.filter((current, i) => {
        const next = yearMarks[i + 1];
        return !(next && next.position - current.position < 20);
      });
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
