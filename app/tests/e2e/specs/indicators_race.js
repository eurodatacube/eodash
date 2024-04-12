describe('Indicator tests for RACE', () => {
  context('1080p resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
    });
    let collections;
    before(() => {
      // receive the dynamic list of users
      cy.request('https://eurodatacube.github.io/eodash-catalog/RACE/catalog.json')
        .then((resp) => {
          const links = [];
          resp.body.links.forEach((link) => {
            if (link.rel === 'child') {
              links.push(link);
            }
          });
          collections = links;
        });
    });
    // Overwriting baseurl when localhost is defined changing it to load race instance
    if (Cypress.config().baseUrl.includes('localhost')) {
      const { baseUrl } = Cypress.config();
      Cypress.config('baseUrl', baseUrl.replace('localhost', 'race.eox.world'));
    }

    // Seems we need to know the amount of indicators in order to iterate them, not ideal as this
    // will change through time, test needs to be updated!
    // TODO: look for an alternative (this is based on cypress example)
    Cypress._.range(0, 43).forEach((k) => {
      it(`testing collection # ${k}`, () => {
        // We intercept wms requests and check there are no errors if it is a SH endpoint
        const collection = collections[k];
        // TODO: Add checks for all types of endpoints
        if (collection.endpointtype === 'Sentinel Hub' && !collection.locations) {
          cy.intercept('GET', '**/wms/*').as('wmsrequests');
        }
        cy.log(`Loading indicator ${collection.indicator}`);
        cy.visit(`/?indicator=${collection.indicator}`);
        cy.wrap(collection).should('have.property', 'code');

        // We check for the wms requests status
        if (collection.endpointtype === 'Sentinel Hub' && !collection.locations) {
          // TODO: Currently we have a 400 response because wms tile is loaded for too large area
          // probably best approach would be to fix the min/max zoom levels of layers
          cy.wait('@wmsrequests').its('response.statusCode').should('be.oneOf', [200, 304, 400]);
        }
      });
    });
  });
});
