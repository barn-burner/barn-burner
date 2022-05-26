import React from 'react';
import classNames from 'classnames';
import { Card, Divider, Row, Col } from 'antd';

import './Results.scss';
import { TeamInterface, h2hDetailsInterface } from '../../interfaces';
interface ResultsProps {
  team1: TeamInterface,
  team2: TeamInterface
  className?: string,
  team1Record: h2hDetailsInterface,
  team2Record: h2hDetailsInterface,
}
const Results: React.FC<ResultsProps> = ({ team1, team2, team1Record, team2Record, className, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );

  const generateRecordString = (record: h2hDetailsInterface) =>{
    return `${record.wins}-${record.losses}`;
  }

  const winner = team1Record.wins > team2Record.wins ? team1 : team2;
  console.log('winner', winner);

  return (
    <>
      <Row justify="center">
        <Col xs={22} sm={22} md={20} lg={16}>
          <Card className="resultsCard" title="MATCHUP!">
            <Row gutter={24} justify="center" align="middle">
              <Divider dashed />
              <Col xs={24} sm={24} md={10} lg={9} xl={9}>
                <Card
                  bordered={false}
                  type="inner" 
                  title={team1?.name} 
                  className="teamCard"
                >
                  <img src={team1?.logoUrl} />
                  <span className='record'> {generateRecordString(team1Record)} </span>
                </Card>
              </Col>
              <Col xs={3} sm={3} md={2} lg={2} xl={2} className="vs" >
                VS
              </Col>
              <Col xs={24} sm={24} md={10} lg={9} xl={9}>
                <Card
                  bordered={false}
                  type="inner" 
                  title={team2?.name} 
                  className="teamCard"
                >
                  {<img src={team2?.logoUrl} />}
                  <span className='record'> {generateRecordString(team2Record)} </span>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Results;
