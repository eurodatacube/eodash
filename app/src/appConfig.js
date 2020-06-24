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
    },
    displayDummyLocations: './eodash-data/data/dummylocations.csv',
    storyPath: '/eodash-data/stories/',
    customCSS: 'esa',
    aboutText: '/eodash-data/general/about',
    welcomeText: '/eodash-data/general/welcome',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        poi: 'NorthAdriatic-N3a2',
        src: './eodash-data/general/Slide1.png',
      },
      {
        poi: 'PL1-E1a',
        src: './eodash-data/general/Slide2.png',
      },
      {
        poi: 'World-N1',
        src: './eodash-data/general/Slide3.png',
      },
      {
        poi: 'DE11-E10a1',
        src: './eodash-data/general/Slide4.png',
      },
    ],
    privacyText: '/eodash-data/general/privacy',
    termsText: '/eodash-data/general/terms',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube'],
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
      googleSiteVerification: 'RfWilP51Q2wsZnVlKbxUTovIx90QqqLRFLebGpAeq14',
      shortDescription: 'The Earth Observing Dashboard platform demonstrates how the use of EO data can help shed new light on societal and economic changes currently taking place owing to the coronavirus pandemic.',
      twitterCardImagePath: '/img/trilateral/twitter_card.jpg',
    },
    displayDummyLocations: './data/trilateral/dummylocations.csv',
    storyPath: '/data/trilateral/',
    customCSS: 'trilateral',
    aboutText: '/data/trilateral/about',
    welcomeText: '/data/trilateral/welcome',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        poi: 'JP01-N2',
        src: './data/trilateral/Slide1.png',
      },
      {
        poi: 'NorthAdriaticESA-N3a2',
        src: './data/trilateral/Slide2.png',
      },
      {
        poi: 'FR01-N1',
        src: './data/trilateral/Slide3.png',
      },
      {
        poi: 'W2-N1',
        src: './data/trilateral/Slide4.png',
      },
    ],
    privacyText: '/data/trilateral/privacy',
    termsText: '/data/trilateral/terms',
    feedbackTwitterHandles: ['ESA_EO', 'esa', 'NASAEarth', 'NASA', 'JAXA_en', 'JAXA_jp', 'eurodatacube'],
    countDownTimer: '2020-06-25T13:30:00.000+00:00',
    countDownMatch: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at'],
  },
];
