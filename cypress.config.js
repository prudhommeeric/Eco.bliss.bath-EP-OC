const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'jsvfzr',
  e2e: {
    baseUrl: 'http://localhost:8080/#', // url du site à modifier apres relance de docker
    experimentalRunAllSpecs:true,
    baseUrlApi: 'http://localhost:8081', // url API
    setupNodeEvents(on, config) {
    },
  },
});
