import React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'antd';

import './Results.scss';
import { TeamInterface } from '../../interfaces';
interface ResultsProps {
  team1: TeamInterface,
  team2: TeamInterface
  className?: string,
}
const Results: React.FC<ResultsProps> = ({ team1, team2, className, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );

  console.log(team1)

  return (
    <>
      <Row className={classes} {...props}>
        <Col span={24}>
          Matchup
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <span className='teamName'>{team1?.name}</span>
          <img className='teamLogo' src={team1?.logoUrl}/>
        </Col>
        <Col span={12}>
          <span className='teamName'>{team2?.name}</span>
          <img className='teamLogo' src={team2?.logoUrl}/>
        </Col>
      </Row>
    </>
  );
};

export default Results;
