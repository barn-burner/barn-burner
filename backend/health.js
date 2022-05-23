'use strict';

const logger = require('./logger.js');

function goodHealth(res) {
    logger.debug('All health checks passed.');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
}

/*
Commenting this out for now to pass linting tests
Not currently used, but will be in the future
function badHealth(res, errorMsg) {
    logger.error('Health check failed with error:', errorMsg);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('BAD');
}
*/

async function runHealthChecks(res) {
    logger.debug('Getting Health for Barn Burner NHL API.');

    // TODO: Health checks

    // All checks passed
    goodHealth(res);
}

module.exports.runHealthChecks = runHealthChecks;
