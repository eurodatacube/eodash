// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import { DateTime } from 'luxon';
import { latLng, latLngBounds } from 'leaflet';
import { shTimeFunction } from '@/utils';

export const indicatorsDefinition = Object.freeze({
  E1: {
    indicator: 'Status of metallic ores',
    class: 'economic',
    file: './eodash-data/data/E1.csv',
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmm"),
      url: './eodash-data/features/{Indicator code}_{AOI_ID}_{featuresTime}.geojson',
      parameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)'],
    },
  },
  E1a: {
    indicator: 'Status of non-metallic ores',
    class: 'economic',
    file: './eodash-data/data/E1a.csv',
    story: '/eodash-data/stories/E1a',
  },
  E2: {
    indicator: 'Volume of oil stockpiled',
    class: 'economic',
    file: './eodash-data/data/E2.csv',
    story: '/eodash-data/stories/E2',
  },
  E2a: {
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
    file: './eodash-data/data/E4.csv',
    story: '/eodash-data/stories/E4',
  },
  E5: {
    indicator: 'Inventory levels of intermediate goods',
    class: 'economic',
    file: './eodash-data/data/E5.csv',
    story: '/eodash-data/stories/E5',
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
    file: './eodash-data/data/E8.csv',
    story: '/eodash-data/stories/E8',
  },
  E9: {
    indicator: 'Construction activity',
    class: 'economic',
  },
  E10a1: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    file: './eodash-data/data/E10a1.csv',
    story: '/eodash-data/stories/E10a1',
    largeSubAoi: true,
  },
  E10a2: {
    indicator: 'Cum. proportion of total area under active mgmt.',
    class: 'agriculture',
    file: './eodash-data/data/E10a2.csv',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a3: {
    indicator: 'Evolution of the cultivated areas for production of white asparagus',
    class: 'agriculture',
    file: './eodash-data/data/E10a3.csv',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a5: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    file: './eodash-data/data/E10a5.csv',
    story: '/eodash-data/stories/E10a5',
    largeSubAoi: true,
  },
  E10a6: {
    indicator: 'Harvested parcels evolution over time',
    class: 'agriculture',
    file: './eodash-data/data/E10a6.csv',
    story: '/eodash-data/stories/E10a6',
    largeSubAoi: true,
  },
  E10a7: {
    indicator: 'Harvested area evolution over time',
    class: 'agriculture',
    file: './eodash-data/data/E10a7.csv',
    story: '/eodash-data/stories/E10a7',
    largeSubAoi: true,
  },
  E10a8: {
    indicator: 'Cumulative harvested area',
    class: 'agriculture',
    file: './eodash-data/data/E10a8.csv',
    story: '/eodash-data/stories/E10a8',
    largeSubAoi: true,
  },
  E10b: {
    indicator: 'Field preparation activity',
    class: 'agriculture',
  },
  E11: {
    indicator: 'Volume of activity at shopping centers',
    class: 'economic',
    file: './eodash-data/data/E11.csv',
    story: '/eodash-data/stories/E11',
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
    file: './eodash-data/data/E13b.csv',
    story: '/eodash-data/stories/E13b',
  },
  E13c: {
    indicator: 'Maritime traffic: throughput',
    class: 'economic',
    // file: './eodash-data/data/E13c.csv',
    // largeSubAoi: true,
    // largeTimeDuration: true,
  },
  H1: {
    indicator: 'Number of temp. treatment sites',
    class: 'health',
  },
  N1: {
    indicator: 'Air quality',
    class: 'environment',
    story: '/eodash-data/stories/N1',
    externalData: {
      label: 'Sentinel-5p Mapping Service',
      url: 'https://maps.s5p-pal.com',
    },
    largeTimeDuration: true,
  },
  N2: {
    indicator: 'CO2 emissions',
    class: 'environment',
    largeTimeDuration: true,
  },
  N3: {
    indicator: 'CHL concentration',
    class: 'environment',
    file: './eodash-data/data/N3.csv',
    story: '/eodash-data/stories/N3',
    largeSubAoi: true,
  },
  N3a2: {
    indicator: 'CHL concentration',
    class: 'environment',
    story: '/eodash-data/stories/N3a2',
    largeSubAoi: true,
  },
  N4a: {
    indicator: 'Changes in land fill sites',
    class: 'environment',
    file: './eodash-data/data/N4a.csv',
    story: '/eodash-data/stories/N4a',
  },
  N4b: {
    indicator: 'Illegal waste levels',
    class: 'environment',
  },
  d: { // dummy for locations without Indicator code
    indicator: 'Upcoming data',
    class: 'economic',
  },
});

