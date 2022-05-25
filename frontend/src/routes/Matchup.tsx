import React, { useState, useEffect } from 'react';
import { Results, GameList } from '../components';
import { TeamsInterface } from '../interfaces';
import { getParams } from '../utils';

import './Matchup.scss';

const Matchup: React.FC = () => {

  const [data, setData] = useState<TeamsInterface>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTeamData(team1ID: string, team2ID: string) {
    const res = await fetch(`http://barnburner-backend.herokuapp.com/teams?teamId=${team1ID},${team2ID}`);

    if(res.ok) {
      const data = await res.json();
      setData(data);
    } else {
      setIsError(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchTeamData(getParams('team1'), getParams('team2'));
  },[])

  if(isError) { return <span> error </span> }
  if(isLoading || !data) { return <span> loading </span> }

  console.log(data);

  return (
    <div className='Matchup'>
      <Results team1={data[0]} team2={data[1]} />
      <GameList/>
    </div>
  );
}

export default Matchup;
