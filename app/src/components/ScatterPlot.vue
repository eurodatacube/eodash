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
// import graphly from 'graphly';
import createScatterplot from 'regl-scatterplot';
import { scaleLinear } from 'd3-scale';

export default {
  mounted() {
    const canvas = this.$refs.plot;
    const { width, height } = canvas.getBoundingClientRect();
    const xScale = scaleLinear().domain([200, 500]);
    const yScale = scaleLinear().domain([0, 200]);
    this.scatterplot = createScatterplot({
      canvas,
      width,
      height,
      pointSize: 500,
      xScale,
      yScale,
      colorBy: 'valueA',
    });

    this.render();
    const { map } = getMapInstance('centerMap');
    map.on('moveend', () => {
      this.bbox = map.getView().calculateExtent();
    });
  },
  data() {
    const { map } = getMapInstance('centerMap');
    return {
      bbox: map.getView().calculateExtent(),
      rasters: {
        x: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerDensity_Austria_3857_COG_fix_clipped.tif"),
        y: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/WSF_EucDist_Austria_3857_COG_fix.tif"),
        color: fromUrl("https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/ESA_WorldCover_10m_COG_3857_fix.tif"),
      },
    };
  },
  watch: {
    bbox() {
      this.render();
    },
    cogFilters(oldValue, newValue) {
      console.log("cogFilters", oldValue, newValue);
    },
  },
  methods: {
    async render() {
      console.log("Rendering!", this.bbox, this.cogFilters);
      const ctx = this.$refs.plot;
      if (this.rasters === null) {
        console.log("No data set!", this.bbox);
        return;
      }
      const xTiff = await this.rasters.x;
      const yTiff = await this.rasters.y;
      const colorTiff = await this.rasters.color;

      const { map } = getMapInstance('centerMap');
      let [width, height] = map.getSize();
      width /= 4;
      height /= 4;

      const xData = (await xTiff.readRasters({ bbox: this.bbox, width, height }))[0];
      const yData = (await yTiff.readRasters({ bbox: this.bbox, width, height }))[0];
      const colorData = (await colorTiff.readRasters({ bbox: this.bbox, width, height }))[0];

      const colorImage = await colorTiff.getImage();
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
        pointColor.push(rgbToHex(Math.round(r / 256), Math.round(g / 256), Math.round(b / 256)));
        // pointColor.push(`#${Math.round(r / 256).toString(16)}${Math.round(g / 256).toString(16)}${Math.round(b / 256).toString(16)}`);
      }
      console.log(pointColor);
      this.scatterplot.set({ pointColor });

      console.log(colorImage)
      // console.log(xData, yData);
      const data = [];
      for (let i = 0; i < xData.length; ++i) {
        // data.push({ x: xData[i], y: yData[i] });
        data.push([xData[i], yData[i], colorData[i], 50]);
      }
      console.log(data)



    //   const points = [
    //   [1, 1, 0, 0, 0],
    //   [2, 2, 0, 0, 0],
    //   [3, 3, 0, 0, 1],
    //   [4, 4, 0, 0, 1],
    //   [5, 5, 0, 0, 0],
    // ];
      this.scatterplot.draw(data);


      // const graph = new graphly.graphly({
      //   el: '#graph',
      //   renderSettings: {
      //     xAxis: 'parameter1',
      //     yAxis: ['parameter2', 'parameter3'],
      //     y2Axis: ['parameter4'],
      //   },
      //   filterManager: null
      // });

      // console.log(data)
      // const myChart = new Chart(ctx, {
      //   type: 'scatter',
      //   data: {
      //     datasets: [{
      //       label: 'Scatter Dataset',
      //       data,
      //       backgroundColor: 'rgb(255, 99, 132)',
      //     }],
      //   },
      //   options: {
      //     scales: {
      //       x: {
      //         type: 'linear',
      //         position: 'bottom',
      //       },
      //     },
      //   },
      // });
    },
  },
};

</script>
