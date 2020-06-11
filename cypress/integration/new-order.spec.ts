describe('new order screen', () => {

    it('should select customer', () => {
        cy.visit('/orders/new');
        cy.get('#dropdown-input').type('te');
        cy.clock();
        cy.tick(250);
        cy.get('.dropdown-panel').children().should('contain', 'ted james');
        cy.get('.dropdown-panel > div').first().click();
    });

    it('should add orders, only if customer valid', () => {
        cy.visit('/orders/new');
        const addBtn = cy.get('[data-cy=order]');
        addBtn.should('have.class', 'disabled');
        cy.get('#dropdown-input').type('te');
        cy.clock();
        cy.tick(250);
        cy.get('.dropdown-panel').children().should('contain', 'ted james');
        addBtn.should('not.have.class', 'diabled');
        cy.get('.dropdown-panel > div').first().click();

        for (let i = 0; i < 5; i++) {
            cy.get('[data-cy=order]').click();
            cy.get(`#name${i}`).type('test' + i);
            cy.get(`#price${i}`).type('123');
        }
    });

    it('should test validation error texts', () => {
        cy.get('#dropdown-input').clear().blur();
        cy.get('span').contains('Picking a customer from the list is required');
        cy.get('#dropdown-input').clear().type('te');
        cy.clock();
        cy.tick(250);
        cy.get('.dropdown-panel').children().should('contain', 'ted james');
        cy.get('.dropdown-panel > div').first().click();
        cy.get(`#price4`).clear().blur();
        cy.get('span').contains('Price is required');
        cy.get(`#price4`).type('text').blur();
        cy.get('span').contains('Please use numbers only');
        cy.get(`#price4`).clear().type('123');
        cy.get(`#name4`).clear().blur();
        cy.get('span').contains('Name is required');
        cy.get(`#name4`).clear().type('just text');

    });

    it('should allow to submit', () => {
        cy.get('[data-cy=button-submit]').click();
        cy.url().should('not.contain', '/orders/new');
    });

});
