import Chart from 'chart.js';
import 'chartjs-adapter-luxon'; // eslint-disable-line no-unused-vars

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

const log10 = Math.log10 || function tmp(x) {
  const exponent = Math.log(x) * log10E; // log10E = 1 / Math.LN10.
  // Check for whole powers of 10,
  // which due to floating point rounding error should be corrected.
  const powerOf10 = Math.round(exponent);
  const isPowerOf10 = x === 10 ** powerOf10;

  return isPowerOf10 ? powerOf10 : exponent;
};

function finiteOrDefault(value, def) {
  return Number.isFinite(value) ? value : def;
}

function isMajor(tickVal) {
  const remain = tickVal / (10 ** Math.floor(log10(tickVal)));
  return remain === 1;
}

function generateTicks(generationOptions, dataRange) {
  const endExp = Math.floor(log10(dataRange.max));
  const endSignificand = Math.ceil(dataRange.max / (10 ** endExp));
  const ticks = [];
  let tickVal = finiteOrDefault(generationOptions.min, (10 ** Math.floor(log10(dataRange.min))));
  let exp = Math.floor(log10(tickVal));
  let significand = Math.floor(tickVal / (10 ** exp));
  let precision = exp < 0 ? (10 ** Math.abs(exp)) : 1;

  do {
    ticks.push({ value: tickVal, major: isMajor(tickVal) });

    ++significand;
    if (significand === 10) {
      significand = 1;
      ++exp;
      precision = exp >= 0 ? 1 : precision;
    }

    tickVal = Math.round(significand * (10 ** exp) * precision) / precision;
  } while (exp < endExp || (exp === endExp && significand < endSignificand));

  const lastTick = finiteOrDefault(generationOptions.max, tickVal);
  ticks.push({ value: lastTick, major: isMajor(tickVal) });

  return ticks;
}

class MyLogScale extends Chart.Scale {
  _parse(raw, index) { // eslint-disable-line no-unused-vars
    const value = LinearScaleBase.prototype._parse.apply(this);
    if (value === 0) {
      return undefined;
    }
    return Number.isFinite(value) && value > 0 ? value : NaN;
  }

  determineDataLimits() {
    const me = this;
    const { min, max } = me.options;
    me.min = Number.isFinite(min) ? Math.max(0, min) : 0.1;
    me.max = Number.isFinite(max) ? Math.max(0, max) : 10;
    me.handleTickRangeOptions();
  }

  handleTickRangeOptions() {
    const me = this;
    const DEFAULT_MIN = 1;
    const DEFAULT_MAX = 10;
    let { min, max } = me;

    if (min === max) {
      if (min <= 0) { // includes null
        min = DEFAULT_MIN;
        max = DEFAULT_MAX;
      } else {
        min = (10 ** Math.floor(log10(min)) - 1);
        max = (10 ** Math.floor(log10(max)) + 1);
      }
    }
    if (min <= 0) {
      min = (10 ** Math.floor(log10(max)) - 1);
    }
    if (max <= 0) {
      max = (10 ** Math.floor(log10(min)) + 1);
    }
    me.min = min;
    me.max = max;
  }

  buildTicks() {
    const me = this;
    const opts = me.options;

    const generationOptions = {
      min: me._userMin,
      max: me._userMax,
    };
    const ticks = generateTicks(generationOptions, me);
    let reverse = !me.isHorizontal();

    if (opts.reverse) {
      reverse = !reverse;
      me.start = me.max;
      me.end = me.min;
    } else {
      me.start = me.min;
      me.end = me.max;
    }
    if (reverse) {
      ticks.reverse();
    }
    return ticks;
  }

  getPixelForTick(index) {
    const ticks = this._ticks;
    if (index < 0 || index > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index].value);
  }

  _configure() {
    const me = this;
    const start = me.min;

    Chart.Scale.prototype._configure.call(me);

    me._startValue = log10(start);
    me._valueRange = log10(me.max) - log10(start);
  }

  getPixelForValue(value) {
    const me = this;
    let currVal = value;
    if (value === undefined || value === 0) {
      currVal = me.min;
    }
    return me.getPixelForDecimal(currVal === me.min
      ? 0
      : (log10(currVal) - me._startValue) / me._valueRange);
  }

  getValueForPixel(pixel) {
    const me = this;
    const decimal = me.getDecimalForPixel(pixel);
    return (10 ** me._startValue + decimal * me._valueRange);
  }
}

const defaultConfig = {
  // label settings
  ticks: {
    callback: Chart.Ticks.formatters.logarithmic,
    major: {
      enabled: false,
    },
    offset: 50,
  },
};

Chart.scaleService.registerScaleType('myLogScale', MyLogScale, defaultConfig);
Chart.plugins.register([ChartAnnotation, ChartZoomPlugin, showZeroPlugin]);
