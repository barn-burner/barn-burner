import React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'antd';
import { useQuery } from '../../utils';

import './Results.scss';

interface ResultsProps {
  className?: string,
}

const Results: React.FC<ResultsProps> = ({ className, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );

  const team1 = useQuery('team1');
  const team2 = useQuery('team2');

  console.log(team1, team2);

  return (
    <>
      <Row className={classes} {...props}>
        <Col span={24}>
          Results
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {team1} logo
          {team1} name
        </Col>
        <Col span={12}>
          {team2} logo
          {team2} name
        </Col>
      </Row>
    </>
  );
};

export default Results;
