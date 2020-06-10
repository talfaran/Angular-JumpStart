describe('new order screen', () => {

    it('should select customer', () => {
        cy.visit('/orders/new');
        cy.get('#dropdown-input').type('te');
        cy.clock();
        cy.tick(250);
        cy.get('.dropdown-panel').children().should('contain', 'ted james');
        cy.get('.dropdown-panel > div').first().click();
    });

    it('should add orders, only is customer valid', () => {
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

    it('should allow to submit', () => {
        cy.get('[data-cy=button-submit]').click();
        cy.url().should('not.contain', '/orders/new');
    });

});
