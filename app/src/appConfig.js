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
    newsBanner: {
      color: 'green darken-1',
      icon: 'pine-tree',
      text: 'The dashboard will be updated less frequently in the holiday season.<br />Happy holidays and stay safe!',
      startDate: '2020-12-21',
      endDate: '2021-01-06',
    },
    aboutText: '/eodash-data/general/about',
    welcomeText: '/eodash-data/general/welcome',
    tutorialText: '/eodash-data/general/tutorials',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        poi: 'Barcelona-N3a2',
        src: './eodash-data/general/Slide9.png',
      },
      {
        iframe: 'https://www.youtube.com/embed/Ofb2pNQc424',
      },
      {
        poi: 'FI4-E13',
        src: './eodash-data/general/Slide10.png',
      },
      {
        poi: 'UK10-N1a',
        src: './eodash-data/general/Slide13.png',
      },
      {
        poi: 'BE9-E8',
        src: './eodash-data/general/Slide12.png',
      },
    ],
    privacyText: '/eodash-data/general/privacy',
    termsText: '/eodash-data/general/terms',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube'],
    // The label parameter can be used as string to select the parameter identifier
    // or it can be an array of strings the same size as features to set custom
    // tab titles for each of the tabbed groups
    featureGrouping: [
      {
        features: [
          'GCAQ1-N1b',
          'GCAQ2-N1b',
          'GCAQ3-N1b',
          'GCAQ4-N1b',
        ],
        label: ['NO2', 'PM 2.5', 'PM10', 'O3'],
      },
      {
        features: [
          'W2-E12c',
          'W3-E12c',
        ],
        label: 'indicatorName',
      },
    ].concat([
      'AT4', 'BE6', 'CH1', 'DE12', 'DE13', 'DE14', 'DE15', 'DK1', 'ES10', 'ES11', 'ES14', 'ES15', 'FI4', 'FR13', 'FR8', 'GR2', 'IE1', 'IT13', 'IT9', 'NL1', 'NO1', 'PL6', 'PT1', 'SE23', 'TR1', 'UK4', 'UK5', 'UK6', 'UK7', 'UK8']
      .map((val) => ({ features: [`${val}-E13d`, `${val}a-E13d`], label: ['Airports traffic', 'Detected airplanes'] })))
      .concat([
        'ES22', 'ES23', 'ES24', 'ES30', 'ES41', 'ES42', 'ES43', 'ES51', 'ES52', 'ES61', 'ES62']
        .map((val) => ({ features: [`${val}a-E10a6`, `${val}b-E10a6`], label: 'indicatorValue' })))
      .concat([
        'NL3', 'TR3', 'GR6', 'ES63', 'RS1', 'DE16', 'CH2', 'UK10', 'SK4', 'BE7',
        'RO9', 'HU5', 'DE13', 'DK1', 'IE3', 'DE17', 'FI4', 'PT3', 'SI3', 'UK11',
        'LU2', 'FR15', 'ES12', 'FR16', 'IT10', 'MC1', 'DE18', 'IT37', 'CY2',
        'NO2', 'FR10', 'ME1', 'CZ6', 'XK1', 'IS1', 'LV3', 'IT11', 'BA1', 'MK1',
        'BG4', 'SE22', 'EE1', 'AL1', 'IT38', 'ES65', 'MT2', 'AT5', 'LT3', 'PL6',
        'HR3', 'OS1',
      ].map((val) => ({ features: [`${val}-N1b`, `${val}-N1a`, `${val}-N1c`, `${val}-N1d`], label: ['NO2', 'PM 2.5', 'PM10', 'O3'] }))),
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
    newsBanner: {
      color: 'green darken-1',
      icon: 'pine-tree',
      text: 'The dashboard will be updated less frequently in the holiday season.<br />Happy holidays and stay safe!',
      startDate: '2020-12-21',
      endDate: '2021-01-06',
    },
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
    ].concat([
      'ES22', 'ES23', 'ES24', 'ES30', 'ES41', 'ES42', 'ES43', 'ES51', 'ES52', 'ES61', 'ES62']
      .map((val) => ({ features: [`${val}a-E10a6`, `${val}b-E10a6`], label: 'indicatorValue' }))),
    privacyText: '/data/trilateral/privacy',
    termsText: '/data/trilateral/terms',
    feedbackTwitterHandles: ['ESA_EO', 'esa', 'NASAEarth', 'NASA', 'JAXA_en', 'JAXA_jp', 'eurodatacube'],
    countDownTimer: '2020-06-25T13:30:00.000+02:00',
    countDownMatch: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at'],
  },
];
