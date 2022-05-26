import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import classNames from 'classnames';
import { Card, Row, Col } from 'antd';

import './GameList.scss';

import { TeamInterface, SingleGameDataInterface } from '../../interfaces';
interface GameListProps {
  team1: TeamInterface,
  team2: TeamInterface
  className?: string,
  startDate?: string,
  endDate?: string,
}

const GameList: React.FC<GameListProps> = ({ team1, team2, startDate, endDate, className, ...props }) => {

  const classes = classNames(
    'GameList',
    className
  );

  const [data, setData] = useState<SingleGameDataInterface[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  async function fetchHistoricalMatchups(team1ID: string, team2ID: string, startDate?: string, endDate?: string) {

    const baseUrl = `https://barnburner-backend.herokuapp.com/matchup/`;
    const teamUrl = `${team1ID}-${team2ID}`;
    const dateUrl = `?start=${startDate}&end=${endDate}`;

    const res = await fetch(`${baseUrl}${teamUrl}${startDate ? dateUrl : ''}`);
    if(res.ok) {
      const data = await res.json();
      setData(data);
    } else {
      setIsError(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchHistoricalMatchups(team1.id, team2.id, startDate, endDate);
  }, [])

  const generateNameFromId = (id: number) => {
    if(id.toString() == team1.id) {
      return team1.name;
    } else {
      return team2.name;
    }
  }

  const generateIconFromId = (id: number) => {
    if(id.toString() == team1.id) {
      return team1.logoUrl;
    } else {
      return team2.logoUrl;
    }
  }

  const goToGameDetails = (gameId: number) => {
    history.push(`/game?id=${gameId}`);
  }

  const isWinner = (winnerId: number, id: number) => {
    return winnerId === id ? true : false
  }

  const generateScore = (homeScore: number, awayScore: number, date: Date) => {

    const isFutureGame = date > new Date();

    return (
      <>
        <span className="teamScore"> {isFutureGame ? '-' : homeScore} </span>
        <span className="spacer"> </span>
        <span className="teamScore"> {isFutureGame ? '-' : awayScore}  </span>
      </>
    )
  }

  if(isError) { return <span> error </span> }
  if(isLoading || !data) { return <span> loading </span> }


  return (

    <Row justify="center">
      <Col xs={24} sm={24} md={20} lg={16}>
        <Card className="allMatchesCard">
          <div className={classes} {...props}>
            <Row className={classes} {...props}>
              <Col span={10}>
                <h1>HOME</h1>
              </Col>
              <Col span={4}></Col>
              <Col span={10} style={{ height: '10%' }} className="awayTeam">
                <h1>AWAY</h1>
              </Col>
            </Row>
            {
              data.map((game: SingleGameDataInterface, index: number) => {
                  return(
                    <Row key={index} onClick={() => goToGameDetails(game.gameId)} className='gameItem'>
                      <Col span={24} className="date"> {new Date(game.gameDate).toDateString()} </Col>
                      <Col span={10} className="home">
                        { isWinner(game.winnerId, game.home.id) && <span className="winner"> &gt;&gt; </span> }
                        <span className='teamName'>{generateNameFromId(game.home.id)}</span>
                        <img className='icon' src={generateIconFromId(game.home.id)}/>
                      </Col>
                      <Col span={4} className="vs">
                        { generateScore(game.home.score, game.away.score, new Date(game.gameDate)) }
                      </Col>
                      <Col span={10}>
                        <img className='icon' src={generateIconFromId(game.away.id)}/>
                        <span className='teamName'>{generateNameFromId(game.away.id)}</span>
                        { isWinner(game.winnerId, game.away.id) && <span className="winner"> &lt;&lt; </span> }     
                      </Col>
                    </Row>
                  )
              }
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default GameList;
