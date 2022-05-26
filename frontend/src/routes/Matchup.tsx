import React, { useState, useEffect } from 'react';
import { Results, GameList } from '../components';
import { TeamsInterface, h2hInterface } from '../interfaces';
import { getParams, getDateParams } from '../utils';

import './Matchup.scss';

const Matchup: React.FC = () => {

  const [data, setData] = useState<TeamsInterface>();
  const [record, setRecord] = useState<h2hInterface[]>()
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const startDate = getDateParams('start');
  const endDate = getDateParams('end');
  const team1 = getParams('team1');
  const team2 = getParams('team2');

  async function fetchTeamData(team1ID: string, team2ID: string) {
    const res = await fetch(`https://barnburner-backend.herokuapp.com/teams?teamId=${team1ID},${team2ID}`);

    if(res.ok) {
      const data = await res.json();
      setData(data);
    } else {
      setIsError(true);
    }

    setIsLoading(false);
  }

  async function fetchOverallRecord(team1ID: string, team2ID: string, startDate?: string, endDate?: string) {
    const baseUrl = `https://barnburner-backend.herokuapp.com/h2h/`;
    const teamUrl = `${team1ID}-${team2ID}`;
    const dateUrl = `?start=${startDate}&end=${endDate}`;

    const res = await fetch(`${baseUrl}${teamUrl}${startDate ? dateUrl : ''}`);
    if(res.ok) {
      const data = await res.json();
      setRecord(data);
    } else {
      setIsError(true);
    }
  }

  useEffect(() => {
    fetchTeamData(team1, team2);
    fetchOverallRecord(team1, team2, startDate, endDate);
  },[])

  if(isError) { return <span> error </span> }
  if(isLoading || !data || !record) { return <span> loading </span> }

  return (
    <div className='Matchup'>
      <Results team1={data[0]} team2={data[1]} team1Record={record[0].overall} team2Record={record[1].overall}/>
      <GameList team1={data[0]} team2={data[1]} startDate={startDate} endDate={endDate}/>
    </div>
  );
}

export default Matchup;
