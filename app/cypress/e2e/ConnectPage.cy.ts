/// <reference types="cypress" />

describe('Connect Content', () => {
    beforeEach(() => {
        cy.viewport('iphone-8');
        cy.visit('/connect');
    });

    it('renders connect and signup buttons', () => {
        cy.contains('Se connecter');
        cy.contains('Créer un compte');
    });

    it('redirects when the connect button is clicked', () => {
        cy.contains('Se connecter').click();
        cy.url().should('include', '/login');
    });

    it('redirects when the signup button is clicked', () => {
        cy.contains('Créer un compte').click();
        cy.url().should('include', '/login'); // todo : must be changed when signup screen will be done
    });
});
