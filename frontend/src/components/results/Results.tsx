import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Row, Col } from 'antd';
import { getParams } from '../../utils';

import './Results.scss';
interface ResultsProps {
  className?: string,
}

interface TeamInfo {
  abbreviation: string,
  id: string,
  locationName: string,
  name: string,
  teamName: string,
  url: string
}

const Results: React.FC<ResultsProps> = ({ className, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );

  const [team1Info, setTeam1Info] = useState<TeamInfo>();
  const [team2Info, setTeam2Info] = useState<TeamInfo>();
  const [isError, setIsError] = useState(false);

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

  return (
    <>
      <Row className={classes} {...props}>
        <Col span={24}>
          Matchup
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <span className='teamName'>{team1Info?.name}</span>
          <img className='teamLogo' src={team1Info?.url}/>
        </Col>
        <Col span={12}>
          <span className='teamName'>{team2Info?.name}</span>
          <img className='teamLogo' src={team2Info?.url}/>
        </Col>
      </Row>
    </>
  );
};

export default Results;
