<template>
  <v-btn-toggle  mandatory style="border-radius: 0px; height:32px"
    background-color="#1E4B5F" color="primary"
  borderless v-model="$store.state.gtif.toolsToggle">
  <v-tooltip bottom>
    <template #activator="{on}">
      <v-btn :value="true" @click="navToExplore()"
        style="height:32px" v-on="on"
        :color=" $store.state.gtif.toolsToggle ? 'secondary' : 'background' ">
        <div style="width: 30px; height: 30px;" >
          <svg width="100%" height="100%" viewBox="0 0 143 107" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;">
            <g transform="matrix(1.04646,0,0,1.04646,-3.3241,-2.47853)">
            <g>
              <path d="M60.46,36.19L63.88,27.95L68.9,29.62C70.29,27.67 71.98,26.01 73.87,24.66L72.2,19.64L80.45,16.22L82.82,20.95C85.11,20.57 87.48,20.55 89.84,20.95L92.21,16.22L100.45,19.64L98.78,24.66C100.73,26.05 102.39,27.74 103.74,29.63L108.76,27.96L112.18,36.2L107.45,38.57C107.83,40.86 107.85,43.23 107.45,45.59L112.18,47.96L108.76,56.2L103.74,54.53C102.35,56.48 100.66,58.14 98.77,59.49L100.44,64.51L92.2,67.93L89.83,63.2C87.54,63.58 85.17,63.6 82.81,63.2L80.44,67.93L72.19,64.51L73.86,59.49C71.91,58.1 70.25,56.41 68.9,54.52L63.88,56.19L60.46,47.95L65.19,45.58C64.81,43.29 64.79,40.92 65.19,38.56L60.46,36.19Z" :style="`fill:none;fill-rule:nonzero;stroke:${$store.state.gtif.toolsToggle ? 'background':'#1E4B5F' };stroke-width:3px;`"/>
              <path d="M78.4,45.35C80.21,49.72 85.22,51.79 89.59,49.98C93.96,48.17 96.04,43.16 94.23,38.79C92.42,34.42 87.41,32.35 83.04,34.16C78.67,35.97 76.59,40.98 78.4,45.35Z" :style="`fill:none;fill-rule:nonzero;stroke:${$store.state.gtif.toolsToggle ? 'background':'#1E4B5F' };stroke-width:3px;`"/>
              <path d="M53.75,40.05C52.5,37.04 49.05,35.61 46.04,36.86C43.03,38.11 41.6,41.56 42.85,44.57C43.37,45.82 44.26,46.79 45.35,47.42" :style="`fill:none;fill-rule:nonzero;stroke:${$store.state.gtif.toolsToggle ? 'background':'#1E4B5F' };stroke-width:3px;`"/>
              <path d="M31.72,68.54L34.06,62.9L38.42,64.71C39.3,63.48 40.36,62.43 41.56,61.58L39.75,57.22L45.39,54.88L47.2,59.24C48.65,59 50.14,58.99 51.63,59.24L53.44,54.88L59.08,57.22L57.27,61.58C58.5,62.46 59.55,63.52 60.4,64.72L64.76,62.91L67.1,68.55L62.74,70.36C62.98,71.81 62.99,73.3 62.74,74.79L67.1,76.6L64.76,82.24L60.4,80.43C59.52,81.66 58.46,82.71 57.26,83.56L59.07,87.92L53.43,90.26L51.62,85.9C50.17,86.14 48.68,86.15 47.19,85.9L45.38,90.26L39.74,87.92L41.55,83.56C40.32,82.68 39.27,81.62 38.42,80.42L34.06,82.23L31.72,76.59L36.08,74.78C35.84,73.33 35.83,71.84 36.08,70.35L31.72,68.54Z" :style="`fill:none;fill-rule:nonzero;stroke:${$store.state.gtif.toolsToggle ? 'background':'#1E4B5F' };stroke-width:3px;`"/>
              <path d="M37.98,50.53L33.8,52.56L31.17,47.16L35.35,45.13C35.03,43.72 34.93,42.26 35.09,40.78L30.7,39.26L32.66,33.59L37.05,35.11C37.84,33.85 38.82,32.76 39.94,31.85L37.91,27.67L43.31,25.04L45.34,29.22C46.75,28.9 48.21,28.8 49.69,28.96L51.21,24.57L56.88,26.53L55.36,30.92" :style="`fill:none;fill-rule:nonzero;stroke:${$store.state.gtif.toolsToggle ? 'background':'#1E4B5F' };stroke-width:3px;`"/>
              <path d="M43.92,70.3C42.67,73.33 44.1,76.8 47.13,78.05C50.16,79.3 53.63,77.87 54.88,74.84C56.13,71.81 54.7,68.34 51.67,67.09C48.65,65.83 45.18,67.27 43.92,70.3Z" :style="`fill:none;fill-rule:nonzero; stroke:${$store.state.gtif.toolsToggle ? 'background':'#1E4B5F' };stroke-width:3px;`"/>
            </g>
          </g>
        </svg>
      </div>
    </v-btn>
  </template>
  <span>{{!$route.name?.includes('explore') ? 'Explore Tools':'Tools Mode'}}</span>
  </v-tooltip>
  <v-tooltip bottom>
    <template #activator="{on}">
      <v-btn :value="false" style="height:32px"  v-on="on"
        :color="$store.state.gtif.toolsToggle ? 'background' : 'secondary'">
        <div style="width: 30px; height: 30px;">
          <svg width="100%" height="100%" viewBox="0 0 143 107" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
          style="fill-rule:evenodd;clip-rule:evenodd;stroke-miterlimit:10;">
          <path d="M68.65,90.25C66.72,90.25 64.49,88.63 63.37,87.1L63.25,86.93L63.1,86.8C62.73,86.46 62.01,85.89 60.66,85.12C57.43,83.26 52.39,82.28 46.09,82.28C38.32,82.28 30.94,83.75 30.63,83.81C30.35,83.87 30.07,83.9 29.79,83.9C27.79,83.9 26.35,82.4 26.35,80.34L26.35,36.9C26.35,34.57 28.25,32.67 30.58,32.67L38.21,32.67L38.21,17.18C38.21,16.94 38.37,16.73 38.6,16.66C38.66,16.64 40.19,16.22 43,16.22C45.87,16.22 50.56,16.68 56.58,18.89C60.41,20.3 66.28,23.79 69.59,27.5L71.17,29.27L72.75,27.5C76.06,23.79 81.92,20.3 85.76,18.89C91.78,16.68 96.46,16.22 99.34,16.22C102.14,16.22 103.68,16.65 103.75,16.66C103.97,16.72 104.13,16.94 104.13,17.18L104.13,32.66L112.29,32.66C114.62,32.66 116.52,34.56 116.52,36.89L116.52,80.33C116.52,81.33 116.17,82.23 115.53,82.89C114.9,83.54 114.02,83.89 113.07,83.89C112.8,83.89 112.52,83.86 112.25,83.8C110.91,83.54 104.09,82.27 96.78,82.27C90.48,82.27 85.43,83.25 82.2,85.11C80.73,85.96 80.02,86.54 79.74,86.82L79.6,86.95L79.5,87.1C78.38,88.63 76.15,90.25 74.22,90.25L68.65,90.25ZM46.08,81.2C52.66,81.2 57.74,82.2 61.19,84.18C63.53,85.52 64.11,86.3 64.17,86.38C65.23,87.88 67.26,89.16 68.62,89.17L74.21,89.17C75.59,89.15 77.63,87.88 78.68,86.38C78.74,86.29 79.33,85.52 81.67,84.17C85.11,82.19 90.2,81.19 96.78,81.19C104.56,81.19 111.68,82.59 112.47,82.75L112.68,82.79L113.08,82.81C113.75,82.81 114.35,82.56 114.78,82.11C115.2,81.69 115.44,81.05 115.44,80.32L115.44,36.9C115.44,35.16 114.02,33.74 112.28,33.74L104.12,33.74L104.12,70.68C104.12,70.84 104.06,70.98 103.94,71.08C103.84,71.17 103.71,71.22 103.58,71.22C103.44,71.21 103.04,71.18 102.32,71.18C100.32,71.18 94.76,71.45 86.32,73.96C79.86,75.88 75.49,79.37 73.15,81.25C72.29,81.94 71.7,82.4 71.34,82.48L70.98,82.48C70.62,82.4 70.03,81.94 69.17,81.25C66.82,79.37 62.46,75.89 56,73.96C47.56,71.45 42,71.18 40,71.18C39.33,71.18 38.95,71.21 38.86,71.21L38.82,71.21C38.6,71.21 38.48,71.16 38.39,71.07C38.28,70.97 38.21,70.82 38.21,70.68L38.21,33.74L30.58,33.74C28.84,33.74 27.42,35.16 27.42,36.9L27.42,80.9L27.76,81.71L28.37,82.77L29.73,82.85L29.99,82.85L30.39,82.76C31.18,82.6 38.3,81.2 46.08,81.2ZM99.34,17.29C96.55,17.29 92,17.74 86.13,19.9C80.04,22.14 72.52,27.91 71.77,30.93L71.71,31.18L71.71,80.85L75.07,78.43C78.63,75.86 82.22,74.06 86.03,72.92C93.03,70.84 98.05,70.25 101.02,70.12L103.05,70.04L103.05,17.5L101.08,17.36C100.59,17.32 100,17.29 99.34,17.29ZM43,17.29C42.34,17.29 41.75,17.31 41.25,17.35L39.28,17.49L39.28,70.04L41.31,70.12C44.28,70.25 49.3,70.83 56.3,72.92C60.11,74.06 63.7,75.86 67.26,78.43L70.62,80.85L70.62,31.1L70.56,30.86C69.87,27.95 62.22,22.11 56.2,19.9C50.34,17.74 45.79,17.29 43,17.29Z"
          :style="`fill:${$store.state.gtif.toolsToggle ? '#1E4B5F':'background' };fill-rule:nonzero;stroke:${$store.state.gtif.toolsToggle ? '#1E4B5F':'background' };stroke-width:3px;`"/>
        </svg>
      </div>
    </v-btn>
  </template>
  <span>Narratives Mode</span>
  </v-tooltip>
</v-btn-toggle>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'NarrativesToolsToggle',
  data() {
    return {

    };
  },
  methods: {
    ...mapMutations('indicators', {
      setSelectedIndicator: 'SET_SELECTED_INDICATOR',
    }),
    ...mapActions('gtif', [
      'setCurrentDomain',
    ]),
    navToExplore() {
      if (!this.$route.path.includes('explore')) {
        this.$router.push('/explore');
      } else {
        // We use the button as "reset" function
        this.setCurrentDomain(null);
        this.setSelectedIndicator(null);
        window.postMessage({
          command: 'map:reset',
        });
      }
    },
  },
};
</script>

<style scoped>
.background.background {
  background-color: white !important;
  opacity: 1;
}
</style>
