'use strict';

const config = require('./config.js');
const health = require('./health.js');
const logger = require('./logger.js');
const express = require('express');
const request = require('request');
const axios = require('axios');
const expressApp = express();
let server;

const baseURL = 'https://statsapi.web.nhl.com/api/v1';

// TODO: Should these endpoints grow too large
// They will need to be broken into individual controllers

// =============
// Health Checks
expressApp.get('/health', function (req, res) {
    health.runHealthChecks(res);
});

// =============
// Teams
expressApp.get('/teams', function (req, res) {
    request(
        'https://statsapi.web.nhl.com/api/v1/teams',
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                logger.info(body);
                res.json(body);
            } else {
                res.json({ err: error, response: response, body: body });
            }
        }
    );
});

// /h2h/CAR-NYR or 12-7 ?
expressApp.get('/h2h/:one-:two', async (req, res) => {
    let teamOne = (+req.params.one);
    let teamTwo = (+req.params.two);
    let sharedSchedule = await getCompareSchedules(teamOne, teamTwo);
    let matchups = getScheduleMatchups(sharedSchedule, teamOne, teamTwo);

    res.json(matchups);
});

async function getCompareSchedules(teamOne, teamTwo) {
    const sharedSchedule = (
        await axios.get(
            `${baseURL}/schedule?teamId=${teamOne},${teamTwo}&season=20212022&expand=schedule.linescore&gameType=R,P`
        )
    ).data;
    return sharedSchedule;
}

function getScheduleMatchups(schedule, idOne, idTwo) {
    let matchups = [];
    schedule.dates.map((date) => {
        date.games.map((game) => {
            if (
                game.teams.away.team.id === idOne &&
                game.teams.home.team.id === idTwo
            ) {
                matchups.push(game);
            }

            if (
                game.teams.away.team.id === idTwo &&
                game.teams.home.team.id === idOne
            ) {
                matchups.push(game);
            }
        });
    });
    return matchups;
}

function start() {
    server = expressApp.listen(
        config.APP_PORT,
        config.APP_IP,
        function expressAppListen() {
            logger.info('Barn Burner API listening on %d', config.APP_PORT);
        }
    );
}

function stop() {
    logger.info('Barn Burner API Server stopping');
    server.close();
}

module.exports.start = start;
module.exports.stop = stop;
