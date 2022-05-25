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
const logoURL = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';
const seasonStart = '2021-10-12';
const seasonEnd = '2022-06-01';

// =============================
// =============================
// Utility functions
const handleError = (error) => {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
    } else {
        console.log(error.message);
    }
};

// TODO: Should these endpoints grow too large
// They will need to be broken into individual controllers

// =============================
// =============================
// Health Checks
expressApp.get('/health', function (req, res) {
    health.runHealthChecks(res);
});

// =============================
// =============================
// Teams
expressApp.get('/teams', function (req, res) {
    let teamParams = req.query.teamId ? req.query.teamId : null;
    let teamQuery = teamParams ? `?teamId=${teamParams}` : '';
    request(
        `${baseURL}/teams${teamQuery}`,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                logger.debug(body);
                logger.info(`[${response.statusCode}] Request to /teams${teamQuery}`);
                let teamsJson = JSON.parse(body.toString());
                let formattedTeamsObj = {};
                teamsJson.teams.forEach(function(teamInfo) {
                    formattedTeamsObj[teamInfo.id] = formatTeamInfo(teamInfo);
                });
                let teamsSorted = [];
                if (teamParams) {
                    let teamSortOrder = teamParams.split(',');
                    teamSortOrder.forEach(function(teamId) {
                        teamsSorted.push(formattedTeamsObj[teamId]);
                    });
                } else {
                    teamsSorted = Object.values(formattedTeamsObj);
                }

                res.json(teamsSorted);
            } else {
                logger.error(`[${response.statusCode}] Request to /teams${teamQuery}: ${error}`);
                res.json({ err: error, response: response, body: body });
            }
        }
    );
});

function formatTeamInfo(allTeamInfo) {
    let teamInfo = {
        id: allTeamInfo.id,
        name: allTeamInfo.name,
        abbreviation: allTeamInfo.abbreviation,
        teamName: allTeamInfo.teamName,
        locationName: allTeamInfo.locationName,
        logoUrl: `${logoURL}${allTeamInfo.id}.svg`
    };
    return teamInfo;
}

// =============================
// =============================
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

// Returns a win / loss object for a given two team matchup
function getMatchupStats(matchups, idOne, idTwo) {
    let ratio = {
        [idOne]: {
            overall: {
                wins: 0, losses: 0
            },
            home: {
                wins: 0, losses: 0
            },
            away: {
                wins: 0, losses: 0
            }
        },
        [idTwo]: {
            overall: {
                wins: 0, losses: 0
            },
            home: {
                wins: 0, losses: 0
            },
            away: {
                wins: 0, losses: 0
            }
        }
    };
    if (matchups.length > 0) {
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
        });
        return ratio;
    } else {
        return ({ err: 'Team data could not be processed' });
    }
}

async function getCompareSchedules(teamOne, teamTwo, start, end) {
    const sharedSchedule = (
        await axios.get(
            `${baseURL}/schedule?teamId=${teamOne},${teamTwo}&startDate=${start}&endDate=${end}&gameType=R,P`
        ).catch(err => handleError(err))
    );
    if (sharedSchedule) {
        return sharedSchedule.data;
    } else {
        return ({ error: 'could not fetch team data' });
    }
}

function getScheduleMatchups(schedule, idOne, idTwo) {
    let matchups = [];
    if (schedule.dates.length > 0) {
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
    }

    return matchups;
}

// =============================
// =============================
// Games
// Get specific game by ID
expressApp.get('/game/:gameid', async (req, res) => {
    let gameURL = `/game/${req.params.gameid}/feed/live`;
    let gameRequest = await axios.get(`${baseURL}${gameURL}`).catch(err => handleError(err));
    if (gameRequest && gameRequest.status === 200) {
        logger.debug(gameRequest.data);
        logger.info(`[${gameRequest.status}] Request to ${gameURL} ${gameRequest.statusText}`);
        res.json(gameRequest.data);
    } else {
        logger.error(`[XXX] Request to ${gameURL} failed`);
        res.json({ err: 'Failure retrieving game' });
    }
});

// =============================
// =============================
// Express Server Main Functions
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
