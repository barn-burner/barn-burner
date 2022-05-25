import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Row, Col } from 'antd';
import { getParams } from '../../utils';

import './Results.scss';
import { TeamInfoInterface } from '../../interfaces';
interface ResultsProps {
  team1: TeamInfoInterface,
  team2: TeamInfoInterface
  className?: string,
}
const Results: React.FC<ResultsProps> = ({ team1, team2, className, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );

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
          <img className='teamLogo' src={team1?.url}/>
        </Col>
        <Col span={12}>
          <span className='teamName'>{team2?.name}</span>
          <img className='teamLogo' src={team2?.url}/>
        </Col>
      </Row>
    </>
  );
};

export default Results;
