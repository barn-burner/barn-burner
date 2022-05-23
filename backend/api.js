'use strict';

const config = require('./config.js');
const health = require('./health.js');
const logger = require('./logger.js');
const express = require('express');
const request = require('request');
const expressApp = express();
let server;

// TODO: Should these endpoints grow too large
// They will need to be broken into individual controllers

// =============
// Health Checks
expressApp.get('/health', function(req, res) {
    health.runHealthChecks(res);
});

// =============
// Teams
expressApp.get('/teams', function(req, res) {
    request('https://statsapi.web.nhl.com/api/v1/teams', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            logger.info(body);
            res.json(body);
        } else {
            res.json({err: error, response: response, body: body});
        }
    });
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
