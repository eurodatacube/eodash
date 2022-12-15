describe('Indicator tests for GTIF', () => {
  // Overwriting baseurl when localhost is defined changing it to load race instance
  if (Cypress.config().baseUrl.includes('localhost')) {
    const { baseUrl } = Cypress.config();
    Cypress.config('baseUrl', baseUrl.replace('localhost', 'gtif.eox.world'));
  }
  it('testing indicator wind energy', () => {
    cy.visit('/');
    cy.get('#esa-menu > .esa-header__icon').click();
    /*
    TODO: Test is somehow loading incorrect theme list, needs to be fixed
    cy.get('.v-item-group > :nth-child(1)').click();
    cy.contains('Wind Energy').click();
    cy.get('v-input--range-slider').should('have.length', 3);
    */
  });
});
