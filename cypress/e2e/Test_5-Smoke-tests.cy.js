const { login } = require("./utils");

describe('Navigation tests', () => {

  it('vérification de la présence des champs et boutons de connexion', () => {
    // Visite la page d'accueil
    cy.visit('/login');

    //vérification de la présence des champs et boutons de connexion
    cy.get('[data-cy="login-input-username"]').should('be.visible'); //Champ Email
    cy.get('[data-cy="login-input-password"]').should('be.visible'); // Champ Mot de passe
    cy.get('[data-cy="login-submit"]').should('be.visible');// Bouton se connecter

  });

  it('vérifie la présence des boutons d’ajout au panier quand connecté', () => {

    // Appel de la fonction de connexion
    login();

    // Assurez-vous que la redirection après connexion s'est faite
    cy.url({ timeout: 10000 }).should('eq', Cypress.config('baseUrl') + '/');

    // Visitez la page des produits
    cy.visit('/products');

    // Cliquez sur le premier produit disponible
    cy.get('[data-cy="product-link"]').first().click();

    // Vérifiez que le bouton "Ajouter au panier" est visible dans la page du produit
    cy.get('[data-cy="detail-product-add"]').should('be.visible');
  });


  it('vérifie la présence du champ de disponibilité du produit', () => {
    // Visite la page du produit avec l'ID 3
    cy.visit('/products/3');

    // Vérifie que le champ de disponibilité du produit est visible
    cy.get('[data-cy="detail-product-stock"]').should('be.visible');
  });

});