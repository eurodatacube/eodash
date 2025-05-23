module.exports = [
  {
    id: 'esa',
    mailingList: {
      development: 2,
      staging: 2,
      production: 4,
    },

    geosearchEndpoint: 'https://api.opencagedata.com/geocode/v1/json?limit=5',
    match: ['race.esa.int', 'eodash.eox.at', 'eodash-staging.eox.at', 'eodash-testing.eox.at', 'race.eox.world', 'race.localhost', 'race.eox.home'],
    branding: {
      appName: 'Rapid Action for Citizens with Earth Observation',
      shortName: 'RACE Dashboard',
      primaryColor: '#003247',
      secondaryColor: '#00ae92',
      headerLogo: './eodash-data/general/RACE_Logo.png',
      faviconPath: './public/img/ESA/favicon.ico',
    },
    pageMeta: {
      rootPath: 'https://race.esa.int',
      googleSiteVerification: 'RfWilP51Q2wsZnVlKbxUTovIx90QqqLRFLebGpAeq14',
      shortDescription: 'This dashboard aims to showcase the power of Earth Observations to inform on societal global challenges. It is a cooperation between The European Space Agency and the European Commission.',
      twitterCardImagePath: '/img/ESA/twitter_card.jpg',
      imagePath: '/img/ESA',
    },
    showNewsletterButton: true,
    customCSS: 'esa',
    newsBanner: {
      color: 'green darken-1',
      icon: 'calendar-star',
      text: '<a href="https://eo4society.esa.int/2021/08/01/rapid-action-on-coronavirus-and-eo-race-dashboard-challenge-3/" target="_blank">Sign up for the RACE Dashboard Challenge #3</a>',
      startDate: '2021-08-01',
      endDate: '2021-11-30',
    },
    aboutText: '/eodash-data/general/about',
    welcomeText: '/eodash-data/general/welcome',
    tutorialText: '/eodash-data/general/tutorials',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        href: './story?id=yield-forecast-crop-water-demand',
        src: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/refs/heads/main/stories/RACE/cropom_preview.png',
      },
      {
        href: './story?id=ideas-data',
        src: 'https://raw.githubusercontent.com/eurodatacube/eodash-assets/refs/heads/main/stories/IDEAS/ideas_carousel_preview.jpg',
      },
      {
        poi: 'ES4-E1b',
        src: './eodash-data/general/cimbelli.png',
      },
      {
        poi: 'World-E12c',
        src: './eodash-data/general/new-trucks.png',
      },
    ],
    privacyText: '/eodash-data/general/privacy',
    termsText: '/eodash-data/general/terms',
    challengesText: '/eodash-data/general/challenges',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube'],
    refColors: [
      '#22aa99', '#a37', '#47a', '#a67', '#283', '#302f2f',
      '#6ce', '#994499', '#bbb', '#6633cc', '#e67300',
    ],
    uiText: {
      indicatorPanelheader: 'Choose an indicator to explore',
    },
    demoMode: {
      egu2023: [
        // custom story is not supported yet for new demo mode
        {
          poi: 'World-WSF',
          story: '/eodash-data/stories/demo-mode/egu2023/WSF-WSF',
          highlights: [
            {
              name: 'Dubai, UAE',
              location: 'POLYGON((55 26,56 26,56 25,55 25,55 26))',
            },
            {
              name: 'Addis Ababa, Ethiopia',
              location: 'POLYGON((38.5 9.1,39 9.1,39 8.7,38.5 8.7,38.5 9.1))',
            },
            {
              name: 'Accra, Ghana',
              location: 'POLYGON((-0.73 6.2,0.5 6.2,0.5 5.06,-0.73 5.06,-0.73 6.2))',
            },
            {
              name: 'Houston, Texas',
              location: 'POLYGON((-96 30.4,-94.6 30.4,-94.6 28.96,-96 28.96,-96 30.4))',
            },
            {
              name: 'Vienna, Austria',
              location: 'POLYGON((16.19 48.12, 16.55 48.12, 16.55 48.295, 16.19 48.295, 16.19 48.12 ))',
            },
          ],
        },
        {
          poi: 'EG1-E200',
          story: '/eodash-data/stories/demo-mode/egu2023/ships_in_ports',
        },
        {
          poi: 'BE1-E1b',
          story: '/eodash-data/stories/demo-mode/egu2023/vessel_density',
        },
        {
          poi: 'World-E12c',
          story: '/eodash-data/stories/demo-mode/egu2023/moving_truck',
        },
        {
          poi: 'NorthAdriatic-N3a2',
          name: 'Chlorophyll-a concentration Anomaly Maps',
          story: '/eodash-data/stories/demo-mode/egu2023/water_quality_chlorophyll-a_concentration',
        },
        {
          poi: 'NorthAdriaticTSM-N3a2_TSM',
          name: 'Total Suspended Matter Anomaly Maps',
          story: '/eodash-data/stories/demo-mode/egu2023/water_quality_total_suspended_matter',
        },
        {
          poi: 'DanubeDeltaSST-N3a2_SST',
          story: '/eodash-data/stories/demo-mode/egu2023/sea_surface_temperature',
          name: 'Sea Surface Temperature Anomaly Maps',
        },
        {
          poi: 'World-CDS1_temperature',
          story: '/eodash-data/stories/demo-mode/egu2023/Air_temperature_2m',
        },
        {
          poi: 'World-CDS2_relative_humidity',
          story: '/eodash-data/stories/demo-mode/egu2023/relative_humidity_C3S',
        },
        {
          poi: 'World-N1_NO2',
          story: '/eodash-data/stories/demo-mode/egu2023/Nitrogen_Dioxide_TROPOMI',
        },
        {
          poi: 'World-N1_CO',
          story: '/eodash-data/stories/demo-mode/egu2023/Carbon_Monoxide_TROPOMI',
        },
        {
          poi: 'World-N1_SO2',
          story: '/eodash-data/stories/demo-mode/egu2023/Sulfur_Dioxide_TROPOMI',
        },
        {
          poi: 'AT4-E13d',
          story: '/eodash-data/stories/demo-mode/egu2023/Flying_Planes',
        },
      ],
    },
  },
  {
    id: 'trilateral',
    mailingList: {
      development: 3,
      staging: 3,
      production: 5,
    },
    geosearchEndpoint: 'https://api.opencagedata.com/geocode/v1/json?limit=5',
    match: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at', 'eodash-trilateral-staging.eox.at', 'eodash-trilateral-testing.eox.at', 'trilateral.eox.world', 'trilateral.localhost', 'trilateral.eox.home'],
    branding: {
      appName: 'Earth Observing Dashboard',
      primaryColor: '#333333',
      secondaryColor: '#004170',
      headerLogo: './data/trilateral/Trilateral_Logo.svg',
      faviconPath: './public/img/trilateral/favicon.ico',
      title: 'Earth Observing Dashboard',
      subtitle: 'Global environmental changes observed by NASA, ESA, and JAXA',
      coverImage: '/data/story-images/EO_Dashboard_kv_no logos.png',
      storiesHeader: 'Stories',
      headerHeight: '50vh',
    },
    pageMeta: {
      rootPath: 'https://eodashboard.org',
      googleSiteVerification: 'iHN2SaSR9qF7T3lOqNYSF4kaq_ZgK-I31SSgO5RKXW8',
      shortDescription: 'The Earth Observing Dashboard combines the resources, technical knowledge and expertise of three partner agencies ESA, JAXA, and NASA to strengthen our global understanding of the changing environment with human activity.',
      twitterCardImagePath: '/img/trilateral/twitter_card.png',
      imagePath: '/img/trilateral',
    },
    customCSS: 'trilateral',
    newsBanner: {
      color: 'green darken-1',
      icon: 'calendar-star',
      text: '<b><a href="https://www.eodashboardhackathon.org/awards/" target="_blank">EO Dashboard Hackathon RESULTS!</a><b>',
      startDate: '2021-08-03',
      endDate: '2021-09-30',
    },
    aboutText: '/data/trilateral/about',
    welcomeText: '/data/trilateral/welcome',
    tutorialText: '/data/trilateral/tutorials',
    challengesText: '/eodash-data/general/eodashboardhackathon',
    showNewsCarousel: true,
    customMetadataTransformer: (collectionLink) => {
      const i = collectionLink.themes.findIndex((theme) => theme === 'air');
      if (i !== -1) {
        // eslint-disable-next-line no-param-reassign
        collectionLink.themes[i] = 'atmosphere';
      }
      const j = collectionLink.themes.findIndex((theme) => theme === 'water');
      if (j !== -1) {
        // eslint-disable-next-line no-param-reassign
        collectionLink.themes[j] = 'oceans';
      }
    },
    uiText: {
      indicatorPanelheader: 'Choose an indicator to explore',
    },
    demoMode: {
      cop28: [
        {
          poi: 'World-RECCAP2_1',
        },
        {
          poi: 'World-RECCAP2_5',
        },
        {
          poi: 'World-RECCAP2_6',
        },
        {
          poi: 'World-RECCAP2_7',
        },
        {
          poi: 'World-RECCAP2_8',
        },
        {
          poi: 'World-RECCAP2_9',
        },
        {
          poi: 'CHN-GGI_CH4',
          name: 'China - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'CHN-GGI_N2O',
          name: 'China - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'CHN-GGI_CO2',
          name: 'China - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'USA-GGI_CH4',
          name: 'USA - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'USA-GGI_N2O',
          name: 'USA - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'USA-GGI_CO2',
          name: 'USA - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'EUC-GGI_CH4',
          name: 'EU (Convention) - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'EUC-GGI_N2O',
          name: 'EU (Convention) - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'EUC-GGI_CO2',
          name: 'EU (Convention) - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'IND-GGI_CH4',
          name: 'India - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'IND-GGI_N2O',
          name: 'India - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'IND-GGI_CO2',
          name: 'India - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'BRA-GGI_CH4',
          name: 'Brasil - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'BRA-GGI_N2O',
          name: 'Brasil - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'BRA-GGI_CO2',
          name: 'Brasil - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'RUS-GGI_CH4',
          name: 'Russia - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'RUS-GGI_N2O',
          name: 'Russia - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'RUS-GGI_CO2',
          name: 'Russia - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'KAZ-GGI_CH4',
          name: 'Kazakhstan - Greenhouse gas reconciliation CH4 (CCI RECCAP2)',
        },
        {
          poi: 'KAZ-GGI_N2O',
          name: 'Kazakhstan - Greenhouse gas reconciliation N2O (CCI RECCAP2)',
        },
        {
          poi: 'KAZ-GGI_CO2',
          name: 'Kazakhstan - Greenhouse gas reconciliation CO2 (CCI RECCAP2)',
        },
        {
          poi: 'World-ESDC_gross_primary_productivity',
        },
        {
          poi: 'World-ESDC_net_ecosystem_exchange',
        },
        {
          poi: 'World-ESDC_kndvi',
        },
      ],
    },
    newsCarouselitems: [
      {
        poi: 'Onset-ADD',
        src: './data/trilateral/melt-maps.png',
      },
      {
        poi: 'BR04-PRCTS',
        src: './data/trilateral/new-precipitation-jaxa.png',
      },
      {
        poi: 'ADD_L2_Thwaites-ADD_Landsat_L2_Antarctica',
        src: './data/trilateral/landsat-antarctica.png',
      },
      {
        poi: 'World-ADD_West_Antarctica_S1',
        src: './data/trilateral/s-1-antarctica.png',
      },
    ],
    refColors: [
      '#22aa99', '#a37', '#47a', '#a67', '#283', '#302f2f',
      '#6ce', '#994499', '#bbb', '#6633cc', '#e67300',
    ],
    privacyText: '/data/trilateral/privacy',
    termsText: '/data/trilateral/terms',
    feedbackTwitterHandles: ['ESA_EO', 'esa', 'NASAEarth', 'NASA', 'JAXA_en', 'JAXA_jp', 'eurodatacube'],
    countDownTimer: '2020-06-25T13:30:00.000+02:00',
    countDownMatch: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at'],
    enableStories: true,
  },
  {
    id: 'gtif',
    mailingList: {
      development: 6,
      staging: 6,
      production: 7,
    },
    geosearchEndpoint: 'https://api.opencagedata.com/geocode/v1/json?limit=5&countrycode=AT',
    match: ['gtif.esa.int', 'gtif.eox.at', 'gtif-demo.eox.at', 'gtif-staging.eox.at', 'gtif-testing.eox.at', 'gtif.eox.world', 'gtif.localhost', 'gtif.eox.home'],
    branding: {
      appName: 'Green Transition Information Factory',
      primaryColor: '#003247',
      secondaryColor: '#00ae9d',
      headerLogo: './data/gtif/images/gtif_attributions_logo.png',
      faviconPath: './public/img/ESA/favicon.ico',
      title: 'Green Transition Information Factory',
      subtitle: 'Key element of the ESA Space For Green Future Accelerator',
      coverImage: './data/gtif/images/image1.png',
      storiesHeader: 'Subdomains',
      headerHeight: '30vh',
    },
    pageMeta: {
      rootPath: 'https://gtif.esa.int',
      googleSiteVerification: '',
      shortDescription: 'Green Transition Information Factory',
      twitterCardImagePath: '/img/gtif/twitter_card.jpg',
      imagePath: '/img/gtif',
    },
    showNewsletterButton: false,
    customCSS: 'gtif',
    newsBanner: {
      color: 'green darken-1',
      icon: 'calendar-star',
      text: '<a href="https://eo4society.esa.int/2021/08/01/rapid-action-on-coronavirus-and-eo-race-dashboard-challenge-3/" target="_blank">Sign up for the RACE Dashboard Challenge #3</a>',
      startDate: '2021-08-01',
      endDate: '2021-11-30',
    },
    aboutText: '/data/gtif/stories/about',
    welcomeText: '/data/gtif/stories/welcome',
    tutorialText: '/data/gtif/stories/tutorials',
    showNewsCarousel: false,
    newsCarouselitems: [
    ],
    privacyText: '/data/gtif/markdown/privacy',
    termsText: '/data/gtif/markdown/terms',
    challengesText: '/eodash-data/general/challenges',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube', 'gtif'],
    refColors: [
      '#22aa99', '#a37', '#47a', '#a67', '#283', '#302f2f',
      '#6ce', '#994499', '#bbb', '#6633cc', '#e67300',
    ],
    enableStories: false,
    enableESALayout: true,
    enableScrollyTelling: true,
  },
  {
    id: 'polar',
    mailingList: {
      development: 3,
      staging: 3,
      production: 5,
    },
    demoMode: {
      polartep: [
        {
          poi: 'World-TOPAZ5_P1D_SIAGE',
        },
        {
          poi: 'World-TOPAZ5_P1D_SICONC',
        },
        {
          poi: 'World-TOPAZ5_P1D_SISNTHICK',
        },
        {
          poi: 'World-TOPAZ5_P1D_SITHICK',
        },
        {
          poi: 'World-TOPAZ5_P1D_VXO',
        },
        {
          poi: 'World-TOPAZ5_P1D_VXSI',
        },
        {
          poi: 'World-TOPAZ5_P1D_VYO',
        },
        {
          poi: 'World-TOPAZ5_P1D_VYSI',
        },
        {
          poi: 'World-TOPAZ4_P1D_SICONC',
        },
        {
          poi: 'World-TOPAZ4_P1D_SISNTHICK',
        },
        {
          poi: 'World-TOPAZ4_P1D_SITHICK',
        },
        {
          poi: 'World-TOPAZ4_P1D_VXO',
        },
        {
          poi: 'World-TOPAZ4_P1D_VXSI',
        },
        {
          poi: 'World-TOPAZ4_P1D_VYO',
        },
        {
          poi: 'World-TOPAZ4_P1D_VYSI',
        },
        {
          poi: 'World-SITI',
        },
        {
          poi: 'World-N12_1_sea_ice_concentration_arctic',
        },
        {
          poi: 'World-CDS3',
        },
        {
          poi: 'World-CDS4',
        },
        {
          poi: 'World-CDS1_temperature',
        },
        {
          poi: 'World-Polartep_SeaIceDetection_tif_demo',
        },
        {
          poi: 'World-Polartep_Snowgrain_diameter_demo',
        },
        {
          poi: 'World-Polartep_Snow_specific_surface_area_demo',
        },
        {
          poi: 'World-Polartep_S1_demo',
        },
        {
          poi: 'World-Polartep_SeaIce_demo',
        },
      ],
    },
    match: ['polardashboard.org', 'polar.eox.world', 'polar.localhost', 'polar.eox.home', 'eodash-polar.eox.at', 'eodash-polar-testing.eox.at'],
    branding: {
      appName: 'Polar Dashboard',
      primaryColor: '#003247',
      secondaryColor: '#00ae9d',
      headerLogo: './eodash-data/general/RACE_Logo.png',
      faviconPath: './public/img/ESA/favicon.ico',
    },
    pageMeta: {
      rootPath: 'https://polardashboard.org',
      googleSiteVerification: '',
      shortDescription: 'Polar Dashboard', // TODO: polar
      twitterCardImagePath: '/img/ESA/twitter_card.jpg', // TODO: polar
      imagePath: '/img/ESA', // TODO: polar
    },
    showNewsletterButton: false,
    customCSS: 'esa',
    newsBanner: {},
    aboutText: '/eodash-data/general/about',
    welcomeText: '/eodash-data/general/welcome',
    tutorialText: '/eodash-data/general/tutorials',
    showNewsCarousel: false,
    newsCarouselitems: [
    ],
    privacyText: '/eodash-data/general/privacy',
    termsText: '/eodash-data/general/terms',
    challengesText: '/eodash-data/general/challenges',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube'],
    refColors: [
      '#22aa99', '#a37', '#47a', '#a67', '#283', '#302f2f',
      '#6ce', '#994499', '#bbb', '#6633cc', '#e67300',
    ],
    enableStories: false,
    enableESALayout: false,
    enableScrollyTelling: false,
    enableIndicatorSidebar: true,
    uiText: {

    },
  },
];
