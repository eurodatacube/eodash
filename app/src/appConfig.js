module.exports = [
  {
    id: 'esa',
    match: ['race.esa.int', 'eodash.eox.at', 'eodash-staging.eox.at', 'eodash-testing.eox.at', 'localhost2'],
    branding: {
      appName: 'Rapid Action on coronavirus and EO',
      primaryColor: '#003247',
      secondaryColor: '#0098DB',
      headerLogo: './eodash-data/general/RACE_Logo.png',
      faviconPath: './public/img/ESA/favicon.ico',
    },
    pageMeta: {
      rootPath: 'https://race.esa.int',
      googleSiteVerification: 'RfWilP51Q2wsZnVlKbxUTovIx90QqqLRFLebGpAeq14',
      shortDescription: 'The RACE platform demonstrates how the use of EO data can help shed new light on societal and economic changes currently taking place owing to the coronavirus pandemic.',
      twitterCardImagePath: '/img/ESA/twitter_card.jpg',
      imagePath: '/img/ESA',
    },
    storyPath: '/eodash-data/stories/',
    customCSS: 'esa',
    aboutText: '/eodash-data/general/about',
    welcomeText: '/eodash-data/general/welcome',
    tutorialText: '/eodash-data/general/tutorials',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        poi: 'UK7-E13d',
        src: './eodash-data/general/Slide6.png',
      },
      {
        poi: 'RhoneDeltaTSM-N3a2',
        src: './eodash-data/general/Slide1.png',
      },
      {
        poi: 'FR-N1',
        src: './eodash-data/general/Slide3.png',
      },
      {
        poi: 'RO3-E11',
        src: './eodash-data/general/Slide4.png',
      },
      {
        poi: 'W2-E12c',
        src: './eodash-data/general/Slide5.png',
      },
    ],
    privacyText: '/eodash-data/general/privacy',
    termsText: '/eodash-data/general/terms',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube'],
    featureGrouping: [
      {
        features: [
          'W2-E12c',
          'W3-E12c',
        ],
        label: 'indicatorName',
      },
      {
        features: [
          'ES61a-E10a6',
          'ES61b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES62a-E10a6',
          'ES62b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES30a-E10a6',
          'ES30b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES22a-E10a6',
          'ES22b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES23a-E10a6',
          'ES23b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES24a-E10a6',
          'ES24b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES41a-E10a6',
          'ES41b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES42a-E10a6',
          'ES42b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES43a-E10a6',
          'ES43b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES51a-E10a6',
          'ES51b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES52a-E10a6',
          'ES52b-E10a6',
        ],
        label: 'indicatorValue',
      },
    ],
  },
  {
    id: 'trilateral',
    match: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at', 'eodash-trilateral-staging.eox.at', 'eodash-trilateral-testing.eox.at', 'localhost'],
    branding: {
      appName: 'Earth Observing Dashboard',
      primaryColor: '#333333',
      secondaryColor: '#004170',
      headerLogo: './data/trilateral/Trilateral_Logo.svg',
      faviconPath: './public/img/trilateral/favicon.ico',
    },
    pageMeta: {
      rootPath: 'https://eodashboard.org',
      googleSiteVerification: 'iHN2SaSR9qF7T3lOqNYSF4kaq_ZgK-I31SSgO5RKXW8',
      shortDescription: 'The Earth Observing Dashboard combines the resources, technical knowledge and expertise of three partner agencies ESA, JAXA, and NASA to strengthen our global understanding of the environmental and economic effects of the COVID-19 pandemic.',
      twitterCardImagePath: '/img/trilateral/twitter_card.png',
      imagePath: '/img/trilateral',
    },
    displayDummyLocations: './data/trilateral/dummylocations.csv',
    storyPath: '/data/trilateral/',
    customCSS: 'trilateral',
    aboutText: '/data/trilateral/about',
    welcomeText: '/data/trilateral/welcome',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        poi: 'FR01-N1',
        src: './data/trilateral/Slide1.png',
      },
      {
        poi: 'IN02-N2',
        src: './data/trilateral/Slide2.png',
      },
      {
        poi: 'JP03-E9',
        src: './data/trilateral/Slide3.png',
      },
      {
        poi: 'US031-E13b',
        src: './data/trilateral/Slide4.png',
      },
      {
        poi: 'BE03-N5',
        src: './data/trilateral/Slide5.png',
      },
      {
        poi: 'BR02-N7',
        src: './data/trilateral/Slide6.png',
      },
    ],
    customCountryList: [
      { code: 'US', region: 'NORTH AMERICA' },
      { code: 'BE', region: 'EUROPE' },
      { code: 'HR', region: 'EUROPE' },
      { code: 'FR', region: 'EUROPE' },
      { code: 'DE', region: 'EUROPE' },
      { code: 'IT', region: 'EUROPE' },
      { code: 'SI', region: 'EUROPE' },
      { code: 'ES', region: 'EUROPE' },
      { code: 'JP', region: 'ASIA' },
      { code: 'CN', region: 'ASIA' },
      { code: 'SG', region: 'ASIA' },
      { code: 'BD', region: 'ASIA' },
      { code: 'IN', region: 'ASIA' },
      { code: 'BR', region: 'SOUTH AMERICA' },
      { code: 'CL', region: 'SOUTH AMERICA' },
      { code: 'PE', region: 'SOUTH AMERICA' },
      { code: 'TG', region: 'AFRICA' },
      { code: 'TZ', region: 'AFRICA' },
    ],
    featureGrouping: [
      {
        features: [
          'NorthAdriaticTSM_ESA-N3a2',
          'NorthAdriaticTSM_NASA-N3a2',
          'NorthAdriaticTSM_JAXA-N3a2',
        ],
        label: 'dataProvider',
      },
      {
        features: [
          'NorthAdriatic_ESA-N3a2',
          'NorthAdriatic_NASA-N3a2',
          'NorthAdriatic_JAXA-N3a2',
        ],
        label: 'dataProvider',
      },
      {
        features: [
          'W1-N1',
          'W2-N1',
          'W3-N1',
        ],
        label: 'eoSensor',
      },
      {
        features: [
          'W4-N2',
          'W5-N2',
        ],
        label: 'calcMethod',
      },
      {
        features: [
          'US08-E10c',
          'US09-E10c',
        ],
        label: 'eoSensor',
      },
      {
        features: [
          'W2-E12c',
          'W3-E12c',
        ],
        label: 'indicatorName',
      },
      {
        features: [
          'ES61a-E10a6',
          'ES61b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES62a-E10a6',
          'ES62b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES30a-E10a6',
          'ES30b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES22a-E10a6',
          'ES22b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES23a-E10a6',
          'ES23b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES24a-E10a6',
          'ES24b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES41a-E10a6',
          'ES41b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES42a-E10a6',
          'ES42b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES43a-E10a6',
          'ES43b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES51a-E10a6',
          'ES51b-E10a6',
        ],
        label: 'indicatorValue',
      },
      {
        features: [
          'ES52a-E10a6',
          'ES52b-E10a6',
        ],
        label: 'indicatorValue',
      },
    ],
    privacyText: '/data/trilateral/privacy',
    termsText: '/data/trilateral/terms',
    feedbackTwitterHandles: ['ESA_EO', 'esa', 'NASAEarth', 'NASA', 'JAXA_en', 'JAXA_jp', 'eurodatacube'],
    countDownTimer: '2020-06-25T13:30:00.000+02:00',
    countDownMatch: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at'],
  },
];
