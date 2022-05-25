import React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'antd';

import './GameList.scss';

interface GameListProps {
  className?: string,
}

const GameList: React.FC<GameListProps> = ({ className, ...props }) => {

  const classes = classNames(
    'GameList',
    className
  );


  return (
    <div className={classes} {...props}>
      <Row>
        <Col span={11}>
          <span> Home icon </span>
          <span> Home Name </span>
          <span> Home score </span>
        </Col>
        <Col span={2}>
          <span> vs </span>
        </Col>
        <Col span={11}>
          <span> Home score </span>
          <span> Home Name </span>
          <span> Home icon </span>
        </Col>
      </Row>
    </div>
  );
};

export default GameList;
