import React, { useState, useEffect } from 'react';
import { Results, GameList } from '../components';
import { TeamInfoInterface } from '../interfaces';
import { getParams } from '../utils';

import './Matchup.scss';

const Matchup: React.FC = () => {

  const [team1Info, setTeam1Info] = useState<TeamInfoInterface>();
  const [team2Info, setTeam2Info] = useState<TeamInfoInterface>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTeamData(id: string, whichTeam: string) {
    const logoRes = await fetch(`http://barnburner-backend.herokuapp.com/team/logo/${id}`);
    const logoData = await logoRes.json();

    const teamRes = await fetch(`http://barnburner-backend.herokuapp.com/team/${id}`);
    const teamData = await teamRes.json();

    console.log(id)

    switch(whichTeam) {
      case '1':
        setTeam1Info({ id, ...logoData, ...teamData });
        break;
      case '2':
        setTeam2Info({ id, ...logoData, ...teamData });
        break;
    }
  }

  useEffect(() => {
    fetchTeamData(getParams('team1'), '1');
    fetchTeamData(getParams('team2'), '2');
  },[])

  if(isError) { return <span> error </span> }
  if(isLoading) { return <span> loading </span> }
  if(!team1Info || !team2Info) { return <span> loading </span> }

  return (
    <div className='Matchup'>
      <Results team1={team1Info} team2={team2Info} />
      <GameList/>
    </div>
  );
}

export default Matchup;
