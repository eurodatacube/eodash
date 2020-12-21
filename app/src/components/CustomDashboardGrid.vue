<template>
  <v-container style="background: #fff">
    <h1 class="display-2 font-weight-light primary--text mt-7 mb-5">
      Test Custom Dashboard</h1>
    <v-row>
      <v-col
        v-for="(element, index) in elements"
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        style="position: relative;"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          <iframe
            class="item"
            :src="`https://race.esa.int/iframe?poi=${element.poi}`"
            width="100%"
            height="500px"
            frameBorder="0"
            scroll="no"
            style="overflow:hidden"
          ></iframe>
        </v-card>
        <div class="buttonContainer containerTop">
          <v-btn
            v-if="element.width > 1"
            class="my-2"
            style="background: white"
            fab
            outlined
            x-small
            color="primary"
            @click="resizeSmaller(element)"
          >
            <v-icon dark>
              mdi-arrow-collapse
            </v-icon>
          </v-btn>
          <v-btn
            v-if="element.width < 4"
            class="my-2"
            style="background: white"
            fab
            outlined
            x-small
            color="primary"
            @click="resizeLarger(element)"
          >
            <v-icon dark>
              mdi-arrow-expand
            </v-icon>
          </v-btn>
        </div>
        <div class="buttonContainer containerBottom">
          <v-btn
            v-if="index > 0"
            class="my-2"
            fab
            dark
            x-small
            color="primary"
            @click="moveLower(element)"
          >
            <v-icon dark>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            v-if="index < elements.length - 1"
            class="my-2"
            fab
            dark
            x-small
            color="primary"
            @click="moveHigher(element)"
          >
            <v-icon dark>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    elements: [
      {
        width: 4,
        poi: 'TR3-N1b'
      },
      {
        width: 4,
        poi: 'GCAQ1-N1b'
      },
      {
        width: 4,
        poi: 'ES7-E1'
      },
      {
        width: 4,
        poi: 'ES62a-E10a6'
      },
    ],
  }),
  methods: {
    resizeSmaller(element) {
      this.elements.find(e => e.poi === element.poi).width -= 1;
    },
    resizeLarger(element) {
      this.elements.find(e => e.poi === element.poi).width += 1;
    },
    moveLower(element) {
      this.arrayMove(this.elements, this.elements.indexOf(element), this.elements.indexOf(element) - 1);
    },
    moveHigher(element) {
      this.arrayMove(this.elements, this.elements.indexOf(element), this.elements.indexOf(element) + 1);
    },
    arrayMove(arr, old_index, new_index) {
      if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
              arr.push(undefined);
          }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    },
  }
}
</script>

<style lang="scss" scoped>
.buttonContainer {
  position: absolute;
  right: -3px;
  display: flex;
  flex-direction: column;
}
.containerTop {
  top: 10%;
}
.containerBottom {
  bottom: 10%;
}
</style>