Cypress.config('baseUrl', 'http://127.0.0.1:8080');

describe('Indicator tests for race', () => {
  it('test indicator chart', () => {
    cy.visit('/?poi=EG1-E200');
    cy.contains('Suez : Ships in Port').should('exist');
    cy.get('#bar-chart').should('exist');
  });
});
