/// <reference types="cypress" />

describe('WelcomeContent component', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('renders the bubble image', () => {
        cy.get('img.bubble').should('be.visible');
    });

    it('renders the welcome text', () => {
        cy.contains('Bienvenue sur (e)Tandem,').should('be.visible');
        cy.contains('le meilleur moyen de pratiquer une langue').should('be.visible');
    });

    it('renders the button', () => {
        cy.get('.button').should('be.visible');
        cy.contains('Apprends une nouvelle langue en tandem').should('be.visible');
    });
});
