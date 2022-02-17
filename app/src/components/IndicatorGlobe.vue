<template>
  <div
    ref="container"
    id="cesiumContainer"
    style="height: 100%; width: 100%; position: relative;"
  >
    <!-- Loader -->
    <div
      v-if="!loaded"
      class="fill-height d-flex align-center justify-center"
      style="width: 100%; position: absolute; z-index: 1;"
    >
      <div
        class="fill-height"
        style="width: 100%; position: absolute; background: var(--v-background-base); opacity: 0.3"
      ></div>
      <div class="sk-fold">
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
      </div>
    </div>
    <!-- End loader -->
  </div>
</template>

<script>
/* eslint no-undef: "off" */
export default {
  name: 'Globe',
  props: [
    'currentIndicator',
  ],
  data: () => ({
    viewer: null,
    loaded: false,
  }),
  computed: {
    indicatorObject() {
      return this.currentIndicator
        || this.$store.state.indicators.selectedIndicator;
    },
  },
  mounted() {
    if (!window.cesiumLoaded) {
      const isDev = process.env.NODE_ENV !== 'production';
      const CESIUM_URL = `https://cdn.jsdelivr.net/npm/cesium@1.90.0/Build/${isDev
        ? 'CesiumUnminified/'
        : 'Cesium/'}`;

      const cesiumStyle = document.createElement('link');
      cesiumStyle.href = `${CESIUM_URL}Widgets/widgets.css`;
      cesiumStyle.rel = 'stylesheet';
      document.head.appendChild(cesiumStyle);

      const cesiumScript = document.createElement('script');
      cesiumScript.async = true;
      cesiumScript.src = `${CESIUM_URL}Cesium.js`;
      document.head.appendChild(cesiumScript);
      window.cesiumLoaded = true;
      cesiumScript.onload = () => {
        this.createGlobe();
      };
    } else {
      this.createGlobe();
    }
  },
  methods: {
    createGlobe() {
      const imageryProvider = (id) => {
        // TODO use @/config/layers
        // TODO implement dynamic creation
        let imagery;
        if (!id) {
          imagery = new Cesium.WebMapTileServiceImageryProvider({
            url: 'https://tiles.maps.eox.at/wmts/1.0.0/terrain-light/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
            layer: 'terrain-light',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'WGS84',
            maximumLevel: 12,
            tilingScheme: new Cesium.GeographicTilingScheme({
              numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1,
            }),
            credit: new Cesium.Credit('{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }'),
          });
        } else {
          // WorldCO-N1 example
          imagery = new Cesium.UrlTemplateImageryProvider({
            url: '//obs.eu-nl.otc.t-systems.com/s5p-pal-nl-l3-external/maps/{time}/{z}/{x}/{reverseY}.png',
            maximumLevel: 5,
            customTags: {
              // TODO dynamic date
              time: () => 's5p-l3-co/3day/2021/07/001-20210730-20210801-20210804',
            },
          });
          imagery.defaultAlpha = 0.6;
        }
        return imagery;
      };
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: imageryProvider(),
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        creditContainer: null,
        animation: false,
        skyBox: false,
        skyAtmosphere: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      });
      // TODO actually check which layers are used
      this.viewer.imageryLayers.addImageryProvider(imageryProvider('WorldCO-N1'));
      this.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
      this.viewer.scene.fog.enabled = false;
      this.viewer.scene.globe.showGroundAtmosphere = false;
      this.viewer.scene.globe.tileLoadProgressEvent.addEventListener((queued) => {
        if (queued === 0) {
          this.loaded = true;
        }
      });
    },
  },
};
</script>

<style scoped>
::v-deep .cesium-widget-credits {
    display:none !important;
}
</style>