export const layerNameMapping = Object.freeze({
  // "inputdata" -> wms layer name and baseurl
  '[NEW] Planetscope COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  'PlanetScope - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  'Planetscope COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  '[NEW] Planet COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  'Pleiades - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  // 'DS_PHR1A': {
  //   base`rl: 'https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  //   layers: 'NEW_PLEIADES_COVID19',
  // },
  '[NEW] Pleiades - 2.8m - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_28_COVID19',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades 16bit': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_16BIT',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  },
  'Sentinel 2 L2A': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
  },
  S2L2A: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
  },
  S1GRD: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'E8_SENTINEL1',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
  },
  'S1A - GRD': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'E8_SENTINEL1',
    attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
  },
  N1: {}, // just for enabling eo data button for now,
  N3a2: {}, // just for enabling eo data button for now,
});

export const indicatorClassesIcons = Object.freeze({
  environment: 'mdi-earth',
  health: 'mdi-hospital-box-outline',
  agriculture: 'mdi-leaf',
  economic: 'mdi-currency-eur',
});

export const mapDefaults = Object.freeze({
  minMapZoom: 3,
  maxMapZoom: 18,
  bounds: latLngBounds(latLng([35, -10]), latLng([70, 33])),
});

export const baseLayers = [
  {
    name: 'EOxCloudless 2019',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2019: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019) }',
    visible: false,
    maxNativeZoom: 15,
  },
  {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxNativeZoom: 16,
    visible: true,
  },
];
export const overlayLayers = [
  {
    name: 'Overlay',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Overlay: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a href="//eox.at" target="_blank">EOX</a> }',
    visible: true,
    maxZoom: 14,
  },
];

export const defaultWMSDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.3 and 8.2 of the Terms and Conditions</a> }',
  minZoom: 7,
};

const getWeeklyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
};

const getFortnightIntervalDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end).minus({ weeks: 2 });
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push([
      DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'),
      DateTime.fromISO(currentDate).plus({ weeks: 2 }).toFormat('yyyy-MM-dd'),
    ]);
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
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
        'Color code': ['primary'],
        AOI: null,
        AOI_ID: 'World',
        Time: getFortnightIntervalDates('2019-01-07', '2020-07-13'),
        'Input Data': [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: '//obs.eu-de.otc.t-systems.com/s5p-pal-l3-tms/s5p-l3-tropno2/fortnight/{time}/{z}/{x}/{-y}.png',
          name: 'Tropospheric NO2',
          legendUrl: 'eodash-data/data/no2Legend.png',
          attribution: '{ Air Quality: <a href="//scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf" target="_blank">Sentinel data</a>, <a href="//maps.s5p-pal.com/" target="_blank">S5P-PAL</a> }',
          dateFormatFunction: (dates) => `${DateTime.fromISO(dates[0]).toFormat('yyyyMMdd')}-${DateTime.fromISO(dates[1]).toFormat('yyyyMMdd')}`,
        },
      },
    },
  },
  {
    id: 9999,
    latlng: latLng([45.197522, 13.029785]),
    properties: {
      indicatorObject: {
        id: 9999,
        AOI: latLng([45.197522, 13.029785]),
        AOI_ID: 'NorthAdriatic',
        Country: ['HR', 'IT', 'SI'],
        City: 'North Adriatic - Chlorophyll-a concentration',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-07'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM',
          legendUrl: 'eodash-data/data/waterLegend.png',
          maxZoom: 13,
          attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9998,
    latlng: latLng([43.4, 4.94]),
    properties: {
      indicatorObject: {
        id: 9999,
        AOI: latLng([43.4, 4.94]),
        AOI_ID: 'RhoneDelta',
        Country: ['FR'],
        City: 'Rhone Delta - Chlorophyll-a concentration',
        'Site Name': 'Fos-sur-Mer',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-07'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM',
          legendUrl: 'eodash-data/data/waterLegend.png',
          maxZoom: 13,
          attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9997,
    latlng: latLng([45.197522, 13.0297851]),
    properties: {
      indicatorObject: {
        id: 9997,
        AOI: latLng([45.197522, 13.0297851]),
        AOI_ID: 'NorthAdriaticTSM',
        Country: ['HR', 'IT', 'SI'],
        City: 'North Adriatic - Total Suspended Matter',
        'Site Name': 'North Adriatic',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-07'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TSMNN',
          legendUrl: 'eodash-data/data/waterLegend_tsm.png',
          maxZoom: 13,
          attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9996,
    latlng: latLng([43.4, 4.9400001]),
    properties: {
      indicatorObject: {
        id: 9996,
        AOI: latLng([43.4, 4.9400001]),
        AOI_ID: 'RhoneDeltaTSM',
        Country: ['FR'],
        City: 'Rhone Delta - Total Suspended Matter',
        'Site Name': 'Fos-sur-Mer',
        Description: 'Water Quality Regional Maps',
        'Indicator code': 'N3a2',
        'Indicator Value': ['normal'],
        'Indicator Name': 'Water Quality Regional Maps',
        'Color code': ['BLUE'],
        'EO Sensor': null,
        'Sub-AOI': {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        Time: getWeeklyDates('2020-01-07', '2020-07-07'),
        'Input Data': [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TSMNN',
          legendUrl: 'eodash-data/data/waterLegend_tsm.png',
          maxZoom: 13,
          attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3.2 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
];
