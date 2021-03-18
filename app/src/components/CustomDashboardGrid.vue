<template>
<v-row class="pb-10">
    <template
      v-for="(element, index) in features"
    >
      <v-col v-if="!element.indicatorObject" :key="index" cols="12">
        Error: {{ element }}
      </v-col>
      <v-col
        v-else
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        style="position: relative;"
      >
        <span> {{ element.title }} </span>
        <v-card
          class="pa-0"
          style="height: 500px"
          outlined
          tile
        >
          <indicator-map
            ref="indicatorMap"
            style="top: 0px; position: absolute;"
            v-if="(['all'].includes(element.indicatorObject.country) ||
            Array.isArray(element.indicatorObject.country)) && !element.includesIndicator"
            class="pt-0 fill-height"
            :currentIndicator="element.indicatorObject"

          />
          <indicator-data
            style="top: 0px; position: absolute;"
            v-else
            class="pa-5 chart"
            :currentIndicator="element.indicatorObject"
          />
        </v-card>
        <template v-if="enableEditing">
          <div class="buttonContainer containerTop" v-show="!popupOpen">
            <v-btn
              class="my-2"
              :style="element.width > 1 ? 'background: white' : 'background: white;visibility: hidden'"
              fab
              outlined
              x-small
              color="primary"
              @click="resizeFeatureShrink(element)"
            >
              <v-icon dark>
                mdi-arrow-collapse
              </v-icon>
            </v-btn>
            <v-btn
              class="my-2"
              :style="element.width < 4 ? 'background: white' : 'background: white;visibility: hidden'"
              fab
              outlined
              x-small
              color="primary"
              @click="resizeFeatureExpand(element)"
            >
              <v-icon dark>
                mdi-arrow-expand
              </v-icon>
            </v-btn>
            <v-btn
              class="my-2"
              fab
              outlined
              x-small
              color="primary"
              style="background: white"
              @click="removeFeature(element)"
            >
              <v-icon dark>
                mdi-delete
              </v-icon>
            </v-btn>
          </div>
          <div class="buttonContainer containerBottom" v-show="!popupOpen">
            <v-btn
              v-if="index > 0"
              class="my-2"
              fab
              dark
              x-small
              color="primary"
              @click="moveFeatureUp(element)"
            >
              <v-icon dark>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              v-if="index < features.length - 1"
              class="my-2"
              fab
              dark
              x-small
              color="primary"
              @click="moveFeatureDown(element)"
            >
              <v-icon dark>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
        </template>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';
import { loadIndicatorData } from '@/utils';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  props: {
    enableEditing: Boolean,
    popupOpen: Boolean,
  },
  components: {
    IndicatorData,
    IndicatorMap,
  },
  data: () => ({
    features: [],
  }),
  computed: {
    ...mapGetters('dashboard', {
      vuexFeatures: 'features'
    }),
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
  },
  watch: {
    vuexFeatures: {
      immediate: true,
      deep: true,
      async handler(features) {
        if(!features) return;
        this.features = await Promise.all(features.map(async (f) => {
          if(f.includesIndicator) return f;

          const feature = this.$store.state.features.allFeatures
            .find((i) => this.getLocationCode(i.properties.indicatorObject) === f.poi);
          const indicatorObject = await loadIndicatorData(
            this.baseConfig,
            feature.properties.indicatorObject,
          );
          return {
            ...f,
            indicatorObject,
          };
        }));
      }
    },
  },
  methods: {
    ...mapActions('dashboard', [
      'removeFeature',
      'addMarketingInfo',
      'resizeFeatureShrink',
      'resizeFeatureExpand',
      'moveFeatureUp',
      'moveFeatureDown',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  position: absolute;
  right: -3px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
.containerTop {
  top: 10%;
}
.containerBottom {
  bottom: 10%;
}
.chart {
  background: #fff;
}
</style>
