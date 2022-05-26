'use strict';

const config = require('./config.js');
const health = require('./health.js');
const logger = require('./logger.js');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const expressApp = express();
expressApp.use(cors());
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
        logger.error({ data: error.response.data, status: error.response.status });
    } else {
        logger.error(error.message);
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
expressApp.get('/teams', async (req, res) => {
    let teamParams = req.query.teamId ? req.query.teamId : null;
    let teamQuery = teamParams ? `?teamId=${teamParams}` : '';
    let teamsRequest = await axios.get(`${baseURL}/teams${teamQuery}`).catch(err => handleError(err));
    if (teamsRequest && teamsRequest.status === 200) {
        logger.debug(teamsRequest.data);
        logger.info(`[${teamsRequest.status}] Request to /teams${teamQuery} ${teamsRequest.statusText}`);
        let teamsJson = teamsRequest.data;
        let formattedTeamsObj = {};
        teamsJson.teams.forEach(function (teamInfo) {
            formattedTeamsObj[teamInfo.id] = formatTeamInfo(teamInfo);
        });
        let teamsSorted = [];
        if (teamParams) {
            let teamSortOrder = teamParams.split(',');
            teamSortOrder.forEach(function (teamId) {
                teamsSorted.push(formattedTeamsObj[teamId]);
            });
        } else {
            teamsSorted = Object.values(formattedTeamsObj);
            // Sort alphabetically
            teamsSorted.sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }

        res.json(teamsSorted);
    } else {
        logger.error(`[XXX] Request to /teams${teamQuery} failed`);
        res.json({ err: 'Failure retrieving teams' });
    }
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
// Get Team logos
expressApp.get('/team/logo/:teamid', function (req, res) {
    res.json({ url: constructTeamLogoURL(req.params.teamid) });
});

function constructTeamLogoURL(teamid) {
    return logoURL + teamid + '.svg';
}

// GET request for matchup details between two teams. Does not return
// overall win / loss like h2h
expressApp.get('/matchup/:one-:two', async (req, res) => {
    let teamOne = (+req.params.one);
    let teamTwo = (+req.params.two);
    let start = req.query.start ? req.query.start : seasonStart;
    let end = req.query.end ? req.query.end : seasonEnd;
    let sharedSchedule = await getCompareSchedules(teamOne, teamTwo, start, end);
    let matchups = getScheduleMatchups(sharedSchedule, teamOne, teamTwo);
    let metadata = getMatchupMetadata(matchups);

    res.json(metadata);
});

// Returns specifc metadata about a given matchup
function getMatchupMetadata(matchups) {
    let gameMetadata = [];
    console.log(matchups);
    console.log(matchups.length);
    if (matchups.length > 0) {
        matchups.map((match) => {
            let homeTeam = match.teams.home;
            let awayTeam = match.teams.away;
            let winner = (homeTeam.score > awayTeam.score) ? homeTeam : awayTeam;

            gameMetadata.push({
                gameId: match.gamePk,
                gameDate: match.gameDate,
                winnerId: winner.team.id,
                home: {
                    id: homeTeam.team.id,
                    score: homeTeam.score,
                },
                away: {
                    id: awayTeam.team.id,
                    score: awayTeam.score,
                }
            });
        });
        return gameMetadata;
    } else {
        return ({ err: 'Matchup data could not be processed' });
    }
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
    }

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
        // Lets us maintain the correct order of the array. Id one is always [0] and id two is always [1]
        let finalScores = [];
        finalScores.push(ratio[idOne]);
        finalScores.push(ratio[idTwo]);
        return finalScores;
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
        res.json({ err: `Failure retrieving game ${req.params.gameid}` });
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
