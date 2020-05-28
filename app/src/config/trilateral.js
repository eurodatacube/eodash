// config global variables here for now
// temporary solution
import { shTimeFunction } from '@/utils';
import moment from 'moment';

export const nasaEndpoints = [
  'https://h4ymwpefng.execute-api.us-east-1.amazonaws.com/v1/', // Air quality
  'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/', // Something else
];

export const indicatorsDefinition = Object.freeze({
  E1: {
    indicator: 'Status of metallic ores',
    class: 'economic',
  },
  E1a: {
    indicator: 'Status of non-metallic ores',
    class: 'economic',
  },
  E2: {
    indicator: 'Volume of oil stockpiled',
    class: 'economic',
  },
  E2A: {
    indicator: 'Level of flaring activity',
    class: 'economic',
  },
  E3: {
    indicator: 'Inventory levels of factory inputs',
    class: 'economic',
  },
  E4: {
    indicator: 'Production activity of intermediate goods',
    class: 'economic',
  },
  E5: {
    indicator: 'Inventory levels of intermediate goods',
    class: 'economic',
  },
  E6: {
    indicator: 'Inventory levels of factory inputs',
    class: 'economic',
  },
  E7: {
    indicator: 'Production activity of finished goods',
    class: 'economic',
  },
  E8: {
    indicator: 'Inventory Levels',
    class: 'economic',
  },
  E9: {
    indicator: 'Construction activity',
    class: 'economic',
  },
  E10a1: {
    indicator: 'Harvesting activity',
    class: 'economic',
  },
  E10a2: {
    indicator: 'Cum. proportion of total area under active mgmt.',
    class: 'economic',
  },
  E10b: {
    indicator: 'Field preparation activity',
    class: 'economic',
  },
  E11: {
    indicator: 'Volume of activity at shopping centers',
    class: 'economic',
  },
  E12a: {
    indicator: 'Volume of activity logistic interchange centers',
    class: 'economic',
  },
  E12b: {
    indicator: 'Throughput at border crossing points',
    class: 'economic',
  },
  E13a: {
    indicator: 'Throughput at principal rail stations',
    class: 'economic',
  },
  E13b: {
    indicator: 'Throughput at principal hub airports',
    class: 'economic',
  },
  H1: {
    indicator: 'Number of temp. treatment sites',
    class: 'health',
  },
  N1: {
    indicator: 'Air quality',
    class: 'environment',
  },
  N1NASA: {
    indicator: 'Air quality',
    class: 'environment',
  },
  NASAPopulation: {
    indicator: 'Air quality',
    class: 'environment',
  },
  N2: {
    indicator: 'CO2 emissions',
    class: 'environment',
  },
  N3: {
    indicator: 'CHL concentration',
    class: 'environment',
    file: '/data/trilateral/N3.csv',
  },
  N3a2: {
    indicator: 'CHL concentration',
    class: 'environment',
  },
  N4a: {
    indicator: 'Changes in land fill sites',
    class: 'environment',
  },
  N4b: {
    indicator: 'Illegal waste levels',
    class: 'environment',
  },
  d: { // dummy for locations
    indicator: 'Upcoming data',
    class: 'environment',
  },
});


export const baseLayers = [
  {
    name: 'EOxCloudless 2019',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '<a class="a-light" xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a class="a-light" xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019)',
    visible: false,
    maxNativeZoom: 15,
  },
  {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: 'Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a>',
    maxNativeZoom: 16,
    visible: true,
  },
];
export const overlayLayers = [
  {
    name: 'Overlay bright',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: 'Overlay: Data &copy; <a class="a-light" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a class="a-light" href="//eox.at">EOX</a>',
    visible: true,
    maxZoom: 14,
  },
];

