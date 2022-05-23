'use strict';

const bunyan = require('bunyan');
const config = require('./config.js');

let logger;

function initLogger() {
    const streams = [{stream: process.stdout, level: config.LOG_LEVEL}];
    return bunyan.createLogger({
        name: config.APP_NAME,
        level: config.LOG_LEVEL,
        streams: streams,
        serializers: {backend_error: bunyan.stdSerializers.err}
    });
}

function getLogger() {
    if (!logger) {
        logger = initLogger();
    }

    return logger;
}

module.exports = getLogger();
