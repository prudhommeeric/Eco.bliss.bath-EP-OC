# Eco Bliss Bath

Boutique en ligne, permet d'acheter des produits de beauté écoresponsables dont le produit principal est un savon solide

## Installation

### **Pré-requis**

- Node.js v20.18.0 (ou supérieur).
- Yarn ou Npm (gestionnaire de paquets).

### **Étapes d'installation**

**1. Téléchargez ou cloner le dépôt du projet** :
`git clone https://github.com/prudhommeeric/Eco.bliss.bath-EP-OC.git`

**2. Installer les dépendances** :
`npm install`

**3. Lancer le projet en mode développement** :
`npm start`

**4. Installation de Docker** :
`sudo docker-compose up --build`

**5. Installation de Cypress** :
`npm install cypress --save-dev `

## Structure du dossier Cypress

Voici l'organisation des dossiers et fichiers utilisés pour les tests avec Cypress dans ce projet :

- `cypress/e2e/Tests_API`:
  - Contient les tests automatisés pour les appels API.
- `cypress/e2e/Test_4-Panier.cy.js`:
  - Test spécifique pour la vérification de l’ajout et du retrait de produits, de la mise à jour des stocks, et des limites de quantité..
- `cypress/e2e/Test_5-Smoke-tests.cy.js`:

  - Vérification rapide des composants de base (boutons et champs principaux).

- `cypress/e2e/Test-2-Connexion.cy.js`:

  - Test spécifique pour la vérification de la connexion avec des identifiants valides et invalides.

- `cypress/e2e/utils.js`:

  - Fichier contenant des fonctions utilitaires réutilisables dans les tests (par exemple, gestion des requêtes ou manipulation de données).

- `cypress/e2e/screenshots`:

  - Dossier où sont enregistrées les captures d'écran prises lors des tests (généralement en cas d'erreurs).

- `cypress/e2e/support`:

  - Configuration et hooks pour personnaliser les tests.

- `cypress.config.js`:
  - Fichier principal de configuration Cypress (URLs, projectId, etc.).

## Lancement des tests

### **Avec Interface graphique de Cypress**:

Depuis un terminal ouvert dans le dossier du projet lancer la commande
`npx cypress open`

Une fois l'interface ouverte, sélectionnez le navigateur puis le test que vous souhaitez exécuter.

### **Mode non interactif**:

- Depuis un terminal ouvert dans le dossier du projet lancer la commande:
  `npx cypress run`

- Commande pour spécifier un autre navigateur pris en charge, comme Chrome:
  `npx cypress run --browser chrome`

## Enregistrer vos tests dans le cloud

Cypress offre une fonctionnalité permettant d'enregistrer vos tests dans le cloud, afin de suivre les résultats et de les analyser via leur interface web.

La clé de projet configurée (`jsvfzr`) est déjà incluse dans ce projet. Pour activer cette fonctionnalité, il vous suffit de lancer la commande suivante :
`npx cypress run --record`

Si vous souhaitez associer les résultats de tests à **votre propre compte Cypress**, vous pouvez remplacer la clé de projet par celle fournie dans votre tableau de bord Cypress. Utilisez alors la commande suivante :
`npx cypress run --record --key {YOUR_KEY}`

## Contribution

Libre à vous ! Vous pouvez créer des MR/PR qui seront acceptées et mergées selon l'utilité de la proposition

## Auteur

Eric PRUDHOMME : QA Engineer

## Historique des versions

- **Version 1.0.0**

## Contact

QA Engineer, Eric <= Contact prioritaire
QA testeuse, Marie
