'use strict';

const config = require('./config.js');
const logger = require('./logger.js');

function setup(api) {
    // Handle SIGINT for gracefully shutting down
    ['SIGINT', 'SIGTERM', 'SIGQUIT']
    .forEach(signal => process.on(signal, () => close(api)));
}

async function close(api) {
    logger.info('API received signal to shut down.');

    // Flush/clear/stop anything that needs to be handled here
    api.stop();


    // Fail-safe shutdown
    shutdownTimeout();
}

function shutdownGraceful() {
    logger.info('Attempting to gracefully shutdown.');
    process.emit('SIGINT');
}

function shutdownHard() {
    logger.info('Process now force exiting.');
    process.exit(1);
}

function shutdownTimeout() {
    let timeoutId = setTimeout(shutdownHard, config.SHUTDOWN_TIMEOUT_MS);
    timeoutId.unref();
}

module.exports.setup = setup;
module.exports.shutdownGraceful  = shutdownGraceful;
module.exports.shutdownTimeout = shutdownTimeout;
