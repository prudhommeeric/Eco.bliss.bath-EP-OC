describe('Authentification via interface utilisateur', () => {

  it('Effectue une connexion et vérifie les éléments après connexion', () => {
    cy.visit('/'); // Visite la page d'accueil

    // Vérifie que le bouton Inscription est visible et vérifie son label
    cy.get('[data-cy="nav-link-register"]')
      .should('be.visible') // Vérifie que le bouton Inscription est visible
      .should('have.text', 'Inscription'); // Vérification du label 

    // Vérifie que le bouton Connexion est visible et vérifie son label
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible') // Vérifie que le bouton Connexion est visible
      .should('have.text', 'Connexion'); // Vérification du label 

    cy.get('[data-cy="nav-link-login"]').click(); // Clique sur connexion
    cy.url().should('include', '/login'); // Vérifie l’URL de la page de connexion

    // Vérifie que le formulaire  est visible
    cy.get('[data-cy="login-form"]').should('be.visible');


    // Saisie des informations de connexion
    cy.get('[data-cy="login-input-username"]').should('be.visible').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').should('be.visible').type('testtest');
    cy.get('[data-cy="login-submit"]').should('be.visible').click();

    // Vérifie les éléments après connexion
    cy.get('[data-cy="nav-link-cart"]').should('be.visible'); // Vérifie que le bouton Mon panier est visible
    cy.get('[data-cy="nav-link-logout"]').should('be.visible'); // Vérifie que le bouton de déconnexion est visible
    cy.get('[data-cy="nav-link-login"]').should('not.exist'); // Vérifie l'absence du bouton de connexion
    cy.get('[data-cy="nav-link-register"]').should('not.exist'); // Vérifie l'absence du bouton Inscription
  });

});
