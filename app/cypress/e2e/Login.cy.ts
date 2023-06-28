/// <reference types="cypress" />

describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login page', () => {
        cy.get('h1').contains('Se connecter');
        cy.get('p').contains(
            'Connecte-toi avec tes identifiants de l’université pour continuer à utiliser l’application'
        );
        cy.get('ion-label').contains('Email');
        cy.get('ion-label').contains('Mot de passe');
        cy.get('ion-button').contains('Se connecter');
        cy.get('ion-router-link').contains('Mot de passe oublié ?');
    });

    it('should allow user to enter email and password', () => {
        cy.get('ion-input[name="email"]').type('test@example.com').should('have.value', 'test@example.com');

        cy.get('ion-input[name="password"]').type('testpassword').should('have.value', 'testpassword');
    });

    //TODO: Update when logic will be up
    it('should submit the form', () => {
        cy.get('ion-input[name="email"]').type('test@example.com');

        cy.get('ion-input[name="password"]').type('testpassword');

        cy.get('ion-button').contains('Se connecter').should('be.visible');
    });

    //TODO: Change later with new url
    it('should navigate to forgot password page', () => {
        cy.get('ion-router-link').contains('Mot de passe oublié ?').click();
    });
});
