
import Chart from 'chart.js';

/* Plugin autoregisters so does not need to be registered */
import ChartDataLabels from 'chartjs-plugin-datalabels'; // eslint-disable-line no-unused-vars

import * as ChartAnnotation from 'chartjs-plugin-annotation';
import * as ChartZoomPlugin from 'chartjs-plugin-zoom';

/**
 * Used to show a small bar on the chart if the value is 0
 *
 * @type Object
 */
const showZeroPlugin = {
  beforeRender: function beforeRender(chartInstance) {
    const { datasets } = chartInstance.config.data;
    for (let i = 0; i < datasets.length; i += 1) {
      const meta = datasets[i]._meta;
      // It counts up every time you change something on the chart so
      // this is a way to get the info on whichever index it's at
      const metaData = meta[Object.keys(meta)[0]];
      const bars = metaData.data;
      for (let j = 0; j < bars.length; j += 1) {
        const model = bars[j]._model;
        if (metaData.type === 'horizontalBar' && model.base === model.x) {
          model.x = model.base + 2;
        } else if (model.base === model.y) {
          model.y = model.base - 2;
        }
      }
    }
  },
};

Chart.plugins.register([ChartAnnotation, ChartZoomPlugin, showZeroPlugin]);
