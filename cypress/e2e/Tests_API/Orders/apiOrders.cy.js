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

const { loginApi } = require('../../utils'); // Import de la fonction loginApi depuis utils.js

let token; // Variable pour stocker le token

describe('Tests d’API Orders', () => {

    before('Passage en mode connecté', () => {
        // Appel de la fonction loginApi pour récupérer le token
        loginApi().then((responseToken) => {
            token = responseToken; // Stocke le token pour les tests suivants
        });
    });

    it('Refuse l\'accès au panier si l\'utilisateur n\'est pas authentifié', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            failOnStatusCode: false,
        }).then((response) => {
            // Vérifie que le statut de la réponse est 401 (Unauthorized)
            expect(response.status).to.equal(401);


        });
    });

    it("Requête sur les données confidentielles d'un utilisateur avant connexion pour vérifier que je reçois une erreur 403", () => {
        // Envoi d'une requête avec un faux token
        const fakeToken = 'fakeToken123';

        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            failOnStatusCode: false, // Pour que Cypress ne considère pas le test comme échoué avec un 403
            headers: {
                Authorization: `Bearer ${fakeToken}`,
            },
        }).then((response) => {
            expect(response.status).to.equal(403); // Vérification du code 403
            expect(response.body).to.have.property('message').and.to.equal('Forbidden');
        });
    });

    it('Requête de la liste des produits du panier', () => {
        // Utilisation de loginApi pour obtenir le token
        loginApi().then((token) => {

            // Utiliser le token pour la requête suivante
            cy.request({
                method: 'GET',
                url: 'http://localhost:8081/orders',
                headers: {
                    Authorization: `Bearer ${token}`, // Authentification avec le token
                },
            }).then((response) => {
                expect(response.status).to.equal(200); // Vérifie que le statut est 200

                // Affiche le contenu de la réponse dans la console pour vérification
                cy.log('Contenu du panier:', JSON.stringify(response.body, null, 2));

                // Extraire les lignes de commande et effectuer les vérifications
                const orderLines = response.body.orderLines;
                expect(orderLines).to.be.an('array').and.to.have.length.greaterThan(0); // Vérifie que orderLines est un tableau non vide

                orderLines.forEach((orderLine) => {
                    expect(orderLine).to.have.property('product');
                    expect(orderLine.product).to.have.property('name').that.is.a('string');
                    expect(orderLine.product).to.have.property('description').that.is.a('string');
                    expect(orderLine.product).to.have.property('price').that.is.a('number');
                    expect(orderLine.product).to.have.property('picture').that.is.a('string');
                    expect(orderLine).to.have.property('quantity').that.is.a('number');
                });
            });
        });
    });

    it('Requête d’une fiche produit spécifique', () => {
        const productId = 3; // ID du produit testé
        cy.request({
            method: 'GET',
            url: `http://localhost:8081/products/${productId}`,
            failOnStatusCode: false, // Ne pas échouer sur les codes d'erreur
        }).then((response) => {
            expect(response.status).to.equal(200); // Vérifie que le statut est 200,  confirmation que me produit est trouvé et retourné
            expect(response.body).to.have.property('id', productId); // Vérifie que les information du produit corresponde a l'ID indiqué

        });
    });

    it('Ajouter un produit disponible au panier', () => {
        loginApi().then((token) => {
            const availableProduct = {
                product: 8,  // L'ID du produit 
                quantity: 1, // La quantité souhaitée
            };

            cy.request({
                method: 'PUT',
                url: 'http://localhost:8081/orders/add',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: availableProduct,
            }).then((response) => {
                expect(response.status).to.equal(200);  // Vérifie que la réponse est correcte
            });
        });

        
      

    });

    it('Ajouter un produit en rupture de stock au panier', () => {
        loginApi().then((token) => {
            const outOfStockProduct = {
                product: 3,   // ID du produit en rupture de stock
                quantity: 1,  // Quantité souhaitée (même si le produit est en rupture)
            };

            cy.request({
                method: 'PUT',
                url: 'http://localhost:8081/orders/add',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: outOfStockProduct,
                failOnStatusCode: false,  // Ne pas échouer automatiquement en cas de 4xx ou 5xx
            }).then((response) => {
                expect(response.status).to.equal(400);  // Vérifie que la réponse est une erreur 400 (Bad Request)
                expect(response.body.error.product).to.include("Rupture de stock");  // Vérifie le message d'erreur spécifique
            });
        });
});
});
