'use strict';

const config = require('./config.js');
const health = require('./health.js');
const logger = require('./logger.js');
const express = require('express');
const expressApp = express();
let server;

expressApp.get('/health', function(req, res) {
    health.runHealthChecks(res);
});

function start() {
    server = expressApp.listen(config.APP_PORT, config.APP_IP, function expressAppListen() {
        logger.info('Barn Burner API listening on %d', config.APP_PORT);
    });
}

function stop() {
    logger.info('Barn Burner API Server stopping');
    server.close();
}

module.exports.start = start;
module.exports.stop = stop;
