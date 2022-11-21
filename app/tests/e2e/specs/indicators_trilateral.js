describe('Indicator tests for trilateral', () => {
  /*
  TODO: For indicator tests
  * Create tests for all instances (race, trilateral, gtif)
  * When exactly should tests be performed
  * Create tests for map and chart component (image comparison?)
  * Loop over all possible indicators?
  * ...?
  */
  it('test indicator chart', () => {
    cy.visit('/');
    // In trilateral testing branches we need to navigate to explore mode
    cy.contains('Explore Datasets').click();
    // TODO: Not sure how to best activate poi then
    // e.g. &poi=CN02-N2
    cy.contains(' Shanghai: Partial Column (GOSAT FTS L1B V220.220) ').should('exist');
    cy.get('#bar-chart').should('exist');
  });
});
