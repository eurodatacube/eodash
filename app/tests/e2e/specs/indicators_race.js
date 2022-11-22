import indicatorPOIs from '../../../public/data/internal/pois_eodash.json';

describe('Indicator tests for race', () => {
  // Overwriting baseurl when localhost is defined changing it to load race instance
  if (Cypress.config().baseUrl.includes('localhost')) {
    const { baseUrl } = Cypress.config();
    Cypress.config('baseUrl', baseUrl.replace('localhost', '127.0.0.1'));
  }
  const testSamples = {};
  indicatorPOIs.forEach((item) => {
    if (!(item.indicator in testSamples)) {
      testSamples[item.indicator] = item;
    }
  });
  Object.entries(testSamples).forEach(([key, obj]) => {
    it(`testing indicator ${key}`, () => {
      cy.visit(`/?poi=${obj.aoiID}-${key}`);
      cy.get('#bar-chart, #line-chart, #bubbleMap').should('exist');
    });
  });
});
