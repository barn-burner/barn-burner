import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import classNames from 'classnames';
import { Row, Col } from 'antd';

import './GameList.scss';

import { TeamInterface, SingleGameDataInterface } from '../../interfaces';
interface GameListProps {
  team1: TeamInterface,
  team2: TeamInterface
  className?: string,
}

const GameList: React.FC<GameListProps> = ({ team1, team2, className, ...props }) => {

  const classes = classNames(
    'GameList',
    className
  );

  const [data, setData] = useState<SingleGameDataInterface[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  async function fetchHistoricalMatchups(team1ID: string, team2ID: string) {
    const res = await fetch(`http://barnburner-backend.herokuapp.com/matchup/${team1ID}-${team2ID}`);
    if(res.ok) {
      const data = await res.json();
      setData(data);
    } else {
      setIsError(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchHistoricalMatchups(team1.id, team2.id);
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

  if(isError) { return <span> error </span> }
  if(isLoading || !data) { return <span> loading </span> }


  return (
    <div className={classes} {...props}>
      <Row>
        <Col span={24}> All matchups </Col>
      </Row>
      <Row className={classes} {...props}>
        <Col span={11}>
          Home
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          Away
        </Col>
      </Row>
      {
        data.map((game: SingleGameDataInterface, index: number) => {
            return(
              <Row key={index} onClick={() => goToGameDetails(game.gameId)}>
                <Col span={11} className={game.winnerId === game.home.id ? 'winner' : 'loser'}>
                  <img className='icon' src={generateIconFromId(game.home.id)}/>
                  <span className='teamName'>{generateNameFromId(game.home.id)}</span>
                  <span className='teamScore'>{game.home.score}</span>
                </Col>
                <Col span={2}>
                  <span className='vs'> - </span>
                </Col>
                <Col span={11} className={game.winnerId === game.away.id ? 'winner' : 'loser'}>
                  <span className='teamScore'>{game.away.score}</span>
                  <span className='teamName'>{generateNameFromId(game.away.id)}</span>
                  <img className='icon' src={generateIconFromId(game.away.id)}/>
                </Col>
              </Row>
            )
        }
      )}
    </div>
  );
};

export default GameList;
