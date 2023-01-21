/*
* Title: Routes
* Description: Application Routes
*/

// dependencis
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

const routes = {
    sample: sampleHandler,
}

module.exports = routes;