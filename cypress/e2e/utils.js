// utils.js

// Fonction pour la connexion via l'interface utilisateur
export const login = () => {
    cy.visit('/login');

    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');

    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
};

// Fonction pour la connexion via l'API
export const loginApi = () => {
    return cy.request({
        method: 'POST',
        url: 'http://localhost:8081/login',
        body: {
            username: 'test2@test.fr',
            password: 'testtest',
        },
        failOnStatusCode: false,
    }).then((response) => {
        console.log('Réponse de loginApi:', response); // Log pour le débogage
        expect(response.status).to.equal(200);
        return response.body.token; // Récupère et renvoie le token d'authentification
    });
};

// Fonction pour la connexion via l'API et suppression du contenu du panier
export const loginAndClearCart = () => {
    // Connexion via l'API
    return cy.request({
        method: 'POST',
        url: 'http://localhost:8081/login',
        body: {
            username: 'test2@test.fr',
            password: 'testtest',
        },
        failOnStatusCode: false,
    }).then((response) => {
        cy.wait(1000); // Délai d'attente après la connexion
        console.log('Réponse de loginAndClearCart:', response); // Log pour le débogage

        expect(response.status).to.equal(200);
        const token = response.body.token; // Récupère et stocke le token d'authentification

        // Vérification de la présence du token
        expect(token).to.exist;

        // Récupération des produits dans le panier
        return cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            headers: { Authorization: `Bearer ${token}` },
        }).then((getResponse) => {
            cy.wait(1000); // Délai d'attente après la récupération des produits
            console.log('Réponse de récupération du panier:', getResponse); // Log pour le débogage

            expect(getResponse.status).to.equal(200);

            const orderLines = getResponse.body.orderLines; // extrait le tableau des articles du panier 

            if (orderLines.length > 0) {
                // Supprimer chaque produit du panier de manière séquentielle
                const deleteRequests = orderLines.map((productLine) => {
                    return cy.request({
                        method: 'DELETE',
                        url: `http://localhost:8081/orders/${productLine.id}/delete`,
                        headers: { Authorization: `Bearer ${token}` },
                        failOnStatusCode: false,
                    }).then((deleteResponse) => {
                        cy.wait(500); // Délai entre chaque suppression
                        console.log('Réponse de suppression du produit:', deleteResponse); // Log pour le débogage
                        expect(deleteResponse.status).to.equal(200);
                    });
                });

                // Retourner une promesse pour s'assurer que toutes les suppressions sont terminées
                return Cypress.Promise.all(deleteRequests);
            } else {
                console.log('Le panier est vide, rien à supprimer.'); // Log si le panier est vide
            }
        });
    });
};
