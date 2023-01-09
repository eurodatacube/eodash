import indicatorPOIs from '../../../public/data/internal/pois_trilateral.json';

// Overwriting baseurl when localhost is defined changing it to load race instance
if (Cypress.config().baseUrl.includes('localhost')) {
  const { baseUrl } = Cypress.config();
  Cypress.config('baseUrl', baseUrl.replace('localhost', 'trilateral.eox.world'));
}

describe('Indicator tests for trilateral desktop', () => {
  context('1080p resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
    });
    // We generate an object where each indicator is contained once,
    // only having information of one poi

    // Currently pois configured as mappois in the appConfig fail
    // TODO: Consider best way of loading the information from the appConfig, currently
    // list just copied here
    const configuredMapPois = [
      'DE1-E13c', 'PL1-E13c', 'BE3-E13c', 'FR3-E13c', 'IT3-E13c',
      'IT9-E13b', 'FR8-E13b', 'UK4-E13b', 'EG1-E13c', 'EG01-N1', 'EG01-N2',
      'EG01-SIF',
    ];
    const testSamples = {};
    indicatorPOIs.forEach((item) => {
      if (!(item.indicator in testSamples)
      && !configuredMapPois.includes(`${item.aoiID}-${item.indicator}`)) {
        testSamples[item.indicator] = item;
      }
    });
    Object.entries(testSamples).forEach(([key, obj]) => {
      it(`testing indicator ${key} via 'poi=${obj.aoiID}-${key}'`, () => {
        // We can leave out the explore navigation as directly providing kvp changes to this mode
        // thus we can use test branch deployments
        cy.visit(`/?poi=${obj.aoiID}-${key}`);
        cy.contains('Accept all cookies').click();
        cy.get('#bar-chart, #line-chart, #bubbleMap').should('exist');
        // We add a wait to make sure indicator is completely loaded for video output
        cy.wait(1500);
      });
    });
  });
});

/*
describe('Indicator tests for trilateral mobile', () => {
  context('iphone-5 resolution', () => {
    beforeEach(() => {
      // run these tests as if in a mobile browser
      // and ensure our responsive UI is correct
      cy.viewport('iphone-5');
    });
    // We generate an object where each indicator is contained once,
    // only having information of one poi

    // Currently pois configured as mappois in the appConfig fail
    // TODO: Consider best way of loading the information from the appConfig, currently
    // list just copied here
    const configuredMapPois = [
      'DE1-E13c', 'PL1-E13c', 'BE3-E13c', 'FR3-E13c', 'IT3-E13c',
      'IT9-E13b', 'FR8-E13b', 'UK4-E13b', 'EG1-E13c', 'EG01-N1', 'EG01-N2',
      'EG01-SIF',
    ];
    const testSamples = {};
    indicatorPOIs.forEach((item) => {
      if (!(item.indicator in testSamples)
      && !configuredMapPois.includes(`${item.aoiID}-${item.indicator}`)) {
        testSamples[item.indicator] = item;
      }
    });
    Object.entries(testSamples).forEach(([key, obj]) => {
      it(`testing indicator ${key}`, () => {
        // We can leave out the explore navigation as directly providing kvp changes to this mode
        // thus we can use test branch deployments
        cy.visit(`/?poi=${obj.aoiID}-${key}`);
        cy.contains('Accept all cookies').click();
        cy.get('#bar-chart, #line-chart, #bubbleMap').should('exist');
      });
    });
  });
});
*/
