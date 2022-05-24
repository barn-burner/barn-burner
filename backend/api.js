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
const seasonStart = '2021-10-12';
const seasonEnd = '2022-06-01';

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
        `${baseURL}/teams`,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                logger.info(body);
                res.json(JSON.parse(body.toString()));
            } else {
                res.json({ err: error, response: response, body: body });
            }
        }
    );
});

// =============
// Head to Head
// Ex: 12-7 (BUF vs CAR)
// ?start=<YYYY-MM-DD>&end=<YYYY-MM-DD>
// If no start/end date specified then defaults to current season
expressApp.get('/h2h/:one-:two', async (req, res) => {
    let teamOne = (+req.params.one);
    let teamTwo = (+req.params.two);
    let start = req.query.start ? req.query.start : seasonStart;
    let end = req.query.end ? req.query.end : seasonEnd;
    let sharedSchedule = await getCompareSchedules(teamOne, teamTwo, start, end);
    let matchups = getScheduleMatchups(sharedSchedule, teamOne, teamTwo);

    let matchupStats = getMatchupStats(matchups, teamOne, teamTwo);

    res.json(matchupStats);
});

function getMatchupStats(matchups, idOne, idTwo) {
    let ratio = {
        [idOne]: {
            "overall": {
                "wins": 0, "losses": 0,
            },
            "home": {
                "wins": 0, "losses": 0,
            },
            "away": {
                "wins": 0, "losses": 0,
            }
        },
        [idTwo]: {
            "overall": {
                "wins": 0, "losses": 0,
            },
            "home": {
                "wins": 0, "losses": 0,
            },
            "away": {
                "wins": 0, "losses": 0,
            }
        }
    };
    matchups.map((match) => {
        let homeTeam = match.teams.home;
        let awayTeam = match.teams.away;
        if (homeTeam.score > awayTeam.score) {
            // home team wins, away team loses
            ratio[homeTeam.team.id].home.wins++;
            ratio[awayTeam.team.id].away.losses++;
        } else {
            // away team wins, home team loses
            ratio[awayTeam.team.id].away.wins++;
            ratio[homeTeam.team.id].home.losses++;
        }

        // Overall = home + away wins and losses
        ratio[idOne].overall.wins = ratio[idOne].home.wins + ratio[idOne].away.wins;
        ratio[idOne].overall.losses = ratio[idOne].home.losses + ratio[idOne].away.losses;

        // The second team is the inverse of the first
        ratio[idTwo].overall.wins = ratio[idOne].overall.losses;
        ratio[idTwo].overall.losses = ratio[idOne].overall.wins;
    })
    return ratio
}

async function getCompareSchedules(teamOne, teamTwo, start, end) {
    const sharedSchedule = (
        await axios.get(
            `${baseURL}/schedule?teamId=${teamOne},${teamTwo}&startDate=${start}&endDate=${end}&gameType=R,P`
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

// =============
// Get specific game by ID
expressApp.get('/game/:gameid', async (req, res) => {
    request(
        `${baseURL}/game/${req.params.gameid}/feed/live`,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                logger.info(body);
                res.json(JSON.parse(body.toString()));
            } else {
                res.json({ err: error, response: response, body: body });
            }
        }
    );
});

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
