'use strict';

const env = process.env;

let config = {
    // High-level App config
    APP_NAME: env.SERVICE_NAME || 'barn-burner',
    SHUTDOWN_TIMEOUT_MS: env.SHUTDOWN_TIMEOUT_MS || 10000,
    APP_IP: env.IP || '0.0.0.0',
    APP_PORT: env.PORT || 8000,
    // Logging
    LOG_LEVEL: env.LOG_LEVEL || 'INFO',
    // Expose function to validate the config settings
    validate: validate
};

function validate(useConfig = null) {
    if (!useConfig) {
        useConfig = config;
    }
    // TODO: Validate config

    return true;
}

module.exports = config;
