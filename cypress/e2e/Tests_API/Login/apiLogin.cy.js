
/**
 * Résumé des erreurs API courantes
 *
 * - 200 OK : La requête a réussi et le serveur retourne les données attendues.
 * - 400 Bad Request : La requête est mal formée (paramètres manquants, données invalides).
 * - 401 Unauthorized : L'utilisateur n'est pas authentifié, accès refusé sans un jeton valide.
 * - 405 Method Not Allowed : La méthode HTTP utilisée (GET, POST, etc.) n'est pas permise pour cette route. ??
 * - 500 Internal Server Error : Erreur interne du serveur, souvent causée par un problème côté serveur.
 * - 503 Service Unavailable : Le serveur est temporairement indisponible (par exemple, en raison de la maintenance).
 */

describe('Tests d’API', () => {

  it('Renvoie 401 pour un utilisateur inconnu lors de la connexion', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
        password: 'mauvaismdp',
      },
      failOnStatusCode: false, // Permet de gérer les erreurs sans que le test échoue immédiatement
    }).then((response) => {
      expect(response.status).to.equal(401); // Vérifie que le statut est 401 pour une connexion échouée
    });
  });

  it('Renvoie 200 pour un utilisateur connu lors de la connexion', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
        password: 'testtest',
      },
      failOnStatusCode: false, // Permet de gérer les erreurs sans que le test échoue immédiatement
    }).then((response) => {
      expect(response.status).to.equal(200); // Vérifie que le statut est 200 pour une connexion réussie
    });
  });


  it('Renvoie 400 si le champ username est manquant', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        password: 'testtest',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it('Renvoie 400 si le champ password est manquant', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it('Renvoie un jeton d’authentification pour un utilisateur valide', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
        password: 'testtest',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token'); // Vérifie que la réponse contient un jeton
    });
  });

});
