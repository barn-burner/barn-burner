import React, { useState, useEffect } from 'react';
import { Results, GameList } from '../components';
import { TeamsInterface } from '../interfaces';
import { getParams } from '../utils';

import './Game.scss';

const Game: React.FC = () => {

  const [data, setData] = useState<TeamsInterface>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchGameData(gameId: string) {
    const res = await fetch(`https://barnburner-backend.herokuapp.com/game/${gameId}`);

    if(res.ok) {
      const data = await res.json();
      setData(data);
    } else {
      setIsError(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchGameData(getParams('id'));
  },[])

  console.log(data);

  if(isError) { return <span> error </span> }
  if(isLoading || !data) { return <span> loading </span> }

  return (
    <div className='Game'>
      game
    </div>
  );
}

export default Game;
