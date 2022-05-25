import React from 'react';
import classNames from 'classnames';
import { Card, Row, Col } from 'antd';

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

  return (
    <>
      <Row justify="center">
        <Col xs={24} sm={24} md={20} lg={16}>
          <Card className="resultsCard" title="MATCHUP">
            <Row gutter={24} justify="center" align="middle">
              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <Card
                  // bordered={false}
                  type="inner" 
                  title={team1?.name} 
                  className="teamCard"
                >
                  <img src={team1?.logoUrl} />
                </Card>
              </Col>
              <Col xs={2} sm={2} md={2} lg={2} xl={2} className="vs">
                <img src={"/vs.png"} />
              </Col>
              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <Card
                  // bordered={false}
                  type="inner" 
                  title={team2?.name} 
                  className="teamCard"
                >
                  {<img src={team2?.logoUrl} />}
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
