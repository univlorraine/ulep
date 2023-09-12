/// <reference types="cypress" />

describe('HomePage Content', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('renders the bubble image', () => {
        cy.get('img[alt="bubble"]').should('be.visible');
    });

    it('renders the welcome text', () => {
        cy.contains('Bienvenue sur (e)Tandem,').should('be.visible');
        cy.contains('le meilleur moyen de pratiquer une langue').should('be.visible');
    });

    it('renders the button', () => {
        cy.get('.button').should('be.visible');
        cy.contains('Apprends une nouvelle langue en tandem').should('be.visible');
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
