
const { login, loginApi, loginAndClearCart } = require("./utils");


describe('Test du panier', () => {
  beforeEach(() => {
    // Appel fonction pour vider le pannier
    loginAndClearCart()

    // Connexion à l'application
    login();

  });

  it('Ajout d\'un produit au panier et vérification du stock', () => {

    // Visiter la page des produits
    cy.visit('/products');

    // Vérifiez que les produits sont chargés
    cy.get('[data-cy="product-link"]').should('have.length.greaterThan', 0);

    // Cliquez sur le 5ème produit
    cy.get('[data-cy="product-link"]').eq(5).click();

    // Ajoutez un délai
    cy.wait(1000);

    // Vérifiez que le stock est affiché et supérieur à 0
    cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
      const stockCount = parseInt(stockText, 10);
      expect(stockCount).to.be.greaterThan(0); // Vérifie que le stock est supérieur à 0

      // Ajoutez un délai
      cy.wait(1000);

      // Ajout du produit au panier si le stock est suffisant
      cy.get('[data-cy="detail-product-add"]').should('be.visible').click();

      // Vérifiez que le produit a été ajouté au panier
      cy.get('[data-cy="cart-line"]').should('exist');

      // Vérifiez que la quantité dans le panier est 1
      cy.get('[data-cy="cart-line-quantity"]')
        .should('exist')
        .and('have.value', '1'); // Vérifie que la valeur est "1"

      // Retournez sur la page du produit 
      cy.go('back');

      // Ajoutez un délai
      cy.wait(1000);

      // Verifie que le stock fait -1
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((newStock) => {
        expect(parseInt(newStock, 10)).to.equal(stockCount - 1);
      });

    });


  });
  it('vérifiez les limites avec un chiffre négatif', () => {
    // Visiter la page d’un produit spécifique
    cy.visit('/products/4');

    // Saisir un nombre négatif dans le champ de quantité
    cy.get('[data-cy="detail-product-quantity"]').clear().type('-1');

    // Cliquer sur le bouton "Ajouter au panier"
    cy.get('[data-cy="detail-product-add"]').should('be.visible').click();

    // Aller sur la page panier
    cy.visit('/cart');

    // Vérifiez que le panier est vide
    cy.contains('Votre panier est vide. Consultez nos produits.').should('be.visible');

    // Vérifiez que le bloc produit n'existe pas
    cy.get('[data-cy="cart-line"]').should('not.exist');
  });

  it('vérifiez les limites avec un chiffre supérieur à 20 ', () => {

    // Visiter la page des produits
    cy.visit('/products/4');

    // Saisir une quantité de 21 dans le champ de quantité
    cy.get('[data-cy="detail-product-quantity"]').clear().type('21');

    // Essayer de cliquer sur le bouton "Ajouter au panier"
    cy.get('[data-cy="detail-product-add"]').should('be.visible').click();

    // Visiter la page panier
    cy.url({ timeout: 10000 }).should('eq', Cypress.config('baseUrl') + '/cart');

    // Ajoutez un délai
    cy.wait(3000);

    // Vérifiez que le message "Votre panier est vide" est visible
    cy.get('[data-cy="cart-empty"]').should('be.visible');

    // Vérifiez que le bloc produit n'existe pas
    cy.get('[data-cy="cart-line"]').should('not.exist');

  });


  it("Ajout d'un produit au panier & vérification du contenu du panier via l’API", () => {

    // Interception de la requête produit
    cy.intercept("GET", "http://localhost:8081/products/8").as("productSheet");
  
    // Visiter la page des produits
    cy.visit("/products");
  
    // Cliquez sur le 5ème produit
    cy.get('[data-cy="product-link"]').eq(5).click();
  
    // Vérifier que la requête du produit a bien eu lieu
    cy.wait("@productSheet");
  
    // Ajouter le produit au panier
    cy.get('[data-cy="detail-product-add"]').should("be.visible").click();
  
    // Vérification de la redirection vers le panier
    cy.url({ timeout: 10000 }).should("include", "/cart");
  
    // Utilisation de l'API de login pour obtenir le token
    loginApi().then((token) => {
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        expect(response.status).to.equal(200);
  
        const orderLines = response.body.orderLines;
        expect(orderLines).to.be.an("array").and.to.have.length.greaterThan(0);
  
        // Vérification des propriétés des produits dans le panier
        orderLines.forEach((orderLine) => {
          expect(orderLine).to.have.property("product");
          expect(orderLine.product).to.include.keys("name", "description", "price", "picture");
          expect(orderLine).to.have.property("quantity").that.is.a("number");
        });
      });
    });
  });
  

});

