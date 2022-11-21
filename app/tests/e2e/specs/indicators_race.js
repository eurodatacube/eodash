describe('Indicator tests for race', () => {
  it('test indicator chart', () => {
    cy.visit('/explore?&poi=EG1-E200');
    cy.contains('Suez : Ships in Port').should('exist');
    cy.get('#bar-chart').should('exist');
  });
});
