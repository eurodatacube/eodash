describe('Indicator tests for race', () => {
  // Overwriting baseurl when localhost is defined changing it to load race instance
  if (Cypress.config().baseUrl.includes('localhost')) {
    const { baseUrl } = Cypress.config();
    Cypress.config('baseUrl', baseUrl.replace('localhost', '127.0.0.1'));
  }
  it('test indicator chart', () => {
    cy.visit('/?poi=EG1-E200');
    cy.contains('Suez : Ships in Port').should('exist');
    cy.get('#bar-chart').should('exist');
  });
});
