describe('Custom dashboards', () => {
  it('adds feature to custom dashboard', () => {
    cy.visit('/');
    cy.contains('GLOBAL INDICATORS').click();
    cy.contains('AIR QUALITY').click();
    cy.contains('ADD TO CUSTOM DASHBOARD').click();
    cy.contains('ADD').click();
    cy.contains('ADDED TO CUSTOM DASHBOARD').should('exist');
    cy.contains('CUSTOM DASHBOARD').click();
    cy.get('canvas').first().should('exist');
  });

  it('publishes a custom dashboard', () => {
    cy.contains('PUBLISH DASHBOARD').click();
    cy.get('[placeholder="Title"]').type('My custom dashboard');
    cy.get('[placeholder="Your interests"]').type('Health');
    cy.get('[placeholder="E-mail"]').type('whatever@eox.at');
    cy.contains('SUBMIT').click();
    cy.get('input').should('have.length', 2);
  });

  it('deletes a feature', () => {
    cy.visit('/dashboard');
    cy.get('.mdi-delete').first().click();
    cy.wait(2000);
    cy.get('canvas').should('have.length', 0);
  });
});
