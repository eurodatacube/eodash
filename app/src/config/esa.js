// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import { latLng } from 'leaflet';
import { shTimeFunction } from '@/utils';
import moment from 'moment';

export const indicatorsDefinition = Object.freeze({
  E1: {
    indicator: 'Status of metallic ores',
    class: 'economic',
    file: '/eodash-data/data/E1.csv',
  },
  E1a: {
    indicator: 'Status of non-metallic ores',
    class: 'economic',
    file: '/eodash-data/data/E1a.csv',
  },
  E2: {
    indicator: 'Volume of oil stockpiled',
    class: 'economic',
    file: '/eodash-data/data/E2.csv',
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
    file: '/eodash-data/data/E4.csv',
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
    file: '/eodash-data/data/E8.csv',
  },
  E9: {
    indicator: 'Construction activity',
    class: 'economic',
  },
  E10a1: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    file: '/eodash-data/data/E10a1.csv',
  },
  E10a2: {
    indicator: 'Cum. proportion of total area under active mgmt.',
    class: 'agriculture',
    file: '/eodash-data/data/E10a2.csv',
  },
  E10b: {
    indicator: 'Field preparation activity',
    class: 'agriculture',
  },
  E11: {
    indicator: 'Volume of activity at shopping centers',
    class: 'economic',
    file: '/eodash-data/data/E11.csv',
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
    externalData: {
      label: 'Sentinel-5p Mapping Service',
      url: 'https://maps.s5p-pal.com',
    },
  },
  N2: {
    indicator: 'CO2 emissions',
    class: 'environment',
  },
  N3: {
    indicator: 'CHL concentration',
    class: 'environment',
    file: '/eodash-data/data/N3.csv',
  },
  N3a2: {
    indicator: 'CHL concentration',
    class: 'environment',
  },
  N4a: {
    indicator: 'Changes in land fill sites',
    class: 'environment',
    file: '/eodash-data/data/N4a.csv',
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

export const indicatorClassesIcons = Object.freeze({
  environment: 'mdi-earth',
  health: 'mdi-hospital-box-outline',
  agriculture: 'mdi-leaf',
  economic: 'mdi-currency-eur',
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
const wkt = new Wkt();

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        Country: 'all',
        City: 'World',
        'Site Name': 'global',
        Description: 'Air Quality',
        'Indicator code': 'N1',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Air Quality',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [],
        },
        'Color code': ['BLUE'],
        AOI: null,
        AOI_ID: 'World',
        Time: [['2019-01-07', '2019-01-21'], ['2019-01-14', '2019-01-28'], ['2019-01-21', '2019-02-04'], ['2019-01-28', '2019-02-11'], ['2019-02-04', '2019-02-18'], ['2019-02-11', '2019-02-25'], ['2019-02-18', '2019-03-04'], ['2019-02-25', '2019-03-11'], ['2019-03-04', '2019-03-18'], ['2019-03-11', '2019-03-25'], ['2019-03-18', '2019-04-01'], ['2019-03-25', '2019-04-08'], ['2019-04-01', '2019-04-15'], ['2019-04-08', '2019-04-22'], ['2019-04-15', '2019-04-29'], ['2019-04-22', '2019-05-06'], ['2019-04-29', '2019-05-13'], ['2019-05-06', '2019-05-20'], ['2019-05-13', '2019-05-27'], ['2019-05-20', '2019-06-03'], ['2019-05-27', '2019-06-10'], ['2019-06-03', '2019-06-17'], ['2019-06-10', '2019-06-24'], ['2019-06-17', '2019-07-01'], ['2019-06-24', '2019-07-08'], ['2019-07-01', '2019-07-15'], ['2019-07-08', '2019-07-22'], ['2019-07-15', '2019-07-29'], ['2019-07-22', '2019-08-05'], ['2019-07-29', '2019-08-12'], ['2019-08-05', '2019-08-19'], ['2019-08-12', '2019-08-26'], ['2019-08-19', '2019-09-02'], ['2019-08-26', '2019-09-09'], ['2019-09-02', '2019-09-16'], ['2019-09-09', '2019-09-23'], ['2019-09-16', '2019-09-30'], ['2019-09-23', '2019-10-07'], ['2019-09-30', '2019-10-14'], ['2019-10-07', '2019-10-21'], ['2019-10-14', '2019-10-28'], ['2019-10-21', '2019-11-04'], ['2019-10-28', '2019-11-11'], ['2019-11-04', '2019-11-18'], ['2019-11-11', '2019-11-25'], ['2019-11-18', '2019-12-02'], ['2019-11-25', '2019-12-09'], ['2019-12-02', '2019-12-16'], ['2019-12-09', '2019-12-23'], ['2019-12-16', '2019-12-30'], ['2019-12-23', '2020-01-06'], ['2019-12-30', '2020-01-13'], ['2020-01-06', '2020-01-20'], ['2020-01-13', '2020-01-27'], ['2020-01-20', '2020-02-03'], ['2020-01-27', '2020-02-10'], ['2020-02-03', '2020-02-17'], ['2020-02-10', '2020-02-24'], ['2020-02-17', '2020-03-02'], ['2020-02-24', '2020-03-09'], ['2020-03-02', '2020-03-16'], ['2020-03-09', '2020-03-23'], ['2020-03-16', '2020-03-30'], ['2020-03-23', '2020-04-06'], ['2020-03-30', '2020-04-13'], ['2020-04-06', '2020-04-20'], ['2020-04-13', '2020-04-27'], ['2020-04-20', '2020-05-04'], ['2020-04-27', '2020-05-11'], ['2020-05-04', '2020-05-18'], ['2020-05-11', '2020-05-25']],
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
    latlng: latLng([45.197522, 13.029785]),
    properties: {
      id: 9999, // for now
      indicatorObject: {
        AOI: null,
        AOI_ID: 'NorthAdriatic',
        Country: 'regional',
        City: 'North Adriatic',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps',
        'Color code': ['BLUE'],
        'EO Sensor': 'custom',
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: [['2020-03-27'], ['2020-04-03'], ['2020-04-10'], ['2020-04-17']],
        display: {
          ...defaultWMSDisplay,
          baseUrl: 'https://shservices.mundiwebservices.com/ogc/wms/a60a37cc-dcac-40fd-a13a-501a2eb39561',
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM',
          legendUrl: 'eodash-data/data/waterLegend.png',
          maxZoom: 13,
          dateFormatFunction: (dates) => `${moment.utc(dates[0], 'YYYY-MM-DD').format('YYYY-MM-DD')}`,
        },
      },
    },
  },
];