export const defaultWMSDisplay = {
  baseUrl: 'https://services.sentinel-hub.com/ogc/wms/a60a37cc-dcac-40fd-a13a-501a2eb39561',
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: 'attributiontextplaceholder',
  minZoom: 7,
};
const getMonthlyDates = (start, end) => {
  let currentDate = moment(start);
  const stopDate = moment(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'months');
  }
  return dateArray;
};

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Tropospheric NO2',
        'Indicator code': 'N1',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Air Quality',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [],
        },
        'Color code': ['BLUE'],
        AOI: null,
        Time: [['2019-01-07', '2019-01-21'], ['2019-01-14', '2019-01-28'], ['2019-01-21', '2019-02-04'], ['2019-01-28', '2019-02-11'], ['2019-02-04', '2019-02-18'], ['2019-02-11', '2019-02-25'], ['2019-02-18', '2019-03-04'], ['2019-02-25', '2019-03-11'], ['2019-03-04', '2019-03-18'], ['2019-03-11', '2019-03-25'], ['2019-03-18', '2019-04-01'], ['2019-03-25', '2019-04-08'], ['2019-04-01', '2019-04-15'], ['2019-04-08', '2019-04-22'], ['2019-04-15', '2019-04-29'], ['2019-04-22', '2019-05-06'], ['2019-04-29', '2019-05-13'], ['2019-05-06', '2019-05-20'], ['2019-05-13', '2019-05-27'], ['2019-05-20', '2019-06-03'], ['2019-05-27', '2019-06-10'], ['2019-06-03', '2019-06-17'], ['2019-06-10', '2019-06-24'], ['2019-06-17', '2019-07-01'], ['2019-06-24', '2019-07-08'], ['2019-07-01', '2019-07-15'], ['2019-07-08', '2019-07-22'], ['2019-07-15', '2019-07-29'], ['2019-07-22', '2019-08-05'], ['2019-07-29', '2019-08-12'], ['2019-08-05', '2019-08-19'], ['2019-08-12', '2019-08-26'], ['2019-08-19', '2019-09-02'], ['2019-08-26', '2019-09-09'], ['2019-09-02', '2019-09-16'], ['2019-09-09', '2019-09-23'], ['2019-09-16', '2019-09-30'], ['2019-09-23', '2019-10-07'], ['2019-09-30', '2019-10-14'], ['2019-10-07', '2019-10-21'], ['2019-10-14', '2019-10-28'], ['2019-10-21', '2019-11-04'], ['2019-10-28', '2019-11-11'], ['2019-11-04', '2019-11-18'], ['2019-11-11', '2019-11-25'], ['2019-11-18', '2019-12-02'], ['2019-11-25', '2019-12-09'], ['2019-12-02', '2019-12-16'], ['2019-12-09', '2019-12-23'], ['2019-12-16', '2019-12-30'], ['2019-12-23', '2020-01-06'], ['2019-12-30', '2020-01-13'], ['2020-01-06', '2020-01-20'], ['2020-01-13', '2020-01-27'], ['2020-01-20', '2020-02-03'], ['2020-01-27', '2020-02-10'], ['2020-02-03', '2020-02-17'], ['2020-02-10', '2020-02-24'], ['2020-02-17', '2020-03-02'], ['2020-02-24', '2020-03-09'], ['2020-03-02', '2020-03-16'], ['2020-03-09', '2020-03-23'], ['2020-03-16', '2020-03-30'], ['2020-03-23', '2020-04-06'], ['2020-03-30', '2020-04-13'], ['2020-04-06', '2020-04-20'], ['2020-04-13', '2020-04-27'], ['2020-04-20', '2020-05-04'], ['2020-04-27', '2020-05-11'], ['2020-05-04', '2020-05-18']],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: '//obs.eu-de.otc.t-systems.com/s5p-pal-l3-tms/s5p-l3-tropno2/fortnight/{time}/{z}/{x}/{-y}.png',
          name: 'Tropospheric NO2',
          legendUrl: 'eodash-data/data/no2Legend.png',
          attribution: '<a href="//scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf">Sentinel data</a>, <a href="//maps.s5p-pal.com/">S5P-PAL</a>',
          dateFormatFunction: (dates) => `${moment.utc(dates[0], 'YYYY-MM-DD').format('YYYYMMDD')}-${moment.utc(dates[1], 'YYYY-MM-DD').format('YYYYMMDD')}`,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Nitrogen dioxide (NASA)',
        'Indicator code': 'N1NASA',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Nitrogen dioxide',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [],
        },
        'Color Code': ['BLUE'],
        AOI: null,
        Time: getMonthlyDates('2004-10-01', '2020-03-01'),
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: 'https://h4ymwpefng.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/OMNO2d_HRM/OMI_trno2_0.10x0.10_{time}_Col3_V4.nc.tif&resampling_method=bilinear&bidx=1&rescale=0%2C1e16&color_map=magma',
          name: 'Nitrogen dioxide (NASA)',
          attribution: '<a href="//scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf">Sentinel data</a>, <a href="//maps.s5p-pal.com/">S5P-PAL</a>',
          dateFormatFunction: (date) => `${moment.utc(date, 'YYYY-MM-DD').format('YYYYMM')}`,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Population',
        'Indicator code': 'NASAPopulation',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Population',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [],
        },
        'Color Code': ['BLUE'],
        AOI: null,
        Time: ['2020-05-14T00:00:00Z'],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GPW_Population_Density_2020/default/{time}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
          name: 'Population',
          attribution: '<a href="//scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf">Sentinel data</a>, <a href="//maps.s5p-pal.com/">S5P-PAL</a>',
          dateFormatFunction: (date) => `${moment.utc(date, 'YYYY-MM-DDTHH:mm:ssZ', true).format('YYYY-MM-DDTHH:mm:ss[Z]')}`,
        },
      },
    },
  },
];
