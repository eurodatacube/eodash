import indicatorPOIs from '../../../public/data/internal/pois_trilateral.json';

describe('Indicator tests for trilateral', () => {
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
    console.log(`${item.aoiID}-${item.indicator}`);
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
      cy.get('#bar-chart, #line-chart, #bubbleMap').should('exist');
    });
  });
});
