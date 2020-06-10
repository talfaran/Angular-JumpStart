describe("new order screen", () => {
    beforeEach(() => {
      // If we're logged in ensure we log out
      cy.visit("/orders/new");

    });
  
    it("should select customer", () => {
      cy.get('#dropdown-input').type('test@test.com');

    });

    // it("should show errors with invalid email or password", () => {
    //     const emailSelector = '[name="email';
    //     const passwordSelector = '[name="password"]';
    //     cy.get(emailSelector).type('test');
    //     cy.get(emailSelector).blur();
    //     cy.get('[data-cy="email-error"]').should('contain', 'A valid email address is required');
    //     cy.get(passwordSelector).type('pwd');
    //     cy.get(passwordSelector).blur();
    //     cy.get('[data-cy="password-error"]').should('contain', 'Password is required');
    // });
    
  });