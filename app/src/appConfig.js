/* eslint-disable no-unused-vars */
const brands = [
  {
    id: 'esa',
    match: ['race.esa.int', 'eodash.eox.at', 'eodash-staging.eox.at', 'localhost'],
    branding: {
      appName: 'Rapid Action on coronavirus and EO',
      primaryColor: '#003247',
      headerLogo: '/eodash-data/general/ESA_Logo.svg',
    },
    pageMeta: {
      rootPath: 'https://race.esa.int',
      googleSiteVerification: 'RfWilP51Q2wsZnVlKbxUTovIx90QqqLRFLebGpAeq14',
      shortDescription: 'The RACE platform demonstrates how the use of EO data can help shed new light on societal and economic changes currently taking place owing to the coronavirus pandemic.',
      twitterCardImagePath: '/img/ESA/RACE_key_visual_200526_3v.jpg',
    },
    displayDummyLocations: true,
  },
  {
    id: 'trilateral',
    match: ['eodash-trilateral.eox.at', 'eodash-trilateral-staging.eox.at', 'localhost2'],
    branding: {
      appName: 'Trilateral Dashboard',
      primaryColor: '#000000',
      headerLogo: '/eodash-data/general/Trilateral_Logo.svg',
    },
    pageMeta: {
      rootPath: 'https://race.esa.int',
      googleSiteVerification: 'RfWilP51Q2wsZnVlKbxUTovIx90QqqLRFLebGpAeq14',
      shortDescription: 'The RACE platform demonstrates how the use of EO data can help shed new light on societal and economic changes currently taking place owing to the coronavirus pandemic.',
      twitterCardImagePath: '/img/ESA/RACE_key_visual_200526_3v.jpg',
    },
  },
];

export default {
  brands,
};
