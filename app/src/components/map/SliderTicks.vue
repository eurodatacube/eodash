<template>
  <div class="fill-width d-flex justify-center">
    <svg
      ref="svg"
      :style="`width: ${width}px; height: 30px;`"
      :viewBox="`-1 0 ${width + 2} ${height}`"
    >
      <line
        v-for="(line, index) in lines"
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
      const yearIndices = [];
      let lastDecade = null;
      let lastYear = null;

      // Calculate first and last dates as fractions of a year
      const firstTime = DateTime.fromISO(this.times[0].value);
      const firstYear = firstTime.year + (firstTime.ordinal / 365);
      const lastTime = DateTime.fromISO(this.times[this.times.length - 1].value);
      const lastTimeYear = lastTime.year + (lastTime.ordinal / 365);

      // Calculate the total range in fractions of a year
      const totalYears = lastTimeYear - firstYear;

      // If the total range of years crosses a certain threshold (e.g., 10 years),
      // we will show marks for every decade.
      const showDecades = totalYears > 10;

      this.times.forEach((time) => {
        const currentTime = DateTime.fromISO(time.value);
        const currentTimeYear = currentTime.year + (currentTime.ordinal / 365);

        if (showDecades) {
          // If we are in a new decade, place a mark
          const currentDecade = Math.floor(currentTimeYear / 10) * 10;
          if (currentDecade !== lastDecade) {
            yearIndices.push({
              label: currentDecade,
              position: ((currentTimeYear - firstYear) / totalYears) * this.width,
            });
            lastDecade = currentDecade;
          }
        } else {
          // If we are in a new year, place a mark
          const currentYear = Math.floor(currentTimeYear);
          if (currentYear !== lastYear) {
            yearIndices.push({
              label: currentYear,
              position: ((currentTimeYear - firstYear) / totalYears) * this.width,
            });
            lastYear = currentYear;
          }
        }
      });

      // Create a new array with removed overlapping labels
      const nonOverlappingYearIndices = yearIndices.filter((yearMark, index, array) => {
        // If it's the last item in the array, it can't overlap with a next item
        if (index === array.length - 1) return true;

        // Get the next item in the array
        const nextYearMark = array[index + 1];

        // Determine the distance between the current and next labels
        const distance = nextYearMark.position - yearMark.position;

        // Only keep this label if it's more than a certain distance from the next one
        const minDistance = 50; // set this to the minimum acceptable distance
        return distance > minDistance;
      });

      return nonOverlappingYearIndices;
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
