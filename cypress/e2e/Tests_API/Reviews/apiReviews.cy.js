const { loginApi } = require('../../utils'); // Import de la fonction loginApi depuis utils.js

let token; // Variable pour stocker le token

describe('Tests d’API Orders', () => {

    before('Passage en mode connecté', () => {
        // Appel de la fonction loginApi pour récupérer le token
        loginApi().then((responseToken) => {
            token = responseToken; // Stocke le token pour les tests suivants
        });
    });

    describe('IAjouter un avis', () => {


        it('Ajoute un avis avec succès pour un utilisateur authentifié', () => {
            const now = new Date();
            const titleWithDate = `Titre Avis - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        
            cy.request({
                method: 'POST',
                url: 'http://localhost:8081/reviews',
                headers: {
                    Authorization: `Bearer ${token}`, // Utilise le token pour authentification
                },
                body: {
                    title: titleWithDate, // Titre unique avec date et heure
                    comment: 'Ceci est un commentaire d\'un utilisateur connecté..Eric.',
                    rating: '5',
                },
            }).then((response) => {
                expect(response.status).to.equal(200); // Vérifie que le statut est 200
                expect(response.body).to.have.property('title', titleWithDate); // Vérifie le contenu de la réponse
            });
        });
    });
});