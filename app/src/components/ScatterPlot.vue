<template>
  <v-col>
    <v-card>
      <canvas ref="plot" id="scatterplot" width="400" height="400"></canvas>
    </v-card>
  </v-col>
</template>
<script>
import getMapInstance from '@/components/map/map';
import { fromUrl } from 'geotiff';
import createScatterplot from 'regl-scatterplot';
import { scaleLinear } from 'd3-scale';

export default {
  props: {
    filters: Object,
  },
  mounted() {
    const canvas = this.$refs.plot;
    const { width, height } = canvas.getBoundingClientRect();
    const xScale = scaleLinear();
    const yScale = scaleLinear();
    this.scatterplot = createScatterplot({
      canvas,
      width,
      height,
      pointSize: 10,
      xScale,
      yScale,
      colorBy: 'valueA',
    });

    // read the color map from the TIFF color table
    (async () => {
      // build a color map if it does not yet exist
      const colorImage = await (await this.tiffs.color).getImage();
      const colorMap = colorImage.fileDirectory.ColorMap;
      const pointColor = [];
      const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16).toUpperCase()
        return hex.length === 1 ? '0' + hex : hex
      }).join('');
      for (let i = 0; i < colorMap.length; ++i) {
        const r = colorMap[i + 0];
        const g = colorMap[i + 1];
        const b = colorMap[i + 1];
        // convert from Uint16 to RGB hex
        pointColor.push(rgbToHex(Math.round(r / 256), Math.round(g / 256), Math.round(b / 256)));
      }
      console.log(pointColor);
      this.scatterplot.set({ pointColor });
    })();

    // this.scatterplot.subscribe('view', ({ xScale, yScale }) => {
    //   console.log(xScale.domain(), yScale.domain());
    // });

    // make listener for map moving
    const { map } = getMapInstance('centerMap');
    map.on('moveend', () => {
      this.bbox = map.getView().calculateExtent();
    });
  },
  data() {
    const { map } = getMapInstance('centerMap');
    return {
      bbox: map.getView().calculateExtent(),
      tiffs: {
        x: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerDensity_Austria_3857_COG_fix_clipped.tif"),
        y: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/WSF_EucDist_Austria_3857_COG_fix.tif"),
        color: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/ESA_WorldCover_10m_COG_3857_fix.tif"),
        slope: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Slope_3857_fix.tif"),
        elevation: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_DSM_COG_10m_3857_fix.tif"),
        energyGridDistance: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif"),
      },
      rasters: null,
    };
  },
  watch: {
    bbox: 'readRasters',
    rasters: 'render',
    'filters.elevation.range': 'render',
    'filters.slope.range': 'render',
    'filters.energyGridDistance.range': 'render',
    'filters.settlementDistance.range': 'render',
  },
  methods: {
    async readRasters() {
      const { bbox } = this;
      const xTiff = await this.tiffs.x;
      const yTiff = await this.tiffs.y;
      const colorTiff = await this.tiffs.color;
      const slopeTiff = await this.tiffs.slope;
      const elevationTiff = await this.tiffs.elevation;
      const energyGridDistanceTiff = await this.tiffs.energyGridDistance;

      const { map } = getMapInstance('centerMap');
      let [width, height] = map.getSize();

      // Scale down
      // TODO: remove!
      width /= 4;
      height /= 4;

      const [
        xData,
        yData,
        colorData,
        slopeData,
        elevationData,
        energyGridDistanceData,
      ] = await Promise.all([
        xTiff.readRasters({
          bbox,
          width,
          height,
          fillValue: NaN,
          interleave: true,
        }),
        yTiff.readRasters({
          bbox,
          width,
          height,
          fillValue: NaN,
          interleave: true,
        }),
        colorTiff.readRasters({
          bbox,
          width,
          height,
          interleave: true,
        }),
        slopeTiff.readRasters({
          bbox,
          width,
          height,
          interleave: true,
        }),
        elevationTiff.readRasters({
          bbox,
          width,
          height,
          interleave: true,
        }),
        energyGridDistanceTiff.readRasters({
          bbox,
          width,
          height,
          interleave: true,
        }),
      ]);

      // only set the data if the bounding box is the same
      if (bbox === this.bbox) {
        this.rasters = {
          xData,
          yData,
          colorData,
          slopeData,
          elevationData,
          energyGridDistanceData,
        };
      }
    },
    async render() {
      console.log("Rendering!");
      if (this.rasters === null) {
        console.log("No data set!", this.bbox);
        return;
      }

      // unpack data
      const {
        xData,
        yData,
        colorData,
        slopeData,
        elevationData,
        energyGridDistanceData,
      } = this.rasters;

      // roughly scale X/Y values to fit with scatterplot (whose values must be approximately -1/1)
      const xScale = scaleLinear().domain([0, 500]).range([-1, 1]);
      const yScale = scaleLinear().domain([0, 200]).range([-1, 1]);

      const elevationRange = this.filters.elevation.range;
      const slopeRange = this.filters.slope.range;
      const energyGridDistanceRange = this.filters.energyGridDistance.range;
      const settlementDistanceRange = this.filters.settlementDistance.range;

      const data = [];
      for (let i = 0; i < xData.length; ++i) {
        const x = xData[i];
        const y = yData[i];
        const color = colorData[i];
        const elevation = elevationData[i];
        const slope = slopeData[i];
        const energyGridDistance = energyGridDistanceData[i];

        // apply filtering. Skip invalid values and filtered values
        if (
          (Number.isNaN(x) || Number.isNaN(y))
          || (x === 0 && y === 0)
          || (elevation < elevationRange[0] || elevation > elevationRange[1])
          || (slope < slopeRange[0] || slope > slopeRange[1])
          || (energyGridDistance < energyGridDistanceRange[0] || energyGridDistance > energyGridDistanceRange[1])
          || (y < settlementDistanceRange[0] || y > settlementDistanceRange[1])
        ) {
          continue;
        }
        data.push([xScale(x), yScale(y), color, 50]);
      }
      console.log(data);
      this.scatterplot.draw(data);
    },
  },
};

</script>
