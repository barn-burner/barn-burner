'use strict';

const config = require('./config.js');
const logger = require('./logger.js');
const lifecycle = require('./lifecycle.js');
const api = require('./api.js');

// Log startup environment for debugging
logger.info('Running Barn Burner NHL API with config:', config);

// Validate the config
if (!config.validate()) {
    console.log('Invalid config.');
    logger.fatal({backend_error: 'Invalid config.'}, 'Invalid config.');
    lifecycle.shutdownGraceful();
}

lifecycle.setup(api);

// Start the API
logger.info('Starting Barn Burner NHL API');
try {
    api.start();
}
catch (err) {
    console.log('Starting API Failed:', err);
    logger.fatal({backend_error: err}, 'Starting API Failed.');
    lifecycle.shutdownGraceful();
}
