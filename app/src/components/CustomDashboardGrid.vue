<template>
<v-row class="pb-10">
    <template
      v-for="(element, index) in features"
    >
      <v-col v-if="!element.indicatorObject && !element.text" :key="index" cols="12">
        Error: {{ element }}
      </v-col>
      <v-col
        v-else
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        style="position: relative;"
      >
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on }">
            <div class="d-flex align-center">
              <span v-if="element.title" @click="redirectToPoi(element.indicatorObject)" style="cursor: pointer"> {{ element.title }} </span>
              <v-icon @click="featureTitle = element.title" v-on="on" right small style="cursor: pointer">mdi-pencil</v-icon>
            </div>
          </template>

          <v-card>
            <v-card-title class="headline grey lighten-2">
              Choose title for custom indicator
            </v-card-title>

            <v-card-text>
              <v-text-field
                placeholder="Title"
                filled
                dense
                v-model="featureTitle"
                class="mt-10"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                cancel
              </v-btn>
              <v-btn
                color="success"
                @click="changeFeatureTitleFn(element.poi, featureTitle)"
                :disabled="!featureTitle.length"
              >
                change
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card
          class="pa-0"
          style="height: 500px"
          outlined
          tile
        >
          <div class="pa-5" v-if="element.text" v-html="element.__generatedText__"></div>
          <indicator-map
            ref="indicatorMap"
            style="top: 0px; position: absolute;"
            v-else-if="(['all'].includes(element.indicatorObject.country) ||
            Array.isArray(element.indicatorObject.country)) && !element.includesIndicator"
            class="pt-0 fill-height"
            :currentIndicator="element.indicatorObject"
            :centerProp="localCenter[element.poi]"
            :zoomProp="localZoom[element.poi]"
            @update:center="c => localCenter[element.poi] = c"
            @update:zoom="z => localZoom[element.poi] = z"
            @ready="onMapReady(element.poi)"
          />
          <indicator-data
            style="top: 0px; position: absolute;"
            v-else
            class="pa-5 chart"
            :currentIndicator="element.indicatorObject"
          />
        </v-card>
        <template v-if="enableEditing">
          <div class="buttonContainer containerRight containerTop" v-show="!popupOpen && !dialog">
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
              dark
              x-small
              color="error"
              style="background: white"
              @click="removeFeature(element)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="my-2"
                  fab
                  outlined
                  x-small
                  color="primary"
                  style="background: white"
                  @click="update(element)"
                  v-if="element.mapInfo || element.text"
                >
                  <v-icon v-if="element.mapInfo" dark>
                    mdi-map-outline
                  </v-icon>
                  <v-icon v-else dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="element.mapInfo">Update map position</span>
              <span v-else>Update text</span>
            </v-tooltip>
          </div>
          <div class="buttonContainer containerRight containerBottom" v-show="!popupOpen && !dialog">
            <v-btn
              :style="index > 0 ? '' : 'visibility: hidden'"
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
              :style="index < features.length - 1 ? '' : 'visibility: hidden'"
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
    dialog: false,
    featureTitle: '',
    localZoom: {},
    localCenter: {},
    serverZoom: {},
    serverCenter: {},
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
        this.features = await Promise.all(features.map(async (f) => {
          if(f.includesIndicator || f.text) return f;

          const feature = this.$store.state.features.allFeatures
            .find((i) => this.getLocationCode(i.properties.indicatorObject) === f.poi);
          const indicatorObject = await loadIndicatorData(
            this.baseConfig,
            feature.properties.indicatorObject,
          );

          if(f.mapInfo) {
            this.$set(this.localZoom, f.poi, f.mapInfo.zoom)
            this.$set(this.localCenter, f.poi, f.mapInfo.center)
            this.$set(this.serverZoom, f.poi, f.mapInfo.zoom)
            this.$set(this.serverCenter, f.poi, f.mapInfo.center)
          }

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
      'changeFeatureTitle',
      'changeFeatureMapInfo'
    ]),
    onMapReady(poi) {
      setTimeout(() => {
        this.localCenter[poi].lat = this.serverCenter[poi].lat;
        this.localCenter[poi].lng = this.serverCenter[poi].lng;
        this.localZoom[poi] = this.serverZoom[poi];
      }, 1000)
    },
    // updateMapPositionChanged(poi) {
    //   if(
    //     !this.localZoom[poi] ||
    //     !this.localCenter[poi] ||
    //     !this.serverZoom[poi] ||
    //     !this.serverCenter[poi]
    //   ) return this.mapPositionChanged[poi] = false

    //   return this.mapPositionChanged[poi] = this.localZoom[poi] !== this.serverZoom[poi] || this.localCenter[poi].lat !== this.serverCenter[poi].lat || this.localCenter[poi].lng !== this.serverCenter[poi].lng;
    // },
    update(el) {
      if(el.mapInfo) {
        return this.changeFeatureMapInfo({
          poi: el.poi,
          zoom: this.localZoom[el.poi],
          center: this.localCenter[el.poi]
        })
      }

      if(el.text) this.$emit('updateTextFeature', el)
    },
    redirectToPoi(indicatorObject) {
      this.$router.push(`/?poi=${this.getLocationCode(indicatorObject)}`);
    },
    changeFeatureTitleFn(poi, newTitle) {
      this.dialog = false;
      this.changeFeatureTitle({poi, newTitle});
    }
  }
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
.containerRight {
  right: -3px;
}
.containerLeft {
  left: -3px;
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
